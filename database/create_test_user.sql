-- Create a test admin user
-- Run this in your Supabase SQL Editor after running the schema

-- Note: You'll need to create the user in Supabase Auth dashboard first
-- Then run this to add their profile

-- Example: After creating user with email 'admin@janpulse.com' in Auth dashboard,
-- replace 'YOUR_USER_ID_HERE' with the actual UUID from auth.users table

-- INSERT INTO admin_profiles (id, full_name, role, department, permissions) VALUES
-- ('YOUR_USER_ID_HERE', 'Admin User', 'admin', 'IT Department', '{"read": true, "write": true, "admin": true}');

-- To find your user ID, run:
-- SELECT id, email FROM auth.users;

-- Then use that ID in the INSERT statement above