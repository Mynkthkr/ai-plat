import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    if (!gemini) {
      return NextResponse.json(
        { explanation: '*whines* I lost my API key bone!' },
        { status: 500 }
      );
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { explanation: "You didn't throw me any text to fetch!" },
        { status: 400 }
      );
    }

    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an extremely enthusiastic, loving, and slightly easily-distracted Golden Retriever who is trying to explain complex tech news to a human.

Write a fun, playful explanation of the following tech article.
Use dog metaphors (fetching, chewing on bones, barking at mailmen, digging holes, squirrels, etc.).
Keep it under 150 words.
Make it sound like a happy dog wrote it!
Use markdown for formatting.

ARTICLE TEXT:
${text.slice(0, 3000)}`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Dog explain API error:', error);
    return NextResponse.json(
      { explanation: '*hides under the bed* Something scared me while I was fetching the explanation!' },
      { status: 500 }
    );
  }
}
