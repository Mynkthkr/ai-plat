/**
 * AI Content Rewriting Service
 *
 * Uses Google Gemini (free tier) to rewrite scraped content
 * into FULL, comprehensive, engaging articles (not summaries).
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export interface RewrittenArticle {
  title: string;
  slug: string;
  summary: string;
  content: string;         // short excerpt for cards
  fullContent: string;     // full-length article for the reader page
  tags: string[];
  category: string;
  hypeScore?: number;
  realityCheck?: string;
}

const REWRITE_PROMPT = `You are an expert AI journalist for "AI Pulse", a premium tech news platform.

Take the provided news article and rewrite it into a FULL, highly engaging, comprehensive, and 100% UNIQUE article that readers will want to read from start to finish.

RULES:
1. COMPLETELY rewrite — do NOT copy any sentences from the original
2. Write a FULL article: 600-1200 words
3. Use clear markdown structure with ## and ### headers
4. Structure: Engaging intro → Key details → Analysis → Why it matters → What's next
5. Write in a professional yet accessible and opinionated tone
6. Include specific numbers, comparisons, and context where possible
7. Be factual and accurate — don't invent statistics
8. The article must stand alone — a reader should fully understand the topic

ALSO provide a SHORT card summary (1-2 sentences, max 200 chars) for the homepage preview.

Generate a URL-friendly slug from the title (lowercase, hyphens, no special chars, max 80 chars).

OUTPUT FORMAT (respond ONLY with valid JSON, no markdown code blocks):
{
  "title": "A compelling, clear title (different from original)",
  "slug": "url-friendly-slug-from-title",
  "summary": "Short 1-2 sentence card summary (max 200 chars)",
  "content": "A 2-3 sentence preview excerpt for homepage cards",
  "fullContent": "The FULL rewritten article in markdown (600-1200 words with ## headers)",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "AI_NEWS | AI_TOOLS | AI_MEMES | AI_USE_CASES | PROMPT_OF_DAY | AI_TUTORIALS | RESEARCH | PRODUCT_LAUNCH | INDUSTRY",
  "hypeScore": 8,
  "realityCheck": "A short, grounded 1-sentence reality check separating the hype from the actual utility."
}`;

export async function rewriteWithGemini(
  originalTitle: string,
  originalContent: string
): Promise<RewrittenArticle | null> {
  if (!gemini) {
    console.error('Gemini API key not configured');
    return null;
  }

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${REWRITE_PROMPT}\n\nORIGINAL TITLE: ${originalTitle}\n\nORIGINAL CONTENT:\n${originalContent.slice(0, 3000)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response (Gemini may wrap in markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Gemini response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as RewrittenArticle;

    // Validate required fields
    if (!parsed.title || !parsed.summary || !parsed.fullContent) {
      console.error('Missing required fields in Gemini response');
      return null;
    }

    // Ensure slug exists
    if (!parsed.slug) {
      parsed.slug = parsed.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 80);
    }

    // Ensure content fallback
    if (!parsed.content) {
      parsed.content = parsed.summary;
    }

    return parsed;
  } catch (error) {
    console.error('Gemini rewrite error:', error);
    return null;
  }
}

/**
 * Main rewrite function — uses Gemini (free tier)
 */
export async function rewriteArticle(
  originalTitle: string,
  originalContent: string
): Promise<RewrittenArticle | null> {
  return rewriteWithGemini(originalTitle, originalContent);
}
