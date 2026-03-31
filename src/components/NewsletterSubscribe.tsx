'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'You\'re in! Welcome aboard 🚀');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 60 }}
      id="newsletter"
      style={{
        margin: '0 auto 80px',
        maxWidth: '680px',
        padding: '48px 36px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.04), rgba(180, 0, 255, 0.04))',
        border: '1px solid rgba(0, 240, 255, 0.12)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(180, 0, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Mail size={22} color="var(--bg-void)" />
        </div>

        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-glow)',
            marginBottom: '8px',
          }}
        >
          Get 1 Useful AI News Daily
        </h3>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            marginBottom: '28px',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 auto 28px',
          }}
        >
          The top AI story of the day, delivered straight to your inbox. No spam, no fluff.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: '10px',
            maxWidth: '440px',
            margin: '0 auto',
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="your@email.com"
            disabled={status === 'loading' || status === 'success'}
            style={{
              flex: 1,
              padding: '14px 18px',
              background: 'var(--bg-card)',
              border: `1px solid ${status === 'error' ? 'rgba(255, 100, 100, 0.4)' : 'rgba(0, 240, 255, 0.15)'}`,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontFamily: "'JetBrains Mono', monospace",
              outline: 'none',
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            }}
            onFocus={(e) => {
              if (status !== 'error') {
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (status !== 'error') {
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: status === 'success' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'success' ? 1 : 0.98 }}
            disabled={status === 'loading' || status === 'success'}
            className="btn-solid"
            style={{
              padding: '14px 24px',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              opacity: status === 'success' ? 0.7 : 1,
              cursor: status === 'success' ? 'default' : 'pointer',
            }}
          >
            {status === 'loading' ? (
              <Loader2 size={18} className="spin-icon" />
            ) : status === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              'Subscribe'
            )}
          </motion.button>
        </form>

        {/* Status message */}
        <AnimatePresence>
          {(status === 'success' || status === 'error') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
                fontSize: '0.8rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: status === 'success' ? 'var(--neon-green)' : '#ff6b6b',
              }}
            >
              {status === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
