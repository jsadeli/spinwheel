window.generateListFromGemini = async (apiKey, prompt) => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helper for a spin wheel app. Generate a weighted list of 8-12 short, creative items based on the user's request: "${prompt}". Return only the items, one per line. If you want to make some items more likely, add ":weight" (e.g. Pizza:5) otherwise just the name. Do not include numbering, markdown blocks, or ending punctuations (except question mark).`
        }]
      }]
    })
  });
  const data = await response.json();
  if (data.error) {
    const error = new Error(data.error.message);
    error.status = data.error.status;
    throw error;
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
};

// voice options: https://docs.cloud.google.com/text-to-speech/docs/gemini-tts#voice_options
window.generateSpeechFromGemini = async (apiKey, text, voiceName = window.AIVoices.AOEDE) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } } },
        },
      }),
    }
  );
  const data = await response.json();
  if (data.error) {
    const error = new Error(data.error.message);
    error.status = data.error.status;
    throw error;
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
