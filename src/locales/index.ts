/**
 * Adventure Game - Localization API
 * Type-safe, automatic key inference from de.ts
 * Supports parameter substitution and graceful fallbacks
 */

import { de } from './de';

/**
 * Extract all valid text keys from the German language object
 * This is done at compile-time to ensure type safety
 */
export type TextKey = {
  [K in keyof typeof de]: K extends string ? `${K}.${ExtractKeys<(typeof de)[K]>}` : never;
}[keyof typeof de];

type ExtractKeys<T, Prefix extends string = ''> = T extends string
  ? Prefix
  : T extends object
    ? {
        [K in keyof T]: T[K] extends string
          ? Prefix extends ''
            ? K extends string
              ? K
              : never
            : `${Prefix}.${K & string}`
          : T[K] extends object
            ? ExtractKeys<T[K], Prefix extends '' ? (K extends string ? K : '') : `${Prefix}.${K & string}`>
            : never;
      }[keyof T]
    : never;

/**
 * Get German text by dot-notation key path with strict compile-time type safety
 * Only valid TextKey literals are accepted - invalid keys cause TypeScript error (TS2345)
 * 
 * @example
 * getText('common.continue') → "Weiter"        ✅ Valid key
 * getText('invalidKey')      → TypeScript Error ❌ TS2345 at compile-time
 * 
 * For dynamic/runtime keys (e.g., from getAllTextKeys()), use getTextDynamic()
 * 
 * @param keyPath - Dot-notation path (MUST be a valid TextKey)
 * @param params - Optional parameters for substitution ({key}: value)
 * @returns The localized text string
 */
export function getText(
  keyPath: TextKey,
  params?: Record<string, any>
): string {
  // Navigate the nested object by dot-notation
  const keys = keyPath.split('.');
  let value: any = de;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback: log warning and return key name for debugging
      const missingPath = keys.slice(0, i + 1).join('.');
      console.warn(
        `[Localization] Missing text key: "${keyPath}" (missing at: "${missingPath}")`
      );
      return `[${keyPath}]`;
    }
  }

  // Validate that the final value is a string
  if (typeof value !== 'string') {
    console.warn(
      `[Localization] Text key is not a string: "${keyPath}" (type: ${typeof value})`
    );
    return `[${keyPath}]`;
  }

  // Apply parameter substitution if provided
  if (params && Object.keys(params).length > 0) {
    let result = value;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      // Replace {paramKey} with the parameter value
      const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
      result = result.replace(regex, String(paramValue));
    }
    return result;
  }

  return value;
}

/**
 * Get text with a dynamic/runtime string key (not compile-time verified)
 * Use this for keys that come from getAllTextKeys() or other runtime sources
 * 
 * @example
 * const keys = getAllTextKeys();
 * for (const key of keys) {
 *   const text = getTextDynamic(key);  // Safe for runtime strings
 * }
 * 
 * @param keyPath - Runtime string key (type: string, not TextKey)
 * @param params - Optional parameters for substitution
 * @returns The localized text string, or "[keyPath]" if not found
 */
export function getTextDynamic(
  keyPath: string,
  params?: Record<string, any>
): string {
  // Simply delegate to getText's internal implementation
  // by casting, since we've verified this is a valid runtime key
  return getText(keyPath as TextKey, params);
}

/**
 * Get all available text keys (for debugging or validation)
 * Returns a Set of all valid key paths
 */
export function getAllTextKeys(): Set<string> {
  const keys = new Set<string>();

  function extractKeys(obj: any, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        keys.add(fullKey);
      } else if (typeof value === 'object' && value !== null) {
        extractKeys(value, fullKey);
      }
    }
  }

  extractKeys(de);
  return keys;
}

/**
 * Validate that a key exists in the localization
 * @param keyPath - The key to check
 * @returns true if the key exists and points to a string value
 */
export function hasTextKey(keyPath: string): boolean {
  const keys = keyPath.split('.');
  let value: any = de;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return false;
    }
  }

  return typeof value === 'string';
}

/**
 * Get text with an optional fallback (runtime key resolution)
 * Use this when you need fallback behavior for potentially missing keys
 * 
 * @param keyPath - Runtime string key
 * @param fallback - Optional fallback text if key is missing
 * @param params - Optional parameters for substitution
 * @returns The text, fallback, or "[key]" if neither exists
 */
export function getTextWithFallback(
  keyPath: string,
  fallback?: string,
  params?: Record<string, any>
): string {
  if (!hasTextKey(keyPath)) {
    if (fallback) {
      return fallback;
    }
    return `[${keyPath}]`;
  }
  return getTextDynamic(keyPath, params);
}

// Export the raw German object for advanced use
export { de };
