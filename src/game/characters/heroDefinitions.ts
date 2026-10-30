/**
 * Adventure Game - Hero Definitions
 * Complete character data for all 4 playable heroes
 */

import type { HeroDefinition, HeroId } from './types';

// ============================================================================
// HERO DEFINITIONS
// ============================================================================

/**
 * AERAN — The Bard
 * Muskulöser, blonder Abenteurer mit magischer Holzflöte
 */
export const AERAN: HeroDefinition = {
  id: 'aeran',
  name: 'Aeran',
  class: 'bard',
  description: 'A charming bard with the power of Sound Magic',
  backstory: 'Aeran wanders the realms with his enchanted wooden flute, bringing joy and healing through music. His adventurous spirit and quick wit have made him a beloved figure in taverns across the lands.',
  personality: 'Charming, brave, humorous',
  icon: '🎵',
  color: '#FFD700', // Gold

  stats: {
    health: 85,
    maxHealth: 85,
    mana: 90,
    maxMana: 90,
    attack: 13,
    defense: 8,
    magic: 16,
    magicDefense: 10,
    speed: 12,
  },

  abilities: [
    {
      id: 'healing_melody',
      name: 'Healing Melody',
      description: 'Play a soothing melody to heal allies',
      type: 'active',
      cooldownMs: 5000,
      manaCost: 20,
      healAmount: 40,
      icon: '🎶',
    },
    {
      id: 'animal_whisper',
      name: 'Animal Whisper',
      description: 'Communicate with animals to gain information',
      type: 'active',
      cooldownMs: 8000,
      manaCost: 15,
      icon: '🦅',
    },
    {
      id: 'sound_shield',
      name: 'Sound Shield',
      description: 'Create a protective barrier of sound',
      type: 'active',
      cooldownMs: 6000,
      manaCost: 25,
      icon: '🛡️',
    },
  ],

  specialAbility: {
    id: 'magical_song',
    name: 'Magical Song',
    description: 'Perform a powerful magical song that heals allies and damages enemies',
    type: 'active',
    cooldownMs: 15000,
    manaCost: 50,
    healAmount: 60,
    damageBonus: 30,
    icon: '🎼',
  },
};

/**
 * VELAR — The Volkhv
 * Kräftiger, rothaariger junger Magier mit Runen und Elementarkräften
 */
export const VELAR: HeroDefinition = {
  id: 'velar',
  name: 'Velar',
  class: 'volkhv',
  description: 'A powerful mage wielding ancient runes and elemental magic',
  backstory: 'Velar is a young but determined mage who studies ancient runes and nature magic. His mysterious demeanor and formidable power command respect among his peers.',
  personality: 'Intelligent, determined, mysterious',
  icon: '🔥',
  color: '#FF6B6B', // Red

  stats: {
    health: 75,
    maxHealth: 75,
    mana: 110,
    maxMana: 110,
    attack: 10,
    defense: 7,
    magic: 20,
    magicDefense: 14,
    speed: 9,
  },

  abilities: [
    {
      id: 'fire_magic',
      name: 'Fire Magic',
      description: 'Unleash flames to damage enemies',
      type: 'active',
      cooldownMs: 4000,
      manaCost: 22,
      damageBonus: 35,
      icon: '🔥',
    },
    {
      id: 'protective_shield',
      name: 'Protective Shield',
      description: 'Create a protective barrier with ancient runes',
      type: 'active',
      cooldownMs: 7000,
      manaCost: 28,
      icon: '🛡️',
    },
    {
      id: 'ancient_runes',
      name: 'Ancient Runes',
      description: 'Inscribe runes that enhance magic attacks',
      type: 'active',
      cooldownMs: 6000,
      manaCost: 20,
      damageBonus: 20,
      icon: '📜',
    },
  ],

  specialAbility: {
    id: 'elemental_storm',
    name: 'Elemental Storm',
    description: 'Summon a devastating storm of elemental fury',
    type: 'active',
    cooldownMs: 16000,
    manaCost: 55,
    damageBonus: 50,
    icon: '⛈️',
  },
};

