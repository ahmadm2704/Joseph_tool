-- Add meeting schedule columns to registrations table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS meeting_date TEXT,
ADD COLUMN IF NOT EXISTS meeting_time TEXT;
