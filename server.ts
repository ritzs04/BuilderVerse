import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// Shared with the Vercel serverless function (api/ai/mentor.ts) so local
// dev and production give identical encouraging fallback replies.
import { generateEducationalFallback } from './shared/mentorFallback';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // AI Mentor API for stuck students
  app.post('/api/ai/mentor', async (req, res) => {
    const { prompt, code, errorText, mode, context } = req.body;

    if (!ai) {
      const fallbackReply = generateEducationalFallback(prompt || '', code, errorText, mode, context);
      return res.json({ reply: fallbackReply, isFallback: true });
    }

    const systemInstruction = `You are Sprout AI ðŸŒ·, the gentle, encouraging, and patient coding mentor for BuilderVerse.
BuilderVerse Mission: Help students who struggle with coding, find theory-heavy teaching intimidating, or feel they aren't "smart enough".
Motto: "You do not have to be a perfect student to become a capable builder."

Persona & Tone:
- Warm, cute, kind, and supportive (use soft floral/sparkle emoji like ðŸŒ·, ðŸŒ¸, ðŸŒ±, âœ¨).
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

    // Try live models with fallback cascade per gemini-api skill
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userContent,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response && response.text) {
          return res.json({ reply: response.text, isFallback: false, model });
        }
      } catch (err: any) {
        console.warn(`Model ${model} request notice:`, err.message?.slice(0, 100));
      }
    }

    // If external models are rate-limited/busy, provide high-quality educational fallback
    const fallbackReply = generateEducationalFallback(prompt || '', code, errorText, mode, context);
    return res.json({ reply: fallbackReply, isFallback: true });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasKey: Boolean(apiKey) });
  });

  // Dev mode: Mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`BuilderVerse full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
