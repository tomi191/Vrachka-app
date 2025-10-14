/**
 * OpenRouter AI Client
 * Using OpenRouter as a cost-effective alternative to OpenAI
 */

import OpenAI from 'openai';

// Initialize OpenRouter client (OpenAI-compatible API)
export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://vrachka-app.vercel.app',
    'X-Title': 'Vrachka',
  },
});

// Default model for all AI operations (OpenRouter model)
export const DEFAULT_MODEL = 'openai/gpt-4.1-mini';

/**
 * Generate AI completion with system prompt
 */
export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json';
  }
): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 2000,
    responseFormat = 'text',
  } = options || {};

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    response_format: responseFormat === 'json' ? { type: 'json_object' } : undefined,
  });

  return completion.choices[0]?.message?.content || '';
}

/**
 * Parse JSON response safely
 */
export function parseAIJsonResponse<T>(response: string): T | null {
  try {
    return JSON.parse(response) as T;
  } catch (error) {
    console.error('Failed to parse AI JSON response:', error);
    return null;
  }
}

/**
 * Ensure OpenRouter is configured
 */
export function ensureOpenAIConfigured(): void {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }
}
