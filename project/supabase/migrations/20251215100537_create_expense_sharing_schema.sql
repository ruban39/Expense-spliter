/*
  # Expense Sharing Application Schema

  ## Overview
  This migration creates the complete database schema for a shared expense management application
  where friends can track expenses, split bills, and calculate settlements.

  ## New Tables
  
  ### `users`
  Stores information about users in the expense group
  - `id` (uuid, primary key) - Unique identifier for each user
  - `name` (text) - User's display name
  - `email` (text, unique) - User's email address (optional for this demo)
  - `color` (text) - Display color for UI
  - `created_at` (timestamptz) - When the user was added
  
  ### `expenses`
  Tracks individual expenses made by users
  - `id` (uuid, primary key) - Unique identifier for each expense
  - `description` (text) - What the expense was for
  - `amount` (numeric) - Total amount of the expense
  - `paid_by` (uuid, foreign key) - References users.id, who paid for this expense
  - `created_at` (timestamptz) - When the expense was recorded
  - `expense_date` (date) - When the expense occurred
  
  ### `expense_splits`
  Defines how each expense is split among users
  - `id` (uuid, primary key) - Unique identifier
  - `expense_id` (uuid, foreign key) - References expenses.id
  - `user_id` (uuid, foreign key) - References users.id
  - `amount` (numeric) - How much this user owes for this expense
  - `created_at` (timestamptz) - When the split was recorded

  ## Security
  - Enable RLS on all tables
  - Public access policies (for demo purposes - in production, use authentication)
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  paid_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expense_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create expense_splits table
CREATE TABLE IF NOT EXISTS expense_splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(expense_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
CREATE POLICY "Allow public read access to users"
  ON users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to users"
  ON users FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to users"
  ON users FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from users"
  ON users FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to expenses"
  ON expenses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to expenses"
  ON expenses FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to expenses"
  ON expenses FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from expenses"
  ON expenses FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to expense_splits"
  ON expense_splits FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to expense_splits"
  ON expense_splits FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to expense_splits"
  ON expense_splits FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from expense_splits"
  ON expense_splits FOR DELETE
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX IF NOT EXISTS idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_splits_user_id ON expense_splits(user_id);

-- Insert sample users (Alice, Bob, Carol)
INSERT INTO users (name, email, color) VALUES
  ('Alice', 'alice@example.com', '#EF4444'),
  ('Bob', 'bob@example.com', '#10B981'),
  ('Carol', 'carol@example.com', '#8B5CF6')
ON CONFLICT (email) DO NOTHING;