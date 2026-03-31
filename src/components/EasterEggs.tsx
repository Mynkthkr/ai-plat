'use client';

import { useEffect, useState } from 'react';

export default function EasterEggs() {
  const [terminalMode, setTerminalMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + T
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setTerminalMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (terminalMode) {
      document.body.classList.add('terminal-mode');
    } else {
      document.body.classList.remove('terminal-mode');
    }
  }, [terminalMode]);

  if (!terminalMode) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#000',
      color: '#00ff00',
      fontFamily: 'monospace',
      padding: '5px 10px',
      border: '1px solid #00ff00',
      zIndex: 9999,
      pointerEvents: 'none',
      fontSize: '12px'
    }}>
      root@aipulse:~# tail -f /var/log/ai_news.log
    </div>
  );
}
