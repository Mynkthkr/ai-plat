/**
 * Cron Job Pipeline — The Content Engine
 *
 * 1. Fetches daily data from FREE RSS feeds
 * 2. FILTERS OUT any article older than 24 hours
 * 3. Sends scraped content through Gemini AI rewriter
 * 4. Stores rewritten articles in Supabase
 * 5. Emails top story to subscribers via Resend
 *
 * Triggered daily by GitHub Actions.
 */

import { createClient } from '@supabase/supabase-js';
import { fetchAINewsRSS } from './fetchers';
import { rewriteArticle } from './ai-rewriter';

// Initialize Supabase (server-side, service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Process RSS articles → Gemini rewrite → Save to Supabase
 * Caps at MAX_ARTICLES_PER_RUN to stay within Gemini free tier daily limits
 */
const MAX_ARTICLES_PER_RUN = 15;

export async function processNewsArticles(): Promise<number> {
  console.log('📰 Fetching AI news from RSS feeds...');
  const rawArticles = await fetchAINewsRSS();
  console.log(`   Found ${rawArticles.length} fresh articles (< 24h)`);
  console.log(`   Processing up to ${MAX_ARTICLES_PER_RUN} articles (free tier limit)`);

  let processed = 0;
  let attempted = 0;

  for (const raw of rawArticles) {
    // Stop if we've hit our per-run cap
    if (processed >= MAX_ARTICLES_PER_RUN) {
      console.log(`   🛑 Reached max articles per run (${MAX_ARTICLES_PER_RUN}). Stopping.`);
      break;
    }

    try {
      // Skip if we already have this source URL
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('original_url', raw.url)
        .single();

      if (existing) {
        console.log(`   ⏭ Skipping (exists): ${raw.title.slice(0, 50)}...`);
        continue;
      }

      // Skip if content is too short to rewrite
      if (raw.content.length < 80) {
        console.log(`   ⏭ Skipping (too short): ${raw.title.slice(0, 50)}...`);
        continue;
      }

      attempted++;

      // AI Rewrite via Gemini
      console.log(`   ✍️ Rewriting [${attempted}]: ${raw.title.slice(0, 50)}...`);

      let rewritten;
      try {
        rewritten = await rewriteArticle(raw.title, raw.content);
      } catch (error) {
        // Daily quota exhausted — stop processing entirely
        if (error instanceof Error && error.message === 'DAILY_QUOTA_EXHAUSTED') {
          console.log('   🚫 Gemini daily quota exhausted. Saving what we have and stopping.');
          break;
        }
        throw error;
      }

      if (!rewritten) {
        console.log(`   ❌ Rewrite failed: ${raw.title.slice(0, 50)}...`);
        continue;
      }

      // Store in Supabase
      const { error } = await supabase.from('articles').insert({
        slug: rewritten.slug,
        title: rewritten.title,
        summary: rewritten.summary,
        rewritten_content: rewritten.content,
        full_rewritten_content: rewritten.fullContent,
        original_url: raw.url,
        source_name: raw.source,
        image_url: raw.imageUrl,
        category: rewritten.category || 'AI_NEWS',
        tags: rewritten.tags || [],
        hype_score: rewritten.hypeScore || 5,
        reality_check: rewritten.realityCheck || '',
        published_date: raw.publishedAt.toISOString(),
      });

      if (error) {
        console.error(`   ❌ Supabase insert error:`, error.message);
        continue;
      }

      processed++;
      console.log(`   ✅ Saved [${processed}/${MAX_ARTICLES_PER_RUN}]: ${rewritten.title.slice(0, 50)}...`);

      // Rate limiting — 5s between Gemini calls (respect free tier: 15 RPM)
      await new Promise((r) => setTimeout(r, 5000));
    } catch (error) {
      console.error(`   ❌ Error processing article:`, error);
    }
  }

  return processed;
}

/**
 * Send daily newsletter to all active subscribers via Resend
 */
