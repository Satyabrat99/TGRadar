-- ========================================================
-- TGRadar Supabase Database Schema Migration
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ihtjvkpgvgpvmimgypoq/sql/new
-- ========================================================

-- 1. Create Communities Table
CREATE TABLE IF NOT EXISTS public.communities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'channel',
    category TEXT NOT NULL,
    subscribers BIGINT DEFAULT 1000,
    language TEXT DEFAULT 'English',
    verified BOOLEAN DEFAULT true,
    activity TEXT DEFAULT 'Active',
    safety_score INT DEFAULT 98,
    rating NUMERIC(3,2) DEFAULT 4.8,
    tags TEXT[] DEFAULT '{}',
    avatar TEXT,
    banner_bg TEXT,
    link TEXT,
    upvotes INT DEFAULT 1,
    is_community_of_day BOOLEAN DEFAULT false,
    featured_date DATE,               -- Last date this community was featured/trending
    trend_rank INT DEFAULT 0,         -- 1/2/3 = trending rank, 0 = not trending
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 2. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_communities_username ON public.communities(username);
CREATE INDEX IF NOT EXISTS idx_communities_category ON public.communities(category);
CREATE INDEX IF NOT EXISTS idx_communities_tags ON public.communities USING GIN(tags);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Anyone can read communities
CREATE POLICY "Public read access for communities" 
    ON public.communities 
    FOR SELECT 
    USING (true);

-- 5. RLS Policy: Anyone can submit/insert new communities
CREATE POLICY "Public insert access for communities" 
    ON public.communities 
    FOR INSERT 
    WITH CHECK (true);

-- 6. RLS Policy: Anyone can upvote/update communities
CREATE POLICY "Public update access for communities" 
    ON public.communities 
    FOR UPDATE 
    USING (true);

-- 7. Storage Bucket configuration for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Storage Policies
CREATE POLICY "Allow public read access to avatars bucket"
    ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Allow public insert access to avatars bucket"
    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow public update access to avatars bucket"
    ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