/**
 * VARG — The Wolf Shapeshifter
 * Muskulöser, dunkelhaariger Krieger der sich in einen Wolf verwandeln kann
 */
export const VARG: HeroDefinition = {
  id: 'varg',
  name: 'Varg',
  class: 'wolf_shapeshifter',
  description: 'A fierce warrior who transforms into a powerful wolf',
  backstory: 'Varg is a wild and loyal shapeshifter whose bond with nature runs deep. When danger threatens those he cares for, he transforms into a magnificent wolf to protect them.',
  personality: 'Wild, loyal, protective',
  icon: '🐺',
  color: '#4A4A4A', // Dark Gray

  stats: {
    health: 105,
    maxHealth: 105,
    mana: 60,
    maxMana: 60,
    attack: 18,
    defense: 12,
    magic: 8,
    magicDefense: 9,
    speed: 11,
  },

  abilities: [
    {
      id: 'enhanced_senses',
      name: 'Enhanced Senses',
      description: 'Sharpen senses to detect hidden enemies',
      type: 'active',
      cooldownMs: 5000,
      manaCost: 15,
      icon: '👃',
    },
    {
      id: 'powerful_attack',
      name: 'Powerful Attack',
      description: 'Execute a devastating physical attack',
      type: 'active',
      cooldownMs: 3000,
      manaCost: 12,
      damageBonus: 40,
      icon: '⚔️',
    },
    {
      id: 'animal_instinct',
      name: 'Animal Instinct',
      description: 'Trust your instincts for increased evasion',
      type: 'passive',
      cooldownMs: 0,
      manaCost: 0,
      icon: '🎯',
    },
  ],

  specialAbility: {
    id: 'wolf_transformation',
    name: 'Wolf Transformation',
    description: 'Transform into a wolf for enhanced combat abilities',
    type: 'active',
    cooldownMs: 12000,
    manaCost: 40,
    damageBonus: 25,
    icon: '🐺',
  },

  transformation: {
    type: 'wolf',
    durationMs: 10000, // 10 seconds
    cooldownMs: 8000, // 8 second cooldown after transformation ends
    transformedStats: {
      attack: 25, // +7 from base
      defense: 10, // -2 from base
      speed: 14, // +3 from base
    },
    transformedAbilities: [
      {
        id: 'wolf_bite',
        name: 'Wolf Bite',
        description: 'Deliver a ferocious bite attack',
        type: 'active',
        cooldownMs: 2000,
        manaCost: 0,
        damageBonus: 45,
        icon: '🦷',
      },
      {
        id: 'wolf_howl',
        name: 'Wolf Howl',
        description: 'Intimidate enemies with a bone-chilling howl',
        type: 'active',
        cooldownMs: 4000,
        manaCost: 0,
        icon: '🌕',
      },
    ],
  },
};

/**
 * RAVENA — The Bird Shapeshifter
 * Kräftige, rothaarige Kriegerin die sich in einen Greifvogel verwandeln kann
 */
