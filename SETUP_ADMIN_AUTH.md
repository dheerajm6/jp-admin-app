# Admin Authentication Setup Guide

## Quick Setup

1. **Open Supabase Dashboard**
   - Go to your project: https://supabase.com/dashboard/project/sbslfgzfhjpxhyhysvln
   - Navigate to SQL Editor

2. **Run the Admin Schema SQL**
   - Copy all content from `database/admin_schema_updated.sql`
   - Paste it in the SQL Editor
   - Click "Run"

3. **Test the Login**
   - Email: `admin@janpulse.com`
   - OTP: `123456`

## What This Creates

- `admin_users` table - For JanPulse employees (separate from mobile app users)
- `admin_otp` table - For storing OTP codes
- `admin_sessions` table - For managing login sessions
- Default admin user with email `admin@janpulse.com`

## Troubleshooting

If you get errors about tables already existing, you can drop them first:

```sql
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_otp CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
```

Then run the schema SQL again.

## How It Works

1. **Admin App** uses `admin_users` table (internal employees)
2. **Mobile App** uses Supabase Auth `auth.users` table (customers)
3. Complete separation between the two user systems
4. OTP-based login for security
5. Special bypass for `admin@janpulse.com` with OTP `123456`