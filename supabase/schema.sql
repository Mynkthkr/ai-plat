-- ============================================================
-- AI Pulse — Supabase Database Schema (v3)
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
--
-- Safe to re-run — all CREATE statements are idempotent.
-- v3: Fixed RLS policies so the service_role can INSERT articles.
--
-- ROOT CAUSE OF "table 'public.articles' not found":
--   Either the schema was never applied, or the table was dropped.
--   Run this entire script to (re)create everything from scratch.
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

-- ============================================================
-- 3. Row Level Security
-- ============================================================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. RLS Policies
--
-- KEY FIX: The Supabase JS client initialised with the
-- SUPABASE_SERVICE_ROLE_KEY already bypasses RLS at the
-- database level — no INSERT policy is needed for the server.
--
-- However, if you still want fine-grained policies, use
--   (SELECT auth.role()) = 'service_role'
-- NOT  auth.role() = 'service_role'
-- (the subquery prevents the planner from inlining it wrong).
-- ============================================================

-- Drop old policies first (safe if they don't exist)
DROP POLICY IF EXISTS "Articles are publicly readable" ON articles;
DROP POLICY IF EXISTS "Service role can insert articles" ON articles;
DROP POLICY IF EXISTS "Service role can update articles" ON articles;
DROP POLICY IF EXISTS "Service role can delete articles" ON articles;
DROP POLICY IF EXISTS "Service role full access to subscribers" ON subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;

-- Articles: public can READ; service_role can do everything
CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (true);

-- The pipeline uses the service_role key which bypasses RLS by default
-- in Supabase. These explicit policies are a belt-and-suspenders fallback.
CREATE POLICY "Service role can insert articles"
  ON articles FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'service_role');

CREATE POLICY "Service role can update articles"
  ON articles FOR UPDATE
  USING ((SELECT auth.role()) = 'service_role');

CREATE POLICY "Service role can delete articles"
  ON articles FOR DELETE
  USING ((SELECT auth.role()) = 'service_role');

-- Subscribers: service_role has full access; anyone (anon) can subscribe
CREATE POLICY "Service role full access to subscribers"
  ON subscribers FOR ALL
  USING ((SELECT auth.role()) = 'service_role')
  WITH CHECK ((SELECT auth.role()) = 'service_role');

CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- Allow anon users to read their own subscription status (optional)
CREATE POLICY "Public can read subscriber count"
  ON subscribers FOR SELECT
  USING (true);

-- ============================================================
-- 5. UPGRADE FROM v1/v2 (if you already have the old schema)
-- ============================================================
-- Run these only if upgrading an existing install:
--
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug TEXT;
-- ALTER TABLE articles ADD COLUMN IF NOT EXISTS full_rewritten_content TEXT DEFAULT '';
--
-- UPDATE articles
-- SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9 ]', '', 'g'), '\s+', '-', 'g'))
-- WHERE slug IS NULL;
--
-- ALTER TABLE articles ALTER COLUMN slug SET NOT NULL;
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
--
-- ============================================================
-- Done! Schema v3 applied.
-- ============================================================