export async function sendDailyNewsletter(): Promise<number> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const isMockMode = !resendApiKey;

  if (isMockMode) {
    console.log('📧 RESEND_API_KEY not configured. Running in MOCK MODE (no emails actually sent).');
    console.log('   Add a Resend API key to .env to enable real email sending.');
  } else {
    console.log('📧 Preparing daily newsletter for real delivery...');
  }

  // Get the top article from today
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: topArticle } = await supabase
    .from('articles')
    .select('*')
    .gte('published_date', cutoff)
    .order('published_date', { ascending: false })
    .limit(1)
    .single();

  if (!topArticle) {
    console.log('   ⚠️ No fresh articles to send');
    return 0;
  }

  // Get all active subscribers
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('email')
    .eq('is_active', true);

  if (!subscribers || subscribers.length === 0) {
    console.log('   ⚠️ No active subscribers');
    return 0;
  }

  console.log(`   📬 ${isMockMode ? 'MOCK sending' : 'Sending'} to ${subscribers.length} active subscribers...`);

  let sent = 0;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'AI Pulse <onboarding@resend.dev>';

  // Resend free tier: Send one by one (batch not available in free tier)
  for (const sub of subscribers) {
    try {
      if (isMockMode) {
        console.log(`      → [MOCK] Sent daily brief to ${sub.email}`);
        sent++;
        await new Promise((r) => setTimeout(r, 50)); // tiny mock delay
        continue;
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: sub.email,
          subject: `🤖 AI Pulse Daily: ${topArticle.title}`,
          html: generateEmailHTML(topArticle),
        }),
      });

      if (response.ok) {
        console.log(`      → Sent to ${sub.email}`);
        sent++;
      } else {
        const err = await response.text();
        console.warn(`   ⚠️ Failed for ${sub.email}: ${err}`);
      }

      // Rate limit: 1 email/second (Resend free tier)
      await new Promise((r) => setTimeout(r, 1100));
    } catch (error) {
      console.error(`   ❌ Email error for ${sub.email}:`, error);
    }
  }

  console.log(`   ✅ Successfully ${isMockMode ? 'MOCK ' : ''}sent ${sent}/${subscribers.length} emails`);
  return sent;
}

/**
 * Generate beautiful HTML email for newsletter
 */
function generateEmailHTML(article: {
  title: string;
  summary: string;
  rewritten_content: string;
  original_url: string;
  source_name: string | null;
  image_url: string | null;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#00f0ff;font-size:24px;margin:0;letter-spacing:3px;">⚡ AI PULSE</h1>
      <p style="color:#8888aa;font-size:13px;margin-top:6px;">Your Daily AI Intelligence Briefing</p>
    </div>

    <!-- Article Card -->
    <div style="background-color:#181825;border-radius:16px;overflow:hidden;border:1px solid rgba(0,240,255,0.12);">
      ${article.image_url ? `<img src="${article.image_url}" style="width:100%;height:200px;object-fit:cover;" alt="">` : ''}
      <div style="padding:28px;">
        <span style="display:inline-block;padding:4px 12px;background-color:rgba(0,240,255,0.1);color:#00f0ff;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">TOP STORY</span>
        <h2 style="color:#ffffff;font-size:20px;line-height:1.4;margin:0 0 12px;">${article.title}</h2>
        <p style="color:#8888aa;font-size:14px;line-height:1.7;margin:0 0 20px;">${article.summary}</p>
        ${article.source_name ? `<p style="color:#555566;font-size:12px;margin:0 0 20px;">Source: ${article.source_name}</p>` : ''}
        <a href="${article.original_url}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#00f0ff,#b400ff);color:#050508;font-size:14px;font-weight:700;border-radius:8px;text-decoration:none;">Read Full Article →</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);">
      <p style="color:#555566;font-size:11px;margin:0;">
        You're receiving this because you subscribed to AI Pulse.
        <br>Auto-curated AI news, delivered daily.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Main Pipeline — runs the full daily automation
 */
export async function runFullPipeline(): Promise<{
  articles: number;
  emailsSent: number;
  duration: number;
}> {
  const startTime = Date.now();

  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  🚀 AI PULSE — Daily Pipeline Starting    ');
  console.log('═══════════════════════════════════════════');
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log('');

  let articles = 0;
  let emailsSent = 0;

  try {
    // Step 1: Fetch & Rewrite articles
    articles = await processNewsArticles();

    // Step 2: Send newsletter
    emailsSent = await sendDailyNewsletter();

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('  ✅ Pipeline Completed Successfully');
    console.log(`  📰 Articles processed: ${articles}`);
    console.log(`  📧 Emails sent: ${emailsSent}`);
    console.log(`  ⏱ Duration: ${duration}s`);
    console.log('═══════════════════════════════════════════');
    console.log('');

    return { articles, emailsSent, duration };
  } catch (error) {
    console.error('❌ Pipeline failed:', error);
    throw error;
  }
}
