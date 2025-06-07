-- JanPulse Admin Database Schema
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security (RLS) by default
-- First, let's create the main tables

-- 1. Representatives Table (MLAs, MLCs, MPs)
CREATE TABLE IF NOT EXISTS representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('MLA', 'MLC', 'MP')),
  constituency_id UUID REFERENCES constituencies(id),
  party TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  education TEXT,
  profession TEXT,
  assets DECIMAL,
  criminal_cases INTEGER DEFAULT 0,
  social_media JSONB, -- {"twitter": "@handle", "facebook": "page", "instagram": "@handle"}
  bio TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Constituencies Table
CREATE TABLE IF NOT EXISTS constituencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Assembly', 'Parliamentary', 'Council')),
  code TEXT UNIQUE, -- Official constituency code
  state TEXT NOT NULL,
  district TEXT,
  total_voters INTEGER,
  area_sq_km DECIMAL,
  urban_rural TEXT CHECK (urban_rural IN ('Urban', 'Rural', 'Mixed')),
  reserved_category TEXT CHECK (reserved_category IN ('General', 'SC', 'ST', 'OBC')),
  coordinates JSONB, -- {"lat": 0.0, "lng": 0.0}
  boundaries JSONB, -- GeoJSON polygon data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 3. Government Schemes Table
CREATE TABLE IF NOT EXISTS government_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  department TEXT NOT NULL,
  ministry TEXT,
  scheme_type TEXT, -- 'Central', 'State', 'Joint'
  launch_date DATE,
  end_date DATE,
  budget_allocated DECIMAL,
  budget_utilized DECIMAL,
  target_beneficiaries INTEGER,
  actual_beneficiaries INTEGER,
  eligibility_criteria JSONB,
  application_process TEXT,
  documents_required TEXT[],
  benefits TEXT,
  website_url TEXT,
  helpline TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued', 'under_review')),
  tags TEXT[], -- For categorization and search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 4. Voter Data Table (aggregated, not individual voters for privacy)
CREATE TABLE IF NOT EXISTS voter_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  constituency_id UUID REFERENCES constituencies(id),
  election_year INTEGER NOT NULL,
  election_type TEXT CHECK (election_type IN ('General', 'Assembly', 'Local', 'By-election')),
  total_voters INTEGER,
  male_voters INTEGER,
  female_voters INTEGER,
  first_time_voters INTEGER,
  voter_turnout_percentage DECIMAL,
  votes_polled INTEGER,
  invalid_votes INTEGER,
  booth_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 5. Representative Registration Requests
CREATE TABLE IF NOT EXISTS registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  representative_name TEXT NOT NULL,
  representative_type TEXT NOT NULL CHECK (representative_type IN ('MLA', 'MLC', 'MP')),
  constituency_name TEXT NOT NULL,
  party TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  submitted_documents JSONB, -- URLs to uploaded documents
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES auth.users(id),
  review_comments TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Admin Users Profile (extends auth.users)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  department TEXT,
  permissions JSONB DEFAULT '{"read": true, "write": false, "admin": false}',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Activity Logs for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  table_name TEXT, -- which table was affected
  record_id UUID, -- which record was affected
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_representatives_type ON representatives(type);
CREATE INDEX IF NOT EXISTS idx_representatives_constituency ON representatives(constituency_id);
CREATE INDEX IF NOT EXISTS idx_representatives_status ON representatives(status);
CREATE INDEX IF NOT EXISTS idx_constituencies_type ON constituencies(type);
CREATE INDEX IF NOT EXISTS idx_constituencies_state ON constituencies(state);
CREATE INDEX IF NOT EXISTS idx_schemes_department ON government_schemes(department);
CREATE INDEX IF NOT EXISTS idx_schemes_status ON government_schemes(status);
CREATE INDEX IF NOT EXISTS idx_voter_stats_constituency ON voter_statistics(constituency_id);
CREATE INDEX IF NOT EXISTS idx_registration_status ON registration_requests(verification_status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_table ON activity_logs(table_name);

-- Enable Row Level Security
ALTER TABLE representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE voter_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow authenticated users to read/write)
-- You can make these more restrictive based on roles later

-- Representatives policies
CREATE POLICY "Allow authenticated users to view representatives" ON representatives
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert representatives" ON representatives
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update representatives" ON representatives
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Constituencies policies
CREATE POLICY "Allow authenticated users to view constituencies" ON constituencies
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert constituencies" ON constituencies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update constituencies" ON constituencies
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Government schemes policies
CREATE POLICY "Allow authenticated users to view schemes" ON government_schemes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert schemes" ON government_schemes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update schemes" ON government_schemes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Similar policies for other tables...
CREATE POLICY "Allow authenticated users to view voter stats" ON voter_statistics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view registration requests" ON registration_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update registration requests" ON registration_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Admin profiles - users can only see their own profile
CREATE POLICY "Users can view own profile" ON admin_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON admin_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Activity logs - read only for authenticated users
CREATE POLICY "Allow authenticated users to view activity logs" ON activity_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_representatives_updated_at BEFORE UPDATE ON representatives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_constituencies_updated_at BEFORE UPDATE ON constituencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schemes_updated_at BEFORE UPDATE ON government_schemes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voter_stats_updated_at BEFORE UPDATE ON voter_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registration_requests_updated_at BEFORE UPDATE ON registration_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();