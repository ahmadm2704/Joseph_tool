-- Run this in your Supabase SQL Editor to add the missing category columns

ALTER TABLE courses 
ADD COLUMN document_categories JSONB,
ADD COLUMN qualification_categories JSONB;
