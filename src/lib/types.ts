// Article displayed in UI
export interface ArticleDisplay {
  id: string;
  slug: string;
  title: string;
  summary: string;
  rewritten_content: string;
  full_rewritten_content: string;
  original_url: string;
  source_name: string | null;
  image_url: string | null;
  category: string;
  tags: string[];
  hypeScore?: number;
  realityCheck?: string;
  published_date: string;
  created_at: string;
}

// All content categories
export type ContentCategory =
  | 'AI_NEWS'
  | 'AI_TOOLS'
  | 'AI_MEMES'
  | 'AI_USE_CASES'
  | 'PROMPT_OF_DAY'
  | 'AI_TUTORIALS'
  | 'RESEARCH'
  | 'PRODUCT_LAUNCH'
  | 'INDUSTRY';

// Tab-style section definitions for the homepage
export interface ContentSection {
  key: ContentCategory | 'ALL';
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const CONTENT_SECTIONS: ContentSection[] = [
  { key: 'ALL',           label: 'All',             icon: '🔥', color: '#00f0ff', description: 'Everything in one feed' },
  { key: 'AI_NEWS',       label: 'Market News',     icon: '📈', color: '#00f0ff', description: 'What\'s trending in AI today' },
  { key: 'AI_TOOLS',      label: 'New Tools',       icon: '🛠️', color: '#00ff88', description: 'Latest AI tool launches' },
  { key: 'AI_USE_CASES',  label: 'Use Cases',       icon: '💡', color: '#ffaa00', description: 'What people are building with AI' },
  { key: 'AI_MEMES',      label: 'AI Memes',        icon: '😂', color: '#ff6b6b', description: 'Funny AI-related humor' },
  { key: 'PROMPT_OF_DAY', label: 'Prompt of the Day',icon: '✨', color: '#b400ff', description: 'Daily curated AI prompts' },
  { key: 'AI_TUTORIALS',  label: 'Tutorial Snips',  icon: '📚', color: '#ff00aa', description: 'Quick AI how-to snippets' },
];

export const categoryLabels: Record<string, string> = {
  AI_NEWS: 'Market News',
  AI_TOOLS: 'New Tool',
  AI_MEMES: 'AI Meme',
  AI_USE_CASES: 'Use Case',
  PROMPT_OF_DAY: 'Prompt',
  AI_TUTORIALS: 'Tutorial',
  RESEARCH: 'Research',
  PRODUCT_LAUNCH: 'Launch',
  INDUSTRY: 'Industry',
};

export const categoryColors: Record<string, string> = {
  AI_NEWS: '#00f0ff',
  AI_TOOLS: '#00ff88',
  AI_MEMES: '#ff6b6b',
  AI_USE_CASES: '#ffaa00',
  PROMPT_OF_DAY: '#b400ff',
  AI_TUTORIALS: '#ff00aa',
  RESEARCH: '#ff00aa',
  PRODUCT_LAUNCH: '#00ff88',
  INDUSTRY: '#b400ff',
};

// Emoji icons per category (for meme/prompt cards etc.)
export const categoryIcons: Record<string, string> = {
  AI_NEWS: '📈',
  AI_TOOLS: '🛠️',
  AI_MEMES: '😂',
  AI_USE_CASES: '💡',
  PROMPT_OF_DAY: '✨',
  AI_TUTORIALS: '📚',
  RESEARCH: '🔬',
  PRODUCT_LAUNCH: '🚀',
  INDUSTRY: '🏭',
};
