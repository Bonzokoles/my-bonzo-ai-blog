/**
 * Function Registry
 * Central registry for all API functions and endpoints
 */

import type { FunctionRegistryEntry, Permission } from '@/Types/features';

export class FunctionRegistry {
  private functions: Map<string, FunctionRegistryEntry>;

  constructor() {
    this.functions = new Map();
  }

  /**
   * Register a new function
   */
  register(entry: FunctionRegistryEntry): void {
    if (this.functions.has(entry.id)) {
      console.warn(`Function already registered: ${entry.id}. Overwriting.`);
    }

    this.functions.set(entry.id, entry);
  }

  /**
   * Register multiple functions
   */
  registerBatch(entries: FunctionRegistryEntry[]): void {
    entries.forEach(entry => this.register(entry));
  }

  /**
   * Get function by ID
   */
  getFunction(id: string): FunctionRegistryEntry | undefined {
    return this.functions.get(id);
  }

  /**
   * Get all functions
   */
  getAllFunctions(): FunctionRegistryEntry[] {
    return Array.from(this.functions.values());
  }

  /**
   * Get functions by category
   */
  getFunctionsByCategory(category: FunctionRegistryEntry['category']): FunctionRegistryEntry[] {
    return Array.from(this.functions.values()).filter(f => f.category === category);
  }

  /**
   * Get enabled functions
   */
  getEnabledFunctions(): FunctionRegistryEntry[] {
    return Array.from(this.functions.values()).filter(f => f.enabled);
  }

  /**
   * Get functions by permission
   */
  getFunctionsByPermission(permission: Permission): FunctionRegistryEntry[] {
    return Array.from(this.functions.values()).filter(f =>
      f.permissions.includes(permission)
    );
  }

  /**
   * Find function by endpoint
   */
  findByEndpoint(endpoint: string, method?: string): FunctionRegistryEntry | undefined {
    return Array.from(this.functions.values()).find(f => {
      const endpointMatch = f.endpoint === endpoint;
      const methodMatch = method ? f.method === method : true;
      return endpointMatch && methodMatch;
    });
  }

  /**
   * Enable a function
   */
  enable(id: string): void {
    const func = this.functions.get(id);
    if (func) {
      this.functions.set(id, { ...func, enabled: true });
    }
  }

