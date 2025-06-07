# JanPulse Admin Dashboard

Backend management system for JanPulse team members to manage representative data, constituencies, government schemes, and more.

## Features

- **Secure Authentication**: Team-only access using Supabase Auth
- **Representative Management**: Bulk upload MLAs, MLCs, MPs data
- **Constituency Management**: Manage constituency information
- **Government Schemes**: Upload and maintain schemes data
- **Voter & Polling Data**: Process voter lists and polling information
- **Registration Approval**: Approve/reject representative registration requests
- **Analytics & Reporting**: System analytics and reporting dashboard

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local`
3. Add your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Authentication
In your Supabase dashboard:
1. Go to Authentication → Settings
2. Configure email auth settings
3. Add team member emails manually or set up invite-only registration

### 4. Run the Application
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   ├── Login.tsx           # Login component with form
│   ├── Login.css           # Login styling
│   ├── Dashboard.tsx       # Main dashboard
│   ├── Dashboard.css       # Dashboard styling
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── lib/
│   └── supabase.ts         # Supabase client configuration
└── App.tsx                 # Main app component
```

## Technologies Used

- **Frontend**: React with TypeScript
- **Authentication**: Supabase Auth
- **Backend**: Supabase (PostgreSQL database)
- **Styling**: CSS3 with gradients and modern design
- **State Management**: React Context API

## Security

- Protected routes ensure only authenticated users can access the dashboard
- Team-only access through controlled user registration
- Secure authentication handled by Supabase

## Next Steps

1. Set up database tables for representatives, constituencies, schemes, etc.
2. Implement individual management pages for each feature
3. Add file upload functionality for bulk data imports
4. Create analytics and reporting features
5. Set up proper user roles and permissions