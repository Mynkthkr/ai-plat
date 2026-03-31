'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ExternalLink, Share2, BookOpen, Tag, Bone, Activity } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { sampleArticles } from '@/lib/seed-data';
import { ArticleDisplay, categoryColors, categoryLabels, categoryIcons } from '@/lib/types';
import { useReadArticles } from '@/hooks/useReadArticles';

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const [article, setArticle] = useState<ArticleDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const { markAsRead } = useReadArticles();

  const [isDogMode, setIsDogMode] = useState(false);
  const [dogExplanation, setDogExplanation] = useState<string | null>(null);
  const [isDogLoading, setIsDogLoading] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      // Try to fetch from API first (Supabase)
      try {
        const res = await fetch(`/api/articles/${articleId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.article) {
            setArticle(data.article);
            markAsRead(data.article.id);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to demo data
      }

      // Fallback: find in demo data
      const found = sampleArticles.find((a) => a.id === articleId);
      if (found) {
        setArticle(found);
        markAsRead(found.id);
      }
      setLoading(false);
    }

    loadArticle();
  }, [articleId, markAsRead]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDogToggle = async () => {
    if (!isDogMode && !dogExplanation) {
      setIsDogLoading(true);
      try {
        // Robust text extraction — fall through all possible content fields
        const articleText =
          article?.full_rewritten_content ||
          article?.rewritten_content ||
          article?.summary ||
          article?.title ||
          '';

        if (!articleText || articleText.trim().length < 10) {
          setDogExplanation("*tilts head* There's nothing to sniff here! WOOF!");
          setIsDogLoading(false);
          setIsDogMode(true);
          return;
        }

        const res = await fetch('/api/dog-explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: articleText }),
        });
        const data = await res.json();
        setDogExplanation(data.explanation);
      } catch (err) {
        setDogExplanation("*sad whimper* I couldn't fetch the explanation right now. WOOF!");
      }
      setIsDogLoading(false);
    }
    setIsDogMode(!isDogMode);
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '100px',
          }}
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--neon-cyan)',
              fontSize: '0.9rem',
            }}
          >
            Loading article...
          </motion.div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '100px',
            gap: '20px',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-glow)' }}>Article Not Found</h1>
          <Link
            href="/"
            style={{
              color: 'var(--neon-cyan)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const categoryColor = categoryColors[article.category] || '#00f0ff';
  const categoryLabel = categoryLabels[article.category] || article.category;
  const categoryIcon = categoryIcons?.[article.category] || '📰';
  const fullContent = article.full_rewritten_content || article.rewritten_content;

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Navbar />

      <article style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        {/* Hero image */}
        {article.image_url && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: '420px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '420px',
                background: `url(${article.image_url}) center/cover`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(5, 5, 8, 0.2) 0%, rgba(5, 5, 8, 0.95) 100%)',
              }}
            />
          </div>
        )}

        {/* Content container */}
        <div
          style={{
            maxWidth: '780px',
            margin: article.image_url ? '-120px auto 0' : '0 auto',
            padding: '0 24px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.78rem',
                marginBottom: '28px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'var(--bg-card)',
                transition: 'all 200ms ease',
              }}
            >
              <ArrowLeft size={14} />
              Back to feed
            </Link>
          </motion.div>

          {/* Category + metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}
          >
            <span
              className="badge"
              style={{
                background: `${categoryColor}15`,
                color: categoryColor,
                border: `1px solid ${categoryColor}35`,
                fontSize: '0.75rem',
                padding: '6px 14px',
              }}
            >
              {categoryIcon} {categoryLabel}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <Clock size={13} />
              {formatDate(article.published_date)}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <BookOpen size={13} />
              {formatReadTime(fullContent)}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 60 }}
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-glow)',
              lineHeight: 1.25,
              marginBottom: '16px',
              letterSpacing: '-0.5px',
            }}
          >
            {article.title}
          </motion.h1>

          {/* Hype vs Reality Meter */}
          {((article as any).hype_score !== undefined || (article as any).hypeScore !== undefined) ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                marginBottom: '24px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} color="var(--neon-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-glow)', letterSpacing: '0.5px' }}>HYPE METER</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>
                  {((article as any).hype_score || (article as any).hypeScore || 5)}/10
                </span>
              </div>
              
              <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.4)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(((article as any).hype_score || (article as any).hypeScore || 5) / 10) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #00ff88, #ffaa00, #ff6b6b)',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '2px solid var(--neon-cyan)', paddingLeft: '12px' }}>
                "{(article as any).reality_check || (article as any).realityCheck || 'A grounded perspective on the actual utility.'}"
              </div>
            </motion.div>
          ) : null}

          {/* Summary */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '20px',
              fontStyle: 'italic',
              borderLeft: `3px solid ${categoryColor}50`,
              paddingLeft: '16px',
            }}
          >
            {article.summary}
          </motion.p>

          {/* Source + Actions bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {article.source_name && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Source: {article.source_name}
              </span>
            )}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 200ms ease',
                }}
              >
                <Share2 size={13} />
                Share
              </button>
              {/* Only show Original Source for real pipeline articles (not demo) */}
              {article.original_url && !article.id.startsWith('demo-') && (
                <a
                  href={article.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: 'rgba(0, 240, 255, 0.06)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--neon-cyan)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    textDecoration: 'none',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <ExternalLink size={13} />
                  Original Source ↗
                </a>
              )}
              <button
                onClick={handleDogToggle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: isDogMode ? 'rgba(255, 170, 0, 0.15)' : 'var(--bg-elevated)',
                  border: `1px solid ${isDogMode ? 'rgba(255, 170, 0, 0.5)' : 'rgba(255, 255, 255, 0.06)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: isDogMode ? '#ffaa00' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 200ms ease',
                }}
              >
                <Bone size={13} />
                Dog Mode {isDogMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </motion.div>

          {/* Full article body OR Dog Mode */}
          {isDogMode ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '24px',
                background: 'rgba(255, 170, 0, 0.05)',
                borderRadius: '16px',
                border: '1px dashed rgba(255, 170, 0, 0.3)',
                color: '#ffdd99',
                fontSize: '1.1rem',
                lineHeight: 1.8,
              }}
            >
              <style>{`.dog-mode p { margin-bottom: 1em; } .dog-mode strong { color: #ffaa00; font-weight: bold; }`}</style>
              {isDogLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', padding: '40px 0' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Bone size={24} color="#ffaa00" />
                  </motion.div>
                  <span>Sniffing out the explanation... *tail wags*</span>
                </div>
              ) : (
                <div className="dog-mode" dangerouslySetInnerHTML={{ __html: renderMarkdown(dogExplanation || '') }} />
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="article-body"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(fullContent) }}
            />
          )}

          {/* Tags at bottom */}
          {article.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '48px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                flexWrap: 'wrap',
              }}
            >
              <Tag size={14} color="var(--text-muted)" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.7rem',
                    padding: '5px 12px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-secondary)',
                    fontFamily: "'JetBrains Mono', monospace",
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Back to feed CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ textAlign: 'center', marginTop: '56px' }}
          >
            <Link
              href="/"
              className="btn-solid"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                textDecoration: 'none',
                fontSize: '0.85rem',
              }}
            >
              <ArrowLeft size={16} />
              Back to AI Pulse Feed
            </Link>
          </motion.div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

/**
 * Simple markdown-to-HTML renderer for article content.
 * Handles headers, bold, italic, lists, code blocks, links, and tables.
 */
function renderMarkdown(md: string): string {
  if (!md) return '';

  let html = md
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
      return `<pre class="code-block"><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) return ''; // separator row
      const tag = 'td';
      return `<tr>${cells.map((c) => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
    })
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');

  // Wrap in paragraph tags
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-3]>)/g, '$1');
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr \/>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

  // Wrap loose <li> in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul><ul>/g, '');

  // Wrap <tr> in <table>
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table>$1</table>');
  html = html.replace(/<\/table><table>/g, '');

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
