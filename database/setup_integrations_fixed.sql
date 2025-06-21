-- JanPulse Integrations Management Schema (UUID Compatible)
-- This schema manages third-party service integrations, usage tracking, and renewals
-- Fixed to use UUID consistently like the rest of your schema

-- Create integrations table to store service information
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'warning', 'error')),
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(10),
    monthly_cost DECIMAL(10,2) DEFAULT 0,
    api_endpoint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID -- Remove foreign key constraint for now to avoid compatibility issues
);

-- Create integration_subscriptions table for subscription management
CREATE TABLE IF NOT EXISTS integration_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    subscription_date DATE NOT NULL,
    renewal_date DATE NOT NULL,
    auto_renewal BOOLEAN DEFAULT true,
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
    plan_name VARCHAR(100),
    vendor_subscription_id VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integration_usage table for tracking monthly usage
CREATE TABLE IF NOT EXISTS integration_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    month_year DATE NOT NULL, -- First day of the month (e.g., '2024-12-01')
    monthly_limit INTEGER NOT NULL DEFAULT 0,
    current_usage INTEGER NOT NULL DEFAULT 0,
    usage_percentage DECIMAL(5,2) DEFAULT 0, -- Calculate this in application instead of generated column
    overage_amount INTEGER DEFAULT 0,
    overage_cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integration_features table for storing feature lists
CREATE TABLE IF NOT EXISTS integration_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    feature_description TEXT,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integration_alerts table for monitoring and notifications
CREATE TABLE IF NOT EXISTS integration_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('usage_warning', 'usage_critical', 'renewal_reminder', 'service_down', 'cost_threshold')),
    threshold_value DECIMAL(10,2), -- For usage percentage or cost thresholds
    is_enabled BOOLEAN DEFAULT true,
    notification_methods JSONB DEFAULT '["email"]', -- Array of notification methods
    last_triggered TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integration_costs table for detailed cost tracking
CREATE TABLE IF NOT EXISTS integration_costs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    month_year DATE NOT NULL,
    base_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    usage_cost DECIMAL(10,2) DEFAULT 0,
    overage_cost DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0, -- Calculate this in application instead of generated column
    currency VARCHAR(3) DEFAULT 'USD',
    invoice_number VARCHAR(100),
    invoice_date DATE,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integration_logs table for audit trail
CREATE TABLE IF NOT EXISTS integration_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    performed_by UUID, -- Remove foreign key constraint for now
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraints separately
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integrations_name_unique') THEN
        ALTER TABLE integrations ADD CONSTRAINT integrations_name_unique UNIQUE(name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_usage_unique') THEN
        ALTER TABLE integration_usage ADD CONSTRAINT integration_usage_unique UNIQUE(integration_id, month_year);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integration_costs_unique') THEN
        ALTER TABLE integration_costs ADD CONSTRAINT integration_costs_unique UNIQUE(integration_id, month_year);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);
CREATE INDEX IF NOT EXISTS idx_integrations_category ON integrations(category);
CREATE INDEX IF NOT EXISTS idx_integration_subscriptions_renewal ON integration_subscriptions(renewal_date);
CREATE INDEX IF NOT EXISTS idx_integration_usage_month ON integration_usage(month_year);
CREATE INDEX IF NOT EXISTS idx_integration_usage_percentage ON integration_usage(usage_percentage);
CREATE INDEX IF NOT EXISTS idx_integration_costs_month ON integration_costs(month_year);
CREATE INDEX IF NOT EXISTS idx_integration_logs_created ON integration_logs(created_at);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_integrations_updated_at ON integrations;
CREATE TRIGGER update_integrations_updated_at 
    BEFORE UPDATE ON integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integration_subscriptions_updated_at ON integration_subscriptions;
CREATE TRIGGER update_integration_subscriptions_updated_at 
    BEFORE UPDATE ON integration_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integration_usage_updated_at ON integration_usage;
CREATE TRIGGER update_integration_usage_updated_at 
    BEFORE UPDATE ON integration_usage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integration_alerts_updated_at ON integration_alerts;
CREATE TRIGGER update_integration_alerts_updated_at 
    BEFORE UPDATE ON integration_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integration_costs_updated_at ON integration_costs;
CREATE TRIGGER update_integration_costs_updated_at 
    BEFORE UPDATE ON integration_costs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create current month usage record
CREATE OR REPLACE FUNCTION ensure_current_month_usage()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO integration_usage (integration_id, month_year, monthly_limit, current_usage)
    VALUES (NEW.id, DATE_TRUNC('month', CURRENT_DATE), 0, 0)
    ON CONFLICT (integration_id, month_year) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_current_month_usage ON integrations;
