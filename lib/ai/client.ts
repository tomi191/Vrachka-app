/**
 * OpenAI Client and AI utilities
 */

import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default model for all AI operations
export const DEFAULT_MODEL = 'gpt-4-turbo-preview';

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
 * Ensure OpenAI is configured
 */
export function ensureOpenAIConfigured(): void {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }
}
