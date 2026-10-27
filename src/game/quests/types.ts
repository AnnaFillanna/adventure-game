/**
 * Adventure Game - Quest Types
 * Extended Quest-Definitionen für dynamische Quest-Engine
 */

import type { Quest } from '../state/types';

// ============================================================================
// EXTENDED QUEST TYPES
// ============================================================================

export type QuestType =
  | 'collect_items'
  | 'talk_to_npc'
  | 'defeat_enemy'
  | 'reach_location'
  | 'find_hidden_object'
  | 'story_milestone';

export type QuestDifficulty = 'easy' | 'normal' | 'hard' | 'legendary';

/**
 * Erweiterte Quest mit Story-Kontext
 */
export interface ExtendedQuest extends Quest {
  type: QuestType;
  difficulty: QuestDifficulty;
  questGiver: string; // NPC ID who gives the quest
  questCompletion?: string; // NPC ID to complete quest with

  // Story context
  chapter?: string; // Chapter ID this quest belongs to
  storyContext?: string; // Narrative why player is doing this

  // Quest progression
  canAbandon: boolean;
  canRetry: boolean;
  timeLimit?: number; // milliseconds, if any

  // Failure handling
  failedAt?: number;
  failureCount: number;
  maxAttempts?: number;
}

/**
 * Quest-Überblick für UI
 */
export interface QuestSummary {
  questId: string;
  title: string;
  type: QuestType;
  progress: number; // 0-100
  status: string;
  objectives: Array<{
    description: string;
    progress: number;
    required: number;
  }>;
}

// ============================================================================
// CHAPTER & STORY TYPES (Re-exported for convenience)
// ============================================================================

export type ChapterStatus = 'locked' | 'available' | 'active' | 'completed';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  story: string;

  status: ChapterStatus;
  unlockedAt?: number;
  completedAt?: number;

  questIds: string[];
  requiredCompletionCount: number;

  eventTypes: string[];
  prerequisiteChapterId?: string;
  unlocksChapterId?: string;

  rewards?: {
    xp: number;
    unlocks?: string[];
  };
}

export interface StoryLine {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
}

// ============================================================================
// STORY DATA: "THE LOST KINGDOM" - ELF FANTASY
// ============================================================================

/**
 * Story progression für "The Lost Kingdom" Fantasy-Welt
 */
export const STORY_THE_LOST_KINGDOM: StoryLine = {
  id: 'story_lost_kingdom',
  name: 'The Lost Kingdom',
  description: 'Die Geschichte eines verlorenen Königreichs und seiner Hoffnung',
  chapters: [
    {
      id: 'chapter_1_awakening',
      number: 1,
      title: 'Kapitel 1: The Awakening',
      description: 'Der Anfang einer großen Abenteuerreise',
      story: `Du wachst in einem mystischen Wald auf. Ein ehrwürdiger Elf nähert sich dir und erzählt von einem 
              verlorenen Königreich, das von einer dämonischen Kraft heimgesucht wird. Der Elf braucht deine Hilfe.`,

      status: 'available',
      questIds: [
        'quest_1_meet_elf',
        'quest_2_collect_coins',
        'quest_3_defeat_goblin',
      ],
      requiredCompletionCount: 3,

      eventTypes: ['friendly_npc', 'bonus_coins'],
      unlocksChapterId: 'chapter_2_journey',

      rewards: {
        xp: 250,
        unlocks: ['chapter_2_journey'],
      },
    },
    {
      id: 'chapter_2_journey',
      number: 2,
      title: 'Kapitel 2: The Journey',
      description: 'Dein Weg führt dich tiefer in die Wildnis',
      story: `Mit den neuen Fähigkeiten ausgestattet, erkundest du tiefer gelegene Gebiete. 
              Ein geheimnisvoller Wald verbirgt alte Ruinen und mächtige Gegner.`,

      status: 'locked',
      questIds: [
        'quest_4_explore_ruins',
        'quest_5_find_ancient_scroll',
        'quest_6_defeat_dark_knight',
      ],
      requiredCompletionCount: 2,

      eventTypes: ['hidden_treasure', 'mysterious_portal', 'ambush'],
      prerequisiteChapterId: 'chapter_1_awakening',
      unlocksChapterId: 'chapter_3_guardian',

      rewards: {
        xp: 500,
        unlocks: ['chapter_3_guardian'],
      },
    },
    {
      id: 'chapter_3_guardian',
      number: 3,
      title: 'Kapitel 3: The Forest Guardian',
      description: 'Die finale Konfrontation',
      story: `Du stehst vor dem Forest Guardian, dem Schutzgeist des Königreichs. 
              Gemeinsam könnt ihr die dämonische Kraft bannen und das Königreich retten.`,

      status: 'locked',
      questIds: [
        'quest_7_meet_guardian',
        'quest_8_final_battle',
        'quest_9_restore_kingdom',
      ],
      requiredCompletionCount: 3,

      eventTypes: ['blessing', 'epic_reward'],
      prerequisiteChapterId: 'chapter_2_journey',

      rewards: {
        xp: 1000,
        unlocks: [],
      },
    },
  ],
};

