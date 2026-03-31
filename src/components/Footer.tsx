'use client';

import { motion } from 'framer-motion';
import { Zap, Github, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        borderTop: '1px solid rgba(0, 240, 255, 0.08)',
        marginTop: '48px',
      }}
    >
      {/* Gradient line */}
      <div
        style={{
          position: 'absolute',
          top: -1,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-purple), transparent)',
        }}
      />

      <div
        className="container-main"
        style={{ padding: '40px 24px 28px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Left — brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #00f0ff, #b400ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={14} color="#050508" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              © 2026 AI Pulse · Auto-curated AI intelligence
            </span>
          </div>

          {/* Right — actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Tech badges */}
            {['Next.js', 'Supabase', 'Gemini', 'Vercel'].map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '0.63rem',
                  padding: '3px 9px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {tech}
              </span>
            ))}

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: 'var(--text-muted)',
                transition: 'all 200ms ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.25)';
                e.currentTarget.style.color = 'var(--neon-cyan)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <Github size={14} />
            </a>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                border: 'none',
                color: 'var(--bg-void)',
                cursor: 'pointer',
              }}
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
