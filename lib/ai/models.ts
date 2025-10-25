/**
 * Centralized AI Model Configuration
 * Hybrid strategy: Gemini Free + Claude Sonnet + DeepSeek fallback
 */

export type AIFeature =
  | 'horoscope'
  | 'tarot'
  | 'oracle_basic'
  | 'oracle_premium'
  | 'natal_chart'
  | 'general';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  costPer1M: {
    input: number;
    output: number;
  };
  maxTokens: number;
  contextWindow: number;
  strengths: string[];
}

export const AI_MODELS: Record<string, AIModel> = {
  // Primary: FREE model for daily features
  gemini_flash: {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash (Free)',
    provider: 'Google',
    costPer1M: {
      input: 0,
      output: 0,
    },
    maxTokens: 8192,
    contextWindow: 1_048_576, // 1M tokens!
    strengths: ['fast', 'free', 'large-context', 'creative'],
  },

  // Premium: For high-quality interpretations
  claude_sonnet: {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    costPer1M: {
      input: 3,
      output: 15,
    },
    maxTokens: 8192,
    contextWindow: 200_000,
    strengths: ['best-bulgarian', 'empathetic', 'creative', 'accurate'],
  },

  // Fallback: Ultra-cheap backup
  deepseek: {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek v3',
    provider: 'DeepSeek',
    costPer1M: {
      input: 0.27,
      output: 1.10,
    },
    maxTokens: 8192,
    contextWindow: 64_000,
    strengths: ['ultra-cheap', 'reliable', 'good-quality'],
  },

  // Legacy: Backward compatibility
  gpt4_turbo: {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    costPer1M: {
      input: 10,
      output: 30,
    },
    maxTokens: 4096,
    contextWindow: 128_000,
    strengths: ['reliable', 'accurate'],
  },
};

/**
 * Feature-to-Model mapping strategy
 */
export const FEATURE_MODEL_MAP: Record<AIFeature, string[]> = {
  // Daily horoscopes - FREE model
  horoscope: ['gemini_flash', 'deepseek', 'gpt4_turbo'],

  // Tarot readings - FREE model
  tarot: ['gemini_flash', 'deepseek', 'gpt4_turbo'],

  // Oracle (basic) - FREE model
  oracle_basic: ['gemini_flash', 'deepseek', 'gpt4_turbo'],

  // Oracle (premium insights) - CLAUDE
  oracle_premium: ['claude_sonnet', 'gemini_flash', 'deepseek'],

  // Natal Chart - CLAUDE (best quality)
  natal_chart: ['claude_sonnet', 'gemini_flash', 'deepseek'],

  // General fallback
  general: ['gemini_flash', 'deepseek', 'claude_sonnet', 'gpt4_turbo'],
};

/**
 * Get the best model for a specific feature
 */
export function getModelForFeature(feature: AIFeature): string {
  const models = FEATURE_MODEL_MAP[feature] || FEATURE_MODEL_MAP.general;
  const primaryModel = models[0];
  return AI_MODELS[primaryModel].id;
}

/**
 * Get fallback models for a feature
 */
export function getFallbackModels(feature: AIFeature): string[] {
  const models = FEATURE_MODEL_MAP[feature] || FEATURE_MODEL_MAP.general;
  return models.slice(1).map(key => AI_MODELS[key].id);
}

/**
 * Get model configuration by ID
 */
export function getModelConfig(modelId: string): AIModel | undefined {
  return Object.values(AI_MODELS).find(m => m.id === modelId);
}

/**
 * Calculate estimated cost for a request
 */
export function estimateCost(
  modelKey: string,
  inputTokens: number,
  outputTokens: number
): number {
  const model = AI_MODELS[modelKey];
  if (!model) return 0;

  const inputCost = (inputTokens / 1_000_000) * model.costPer1M.input;
  const outputCost = (outputTokens / 1_000_000) * model.costPer1M.output;

  return inputCost + outputCost;
}

/**
 * Get human-readable model info
 */
export function getModelInfo(modelKey: string): string {
  const model = AI_MODELS[modelKey];
  if (!model) return 'Unknown model';

  const costInfo = model.costPer1M.input === 0
    ? 'FREE'
    : `$${model.costPer1M.input}/$${model.costPer1M.output} per 1M tokens`;

  return `${model.name} (${model.provider}) - ${costInfo}`;
}

/**
 * Strategy configuration
 */
export const AI_STRATEGY = {
  useHybrid: true,
  enableFallback: true,
  maxRetries: 3,
  preferFreeModels: true,
  logCosts: process.env.NODE_ENV === 'production',
} as const;