// ============================================================================
// QUEST DEFINITIONS: CHAPTER 1
// ============================================================================

export const QUESTS_CHAPTER_1: ExtendedQuest[] = [
  {
    id: 'quest_1_meet_elf',
    title: 'Meet the Wise Elf',
    description: 'Sprich mit dem weisen Elf und erfahre mehr über das verlorene Königreich',
    type: 'talk_to_npc',
    difficulty: 'easy',
    questGiver: 'npc_elf_elder',
    status: 'not_started',
    chapter: 'chapter_1_awakening',
    storyContext: 'Ein ehrwürdiger Elf hat deine Aufmerksamkeit erregt. Er scheint dir etwas Wichtiges mitteilen zu wollen.',

    objectives: [
      {
        id: 'obj_talk_elf',
        type: 'talk_to',
        target: 'npc_elf_elder',
        description: 'Talk to the Elf Elder',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],

    rewards: {
      xp: 100,
      items: [{ itemId: 'quest_map', quantity: 1 }],
      gold: 50,
    },

    npcGiver: 'npc_elf_elder',
    canAbandon: false,
    canRetry: true,
    failureCount: 0,
    createdAt: Date.now(),
  },

  {
    id: 'quest_2_collect_coins',
    title: 'Gather Gold Coins',
    description: 'Sammle fünf Goldmünzen für den Elf',
    type: 'collect_items',
    difficulty: 'normal',
    questGiver: 'npc_elf_elder',
    status: 'not_started',
    chapter: 'chapter_1_awakening',
    storyContext: 'Der Elf braucht Ressourcen um dich auszurüsten. Goldmünzen sind überall in der Welt verteilt.',

    objectives: [
      {
        id: 'obj_collect_coins',
        type: 'collect',
        target: 'coin',
        description: 'Collect 5 Gold Coins',
        progress: 0,
        required: 5,
        completed: false,
      },
    ],

    rewards: {
      xp: 150,
      items: [
        { itemId: 'basic_sword', quantity: 1 },
        { itemId: 'healing_potion', quantity: 2 },
      ],
      gold: 100,
    },

    npcGiver: 'npc_elf_elder',
    prerequisiteQuest: 'quest_1_meet_elf',
    canAbandon: true,
    canRetry: true,
    failureCount: 0,
    createdAt: Date.now(),
  },

  {
    id: 'quest_3_defeat_goblin',
    title: 'Defeat the Goblin',
    description: 'Besiege einen gemeinen Goblin, der die Gegend unsicher macht',
    type: 'defeat_enemy',
    difficulty: 'normal',
    questGiver: 'npc_elf_elder',
    status: 'not_started',
    chapter: 'chapter_1_awakening',
    storyContext: 'Ein aggressiver Goblin ist seit kurzem in der Nähe. Der Elf bittet dich, ihn zu besiegen.',

    objectives: [
      {
        id: 'obj_defeat_goblin',
        type: 'defeat',
        target: 'enemy_goblin_captain',
        description: 'Defeat the Goblin Captain',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],

    rewards: {
      xp: 200,
      items: [
        { itemId: 'leather_armor', quantity: 1 },
        { itemId: 'goblin_ring', quantity: 1 },
      ],
      gold: 150,
    },

    npcGiver: 'npc_elf_elder',
    prerequisiteQuest: 'quest_2_collect_coins',
    canAbandon: false,
    canRetry: true,
    failureCount: 0,
    createdAt: Date.now(),
  },
];

// ============================================================================
// QUEST DEFINITIONS: CHAPTER 2
// ============================================================================

export const QUESTS_CHAPTER_2: ExtendedQuest[] = [
  {
    id: 'quest_4_explore_ruins',
    title: 'Explore the Ancient Ruins',
    description: 'Erkunde die alten Ruinen und sammle Erkenntnisse über das verlorene Königreich',
    type: 'reach_location',
    difficulty: 'hard',
    questGiver: 'npc_elf_elder',
    status: 'not_started',
    chapter: 'chapter_2_journey',

    objectives: [
      {
        id: 'obj_explore_ruins',
        type: 'explore',
        target: 'location_ancient_ruins',
        description: 'Visit the Ancient Ruins',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],

    rewards: {
      xp: 300,
      items: [{ itemId: 'ancient_key', quantity: 1 }],
      gold: 200,
    },

    npcGiver: 'npc_elf_elder',
    prerequisiteQuest: 'quest_3_defeat_goblin',
    canAbandon: true,
    canRetry: true,
    failureCount: 0,
    createdAt: Date.now(),
  },

  {
    id: 'quest_5_find_ancient_scroll',
    title: 'Find the Ancient Scroll',
    description: 'Finde eine geheimnisvolle alte Schriftrolle in den Ruinen',
    type: 'find_hidden_object',
    difficulty: 'hard',
    questGiver: 'npc_elf_elder',
    status: 'not_started',
    chapter: 'chapter_2_journey',

    objectives: [
      {
        id: 'obj_find_scroll',
        type: 'collect',
        target: 'ancient_scroll',
        description: 'Find the Ancient Scroll',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],

    rewards: {
      xp: 350,
      items: [{ itemId: 'spell_book', quantity: 1 }],
      gold: 250,
    },

    npcGiver: 'npc_elf_elder',
    prerequisiteQuest: 'quest_4_explore_ruins',
    canAbandon: false,
    canRetry: true,
    failureCount: 0,
    createdAt: Date.now(),
  },

  {
    id: 'quest_6_defeat_dark_knight',
    title: 'Defeat the Dark Knight',
    description: 'Bekämpfe den düsteren Ritter, der die Ruinen bewacht',
    type: 'defeat_enemy',
    difficulty: 'legendary',
    questGiver: 'npc_elf_elder',
    status: 'not_started',
    chapter: 'chapter_2_journey',

    objectives: [
      {
        id: 'obj_defeat_knight',
        type: 'defeat',
        target: 'enemy_dark_knight',
        description: 'Defeat the Dark Knight',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],

    rewards: {
      xp: 500,
      items: [
        { itemId: 'dark_sword', quantity: 1 },
        { itemId: 'shield_of_light', quantity: 1 },
      ],
      gold: 500,
    },

    npcGiver: 'npc_elf_elder',
    prerequisiteQuest: 'quest_5_find_ancient_scroll',
    canAbandon: false,
    canRetry: true,
    failureCount: 0,
    createdAt: Date.now(),
  },
];

// ============================================================================
// QUEST DEFINITIONS: CHAPTER 3
// ============================================================================

export const QUESTS_CHAPTER_3: ExtendedQuest[] = [
  {
    id: 'quest_7_meet_guardian',
    title: 'Meet the Forest Guardian',
    description: 'Treffe den Forest Guardian und höre seine Geschichte',
    type: 'talk_to_npc',
    difficulty: 'hard',
    questGiver: 'npc_elf_elder',
    status: 'not_started',
    chapter: 'chapter_3_guardian',

    objectives: [
      {
        id: 'obj_meet_guardian',
        type: 'talk_to',
        target: 'npc_forest_guardian',
        description: 'Talk to the Forest Guardian',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],

    rewards: {
      xp: 400,
      items: [{ itemId: 'guardian_blessing', quantity: 1 }],
      gold: 300,
    },

    npcGiver: 'npc_elf_elder',
    prerequisiteQuest: 'quest_6_defeat_dark_knight',
    canAbandon: false,
    canRetry: true,
    failureCount: 0,
    createdAt: Date.now(),
  },

  {
    id: 'quest_8_final_battle',
    title: 'The Final Battle',
    description: 'Kämpfe gegen die dämonische Kraft im letzten Kampf',
    type: 'defeat_enemy',
    difficulty: 'legendary',
    questGiver: 'npc_forest_guardian',
    status: 'not_started',
    chapter: 'chapter_3_guardian',

    objectives: [
      {
        id: 'obj_final_battle',
        type: 'defeat',
        target: 'enemy_demon_lord',
        description: 'Defeat the Demon Lord',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],

    rewards: {
      xp: 800,
      items: [
        { itemId: 'legendary_sword', quantity: 1 },
        { itemId: 'crown_of_kingdom', quantity: 1 },
      ],
      gold: 1000,
    },

    npcGiver: 'npc_forest_guardian',
    prerequisiteQuest: 'quest_7_meet_guardian',
    canAbandon: false,
    canRetry: true,
    failureCount: 0,
    createdAt: Date.now(),
  },

  {
    id: 'quest_9_restore_kingdom',
    title: 'Restore the Kingdom',
    description: 'Stellt das Königreich wieder her und erfüllt das Vermächtnis',
    type: 'story_milestone',
    difficulty: 'hard',
    questGiver: 'npc_forest_guardian',
    status: 'not_started',
    chapter: 'chapter_3_guardian',

    objectives: [
      {
        id: 'obj_restore_kingdom',
        type: 'explore',
        target: 'location_kingdom_throne',
        description: 'Restore the Kingdom',
        progress: 0,
        required: 1,
        completed: false,
      },
    ],

    rewards: {
      xp: 500,
      items: [{ itemId: 'kingdom_key', quantity: 1 }],
      gold: 500,
    },

    npcGiver: 'npc_forest_guardian',
    prerequisiteQuest: 'quest_8_final_battle',
    canAbandon: false,
    canRetry: false,
    failureCount: 0,
    createdAt: Date.now(),
  },
];

// ============================================================================
// ALL QUESTS REGISTRY
// ============================================================================

export const ALL_STORY_QUESTS = [
  ...QUESTS_CHAPTER_1,
  ...QUESTS_CHAPTER_2,
  ...QUESTS_CHAPTER_3,
];

/**
 * Finds quest by ID
 */
export function getQuestById(questId: string): ExtendedQuest | undefined {
  return ALL_STORY_QUESTS.find((q) => q.id === questId) as ExtendedQuest;
}

/**
 * Get all quests for a chapter
 */
export function getQuestsByChapter(chapterId: string): ExtendedQuest[] {
  return ALL_STORY_QUESTS.filter((q) => q.chapter === chapterId) as ExtendedQuest[];
}
