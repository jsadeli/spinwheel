import { GeminiError } from "./core/GeminiError.js";
import { AI_VOICES } from "./configs.js";

/**
 * Generates a weighted list of items using the Gemini API based on a user prompt.
 *
 * @param {string} apiKey - The Gemini API key.
 * @param {string} prompt - The user's prompt describing the desired list.
 * @returns {Promise<string>} A promise that resolves to the generated text content.
 * @throws {GeminiError} If the API returns an error.
 * @example
 * const listText = await generateListFromGemini("my-api-key", "pizza toppings");
 */
export const generateListFromGemini = async (apiKey, prompt) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helper for a spin wheel app. Generate a weighted list of 8-12 short, creative items based on the user's request: "${prompt}". Return only the items, one per line. If you want to make some items more likely, add ":weight" (e.g. Pizza:5) otherwise just the name. Do not include numbering, markdown blocks, or ending punctuations (except question mark).`,
              },
            ],
          },
        ],
      }),
    }
  );
  const data = await response.json();
  if (data.error) {
    throw new GeminiError(data);
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
};

// voice options: https://docs.cloud.google.com/text-to-speech/docs/gemini-tts#voice_options
/**
 * Generates speech audio from text using the Gemini API.
 *
 * @param {string} apiKey - The Gemini API key.
 * @param {string} text - The text to convert to speech.
 * @param {string} [voiceName=AI_VOICES.AOEDE] - The voice to use (default: Aoede).
 * @returns {Promise<string>} A promise that resolves to the base64-encoded audio data.
 * @throws {GeminiError} If the API returns an error.
 * @example
 * const audioData = await generateSpeechFromGemini("my-api-key", "Hello world", AI_VOICES.IAPETUS);
 */
export const generateSpeechFromGemini = async (apiKey, text, voiceName = AI_VOICES.AOEDE) => {
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
    throw new GeminiError(data);
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

// Expose to window
if (typeof window !== "undefined") {
  window.generateListFromGemini = generateListFromGemini;
  window.generateSpeechFromGemini = generateSpeechFromGemini;
}
