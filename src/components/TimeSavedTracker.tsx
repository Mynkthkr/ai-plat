'use client';

import { useReadArticles } from '@/hooks/useReadArticles';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TimeSavedTracker() {
  const { readCount, loaded } = useReadArticles();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (loaded) {
      setMounted(true);
    }
  }, [loaded]);

  if (!mounted || readCount === 0) return null;

  // Assume 15 minutes saved per AI summarized article vs reading full verbose original.
  const timeSavedMinutes = readCount * 15;
  const hours = Math.floor(timeSavedMinutes / 60);
  const minutes = timeSavedMinutes % 60;
  
  const formattedTime = hours > 0 
    ? `${hours}h ${minutes}m`
    : `${minutes}m`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} color="var(--neon-green)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-glow)', letterSpacing: '0.5px' }}>
            {readCount} {readCount === 1 ? 'Article' : 'Articles'}
          </span>
        </div>
        
        <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Timer size={14} color="var(--neon-cyan)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontFamily: "'JetBrains Mono', monospace" }}>
            {formattedTime} saved
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
