const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { chatHistory } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY; 
    
    // মডেলে সামান্য পরিবর্তন (gemini-1.5-flash ব্যবহার করা নিরাপদ)
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // এই অংশটি আপনার আগের কোডে ছিল না, এটা এখন যোগ করা হয়েছে
        system_instruction: {
          parts: [{ text: "You are the AI Odyssey guide — an expert, engaging AI assistant embedded in an interactive documentary website about artificial intelligence. The site covers AI history, how AI works (ML, deep learning, LLMs), AI's real-world impact, ethical debates, and the future of AI. Answer questions in a friendly, informative, and concise way. Keep responses under 180 words. Use simple language but don't shy away from technical depth when asked. Be enthusiastic about AI but balanced about its risks." }]
        },
        contents: chatHistory.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
      })
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