export const RAVENA: HeroDefinition = {
  id: 'ravena',
  name: 'Ravena',
  class: 'bird_shapeshifter',
  description: 'An independent warrior who soars as a magnificent bird of prey',
  backstory: 'Ravena is a courageous and vigilant warrior whose keen eyes miss nothing. She transforms into a powerful bird of prey to scout and strike from the skies.',
  personality: 'Independent, brave, attentive',
  icon: '🦅',
  color: '#8B4513', // Brown

  stats: {
    health: 90,
    maxHealth: 90,
    mana: 75,
    maxMana: 75,
    attack: 15,
    defense: 9,
    magic: 13,
    magicDefense: 11,
    speed: 14,
  },

  abilities: [
    {
      id: 'wind_magic',
      name: 'Wind Magic',
      description: 'Channel the power of wind for swift strikes',
      type: 'active',
      cooldownMs: 4000,
      manaCost: 18,
      damageBonus: 28,
      icon: '💨',
    },
    {
      id: 'aerial_vision',
      name: 'Aerial Vision',
      description: 'Scout the area from above to find hidden items',
      type: 'active',
      cooldownMs: 7000,
      manaCost: 20,
      icon: '🔭',
    },
    {
      id: 'hidden_object_detection',
      name: 'Hidden Object Detection',
      description: 'Reveal hidden treasures and secrets',
      type: 'active',
      cooldownMs: 6000,
      manaCost: 16,
      icon: '💎',
    },
  ],

  specialAbility: {
    id: 'bird_transformation',
    name: 'Bird Transformation',
    description: 'Transform into a powerful eagle for flight and aerial combat',
    type: 'active',
    cooldownMs: 12000,
    manaCost: 38,
    damageBonus: 22,
    icon: '🦅',
  },

  transformation: {
    type: 'bird',
    durationMs: 10000, // 10 seconds
    cooldownMs: 8000, // 8 second cooldown after transformation ends
    transformedStats: {
      attack: 18, // +3 from base
      defense: 6, // -3 from base
      speed: 18, // +4 from base
      magic: 15, // +2 from base
    },
    transformedAbilities: [
      {
        id: 'eagle_strike',
        name: 'Eagle Strike',
        description: 'Dive from the sky for a devastating attack',
        type: 'active',
        cooldownMs: 2000,
        manaCost: 0,
        damageBonus: 42,
        icon: '⚡',
      },
      {
        id: 'wind_currents',
        name: 'Wind Currents',
        description: 'Ride wind currents to evade attacks',
        type: 'active',
        cooldownMs: 5000,
        manaCost: 0,
        icon: '🌪️',
      },
    ],
  },
};

/**
 * SAIRA — The Shadow Warrior
 * Athletische Heldin mit zwei kurzen Klingen
 */
export const SAIRA: HeroDefinition = {
  id: 'saira',
  name: 'Saira',
  class: 'shadow_warrior',
  description: 'An agile shadow warrior wielding twin blades with precision',
  backstory: 'Saira moves through shadows as if they were her home, using her twin blades to uncover secrets and disarm traps. Her tactical mind and swift movements make her invaluable in dangerous situations.',
  personality: 'Cunning, swift, mysterious',
  icon: '🗡️',
  color: '#4B0082', // Dark blue/purple for shadow

  stats: {
    health: 80,
    maxHealth: 80,
    mana: 60,
    maxMana: 60,
    attack: 15,
    defense: 10,
    magic: 8,
    magicDefense: 9,
    speed: 16,
  },

  abilities: [
    {
      id: 'shadow_clone',
      name: 'Shadow Clone',
      description: 'Create a shadow clone to confuse enemies and evade attacks',
      type: 'active',
      cooldownMs: 7000,
      manaCost: 18,
      icon: '👥',
    },
    {
      id: 'trap_detection',
      name: 'Trap Detection',
      description: 'Reveal hidden traps and dangers in the environment',
      type: 'active',
      cooldownMs: 6000,
      manaCost: 12,
      icon: '🔍',
    },
    {
      id: 'dual_strike',
      name: 'Dual Strike',
      description: 'Execute precise dual blade strikes against enemies',
      type: 'active',
      cooldownMs: 5000,
      manaCost: 20,
      icon: '⚔️',
    },
  ],

  specialAbility: {
    id: 'shadow_mastery',
    name: 'Shadow Mastery',
    description: 'Master the shadows to gain increased attack and evasion',
    type: 'active',
    cooldownMs: 14000,
    manaCost: 40,
    damageBonus: 35,
    icon: '🌑',
  },
};

// ============================================================================
// HERO REGISTRY
// ============================================================================

export const HEROES: Record<HeroId, HeroDefinition> = {
  aeran: AERAN,
  velar: VELAR,
  varg: VARG,
  ravena: RAVENA,
  saira: SAIRA,
};

export const ALL_HERO_IDS: HeroId[] = ['aeran', 'velar', 'varg', 'ravena', 'saira'];

export function getHeroDefinition(heroId: HeroId): HeroDefinition {
  return HEROES[heroId];
}
