'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SectionHeader from '@/components/SectionHeader';
import ArticleCard from '@/components/ArticleCard';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import TechRoastWidget from '@/components/TechRoastWidget';
import Footer from '@/components/Footer';
import { sampleArticles } from '@/lib/seed-data';
import { useReadArticles } from '@/hooks/useReadArticles';
import { CONTENT_SECTIONS, categoryColors, categoryIcons } from '@/lib/types';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

export default function Home() {
  const { markAsRead, isRead, loaded: hooksLoaded } = useReadArticles();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  
  const [articles, setArticles] = useState(sampleArticles);
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    async function fetchLiveArticles() {
      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            setArticles(data.articles);
          }
        }
      } catch (err) {
        console.error('Error fetching live articles:', err);
      } finally {
        setDbLoaded(true);
      }
    }
    fetchLiveArticles();
  }, []);

  const loaded = hooksLoaded && dbLoaded;

  // Filter articles by selected tab
  const filteredArticles = useMemo(() => {
    if (activeTab === 'ALL') return articles;
    return articles.filter((a) => a.category === activeTab);
  }, [articles, activeTab]);

  // Get articles by category for horizontal sections
  const getByCategory = (cat: string) => articles.filter((a) => a.category === cat);

  // Highlight sections for the non-ALL view
  const promptArticles = getByCategory('PROMPT_OF_DAY');
  const memeArticles = getByCategory('AI_MEMES');
  const tutorialArticles = getByCategory('AI_TUTORIALS');
  const toolArticles = getByCategory('AI_TOOLS');
  const useCaseArticles = getByCategory('AI_USE_CASES');

  const featuredArticle = articles[0];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Navbar />
      <HeroSection />

      <main className="container-main" style={{ paddingTop: '32px' }} id="feed">
        {/* Newsletter */}
        <NewsletterSubscribe />

        {/* Tech Roast */}
        <div style={{ marginBottom: '64px' }}>
          <TechRoastWidget />
        </div>

        {/* ═══════════════════════════════════════
             FEATURED TOP STORY
             ═══════════════════════════════════════ */}
        {featuredArticle && loaded && (
          <section style={{ marginBottom: '64px' }}>
            <SectionHeader
              title="Top Story"
              subtitle="Today's most impactful AI development"
              accentColor="var(--neon-pink)"
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 60 }}
            >
              <Link
                href={`/article/${featuredArticle.id}`}
                onClick={() => markAsRead(featuredArticle.id)}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  className="glass-card card-hover-glow"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: featuredArticle.image_url ? '1fr 1fr' : '1fr',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    opacity: isRead(featuredArticle.id) ? 0.55 : 1,
                    transition: 'opacity 300ms ease',
                  }}
                >
                  {featuredArticle.image_url && (
                    <div
                      style={{
                        position: 'relative',
                        minHeight: '280px',
                        background: `url(${featuredArticle.image_url}) center/cover`,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, transparent 60%, rgba(18, 18, 26, 0.8))',
                        }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span className="badge badge-pink">🔥 Featured</span>
                      {isRead(featuredArticle.id) && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--neon-green)', fontFamily: "'JetBrains Mono', monospace" }}>
                          ✓ Read
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', fontWeight: 700, color: isRead(featuredArticle.id) ? 'var(--text-secondary)' : 'var(--text-glow)', marginBottom: '12px', lineHeight: 1.3 }}>
                      {featuredArticle.title}
                    </h2>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '20px' }}>
                      {featuredArticle.summary}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {featuredArticle.source_name}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>·</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <BookOpen size={13} /> Read full article
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </section>
        )}

        {/* ═══════════════════════════════════════
             HORIZONTAL SPOTLIGHT SECTIONS
             ═══════════════════════════════════════ */}

        {/* ✨ PROMPT OF THE DAY — Spotlight Section */}
        {loaded && promptArticles.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <SectionHeader
              title="✨ Prompt of the Day"
              subtitle="Daily curated AI prompts to supercharge your workflow"
              accentColor="#b400ff"
            />
            <div className="scroll-section">
              {promptArticles.map((article) => (
                <div key={article.id} className="scroll-card">
                  <Link
                    href={`/article/${article.id}`}
                    onClick={() => markAsRead(article.id)}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="glass-card card-hover-glow"
                      style={{
                        padding: '24px',
                        height: '100%',
                        cursor: 'pointer',
                        opacity: isRead(article.id) ? 0.6 : 1,
                        borderTop: '3px solid #b400ff40',
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✨</div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-glow)', marginBottom: '8px', lineHeight: 1.35 }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.summary}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {formatDate(article.published_date)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#b400ff', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Try it <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 🛠️ AI TOOLS — Horizontal Scroll */}
        {loaded && toolArticles.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <SectionHeader
              title="🛠️ New AI Tools"
              subtitle="Latest launches and updates"
              accentColor="#00ff88"
            />
            <div className="scroll-section">
              {toolArticles.map((article, i) => (
                <div key={article.id} className="scroll-card">
                  <ArticleCard article={article} index={i} isRead={isRead(article.id)} onRead={markAsRead} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 😂 AI MEMES — Highlight Cards */}
        {loaded && memeArticles.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <SectionHeader
              title="😂 AI Memes"
              subtitle="Because even AI needs to laugh"
              accentColor="#ff6b6b"
            />
            <div className="scroll-section">
              {memeArticles.map((article) => (
                <div key={article.id} className="scroll-card">
                  <Link
                    href={`/article/${article.id}`}
                    onClick={() => markAsRead(article.id)}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="glass-card card-hover-glow"
                      style={{
                        padding: '24px',
                        height: '100%',
                        cursor: 'pointer',
                        opacity: isRead(article.id) ? 0.6 : 1,
                        background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.06), rgba(180, 0, 255, 0.04))',
                        borderTop: '3px solid #ff6b6b40',
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>😂</div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-glow)', marginBottom: '8px', lineHeight: 1.35 }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.summary}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {formatDate(article.published_date)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#ff6b6b', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Read <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 💡 AI USE CASES — Horizontal Scroll */}
        {loaded && useCaseArticles.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <SectionHeader
              title="💡 AI Use Cases"
              subtitle="What people are building with AI"
              accentColor="#ffaa00"
            />
            <div className="scroll-section">
              {useCaseArticles.map((article, i) => (
                <div key={article.id} className="scroll-card">
                  <ArticleCard article={article} index={i} isRead={isRead(article.id)} onRead={markAsRead} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 📚 AI TUTORIALS — Horizontal Scroll */}
        {loaded && tutorialArticles.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <SectionHeader
              title="📚 Tutorial Snippets"
              subtitle="Quick AI how-to guides and code snippets"
              accentColor="#ff00aa"
            />
            <div className="scroll-section">
              {tutorialArticles.map((article, i) => (
                <div key={article.id} className="scroll-card">
                  <ArticleCard article={article} index={i} isRead={isRead(article.id)} onRead={markAsRead} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
             TABBED ALL-CONTENT SECTION
             ═══════════════════════════════════════ */}
        {loaded && (
          <section style={{ marginBottom: '64px' }}>
            <SectionHeader
              title="Browse All"
              subtitle="Filter by category"
              accentColor="var(--neon-cyan)"
            />

            {/* Tab bar */}
            <div className="category-tabs" style={{ marginBottom: '28px' }}>
              {CONTENT_SECTIONS.map((section) => {
                const count = section.key === 'ALL'
                  ? articles.length
                  : articles.filter((a) => a.category === section.key).length;

                if (count === 0 && section.key !== 'ALL') return null;

                return (
                  <button
                    key={section.key}
                    className={`category-tab ${activeTab === section.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(section.key)}
                    style={
                      activeTab === section.key
                        ? { borderColor: section.color, color: section.color, background: `${section.color}12` }
                        : undefined
                    }
                  >
                    <span>{section.icon}</span>
                    {section.label}
                    <span
                      style={{
                        fontSize: '0.6rem',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: activeTab === section.key ? `${section.color}20` : 'rgba(255,255,255,0.04)',
                        color: activeTab === section.key ? section.color : 'var(--text-muted)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filtered grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="masonry-grid"
              >
                {filteredArticles.map((article, i) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={i}
                    isRead={isRead(article.id)}
                    onRead={markAsRead}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredArticles.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem',
                }}
              >
                No articles in this category yet. Check back soon!
              </div>
            )}
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
