/**
 * Adventure Game - Character System Types
 * Complete character selection, abilities, and transformation system
 */

// ============================================================================
// CHARACTER TYPES
// ============================================================================

export type HeroId = 'aeran' | 'velar' | 'varg' | 'ravena';
export type HeroClass = 'bard' | 'volkhv' | 'wolf_shapeshifter' | 'bird_shapeshifter';
export type TransformationType = 'none' | 'wolf' | 'bird';

export interface HeroAbility {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive';
  cooldownMs: number;
  manaCost: number;
  damageBonus?: number;
  healAmount?: number;
  icon: string;
}

export interface TransformationState {
  type: TransformationType;
  isActive: boolean;
  activatedAt: number; // timestamp
  durationMs: number;
  cooldownMs: number;
  lastCooldownEnd: number; // timestamp when cooldown expires
}

export interface HeroDefinition {
  id: HeroId;
  name: string;
  class: HeroClass;
  description: string;
  backstory: string;
  personality: string;
  
  // Visual Assets
  icon: string; // emoji or image identifier
  color: string; // primary theme color
  
  // Base Statistics
  stats: {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    attack: number;
    defense: number;
    magic: number;
    magicDefense: number;
    speed: number;
  };
  
  // Abilities
  abilities: HeroAbility[];
  specialAbility: HeroAbility; // unique ultimate ability
  
  // Transformation (if applicable)
  transformation?: {
    type: TransformationType;
    durationMs: number;
    cooldownMs: number;
    transformedStats: {
      attack: number;
      defense: number;
      speed: number;
      magic?: number;
    };
    transformedAbilities: HeroAbility[];
  };
}

export interface CharacterSelectionState {
  selectedHeroId: HeroId | null;
  hasSelectedHero: boolean;
  selectedAt: number; // timestamp
}

export interface HeroGameState {
  heroId: HeroId;
  transformationState: TransformationState;
  abilityLastUsed: Record<string, number>; // abilityId -> timestamp
  discoveredAbilities: string[]; // ability IDs
}
