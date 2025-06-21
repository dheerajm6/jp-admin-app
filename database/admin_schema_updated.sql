-- Admin Users Table for JanPulse Employees
-- This table is separate from auth.users which is used for mobile app users

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE, -- Made optional
  full_name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50) UNIQUE, -- Made optional for default admin
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OTP table for admin authentication
CREATE TABLE IF NOT EXISTS admin_otp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  otp_code VARCHAR(6) NOT NULL,
  otp_type VARCHAR(20) NOT NULL DEFAULT 'login', -- 'login', 'password_reset'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_phone ON admin_users(phone);
CREATE INDEX IF NOT EXISTS idx_admin_users_employee_id ON admin_users(employee_id);
CREATE INDEX IF NOT EXISTS idx_admin_otp_email ON admin_otp(email);
CREATE INDEX IF NOT EXISTS idx_admin_otp_expires_at ON admin_otp(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- RLS (Row Level Security) policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

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

-- Insert default admin user
INSERT INTO admin_users (email, full_name, employee_id, role, department) VALUES
  ('admin@janpulse.com', 'System Administrator', 'ADMIN001', 'super_admin', 'IT')
ON CONFLICT (email) DO NOTHING;

-- Function to cleanup expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_otp WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;