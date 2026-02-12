globalThis.process ??= {}; globalThis.process.env ??= {};
import { withFeatureMiddleware } from '../../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../../renderers.mjs';

class FunctionRegistry {
  constructor() {
    this.functions = /* @__PURE__ */ new Map();
  }
  /**
   * Register a new function
   */
  register(entry) {
    if (this.functions.has(entry.id)) {
      console.warn(`Function already registered: ${entry.id}. Overwriting.`);
    }
    this.functions.set(entry.id, entry);
  }
  /**
   * Register multiple functions
   */
  registerBatch(entries) {
    entries.forEach((entry) => this.register(entry));
  }
  /**
   * Get function by ID
   */
  getFunction(id) {
    return this.functions.get(id);
  }
  /**
   * Get all functions
   */
  getAllFunctions() {
    return Array.from(this.functions.values());
  }
  /**
   * Get functions by category
   */
  getFunctionsByCategory(category) {
    return Array.from(this.functions.values()).filter((f) => f.category === category);
  }
  /**
   * Get enabled functions
   */
  getEnabledFunctions() {
    return Array.from(this.functions.values()).filter((f) => f.enabled);
  }
  /**
   * Get functions by permission
   */
  getFunctionsByPermission(permission) {
    return Array.from(this.functions.values()).filter(
      (f) => f.permissions.includes(permission)
    );
  }
  /**
   * Find function by endpoint
   */
  findByEndpoint(endpoint, method) {
    return Array.from(this.functions.values()).find((f) => {
      const endpointMatch = f.endpoint === endpoint;
      const methodMatch = method ? f.method === method : true;
      return endpointMatch && methodMatch;
    });
  }
  /**
   * Enable a function
   */
  enable(id) {
    const func = this.functions.get(id);
    if (func) {
      this.functions.set(id, { ...func, enabled: true });
    }
  }
  /**
   * Disable a function
   */
  disable(id) {
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
    }, {});
    const byMethod = functions.reduce((acc, f) => {
      acc[f.method] = (acc[f.method] || 0) + 1;
      return acc;
    }, {});
    return {
      total: functions.length,
      enabled: functions.filter((f) => f.enabled).length,
      disabled: functions.filter((f) => !f.enabled).length,
      byCategory,
      byMethod,
      withRateLimit: functions.filter((f) => f.rateLimit).length,
      withPlugin: functions.filter((f) => f.plugin).length
    };
  }
  /**
   * Export registry as JSON
   */
  export() {
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
  generateDocs() {
    const functions = this.getAllFunctions();
    let docs = "# API Function Registry\n\n";
    docs += `Total Functions: ${functions.length}

`;
    const categories = new Set(functions.map((f) => f.category));
    for (const category of categories) {
      docs += `## ${category.toUpperCase()}

`;
      const categoryFunctions = this.getFunctionsByCategory(category);
      for (const func of categoryFunctions) {
        docs += `### ${func.name}
`;
        docs += `- **ID**: \`${func.id}\`
`;
        docs += `- **Endpoint**: \`${func.method} ${func.endpoint}\`
`;
        docs += `- **Status**: ${func.enabled ? "✅ Enabled" : "❌ Disabled"}
`;
        docs += `- **Permissions**: ${func.permissions.join(", ")}
`;
        if (func.rateLimit) {
          docs += `- **Rate Limit**: ${func.rateLimit.requests} requests per ${func.rateLimit.window / 1e3}s
`;
        }
        if (func.metadata?.description) {
          docs += `- **Description**: ${func.metadata.description}
`;
        }
        if (func.plugin) {
          docs += `- **Plugin**: ${func.plugin}
`;
        }
        docs += "\n";
      }
    }
    return docs;
  }
}
let registryInstance = null;
function getFunctionRegistry() {
  if (!registryInstance) {
    registryInstance = new FunctionRegistry();
    registryInstance.registerBatch(DEFAULT_FUNCTIONS);
  }
  return registryInstance;
}
const DEFAULT_FUNCTIONS = [
  // AI Functions
  {
    id: "ai-chat",
    name: "AI Chat",
    category: "ai",
    endpoint: "/api/ai/chat",
    method: "POST",
    enabled: true,
    permissions: ["public", "user", "admin"],
    rateLimit: {
      requests: 10,
      window: 6e4,
      identifier: "ip"
    },
    metadata: {
      description: "Multi-model AI chat endpoint",
      version: "1.0.0",
      tags: ["ai", "chat", "mcp"]
    }
  },
  {
    id: "ai-chat-openai",
    name: "OpenAI Chat",
    category: "ai",
    endpoint: "/api/ai/chat-openai",
    method: "POST",
    enabled: true,
    permissions: ["user", "admin"],
    rateLimit: {
      requests: 20,
      window: 6e4,
      identifier: "ip"
    },
    metadata: {
      description: "Chat using OpenAI models",
      version: "1.0.0",
      tags: ["ai", "chat", "openai"]
    }
  },
  {
    id: "ai-gemini-chat",
    name: "Gemini Chat",
    category: "ai",
    endpoint: "/api/ai/gemini-chat",
    method: "POST",
    enabled: true,
    permissions: ["user", "admin"],
    rateLimit: {
      requests: 15,
      window: 6e4,
      identifier: "ip"
    },
    metadata: {
      description: "Chat using Google Gemini models",
      version: "1.0.0",
      tags: ["ai", "chat", "gemini"]
    }
  },
  {
    id: "ai-image-generation",
    name: "Image Generation",
    category: "ai",
    endpoint: "/api/ai/generate-image",
    method: "POST",
    enabled: true,
    permissions: ["user", "admin"],
    rateLimit: {
      requests: 5,
      window: 3e5,
      identifier: "ip"
    },
    metadata: {
      description: "Generate images using AI",
      version: "1.0.0",
      tags: ["ai", "image", "generation"]
    }
  },
  {
    id: "ai-image-queue",
    name: "Image Generation Queue",
    category: "ai",
    endpoint: "/api/ai/generate-image-queue",
    method: "POST",
    enabled: true,
    permissions: ["user", "admin"],
    rateLimit: {
      requests: 10,
      window: 3e5,
      identifier: "ip"
    },
    metadata: {
      description: "Queue-based image generation",
      version: "1.0.0",
      tags: ["ai", "image", "queue"]
    }
  },
  {
    id: "ai-bonzo-avatar",
    name: "Bonzo Avatar",
    category: "ai",
    endpoint: "/api/ai/bonzo-avatar",
    method: "POST",
    enabled: true,
    permissions: ["user", "admin"],
    rateLimit: {
      requests: 3,
      window: 3e5,
      identifier: "ip"
    },
    metadata: {
      description: "Generate Bonzo character avatar",
      version: "1.0.0",
      tags: ["ai", "avatar", "bonzo"]
    }
  },
  {
    id: "ai-bonzo-voice",
    name: "Bonzo Voice",
    category: "ai",
    endpoint: "/api/ai/bonzo-voice",
    method: "POST",
    enabled: true,
    permissions: ["user", "admin"],
    rateLimit: {
      requests: 10,
      window: 3e5,
      identifier: "ip"
    },
    metadata: {
      description: "Text-to-speech for Bonzo",
      version: "1.0.0",
      tags: ["ai", "voice", "tts"]
    }
  },
  // Media Functions
  {
    id: "media-upload",
    name: "Media Upload",
    category: "media",
    endpoint: "/api/media/upload",
    method: "POST",
    enabled: true,
    permissions: ["user", "admin"],
    rateLimit: {
      requests: 20,
      window: 6e4,
      identifier: "ip"
    },
    metadata: {
      description: "Upload media files",
      version: "1.0.0",
      tags: ["media", "upload"]
    }
  },
  {
    id: "media-list",
    name: "Media List",
    category: "media",
    endpoint: "/api/media/list",
    method: "GET",
    enabled: true,
    permissions: ["user", "admin"],
    rateLimit: {
      requests: 30,
      window: 6e4,
      identifier: "ip"
    },
    metadata: {
      description: "List uploaded media",
      version: "1.0.0",
      tags: ["media", "list"]
    }
  },
  {
    id: "media-delete",
    name: "Media Delete",
    category: "media",
    endpoint: "/api/media/delete",
    method: "DELETE",
    enabled: true,
    permissions: ["admin"],
    rateLimit: {
      requests: 10,
      window: 6e4,
      identifier: "ip"
    },
    metadata: {
      description: "Delete media files",
      version: "1.0.0",
      tags: ["media", "delete"]
    }
  },
  // Blog Functions
  {
    id: "blog-list",
    name: "Blog Posts List",
    category: "blog",
    endpoint: "/api/blog",
    method: "GET",
    enabled: true,
    permissions: ["public", "user", "admin"],
    rateLimit: {
      requests: 100,
      window: 6e4,
      identifier: "ip"
    },
    metadata: {
      description: "List blog posts",
      version: "1.0.0",
      tags: ["blog", "list"]
    }
  },
  // Container Functions
  {
    id: "containers-manage",
    name: "Container Management",
    category: "containers",
    endpoint: "/api/containers/manage",
    method: "POST",
    enabled: false,
    permissions: ["admin", "system"],
    rateLimit: {
      requests: 5,
      window: 6e4,
      identifier: "api-key"
    },
    metadata: {
      description: "Manage Docker/K8s containers",
      version: "1.0.0",
      tags: ["containers", "docker", "kubernetes"]
    }
  },
  // System Functions
  {
    id: "health-check",
    name: "Health Check",
    category: "system",
    endpoint: "/api/health",
    method: "GET",
    enabled: true,
    permissions: ["public", "user", "admin", "system"],
    metadata: {
      description: "API health status",
      version: "1.0.0",
      tags: ["system", "health"]
    }
  }
];

