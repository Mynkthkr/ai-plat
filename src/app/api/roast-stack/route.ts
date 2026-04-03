import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Roast personas — each call picks a random one so the
 * tone/style is different every time, even for the same stack.
 */
const ROAST_PERSONAS = [
  `You are a burnt-out FAANG staff engineer on your 4th energy drink. You've seen it all and you're not impressed. Roast with weary expertise.`,
  `You are an unhinged overcaffeinated startup CTO who only deploys on Friday nights. Roast with chaotic energy and startup jargon.`,
  `You are a snobbish Haskell/Rust developer who thinks anything with garbage collection is a toy. Roast with intellectual superiority.`,
  `You are a grumpy Linux sysadmin from the 90s who thinks anything invented after Perl is unnecessary bloat. Roast in a "back in my day" style.`,
  `You are a Gen-Z developer who only communicates in memes and internet slang. Roast with maximum brainrot. Use relevant emojis heavily.`,
  `You are a sarcastic DevOps engineer who only respects infrastructure-as-code. Anything that isn't containerized is a personal insult. Roast ruthlessly.`,
  `You are an AI researcher who thinks software engineering is beneath them. Roast the stack by comparing it unfavorably to ML pipelines.`,
  `You are a retired game developer who shipped 3 AAA titles with C++. You think all web tech is a joke. Roast with contempt for web devs.`,
];

export async function POST(req: Request) {
  try {
    if (!gemini) {
      return NextResponse.json(
        { roast: 'My API key is missing, much like your production monitoring.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const userTechStack = body.stack || body.userTechStack || '';

    if (!userTechStack || typeof userTechStack !== 'string' || userTechStack.trim() === '') {
      return NextResponse.json(
        { roast: "You didn't enter anything. Are you sure you're a developer?" },
        { status: 400 }
      );
    }

    // Pick a random persona so repeats are always different
    const persona = ROAST_PERSONAS[Math.floor(Math.random() * ROAST_PERSONAS.length)];

    // Add a random seed word to further prevent caching/repetition
    const spiceWords = ['demolish', 'eviscerate', 'obliterate', 'incinerate', 'annihilate', 'vaporize'];
    const spice = spiceWords[Math.floor(Math.random() * spiceWords.length)];

    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 1.2, // high creativity for variety
      },
    });

    const prompt = `${persona}

A user has submitted their tech stack: "${userTechStack}".

${spice.toUpperCase()} this stack. Mention the EXACT technologies they listed and why each one is a questionable life choice. Be brutally specific — do NOT give a generic reply. Reference real flaws, memes, or community jokes about each tech. End with a savage one-liner suggesting a modern AI-powered alternative.

Keep it under 4 sentences. Be funny, not mean-spirited.`;

    const result = await model.generateContent(prompt);
    const roast = result.response.text();

    return NextResponse.json({ roast });
  } catch (error) {
    console.error('Roast API error:', error);
    return NextResponse.json(
      { roast: 'An error occurred. Unlike your code, I know when to fail gracefully.' },
      { status: 500 }
    );
  }
}
