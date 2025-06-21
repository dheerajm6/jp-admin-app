# JanPulse Admin Dashboard

A comprehensive administrative dashboard for managing political representatives, constituencies, government schemes, and user data for the JanPulse platform.

## Overview

JanPulse Admin is a React-based web application that serves as the management interface for JanPulse team members. It provides tools for data management, user oversight, analytics, and content administration that powers the main JanPulse mobile application.

## Features

### 🎯 Dashboard & Analytics
- Mission Control Dashboard with real-time KPIs and system health monitoring
- Executive Dashboard with performance metrics and alerts
- Analytics page with user statistics, growth metrics, and constituency performance
- Reports generation with customizable templates

### 👥 Representative Management
- Complete CRUD operations for MLAs, MLCs, and MPs
- Constituency assignment and political party management
- Contact information and profile management
- Status tracking (active/inactive/suspended)

### 📊 Data Upload & Management
- Bulk upload functionality for representatives, schemes, and polling data
- CSV/Excel file processing with validation
- Template downloads for standardized data entry
- Progress tracking and error handling

### ✅ Registration Approval System
- Manage signup requests from representatives
- Verification workflow with approval/rejection capabilities
- Conflict resolution for constituency overlaps
- Document verification system

### 🏛️ Government Schemes Management
- Comprehensive scheme database with detailed information
- Budget tracking and utilization metrics
- Beneficiary data management
- Advanced categorization and search functionality

## Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **UI Framework**: Ant Design 5.25.4 with custom theming
- **Routing**: React Router 7.6.2
- **Charts**: Recharts 2.15.3
- **Icons**: Lucide React & Tabler Icons
- **Backend**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Custom OTP-based system

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd janpulse-admin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
```bash
# Run the admin schema
psql -h <host> -U <username> -d <database> -f database/admin_schema.sql

# Run the main schema
psql -h <host> -U <username> -d <database> -f database/schema.sql

# Optional: Add sample data
psql -h <host> -U <username> -d <database> -f database/sample_data.sql
```

## Development

Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## Authentication

The admin system uses a custom OTP-based authentication:

### Development Access
- **Email**: `admin@janpulse.com`
- **OTP**: `123456` (development bypass)

### Production Setup
1. Add admin users to the `admin_users` table
2. Configure email service for OTP delivery
3. Update authentication settings in `src/contexts/AuthContext.tsx`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Database Schema

The application uses PostgreSQL with the following main tables:

### Core Tables
- `representatives` - Political representative profiles
- `constituencies` - Electoral constituency information
- `government_schemes` - Government program database
- `voter_statistics` - Aggregated demographic data
- `registration_requests` - Pending applications

### Admin Tables
- `admin_users` - Admin user accounts
- `admin_otp` - OTP authentication system
- `admin_sessions` - Session management
- `activity_logs` - Audit trail

## Security Features

- Row Level Security (RLS) on all database tables
- Session-based authentication with automatic cleanup
- Comprehensive audit logging
- Input validation and sanitization
- Separate authentication system from mobile app users

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Layout.tsx       # App layout wrapper
│   ├── Login.tsx        # Authentication
│   └── uploads/         # Bulk upload components
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   └── ThemeContext.tsx # UI theming
├── pages/               # Main route components
│   ├── Analytics.tsx    # Analytics dashboard
│   ├── DataUploads.tsx  # Data management
│   ├── Representatives.tsx
│   └── SignupRequests.tsx
├── lib/                 # Utilities
│   └── supabase.ts      # Supabase client
└── styles/              # Global styles and themes
```

## Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new components
3. Add appropriate error handling and validation
4. Test thoroughly before submitting changes
5. Update documentation for new features

## Deployment

1. Build the production version:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service
3. Ensure environment variables are configured in production
4. Set up SSL/TLS certificates for secure authentication

## Support

For issues and questions:
1. Check the existing documentation files:
   - `SETUP.md` - Detailed setup instructions
   - `AUTH_IMPLEMENTATION.md` - Authentication system details
   - `NEXT_STEPS.md` - Development roadmap
2. Review the database schema in the `/database` directory
3. Contact the development team

## License

This project is proprietary software for JanPulse internal use.