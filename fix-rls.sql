-- Run this in your Supabase SQL Editor to fix the permission issues

-- Allow anyone to insert, update, and delete courses (since your admin panel uses local authentication)
CREATE POLICY "Anyone can insert courses" ON courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update courses" ON courses FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete courses" ON courses FOR DELETE USING (true);

-- Allow anyone to update and delete registrations (from the admin panel)
CREATE POLICY "Anyone can update registrations" ON registrations FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete registrations" ON registrations FOR DELETE USING (true);
CREATE POLICY "Anyone can view registrations" ON registrations FOR SELECT USING (true);

-- Allow anyone to view and manage contact messages
CREATE POLICY "Anyone can view contact messages" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can update contact messages" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete contact messages" ON contact_messages FOR DELETE USING (true);
