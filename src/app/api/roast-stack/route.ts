import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    if (!gemini) {
      return NextResponse.json({ roast: 'My API key is missing, much like your production monitoring.' }, { status: 500 });
    }

    const { stack } = await req.json();

    if (!stack || typeof stack !== 'string' || stack.trim() === '') {
      return NextResponse.json({ roast: "You didn't enter anything. Are you sure you're a developer?" }, { status: 400 });
    }

    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a sarcastic, slightly elitist, but ultimately helpful senior software engineer who specializes in modern AI and cloud-native architecture.
    
The user is going to tell you the tech stack they use.
1. Give a ruthless, funny, sarcastic roast of their stack (max 3 sentences).
2. Recommend a modern, AI-forward alternative (max 2 sentences).
3. Use markdown bold/italics for emphasis.

Their stack: "${stack}"`;

    const result = await model.generateContent(prompt);
    const roast = result.response.text();

    return NextResponse.json({ roast });
  } catch (error) {
    console.error('Roast API error:', error);
    return NextResponse.json({ roast: 'An error occurred. Unlike your code, I know when to fail gracefully.' }, { status: 500 });
  }
}
