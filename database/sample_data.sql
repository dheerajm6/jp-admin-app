-- Sample Data for JanPulse Admin Dashboard
-- Run this after creating the schema

-- First, insert some constituencies
INSERT INTO constituencies (name, type, code, state, district, total_voters, area_sq_km, urban_rural, reserved_category) VALUES
('Mumbai South', 'Parliamentary', 'PC-S26-001', 'Maharashtra', 'Mumbai', 1500000, 45.5, 'Urban', 'General'),
('Andheri East', 'Assembly', 'AC-164', 'Maharashtra', 'Mumbai', 350000, 12.3, 'Urban', 'General'),
('Worli', 'Assembly', 'AC-194', 'Maharashtra', 'Mumbai', 280000, 8.7, 'Urban', 'General'),
('Bandra East', 'Assembly', 'AC-170', 'Maharashtra', 'Mumbai', 320000, 15.2, 'Urban', 'General'),
('Colaba', 'Assembly', 'AC-195', 'Maharashtra', 'Mumbai', 250000, 22.1, 'Urban', 'General'),
('Nagpur Central', 'Assembly', 'AC-047', 'Maharashtra', 'Nagpur', 400000, 35.6, 'Urban', 'General'),
('Pune Cantonment', 'Assembly', 'AC-164', 'Maharashtra', 'Pune', 380000, 28.9, 'Urban', 'General'),
('Nashik East', 'Assembly', 'AC-016', 'Maharashtra', 'Nashik', 420000, 42.3, 'Mixed', 'General');

-- Insert some representatives
INSERT INTO representatives (name, type, constituency_id, party, email, phone, gender, education, profession, status) VALUES
('Arvind Sawant', 'MP', (SELECT id FROM constituencies WHERE name = 'Mumbai South'), 'Shiv Sena (UBT)', 'arvind.sawant@example.com', '+91-9876543210', 'Male', 'Engineering Graduate', 'Politician', 'active'),
('Ramesh Latke', 'MLA', (SELECT id FROM constituencies WHERE name = 'Andheri East'), 'Shiv Sena (UBT)', 'ramesh.latke@example.com', '+91-9876543211', 'Male', 'Graduate', 'Social Worker', 'active'),
('Aaditya Thackeray', 'MLA', (SELECT id FROM constituencies WHERE name = 'Worli'), 'Shiv Sena (UBT)', 'aaditya.thackeray@example.com', '+91-9876543212', 'Male', 'Law Graduate', 'Politician', 'active'),
('Zeeshan Siddique', 'MLA', (SELECT id FROM constituencies WHERE name = 'Bandra East'), 'Indian National Congress', 'zeeshan.siddique@example.com', '+91-9876543213', 'Male', 'Graduate', 'Politician', 'active'),
('Rahul Shewale', 'MLA', (SELECT id FROM constituencies WHERE name = 'Colaba'), 'Shiv Sena', 'rahul.shewale@example.com', '+91-9876543214', 'Male', 'Graduate', 'Politician', 'active');

-- Insert some government schemes
INSERT INTO government_schemes (name, description, department, ministry, scheme_type, launch_date, budget_allocated, target_beneficiaries, eligibility_criteria, benefits, status) VALUES
('Pradhan Mantri Awas Yojana', 'Housing for All scheme providing affordable housing to economically weaker sections', 'Housing and Urban Affairs', 'Ministry of Housing and Urban Affairs', 'Central', '2015-06-25', 1200000000000, 20000000, '{"income_limit": "Rs. 18 lakh per annum", "family_ownership": "No pucca house", "age": "Above 18 years"}', 'Subsidy on home loans, direct assistance for house construction', 'active'),
('Ayushman Bharat', 'National Health Protection Scheme providing health insurance coverage', 'Health and Family Welfare', 'Ministry of Health and Family Welfare', 'Central', '2018-09-23', 2000000000000, 100000000, '{"economic_status": "Bottom 40% families", "coverage": "As per SECC database"}', 'Health insurance coverage up to Rs. 5 lakh per family per year', 'active'),
('PM Kisan Samman Nidhi', 'Direct income support to farmer families', 'Agriculture and Farmers Welfare', 'Ministry of Agriculture and Farmers Welfare', 'Central', '2018-12-01', 750000000000, 120000000, '{"land_holding": "Small and marginal farmers", "ownership": "Cultivable land ownership"}', 'Rs. 6000 per year in three installments', 'active'),
('Beti Bachao Beti Padhao', 'Scheme for protection and education of girl child', 'Women and Child Development', 'Ministry of Women and Child Development', 'Central', '2015-01-22', 2000000000, 0, '{"focus": "Districts with low Child Sex Ratio"}', 'Awareness campaigns, education support for girls', 'active'),
('Skill India Mission', 'Skill development program for youth', 'Skill Development and Entrepreneurship', 'Ministry of Skill Development and Entrepreneurship', 'Central', '2015-07-15', 1500000000000, 40000000, '{"age": "15-45 years", "education": "School dropout to graduate"}', 'Free skill training, certification, job placement assistance', 'active');

-- Insert some voter statistics
INSERT INTO voter_statistics (constituency_id, election_year, election_type, total_voters, male_voters, female_voters, first_time_voters, voter_turnout_percentage, votes_polled) VALUES
((SELECT id FROM constituencies WHERE name = 'Mumbai South'), 2019, 'General', 1500000, 780000, 720000, 150000, 55.2, 828000),
((SELECT id FROM constituencies WHERE name = 'Andheri East'), 2019, 'Assembly', 350000, 185000, 165000, 35000, 52.8, 184800),
((SELECT id FROM constituencies WHERE name = 'Worli'), 2019, 'Assembly', 280000, 148000, 132000, 28000, 58.5, 163800),
((SELECT id FROM constituencies WHERE name = 'Mumbai South'), 2024, 'General', 1520000, 790000, 730000, 75000, 57.8, 878560),
((SELECT id FROM constituencies WHERE name = 'Andheri East'), 2024, 'Assembly', 360000, 190000, 170000, 18000, 54.2, 195120);

-- Insert some registration requests
INSERT INTO registration_requests (representative_name, representative_type, constituency_name, party, email, phone, verification_status, review_comments) VALUES
('Priya Sharma', 'MLA', 'Borivali West', 'Bharatiya Janata Party', 'priya.sharma@example.com', '+91-9876543215', 'pending', NULL),
('Rajesh Kumar', 'MP', 'Mumbai North West', 'Indian National Congress', 'rajesh.kumar@example.com', '+91-9876543216', 'under_review', 'Documents verification in progress'),
('Anita Desai', 'MLA', 'Versova', 'Aam Aadmi Party', 'anita.desai@example.com', '+91-9876543217', 'approved', 'All documents verified successfully'),
('Suresh Patel', 'MLA', 'Jogeshwari East', 'Nationalist Congress Party', 'suresh.patel@example.com', '+91-9876543218', 'rejected', 'Incomplete documentation provided');

-- Note: Admin profiles will be created automatically when users sign up
-- You can manually insert admin profiles after users are created in auth.users

-- Example of how to insert admin profile (replace UUID with actual user ID from auth.users)
-- INSERT INTO admin_profiles (id, full_name, role, department, permissions) VALUES
-- ('user-uuid-here', 'Admin User', 'admin', 'IT Department', '{"read": true, "write": true, "admin": true}');