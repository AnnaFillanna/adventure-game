/**
 * Adventure Game - World State Manager
 * Koordiniert World Generation, Quest Progression, und Dynamic Encounters
 * Integriert sich mit dem bestehenden GameStore
 */

import type { WorldState, WorldObject } from '../world/types';
import {
  generateDefaultWorld,
  generateDeterministicSeed,
} from '../world/index';

import type { StoryProgressionState } from './storyProgression';
import { createLostKingdomStory, StoryProgressionEngine } from './storyProgression';

import { DynamicEncountersEngine, getEncountersForChapter } from './dynamicEncounters';

import type { GameState } from '../state/types';
import { PersistenceManager } from './persistenceManager';

// ============================================================================
// WORLD STATE MANAGER
// ============================================================================

export interface WorldManagerState {
  // World Objects
  worldState: WorldState;
  worldObjects: Map<string, WorldObject>;

  // Story Progression
  storyEngine: StoryProgressionEngine;
  storyState: StoryProgressionState;

  // Dynamic Encounters
  encountersEngine: DynamicEncountersEngine | null;
  lastEncounter: string | null;
  lastEncounterTime: number;

  // Tracking
  worldSeed: number;
  initialized: boolean;
}

export class WorldStateManager {
  private state: WorldManagerState;

  /**
   * Initialize with new world (fresh game)
   */
  static create(playerName: string, worldId: string = 'main'): WorldStateManager {
    const worldSeed = generateDeterministicSeed(playerName, worldId);

    // Generate world
    const world = generateDefaultWorld(worldSeed);
    const worldState: WorldState = {
      seed: worldSeed,
      generatedAt: Date.now(),
      activeObjects: {},
      collectedObjectIds: new Set(),
      defeatedEnemyIds: new Set(),
      totalObjectsGenerated: world.objects.length,
      questAssociatedObjects: {},
    };

    // Populate active objects
    const worldObjects = new Map<string, WorldObject>();
    for (const obj of world.objects) {
      worldObjects.set(obj.id, obj);
      worldState.activeObjects[obj.id] = obj;
    }

    // Create story engine
    const storyEngine = createLostKingdomStory();

    // Create encounters engine for first chapter
    const currentChapter = storyEngine.getCurrentChapter();
    const encounters = currentChapter
      ? getEncountersForChapter(currentChapter.id)
      : [];
    const encountersEngine = new DynamicEncountersEngine(encounters, worldSeed);

    return new WorldStateManager({
      worldState,
      worldObjects,
      storyEngine,
      storyState: storyEngine.getState(),
      encountersEngine,
      lastEncounter: null,
      lastEncounterTime: 0,
      worldSeed,
      initialized: true,
    });
  }

  /**
   * Load world from saved state
   */
  static load(): WorldStateManager | null {
    const save = PersistenceManager.loadGame();
    if (!save) return null;

    const { worldState, storyState, encounterHistory } = save;
    const worldSeed = worldState.seed;

    // Restore story engine
    const storyEngine = createLostKingdomStory(storyState);

    // Restore encounters engine
    const currentChapter = storyEngine.getCurrentChapter();
    const encounters = currentChapter
      ? getEncountersForChapter(currentChapter.id)
      : [];
    const encountersEngine = new DynamicEncountersEngine(encounters, worldSeed);
    if (encounterHistory) {
      encountersEngine.importHistory(encounterHistory);
    }

    // Restore world objects
    const worldObjects = new Map<string, WorldObject>();
    for (const [id, obj] of Object.entries(worldState.activeObjects || {})) {
      worldObjects.set(id, obj);
    }

    return new WorldStateManager({
      worldState: worldState as WorldState,
      worldObjects,
      storyEngine,
      storyState,
      encountersEngine,
      lastEncounter: null,
      lastEncounterTime: 0,
      worldSeed,
      initialized: true,
    });
  }

  /**
   * Constructor
   */
  private constructor(state: WorldManagerState) {
    this.state = state;
  }

  // ========================================================================
  // WORLD OBJECT MANAGEMENT
  // ========================================================================

  /**
   * Get all active world objects
   */
  getActiveObjects(): WorldObject[] {
    return Array.from(this.state.worldObjects.values()).filter((o) => o.status === 'active');
  }

  /**
   * Get object by ID
   */
  getObject(objectId: string): WorldObject | undefined {
    return this.state.worldObjects.get(objectId);
  }

  /**
   * Collect object (item, coin, etc.)
   */
  collectObject(objectId: string): WorldObject | null {
    const obj = this.state.worldObjects.get(objectId);
    if (!obj) return null;

    obj.status = 'collected';
    obj.discoveredAt = Date.now();
    this.state.worldState.collectedObjectIds.add(objectId);
    this.state.worldState.activeObjects[objectId] = obj;

    return obj;
  }

