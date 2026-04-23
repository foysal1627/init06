exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { chatHistory } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        
        contents: [
          {
            role: "user",
            parts: [{ text: "Context: You are the AI Odyssey guide — an expert, engaging AI assistant for an interactive documentary website about AI. You must ALWAYS act as this guide. The site covers AI history, ML, deep learning, LLMs, ethical debates, and the future. Keep responses under 180 words. Answer the following user query based on this persona." }]
          },
          {
            role: "model",
            parts: [{ text: "Understood. I am the AI Odyssey guide. I will assist users with information about AI history, technology, and ethics in a concise and friendly manner." }]
          },
          
          ...chatHistory.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        ]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
