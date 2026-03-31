'use client';

import { motion } from 'framer-motion';
import { Sparkles, Quote } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '100px',
        paddingBottom: '40px',
      }}
    >
      {/* Animated Background Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.07) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -60, 50, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '15%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180, 0, 255, 0.07) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '860px', padding: '0 24px' }}>
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.15)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '36px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--neon-cyan)',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}
        >
          <Sparkles size={14} />
          Thought of the Day
        </motion.div>

        {/* Quote Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(180, 0, 255, 0.12))',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Quote size={24} color="var(--neon-cyan)" />
          </div>
        </motion.div>

        {/* The Quote */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 50 }}
          style={{
            fontSize: 'clamp(1.75rem, 4.5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '24px',
            letterSpacing: '-0.5px',
          }}
        >
          <span style={{ color: 'var(--text-glow)' }}>AI will never replace you,</span>
          <br />
          <span className="gradient-text" style={{ fontStyle: 'italic' }}>
            a person using AI will.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Your daily AI intelligence feed — auto-curated, rewritten by AI,
          and delivered fresh every 24 hours. Zero noise, pure signal.
        </motion.p>

        {/* Decorative separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
          style={{
            width: '120px',
            height: '2px',
            margin: '36px auto 0',
            background: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-purple), transparent)',
            borderRadius: '2px',
          }}
        />
      </div>
    </section>
  );
}
