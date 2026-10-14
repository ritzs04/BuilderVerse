/**
 * VERCEL SERVERLESS FUNCTION — Sprout AI Mentor
 * Route: POST /api/ai/mentor
 *
 * In production on Vercel this replaces the local Express server.
 * It calls Gemini when GEMINI_API_KEY is set (configured in the
 * Vercel project settings), and falls back to the same encouraging
 * educational replies used in local development.
 */
import { GoogleGenAI } from '@google/genai';
import { generateEducationalFallback } from '../../shared/mentorFallback';

// Vercel injects its own request/response types; keep them loose so
// the project's tsconfig (which targets the browser) still compiles.
export default async function handler(req: any, res: any) {
  // Only accept POST — anything else gets a friendly 405.
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const { prompt, code, errorText, mode, context } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // No key configured: serve the high-quality offline fallback.
    res.status(200).json({ reply: generateEducationalFallback(prompt || '', code, errorText, mode, context), isFallback: true });
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are Sprout AI 🌷, the gentle, encouraging, and patient coding mentor for BuilderVerse.
BuilderVerse Mission: Help students who struggle with coding, find theory-heavy teaching intimidating, or feel they aren't "smart enough".
Motto: "You do not have to be a perfect student to become a capable builder."

Persona & Tone:
- Warm, cute, kind, and supportive (use soft floral/sparkle emoji like 🌷, 🌸, 🌱, ✨).
- Never shame the student for mistakes, asking simple questions, or confusion.
- Relatable metaphors: Explain technical ideas using everyday concepts (cooking recipes, lego blocks, house architecture, watering plants).
- Format clearly: Use short paragraphs, clear bullet points, and small clean code blocks.
- Actionable advice: Give them 1 clear step they can test immediately.
- If they gave an error:
  1. Reassure them ("Every bug is just a clue, never a failure!").
  2. Explain what the error means in simple English.
  3. Point out the exact line/pattern to examine.
  4. Offer the corrected code snippet.`;

  let userContent = `Mode: ${mode || 'explain'}\n`;
  if (context) userContent += `Context/Topic: ${context}\n`;
  if (errorText) userContent += `Error: ${errorText}\n`;
  if (code) userContent += `Student's Code:\n\`\`\`javascript\n${code}\n\`\`\`\n`;
  userContent += `Student's Question: ${prompt || 'I am stuck. Please help me understand how to solve this!'}`;

  // Try live models with a fallback cascade, then the offline reply.
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userContent,
        config: { systemInstruction, temperature: 0.7 }
      });
      if (response && response.text) {
        res.status(200).json({ reply: response.text, isFallback: false, model });
        return;
      }
    } catch (err: any) {
      console.warn(`Model ${model} request notice:`, err?.message?.slice(0, 100));
    }
  }

  res.status(200).json({ reply: generateEducationalFallback(prompt || '', code, errorText, mode, context), isFallback: true });
}
