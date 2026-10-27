/**
 * Adventure Game - Data & Configuration
 * Zentrale Datendefinitionen für NPCs, Gegner, Items, Quests und Konfiguration
 */

import type { NPC, Enemy, Item, Quest } from '../state/types';

// ============================================================================
// ITEMS DATABASE
// ============================================================================

export const ITEMS: Record<string, Item> = {
  gold_coin: {
    id: 'gold_coin',
    name: 'Gold Coin',
    type: 'coin',
    quantity: 0,
    description: 'A shiny gold coin',
    icon: '🪙',
    value: 1,
  },
  potion_health: {
    id: 'potion_health',
    name: 'Health Potion',
    type: 'potion',
    quantity: 0,
    description: 'Restores 30 HP',
    icon: '🧪',
    healAmount: 30,
  },
};

// ============================================================================
// CHARACTERS DATABASE
// ============================================================================

export const NPCS: Record<string, NPC> = {
  elder_elf: {
    id: 'elder_elf',
    name: 'Elder Elara',
    type: 'quest_giver',
    dialogue: 'Greetings, traveler! The forest is in grave danger. Could you help us?',
    position: { x: 60, y: 50 },
    quest: 'quest_collect_coins',
  },
};

export const ENEMIES: Record<string, Enemy> = {
  goblin_scout: {
    id: 'goblin_scout',
    name: 'Goblin Scout',
    level: 2,
    stats: {
      health: 30,
      maxHealth: 30,
      mana: 10,
      maxMana: 10,
      attack: 10,
      defense: 5,
      magic: 2,
      magicDefense: 3,
      speed: 12,
    },
    lootTable: [
      { itemId: 'gold_coin', probability: 0.8, quantity: 5 },
      { itemId: 'potion_health', probability: 0.3, quantity: 1 },
    ],
    xpReward: 50,
    position: { x: 70, y: 40 },
  },
};

// ============================================================================
// QUESTS DATABASE
// ============================================================================

export const QUESTS: Record<string, Quest> = {
  quest_collect_coins: {
    id: 'quest_collect_coins',
    title: 'The Lost Treasure',
    description: 'Elder Elara needs your help! Collect 5 gold coins to aid the village.',
    status: 'not_started',
    objectives: [
      {
        id: 'obj_collect_coins',
        type: 'collect',
        target: 'gold_coin',
        description: 'Collect 5 gold coins',
        progress: 0,
        required: 5,
        completed: false,
      },
    ],
    rewards: {
      xp: 100,
      items: [{ itemId: 'potion_health', quantity: 1 }],
      gold: 10,
    },
    npcGiver: 'elder_elf',
    npcCompletion: 'elder_elf',
    createdAt: Date.now(),
  },
  quest_defeat_goblin: {
    id: 'quest_defeat_goblin',
    title: 'Defeat the Goblin',
    description: 'A goblin has been terrorizing the forest. Defeat it to save the village!',
    status: 'not_started',
    objectives: [
      {
        id: 'obj_defeat_goblin',
        type: 'defeat',
        target: 'goblin_scout',
        description: 'Defeat the Goblin Scout',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],
    rewards: {
      xp: 200,
      items: [{ itemId: 'gold_coin', quantity: 20 }],
      gold: 50,
    },
    npcGiver: 'elder_elf',
    npcCompletion: 'elder_elf',
    prerequisiteQuest: 'quest_collect_coins',
    createdAt: Date.now(),
  },
};

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

export const GAME_CONFIG = {
  // World
  WORLD_WIDTH: 100,
  WORLD_HEIGHT: 100,
  TILE_SIZE: 16,
  
  // Player
  PLAYER_SPEED: 2,
  PLAYER_SPAWN_X: 50,
  PLAYER_SPAWN_Y: 50,
  
  // Combat
  COMBAT_LOG_MAX_ENTRIES: 20,
  COMBAT_ROUND_DURATION: 2000, // ms
  
  // Leveling
  BASE_XP_PER_LEVEL: 100,
  
  // Storage
  STORAGE_KEY: 'adventure_game_save',
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  
  // UI
  HUD_PADDING: 16,
  BUTTON_SIZE: 48,
} as const;

// ============================================================================
// COLOR PALETTE (Dark Forest Fantasy Theme)
// ============================================================================

export const COLORS = {
  // Primary Colors
  forestGreen: '#1a472a',
  darkForestGreen: '#0d2819',
  lightForestGreen: '#2d5a3d',
  
  // Accent Colors
  goldAccent: '#d4af37',
  lightGold: '#f0e68c',
  
  // Neutral
  darkText: '#1a1a1a',
  lightText: '#f5f5f5',
  grey: '#888888',
  
  // Combat
  healthRed: '#d63031',
  healthGreen: '#27ae60',
  manaBlue: '#3498db',
  
  // UI
  uiBackground: 'rgba(13, 40, 25, 0.95)',
  uiBorder: '#d4af37',
  uiHover: '#2d5a3d',
} as const;

// ============================================================================
// GAME BALANCE CONSTANTS
// ============================================================================

export const BALANCE = {
  // Combat Modifiers
  DAMAGE_VARIANCE: 0.2, // ±20% damage variance
  CRITICAL_CHANCE: 0.1, // 10% critical hit chance
  CRITICAL_MULTIPLIER: 1.5,
  
  // Leveling
  XP_MULTIPLIER: 1.0,
  LEVEL_UP_STAT_INCREASE: {
    maxHealth: 10,
    maxMana: 5,
    attack: 3,
    defense: 2,
    magic: 2,
    magicDefense: 1,
  },
  
  // Loot
  LOOT_VARIANCE: 0.3, // ±30% loot variance
  
  // Economics
  BASE_COIN_VALUE: 1,
} as const;
