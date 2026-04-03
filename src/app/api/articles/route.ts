import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { sampleArticles } from '@/lib/seed-data';

export async function GET() {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      // Demo mode — return seed data with freshness tags
      return NextResponse.json({
        articles: tagFreshness(sampleArticles),
        source: 'demo',
      });
    }

    // Fetch articles from last 4 days so the site always has content
    const cutoff4d = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .gte('published_date', cutoff4d)
      .order('published_date', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({
        articles: tagFreshness(sampleArticles),
        source: 'demo-fallback',
      });
    }

    if (articles && articles.length > 0) {
      return NextResponse.json({
        articles: tagFreshness(articles),
        source: 'supabase',
      });
    }

    // Final fallback: demo seed data
    return NextResponse.json({
      articles: tagFreshness(sampleArticles),
      source: 'demo-empty',
    });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({
      articles: tagFreshness(sampleArticles),
      source: 'demo-error',
    });
  }
}

/**
 * Tag each article with a `freshness` field:
 *  - "hot"    → published within the last 24 hours
 *  - "recent" → published within the last 3 days
 *  - "older"  → everything else
 */
function tagFreshness<T extends { published_date: string }>(
  articles: T[]
): (T & { freshness: 'hot' | 'recent' | 'older' })[] {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  return articles.map((a) => {
    const age = now - new Date(a.published_date).getTime();
    let freshness: 'hot' | 'recent' | 'older';

    if (age < DAY) {
      freshness = 'hot';
    } else if (age < 3 * DAY) {
      freshness = 'recent';
    } else {
      freshness = 'older';
    }

    return { ...a, freshness };
  });
}
