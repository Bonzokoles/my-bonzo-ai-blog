/**
 * Feature Configuration
 * Central configuration for all application features
 */

import type { Environment, FeatureFlag } from '@/Types/features';

/**
 * Get current environment
 */
export function getCurrentEnvironment(): Environment {
  // Check if we're in Cloudflare Workers
  if (typeof process === 'undefined') {
    return 'production';
  }

  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  return 'development';
}

/**
 * Feature Definitions
 * Define all application features here
 */
export const FEATURES: FeatureFlag[] = [
  // AI Features
  {
    id: 'ai-chat',
    name: 'AI Chat',
    description: 'AI-powered chat functionality with multiple models',
    status: 'enabled',
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 10,
      window: 60000, // 1 minute
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'ai',
      models: ['gemma-3-12b-it', 'qwq-32b', 'phi-2', 'openchat-3.5'],
      mcpEnabled: true
    }
  },
  {
    id: 'ai-image-generation',
    name: 'AI Image Generation',
    description: 'Generate images using AI models',
    status: 'enabled',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 5,
      window: 300000, // 5 minutes
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'ai',
      queueEnabled: true
    }
  },
  {
    id: 'ai-chat-openai',
    name: 'OpenAI Chat',
    description: 'Chat using OpenAI models via gateway',
    status: 'enabled',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 20,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    dependencies: ['ai-chat'],
    metadata: {
      category: 'ai',
      provider: 'openai'
    }
  },
  {
    id: 'ai-gemini-chat',
    name: 'Gemini Chat',
    description: 'Chat using Google Gemini models',
    status: 'enabled',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 15,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    dependencies: ['ai-chat'],
    metadata: {
      category: 'ai',
      provider: 'google'
    }
  },
  {
    id: 'ai-rag-chat',
    name: 'RAG Chat',
    description: 'AI chat with RAG (Retrieval Augmented Generation) using vectorized knowledge base',
    status: 'enabled',
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 10,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    dependencies: ['ai-chat'],
    metadata: {
      category: 'ai',
      provider: 'worker-michael',
      vectorize: true,
      cacheable: true
    }
  },
  {
    id: 'ai-bonzo-avatar',
    name: 'Bonzo Avatar',
    description: 'AI avatar generation for Bonzo character',
    status: 'beta',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 3,
      window: 300000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'ai',
      experimental: true
    }
  },
  {
    id: 'ai-bonzo-voice',
    name: 'Bonzo Voice',
    description: 'Text-to-speech for Bonzo character',
    status: 'beta',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 10,
      window: 300000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'ai',
      experimental: true
    }
  },

  // WHITECAT Integration
  {
    id: 'whitecat-guides',
    name: 'WHITECAT Buying Guides',
    description: 'AI-generated buying guides with UTM tracking and revenue attribution',
    status: 'enabled',
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 20,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    dependencies: ['ai-chat'],
    metadata: {
      category: 'guides',
      provider: 'whitecat',
      utm_tracking: true,
      revenue_attribution: true,
      products: 2560,
      categories: 68
    }
  },
  {
    id: 'whitecat-products',
    name: 'Product Manager',
    description: 'Product data management with UTM tracking for Meble Pumo integration',
    status: 'enabled',
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 50,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'products',
      provider: 'whitecat',
      data_source: 'xml_feeds'
    }
  },

  // Media Features
  {
    id: 'media-upload',
    name: 'Media Upload',
    description: 'Upload media files to R2 storage',
    status: 'enabled',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 20,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'media',
      maxFileSize: 10485760, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    }
  },
  {
    id: 'media-list',
    name: 'Media List',
    description: 'List uploaded media files',
    status: 'enabled',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 30,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'media'
    }
  },
  {
    id: 'media-delete',
    name: 'Media Delete',
    description: 'Delete media files from storage',
    status: 'enabled',
    permissions: ['admin'],
    rateLimit: {
      requests: 10,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'media'
    }
  },
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    description: 'Browse and manage image gallery',
    status: 'enabled',
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 50,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'media'
    }
  },

  // Blog Features
  {
    id: 'blog-api',
    name: 'Blog API',
    description: 'CRUD operations for blog posts',
    status: 'enabled',
    permissions: ['public', 'user', 'admin'],
    rateLimit: {
      requests: 100,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'blog'
    }
  },

  // Container Features
  {
    id: 'containers-management',
    name: 'Container Management',
    description: 'Manage Docker/Kubernetes containers',
    status: 'disabled', // Disabled by default for security
    permissions: ['admin', 'system'],
    rateLimit: {
      requests: 5,
      window: 60000,
      identifier: 'api-key'
    },
    environments: ['development', 'staging'],
    metadata: {
      category: 'containers',
      requiresAuth: true,
      dangerous: true
    }
  },

  // System Features
  {
    id: 'health-check',
    name: 'Health Check',
    description: 'API health and status monitoring',
    status: 'enabled',
    permissions: ['public', 'user', 'admin', 'system'],
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'system'
    }
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'Unified API gateway for external services',
    status: 'enabled',
    permissions: ['user', 'admin'],
    rateLimit: {
      requests: 50,
      window: 60000,
      identifier: 'ip'
    },
    environments: ['development', 'staging', 'production'],
    metadata: {
      category: 'system'
    }
  }
];

/**
 * Default feature configuration
 */
export const DEFAULT_FEATURE_CONFIG = {
  defaultPermission: 'public' as const,
  enableRateLimiting: true,
  enableLogging: true,
  enableCaching: true,
  cacheTTL: 3600 // 1 hour
};

/**
 * Get feature by ID
 */
export function getFeatureById(id: string): FeatureFlag | undefined {
  return FEATURES.find(f => f.id === id);
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(category: string): FeatureFlag[] {
  return FEATURES.filter(f => f.metadata?.category === category);
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return FEATURES.filter(f => f.status === 'enabled');
}

/**
 * Check if feature is enabled in current environment
 */
export function isFeatureEnabledInEnvironment(featureId: string): boolean {
  const feature = getFeatureById(featureId);
  if (!feature) return false;

  const currentEnv = getCurrentEnvironment();

  // If no environments specified, assume all environments
  if (!feature.environments) return feature.status === 'enabled';

  return feature.status === 'enabled' && feature.environments.includes(currentEnv);
}
