-- Sample data for integrations management
-- Insert sample integration services

INSERT INTO integrations (name, description, status, category, icon, monthly_cost, api_endpoint) VALUES
('Twilio', 'SMS and Voice communication services for user notifications and OTP delivery', 'active', 'Communication', '📱', 299.00, 'https://api.twilio.com'),
('PushNami', 'Push notification and messaging platform for mobile app engagement', 'active', 'Notifications', '🔔', 199.00, 'https://api.pushnami.com'),
('AWS Cloud Services', 'Cloud computing and storage services including EC2, S3, RDS, and Lambda', 'active', 'Cloud Infrastructure', '☁️', 450.00, 'https://aws.amazon.com'),
('Google Maps API', 'Mapping and geolocation services for constituency mapping and location features', 'warning', 'Location Services', '🗺️', 150.00, 'https://maps.googleapis.com'),
('SendGrid', 'Email delivery and marketing platform for transactional emails and campaigns', 'active', 'Email Services', '📧', 89.00, 'https://api.sendgrid.com'),
('Stripe', 'Payment processing and billing for subscription management', 'active', 'Payments', '💳', 0.00, 'https://api.stripe.com'),
('Firebase', 'Mobile app backend services including authentication and real-time database', 'active', 'Mobile Backend', '🔥', 125.00, 'https://firebase.googleapis.com'),
('Cloudflare', 'CDN and security services for improved performance and protection', 'active', 'CDN & Security', '🛡️', 75.00, 'https://api.cloudflare.com'),
('MongoDB Atlas', 'Cloud database service for storing application data', 'active', 'Database', '🍃', 200.00, 'https://cloud.mongodb.com'),
('DataDog', 'Application monitoring and logging service', 'inactive', 'Monitoring', '📊', 180.00, 'https://api.datadoghq.com');

-- Insert subscription data
INSERT INTO integration_subscriptions (integration_id, subscription_date, renewal_date, auto_renewal, plan_name) VALUES
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-01-15', '2025-01-15', true, 'Professional Plan'),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-02-01', '2025-02-01', true, 'Growth Plan'),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2023-12-01', '2024-12-01', true, 'Business Support'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-03-01', '2025-03-01', true, 'Standard Plan'),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-01-10', '2025-01-10', true, 'Pro Plan'),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2023-11-15', '2024-11-15', true, 'Standard Plan'),
((SELECT id FROM integrations WHERE name = 'Firebase'), '2024-04-01', '2025-04-01', true, 'Blaze Plan'),
((SELECT id FROM integrations WHERE name = 'Cloudflare'), '2024-05-01', '2025-05-01', true, 'Pro Plan'),
((SELECT id FROM integrations WHERE name = 'MongoDB Atlas'), '2024-06-01', '2025-06-01', true, 'Dedicated Plan'),
((SELECT id FROM integrations WHERE name = 'DataDog'), '2024-07-01', '2025-07-01', false, 'Pro Plan');

-- Insert current month usage data
INSERT INTO integration_usage (integration_id, month_year, monthly_limit, current_usage) VALUES
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-12-01', 10000, 7250),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-12-01', 50000, 32800),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-12-01', 1000, 850),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-12-01', 25000, 24100),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-12-01', 100000, 45600),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2024-12-01', 5000, 1250),
((SELECT id FROM integrations WHERE name = 'Firebase'), '2024-12-01', 50000, 28500),
((SELECT id FROM integrations WHERE name = 'Cloudflare'), '2024-12-01', 1000000, 450000),
((SELECT id FROM integrations WHERE name = 'MongoDB Atlas'), '2024-12-01', 500, 320),
((SELECT id FROM integrations WHERE name = 'DataDog'), '2024-12-01', 100, 0);

-- Insert previous months usage data for trend analysis
INSERT INTO integration_usage (integration_id, month_year, monthly_limit, current_usage) VALUES
-- November 2024
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-11-01', 10000, 8950),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-11-01', 50000, 41200),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-11-01', 1000, 920),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-11-01', 25000, 22300),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-11-01', 100000, 52100),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2024-11-01', 5000, 1890),
((SELECT id FROM integrations WHERE name = 'Firebase'), '2024-11-01', 50000, 31200),
((SELECT id FROM integrations WHERE name = 'Cloudflare'), '2024-11-01', 1000000, 520000),
((SELECT id FROM integrations WHERE name = 'MongoDB Atlas'), '2024-11-01', 500, 380),
-- October 2024
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-10-01', 10000, 9100),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-10-01', 50000, 38900),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-10-01', 1000, 870),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-10-01', 25000, 19800),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-10-01', 100000, 48700),
((SELECT id FROM integrations WHERE name = 'Stripe'), '2024-10-01', 5000, 1650),
((SELECT id FROM integrations WHERE name = 'Firebase'), '2024-10-01', 50000, 29800),
((SELECT id FROM integrations WHERE name = 'Cloudflare'), '2024-10-01', 1000000, 490000),
((SELECT id FROM integrations WHERE name = 'MongoDB Atlas'), '2024-10-01', 500, 350);

