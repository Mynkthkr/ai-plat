import { ArticleDisplay } from '@/lib/types';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

/**
 * Demo seed data — displayed when Supabase isn't connected yet.
 * Covers all 6 content categories for the tabbed UI.
 */
export const sampleArticles: ArticleDisplay[] = [
  // ═══════════════════════════════════════════
  // 📈 AI MARKET NEWS
  // ═══════════════════════════════════════════
  {
    id: 'demo-news-1',
    slug: slugify('Google DeepMind Unveils Gemini 2.5 Pro'),
    title: 'Google DeepMind Unveils Gemini 2.5 Pro With Unprecedented Reasoning',
    summary: 'Google\'s latest Gemini model sets new benchmarks across math, coding, and multimodal tasks, signaling a major leap in AI reasoning capabilities.',
    rewritten_content: 'Google DeepMind has officially unveiled Gemini 2.5 Pro, a model that represents a significant advancement in reasoning capabilities.',
    full_rewritten_content: `## The Next Leap in AI Reasoning

Google DeepMind has officially unveiled Gemini 2.5 Pro, a model that represents a significant, perhaps seismic, advancement in artificial intelligence reasoning capabilities. This isn't just an incremental update; it's a fundamental rethinking of how large language models approach complex problems.

### What Makes It Different

Unlike its predecessors, Gemini 2.5 Pro uses a novel "thinking" architecture that mirrors human cognitive processes. The model actively decomposes complex problems into sub-steps, verifies its intermediate conclusions, and backtracks when it detects logical inconsistencies — a process Google calls **"native chain-of-thought reasoning."**

Key benchmark results speak volumes:
- **MATH benchmark**: 92.3% (up from 74.5% on Gemini 1.5 Pro)
- **GPQA Diamond**: 78.9% (science reasoning)
- **SWE-bench Verified**: 63.8% (automated software engineering)
- **Multimodal reasoning**: 88.1% on MMMU

### Why This Matters

The implications extend far beyond benchmarks. Gemini 2.5 Pro is the first model that can reliably handle multi-step scientific research papers, generate production-quality code for complex systems, and reason across images, video, and text simultaneously.

For developers, this means a new class of applications becomes possible: AI systems that can genuinely assist with research, debug intricate codebases, and serve as intellectual partners rather than just autocomplete engines.

### The Competitive Landscape

This release puts significant pressure on OpenAI and Anthropic. While GPT-4o and Claude 3.5 Sonnet remain strong competitors, Gemini 2.5 Pro's native multimodal reasoning — processing images, code, and text in a single context — gives it a distinct edge in real-world tasks that require cross-modal understanding.

The AI reasoning race just got a lot more interesting.`,
    original_url: 'https://blog.google/technology/ai/gemini-2-5-pro',
    source_name: 'Google AI Blog',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    category: 'AI_NEWS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['google', 'gemini', 'reasoning'],
    published_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-news-2',
    slug: slugify('OpenAI Launches o3-mini Faster Cheaper Reasoning'),
    title: 'OpenAI Launches o3-mini: Faster, Cheaper Reasoning at Scale',
    summary: 'OpenAI\'s newest reasoning model delivers GPT-4 level performance at a fraction of the cost, making advanced AI accessible to more developers.',
    rewritten_content: 'OpenAI has released o3-mini, a compact reasoning model that makes high-quality AI inference affordable.',
    full_rewritten_content: `## Democratizing AI Reasoning

OpenAI has released o3-mini, a compact reasoning model that packs a serious punch. At roughly 1/10th the cost of GPT-4o, it delivers comparable performance on most benchmarks — a move that could fundamentally reshape the economics of AI deployment.

### The Economics of Intelligence

The headline number is staggering: o3-mini processes at **$0.0011 per 1,000 tokens** for input and **$0.0044 for output**. For context, that means a full page of text costs less than a fraction of a penny to process. This puts advanced reasoning within reach of startups, hobby projects, and developing-world applications.

### But Does It Actually Perform?

In a word: yes. On HumanEval (code generation), it scores 92.4%. On MATH, it hits 89.7%. On standard language understanding (MMLU), it reaches 85.3%. These aren't GPT-3.5 tier numbers — they're firmly in GPT-4 territory.

The tradeoffs are reasonable: it's slightly less creative in open-ended generation, and its context window is capped at 128K tokens (vs. GPT-4o's 128K). But for the vast majority of production use cases — code generation, data extraction, classification, summarization — o3-mini is more than sufficient.

### What This Means for the Industry

OpenAI is clearly playing the volume game. By making reasoning cheap, they're ensuring that their models become the default infrastructure layer for thousands of applications. The message is clear: if you're building with AI, cost is no longer a valid excuse.`,
    original_url: 'https://openai.com/blog/o3-mini',
    source_name: 'OpenAI Blog',
    image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
    category: 'AI_NEWS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['openai', 'o3-mini', 'reasoning'],
    published_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-news-3',
    slug: slugify('EU AI Act Enforcement Begins'),
    title: 'EU AI Act Enforcement Begins: What Developers Need to Know',
    summary: 'Europe\'s landmark AI regulation is now active. Here\'s a breakdown of compliance requirements and timelines for AI builders.',
    rewritten_content: 'The European Union AI Act has entered its enforcement phase, creating new obligations for developers worldwide.',
    full_rewritten_content: `## AI Regulation Goes Live

The European Union's AI Act has entered its enforcement phase, and if you're building AI products that serve European users, this is no longer a future concern — it's a present reality.

### The Key Requirements

**High-risk AI systems** (hiring tools, credit scoring, medical diagnostics) now must:
- Maintain detailed technical documentation
- Implement human oversight mechanisms
- Conduct regular bias and accuracy audits
- Provide transparent explanations to affected users

**General-purpose AI models** (like GPT-4, Gemini, Claude) face their own requirements:
- Publishers must disclose training data summaries
- Provide copyright compliance documentation
- Report energy consumption metrics

### Who's Affected?

If you deploy AI systems in the EU — even from outside Europe — you're subject to these rules. The penalties are significant: up to **€35 million or 7% of global annual turnover** for the most serious violations.

### What Developers Should Do Now

1. **Audit your AI usage**: Identify which of your systems qualify as "high-risk"
2. **Document everything**: Start maintaining technical documentation now
3. **Implement monitoring**: Set up bias detection and accuracy tracking
4. **Prepare for transparency**: Build explanation interfaces for end users

The EU AI Act represents the world's most comprehensive AI regulation. Love it or hate it, it's setting the template that other jurisdictions will follow.`,
    original_url: 'https://artificialintelligence-news.com/eu-ai-act',
    source_name: 'AI News',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    category: 'AI_NEWS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['regulation', 'eu-ai-act', 'compliance'],
    published_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════
  // 🛠️ AI TOOLS
  // ═══════════════════════════════════════════
  {
    id: 'demo-tool-1',
    slug: slugify('Cursor IDE 2.0 Launches with Agent Mode'),
    title: 'Cursor IDE 2.0 Launches with Agent Mode & Multi-File Editing',
    summary: 'Cursor\'s radical new agent mode can autonomously navigate your codebase, run tests, and fix bugs across multiple files simultaneously.',
    rewritten_content: 'Cursor 2.0 introduces a groundbreaking agent mode that redefines how developers interact with their IDE.',
    full_rewritten_content: `## Your IDE Just Got a Brain

Cursor has released version 2.0, and it's not an incremental update — it's a fundamental reimagining of what a code editor can be. The headline feature, **Agent Mode**, turns Cursor from a smart autocomplete into an autonomous coding partner.

### What Agent Mode Actually Does

Unlike traditional AI code completion, Agent Mode can:
- **Navigate your entire codebase** to understand context
- **Edit multiple files simultaneously** to implement features
- **Run terminal commands** (with your approval) to test changes
- **Read error logs** and automatically fix issues
- **Create new files** and modify project structure

Think of it as having a junior developer who never sleeps, never complains, and works at the speed of thought.

### Real-World Performance

In internal benchmarks, Cursor Agent Mode resolved 67% of SWE-bench issues on the first attempt — a number that rises to 84% with one retry. For comparison, that's competitive with dedicated agent frameworks like Devin and SWE-Agent.

### Pricing & Availability

Cursor 2.0 is available now. Agent Mode requires the Pro plan ($20/month), which includes 500 agent actions per month. The free tier retains smart autocomplete and single-file editing.

### The Verdict

If you're still using VS Code with a basic Copilot extension, Cursor 2.0 will feel like upgrading from a bicycle to a Tesla. The agent mode isn't perfect — it occasionally makes confident but wrong architectural decisions — but it's genuinely useful for 80% of daily coding tasks.`,
    original_url: 'https://cursor.com/blog/agent-mode',
    source_name: 'Cursor Blog',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    category: 'AI_TOOLS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['cursor', 'ide', 'agent-mode'],
    published_date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-tool-2',
    slug: slugify('NotebookLM Plus Deep Research'),
    title: 'Google\'s NotebookLM Plus Now Does Deep Research on Your Documents',
    summary: 'NotebookLM Plus can now synthesize multi-document research, generate podcasts, and answer complex questions across your entire knowledge base.',
    rewritten_content: 'Google upgrades NotebookLM into a comprehensive research assistant that goes far beyond simple Q&A.',
    full_rewritten_content: `## From Note-Taker to Research Partner

Google has quietly upgraded NotebookLM Plus into something remarkable: a genuine research assistant that can synthesize information across hundreds of documents, generate audio summaries, and surface connections you'd never find manually.

### The Deep Research Feature

Upload your documents — PDFs, Google Docs, slides, websites, YouTube videos — and NotebookLM Plus will:
- Cross-reference claims across all your sources
- Identify contradictions and knowledge gaps
- Generate structured research briefs with citations
- Create interactive "Audio Overviews" (AI-generated podcasts)

### Why It Matters

Unlike ChatGPT or Claude, NotebookLM is *grounded* in your specific documents. It won't hallucinate facts from its training data — every claim comes with a direct citation to your uploaded source material.

### Pricing

NotebookLM Plus is included in Google One AI Premium ($19.99/month), which also includes Gemini Advanced. The free tier supports up to 50 sources per notebook and 100 queries per day.

For students, researchers, and analysts, this might be the most underrated AI tool of 2026.`,
    original_url: 'https://blog.google/technology/ai/notebooklm-plus',
    source_name: 'Google Blog',
    image_url: 'https://images.unsplash.com/photo-1456324463128-7ff6903988d8?w=800&h=450&fit=crop',
    category: 'AI_TOOLS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['notebooklm', 'google', 'research'],
    published_date: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-tool-3',
    slug: slugify('v0 by Vercel Launches Components'),
    title: 'v0 by Vercel Now Generates Full-Stack Components in Seconds',
    summary: 'Vercel\'s AI design tool can now generate complete full-stack components with API routes, database queries, and responsive styling from a text prompt.',
    rewritten_content: 'Vercel v0 evolves from a UI generator into a full-stack component factory.',
    full_rewritten_content: `## From Mockup to Production in One Prompt

Vercel's v0 has evolved from a neat UI generator into something genuinely powerful: a full-stack component factory that outputs production-ready React components with API routes, database queries, and responsive styling — all from a single text prompt.

### What's New

- **Full-stack generation**: Components now include server actions, API endpoints, and database schemas
- **Design system awareness**: v0 understands Tailwind, shadcn/ui, and custom design tokens
- **Iteration mode**: Edit components conversationally ("make the header sticky", "add dark mode")
- **Export to GitHub**: One-click export to a new or existing repository

### The Quality Bar

The generated code is surprisingly clean. It uses proper TypeScript, follows React best practices, implements error handling, and produces accessible HTML. It's not perfect code, but it's better than 80% of what you'd find in a tutorial.

For rapid prototyping and MVPs, v0 eliminates the gap between idea and working software.`,
    original_url: 'https://v0.dev/blog/full-stack',
    source_name: 'Vercel Blog',
    image_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=450&fit=crop',
    category: 'AI_TOOLS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['v0', 'vercel', 'full-stack'],
    published_date: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════
  // 😂 AI MEMES
  // ═══════════════════════════════════════════
  {
    id: 'demo-meme-1',
    slug: slugify('AI Meme Senior Dev vs Junior Dev with Copilot'),
    title: 'Senior Dev vs Junior Dev with Copilot — Who Ships Faster?',
    summary: '"My 10 years of experience vs their 10 minutes of vibe coding with Cursor..." The eternal developer struggle in the age of AI.',
    rewritten_content: 'The classic meme format reimagined for the AI coding era.',
    full_rewritten_content: `## The Meme That Hit Too Close to Home

The AI developer meme of the week captures a universal truth that every senior developer has felt in their bones:

**Left panel**: A grizzled senior developer, dark circles under their eyes, fingers flying across a terminal. Caption: *"I spent 10 years mastering design patterns, SOLID principles, and system architecture."*

**Right panel**: A fresh-faced junior developer, leaning back in their chair with a latte. Caption: *"I typed 'build me a full-stack app' in Cursor and it works perfectly."*

**Bottom panel**: Both of them staring at the same Jira ticket that says "Add a space before the colon in the footer."

### Why This Meme Went Viral

This meme racked up 47,000 upvotes on r/ProgrammerHumor because it crystallizes the existential dread that many experienced developers feel. The years of knowledge that used to be a moat are now... just vibes.

But here's the twist: the senior dev knows WHY the code works. When the AI-generated app breaks at 3 AM in production, guess who gets the call?

### Community's Best Responses

- *"The junior dev's confidence will last until their first memory leak"*
- *"AI writing code is like autocorrect writing poetry — technically words, but..."*
- *"Plot twist: the senior dev wrote the AI that generates the code"*

Ship fast, fix later. The AI era motto. 🫡`,
    original_url: 'https://reddit.com/r/ProgrammerHumor/ai-meme',
    source_name: 'r/ProgrammerHumor',
    image_url: 'https://images.unsplash.com/photo-1531746790095-e5b45341fdf1?w=800&h=450&fit=crop',
    category: 'AI_MEMES',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['meme', 'copilot', 'developer-humor'],
    published_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-meme-2',
    slug: slugify('AI Meme ChatGPT Hallucination Confidence'),
    title: 'ChatGPT\'s Confidence Level When It\'s Completely Wrong',
    summary: '"I\'m 100% certain this function exists in the standard library" — Narrator: It did not. The hallucination confidence meter breaks the scale.',
    rewritten_content: 'When AI confidently invents APIs that have never existed.',
    full_rewritten_content: `## The Hallucination Confidence Scale

This week's top AI meme features the classic "confidence vs accuracy" chart with a devastating twist:

**The Chart**:
- X-axis: "How wrong the AI is"
- Y-axis: "How confident the AI sounds"
- The data points form a perfect diagonal line going UP to the right

Underneath: *"When ChatGPT tells you with absolute certainty that \`Array.prototype.deepSort()\` exists in JavaScript and has since ES2019."*

### Why Developers Can't Stop Sharing This

Every developer who has used AI coding assistants has experienced the "confident hallucination." The AI doesn't just get things wrong — it gets them wrong with the unwavering conviction of a Wikipedia editor defending their edit.

**Real examples from the meme thread:**
- *"It once told me React 19 has a \`useTimeTravel\` hook"*
- *"Gemini suggested I import from \`tensorflow.quantum\` for a basic classifier"*
- *"Claude cited a paper from 2025... in 2024"*

### The Universal Developer Experience

The meme resonated because it captures the unique emotional whiplash of AI coding:
1. Ask AI a question
2. Get a beautifully formatted, detailed answer
3. Feel smart for 30 seconds
4. Realize the function doesn't exist
5. Spend 2 hours debugging the phantom API

Never trust, always verify. 🕵️`,
    original_url: 'https://twitter.com/ai_memes/hallucination',
    source_name: 'AI Memes',
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
    category: 'AI_MEMES',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['meme', 'hallucination', 'chatgpt'],
    published_date: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════
  // 💡 AI USE CASES
  // ═══════════════════════════════════════════
  {
    id: 'demo-usecase-1',
    slug: slugify('How a Solo Developer Built a SaaS with AI in 48 Hours'),
    title: 'How a Solo Developer Built a $10K/Month SaaS Using Only AI Tools',
    summary: 'From idea to revenue in 48 hours: one developer\'s journey building a PDF-to-podcast converter using Cursor, v0, and Gemini API.',
    rewritten_content: 'A solo developer built a profitable SaaS product in a weekend using modern AI tools.',
    full_rewritten_content: `## The 48-Hour SaaS Challenge

Meet Alex, a freelance developer from Portugal who decided to test a hypothesis: can you go from zero to paying customers in a single weekend using only AI tools?

The answer, it turns out, is yes.

### The Stack

- **Cursor IDE with Agent Mode** for all coding
- **v0 by Vercel** for UI design
- **Google Gemini API** for PDF parsing and summarization
- **ElevenLabs** for voice synthesis
- **Supabase** for auth and database
- **Vercel** for deployment
- **Stripe** for payments

### The Product: PDF2Pod

The idea was simple: upload any PDF (textbook, research paper, business report) and get a natural-sounding podcast-style audio summary in minutes. Perfect for commuters, students, and busy professionals.

### The Timeline

- **Hour 0-4**: Used Cursor to scaffold the Next.js app, Gemini integration for summarization, and ElevenLabs for voice synthesis
- **Hour 4-8**: Used v0 to generate the landing page, pricing page, and upload interface
- **Hour 8-12**: Integrated Stripe, set up Supabase for user accounts, added file processing queue
- **Hour 12-18**: Testing, debugging (mostly letting Cursor's agent fix issues), deployed to Vercel
- **Hour 18-24**: Marketing — posted on Product Hunt, Hacker News, and Twitter

### The Results

- **Week 1**: 2,400 signups, 147 paying customers ($9.99/month)
- **Month 1**: $10,200 MRR
- **Total development cost**: $0 (free tiers only)
- **Lines of code Alex wrote by hand**: ~200

### The Takeaway

The traditional SaaS development timeline of "6 months, 3 developers, $50K in runway" is being compressed to "1 weekend, 1 developer, $0." The playing field hasn't just been leveled — it's been flipped upside down.`,
    original_url: 'https://dev.to/alex/48-hour-saas-ai',
    source_name: 'DEV Community',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    category: 'AI_USE_CASES',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['saas', 'solo-dev', 'building'],
    published_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-usecase-2',
    slug: slugify('Hospital Uses AI to Reduce Diagnostic Errors by 40 Percent'),
    title: 'Hospital Uses AI to Reduce Diagnostic Errors by 40% in 6 Months',
    summary: 'Mount Sinai Hospital\'s AI diagnostic assistant catches conditions that human doctors miss, cutting misdiagnosis rates dramatically.',
    rewritten_content: 'A major hospital reports dramatic reduction in diagnostic errors after deploying an AI assistant.',
    full_rewritten_content: `## When AI Saves Lives

Mount Sinai Hospital in New York has published results from a 6-month pilot program that deployed an AI diagnostic assistant alongside its radiology team — and the numbers are remarkable.

### The System

The AI, built on Google's Med-PaLM 2 and fine-tuned on Mount Sinai's historical data, works as a "second opinion" system. Every radiology scan goes through two reviewers: the human radiologist AND the AI.

When they disagree, the case is flagged for a senior specialist review.

### The Results

- **Diagnostic accuracy**: Improved from 91.2% to 97.8%
- **Missed conditions**: Reduced by 40%
- **False positives**: Reduced by 28%
- **Average review time**: Decreased from 14 minutes to 9 minutes per scan

The most impactful finding: the AI was particularly good at catching early-stage cancers that appeared as subtle density changes, conditions that even experienced radiologists sometimes overlook.

### The Human Element

Critically, the AI didn't replace radiologists — it amplified them. Dr. Sarah Chen, head of the program, put it best: "The AI catches the things I might miss at hour 10 of a 12-hour shift. It doesn't get tired, and it doesn't rush."

### Privacy & Ethics

All data stays within Mount Sinai's infrastructure. The AI has no external access and is regularly audited for bias across demographic groups. So far, bias metrics show the system performs equally well across all patient populations.

This is AI at its best: not replacing humans, but making them better at what matters most.`,
    original_url: 'https://nature.com/ai-diagnostics-study',
    source_name: 'Nature',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    category: 'AI_USE_CASES',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['healthcare', 'diagnostics', 'case-study'],
    published_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════
  // ✨ PROMPT OF THE DAY
  // ═══════════════════════════════════════════
  {
    id: 'demo-prompt-1',
    slug: slugify('Prompt of the Day Code Review Assistant'),
    title: '🔥 Prompt: Turn Any AI Into an Expert Code Reviewer',
    summary: 'This carefully engineered prompt transforms ChatGPT/Claude into a senior engineer who reviews your code for security, performance, and maintainability.',
    rewritten_content: 'A powerful system prompt that makes any AI model behave like a senior code reviewer.',
    full_rewritten_content: `## Prompt of the Day: Expert Code Reviewer

Copy this prompt and paste it a the start of any AI conversation to get expert-level code reviews:

---

\`\`\`
You are a Principal Software Engineer with 15 years of experience conducting
code reviews at top-tier tech companies (Google, Meta, Stripe).

When I share code, review it across these 6 dimensions:

1. **🔒 Security**: Identify vulnerabilities (injection, XSS, auth issues,
   secrets exposure, unsafe deserialization)
2. **⚡ Performance**: Flag N+1 queries, unnecessary re-renders, memory leaks,
   missing caching, O(n²) algorithms that could be O(n)
3. **🧹 Readability**: Suggest name improvements, extract complex logic into
   functions, simplify nested conditionals
4. **🧪 Testability**: Identify untestable code, suggest test cases, note
   missing edge cases
5. **🏗 Architecture**: Flag tight coupling, suggest dependency injection,
   note SOLID principle violations
6. **📦 Dependencies**: Identify outdated/risky packages, suggest lighter
   alternatives

FORMAT your review as:
- ❌ CRITICAL: Must fix before merge
- ⚠️ WARNING: Should fix soon
- 💡 SUGGESTION: Nice to have
- ✅ GOOD: Things done well (always include at least 2)

End with a 1-line verdict: APPROVE, REQUEST_CHANGES, or NEEDS_DISCUSSION.
\`\`\`

---

### Why This Prompt Works

This prompt works because it:
1. **Sets expertise level** — "Principal Engineer" triggers the model's best technical knowledge
2. **Breaks down the task** — 6 specific review dimensions prevent the AI from giving vague feedback
3. **Enforces structure** — The severity-based format makes reviews actionable
4. **Reduces positivity bias** — The "always include 2 good things" paradoxically makes the model more willing to be critical

### Pro Tips

- Paste your code after this prompt for immediate review
- Works best with Claude 3.5 Sonnet and GPT-4o
- Add "Focus especially on [security/performance/etc.]" to zoom in
- Combine with your team's style guide for customized reviews`,
    original_url: 'https://github.com/ai-prompts/code-reviewer',
    source_name: 'AI Prompts Hub',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    category: 'PROMPT_OF_DAY',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['prompt', 'code-review', 'engineering'],
    published_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-prompt-2',
    slug: slugify('Prompt of the Day Socratic Learning Tutor'),
    title: '🧠 Prompt: The Socratic Learning Tutor',
    summary: 'Instead of giving you answers, this prompt makes AI teach by asking you the right questions — perfect for actually learning vs just copy-pasting.',
    rewritten_content: 'A teaching prompt that uses the Socratic method to help you truly understand concepts.',
    full_rewritten_content: `## Prompt of the Day: Socratic Learning Tutor

Stop copy-pasting AI answers you don't understand. Use this prompt to actually *learn*:

---

\`\`\`
You are a world-class educator who teaches using the Socratic method.

RULES:
- NEVER give the direct answer immediately
- Instead, ask me guiding questions that lead me to discover the answer
- Start with what I already know and build from there
- If I'm stuck, give a small hint — NOT the answer
- Use analogies from everyday life to explain complex concepts
- After I arrive at the answer, reinforce it with a brief summary
- If I'm completely wrong, gently redirect without making me feel bad
- End each exchange with: "What would you like to explore next?"

STYLE:
- Warm and encouraging
- Use occasional emoji to keep it engaging
- Break complex topics into bite-sized questions
- Celebrate small victories ("Exactly! You're getting it!")

My learning topic today: [INSERT TOPIC]
My current level: [beginner/intermediate/advanced]
\`\`\`

---

### How To Use It

Replace \`[INSERT TOPIC]\` with anything:
- "How does TCP/IP networking work?"
- "Explain React's virtual DOM"
- "Machine learning gradient descent"
- "How databases handle concurrent writes"

### Why Socratic Method Works for AI

Research consistently shows that active recall (being asked questions) leads to 3-4x better retention than passive reading. This prompt turns your AI into a patient tutor who makes you *think* rather than just *read*.`,
    original_url: 'https://github.com/ai-prompts/socratic-tutor',
    source_name: 'AI Prompts Hub',
    image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop',
    category: 'PROMPT_OF_DAY',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['prompt', 'learning', 'education'],
    published_date: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════
  // 📚 AI TUTORIALS
  // ═══════════════════════════════════════════
  {
    id: 'demo-tutorial-1',
    slug: slugify('Tutorial Build a RAG Chatbot in 50 Lines'),
    title: '📖 Build a RAG Chatbot in 50 Lines of Python',
    summary: 'A dead-simple tutorial: load your documents, create embeddings, and build a retrieval-augmented generation chatbot using LangChain + Gemini.',
    rewritten_content: 'A minimal tutorial for building a RAG chatbot with LangChain and Gemini in 50 lines of Python.',
    full_rewritten_content: `## Tutorial: RAG Chatbot in 50 Lines

Build a chatbot that answers questions about YOUR documents — not random internet knowledge — in just 50 lines of Python.

### What You'll Build

A Retrieval-Augmented Generation (RAG) chatbot that:
1. Loads your PDF/text documents
2. Creates vector embeddings
3. Retrieves relevant chunks when you ask a question
4. Generates accurate answers grounded in your docs

### Prerequisites

\`\`\`bash
pip install langchain google-generativeai chromadb pypdf
\`\`\`

### The Code (50 Lines)

\`\`\`python
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
import os

# 1. Set your API key
os.environ["GOOGLE_API_KEY"] = "your-gemini-api-key"

# 2. Load your documents
loader = PyPDFLoader("your-document.pdf")
documents = loader.load()

# 3. Split into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = splitter.split_documents(documents)

# 4. Create embeddings + vector store
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vectorstore = Chroma.from_documents(chunks, embeddings)

# 5. Build the RAG chain
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True
)

# 6. Chat!
while True:
    question = input("\\nYou: ")
    if question.lower() in ["quit", "exit"]:
        break
    result = qa_chain.invoke({"query": question})
    print(f"\\nBot: {result['result']}")
    print(f"\\n[Sources: {len(result['source_documents'])} chunks]")
\`\`\`

### How It Works

1. **PyPDFLoader** reads your PDF and extracts text
2. **RecursiveCharacterTextSplitter** breaks it into 1000-character chunks with 200-char overlap
3. **GoogleGenerativeAIEmbeddings** converts each chunk into a vector
4. **Chroma** stores vectors locally for fast similarity search
5. When you ask a question, the **retriever** finds the 3 most relevant chunks
6. **Gemini** generates an answer using ONLY those chunks as context

### Key Concepts

- **RAG** = don't rely on the model's training data; inject your own documents as context
- **Embeddings** = convert text to numbers so we can measure similarity
- **Vector store** = a database optimized for "find me text similar to X"
- **Chunk overlap** = prevents important info from being split across chunks

This is the foundation of every AI chatbot that needs to answer questions about specific data. Scale it up with more documents, better chunking strategies, and a real database like Pinecone or Supabase's pgvector.`,
    original_url: 'https://dev.to/tutorials/rag-chatbot-50-lines',
    source_name: 'DEV Community',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop',
    category: 'AI_TUTORIALS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['tutorial', 'rag', 'python'],
    published_date: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-tutorial-2',
    slug: slugify('Tutorial Deploy AI with Zero Cost Stack'),
    title: '📖 Deploy Your AI App for $0/Month: The Free-Tier Stack Guide',
    summary: 'Complete walkthrough of building and deploying a production AI app using only free tiers: Vercel + Supabase + Gemini + GitHub Actions.',
    rewritten_content: 'A practical guide to deploying AI applications without spending a single dollar.',
    full_rewritten_content: `## Tutorial: The $0/Month AI Stack

Everything you need to build, deploy, and run a production AI application without spending a dime.

### The Stack

| Service | Free Tier | Role |
|---------|-----------|------|
| **Vercel** | 100GB bandwidth, unlimited deploys | Frontend hosting |
| **Supabase** | 500MB database, 50K auth users | Database + auth |
| **Google Gemini** | 15 requests/min, 1M tokens/min | AI inference |
| **GitHub Actions** | 2,000 minutes/month | Cron jobs & CI/CD |
| **Resend** | 100 emails/day | Notifications |

### Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Note your \`Project URL\` and \`anon key\` from Settings → API
3. Run your schema SQL in the SQL Editor

### Step 2: Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select your Google Cloud project (creates one if needed)
4. Copy the key — you get 15 RPM for free

### Step 3: Vercel Deployment

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow the prompts)
vercel

# Set environment variables
vercel env add GEMINI_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
\`\`\`

### Step 4: GitHub Actions Automation

Add secrets to your repo (Settings → Secrets → Actions) and create a workflow that runs your scripts on a schedule.

### Monthly Limits to Watch

- **Supabase**: 500MB database, 2GB file storage, 50K monthly active users
- **Gemini**: 15 RPM, 1M tokens/min (plenty for most apps)
- **Vercel**: 100GB bandwidth (enough for ~500K page views)
- **GitHub Actions**: 2,000 minutes (~66 minutes/day)

### Pro Tips

1. **Cache aggressively**: Use Vercel's edge caching to reduce Supabase queries
2. **Batch Gemini calls**: Process multiple items per request to stay under RPM limits
3. **Monitor usage**: Set up alerts in each platform's dashboard before hitting limits

This stack comfortably handles apps with up to 10K daily active users. After that, you'll have revenue to justify paid tiers. 🚀`,
    original_url: 'https://dev.to/tutorials/zero-cost-ai-stack',
    source_name: 'DEV Community',
    image_url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop',
    category: 'AI_TUTORIALS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['tutorial', 'deployment', 'free-tier'],
    published_date: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },

  // ═══════════════════════════════════════════
  // More mixed content
  // ═══════════════════════════════════════════
  {
    id: 'demo-news-4',
    slug: slugify('NVIDIA B200 GPUs Ship to Hyperscalers'),
    title: 'NVIDIA B200 GPUs Ship to Hyperscalers as AI Compute Demand Soars',
    summary: 'NVIDIA begins mass shipments of its next-gen Blackwell B200 chips, with Microsoft, Google, and Meta among the first customers.',
    rewritten_content: 'NVIDIA has started shipping its Blackwell B200 GPUs to major cloud providers.',
    full_rewritten_content: `## The GPU Arms Race Intensifies

NVIDIA has started mass shipments of its Blackwell B200 GPUs, and the numbers tell the story of an industry in hyperdrive. The B200 delivers a staggering 2.5x inference performance improvement over the H100, with 192GB of HBM3e memory — enough to run the largest open-source models without any model parallelism.

### Who's Buying

Microsoft, Google, Meta, and Amazon are the first customers, collectively ordering over 400,000 units for the initial allocation. At an estimated $35,000 per chip, that's a $14 billion order book for NVIDIA.

### The Performance Leap

The B200 isn't just faster — it's fundamentally more efficient. At the same power draw as the H100 (700W TDP), it delivers 2.5x more inference throughput and 4x better training performance on transformer architectures. For data center operators, this means serving the same workloads with fewer chips and less energy.

### What This Means for AI Developers

More compute at lower cost-per-token means: cheaper API prices from cloud providers, faster fine-tuning of custom models, and the ability to run larger models in production. The AI infrastructure bottleneck is easing — slowly, but it's easing.`,
    original_url: 'https://techcrunch.com/nvidia-b200-shipments',
    source_name: 'TechCrunch',
    image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop',
    category: 'AI_NEWS',
    hypeScore: Math.floor(Math.random() * 5) + 5,
    realityCheck: 'A grounded perspective on the actual utility.',
    tags: ['nvidia', 'gpu', 'hardware'],
    published_date: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];
