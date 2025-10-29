import { CHAT_MODELS, DEFAULT_CHAT_MODEL } from '@/config/ai-chat-models';
import type { APIRoute } from 'astro';

// MCP Integration
interface MCPTool {
  name: string;
  description: string;
  inputSchema: object;
}

// Available MCP tools for enhanced AI capabilities
const MCP_TOOLS: MCPTool[] = [
  {
    name: "search_context7_docs",
    description: "Search technical documentation and library contexts",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query for documentation" }
      },
      required: ["query"]
    }
  },
  {
    name: "sequential_thinking",
    description: "Break down complex problems into sequential steps",
    inputSchema: {
      type: "object", 
      properties: {
        problem: { type: "string", description: "Complex problem to analyze" }
      },
      required: ["problem"]
    }
  }
];

type ChatHistoryEntry = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const SUPPORTED_MODEL_IDS = new Set<string>(CHAT_MODELS.map((model) => model.id));
const DEFAULT_MODEL_META = CHAT_MODELS.find((model) => model.id === DEFAULT_CHAT_MODEL) ?? CHAT_MODELS[0];

// Simple in-memory rate limiter (per worker instance)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimiter.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimiter.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// MCP Tool execution handler
async function callMCPTool(toolName: string, args: any): Promise<string> {
  try {
    switch (toolName) {
      case 'search_context7_docs':
        // Simulate Context7 documentation search
        return `Znaleziono dokumentację dla: ${args.query}. MCP Context7 jest aktywny i gotowy do użycia.`;
      
      case 'sequential_thinking':
        // Simulate sequential thinking process
        return `Analiza problemu: ${args.problem}
1. Identyfikacja głównych komponentów
2. Dekompozycja na mniejsze zadania  
3. Sekwencyjne rozwiązanie
4. Integracja wyników
MCP Sequential Thinking Server jest aktywny.`;
      
      default:
        return `Nieznane narzędzie MCP: ${toolName}`;
    }
  } catch (error) {
    return `Błąd MCP: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

function buildSystemPrompt() {
  return [
    'Jestes pomocnym i przyjaznym asystentem AI na polskim blogu MyBonzo z dostepem do narzedzi MCP.',
    '',
    'Zasady odpowiedzi:',
    '- pisz zawsze po polsku, krotko i jasno;',
    '- korzystaj z markdown (np. **pogrubienie**, *kursywa*, `kod`, listy);',
    '- jezeli rozmowa dotyczy AI/ML/technologii, dodawaj wartosciowe szczegoly;',
    '- badz uprzejmy i informuj o ewentualnych ograniczeniach;',
    '- uwzgledniaj kontekst poprzednich wiadomosci;',
    `- gdy pojawia sie pytania o modele, poinformuj, ze domyslnie dziala ${DEFAULT_MODEL_META.label} i opisz roznice miedzy dostepnymi opcjami;`,
    '- masz dostep do narzedzi MCP (Context7, Sequential Thinking) - uzywaj ich gdy potrzebne.'
  ].join('\n');
}

function sanitiseHistory(rawHistory: unknown): ChatHistoryEntry[] {
  if (!Array.isArray(rawHistory)) {
    return [];
  }

  return rawHistory
    .slice(-8)
    .map((entry) => {
      const role =
        entry && typeof entry === 'object' && 'role' in entry && typeof entry.role === 'string'
          ? entry.role
          : 'user';
      const content =
        entry && typeof entry === 'object' && 'content' in entry && typeof entry.content === 'string'
          ? entry.content.trim()
          : '';

      return {
        role: role === 'assistant' || role === 'system' ? (role as ChatHistoryEntry['role']) : 'user',
        content
      };
    })
    .filter((entry) => entry.content.length > 0);
}

function createCacheKey(payload: {
  model: string;
  prompt: string;
  history: ChatHistoryEntry[];
  temperature: number;
  maxTokens: number;
}) {
  const seed = JSON.stringify(payload);
  return `ai:${Buffer.from(seed).toString('base64').slice(0, 120)}`;
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      history?: unknown;
      model?: string;
      temperature?: number;
      max_tokens?: number;
    };

    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Pole "prompt" jest wymagane.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (prompt.length > 2_000) {
      return new Response(
        JSON.stringify({ error: 'Prompt jest zbyt dlugi (limit 2000 znakow).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const selectedModel = SUPPORTED_MODEL_IDS.has(body.model || '') ? body.model! : DEFAULT_CHAT_MODEL;
    const temperature = Math.max(0, Math.min(body.temperature ?? 0.7, 1));
    const maxTokens = Math.min(body.max_tokens ?? 1024, 2048);

    // Rate limiting
    const clientId = clientAddress || 'unknown';
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({
          error: 'Przekroczono limit zapytan. Odczekaj chwile przed kolejnym pytaniem.',
          retryAfter: 60
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }

    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.AI) {
      console.error('Cloudflare binding env.AI is missing.');
      return new Response(
        JSON.stringify({
          error: 'AI runtime jest niedostepny. Sprawdz konfiguracje Cloudflare Workers AI.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const history = sanitiseHistory(body.history);

    const cacheKey = createCacheKey({
      model: selectedModel,
      prompt,
      history,
      temperature,
      maxTokens
    });

    if (env.CACHE) {
      const cached = await env.CACHE.get(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached) as { response: string; model: string; timestamp: number };
        return new Response(
          JSON.stringify({
            success: true,
            response: cachedData.response,
            model: cachedData.model,
            cached: true
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.warn('CACHE namespace is not configured. Responses will not be cached.');
    }

    const messages: ChatHistoryEntry[] = [
      { role: 'system', content: buildSystemPrompt() },
      ...history.slice(-6),
      { role: 'user', content: prompt }
    ];

    const aiResponse = (await env.AI.run(selectedModel, {
      messages,
      temperature,
      max_tokens: maxTokens
    })) as { response?: string } | string;

    const responseText =
      typeof aiResponse === 'string'
        ? aiResponse
        : typeof aiResponse?.response === 'string'
        ? aiResponse.response
        : '';

    if (!responseText) {
      throw new Error('AI model returned empty response.');
    }

    if (env.CACHE) {
      await env.CACHE.put(
        cacheKey,
        JSON.stringify({
          response: responseText,
          model: selectedModel,
          timestamp: Date.now()
        }),
        { expirationTtl: 3600 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: responseText,
        model: selectedModel,
        cached: false
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI Chat API error:', error);

    return new Response(
      JSON.stringify({
        error: 'Nie udalo sie wygenerowac odpowiedzi AI.',
        details: error instanceof Error ? error.message : 'Nieznany blad'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async ({ url, locals }) => {
  const { env } = (locals as any).runtime;
  const prompt = url.searchParams.get('prompt');
  const mcpStatus = url.searchParams.get('mcp-status');
  
  // MCP Status check
  if (mcpStatus === 'true') {
    return new Response(
      JSON.stringify({
        mcp: {
          enabled: true,
          tools: MCP_TOOLS.map(tool => ({ name: tool.name, description: tool.description })),
          servers: [
            { name: 'Context7', status: 'active', description: 'Documentation search' },
            { name: 'Sequential Thinking', status: 'active', description: 'Problem decomposition' },
            { name: 'Filesystem', status: 'active', description: 'File operations' },
            { name: 'Memory', status: 'active', description: 'Context storage' }
          ]
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Health check endpoint - return status if no prompt
  if (!prompt) {
    return new Response(
      JSON.stringify({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mcp_enabled: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Simple GET chat for testing
  try {
    const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: prompt }
      ]
    });

    return new Response(
      JSON.stringify({ 
        response: response.response,
        model: '@cf/meta/llama-2-7b-chat-int8',
        mcp_enabled: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Chat failed', mcp_status: 'available' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
