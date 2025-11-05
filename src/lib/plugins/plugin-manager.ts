/**
 * Plugin Manager
 * Modular system for adding and managing application features via plugins
 */

import type {
  FeaturePlugin,
  PluginContext,
  PluginRequest,
  PluginResponse
} from '@/Types/features';

export class PluginManager {
  private plugins: Map<string, FeaturePlugin>;
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.plugins = new Map();
    this.context = context;
  }

  /**
   * Register a plugin
   */
  async register(plugin: FeaturePlugin): Promise<void> {
    // Validate plugin
    if (!plugin.id || !plugin.name) {
      throw new Error('Plugin must have id and name');
    }

    if (this.plugins.has(plugin.id)) {
      this.log(`Plugin ${plugin.id} already registered. Overwriting.`, 'warn');
    }

    // Check dependencies
    if (plugin.metadata?.dependencies) {
      for (const depId of plugin.metadata.dependencies) {
        if (!this.plugins.has(depId)) {
          throw new Error(`Plugin dependency not met: ${depId}`);
        }
      }
    }

    // Initialize plugin if it has initialize method
    if (plugin.initialize) {
      try {
        await plugin.initialize(this.context);
        this.log(`Plugin ${plugin.name} initialized successfully`);
      } catch (error) {
        throw new Error(
          `Failed to initialize plugin ${plugin.name}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }

    this.plugins.set(plugin.id, plugin);
    this.log(`Plugin ${plugin.name} registered`);
  }

  /**
   * Register multiple plugins
   */
  async registerBatch(plugins: FeaturePlugin[]): Promise<void> {
    for (const plugin of plugins) {
      await this.register(plugin);
    }
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id: string): FeaturePlugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): FeaturePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get enabled plugins
   */
  getEnabledPlugins(): FeaturePlugin[] {
    return Array.from(this.plugins.values()).filter(p => p.enabled);
  }

  /**
   * Execute plugin action
   */
  async execute(pluginId: string, request: PluginRequest): Promise<PluginResponse> {
    const plugin = this.plugins.get(pluginId);

    if (!plugin) {
      return {
        success: false,
        error: `Plugin not found: ${pluginId}`
      };
    }

    if (!plugin.enabled) {
      return {
        success: false,
        error: `Plugin disabled: ${pluginId}`
      };
    }

    if (!plugin.execute) {
      return {
        success: false,
        error: `Plugin ${pluginId} does not support execution`
      };
    }

    try {
      this.log(`Executing plugin ${plugin.name} - action: ${request.action}`);
      const result = await plugin.execute(request);
      return result;

    } catch (error) {
      this.log(
        `Plugin execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Plugin execution failed'
      };
    }
  }

  /**
   * Enable plugin
   */
  enable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      this.plugins.set(pluginId, { ...plugin, enabled: true });
      this.log(`Plugin ${plugin.name} enabled`);
    }
  }

  /**
   * Disable plugin
   */
  disable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      this.plugins.set(pluginId, { ...plugin, enabled: false });
      this.log(`Plugin ${plugin.name} disabled`);
    }
  }

  /**
   * Unregister plugin
   */
  async unregister(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);

    if (!plugin) {
      this.log(`Plugin not found: ${pluginId}`, 'warn');
      return;
    }

    // Call cleanup if available
    if (plugin.cleanup) {
      try {
        await plugin.cleanup();
        this.log(`Plugin ${plugin.name} cleaned up`);
      } catch (error) {
        this.log(
          `Plugin cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'error'
        );
      }
    }

    this.plugins.delete(pluginId);
    this.log(`Plugin ${plugin.name} unregistered`);
  }

  /**
   * Get plugin statistics
   */
  getStats() {
    const plugins = Array.from(this.plugins.values());

    return {
      total: plugins.length,
      enabled: plugins.filter(p => p.enabled).length,
      disabled: plugins.filter(p => !p.enabled).length,
      withExecute: plugins.filter(p => p.execute).length,
      withInitialize: plugins.filter(p => p.initialize).length,
      withCleanup: plugins.filter(p => p.cleanup).length
    };
  }

  /**
   * Export plugin list
   */
  export(): string {
    return JSON.stringify(
      {
        plugins: Array.from(this.plugins.values()).map(p => ({
          id: p.id,
          name: p.name,
          version: p.version,
          enabled: p.enabled,
          metadata: p.metadata
        })),
        stats: this.getStats()
      },
      null,
      2
    );
  }

  /**
   * Log message
   */
  private log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (this.context.logger) {
      this.context.logger(`[PluginManager] ${message}`, level);
    } else {
      console[level](`[PluginManager] ${message}`);
    }
  }
}

// Singleton instance
let managerInstance: PluginManager | null = null;

/**
 * Get the global plugin manager
 */
export function getPluginManager(context?: PluginContext): PluginManager {
  if (!managerInstance && context) {
    managerInstance = new PluginManager(context);
  }

  if (!managerInstance) {
    throw new Error('Plugin manager not initialized. Provide context on first call.');
  }

  return managerInstance;
}

/**
 * Reset plugin manager (for testing)
 */
export function resetPluginManager(): void {
  managerInstance = null;
}
