-- Complete Integrations Setup Script
-- Run this script to create tables and insert sample data

-- JanPulse Integrations Management Schema
-- This schema manages third-party service integrations, usage tracking, and renewals

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES admin_users(id),
    UNIQUE(name)
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create integration_usage table for tracking monthly usage
CREATE TABLE IF NOT EXISTS integration_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    month_year DATE NOT NULL, -- First day of the month (e.g., '2024-12-01')
    monthly_limit INTEGER NOT NULL DEFAULT 0,
    current_usage INTEGER NOT NULL DEFAULT 0,
    usage_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN monthly_limit > 0 THEN (current_usage::DECIMAL / monthly_limit) * 100
            ELSE 0
        END
    ) STORED,
    overage_amount INTEGER DEFAULT 0,
    overage_cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(integration_id, month_year)
);

-- Create integration_features table for storing feature lists
CREATE TABLE IF NOT EXISTS integration_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    feature_description TEXT,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (base_cost + usage_cost + overage_cost + taxes) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    invoice_number VARCHAR(100),
    invoice_date DATE,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(integration_id, month_year)
);

-- Create integration_logs table for audit trail
CREATE TABLE IF NOT EXISTS integration_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    performed_by UUID REFERENCES admin_users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integrations_updated_at 
    BEFORE UPDATE ON integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_subscriptions_updated_at 
    BEFORE UPDATE ON integration_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_usage_updated_at 
    BEFORE UPDATE ON integration_usage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_alerts_updated_at 
    BEFORE UPDATE ON integration_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

CREATE TRIGGER create_current_month_usage 
    AFTER INSERT ON integrations 
    FOR EACH ROW EXECUTE FUNCTION ensure_current_month_usage();

-- Create function to log integration changes
CREATE OR REPLACE FUNCTION log_integration_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO integration_logs (integration_id, action, old_values, new_values, performed_by)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO integration_logs (integration_id, action, new_values, performed_by)
        VALUES (NEW.id, 'CREATE', row_to_json(NEW), NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO integration_logs (integration_id, action, old_values, performed_by)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD), OLD.created_by);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_integration_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON integrations
    FOR EACH ROW EXECUTE FUNCTION log_integration_changes();

-- Enable Row Level Security (only if admin_users table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
        ALTER TABLE integration_subscriptions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE integration_usage ENABLE ROW LEVEL SECURITY;
        ALTER TABLE integration_features ENABLE ROW LEVEL SECURITY;
        ALTER TABLE integration_alerts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE integration_costs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies for admin users only
        DROP POLICY IF EXISTS "Admin users can manage integrations" ON integrations;
        CREATE POLICY "Admin users can manage integrations" ON integrations
            FOR ALL USING (true); -- Simplified for now

        DROP POLICY IF EXISTS "Admin users can manage subscriptions" ON integration_subscriptions;
        CREATE POLICY "Admin users can manage subscriptions" ON integration_subscriptions
            FOR ALL USING (true);

        DROP POLICY IF EXISTS "Admin users can manage usage" ON integration_usage;
        CREATE POLICY "Admin users can manage usage" ON integration_usage
            FOR ALL USING (true);

        DROP POLICY IF EXISTS "Admin users can manage features" ON integration_features;
        CREATE POLICY "Admin users can manage features" ON integration_features
            FOR ALL USING (true);

        DROP POLICY IF EXISTS "Admin users can manage alerts" ON integration_alerts;
        CREATE POLICY "Admin users can manage alerts" ON integration_alerts
            FOR ALL USING (true);

        DROP POLICY IF EXISTS "Admin users can manage costs" ON integration_costs;
        CREATE POLICY "Admin users can manage costs" ON integration_costs
            FOR ALL USING (true);

        DROP POLICY IF EXISTS "Admin users can view logs" ON integration_logs;
        CREATE POLICY "Admin users can view logs" ON integration_logs
            FOR ALL USING (true);
    END IF;
END $$;

-- Insert sample integration services
INSERT INTO integrations (name, description, status, category, icon, monthly_cost, api_endpoint) VALUES
('Twilio', 'SMS and Voice communication services for user notifications and OTP delivery', 'active', 'Communication', '📱', 299.00, 'https://api.twilio.com'),
('PushNami', 'Push notification and messaging platform for mobile app engagement', 'active', 'Notifications', '🔔', 199.00, 'https://api.pushnami.com'),
('AWS Cloud Services', 'Cloud computing and storage services including EC2, S3, RDS, and Lambda', 'active', 'Cloud Infrastructure', '☁️', 450.00, 'https://aws.amazon.com'),
('Google Maps API', 'Mapping and geolocation services for constituency mapping and location features', 'warning', 'Location Services', '🗺️', 150.00, 'https://maps.googleapis.com'),
('SendGrid', 'Email delivery and marketing platform for transactional emails and campaigns', 'active', 'Email Services', '📧', 89.00, 'https://api.sendgrid.com'),
('Stripe', 'Payment processing and billing for subscription management', 'active', 'Payments', '💳', 0.00, 'https://api.stripe.com')
ON CONFLICT (name) DO NOTHING;

-- Insert subscription data
INSERT INTO integration_subscriptions (integration_id, subscription_date, renewal_date, auto_renewal, plan_name) VALUES
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-01-15', '2025-01-15', true, 'Professional Plan'),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-02-01', '2025-02-01', true, 'Growth Plan'),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2023-12-01', '2024-12-01', true, 'Business Support'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-03-01', '2025-03-01', true, 'Standard Plan'),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-01-10', '2025-01-10', true, 'Pro Plan'),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2023-11-15', '2024-11-15', true, 'Standard Plan');

-- Insert current month usage data
INSERT INTO integration_usage (integration_id, month_year, monthly_limit, current_usage) VALUES
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-12-01', 10000, 7250),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-12-01', 50000, 32800),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-12-01', 1000, 850),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-12-01', 25000, 24100),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-12-01', 100000, 45600),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2024-12-01', 5000, 1250)
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
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'Lambda', 'Serverless compute functions', true);

-- Create views for easier data access
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