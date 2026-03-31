'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aipulse-read-articles';

/**
 * Hook to track which articles the user has read.
 * Uses localStorage for a frictionless, login-free experience.
 */
export function useReadArticles() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setReadIds(new Set(parsed));
      }
    } catch {
      // localStorage not available or corrupted
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage whenever readIds changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds]));
    } catch {
      // localStorage full or not available
    }
  }, [readIds, loaded]);

  const markAsRead = useCallback((articleId: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(articleId);
      return next;
    });
  }, []);

  const isRead = useCallback(
    (articleId: string) => readIds.has(articleId),
    [readIds]
  );

  return { markAsRead, isRead, loaded, readCount: readIds.size };
}
