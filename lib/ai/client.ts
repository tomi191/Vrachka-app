/**
 * OpenRouter AI Client
 * Using OpenRouter as a cost-effective alternative to OpenAI
 */

import OpenAI from 'openai';
import { logAIUsage } from '@/lib/ai/cost-tracker';

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
export const DEFAULT_MODEL = 'openai/gpt-5-mini';

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
    userId?: string; // For cost tracking
    feature?: 'tarot' | 'oracle' | 'horoscope' | 'daily_content'; // For cost tracking
    metadata?: Record<string, any>; // Additional tracking metadata
  }
): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 2000,
    responseFormat = 'text',
    userId,
    feature,
    metadata,
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

  const content = completion.choices[0]?.message?.content || '';

  // Log AI usage for cost tracking (async, don't block response)
  if (feature && completion.usage) {
    logAIUsage({
      userId,
      feature,
      model,
      promptTokens: completion.usage.prompt_tokens || 0,
      completionTokens: completion.usage.completion_tokens || 0,
      metadata,
    }).catch((error) => {
      console.error('[AI Client] Failed to log usage:', error);
      // Don't fail the request if logging fails
    });
  }

  return content;
}

/**
 * Extract JSON from markdown code blocks
 * AI models often wrap JSON in ```json ... ``` or ``` ... ```
 */
function extractJsonFromMarkdown(response: string): string {
  // Try to extract JSON from markdown code blocks
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)```/;
  const match = response.match(jsonBlockRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  // If no code block found, return original (might be clean JSON)
  return response.trim();
}

/**
 * Parse JSON response safely
 * Handles both clean JSON and markdown-wrapped JSON from AI models
 */
export function parseAIJsonResponse<T>(response: string): T | null {
  try {
    // First, try to extract JSON from markdown code blocks
    const cleanJson = extractJsonFromMarkdown(response);

    // Parse the cleaned JSON
    return JSON.parse(cleanJson) as T;
  } catch (error) {
    console.error('Failed to parse AI JSON response:', error);
    console.error('Response preview:', response.substring(0, 200));
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