  /**
   * Disable a function
   */
  disable(id: string): void {
    const func = this.functions.get(id);
    if (func) {
      this.functions.set(id, { ...func, enabled: false });
    }
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const functions = Array.from(this.functions.values());

    const byCategory = functions.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byMethod = functions.reduce((acc, f) => {
      acc[f.method] = (acc[f.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: functions.length,
      enabled: functions.filter(f => f.enabled).length,
      disabled: functions.filter(f => !f.enabled).length,
      byCategory,
      byMethod,
      withRateLimit: functions.filter(f => f.rateLimit).length,
      withPlugin: functions.filter(f => f.plugin).length
    };
  }

  /**
   * Export registry as JSON
   */
  export(): string {
    return JSON.stringify(
      {
        functions: Array.from(this.functions.values()),
        stats: this.getStats()
      },
      null,
      2
    );
  }

  /**
   * Generate API documentation
   */
  generateDocs(): string {
    const functions = this.getAllFunctions();

    let docs = '# API Function Registry\n\n';
    docs += `Total Functions: ${functions.length}\n\n`;

    // Group by category
    const categories = new Set(functions.map(f => f.category));

    for (const category of categories) {
      docs += `## ${category.toUpperCase()}\n\n`;

      const categoryFunctions = this.getFunctionsByCategory(category);

      for (const func of categoryFunctions) {
        docs += `### ${func.name}\n`;
        docs += `- **ID**: \`${func.id}\`\n`;
        docs += `- **Endpoint**: \`${func.method} ${func.endpoint}\`\n`;
        docs += `- **Status**: ${func.enabled ? '✅ Enabled' : '❌ Disabled'}\n`;
        docs += `- **Permissions**: ${func.permissions.join(', ')}\n`;

        if (func.rateLimit) {
          docs += `- **Rate Limit**: ${func.rateLimit.requests} requests per ${func.rateLimit.window / 1000}s\n`;
        }

        if (func.metadata?.description) {
          docs += `- **Description**: ${func.metadata.description}\n`;
        }

        if (func.plugin) {
          docs += `- **Plugin**: ${func.plugin}\n`;
        }

        docs += '\n';
      }
    }

    return docs;
  }
}

// Singleton instance
let registryInstance: FunctionRegistry | null = null;

/**
 * Get the global function registry
 */
export function getFunctionRegistry(): FunctionRegistry {
  if (!registryInstance) {
    registryInstance = new FunctionRegistry();
    // Register default functions
    registryInstance.registerBatch(DEFAULT_FUNCTIONS);
  }
  return registryInstance;
}

/**
 * Reset the registry (for testing)
 */
export function resetFunctionRegistry(): void {
  registryInstance = null;
}

/**
 * Default Function Definitions
 */
export const DEFAULT_FUNCTIONS: FunctionRegistryEntry[] = [
  // AI Functions
  {
    id: 'ai-chat',
    name: 'AI Chat',
    category: 'ai',
    endpoint: '/api/ai/chat',
    method: 'POST',
    enabled: true,
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 10,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Multi-model AI chat endpoint',
      version: '1.0.0',
      tags: ['ai', 'chat', 'mcp']
    }
  },
  {
    id: 'ai-chat-openai',
    name: 'OpenAI Chat',
    category: 'ai',
    endpoint: '/api/ai/chat-openai',
    method: 'POST',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 20,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Chat using OpenAI models',
      version: '1.0.0',
      tags: ['ai', 'chat', 'openai']
    }
  },
  {
    id: 'ai-gemini-chat',
    name: 'Gemini Chat',
    category: 'ai',
    endpoint: '/api/ai/gemini-chat',
    method: 'POST',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 15,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Chat using Google Gemini models',
      version: '1.0.0',
      tags: ['ai', 'chat', 'gemini']
    }
  },
  {
    id: 'ai-image-generation',
    name: 'Image Generation',
    category: 'ai',
    endpoint: '/api/ai/generate-image',
    method: 'POST',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 5,
      window: 300000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Generate images using AI',
      version: '1.0.0',
      tags: ['ai', 'image', 'generation']
    }
  },
  {
    id: 'ai-image-queue',
    name: 'Image Generation Queue',
    category: 'ai',
    endpoint: '/api/ai/generate-image-queue',
    method: 'POST',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 10,
      window: 300000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Queue-based image generation',
      version: '1.0.0',
      tags: ['ai', 'image', 'queue']
    }
  },
  {
    id: 'ai-bonzo-avatar',
    name: 'Bonzo Avatar',
    category: 'ai',
    endpoint: '/api/ai/bonzo-avatar',
    method: 'POST',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 3,
      window: 300000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Generate Bonzo character avatar',
      version: '1.0.0',
      tags: ['ai', 'avatar', 'bonzo']
    }
  },
  {
    id: 'ai-bonzo-voice',
    name: 'Bonzo Voice',
    category: 'ai',
    endpoint: '/api/ai/bonzo-voice',
    method: 'POST',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 10,
      window: 300000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Text-to-speech for Bonzo',
      version: '1.0.0',
      tags: ['ai', 'voice', 'tts']
    }
  },

  // Media Functions
  {
    id: 'media-upload',
    name: 'Media Upload',
    category: 'media',
    endpoint: '/api/media/upload',
    method: 'POST',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 20,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Upload media files',
      version: '1.0.0',
      tags: ['media', 'upload']
    }
  },
  {
    id: 'media-list',
    name: 'Media List',
    category: 'media',
    endpoint: '/api/media/list',
    method: 'GET',
    enabled: true,
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 30,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'List uploaded media',
      version: '1.0.0',
      tags: ['media', 'list']
    }
  },
  {
    id: 'media-delete',
    name: 'Media Delete',
    category: 'media',
    endpoint: '/api/media/delete',
    method: 'DELETE',
    enabled: true,
    permissions: ['admin'],
    rateLimit: {
      requests: 10,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Delete media files',
      version: '1.0.0',
      tags: ['media', 'delete']
    }
  },
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    category: 'media',
    endpoint: '/api/media/gallery',
    method: 'GET',
    enabled: true,
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 50,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'Browse AI-generated image gallery',
      version: '1.0.0',
      tags: ['media', 'gallery', 'ai']
    }
  },

  // Blog Functions
  {
    id: 'blog-list',
    name: 'Blog Posts List',
    category: 'blog',
    endpoint: '/api/blog',
    method: 'GET',
    enabled: true,
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 100,
      window: 60000,
      identifier: 'ip'
    },
    metadata: {
      description: 'List blog posts',
      version: '1.0.0',
      tags: ['blog', 'list']
    }
  },

  // Container Functions
  {
    id: 'containers-manage',
    name: 'Container Management',
    category: 'containers',
    endpoint: '/api/containers/manage',
    method: 'POST',
    enabled: false,
    permissions: ['admin', 'system'],
    rateLimit: {
      requests: 5,
      window: 60000,
      identifier: 'api-key'
    },
    metadata: {
      description: 'Manage Docker/K8s containers',
      version: '1.0.0',
      tags: ['containers', 'docker', 'kubernetes']
    }
  },

  // System Functions
  {
    id: 'health-check',
    name: 'Health Check',
    category: 'system',
    endpoint: '/api/health',
    method: 'GET',
    enabled: true,
    permissions: ['public', 'user', 'admin', 'system'],
    metadata: {
      description: 'API health status',
      version: '1.0.0',
      tags: ['system', 'health']
    }
  }
];