const prerender = false;
const GET = async (context) => {
  return withFeatureMiddleware(
    "health-check",
    // Using health-check feature for registry access
    context,
    "public",
    async (ctx, requestContext) => {
      const { url } = ctx.request;
      const action = url.searchParams.get("action") || "list";
      const registry = getFunctionRegistry();
      const featureManager = getFeatureManagerInstance();
      switch (action) {
        case "list":
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                functions: registry.getAllFunctions(),
                stats: registry.getStats()
              }
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }
          );
        case "enabled":
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                functions: registry.getEnabledFunctions(),
                count: registry.getEnabledFunctions().length
              }
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }
          );
        case "features":
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                features: featureManager.getAllFeatures(),
                stats: featureManager.getStats()
              }
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }
          );
        case "docs":
          const docs = registry.generateDocs();
          return new Response(docs, {
            status: 200,
            headers: { "Content-Type": "text/markdown" }
          });
        case "stats":
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                functions: registry.getStats(),
                features: featureManager.getStats()
              }
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }
          );
        case "category":
          const category = url.searchParams.get("name");
          if (!category) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Category name is required"
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" }
              }
            );
          }
          const categoryFunctions = registry.getFunctionsByCategory(
            category
          );
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                category,
                functions: categoryFunctions,
                count: categoryFunctions.length
              }
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }
          );
        default:
          return new Response(
            JSON.stringify({
              success: false,
              error: `Unknown action: ${action}`
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
