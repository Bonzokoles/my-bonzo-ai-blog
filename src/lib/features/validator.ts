/**
 * Feature Control System Validator
 * Validates consistency between features config and function registry
 */

import { FEATURES } from '@/config/features';
import { DEFAULT_FUNCTIONS } from '@/lib/registry/function-registry';
import type { FeatureFlag } from '@/Types/features';
import type { FunctionRegistryEntry } from '@/Types/features';

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  category: 'id-mismatch' | 'missing-feature' | 'missing-function' | 'config-mismatch' | 'orphaned';
  message: string;
  details?: any;
}

export interface ValidationReport {
  valid: boolean;
  issues: ValidationIssue[];
  stats: {
    totalFeatures: number;
    totalFunctions: number;
    errors: number;
    warnings: number;
    info: number;
  };
}

/**
 * Validate the entire Feature Control System
 */
export function validateFeatureControlSystem(): ValidationReport {
  const issues: ValidationIssue[] = [];

  // Create lookup maps
  const featureMap = new Map(FEATURES.map(f => [f.id, f]));
  const functionMap = new Map(DEFAULT_FUNCTIONS.map(f => [f.id, f]));

  // 1. Check for features without corresponding functions
  for (const feature of FEATURES) {
    const func = functionMap.get(feature.id);

    if (!func) {
      // Some features might be meta/system features without functions
      if (!['health-check', 'api-gateway'].includes(feature.id)) {
        issues.push({
          type: 'warning',
          category: 'missing-function',
          message: `Feature '${feature.id}' has no corresponding function in registry`,
          details: { featureName: feature.name }
        });
      }
      continue;
    }

    // Check if permissions match
    const featurePerms = new Set(feature.permissions);
    const funcPerms = new Set(func.permissions);

    if (featurePerms.size !== funcPerms.size ||
        ![...featurePerms].every(p => funcPerms.has(p))) {
      issues.push({
        type: 'warning',
        category: 'config-mismatch',
        message: `Permissions mismatch for '${feature.id}'`,
        details: {
          feature: feature.permissions,
          function: func.permissions
        }
      });
    }

    // Check if rate limits match (if both defined)
    if (feature.rateLimit && func.rateLimit) {
      if (feature.rateLimit.requests !== func.rateLimit.requests ||
          feature.rateLimit.window !== func.rateLimit.window) {
        issues.push({
          type: 'warning',
          category: 'config-mismatch',
          message: `Rate limit mismatch for '${feature.id}'`,
          details: {
            feature: feature.rateLimit,
            function: func.rateLimit
          }
        });
      }
    }

    // Check if categories match
    const featureCategory = feature.metadata?.category;
    if (featureCategory && featureCategory !== func.category) {
      issues.push({
        type: 'info',
        category: 'config-mismatch',
        message: `Category mismatch for '${feature.id}': feature='${featureCategory}', function='${func.category}'`,
        details: {
          featureCategory,
          functionCategory: func.category
        }
      });
    }
  }

  // 2. Check for functions without corresponding features
  for (const func of DEFAULT_FUNCTIONS) {
    if (!featureMap.has(func.id)) {
      issues.push({
        type: 'error',
        category: 'missing-feature',
        message: `Function '${func.id}' has no corresponding feature in config`,
        details: { functionName: func.name, endpoint: func.endpoint }
      });
    }
  }

  // 3. Check for duplicate IDs
  const featureIds = new Set<string>();
  for (const feature of FEATURES) {
    if (featureIds.has(feature.id)) {
      issues.push({
        type: 'error',
        category: 'id-mismatch',
        message: `Duplicate feature ID: '${feature.id}'`,
        details: { id: feature.id }
      });
    }
    featureIds.add(feature.id);
  }

  const functionIds = new Set<string>();
  for (const func of DEFAULT_FUNCTIONS) {
    if (functionIds.has(func.id)) {
      issues.push({
        type: 'error',
        category: 'id-mismatch',
        message: `Duplicate function ID: '${func.id}'`,
        details: { id: func.id }
      });
    }
    functionIds.add(func.id);
  }

  // 4. Check for orphaned features (features without functions and not system features)
  const systemFeatureIds = new Set(['health-check', 'api-gateway']);
  for (const feature of FEATURES) {
    if (!functionMap.has(feature.id) && !systemFeatureIds.has(feature.id)) {
      issues.push({
        type: 'info',
        category: 'orphaned',
        message: `Feature '${feature.id}' appears to be orphaned (no function, not a system feature)`,
        details: { featureName: feature.name }
      });
    }
  }

  // Calculate stats
  const stats = {
    totalFeatures: FEATURES.length,
    totalFunctions: DEFAULT_FUNCTIONS.length,
    errors: issues.filter(i => i.type === 'error').length,
    warnings: issues.filter(i => i.type === 'warning').length,
    info: issues.filter(i => i.type === 'info').length
  };

  return {
    valid: stats.errors === 0,
    issues,
    stats
  };
}

