/**
 * Adventure Game - Seeded Random Number Generator
 * Mulberry32 Algorithmus für reproducible, deterministische Zufallsgenerierung
 * 
 * Ermöglicht:
 * - Gleicher Seed erzeugt dieselbe Spielwelt
 * - Unterschiedliche Seeds erzeugen neue Varianten
 * - Vollständig deterministisch (testbar, replayed)
 */

import type { SeededRandom } from './types';

/**
 * Mulberry32 PRNG (Pseudo Random Number Generator)
 * Einfach, schnell und qualitativ ausreichend für Game World Generation
 *
 * Lizenz: Public Domain
 * Quelle: https://github.com/bryc/code/blob/master/jsbench/fast-prng
 *
 * @param seed Initial seed value
 * @returns SeededRandom instance
 */
export function createSeededRandom(seed: number): SeededRandom {
  // Ensure seed is integer
  let state = seed >>> 0;

  /**
   * Generiert nächste Zufallszahl (0-1)
   */
  function next(): number {
    // Mulberry32 mixing function
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // 2^32
  }

  /**
   * Generiert Zufallszahl im Range [0, max)
   */
  function nextInt(max: number): number {
    return Math.floor(next() * max);
  }

  /**
   * Generiert Zufallszahl im Range [min, max]
   */
  function nextInRange(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min;
  }

  return {
    seed: seed >>> 0,
    next,
    nextInt,
    nextInRange,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Erzeuge einen Seed basierend auf einem String
 * Deterministisch: Same string = Same seed
 */
export function hashStringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Validiere Seed-Wert
 */
export function isValidSeed(seed: number): boolean {
  return Number.isInteger(seed) && seed >= 0;
}

/**
 * Erzeuge einen zufälligen Seed (für neue Welten)
 * Verwendet Browser's crypto wenn verfügbar, fallback zu Date.now()
 */
export function generateRandomSeed(): number {
  try {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    return randomValues[0];
  } catch {
    // Fallback wenn crypto nicht verfügbar
    return Math.floor(Math.random() * 0xffffffff);
  }
}

/**
 * Generiere einen Seed basierend auf Player ID und World ID
 * Deterministisch: Same player + world = Same seed
 */
export function generateDeterministicSeed(playerId: string, worldId: string): number {
  return hashStringToSeed(`${playerId}:${worldId}`);
}

// ============================================================================
// RANDOM SELECTION
// ============================================================================

/**
 * Wähle ein zufälliges Element aus Array
 */
export function selectRandom<T>(array: T[], rng: SeededRandom): T {
  if (array.length === 0) {
    throw new Error('Cannot select from empty array');
  }
  const index = rng.nextInt(array.length);
  return array[index];
}

/**
 * Shuffle Array mit Fisher-Yates
 */
export function shuffleArray<T>(array: T[], rng: SeededRandom): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Wähle mehrere unterschiedliche Elemente aus Array
 */
export function selectMultipleRandom<T>(
  array: T[],
  count: number,
  rng: SeededRandom
): T[] {
  const shuffled = shuffleArray(array, rng);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Wähle Element basierend auf Wahrscheinlichkeiten
 * @param options Array of [value, probability] pairs
 * @param rng SeededRandom instance
 * @returns Selected value
 * @example
 * selectWeighted(
 *   [['common', 0.7], ['rare', 0.25], ['epic', 0.05]],
 *   rng
 * )
 */
export function selectWeighted<T>(
  options: Array<[T, number]>,
  rng: SeededRandom
): T {
  const random = rng.next();
  let cumulative = 0;

  for (const [value, probability] of options) {
    cumulative += probability;
    if (random <= cumulative) {
      return value;
    }
  }

  // Fallback to last option (in case of rounding errors)
  return options[options.length - 1][0];
}

// ============================================================================
// COORDINATE GENERATION
// ============================================================================

/**
 * Generiere zufällige 2D Koordinate in Bounds
 */
export function generateRandomPosition(
  rng: SeededRandom,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): { x: number; y: number } {
  return {
    x: rng.nextInRange(minX, maxX),
    y: rng.nextInRange(minY, maxY),
  };
}

/**
 * Berechne neue Position basierend auf Offset
 * Useful für Spawn-Radius um Demo-Location
 */
export function offsetPosition(
  baseX: number,
  baseY: number,
  maxOffsetX: number,
  maxOffsetY: number,
  rng: SeededRandom
): { x: number; y: number } {
  const offsetX = rng.nextInRange(-maxOffsetX, maxOffsetX);
  const offsetY = rng.nextInRange(-maxOffsetY, maxOffsetY);
  return {
    x: baseX + offsetX,
    y: baseY + offsetY,
  };
}

/**
 * Berechne Distanz zwischen zwei Punkten (für Duplikat-Check)
 */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
