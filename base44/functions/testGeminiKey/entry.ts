Deno.serve(async (req) => {
  const key = Deno.env.get("GEMINI_API_KEY");
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hello' }] }]
      })
    }
  );

  const data = await res.json();

  return Response.json({ 
    keyLength: key?.length, 
    keyPrefix: key?.slice(0, 6),
    status: res.status, 
    error: data.error?.message,
    reply: data.candidates?.[0]?.content?.parts?.[0]?.text?.slice(0, 50)
  });
});