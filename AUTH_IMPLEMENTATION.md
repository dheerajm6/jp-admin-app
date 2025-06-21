# Admin Authentication Implementation

## Overview
The admin app now uses a completely separate authentication system from the mobile app.

## Key Features Implemented

### 1. OTP-Based Login
- Users enter email address
- System sends 6-digit OTP (currently logged to console)
- OTP expires after 10 minutes
- Session tokens stored in localStorage

### 2. Admin Bypass
- Email: `admin@janpulse.com`
- OTP: `123456` (always works)
- Automatically creates admin user if doesn't exist

### 3. Separate User Tables
- **Admin App**: Uses `admin_users` table (JanPulse employees)
- **Mobile App**: Uses `auth.users` table (customers/constituents)
- Complete isolation between the two systems

## Database Structure

### Tables Created:
1. `admin_users` - Stores employee information
2. `admin_otp` - Manages OTP codes
3. `admin_sessions` - Handles active sessions

## Next Steps (Optional)

1. **Email Integration**: Connect an email service to actually send OTPs
2. **SMS Support**: Add phone number authentication
3. **User Management**: Create an admin interface to add/remove employees
4. **Session Management**: Add "Remember me" functionality
5. **Security**: Add rate limiting for OTP requests

## Testing Other Users

To add more admin users, run this SQL:
```sql
INSERT INTO admin_users (email, full_name, role, department) VALUES
  ('employee@janpulse.com', 'Employee Name', 'admin', 'Department');
```

Regular users will receive their OTP in the console log (check browser developer tools).