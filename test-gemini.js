const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  require('dotenv').config({ path: '/Users/mayankkumar/ai-plat/.env' });
  const key = process.env.GEMINI_API_KEY;
  console.log('Testing KEY:', key ? key.substring(0, 5) + '...' : 'NONE');
  if (!key) return;
  const genAI = new GoogleGenerativeAI(key);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello!");
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error Status:", err.status);
    console.error("Error StatusText:", err.statusText);
    console.error("Full Error:", JSON.stringify(err, null, 2));
    console.error("Stringified Error:", String(err));
  }
}
run();
