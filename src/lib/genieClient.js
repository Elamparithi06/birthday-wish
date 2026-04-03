import { getGenieReply, shouldRevealAfterTurn } from './genieScript';

export async function requestGenieReply({ playerName, input, turn, history }) {
  const endpoint = import.meta.env.VITE_GENIE_API_URL || '/api/genie';
  const allowLocalFallback = import.meta.env.VITE_ALLOW_LOCAL_GENIE_FALLBACK === 'true';

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName,
          input,
          turn,
          history,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof data?.reply === 'string' && data.reply.trim()) {
          return {
            reply: data.reply.trim(),
            reveal: Boolean(data.reveal),
            source: data?.source === 'openrouter' ? 'openrouter' : 'fallback',
          };
        }
      }
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (typeof data?.reply === 'string' && data.reply.trim()) {
          return {
            reply: data.reply.trim(),
            reveal: false,
            source: data?.source ?? 'offline',
          };
        }
      }
    } catch (error) {
      if (!allowLocalFallback) {
        return {
          reply: 'The genie lost its AI connection. Make sure `npm run server` is running, then refresh and try again.',
          reveal: false,
          source: 'offline',
          error: error instanceof Error ? error.message : 'unknown_error',
        };
      }
    }
  }

  if (!allowLocalFallback) {
    return {
      reply: 'The genie is waiting for the AI backend. Start `npm run server` to wake it up.',
      reveal: false,
      source: 'offline',
    };
  }

  return {
    reply: getGenieReply({ playerName, input, turn }),
    reveal: shouldRevealAfterTurn(turn),
    source: 'fallback',
  };
}
