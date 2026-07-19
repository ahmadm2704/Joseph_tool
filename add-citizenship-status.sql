-- Run this in your Supabase SQL Editor to add the citizenship_status column

ALTER TABLE registrations 
ADD COLUMN citizenship_status TEXT;
