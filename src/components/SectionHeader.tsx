'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function SectionHeader({ title, subtitle, accentColor = 'var(--neon-cyan)', action }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 60 }}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '32px',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: 4,
              height: 28,
              background: `linear-gradient(180deg, ${accentColor}, transparent)`,
              borderRadius: 4,
            }}
          />
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              color: 'var(--text-glow)',
              letterSpacing: '-0.5px',
            }}
          >
            {title}
          </h2>
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginLeft: '16px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <motion.a
          href={action.href}
          whileHover={{ scale: 1.02 }}
          className="btn-neon"
          style={{
            padding: '8px 18px',
            fontSize: '0.75rem',
            textDecoration: 'none',
          }}
        >
          {action.label}
        </motion.a>
      )}
    </motion.div>
  );
}
