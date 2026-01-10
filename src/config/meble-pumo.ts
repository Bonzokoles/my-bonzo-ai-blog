/**
 * Meble Pumo API Configuration
 * Integration with Meble Pumo furniture catalog API
 */

export const MEBLE_PUMO_CONFIG = {
  apiKey: import.meta.env.MEBLE_PUMO_API_KEY || '',
  baseUrl: 'https://api.meblepumo.pl', // Zaktualizuj jeśli znasz prawdziwy URL
  enabled: !!import.meta.env.MEBLE_PUMO_API_KEY,
} as const;

/**
 * Validate Meble Pumo configuration
 */
export function validateMeblePumoConfig(): boolean {
  if (!MEBLE_PUMO_CONFIG.apiKey) {
    console.warn('⚠️  MEBLE_PUMO_API_KEY not configured');
    return false;
  }
  return true;
}
