/*
  # Enable public access to all tables

  1. Security Changes
    - Add policies for public access to all tables
    - Allow anonymous access for CRUD operations
*/

-- Add public access policies for groups
CREATE POLICY "Enable public access for groups"
ON groups FOR ALL TO public
USING (true)
WITH CHECK (true);

-- Add public access policies for members
CREATE POLICY "Enable public access for members"
ON members FOR ALL TO public
USING (true)
WITH CHECK (true);

-- Add public access policies for expenses
CREATE POLICY "Enable public access for expenses"
ON expenses FOR ALL TO public
USING (true)
WITH CHECK (true);

-- Add public access policies for expense_participants
CREATE POLICY "Enable public access for expense_participants"
ON expense_participants FOR ALL TO public
USING (true)
WITH CHECK (true);