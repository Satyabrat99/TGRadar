-- ========================================================
-- TGRadar Migration: Add featured_date and trend_rank
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ihtjvkpgvgpvmimgypoq/sql/new
-- ========================================================

ALTER TABLE public.communities 
  ADD COLUMN IF NOT EXISTS featured_date DATE,
  ADD COLUMN IF NOT EXISTS trend_rank INT DEFAULT 0;

-- Index for fast trending queries
CREATE INDEX IF NOT EXISTS idx_communities_trend_rank ON public.communities(trend_rank);
CREATE INDEX IF NOT EXISTS idx_communities_featured_date ON public.communities(featured_date);