CREATE TRIGGER create_current_month_usage 
    AFTER INSERT ON integrations 
    FOR EACH ROW EXECUTE FUNCTION ensure_current_month_usage();

-- Create function to calculate usage percentage
CREATE OR REPLACE FUNCTION calculate_usage_percentage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.monthly_limit > 0 THEN
        NEW.usage_percentage = (NEW.current_usage::DECIMAL / NEW.monthly_limit) * 100;
    ELSE
        NEW.usage_percentage = 0;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS calculate_usage_percentage_trigger ON integration_usage;
CREATE TRIGGER calculate_usage_percentage_trigger
    BEFORE INSERT OR UPDATE ON integration_usage
    FOR EACH ROW EXECUTE FUNCTION calculate_usage_percentage();

-- Create function to calculate total cost
CREATE OR REPLACE FUNCTION calculate_total_cost()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_cost = COALESCE(NEW.base_cost, 0) + COALESCE(NEW.usage_cost, 0) + COALESCE(NEW.overage_cost, 0) + COALESCE(NEW.taxes, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS calculate_total_cost_trigger ON integration_costs;
CREATE TRIGGER calculate_total_cost_trigger
    BEFORE INSERT OR UPDATE ON integration_costs
    FOR EACH ROW EXECUTE FUNCTION calculate_total_cost();

-- Insert sample integration services
INSERT INTO integrations (name, description, status, category, icon, monthly_cost, api_endpoint) VALUES
('Twilio', 'SMS and Voice communication services for user notifications and OTP delivery', 'active', 'Communication', '📱', 299.00, 'https://api.twilio.com'),
('PushNami', 'Push notification and messaging platform for mobile app engagement', 'active', 'Notifications', '🔔', 199.00, 'https://api.pushnami.com'),
('AWS Cloud Services', 'Cloud computing and storage services including EC2, S3, RDS, and Lambda', 'active', 'Cloud Infrastructure', '☁️', 450.00, 'https://aws.amazon.com'),
('Google Maps API', 'Mapping and geolocation services for constituency mapping and location features', 'warning', 'Location Services', '🗺️', 150.00, 'https://maps.googleapis.com'),
('SendGrid', 'Email delivery and marketing platform for transactional emails and campaigns', 'active', 'Email Services', '📧', 89.00, 'https://api.sendgrid.com'),
('Stripe', 'Payment processing and billing for subscription management', 'active', 'Payments', '💳', 0.00, 'https://api.stripe.com'),
('Firebase', 'Mobile app backend services including authentication and real-time database', 'active', 'Mobile Backend', '🔥', 125.00, 'https://firebase.googleapis.com'),
('Cloudflare', 'CDN and security services for improved performance and protection', 'active', 'CDN & Security', '🛡️', 75.00, 'https://api.cloudflare.com')
ON CONFLICT (name) DO NOTHING;

-- Insert subscription data
INSERT INTO integration_subscriptions (integration_id, subscription_date, renewal_date, auto_renewal, plan_name) VALUES
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-01-15', '2025-01-15', true, 'Professional Plan'),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-02-01', '2025-02-01', true, 'Growth Plan'),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2023-12-01', '2024-12-01', true, 'Business Support'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-03-01', '2025-03-01', true, 'Standard Plan'),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-01-10', '2025-01-10', true, 'Pro Plan'),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2023-11-15', '2024-11-15', true, 'Standard Plan'),
((SELECT id FROM integrations WHERE name = 'Firebase'), '2024-04-01', '2025-04-01', true, 'Blaze Plan'),
((SELECT id FROM integrations WHERE name = 'Cloudflare'), '2024-05-01', '2025-05-01', true, 'Pro Plan');

-- Insert current month usage data
INSERT INTO integration_usage (integration_id, month_year, monthly_limit, current_usage) VALUES
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-12-01', 10000, 7250),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-12-01', 50000, 32800),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-12-01', 1000, 850),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-12-01', 25000, 24100),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-12-01', 100000, 45600),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2024-12-01', 5000, 1250),
((SELECT id FROM integrations WHERE name = 'Firebase'), '2024-12-01', 50000, 28500),
((SELECT id FROM integrations WHERE name = 'Cloudflare'), '2024-12-01', 1000000, 450000)
ON CONFLICT (integration_id, month_year) DO NOTHING;

-- Insert previous month usage data for trend analysis
INSERT INTO integration_usage (integration_id, month_year, monthly_limit, current_usage) VALUES
-- November 2024
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-11-01', 10000, 8950),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-11-01', 50000, 41200),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-11-01', 1000, 920),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-11-01', 25000, 22300),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-11-01', 100000, 52100),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2024-11-01', 5000, 1890),
((SELECT id FROM integrations WHERE name = 'Firebase'), '2024-11-01', 50000, 31200),
((SELECT id FROM integrations WHERE name = 'Cloudflare'), '2024-11-01', 1000000, 520000)
ON CONFLICT (integration_id, month_year) DO NOTHING;