  /**
   * Defeat enemy
   */
  defeatEnemy(enemyId: string): WorldObject | null {
    const obj = this.state.worldObjects.get(enemyId);
    if (!obj || obj.type !== 'enemy') return null;

    obj.status = 'defeated';
    obj.discoveredAt = Date.now();
    this.state.worldState.defeatedEnemyIds.add(enemyId);
    this.state.worldState.activeObjects[enemyId] = obj;

    return obj;
  }

  /**
   * Get objects of specific type
   */
  getObjectsByType(type: string): WorldObject[] {
    return Array.from(this.state.worldObjects.values()).filter(
      (o) => o.type === type && o.status === 'active'
    );
  }

  // ========================================================================
  // STORY PROGRESSION MANAGEMENT
  // ========================================================================

  /**
   * Get current chapter
   */
  getCurrentChapter() {
    return this.state.storyEngine.getCurrentChapter();
  }

  /**
   * Get current chapter quests
   */
  getCurrentChapterQuests() {
    return this.state.storyEngine.getCurrentChapterQuests();
  }

  /**
   * Start quest
   */
  startQuest(questId: string): boolean {
    return this.state.storyEngine.startQuest(questId);
  }

  /**
   * Complete quest
   */
  completeQuest(questId: string): boolean {
    const success = this.state.storyEngine.completeQuest(questId);
    
    // Update story state
    if (success) {
      this.state.storyState = this.state.storyEngine.getState();
      
      // Update encounters engine if chapter changed
      this.updateEncountersForChapter();
    }
    
    return success;
  }

  /**
   * Get story progress (0-100)
   */
  getStoryProgress(): number {
    return this.state.storyEngine.getOverallProgress();
  }

  /**
   * Is story complete?
   */
  isStoryComplete(): boolean {
    return this.state.storyEngine.isStoryComplete();
  }

  // ========================================================================
  // DYNAMIC ENCOUNTERS MANAGEMENT
  // ========================================================================

  /**
   * Try to trigger random encounter
   */
  tryTriggerEncounter() {
    if (!this.state.encountersEngine) return null;
    return this.state.encountersEngine.tryTriggerEncounter();
  }

  /**
   * Resolve active encounter
   */
  resolveEncounter(encounterId: string): boolean {
    if (!this.state.encountersEngine) return false;
    return this.state.encountersEngine.resolveEncounter(encounterId);
  }

  /**
   * Get last triggered encounter
   */
  getLastEncounter() {
    if (!this.state.lastEncounter) return null;
    return this.state.encountersEngine?.getEncounter(this.state.lastEncounter);
  }

  // ========================================================================
  // STATE PERSISTENCE
  // ========================================================================

  /**
   * Save complete world state
   * Should be called by GameStore when saving
   */
  save(gameState: GameState): boolean {
    const encounterHistory = this.state.encountersEngine
      ? this.state.encountersEngine.exportHistory()
      : {};

    return PersistenceManager.saveGame(
      gameState,
      this.state.storyState,
      this.state.worldState,
      encounterHistory
    );
  }

  /**
   * Auto-save (called periodically)
   */
  autoSave(gameState: GameState): void {
    const encounterHistory = this.state.encountersEngine
      ? this.state.encountersEngine.exportHistory()
      : {};

    PersistenceManager.autoSave(
      gameState,
      this.state.storyState,
      this.state.worldState,
      encounterHistory
    );
  }

  /**
   * Export state for debugging
   */
  exportState() {
    return {
      worldSeed: this.state.worldSeed,
      storyState: this.state.storyState,
      objectCount: this.state.worldObjects.size,
      collectedCount: this.state.worldState.collectedObjectIds.size,
      defeatedCount: this.state.worldState.defeatedEnemyIds.size,
    };
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  /**
   * Update encounters engine when chapter changes
   */
  private updateEncountersForChapter(): void {
    const currentChapter = this.state.storyEngine.getCurrentChapter();
    if (!currentChapter) return;

    const encounters = getEncountersForChapter(currentChapter.id);
    this.state.encountersEngine = new DynamicEncountersEngine(
      encounters,
      this.state.worldSeed
    );
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let worldManager: WorldStateManager | null = null;

export function initializeWorldManager(playerName: string): WorldStateManager {
  worldManager = WorldStateManager.create(playerName);
  return worldManager;
}

export function loadWorldManager(): WorldStateManager | null {
  worldManager = WorldStateManager.load();
  return worldManager;
}

export function getWorldManager(): WorldStateManager | null {
  return worldManager;
}

export function setWorldManager(manager: WorldStateManager | null): void {
  worldManager = manager;
}
