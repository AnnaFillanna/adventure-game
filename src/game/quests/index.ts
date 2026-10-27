/**
 * Adventure Game - Quest Module Public API
 */

// Quest Types & Data
export type {
  ExtendedQuest,
  QuestType,
  QuestDifficulty,
  QuestSummary,
  Chapter,
  StoryLine,
} from './types';

export {
  STORY_THE_LOST_KINGDOM,
  QUESTS_CHAPTER_1,
  QUESTS_CHAPTER_2,
  QUESTS_CHAPTER_3,
  ALL_STORY_QUESTS,
  getQuestById,
  getQuestsByChapter,
} from './types';

// Story Progression Engine
export {
  createLostKingdomStory,
  getNextAvailableQuest,
  getActiveQuests,
  areQuestPrerequisitesMet,
  StoryProgressionEngine,
  type StoryProgressionState,
} from './storyProgression';

// Dynamic Encounters
export {
  DynamicEncountersEngine,
  getEncountersForChapter,
  getRarityColor,
  getRarityLabel,
  ENCOUNTERS_CHAPTER_1,
  ENCOUNTERS_CHAPTER_2,
  ENCOUNTERS_CHAPTER_3,
  type EncounterHistory,
} from './dynamicEncounters';

export type { Encounter, EncounterType, EncounterRarity, ActiveEncounter } from '../world/types';

// Persistence
export {
  PersistenceManager,
  formatSaveDate,
  formatPlaytime,
  formatStorageSize,
  type GameSave,
  type SaveMetadata,
} from './persistenceManager';

// World State Manager (integrates everything)
export {
  WorldStateManager,
  initializeWorldManager,
  loadWorldManager,
  getWorldManager,
  setWorldManager,
  type WorldManagerState,
} from './worldStateManager';
