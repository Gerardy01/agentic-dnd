import OpenAI from 'openai';

// ==========================================
// DTOs
// ==========================================

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// ==========================================
// Interface
// ==========================================

export interface IAIProvider {
  /**
   * Send a chat completion request and get back the raw text response.
   */
  chat(messages: AIChatMessage[], options?: AIChatOptions): Promise<string>;

  /**
   * Send a chat completion request and get back a parsed JSON object.
   * Uses OpenAI's JSON mode — the prompt MUST instruct the model to respond with JSON.
   */
  chatJSON<T = unknown>(messages: AIChatMessage[], options?: AIChatOptions): Promise<T>;
}

// ==========================================
// Implementation
// ==========================================

export class OpenAIProvider implements IAIProvider {
  private client: OpenAI;
  private defaultModel: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    this.defaultModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async chat(messages: AIChatMessage[], options?: AIChatOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options?.model ?? this.defaultModel,
      temperature: options?.temperature ?? 0.8,
      max_tokens: options?.maxTokens,
      messages,
    });

    return response.choices[0]?.message?.content ?? '';
  }

  async chatJSON<T = unknown>(messages: AIChatMessage[], options?: AIChatOptions): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: options?.model ?? this.defaultModel,
      temperature: options?.temperature ?? 0.8,
      max_tokens: options?.maxTokens,
      response_format: { type: 'json_object' },
      messages,
    });

    const raw = response.choices[0]?.message?.content ?? '{}';

    return JSON.parse(raw) as T;
  }
}
