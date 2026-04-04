import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { sampleArticles } from '@/lib/seed-data';
import { getSmartImage } from '@/lib/image-utils';

function ensureImage<T extends { id: string; title?: string | null; category?: string | null; image_url?: string | null }>(article: T): T {
  return { ...article, image_url: getSmartImage(article) };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check Supabase first
    const supabase = getSupabase();
    if (supabase) {
      // Try by ID
      const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (article) {
        return NextResponse.json({ article: ensureImage(article) });
      }

      // Try by slug
      const { data: bySlug } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', id)
        .single();

      if (bySlug) {
        return NextResponse.json({ article: ensureImage(bySlug) });
      }
    }

    // Fallback: demo data
    const found = sampleArticles.find((a) => a.id === id || a.slug === id);
    if (found) {
      return NextResponse.json({ article: ensureImage(found) });
    }

    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
