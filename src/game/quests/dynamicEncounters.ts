/**
 * Adventure Game - Dynamic Encounters Engine
 * Zufällige Events mit Cooldowns, Wahrscheinlichkeiten und reproduzierbarem Verhalten
 */

import type {
  Encounter,
  EncounterRarity,
  SeededRandom as ISeededRandom,
} from '../world/types';
import {
  createSeededRandom,
  selectWeighted,
} from '../world/seededRandom';

// ============================================================================
// ENCOUNTER DEFINITIONS
// ============================================================================

export const ENCOUNTERS_CHAPTER_1: Encounter[] = [
  {
    id: 'encounter_friendly_npc',
    type: 'friendly_npc',
    title: 'Friendly Wanderer',
    description: 'Du triffst einen freundlichen Wanderer, der dir hilfreiche Tipps gibt',
    rarity: 'common',
    triggerCondition: 'after_collect_2_coins',
    probability: 0.3,
    cooldownMs: 30000, // 30 seconds
    maxOccurrences: 3,
    reward: {
      xp: 50,
      gold: 25,
    },
    dialogue: 'Grüße, Abenteurer! Ich sehe, du machst gute Fortschritte.',
  },

  {
    id: 'encounter_bonus_coins',
    type: 'bonus_coins',
    title: 'Lucky Find',
    description: 'Du findest einige versteckte Goldmünzen',
    rarity: 'uncommon',
    probability: 0.25,
    cooldownMs: 20000,
    maxOccurrences: 5,
    reward: {
      gold: 50,
    },
  },

  {
    id: 'encounter_hidden_treasure',
    type: 'hidden_treasure',
    title: 'Small Treasure Chest',
    description: 'Du entdeckst eine kleine Schatztruhe',
    rarity: 'uncommon',
    probability: 0.15,
    cooldownMs: 45000,
    maxOccurrences: 2,
    reward: {
      xp: 100,
      items: [{ itemId: 'silver_key', quantity: 1 }],
      gold: 100,
    },
  },

  {
    id: 'encounter_mysterious_portal',
    type: 'mysterious_portal',
    title: 'Mysterious Portal',
    description: 'Ein geheimnisvolles Portal öffnet sich vor dir',
    rarity: 'rare',
    probability: 0.1,
    cooldownMs: 60000,
    maxOccurrences: 1,
    reward: {
      xp: 200,
      items: [{ itemId: 'portal_stone', quantity: 1 }],
    },
  },
];

export const ENCOUNTERS_CHAPTER_2: Encounter[] = [
  {
    id: 'encounter_ambush',
    type: 'ambush',
    title: 'Surprise Ambush',
    description: 'Gegner greifen dich unerwartet an!',
    rarity: 'uncommon',
    probability: 0.2,
    cooldownMs: 30000,
    maxOccurrences: 4,
    reward: {
      xp: 150,
      gold: 75,
    },
  },

  {
    id: 'encounter_blessing',
    type: 'blessing',
    title: 'Divine Blessing',
    description: 'Du erhältst einen segensreichen Segen von oben',
    rarity: 'rare',
    probability: 0.15,
    cooldownMs: 50000,
    maxOccurrences: 2,
    reward: {
      xp: 300,
      items: [{ itemId: 'blessing_rune', quantity: 1 }],
    },
  },

  {
    id: 'encounter_hidden_treasure_2',
    type: 'hidden_treasure',
    title: 'Ancient Artifact',
    description: 'Du entdeckst ein altes Artefakt',
    rarity: 'epic',
    probability: 0.1,
    cooldownMs: 90000,
    maxOccurrences: 1,
    reward: {
      xp: 500,
      items: [{ itemId: 'ancient_artifact', quantity: 1 }],
      gold: 300,
    },
  },
];

export const ENCOUNTERS_CHAPTER_3: Encounter[] = [
  {
    id: 'encounter_epic_blessing',
    type: 'blessing',
    title: 'Legendary Blessing',
    description: 'Das Königreich segnet dich mit Macht',
    rarity: 'legendary',
    probability: 0.3,
    cooldownMs: 40000,
    maxOccurrences: 5,
    reward: {
      xp: 500,
      items: [{ itemId: 'crown_piece', quantity: 1 }],
      gold: 500,
    },
  },
];

// ============================================================================
// ENCOUNTER ENGINE
// ============================================================================

export interface EncounterHistory {
  encounterId: string;
  triggeredAt: number;
  resolvedAt?: number;
  occurrenceCount: number;
}

export class DynamicEncountersEngine {
  private encounters: Encounter[];
  private history: Map<string, EncounterHistory> = new Map();
  private lastEncounterTime: number = 0;
  private rng: ISeededRandom;
  private minTimeBetweenEncounters = 5000; // 5 seconds min

