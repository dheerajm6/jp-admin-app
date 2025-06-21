-- Create default admin user for admin@janpulse.com
-- This user can login with OTP: 123456

-- Insert admin user if not exists
INSERT INTO admin_users (
    email,
    full_name,
    role,
    department,
    employee_id,
    is_active
) 
SELECT 
    'admin@janpulse.com',
    'System Administrator',
    'super_admin',
    'IT',
    'ADMIN001',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE email = 'admin@janpulse.com'
);

-- Optionally, update existing admin user to ensure correct details
UPDATE admin_users 
SET 
    full_name = 'System Administrator',
    role = 'super_admin',
    department = 'IT',
    employee_id = 'ADMIN001',
    is_active = true
WHERE email = 'admin@janpulse.com';