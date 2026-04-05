'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Loader2, Send } from 'lucide-react';

export default function TechRoastWidget() {
  const [stack, setStack] = useState('');
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stack.trim() || loading) return;

    setLoading(true);
    setRoast(null);

    try {
      const res = await fetch('/api/roast-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stack }),
      });
      const data = await res.json();
      setRoast(data.roast);
    } catch {
      setRoast('Your stack is so old it crashed my fetch request.');
    } finally {
      setLoading(false);
    }
  };

  // VERY simple markdown render for the bot response
  const formatRoast = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <div className="card-gradient" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(0, 240, 255, 0.12)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
        <Flame size={120} color="var(--neon-cyan)" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <Flame size={20} color="var(--neon-cyan)" />
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-glow)', fontWeight: 700 }}>Roast My Tech Stack</h3>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.5, position: 'relative', zIndex: 1 }}>
        Think your architecture is flawless? Tell the AI what you use and prepare to be humbled.
      </p>

      <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="e.g., PHP, jQuery, SVN..."
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          style={{
            flex: 1,
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontFamily: "'JetBrains Mono', monospace",
            outline: 'none',
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !stack.trim()}
          style={{
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            color: '#050508',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0 16px',
            cursor: loading || !stack.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !stack.trim() ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 200ms ease',
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>

      <AnimatePresence>
        {roast && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div 
              style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(10, 10, 15, 0.6)',
                borderLeft: '2px solid var(--neon-cyan)',
                borderRadius: '0 8px 8px 0',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
              }}
              dangerouslySetInnerHTML={{ __html: formatRoast(roast) }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
