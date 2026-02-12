globalThis.process ??= {}; globalThis.process.env ??= {};
class FeatureFlagsManager {
  constructor(environment = "production") {
    this.features = /* @__PURE__ */ new Map();
    this.environment = environment;
  }
  /**
   * Register a new feature flag
   */
  register(feature) {
    const validation = this.validateFeature(feature);
    if (!validation.valid) {
      throw new Error(`Feature validation failed: ${validation.errors?.join(", ")}`);
    }
    this.features.set(feature.id, {
      ...feature,
      createdAt: feature.createdAt || /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
  }
  /**
   * Register multiple features at once
   */
  registerBatch(features) {
    features.forEach((feature) => this.register(feature));
  }
  /**
   * Check if a feature is enabled
   */
  isEnabled(featureId, permission) {
    const feature = this.features.get(featureId);
    if (!feature) {
      console.warn(`Feature not found: ${featureId}`);
      return false;
    }
    if (feature.status === "disabled") {
      return false;
    }
    if (feature.environments && !feature.environments.includes(this.environment)) {
      return false;
    }
    if (permission && !feature.permissions.includes(permission)) {
      return false;
    }
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
  getFeature(featureId) {
    return this.features.get(featureId);
  }
  /**
   * Get all features
   */
  getAllFeatures() {
    return Array.from(this.features.values());
  }
  /**
   * Get features by status
   */
  getFeaturesByStatus(status) {
    return Array.from(this.features.values()).filter((f) => f.status === status);
  }
  /**
   * Update feature status
   */
  updateStatus(featureId, status) {
    const feature = this.features.get(featureId);
    if (!feature) {
      throw new Error(`Feature not found: ${featureId}`);
    }
    this.features.set(featureId, {
      ...feature,
      status,
      updatedAt: /* @__PURE__ */ new Date()
    });
  }
  /**
   * Enable a feature
   */
  enable(featureId) {
    this.updateStatus(featureId, "enabled");
  }
  /**
   * Disable a feature
   */
  disable(featureId) {
    this.updateStatus(featureId, "disabled");
  }
  /**
   * Set feature to beta
   */
  setBeta(featureId) {
    this.updateStatus(featureId, "beta");
  }
  /**
   * Deprecate a feature
   */
  deprecate(featureId) {
    this.updateStatus(featureId, "deprecated");
  }
  /**
   * Validate feature configuration
   */
  validateFeature(feature) {
    const errors = [];
    const warnings = [];
    if (!feature.id) errors.push("Feature ID is required");
    if (!feature.name) errors.push("Feature name is required");
    if (!feature.status) errors.push("Feature status is required");
    if (!feature.permissions || feature.permissions.length === 0) {
      errors.push("At least one permission is required");
    }
    if (feature.id && !/^[a-z0-9-]+$/.test(feature.id)) {
      errors.push("Feature ID must be lowercase alphanumeric with hyphens");
    }
    if (feature.rateLimit) {
      if (feature.rateLimit.requests <= 0) {
        errors.push("Rate limit requests must be positive");
      }
      if (feature.rateLimit.window <= 0) {
        errors.push("Rate limit window must be positive");
      }
    }
    if (feature.dependencies) {
      if (feature.dependencies.includes(feature.id)) {
        errors.push("Feature cannot depend on itself");
      }
    }
    if (feature.status === "deprecated" && !feature.metadata?.replacementFeature) {
      warnings.push("Deprecated features should specify a replacement");
    }
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : void 0,
      warnings: warnings.length > 0 ? warnings : void 0
    };
  }
  /**
   * Export configuration as JSON
   */
  exportConfig() {
    const config = {
      environment: this.environment,
      features: Array.from(this.features.values())
    };
    return JSON.stringify(config, null, 2);
  }
  /**
   * Import configuration from JSON
   */
  importConfig(json) {
    try {
      const config = JSON.parse(json);
      if (config.features && Array.isArray(config.features)) {
        config.features.forEach((feature) => this.register(feature));
      }
    } catch (error) {
      throw new Error(`Failed to import config: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Get feature statistics
   */
  getStats() {
    const features = Array.from(this.features.values());
    return {
      total: features.length,
      enabled: features.filter((f) => f.status === "enabled").length,
      disabled: features.filter((f) => f.status === "disabled").length,
      beta: features.filter((f) => f.status === "beta").length,
      deprecated: features.filter((f) => f.status === "deprecated").length,
      byCategory: {}
    };
  }
}
let instance = null;
function getFeatureFlagsManager(environment) {
  if (!instance) {
    instance = new FeatureFlagsManager(environment);
  }
  return instance;
}
function resetFeatureFlagsManager() {
  instance = null;
}

export { FeatureFlagsManager, getFeatureFlagsManager, resetFeatureFlagsManager };
