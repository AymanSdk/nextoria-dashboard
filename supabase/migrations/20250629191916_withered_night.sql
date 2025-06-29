/*
  # Seed Initial Data

  1. Sample Users
    - Admin user
    - Marketing team members
    - Designer

  2. Sample Clients
    - TechStart Inc
    - GreenEarth Solutions

  3. Sample Data
    - Campaigns, content, leads, tasks
*/

-- Insert sample users (these will be created when users sign up via auth)
-- This is just for reference - actual users will be created through Supabase Auth

-- Insert sample clients
INSERT INTO clients (id, name, company, email, phone, assigned_manager_id, active_campaigns, notes, logo_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'TechStart Inc', 'TechStart Inc', 'hello@techstart.com', '+1 (555) 123-4567', null, 3, 'High-growth SaaS startup, focus on B2B marketing', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('550e8400-e29b-41d4-a716-446655440002', 'GreenEarth Solutions', 'GreenEarth Solutions', 'contact@greenearth.com', '+1 (555) 987-6543', null, 2, 'Sustainable energy company, eco-conscious messaging', 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('550e8400-e29b-41d4-a716-446655440003', 'FoodieHub', 'FoodieHub LLC', 'info@foodiehub.com', '+1 (555) 456-7890', null, 1, 'Food delivery app, young demographic target', 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=100');

-- Insert sample campaigns
INSERT INTO campaigns (id, name, client_id, platform, status, start_date, end_date, budget, goals, reach, conversions, assigned_to_id) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'TechStart Q1 Growth Campaign', '550e8400-e29b-41d4-a716-446655440001', 'Google', 'Active', '2024-03-01', '2024-05-31', 50000, 'Increase B2B leads by 40%', 125000, 850, null),
  ('650e8400-e29b-41d4-a716-446655440002', 'GreenEarth Brand Awareness', '550e8400-e29b-41d4-a716-446655440002', 'Meta', 'Active', '2024-02-15', '2024-04-15', 30000, 'Build brand awareness in sustainable sector', 89000, 420, null),
  ('650e8400-e29b-41d4-a716-446655440003', 'FoodieHub App Launch', '550e8400-e29b-41d4-a716-446655440003', 'TikTok', 'Paused', '2024-01-20', '2024-03-20', 25000, 'Drive app downloads and user engagement', 67000, 1200, null);

-- Insert sample content
INSERT INTO content (id, title, type, assigned_to_id, status, platform, scheduled_date, client_id, description) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'TechStart Product Demo Video', 'Video', null, 'Draft', 'YouTube', '2024-03-25 10:00:00+00', '550e8400-e29b-41d4-a716-446655440001', 'Product demonstration showcasing key features'),
  ('750e8400-e29b-41d4-a716-446655440002', 'GreenEarth Sustainability Post', 'Post', null, 'Scheduled', 'LinkedIn', '2024-03-22 14:00:00+00', '550e8400-e29b-41d4-a716-446655440002', 'Educational content about renewable energy'),
  ('750e8400-e29b-41d4-a716-446655440003', 'FoodieHub Newsletter', 'Email', null, 'Published', 'Email', '2024-03-20 09:00:00+00', '550e8400-e29b-41d4-a716-446655440003', 'Monthly newsletter with food trends');

-- Insert sample leads
INSERT INTO leads (id, name, email, phone, source, status, assigned_to_id, notes, value) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', 'Alexandra Chen', 'alexandra@startup.com', '+1 (555) 111-2222', 'Google Ad', 'New', null, 'Interested in B2B marketing services', 15000),
  ('850e8400-e29b-41d4-a716-446655440002', 'Roberto Martinez', 'roberto@localfood.com', '+1 (555) 333-4444', 'Facebook Ad', 'Contacted', null, 'Restaurant chain looking for social media management', 8000),
  ('850e8400-e29b-41d4-a716-446655440003', 'Emma Thompson', 'emma@ecotech.com', null, 'Referral', 'Qualified', null, 'Clean tech startup, high potential client', 25000);

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, assigned_to_id, due_date, priority, client_id) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', 'Create TechStart landing page wireframes', 'Design wireframes for new product landing page', 'In Progress', null, '2024-03-25', 'High', '550e8400-e29b-41d4-a716-446655440001'),
  ('950e8400-e29b-41d4-a716-446655440002', 'Review GreenEarth campaign performance', 'Analyze campaign metrics and prepare optimization recommendations', 'Todo', null, '2024-03-23', 'Medium', '550e8400-e29b-41d4-a716-446655440002'),
  ('950e8400-e29b-41d4-a716-446655440003', 'Set up FoodieHub conversion tracking', 'Implement GA4 and Facebook Pixel tracking', 'Done', null, null, 'High', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample invoices
INSERT INTO invoices (id, client_id, amount, status, issue_date, due_date, items, notes) VALUES
  ('INV-001', '550e8400-e29b-41d4-a716-446655440001', 15000, 'Paid', '2024-03-01', '2024-03-31', 
   '[{"id": "1", "description": "Google Ads Management - March 2024", "quantity": 1, "rate": 5000, "amount": 5000}, {"id": "2", "description": "Landing Page Design & Development", "quantity": 1, "rate": 7500, "amount": 7500}, {"id": "3", "description": "Content Creation & Copywriting", "quantity": 1, "rate": 2500, "amount": 2500}]',
   'Payment received on time. Great client to work with.'),
  ('INV-002', '550e8400-e29b-41d4-a716-446655440002', 8500, 'Sent', '2024-03-15', '2024-04-15',
   '[{"id": "1", "description": "Social Media Management - March 2024", "quantity": 1, "rate": 3500, "amount": 3500}, {"id": "2", "description": "Brand Identity Package", "quantity": 1, "rate": 5000, "amount": 5000}]',
   'First invoice for new client. Payment terms: Net 30.');