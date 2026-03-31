-- ============================================================
-- AI Pulse — Supabase Database Schema (v2)
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
--
-- If upgrading from v1, run the ALTER statements at the bottom.
-- ============================================================

-- 1. Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  rewritten_content TEXT NOT NULL,
  full_rewritten_content TEXT NOT NULL DEFAULT '',
  original_url TEXT NOT NULL UNIQUE,
  source_name TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'AI_NEWS',
  tags TEXT[] DEFAULT '{}',
  hype_score INT,
  reality_check TEXT,
  published_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON articles (published_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_original_url ON articles (original_url);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);

-- 2. Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  joined_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast subscriber queries
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers (is_active);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);

-- 3. Enable Row Level Security (RLS) on both tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Articles: anyone can read, only service role can insert/update
CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert articles"
  ON articles FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update articles"
  ON articles FOR UPDATE
  USING (auth.role() = 'service_role');

-- Subscribers: service role can do everything, anon can insert (subscribe)
CREATE POLICY "Service role full access to subscribers"
  ON subscribers FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- UPGRADE FROM v1 (if you already have the old schema):
-- Uncomment and run the following statements:
-- ============================================================
--
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug TEXT;
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS full_rewritten_content TEXT DEFAULT '';
--
-- -- Generate slugs for existing articles
-- UPDATE articles
-- SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9 ]', '', 'g'), '\s+', '-', 'g'))
-- WHERE slug IS NULL;
--
-- ALTER TABLE articles ALTER COLUMN slug SET NOT NULL;
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
--
-- ============================================================
-- Done! Your tables are ready.
-- ============================================================