-- Insert integration features
INSERT INTO integration_features (integration_id, feature_name, feature_description, is_enabled) VALUES
-- Twilio features
((SELECT id FROM integrations WHERE name = 'Twilio'), 'SMS API', 'Send SMS messages for notifications and OTP', true),
((SELECT id FROM integrations WHERE name = 'Twilio'), 'Voice Calls', 'Voice calling functionality', true),
((SELECT id FROM integrations WHERE name = 'Twilio'), 'WhatsApp Business', 'WhatsApp messaging integration', true),
((SELECT id FROM integrations WHERE name = 'Twilio'), 'Video Calling', 'Video conferencing capabilities', false),

-- PushNami features
((SELECT id FROM integrations WHERE name = 'PushNami'), 'Push Notifications', 'Mobile push notifications', true),
((SELECT id FROM integrations WHERE name = 'PushNami'), 'In-App Messaging', 'In-app user messaging', true),
((SELECT id FROM integrations WHERE name = 'PushNami'), 'Analytics', 'Notification performance analytics', true),
((SELECT id FROM integrations WHERE name = 'PushNami'), 'A/B Testing', 'Test different notification strategies', false),

-- AWS features
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'EC2', 'Virtual server instances', true),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'S3 Storage', 'Object storage service', true),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'RDS', 'Relational database service', true),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'Lambda', 'Serverless compute functions', true),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'CloudFront', 'Content delivery network', false),

-- Google Maps features
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'Geocoding', 'Convert addresses to coordinates', true),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'Places API', 'Location search and details', true),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'Directions', 'Route planning and navigation', true),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'Street View', 'Street-level imagery', false),

-- SendGrid features
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'Transactional Email', 'Automated email delivery', true),
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'Marketing Campaigns', 'Email marketing tools', true),
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'Analytics', 'Email performance tracking', true),
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'Template Engine', 'Dynamic email templates', true);

-- Insert cost tracking data
INSERT INTO integration_costs (integration_id, month_year, base_cost, usage_cost, overage_cost, taxes, invoice_number, payment_status) VALUES
-- Current month (December 2024)
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-12-01', 299.00, 45.50, 0.00, 34.45, 'TW-2024-12-001', 'pending'),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-12-01', 199.00, 0.00, 0.00, 19.90, 'PN-2024-12-001', 'pending'),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-12-01', 450.00, 125.75, 0.00, 57.58, 'AWS-2024-12-001', 'pending'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-12-01', 150.00, 89.20, 12.50, 25.17, 'GM-2024-12-001', 'pending'),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-12-01', 89.00, 0.00, 0.00, 8.90, 'SG-2024-12-001', 'pending'),

-- Previous month (November 2024)
((SELECT id FROM integrations WHERE name = 'Twilio'), '2024-11-01', 299.00, 67.25, 0.00, 36.63, 'TW-2024-11-001', 'paid'),
((SELECT id FROM integrations WHERE name = 'PushNami'), '2024-11-01', 199.00, 0.00, 0.00, 19.90, 'PN-2024-11-001', 'paid'),
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), '2024-11-01', 450.00, 156.80, 0.00, 60.68, 'AWS-2024-11-001', 'paid'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), '2024-11-01', 150.00, 78.90, 0.00, 22.89, 'GM-2024-11-001', 'paid'),
((SELECT id FROM integrations WHERE name = 'SendGrid'), '2024-11-01', 89.00, 15.60, 0.00, 10.46, 'SG-2024-11-001', 'paid');

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
((SELECT id FROM integrations WHERE name = 'SendGrid'), 'renewal_reminder', 30.0, true, '["email", "dashboard"]'),

-- Cost threshold alerts
((SELECT id FROM integrations WHERE name = 'AWS Cloud Services'), 'cost_threshold', 600.0, true, '["email", "dashboard"]'),
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'cost_threshold', 300.0, true, '["email", "dashboard"]');

-- Create some sample activity logs
INSERT INTO integration_logs (integration_id, action, new_values, performed_by) VALUES
((SELECT id FROM integrations WHERE name = 'Google Maps API'), 'UPDATE', '{"status": "warning", "notes": "Approaching usage limit"}', NULL),
((SELECT id FROM integrations WHERE name = 'DataDog'), 'UPDATE', '{"status": "inactive", "notes": "Temporarily disabled due to budget constraints"}', NULL),
((SELECT id FROM integrations WHERE name = 'Twilio'), 'CREATE', '{"name": "Twilio", "status": "active"}', NULL);