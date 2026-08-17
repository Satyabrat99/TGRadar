-- ========================================================
-- TGRadar Analytics & Traffic Tracking Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ihtjvkpgvgpvmimgypoq/sql/new
-- ========================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,         -- 'page_view', 'join_clicked', 'search_performed', 'category_viewed'
    visitor_id TEXT NOT NULL,         -- Anonymous unique device/browser UUID
    page_path TEXT DEFAULT '/',
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet'
    community_id TEXT,               -- For join_clicked events
    community_title TEXT,
    category TEXT,
    search_query TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes for fast dashboard aggregations
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON public.analytics_events(visitor_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous write access for recording visits
CREATE POLICY "Allow public insert to analytics_events"
    ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Allow public read access for viewing analytics dashboard
CREATE POLICY "Allow public read from analytics_events"
    ON public.analytics_events FOR SELECT USING (true);
