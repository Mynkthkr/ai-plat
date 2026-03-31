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

    // Fetch articles from last 48 hours, ordered by published_date desc
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .gte('published_date', cutoff)
      .order('published_date', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ articles: sampleArticles, source: 'demo-fallback' });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ articles: sampleArticles, source: 'demo-empty' });
    }

    return NextResponse.json({ articles: data, source: 'supabase' });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ articles: sampleArticles, source: 'demo-error' });
  }
}
