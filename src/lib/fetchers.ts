/**
 * RSS Content Fetcher
 *
 * Fetches AI news from free RSS feeds (Google News, TechCrunch, etc.)
 * with strict 24-hour filtering. No paid APIs required.
 */

import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'AI-Pulse/2.0 (News Aggregator)',
  },
});

export interface RSSArticle {
  title: string;
  content: string;
  url: string;
  source: string;
  imageUrl: string | null;
  publishedAt: Date;
}

// Free RSS feeds for AI news
const RSS_FEEDS = [
  {
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+business+impact+OR+AI+enterprise+adoption&hl=en-US&gl=US&ceid=US:en',
    name: 'AI Business Impact',
  },
  {
    url: 'https://news.google.com/rss/search?q=AI+productivity+hacks+OR+how+to+work+faster+with+AI&hl=en-US&gl=US&ceid=US:en',
    name: 'AI Productivity',
  },
  {
    url: 'https://news.google.com/rss/search?q=AI+automation+workflows+OR+autonomous+agents+automation&hl=en-US&gl=US&ceid=US:en',
    name: 'AI Automation',
  },
  {
    url: 'https://blog.google/technology/ai/rss/',
    name: 'Google AI Blog',
  },
  {
    url: 'https://openai.com/blog/rss.xml',
    name: 'OpenAI Blog',
  },
  {
    url: 'https://news.google.com/rss/search?q=ChatGPT+OR+Gemini+OR+Claude+AI+updates&hl=en-US&gl=US&ceid=US:en',
    name: 'LLM Major Updates',
  },
  {
    url: 'https://news.google.com/rss/search?q=how+to+learn+AI+for+beginners+OR+AI+roadmap+guide&hl=en-US&gl=US&ceid=US:en',
    name: 'AI Learning Guides',
  },
  {
    url: 'https://news.google.com/rss/search?q=free+AI+models+OR+open+source+LLM+release+OR+free+tier+AI+tool&hl=en-US&gl=US&ceid=US:en',
    name: 'Free AI Models & Tools',
  },
  {
    url: 'https://news.google.com/rss/search?q=Claude+Code+OR+AI+coding+editor+OR+developer+AI+workflow+tips&hl=en-US&gl=US&ceid=US:en',
    name: 'AI Coding Workflow Tips',
  },
];

/**
 * CRITICAL: Filter out any article older than 24 hours.
 */
function isWithin24Hours(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const articleDate = new Date(dateStr);
  if (isNaN(articleDate.getTime())) return false;

  const now = new Date();
  const diffMs = now.getTime() - articleDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours >= 0 && diffHours <= 24;
}

/**
 * Extract image URL from RSS item content
 */
function extractImageUrl(item: Parser.Item): string | null {
  // Check for media content
  const mediaContent = (item as Record<string, unknown>)['media:content'] as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  // Check for enclosure
  if (item.enclosure?.url) return item.enclosure.url;

  // Try to extract from content HTML
  const content = item.content || (item as Record<string, string>)['content:encoded'] || '';
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch?.[1]) return imgMatch[1];

  return null;
}

/**
 * Fetch all AI news from RSS feeds with strict 24-hour filter.
 */
export async function fetchAINewsRSS(): Promise<RSSArticle[]> {
  const allArticles: RSSArticle[] = [];
  const seenUrls = new Set<string>();

  console.log('📡 Fetching from RSS feeds...');

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`   → ${feed.name}...`);
      const parsed = await parser.parseURL(feed.url);

      for (const item of parsed.items || []) {
        // CRITICAL: Strict 24-hour time filter
        const pubDate = item.pubDate || item.isoDate;
        if (!isWithin24Hours(pubDate)) continue;

        // Skip duplicates by URL
        const url = item.link || '';
        if (!url || seenUrls.has(url)) continue;
        seenUrls.add(url);

        // Must have title and some content
        const title = item.title?.trim();
        const content = item.contentSnippet || item.content || item.summary || '';
        if (!title || content.length < 50) continue;

        allArticles.push({
          title,
          content: content.slice(0, 3000), // Cap content length for AI rewriting
          url,
          source: feed.name,
          imageUrl: extractImageUrl(item),
          publishedAt: new Date(pubDate!),
        });
      }

      console.log(`   ✅ ${feed.name}: found items`);
    } catch (error) {
      console.warn(`   ⚠️ ${feed.name} failed:`, (error as Error).message);
    }
  }

  // Sort by newest first, take top 15
  allArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  console.log(`📰 Total fresh articles (< 24h): ${allArticles.length}`);
  return allArticles.slice(0, 15);
}
