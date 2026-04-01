const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '/Users/mayankkumar/ai-plat/.env' });

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const ai = require('@google/generative-ai');
    // We can't use list-models here directly with sdk? We can do a fetch request since the sdk does not expose listModels easily
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    if(data.models) {
        console.log("Models:", data.models.map(m => m.name).join(', '));
    } else {
        console.log("Error:", data);
    }
  } catch (err) {
    console.error(err);
  }
}
run();