/**
 * Get a human-readable validation report
 */
export function getValidationReport(): string {
  const report = validateFeatureControlSystem();

  let output = '# Feature Control System Validation Report\n\n';
  output += `**Status**: ${report.valid ? '✅ VALID' : '❌ INVALID'}\n\n`;
  output += `## Statistics\n\n`;
  output += `- Total Features: ${report.stats.totalFeatures}\n`;
  output += `- Total Functions: ${report.stats.totalFunctions}\n`;
  output += `- Errors: ${report.stats.errors}\n`;
  output += `- Warnings: ${report.stats.warnings}\n`;
  output += `- Info: ${report.stats.info}\n\n`;

  if (report.issues.length === 0) {
    output += '## Issues\n\nNo issues found! System is fully consistent. 🎉\n';
  } else {
    output += '## Issues\n\n';

    const errorIssues = report.issues.filter(i => i.type === 'error');
    if (errorIssues.length > 0) {
      output += '### ❌ Errors\n\n';
      for (const issue of errorIssues) {
        output += `- **${issue.category}**: ${issue.message}\n`;
        if (issue.details) {
          output += `  \`\`\`json\n  ${JSON.stringify(issue.details, null, 2)}\n  \`\`\`\n`;
        }
      }
      output += '\n';
    }

    const warningIssues = report.issues.filter(i => i.type === 'warning');
    if (warningIssues.length > 0) {
      output += '### ⚠️ Warnings\n\n';
      for (const issue of warningIssues) {
        output += `- **${issue.category}**: ${issue.message}\n`;
        if (issue.details) {
          output += `  \`\`\`json\n  ${JSON.stringify(issue.details, null, 2)}\n  \`\`\`\n`;
        }
      }
      output += '\n';
    }

    const infoIssues = report.issues.filter(i => i.type === 'info');
    if (infoIssues.length > 0) {
      output += '### ℹ️ Info\n\n';
      for (const issue of infoIssues) {
        output += `- **${issue.category}**: ${issue.message}\n`;
      }
    }
  }

  return output;
}

/**
 * Check if a specific feature-function pair is consistent
 */
export function validateFeatureFunctionPair(featureId: string): {
  valid: boolean;
  issues: string[];
} {
  const feature = FEATURES.find(f => f.id === featureId);
  const func = DEFAULT_FUNCTIONS.find(f => f.id === featureId);

  const issues: string[] = [];

  if (!feature) {
    issues.push(`Feature '${featureId}' not found in config`);
  }

  if (!func) {
    issues.push(`Function '${featureId}' not found in registry`);
  }

  if (feature && func) {
    // Check permissions
    const featurePerms = new Set(feature.permissions);
    const funcPerms = new Set(func.permissions);
    if (![...featurePerms].every(p => funcPerms.has(p))) {
      issues.push('Permissions do not match');
    }

    // Check rate limits
    if (feature.rateLimit && func.rateLimit) {
      if (feature.rateLimit.requests !== func.rateLimit.requests) {
        issues.push('Rate limit requests do not match');
      }
      if (feature.rateLimit.window !== func.rateLimit.window) {
        issues.push('Rate limit window does not match');
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
