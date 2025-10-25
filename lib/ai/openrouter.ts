/**
 * OpenRouter wrapper with Hybrid AI Strategy
 * Supports automatic fallback and retry logic
 */

import { openai } from './client';
import {
  getModelForFeature,
  getFallbackModels,
  getModelConfig,
  estimateCost,
  AI_STRATEGY,
  type AIFeature,
} from './models';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  model?: string; // Optional now - can use feature-based selection
  feature?: AIFeature; // NEW: Auto-select model based on feature
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

export interface CompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_cost: number;
  };
  model_used: string; // Track which model was used
}

/**
 * Create completion with automatic model selection and fallback
 */
export async function createOpenRouterCompletion(
  options: CompletionOptions
): Promise<CompletionResponse> {
  // Determine which model to use
  let modelId: string;

  if (options.model) {
    // Explicit model specified
    modelId = options.model;
  } else if (options.feature) {
    // Auto-select based on feature
    modelId = getModelForFeature(options.feature);
  } else {
    // Fallback to Gemini Free as default
    modelId = 'google/gemini-2.0-flash-exp:free';
  }

  // Get fallback models if enabled
  const fallbackModels = options.feature && AI_STRATEGY.enableFallback
    ? getFallbackModels(options.feature)
    : [];

  // Try primary model first
  try {
    return await executeCompletion(modelId, options);
  } catch (error) {
    console.error(`[AI] Primary model failed: ${modelId}`, error);

    // Try fallback models
    for (const fallbackModel of fallbackModels) {
      try {
        console.log(`[AI] Trying fallback model: ${fallbackModel}`);
        return await executeCompletion(fallbackModel, options);
      } catch (fallbackError) {
        console.error(`[AI] Fallback model failed: ${fallbackModel}`, fallbackError);
        continue;
      }
    }

    // All models failed
    throw new Error(`All AI models failed. Primary: ${modelId}, Fallbacks: ${fallbackModels.join(', ')}`);
  }
}

/**
 * Execute completion with a specific model
 */
async function executeCompletion(
  modelId: string,
  options: CompletionOptions
): Promise<CompletionResponse> {
  const response = await openai.chat.completions.create({
    model: modelId,
    messages: options.messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 1000,
  });

  // Extract usage stats
  const promptTokens = response.usage?.prompt_tokens || 0;
  const completionTokens = response.usage?.completion_tokens || 0;

  // Calculate accurate cost based on model
  const modelKey = Object.keys(getModelConfig(modelId) ? { [modelId]: true } : {});
  const totalCost = modelKey.length > 0
    ? estimateCost(modelKey[0], promptTokens, completionTokens)
    : 0;

  // Log cost if in production
  if (AI_STRATEGY.logCosts && totalCost > 0) {
    console.log(`[AI Cost] Model: ${modelId}, Tokens: ${promptTokens}+${completionTokens}, Cost: $${totalCost.toFixed(4)}`);
  }

  return {
    choices: response.choices as any,
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_cost: totalCost,
    },
    model_used: modelId,
  };
}

/**
 * Helper: Create completion for specific feature
 */
export async function createFeatureCompletion(
  feature: AIFeature,
  messages: Message[],
  options?: Partial<CompletionOptions>
): Promise<CompletionResponse> {
  return createOpenRouterCompletion({
    ...options,
    feature,
    messages,
  });
}
