import { Env } from '../types';

type ModelProvider = 'deepseek' | 'claude' | 'openai';
type TaskType = 'guide_generation' | 'product_description' | 'email_content' | 'analysis' | 'planning' | 'organization';

interface MOAResponse {
  content: string;
  provider: ModelProvider;
  model: string;
  tokens: number;
  latency: number;
}

export class WhitecatMOA {
  private readonly MAX_RETRIES = 2;
  
  constructor(private env: Env) {}

  async generate(prompt: string, taskType: TaskType): Promise<string> {
    console.log(`🐱 WHITECAT MOA starting for task: ${taskType}`);
    
    const modelStrategy = this.selectModelStrategy(taskType);
    
    // Parallel execution of multiple models
    const responses = await Promise.allSettled(
      modelStrategy.map(provider => this.callModel(provider, prompt, taskType))
    );

    const successful = responses
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<MOAResponse>).value);

    if (successful.length === 0) {
      throw new Error('All model providers failed');
    }

    console.log(`✅ WHITECAT MOA: ${successful.length}/${modelStrategy.length} models responded`);

    // If multiple successful responses, aggregate them
    if (successful.length > 1) {
      return await this.aggregateResponses(successful, taskType);
    }

    return successful[0].content;
  }

  private selectModelStrategy(taskType: TaskType): ModelProvider[] {
    switch (taskType) {
      case 'guide_generation':
        return ['deepseek', 'claude']; // R1 reasoning + Claude polish = quality content
      
      case 'product_description':
        return ['deepseek', 'claude']; // Both for best descriptions
      
      case 'email_content':
        return ['deepseek', 'claude']; // R1 strategy + Claude professionalism
      
      case 'analysis':
        return ['deepseek', 'claude']; // R1 deep analysis + Claude synthesis
      
      default:
        return ['deepseek', 'claude']; // Full power for everything else
    }
  }

  private async callModel(provider: ModelProvider, prompt: string, taskType: TaskType): Promise<MOAResponse> {
    const startTime = Date.now();
    
    console.log(`🔄 Calling ${provider}...`);

    try {
      let content: string;
      let model: string;
      let tokens = 0;

      switch (provider) {
        case 'deepseek':
          ({ content, model, tokens } = await this.callDeepSeek(prompt));
          break;
        
        case 'claude':
          ({ content, model, tokens } = await this.callClaude(prompt));
          break;
        
        case 'openai':
          ({ content, model, tokens } = await this.callOpenAI(prompt));
          break;
      }

      const latency = Date.now() - startTime;

      console.log(`✅ ${provider} responded in ${latency}ms (${tokens} tokens)`);

      return {
        content,
        provider,
        model,
        tokens,
        latency
      };

    } catch (error: any) {
      console.error(`❌ ${provider} failed:`, error.message);
      throw error;
    }
  }

  private async callDeepSeek(prompt: string): Promise<{ content: string; model: string; tokens: number }> {
    // DeepSeek R1 (reasoner) - best for reasoning, planning, organization
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner', // R1 - chain-of-thought reasoning, $0.55/$2.19 per M tokens
        messages: [
          { role: 'system', content: 'You are an expert assistant providing high-quality, detailed responses in Polish. Think step-by-step and provide comprehensive analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 8000 // Więcej tokenów dla pełnej analizy
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json() as any;
    
    // R1 returns reasoning_content + content
    const fullContent = data.choices[0].message.reasoning_content 
      ? `${data.choices[0].message.reasoning_content}\n\n${data.choices[0].message.content}`
      : data.choices[0].message.content;
    
    return {
      content: fullContent,
      model: 'deepseek-reasoner',
      tokens: data.usage?.total_tokens || 0
    };// Fallback: jeśli nie ma Claude, użyj tylko DeepSeek R1
      console.warn('⚠️ ANTHROPIC_API_KEY not set, using DeepSeek R1 only');
      return this.callDeepSeek(prompt);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000, // Więcej dla pełnych response.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json() as any;
    
    return {
      content: data.content[0].text,
      model: 'claude-3-5-sonnet-20241022',
      tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0
    };
  }

  private async callOpenAI(prompt: string): Promise<{ content: string; model: string; tokens: number }> {
    if (!this.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing high-quality responses in Polish.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json() as any;
    
    return {
      content: data.choices[0].message.content,
      model: 'gpt-4o',
      tokens: data.usage?.total_tokens || 0
    };
  }

  private async aggregateResponses(responses: MOAResponse[], taskType: TaskType): Promise<string> {
    console.log('🔀 Aggregating multiple model responses...');

    // For guide generation, use the longer, more detailed response
    if (taskType === 'guide_generation') {
      return responses.reduce((longest, current) => 
        current.content.length > longest.content.length ? current : longest
      ).content;
    }

    // For other tasks, combine insights
    const combined = responses.map(r => r.content).join('\n\n---\n\n');

    // Use Claude to synthesize final response
    try {
      const synthesisPrompt = `
Masz ${responses.length} różne odpowiedzi na to samo zadanie. Twoja rola: stworzyć JEDNĄ, najlepszą syntezę.

ODPOWIEDZI DO SYNTEZY:
${combined}

ZASADY:
- Wyciągnij NAJLEPSZE elementy z każdej odpowiedzi
- Usuń duplikaty i sprzeczności
- Zachowaj spójny ton i styl
- Stwórz płynną, naturalną narrację
- Język: Polski
- Format: Markdown

Wygeneruj TYLKO finalną wersję. Bez komentarzy meta.
`;

      const synthesis = await this.callClaude(synthesisPrompt);
      console.log('✅ Responses aggregated successfully');
      return synthesis.content;

    } catch (error) {
      console.warn('⚠️ Aggregation failed, using first response');
      return responses[0].content;
    }
  }

  async generateBatch(prompts: string[], taskType: TaskType): Promise<string[]> {
    console.log(`🐱 WHITECAT MOA batch: ${prompts.length} prompts`);
    
    const results = await Promise.all(
      prompts.map(prompt => this.generate(prompt, taskType))
    );

    return results;
  }
}
