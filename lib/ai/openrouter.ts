/**
 * OpenRouter wrapper - re-exports from client.ts
 */

import { openai } from './client'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface CompletionOptions {
  model: string
  messages: Message[]
  temperature?: number
  max_tokens?: number
}

export interface CompletionResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_cost: number
  }
}

export async function createOpenRouterCompletion(
  options: CompletionOptions
): Promise<CompletionResponse> {
  const response = await openai.chat.completions.create({
    model: options.model,
    messages: options.messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 1000,
  })

  // Calculate cost (approximate)
  const promptTokens = response.usage?.prompt_tokens || 0
  const completionTokens = response.usage?.completion_tokens || 0

  // GPT-4 Turbo pricing via OpenRouter (approximate)
  const inputCostPer1k = 0.01 // $0.01 per 1K input tokens
  const outputCostPer1k = 0.03 // $0.03 per 1K output tokens
  const totalCost = (promptTokens / 1000) * inputCostPer1k + (completionTokens / 1000) * outputCostPer1k

  return {
    choices: response.choices as any,
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_cost: totalCost,
    },
  }
}
