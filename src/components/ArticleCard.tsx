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

export default function ArticleCard({ article, index, isRead, onRead }: ArticleCardProps) {
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

  const articleUrl = `/article/${article.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        href={articleUrl}
        onClick={() => onRead(article.id)}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          className="glass-card"
          style={{
            overflow: 'hidden',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            opacity: isRead ? 0.7 : 1,
            position: 'relative',
            border: `1px solid rgba(255,255,255,0.05)`,
            boxShadow: isRead ? 'none' : `0 4px 20px -5px rgba(0,0,0,0.5)`,
            transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Top Border Glow */}
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '3px', 
              background: `linear-gradient(90deg, ${categoryColor}, transparent)`,
              zIndex: 10,
              opacity: isRead ? 0.3 : 1
            }} 
          />

          {/* Image Container */}
          <div
            style={{
              position: 'relative',
              height: '220px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              style={{
                width: '100%',
                height: '100%',
                background: `url(${article.image_url}) center/cover no-repeat`,
              }}
            />
            
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(12,12,12,0.8) 70%, rgba(12,12,12,1) 100%)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                display: 'flex',
                gap: '8px',
                zIndex: 5
              }}
            >
              <span
                style={{
                  padding: '4px 12px',
                  background: `${categoryColor}20`,
                  color: categoryColor,
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${categoryColor}40`,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {categoryIcon} {categoryLabel}
              </span>
            </div>

            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 5 }}>
              {isRead && (
                <div style={{ padding: '6px', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', borderRadius: '50%', backdropFilter: 'blur(10px)' }}>
                  <CheckCircle size={14} />
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)' }}>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: isRead ? 'var(--text-secondary)' : '#ffffff',
                marginBottom: '12px',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                letterSpacing: '-0.2px',
              }}
            >
              {article.title}
            </h3>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '20px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1
              }}
            >
              {article.summary}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <Clock size={14} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatDate(article.published_date)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <BookOpen size={14} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>5 min read</span>
                </div>
              </div>
              
              <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                READ MORE →
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