  constructor(encounters: Encounter[], seed: number) {
    this.encounters = encounters;
    this.rng = createSeededRandom(seed);
  }

  /**
   * Try to trigger a random encounter
   * Returns the encounter if triggered, null otherwise
   */
  tryTriggerEncounter(): Encounter | null {
    const now = Date.now();

    // Cooldown check: minimum time between encounters
    if (now - this.lastEncounterTime < this.minTimeBetweenEncounters) {
      return null;
    }

    // Build weighted list of available encounters
    const available: Array<[Encounter, number]> = [];

    for (const encounter of this.encounters) {
      // Check if encounter has hit max occurrences
      const history = this.history.get(encounter.id);
      if (encounter.maxOccurrences && history && history.occurrenceCount >= encounter.maxOccurrences) {
        continue;
      }

      // Check cooldown
      if (history) {
        const timeSinceLastTrigger = now - history.triggeredAt;
        if (timeSinceLastTrigger < encounter.cooldownMs) {
          continue;
        }
      }

      // Add to weighted list
      available.push([encounter, encounter.probability]);
    }

    if (available.length === 0) {
      return null;
    }

    // Select random encounter
    const selected = selectWeighted(available, this.rng);

    // Record history
    const history = this.history.get(selected.id) || {
      encounterId: selected.id,
      triggeredAt: now,
      occurrenceCount: 0,
    };

    history.triggeredAt = now;
    history.occurrenceCount += 1;
    this.history.set(selected.id, history);

    this.lastEncounterTime = now;

    return selected;
  }

  /**
   * Resolve an active encounter
   */
  resolveEncounter(encounterId: string): boolean {
    const history = this.history.get(encounterId);
    if (!history) return false;

    history.resolvedAt = Date.now();
    return true;
  }

  /**
   * Get encounter by ID
   */
  getEncounter(encounterId: string): Encounter | undefined {
    return this.encounters.find((e) => e.id === encounterId);
  }

  /**
   * Get occurrence count for encounter
   */
  getOccurrenceCount(encounterId: string): number {
    return this.history.get(encounterId)?.occurrenceCount || 0;
  }

  /**
   * Check if encounter is on cooldown
   */
  isOnCooldown(encounterId: string): boolean {
    const encounter = this.getEncounter(encounterId);
    if (!encounter) return false;

    const history = this.history.get(encounterId);
    if (!history) return false;

    const elapsed = Date.now() - history.triggeredAt;
    return elapsed < encounter.cooldownMs;
  }

  /**
   * Get all active encounters (triggered but not resolved)
   */
  getActiveEncounters(): EncounterHistory[] {
    return Array.from(this.history.values()).filter((h) => !h.resolvedAt);
  }

  /**
   * Reset all encounter history
   */
  resetHistory(): void {
    this.history.clear();
    this.lastEncounterTime = 0;
  }

  /**
   * Export history for persistence
   */
  exportHistory(): Record<string, EncounterHistory> {
    const result: Record<string, EncounterHistory> = {};
    this.history.forEach((value, key) => {
      result[key] = { ...value };
    });
    return result;
  }

  /**
   * Import history from persistence
   */
  importHistory(data: Record<string, EncounterHistory>): void {
    this.history.clear();
    for (const [key, value] of Object.entries(data)) {
      this.history.set(key, { ...value });
    }
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get all encounters for a chapter
 */
export function getEncountersForChapter(chapterId: string): Encounter[] {
  switch (chapterId) {
    case 'chapter_1_awakening':
      return ENCOUNTERS_CHAPTER_1;
    case 'chapter_2_journey':
      return ENCOUNTERS_CHAPTER_2;
    case 'chapter_3_guardian':
      return ENCOUNTERS_CHAPTER_3;
    default:
      return [];
  }
}

/**
 * Get rarity color for UI
 */
export function getRarityColor(rarity: EncounterRarity): string {
  switch (rarity) {
    case 'common':
      return '#888888'; // Gray
    case 'uncommon':
      return '#4CAF50'; // Green
    case 'rare':
      return '#2196F3'; // Blue
    case 'epic':
      return '#9C27B0'; // Purple
    case 'legendary':
      return '#FFC107'; // Gold
    default:
      return '#FFFFFF';
  }
}

/**
 * Get rarity label for UI
 */
export function getRarityLabel(rarity: EncounterRarity): string {
  switch (rarity) {
    case 'common':
      return 'Common';
    case 'uncommon':
      return 'Uncommon';
    case 'rare':
      return 'Rare';
    case 'epic':
      return 'Epic';
    case 'legendary':
      return 'Legendary';
    default:
      return 'Unknown';
  }
}
