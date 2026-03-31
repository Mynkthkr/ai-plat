'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import TimeSavedTracker from '@/components/TimeSavedTracker';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 24px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isScrolled
          ? 'rgba(5, 5, 8, 0.88)'
          : 'rgba(5, 5, 8, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isScrolled
          ? '1px solid rgba(0, 240, 255, 0.12)'
          : '1px solid transparent',
        transition: 'all 300ms ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #00f0ff, #b400ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={18} color="#050508" strokeWidth={2.5} />
          </motion.div>
          <span
            className="font-display"
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '2px',
              background: 'linear-gradient(135deg, #00f0ff, #b400ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI PULSE
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <TimeSavedTracker />

          {/* Live Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(0, 255, 136, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.18)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--neon-green)',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            <div className="pulse-dot" />
            LIVE
          </div>

          {/* Subscribe CTA */}
          <motion.a
            href="#newsletter"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-solid"
            style={{
              padding: '8px 18px',
              fontSize: '0.78rem',
              textDecoration: 'none',
              letterSpacing: '0.5px',
            }}
          >
            Subscribe
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}
