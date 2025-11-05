/**
 * Feature Control System - Type Definitions
 * Centralized type definitions for feature flags, permissions, and plugins
 */

// Feature Permissions
export type Permission = 'public' | 'user' | 'admin' | 'system';

// Rate Limiting Configuration
export interface RateLimitConfig {
  requests: number;
  window: number; // milliseconds
  identifier?: 'ip' | 'user' | 'api-key';
}

// Feature Flag Status
export type FeatureStatus = 'enabled' | 'disabled' | 'beta' | 'deprecated';

// Environment-based Feature Configuration
export type Environment = 'development' | 'staging' | 'production';

// Feature Flag Definition
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  permissions: Permission[];
  rateLimit?: RateLimitConfig;
  environments?: Environment[];
  metadata?: Record<string, any>;
  dependencies?: string[]; // other feature IDs
  createdAt?: Date;
  updatedAt?: Date;
}

// Feature Configuration
export interface FeatureConfig {
  features: Record<string, FeatureFlag>;
  defaultPermission: Permission;
  enableRateLimiting: boolean;
}

// API Request Context
export interface RequestContext {
  clientAddress: string;
  userId?: string;
  apiKey?: string;
  userAgent?: string;
  timestamp: number;
  environment: Environment;
}

// API Response
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    featureId?: string;
    cached?: boolean;
    rateLimit?: {
      remaining: number;
      reset: number;
    };
  };
}

// Plugin Interface
export interface FeaturePlugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;

  // Lifecycle hooks
  initialize?(context: PluginContext): Promise<void>;
  execute?(request: PluginRequest): Promise<PluginResponse>;
  cleanup?(): Promise<void>;

  // Feature metadata
  metadata?: {
    author?: string;
    description?: string;
    dependencies?: string[];
  };
}

// Plugin Context
export interface PluginContext {
  env: any;
  config: Record<string, any>;
  logger?: (message: string, level?: 'info' | 'warn' | 'error') => void;
}

// Plugin Request
export interface PluginRequest {
  action: string;
  params: Record<string, any>;
  context: RequestContext;
}

// Plugin Response
export interface PluginResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

// Function Registry Entry
export interface FunctionRegistryEntry {
  id: string;
  name: string;
  category: 'ai' | 'media' | 'blog' | 'containers' | 'system' | 'custom';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  enabled: boolean;
  permissions: Permission[];
  rateLimit?: RateLimitConfig;
  plugin?: string; // plugin ID if function is provided by plugin
  metadata?: {
    description?: string;
    version?: string;
    tags?: string[];
  };
}

// Middleware Result
export interface MiddlewareResult {
  allowed: boolean;
  reason?: string;
  context?: RequestContext;
  metadata?: Record<string, any>;
}

// Feature Validation Result
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
