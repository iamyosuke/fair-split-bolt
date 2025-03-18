/*
  # Initial FairSplit Schema

  1. New Tables
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `currency` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `members`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key)
      - `description` (text)
      - `amount` (decimal)
      - `payer_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `expense_participants`
      - `id` (uuid, primary key)
      - `expense_id` (uuid, foreign key)
      - `member_id` (uuid, foreign key)
      - `share_amount` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS split_even;

-- Create groups table
CREATE TABLE split_even.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create members table
CREATE TABLE split_even.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES split_even.groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE split_even.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES split_even.groups(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount decimal NOT NULL CHECK (amount > 0),
  payer_id uuid REFERENCES split_even.members(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expense_participants table
CREATE TABLE split_even.expense_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid REFERENCES split_even.expenses(id) ON DELETE CASCADE,
  member_id uuid REFERENCES split_even.members(id) ON DELETE CASCADE,
  share_amount decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE split_even.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_even.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_even.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_even.expense_participants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON split_even.groups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON split_even.groups
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON split_even.members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON split_even.members
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON split_even.expenses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON split_even.expenses
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON split_even.expense_participants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON split_even.expense_participants
  FOR INSERT TO authenticated WITH CHECK (true);

/*
  # Enable public access to all tables

  1. Security Changes
    - Add policies for public access to all tables
    - Allow anonymous access for CRUD operations
*/

-- Add public access policies for groups
CREATE POLICY "Enable public access for groups"
ON split_even.groups FOR ALL TO public
USING (true)
WITH CHECK (true);

-- Add public access policies for members
CREATE POLICY "Enable public access for members"
ON split_even.members FOR ALL TO public
USING (true)
WITH CHECK (true);

-- Add public access policies for expenses
CREATE POLICY "Enable public access for expenses"
ON split_even.expenses FOR ALL TO public
USING (true)
WITH CHECK (true);

-- Add public access policies for expense_participants
CREATE POLICY "Enable public access for expense_participants"
ON split_even.expense_participants FOR ALL TO public
USING (true)
WITH CHECK (true);