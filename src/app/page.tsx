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
  
  // Start with empty array — no seed data flash. Real articles load from DB.
  const [articles, setArticles] = useState<typeof sampleArticles>([]);
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    async function fetchLiveArticles() {
      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            setArticles(data.articles);
          } else {
            // Only use seed data if DB truly has nothing
            setArticles(sampleArticles);
          }
        } else {
          setArticles(sampleArticles);
        }
      } catch (err) {
        console.error('Error fetching live articles:', err);
        setArticles(sampleArticles);
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

  const getByCategory = (cat: string) => articles.filter((a) => a.category === cat);

  // Highlights/Section filtering
  const researchArticles = getByCategory('RESEARCH');
  const industryArticles = getByCategory('INDUSTRY');
  const toolArticles = getByCategory('AI_TOOLS').slice(0, 4);
  const latestArticles = articles.slice(0, 6);

  return (
    <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-void)' }}>
      <Navbar />
      <HeroSection />

      <main className="container-main" style={{ paddingTop: '48px' }} id="feed">
        {/* Newsletter - Compact & Accessible */}
        <div style={{ marginBottom: '80px' }}>
          <NewsletterSubscribe />
        </div>

        {/* ═══════════════════════════════════════
             LATEST INTELLIGENCE (Main Feed)
             ═══════════════════════════════════════ */}
        <section style={{ marginBottom: '100px' }}>
          <SectionHeader
            title="Latest Intelligence"
            subtitle="The most recent breakthroughs and updates"
            accentColor="var(--neon-cyan)"
          />
          {!dbLoaded ? (
            /* Skeleton shimmer while DB articles load */
            <div className="masonry-grid">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    overflow: 'hidden',
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: 0.5,
                  }}
                >
                  <div
                    style={{
                      height: '220px',
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
                      backgroundSize: '400% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }}
                  />
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ height: '18px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', width: '90%' }} />
                    <div style={{ height: '14px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', width: '70%' }} />
                    <div style={{ height: '14px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="masonry-grid">
              {latestArticles.map((article: any, i: number) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={i}
                  isRead={isRead(article.id)}
                  onRead={markAsRead}
                  compact={false}
                />
              ))}
            </div>
          )}
        </section>

        {/* Tech Roast - Interactive Break */}
        <div style={{ marginBottom: '100px', padding: '40px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(to right, rgba(255, 60, 100, 0.05), transparent)' }}>
          <TechRoastWidget />
        </div>

        {/* 🛠️ AI TOOLS SPOTLIGHT */}
        {loaded && toolArticles.length > 0 && (
          <section style={{ marginBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-glow)', marginBottom: '8px' }}>
                  🛠️ New AI Tools
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Latest launches to supercharge your workflow</p>
              </div>
            </div>
            
            <div className="masonry-grid">
              {toolArticles.map((article: any, i: number) => (
                <ArticleCard key={article.id} article={article} index={i} isRead={isRead(article.id)} onRead={markAsRead} compact={false} />
              ))}
            </div>
          </section>
        )}

        {/* 🔬 RESEARCH & INNOVATION */}
        {loaded && researchArticles.length > 0 && (
          <section style={{ marginBottom: '100px' }}>
            <SectionHeader
              title="🔬 Research & Benchmarks"
              subtitle="Deep dives into the science of AI"
              accentColor="#ff00aa"
            />
            <div className="masonry-grid">
              {researchArticles.map((article: any, i: number) => (
                <ArticleCard key={article.id} article={article} index={i} isRead={isRead(article.id)} onRead={markAsRead} compact={false} />
              ))}
            </div>
          </section>
        )}

        {/* 🏭 INDUSTRY & STRATEGY */}
        {loaded && industryArticles.length > 0 && (
          <section style={{ marginBottom: '100px' }}>
            <SectionHeader
              title="🏭 Industry & Economy"
              subtitle="How companies are adapting to the AI shift"
              accentColor="#b400ff"
            />
            <div className="masonry-grid">
              {industryArticles.slice(0, 3).map((article: any, i: number) => (
                <ArticleCard key={article.id} article={article} index={i} isRead={isRead(article.id)} onRead={markAsRead} compact={false} />
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
             EXPLORE BY CATEGORY (Filtered View)
             ═══════════════════════════════════════ */}
        {loaded && (
          <section style={{ marginBottom: '100px', paddingTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-glow)', marginBottom: '12px' }}>Explore Everything</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Deep dive into specific domains</p>
            </div>

            {/* Tab bar */}
            <div className="category-tabs" style={{ marginBottom: '40px', justifyContent: 'center' }}>
              {CONTENT_SECTIONS.map((section) => {
                const count = section.key === 'ALL'
                  ? articles.length
                  : articles.filter((a) => a.category === section.key).length;

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
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}>
                No articles found here yet.
              </div>
            )}
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
