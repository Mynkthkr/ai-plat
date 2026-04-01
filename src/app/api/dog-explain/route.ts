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

    const body = await req.json();
    const articleText = body.text || body.articleText || '';

    if (!articleText || articleText.trim().length < 10) {
      return NextResponse.json(
        { explanation: "You didn't throw me any text to fetch! WOOF!" },
        { status: 400 }
      );
    }

    const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an excited Golden Retriever. Summarize the following AI tech news in 2 short paragraphs as if you are a dog talking to another dog. Use high energy (WOOF!), and analogies involving dog things (bones, fetch, treats). Keep it funny and simple. Here is the news: ${articleText.slice(0, 3000)}`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Dog explain API error:', error);
    return NextResponse.json(
      { explanation: '*hides under the bed* Something scared me while I was fetching the explanation! WOOF!' },
      { status: 500 }
    );
  }
}
