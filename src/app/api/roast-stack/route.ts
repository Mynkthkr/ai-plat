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

    const body = await req.json();
    const userTechStack = body.stack || body.userTechStack || '';

    if (!userTechStack || typeof userTechStack !== 'string' || userTechStack.trim() === '') {
      return NextResponse.json({ roast: "You didn't enter anything. Are you sure you're a developer?" }, { status: 400 });
    }

    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a sarcastic, elite senior 10x developer. A user has submitted their tech stack: ${userTechStack}. I want you to brutally and sarcastically roast THIS SPECIFIC tech stack. Mention the exact technologies they listed and why they are outdated, overcomplicated, or funny. Suggest a modern AI alternative at the end. Keep it under 4 sentences. DO NOT give a generic reply.`;

    const result = await model.generateContent(prompt);
    const roast = result.response.text();

    return NextResponse.json({ roast });
  } catch (error) {
    console.error('Roast API error:', error);
    return NextResponse.json({ roast: 'An error occurred. Unlike your code, I know when to fail gracefully.' }, { status: 500 });
  }
}
