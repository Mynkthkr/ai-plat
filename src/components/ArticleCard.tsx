'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, BookOpen, CheckCircle } from 'lucide-react';
import { ArticleDisplay, categoryColors, categoryLabels, categoryIcons } from '@/lib/types';

interface ArticleCardProps {
  article: ArticleDisplay & { freshness?: 'hot' | 'recent' | 'older' };
  index: number;
  isRead: boolean;
  onRead: (id: string) => void;
  compact?: boolean;
}

export default function ArticleCard({ article, index, isRead, onRead, compact = false }: ArticleCardProps) {
  const categoryColor = categoryColors[article.category] || '#00f0ff';
  const categoryLabel = categoryLabels[article.category] || article.category;
  const categoryIcon = categoryIcons?.[article.category] || '📰';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Internal link — NO external redirects
  const articleUrl = `/article/${article.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 80 }}
    >
      <Link
        href={articleUrl}
        onClick={() => onRead(article.id)}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          className="glass-card card-hover-glow"
          style={{
            overflow: 'hidden',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: compact ? 'row' : 'column',
            opacity: isRead ? 0.6 : 1,
            transition: 'opacity 300ms ease, transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
          }}
        >
          {/* Image */}
          {article.image_url && !compact && (
            <div
              style={{
                position: 'relative',
                height: '180px',
                background: `url(${article.image_url}) center/cover`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(18, 18, 26, 0.95))',
                }}
              />
              {/* Category badge on image */}
              <span
                className="badge"
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: `${categoryColor}18`,
                  color: categoryColor,
                  border: `1px solid ${categoryColor}35`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                {categoryIcon} {categoryLabel}
              </span>

              {/* Read badge */}
              {isRead && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    background: 'rgba(0, 255, 136, 0.12)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: 'var(--neon-green)',
                    fontFamily: "'JetBrains Mono', monospace",
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CheckCircle size={11} />
                  Read
                </div>
              )}
            </div>
          )}

          {/* Compact image */}
          {article.image_url && compact && (
            <div
              style={{
                width: '100px',
                minHeight: '100px',
                background: `url(${article.image_url}) center/cover`,
                flexShrink: 0,
                borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
              }}
            />
          )}

          {/* Content */}
          <div style={{ padding: compact ? '14px 16px' : '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Category badge (if no image or compact) */}
            {(!article.image_url || compact) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: compact ? '8px' : '12px', flexWrap: 'wrap' }}>
                <span
                  className="badge"
                  style={{
                    background: `${categoryColor}12`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}35`,
                    fontSize: compact ? '0.6rem' : undefined,
                  }}
                >
                  {categoryIcon} {categoryLabel}
                </span>

                {isRead && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: 'var(--neon-green)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <CheckCircle size={11} />
                    Read
                  </span>
                )}
              </div>
            )}

            <h3
              style={{
                fontSize: compact ? '0.9rem' : '1.05rem',
                fontWeight: 700,
                color: isRead ? 'var(--text-secondary)' : 'var(--text-glow)',
                marginBottom: compact ? '6px' : '10px',
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 300ms ease',
              }}
            >
              {article.title}
            </h3>

            {!compact && (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '14px',
                }}
              >
                {article.summary}
              </p>
            )}

            {/* Tags (not compact) */}
            {!compact && article.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.62rem',
                      padding: '3px 8px',
                      background: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: compact ? '8px' : '12px',
                borderTop: compact ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                marginTop: compact ? 'auto' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <Clock size={12} />
                  {formatDate(article.published_date)}
                </span>
                {article.source_name && !compact && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    · {article.source_name}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neon-cyan)', fontSize: '0.72rem' }}>
                <BookOpen size={13} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>Read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
