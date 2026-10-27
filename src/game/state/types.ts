/**
 * Adventure Game - TypeScript Types
 * Zentrale Typ-Definitionen für die gesamte Game Engine
 */

// ============================================================================
// GEOLOCATION TYPES (GPS & Coordinates)
// ============================================================================

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeoPoint extends LatLng {
  accuracy?: number; // GPS accuracy in meters
  altitude?: number;
  timestamp?: number;
}

export interface GeolocationState {
  enabled: boolean;
  tracking: boolean;
  currentPosition: GeoPoint | null;
  lastUpdate: number;
  error: string | null;
  accuracy: number; // Current GPS accuracy in meters
}

export interface InteractionTarget {
  id: string;
  type: 'npc' | 'enemy' | 'item' | 'quest_point';
  position: Position | GeoPoint;
  distance: number; // Meters (for GPS) or grid units (for 2D)
  inRange: boolean; // Within interaction radius
}

// ============================================================================
// ITEM & INVENTORY TYPES
// ============================================================================

export type ItemType = 'coin' | 'potion' | 'weapon' | 'armor' | 'quest_item';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  quantity: number;
  description: string;
  icon: string;
  value?: number; // for coins and resellable items
  healAmount?: number; // for potions
  attackBonus?: number; // for weapons
  defenseBonus?: number; // for armor
}

export interface Inventory {
  items: Record<string, Item>;
  maxSlots: number;
}

// ============================================================================
// CHARACTER & NPC TYPES
// ============================================================================

export interface CharacterStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  magic: number;
  magicDefense: number;
  speed: number;
}

export type CharacterClass = 'warrior' | 'mage' | 'rogue' | 'paladin';

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  stats: CharacterStats;
  inventory: Inventory;
  position: Position; // Current position in game world
  direction: Direction;
}

export interface NPC {
  id: string;
  name: string;
  type: 'ally' | 'merchant' | 'quest_giver';
  dialogue: string;
  position: Position;
  quest?: string; // Quest ID this NPC offers
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  stats: CharacterStats;
  lootTable: LootItem[];
  xpReward: number;
  position: Position;
}

export interface LootItem {
  itemId: string;
  probability: number; // 0-1
  quantity: number;
}

// ============================================================================
// QUEST TYPES
// ============================================================================

export type QuestStatus = 'not_started' | 'active' | 'completed' | 'failed';
export type QuestObjectiveType = 'collect' | 'defeat' | 'talk_to' | 'explore';

export interface QuestObjective {
  id: string;
  type: QuestObjectiveType;
  target: string; // Item ID, Enemy ID, NPC ID, or location
  description: string;
  progress: number;
  required: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: {
    xp: number;
    items: Array<{ itemId: string; quantity: number }>;
    gold: number;
  };
  npcGiver: string; // NPC ID
  npcCompletion?: string; // NPC ID to complete quest
  prerequisiteQuest?: string; // Quest ID that must be completed first
  createdAt: number;
  completedAt?: number;
}

// ============================================================================
// COMBAT TYPES
// ============================================================================

export type CombatAction = 'attack' | 'defend' | 'magic' | 'potion' | 'flee';

export interface CombatMove {
  action: CombatAction;
  user: string; // Character ID
  target?: string; // Target Character ID
  damage?: number;
  healed?: number;
}

export interface CombatState {
  isActive: boolean;
  playerCharacter: Character;
  enemy: Enemy | null;
  currentRound: number;
  combatLog: string[];
  playerTurn: boolean;
  reward?: {
    xp: number;
    loot: Item[];
    gold: number;
  };
}

// ============================================================================
// WORLD & POSITION TYPES
// ============================================================================

export type Direction = 'north' | 'south' | 'east' | 'west' | 'idle';

export interface Position {
  x: number;
  y: number;
}

export interface TileProperties {
  passable: boolean;
  tileType: 'grass' | 'forest' | 'water' | 'mountain' | 'settlement';
}

// ============================================================================
// GAME STATE TYPES
// ============================================================================

export interface GameState {
  // Player & Character
  player: Character;
  
  // Quests & Progress
  quests: Quest[];
  activeQuestId: string | null;
  
  // World State
  npcLocations: Record<string, NPC>;
  enemyLocations: Record<string, Enemy>;
  
  // Combat
  combatState: CombatState | null;
  
  // Game Progress
  level: number;
  totalXP: number;
  playTime: number; // in seconds
  
  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  version: number;
}

// ============================================================================
// SERIALIZATION TYPES
// ============================================================================

export interface SaveData {
  gameState: GameState;
  timestamp: number;
  version: number;
}
