/**
 * Feature Flags System
 * Central system for managing feature toggles across the application
 */

import type { FeatureFlag, FeatureStatus, Permission, Environment, ValidationResult } from '@/Types/features';

export class FeatureFlagsManager {
  private features: Map<string, FeatureFlag>;
  private environment: Environment;

  constructor(environment: Environment = 'production') {
    this.features = new Map();
    this.environment = environment;
  }

  /**
   * Register a new feature flag
   */
  register(feature: FeatureFlag): void {
    // Validate feature before registering
    const validation = this.validateFeature(feature);
    if (!validation.valid) {
      throw new Error(`Feature validation failed: ${validation.errors?.join(', ')}`);
    }

    this.features.set(feature.id, {
      ...feature,
      createdAt: feature.createdAt || new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Register multiple features at once
   */
  registerBatch(features: FeatureFlag[]): void {
    features.forEach(feature => this.register(feature));
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(featureId: string, permission?: Permission): boolean {
    const feature = this.features.get(featureId);

    if (!feature) {
      console.warn(`Feature not found: ${featureId}`);
      return false;
    }

    // Check status
    if (feature.status === 'disabled') {
      return false;
    }

    // Check environment
    if (feature.environments && !feature.environments.includes(this.environment)) {
      return false;
    }

    // Check permission
    if (permission && !feature.permissions.includes(permission)) {
      return false;
    }

    // Check dependencies
    if (feature.dependencies) {
      for (const depId of feature.dependencies) {
        if (!this.isEnabled(depId)) {
          console.warn(`Dependency not met for ${featureId}: ${depId}`);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get feature flag details
   */
  getFeature(featureId: string): FeatureFlag | undefined {
    return this.features.get(featureId);
  }

  /**
   * Get all features
   */
  getAllFeatures(): FeatureFlag[] {
    return Array.from(this.features.values());
  }

  /**
   * Get features by status
   */
  getFeaturesByStatus(status: FeatureStatus): FeatureFlag[] {
    return Array.from(this.features.values()).filter(f => f.status === status);
  }

  /**
   * Update feature status
   */
  updateStatus(featureId: string, status: FeatureStatus): void {
    const feature = this.features.get(featureId);
    if (!feature) {
      throw new Error(`Feature not found: ${featureId}`);
    }

    this.features.set(featureId, {
      ...feature,
      status,
      updatedAt: new Date()
    });
  }

  /**
   * Enable a feature
   */
  enable(featureId: string): void {
    this.updateStatus(featureId, 'enabled');
  }

  /**
   * Disable a feature
   */
  disable(featureId: string): void {
    this.updateStatus(featureId, 'disabled');
  }

  /**
   * Set feature to beta
   */
  setBeta(featureId: string): void {
    this.updateStatus(featureId, 'beta');
  }

  /**
   * Deprecate a feature
   */
  deprecate(featureId: string): void {
    this.updateStatus(featureId, 'deprecated');
  }

  /**
   * Validate feature configuration
   */
  private validateFeature(feature: FeatureFlag): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!feature.id) errors.push('Feature ID is required');
    if (!feature.name) errors.push('Feature name is required');
    if (!feature.status) errors.push('Feature status is required');
    if (!feature.permissions || feature.permissions.length === 0) {
      errors.push('At least one permission is required');
    }

    // ID format
    if (feature.id && !/^[a-z0-9-]+$/.test(feature.id)) {
      errors.push('Feature ID must be lowercase alphanumeric with hyphens');
    }

    // Rate limit validation
    if (feature.rateLimit) {
      if (feature.rateLimit.requests <= 0) {
        errors.push('Rate limit requests must be positive');
      }
      if (feature.rateLimit.window <= 0) {
        errors.push('Rate limit window must be positive');
      }
    }

    // Circular dependency check
    if (feature.dependencies) {
      if (feature.dependencies.includes(feature.id)) {
        errors.push('Feature cannot depend on itself');
      }
    }

    // Warnings
    if (feature.status === 'deprecated' && !feature.metadata?.replacementFeature) {
      warnings.push('Deprecated features should specify a replacement');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Export configuration as JSON
   */
  exportConfig(): string {
    const config = {
      environment: this.environment,
      features: Array.from(this.features.values())
    };
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  importConfig(json: string): void {
    try {
      const config = JSON.parse(json);
      if (config.features && Array.isArray(config.features)) {
        config.features.forEach((feature: FeatureFlag) => this.register(feature));
      }
    } catch (error) {
      throw new Error(`Failed to import config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get feature statistics
   */
  getStats(): {
    total: number;
    enabled: number;
    disabled: number;
    beta: number;
    deprecated: number;
    byCategory: Record<string, number>;
  } {
    const features = Array.from(this.features.values());

    return {
      total: features.length,
      enabled: features.filter(f => f.status === 'enabled').length,
      disabled: features.filter(f => f.status === 'disabled').length,
      beta: features.filter(f => f.status === 'beta').length,
      deprecated: features.filter(f => f.status === 'deprecated').length,
      byCategory: {}
    };
  }
}

// Singleton instance
let instance: FeatureFlagsManager | null = null;

/**
 * Get the global feature flags manager instance
 */
export function getFeatureFlagsManager(environment?: Environment): FeatureFlagsManager {
  if (!instance) {
    instance = new FeatureFlagsManager(environment);
  }
  return instance;
}

/**
 * Reset the global instance (useful for testing)
 */
export function resetFeatureFlagsManager(): void {
  instance = null;
}
