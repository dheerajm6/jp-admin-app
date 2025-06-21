-- First, drop all existing policies
DROP POLICY IF EXISTS "Service role has full access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Service role has full access to admin_otp" ON admin_otp;
DROP POLICY IF EXISTS "Service role has full access to admin_sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Admin users can view their own data" ON admin_users;
DROP POLICY IF EXISTS "Allow anon to read admin_users for login" ON admin_users;
DROP POLICY IF EXISTS "Allow anon to insert OTP" ON admin_otp;
DROP POLICY IF EXISTS "Allow anon to read OTP for verification" ON admin_otp;
DROP POLICY IF EXISTS "Allow anon to update OTP for marking as used" ON admin_otp;
DROP POLICY IF EXISTS "Allow anon to insert sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Allow anon to read sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Allow anon to delete sessions" ON admin_sessions;

-- Now recreate the policies
-- Allow service role to access all data
CREATE POLICY "Service role has full access to admin_users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to admin_otp" ON admin_otp
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to admin_sessions" ON admin_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anon role to access for login purposes
CREATE POLICY "Allow anon to read admin_users for login" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Allow anon to insert OTP" ON admin_otp
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon to read OTP for verification" ON admin_otp
  FOR SELECT USING (true);

CREATE POLICY "Allow anon to update OTP for marking as used" ON admin_otp
  FOR UPDATE USING (true);

CREATE POLICY "Allow anon to insert sessions" ON admin_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon to read sessions" ON admin_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow anon to delete sessions" ON admin_sessions
  FOR DELETE USING (true);

-- Make sure the default admin user exists
INSERT INTO admin_users (email, full_name, employee_id, role, department) VALUES
  ('admin@janpulse.com', 'System Administrator', 'ADMIN001', 'super_admin', 'IT')
ON CONFLICT (email) DO UPDATE SET
  full_name = 'System Administrator',
  role = 'super_admin',
  department = 'IT',
  employee_id = 'ADMIN001';

-- Verify the tables and user
SELECT 'Tables created successfully!' as status;
SELECT * FROM admin_users WHERE email = 'admin@janpulse.com';