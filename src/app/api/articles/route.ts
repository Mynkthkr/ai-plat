import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { sampleArticles } from '@/lib/seed-data';

export async function GET() {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      // Demo mode — return seed data
      return NextResponse.json({ articles: sampleArticles, source: 'demo' });
    }

    // Fetch articles from last 24 hours (strict freshness), ordered by published_date desc
    const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: freshArticles, error } = await supabase
      .from('articles')
      .select('*')
      .gte('published_date', cutoff24h)
      .order('published_date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ articles: sampleArticles, source: 'demo-fallback' });
    }

    // If we have fresh articles within 24h, return them
    if (freshArticles && freshArticles.length > 0) {
      return NextResponse.json({ articles: freshArticles, source: 'supabase' });
    }

    // Fallback: try last 72h of DB articles before falling back to seed data
    // This prevents showing stale seed data when pipeline had a brief gap
    const cutoff72h = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
    const { data: recentArticles } = await supabase
      .from('articles')
      .select('*')
      .gte('published_date', cutoff72h)
      .order('published_date', { ascending: false })
      .limit(20);

    if (recentArticles && recentArticles.length > 0) {
      return NextResponse.json({ articles: recentArticles, source: 'supabase-recent' });
    }

    // Final fallback: demo seed data
    return NextResponse.json({ articles: sampleArticles, source: 'demo-empty' });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ articles: sampleArticles, source: 'demo-error' });
  }
}
