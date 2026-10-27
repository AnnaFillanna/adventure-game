/**
 * Adventure Game - World Module Public API
 */

// World Types
export type {
  SeededRandom,
  WorldObject,
  WorldObjectType,
  WorldObjectStatus,
  LootItem,
  DemoLocation,
  WorldGeneratorConfig,
  GeneratedWorld,
  WorldState,
  Chapter,
  StoryLine,
  Encounter,
  EncounterType,
  EncounterRarity,
  ActiveEncounter,
  WorldTheme,
  WorldConfig,
} from './types';

// Seeded Random Generation
export {
  createSeededRandom,
  hashStringToSeed,
  generateRandomSeed,
  generateDeterministicSeed,
  isValidSeed,
  selectRandom,
  shuffleArray,
  selectMultipleRandom,
  selectWeighted,
  generateRandomPosition,
  offsetPosition,
  distance,
} from './seededRandom';

// World Generator
export {
  WorldGenerator,
  generateDefaultWorld,
  generateCustomWorld,
  getDefaultWorldGeneratorConfig,
  DEMO_LOCATIONS,
} from './worldGenerator';
