import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { getGenieReply, shouldRevealAfterTurn } from './src/lib/genieScript.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const openRouterModel = process.env.OPENROUTER_MODEL || 'openrouter/free';
const siteUrl = process.env.OPENROUTER_SITE_URL || 'http://localhost:5173';
const siteName = process.env.OPENROUTER_SITE_NAME || 'Birthday Surprise Genie';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function buildMessages({ playerName, history }) {
  const systemPrompt = [
    'You are a mischievous genie inside a birthday game.',
    `The target name is "${playerName}".`,
    'Your job is to be playful, lightly annoying, contradictory, and teasing.',
    'Do not be hateful, abusive, sexual, or threatening.',
    'Keep replies short: one or two sentences.',
    'Stay in character as the genie.',
    'You should challenge the player, question their identity, and be evasive about the developer.',
    'After a few turns, hint that the surprise should be revealed soon.',
    'Never help the player find the shuffled shell.',
  ].join(' ');

  return [
    { role: 'system', content: systemPrompt },
    ...history.map((entry) => ({
      role: entry.speaker === 'player' ? 'user' : 'assistant',
      content: entry.text,
    })),
  ];
}

app.post('/api/genie', async (req, res) => {
  const { playerName = 'Birthday Girl', input = '', turn = 0, history = [] } = req.body ?? {};
  const preview = String(input).replace(/\s+/g, ' ').slice(0, 80);

  if (!input.trim()) {
    return res.status(400).json({ error: 'Input is required.' });
  }

  const fallback = {
    reply: getGenieReply({ playerName, input, turn }),
    reveal: shouldRevealAfterTurn(turn),
    source: 'fallback',
  };

  if (!openRouterApiKey) {
    console.log(`[GENIE:FALLBACK:NO_KEY] turn=${turn} input="${preview}"`);
    return res.json(fallback);
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': siteUrl,
        'X-Title': siteName,
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: buildMessages({ playerName, history }),
        temperature: 1.1,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`[GENIE:OPENROUTER:ERROR] turn=${turn} input="${preview}" status=${response.status}`);
      console.error('OpenRouter error:', errorText);
      return res.status(502).json({
        reply: 'The genie lost its AI voice. Restart the backend or check the OpenRouter key.',
        reveal: false,
        source: 'offline',
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.log(`[GENIE:OPENROUTER:EMPTY] turn=${turn} input="${preview}"`);
      return res.status(502).json({
        reply: 'The genie heard static instead of words. Try again in a moment.',
        reveal: false,
        source: 'offline',
      });
    }

    console.log(`[GENIE:OPENROUTER:OK] turn=${turn} input="${preview}"`);
    return res.json({
      reply,
      reveal: shouldRevealAfterTurn(turn),
      source: 'openrouter',
    });
  } catch (error) {
    console.log(`[GENIE:OPENROUTER:THROW] turn=${turn} input="${preview}"`);
    console.error('Genie route failed:', error);
    return res.status(502).json({
      reply: 'The genie connection broke before it could answer. Check the server and try again.',
      reveal: false,
      source: 'offline',
    });
  }
});

app.listen(port, () => {
  console.log(`Genie server listening on http://localhost:${port}`);
});
