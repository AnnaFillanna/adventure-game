/**
 * Adventure Game - World Types
 * Type-Definitionen für Procedural World Generation, Seeded Random und Game Objects
 */

import type { Position, GeoPoint } from '../state/types';

// ============================================================================
// SEEDED RANDOM TYPES
// ============================================================================

/**
 * State eines Seeded Random Number Generators
 * Erlaubt reproducible random number generation
 */
export interface SeededRandom {
  seed: number;
  next: () => number; // Returns 0-1
  nextInt: (max: number) => number; // Returns 0-(max-1)
  nextInRange: (min: number, max: number) => number; // Returns min-max
}

// ============================================================================
// WORLD OBJECT TYPES
// ============================================================================

export type WorldObjectType =
  | 'npc'
  | 'enemy'
  | 'coin'
  | 'resource'
  | 'chest'
  | 'portal'
  | 'quest_point';

export type WorldObjectStatus = 'active' | 'inactive' | 'collected' | 'defeated';

/**
 * Ein Objekt in der Spielwelt
 * Kann an Demo-Koordinaten oder GPS-Positionen existieren
 */
export interface WorldObject {
  id: string;
  type: WorldObjectType;
  name: string;
  description?: string;

  // Position (entweder 2D simuliert oder GPS)
  position: Position | GeoPoint;
  isGPS: boolean; // true wenn GeoPoint, false wenn Position

  // Game Logic
  status: WorldObjectStatus;
  questAssociation?: string; // Quest ID (falls relevant)
  lootTable?: LootItem[];

  // Metadata
  createdAt: number;
  discoveredAt?: number;
  interactionRadius?: number; // meters or grid units
}

/**
 * Loot-Tabelle für Gegenstände aus Objekten/Feinden
 */
export interface LootItem {
  itemId: string;
  probability: number; // 0-1
  quantityMin: number;
  quantityMax: number;
}

// ============================================================================
// DEMO LOCATION TYPES
// ============================================================================

/**
 * Vordefinierte sichere Demo-Lokationen für Entwicklung
 * Keine zufällig generierten Koordinaten
 */
export interface DemoLocation {
  id: string;
  name: string;
  description: string;
  position: Position; // Simulierte 2D Position
  gpsPosition?: GeoPoint; // Optional für echte GPS Tests später
  type: 'safe_zone' | 'quest_hub' | 'resource_area' | 'event_zone';
}

// ============================================================================
// WORLD GENERATOR CONFIG
// ============================================================================

export interface WorldGeneratorConfig {
  seed: number;
  maxObjects: number;
  objectDensity: Record<WorldObjectType, number>; // How many of each type (0-1 ratio)
  objectRadius: number; // Spawn within radius of demo locations

  // Loot configuration
  lootTables: Record<string, LootItem[]>;

  // Spawn constraints
  minDistanceBetweenObjects: number; // grid units
  allowDuplicates: boolean;

  // World bounds
  worldSize: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

/**
 * Ergebnis der World Generation
 */
export interface GeneratedWorld {
  seed: number;
  generatedAt: number;
  objects: WorldObject[];
  totalObjectCount: number;
}

// ============================================================================
// WORLD STATE
// ============================================================================

/**
 * Runtime-State der Spielwelt
 * Speichert aktive Objekte und deren Status
 */
export interface WorldState {
  seed: number;
  generatedAt: number;

  // Aktive Objekte
  activeObjects: Record<string, WorldObject>;

  // Collection Tracking
  collectedObjectIds: Set<string>;
  defeatedEnemyIds: Set<string>;

  // Metadata
  totalObjectsGenerated: number;
  questAssociatedObjects: Record<string, string[]>; // questId -> objectIds
}

// ============================================================================
// CHAPTER/STORY TYPES
// ============================================================================

export type ChapterStatus = 'locked' | 'available' | 'active' | 'completed';

/**
 * Ein Kapitel der Geschichte
 * Ordnet Quests, Events und Story-Elemente
 */
export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  story: string; // Narrative text

  status: ChapterStatus;
  unlockedAt?: number;
  completedAt?: number;

  // Quest sequence
  questIds: string[];
  requiredCompletionCount: number; // Wie viele Quests müssen abgeschlossen sein?

  // Events specific to this chapter
  eventTypes: string[];

  // Story progression
  prerequisiteChapterId?: string;
  unlocksChapterId?: string;
}

/**
 * Story-Linie mit mehreren Kapiteln
 */
export interface StoryLine {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
}

// ============================================================================
// DYNAMIC ENCOUNTER TYPES
// ============================================================================

export type EncounterType =
  | 'goblin_encounter'
  | 'hidden_treasure'
  | 'friendly_npc'
  | 'bonus_coins'
  | 'mysterious_portal'
  | 'ambush'
  | 'blessing';

export type EncounterRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Ein dynamisches Encounter/Event das zufällig auftreten kann
 */
export interface Encounter {
  id: string;
  type: EncounterType;
  title: string;
  description: string;
  rarity: EncounterRarity;

  // Spawn rules
  triggerCondition?: string; // z.B. "after_collect_3_coins"
  probability: number; // 0-1
  cooldownMs: number; // Mindestabstand zum nächsten Encounter
  maxOccurrences?: number; // Max times per game session

  // Reward
  reward?: {
    xp?: number;
    items?: Array<{ itemId: string; quantity: number }>;
    gold?: number;
  };

  // Narrative
  dialogue?: string;
}

/**
 * Aktives Encounter mit Tracking
 */
export interface ActiveEncounter extends Encounter {
  triggeredAt: number;
  resolvedAt?: number;
  occurrenceCount: number;
}

// ============================================================================
// WORLD CONFIG FOR FUTURE EXPANSIONS
// ============================================================================

export type WorldTheme =
  | 'elf_fantasy'
  | 'zombie_outbreak'
  | 'pirates'
  | 'detective';

/**
 * Konfiguration für verschiedene Spielwelten (später expandierbar)
 */
export interface WorldConfig {
  id: string;
  theme: WorldTheme;
  name: string;
  description: string;

  // Visual/Narrative
  colors: {
    primary: string;
    accent: string;
    background: string;
  };

  // Story
  storyLine: StoryLine;

  // Generator config
  generatorConfig: WorldGeneratorConfig;

  // Encounters available in this world
  encounters: Encounter[];

  // NPC types available
  npcTypes: string[];

  // Available
  enabled: boolean;
}