-- Insert integration features
INSERT INTO integration_features (integration_id, feature_name, feature_description, is_enabled) VALUES
-- Twilio features
((SELECT id FROM integrations WHERE name = 'Twilio'), 'SMS API', 'Send SMS messages for notifications and OTP', true),
((SELECT id FROM integrations WHERE name = 'Twilio'), 'Voice Calls', 'Voice calling functionality', true),
((SELECT id FROM integrations WHERE name = 'Twilio'), 'WhatsApp Business', 'WhatsApp messaging integration', true),

-- PushNami features
((SELECT id FROM integrations WHERE name = 'PushNami'), 'Push Notifications', 'Mobile push notifications', true),
((SELECT id FROM integrations WHERE name = 'PushNami'), 'In-App Messaging', 'In-app user messaging', true),
((SELECT id FROM integrations WHERE name = 'PushNami'), 'Analytics', 'Notification performance analytics', true),

-- AWS features
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'EC2', 'Virtual server instances', true),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'S3 Storage', 'Object storage service', true),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'RDS', 'Relational database service', true),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'Lambda', 'Serverless compute functions', true),

-- Google Maps features
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'Geocoding', 'Convert addresses to coordinates', true),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'Places API', 'Location search and details', true),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'Directions', 'Route planning and navigation', true),

-- SendGrid features
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'Transactional Email', 'Automated email delivery', true),
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'Marketing Campaigns', 'Email marketing tools', true),
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'Analytics', 'Email performance tracking', true);

-- Insert cost tracking data for current month
INSERT INTO integration_costs (integration_id, month_year, base_cost, usage_cost, overage_cost, taxes, invoice_number, payment_status) VALUES
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-12-01', 299.00, 45.50, 0.00, 34.45, 'TW-2024-12-001', 'pending'),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-12-01', 199.00, 0.00, 0.00, 19.90, 'PN-2024-12-001', 'pending'),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-12-01', 450.00, 125.75, 0.00, 57.58, 'AWS-2024-12-001', 'pending'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-12-01', 150.00, 89.20, 12.50, 25.17, 'GM-2024-12-001', 'pending'),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-12-01', 89.00, 0.00, 0.00, 8.90, 'SG-2024-12-001', 'pending')
ON CONFLICT (integration_id, month_year) DO NOTHING;

-- Insert alert configurations
INSERT INTO integration_alerts (integration_id, alert_type, threshold_value, is_enabled, notification_methods) VALUES
-- Usage alerts
((SELECT id FROM integrations WHERE name = 'Twilio'), 'usage_warning', 75.0, true, '["email", "dashboard"]'),
((SELECT id FROM integrations WHERE name = 'Twilio'), 'usage_critical', 90.0, true, '["email", "dashboard", "sms"]'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'usage_warning', 80.0, true, '["email", "dashboard"]'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'usage_critical', 95.0, true, '["email", "dashboard", "sms"]'),

-- Renewal reminders
((SELECT id FROM integrations WHERE name = 'Twilio'), 'renewal_reminder', 30.0, true, '["email", "dashboard"]'),
((SELECT id FROM integrations WHERE name = 'PushNami'), 'renewal_reminder', 30.0, true, '["email", "dashboard"]'),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'renewal_reminder', 60.0, true, '["email", "dashboard"]'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'renewal_reminder', 30.0, true, '["email", "dashboard"]'),
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'renewal_reminder', 30.0, true, '["email", "dashboard"]');

-- Create view for easier data access
CREATE OR REPLACE VIEW integration_overview AS
SELECT 
    i.id,
    i.name,
    i.description,
    i.status,
    i.category,
    i.icon,
    i.monthly_cost,
    s.subscription_date,
    s.renewal_date,
    s.auto_renewal,
    s.plan_name,
    u.monthly_limit,
    u.current_usage,
    u.usage_percentage,
    CASE 
        WHEN s.renewal_date < CURRENT_DATE THEN 'expired'
        WHEN s.renewal_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
        ELSE 'active'
    END as renewal_status,
    CASE 
        WHEN u.usage_percentage >= 90 THEN 'critical'
        WHEN u.usage_percentage >= 75 THEN 'warning'
        ELSE 'normal'
    END as usage_status
FROM integrations i
LEFT JOIN integration_subscriptions s ON i.id = s.integration_id
LEFT JOIN integration_usage u ON i.id = u.integration_id 
    AND u.month_year = DATE_TRUNC('month', CURRENT_DATE);