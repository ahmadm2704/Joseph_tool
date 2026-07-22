-- ==============================================================================
-- SUPABASE SCHEMA SETUP FOR COURSEPRO
-- Run this script in the Supabase SQL Editor to create all required tables
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COURSES TABLE
-- Storing cities and days as JSONB arrays to keep everything in one table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT,
    deadline TEXT,
    delivery TEXT,
    days_schedule TEXT,
    requirements TEXT,
    cities JSONB DEFAULT '[]'::jsonb,
    days JSONB DEFAULT '[]'::jsonb,
    document_categories JSONB,
    qualification_categories JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. REGISTRATIONS TABLE
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    city_name TEXT,
    day_schedule TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    document_url TEXT, -- To store the attached document URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CONTACT MESSAGES TABLE (For the contact form data)
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread', -- can be 'unread', 'read', 'replied'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access
CREATE POLICY "Public courses are viewable by everyone." ON courses FOR SELECT USING (true);

-- Create Policies for Public Insert (Anyone can submit a registration or contact form)
CREATE POLICY "Anyone can submit a registration." ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit a contact message." ON contact_messages FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET FOR DOCUMENTS (Optional)
-- ==============================================================================
-- If you want to store files in Supabase Storage, create a public bucket named "documents"
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
CREATE POLICY "Anyone can upload a document." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Anyone can view documents." ON storage.objects FOR SELECT USING (bucket_id = 'documents');
