/**
 * Smart image picker for AI Pulse articles.
 *
 * Priority order:
 *  1. Real image from RSS source  (best — article-specific)
 *  2. Title keyword match          (good — topic-relevant)
 *  3. Category pool                (ok — category-relevant)
 *  4. Generic AI-tech pool         (last resort)
 *
 * The old pipeline bug saved the same Unsplash photo ID (1677442136019)
 * for every article without an RSS image. We detect and replace it.
 */

const OLD_STATIC_FALLBACK_ID = '1677442136019';

// ── Title keyword → curated Unsplash photo ────────────────────────────────────
// First match wins. All keywords matched case-insensitively on article title.
const KEYWORD_IMAGES: Array<[string[], string]> = [
  [['google', 'gemini', 'deepmind', 'bard', 'waymo', 'google vids', 'google ai'],
   'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=800&auto=format&fit=crop'],
  [['openai', 'chatgpt', 'gpt-4', 'gpt-5', 'sora', 'o1', 'o3'],
   'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=800&auto=format&fit=crop'],
  [['meta', 'llama', 'facebook', 'instagram ai'],
   'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop'],
  [['microsoft', 'azure', 'copilot', 'bing'],
   'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop'],
  [['apple', 'siri', 'ios', 'iphone', 'mac', 'vision pro'],
   'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=800&auto=format&fit=crop'],
  [['nvidia', 'gpu', 'chip', 'semiconductor', 'amd', 'intel', 'processor'],
   'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'],
  [['robot', 'humanoid', 'boston', 'figure', 'optimus', 'tesla bot'],
   'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop'],
  [['video generation', 'image generation', 'midjourney', 'diffusion', 'stable diffusion', 'dall-e', 'art ai'],
   'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=800&auto=format&fit=crop'],
  [['healthcare', 'medical', 'drug', 'cancer', 'clinical', 'hospital', 'diagnosis', 'biotech'],
   'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop'],
  [['security', 'privacy', 'cyber', 'hack', 'breach', 'deepfake', 'scam'],
   'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'],
  [['agent', 'autonomous', 'agentic', 'automation', 'workflow', 'self-driving'],
   'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop'],
  [['code', 'developer', 'programming', 'github', 'cursor', 'software', 'engineer'],
   'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop'],
  [['startup', 'funding', 'investment', 'venture', 'billion', 'million', 'raise', 'ipo'],
   'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop'],
  [['data', 'dataset', 'training', 'benchmark', 'weights', 'parameter'],
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'],
  [['voice', 'speech', 'audio', 'podcast', 'transcription', 'whisper'],
   'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop'],
  [['climate', 'energy', 'sustainability', 'environment', 'carbon', 'solar'],
   'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop'],
  [['grok', 'xai', 'elon', 'musk', 'x.ai', 'twitter'],
   'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=800&auto=format&fit=crop'],
  [['anthropic', 'claude'],
   'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop'],
  [['search', 'perplexity', 'rag', 'retrieval', 'web search'],
   'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop'],
  [['law', 'regulation', 'policy', 'eu ai act', 'congress', 'government', 'ban'],
   'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop'],
  [['space', 'nasa', 'satellite', 'astronomy'],
   'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'],
];

// ── Category-level fallbacks ───────────────────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string[]> = {
  RESEARCH: [
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=800&auto=format&fit=crop',
  ],
  AI_TOOLS: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
  ],
  INDUSTRY: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=80&w=800&auto=format&fit=crop',
  ],
  AI_NEWS: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  ],
};

const DEFAULT_POOL = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
];

function strHash(s: string): number {
  return s.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function getSmartImage(article: {
  id: string;
  title?: string | null;
  category?: string | null;
  image_url?: string | null;
}): string {
  const url = article.image_url;
  const title = (article.title || '').toLowerCase();
  const category = article.category || '';

  // 1. Use the real RSS/source image if it exists and isn't the old bad fallback
  if (url && url !== 'null' && url.trim() !== '' && !url.includes(OLD_STATIC_FALLBACK_ID)) {
    return url;
  }

  // 2. Keyword match on title
  for (const [keywords, imageUrl] of KEYWORD_IMAGES) {
    if (keywords.some((kw) => title.includes(kw))) {
      return imageUrl;
    }
  }

  // 3. Category-specific pool
  const catPool = CATEGORY_IMAGES[category];
  if (catPool && catPool.length > 0) {
    return catPool[strHash(article.id) % catPool.length];
  }

  // 4. Generic pool (deterministic by id)
  return DEFAULT_POOL[strHash(article.id) % DEFAULT_POOL.length];
}
