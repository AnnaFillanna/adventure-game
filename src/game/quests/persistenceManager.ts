/**
 * Adventure Game - Persistence Manager
 * localStorage-basierte Speicherung mit Versionierung und Error Recovery
 */

import type { GameState } from '../state/types';
import type { StoryProgressionState } from './storyProgression';
import type { WorldState } from '../world/types';

// ============================================================================
// PERSISTENCE CONSTANTS
// ============================================================================

const STORAGE_VERSION = 1;
const STORAGE_KEY_PREFIX = 'adventure_game_';
const STORAGE_KEYS = {
  gameState: `${STORAGE_KEY_PREFIX}game_state_v${STORAGE_VERSION}`,
  storyState: `${STORAGE_KEY_PREFIX}story_state_v${STORAGE_VERSION}`,
  worldState: `${STORAGE_KEY_PREFIX}world_state_v${STORAGE_VERSION}`,
  encounterHistory: `${STORAGE_KEY_PREFIX}encounter_history_v${STORAGE_VERSION}`,
  lastSave: `${STORAGE_KEY_PREFIX}last_save_v${STORAGE_VERSION}`,
};

// ============================================================================
// SAVE FORMATS
// ============================================================================

export interface GameSave {
  version: number;
  timestamp: number;
  gameState: GameState;
  storyState: StoryProgressionState;
  worldState: WorldState;
  encounterHistory: Record<string, any>;
}

export interface SaveMetadata {
  version: number;
  timestamp: number;
  playerLevel: number;
  playerName: string;
  chapterNumber: number;
  playtime: number; // in seconds
}

// ============================================================================
// PERSISTENCE MANAGER
// ============================================================================

export class PersistenceManager {
  /**
   * Save complete game state to localStorage
   */
  static saveGame(
    gameState: GameState,
    storyState: StoryProgressionState,
    worldState: WorldState,
    encounterHistory: Record<string, any>
  ): boolean {
    try {
      const save: GameSave = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        gameState,
        storyState,
        worldState,
        encounterHistory,
      };

      const serialized = JSON.stringify(save);

      // Check storage size
      const estimatedSize = new Blob([serialized]).size;
      if (estimatedSize > 5 * 1024 * 1024) {
        // 5MB limit
        console.warn('Game save exceeds 5MB limit, attempting compression');
      }

      // Save all components
      localStorage.setItem(STORAGE_KEYS.gameState, JSON.stringify(gameState));
      localStorage.setItem(STORAGE_KEYS.storyState, JSON.stringify(storyState));
      localStorage.setItem(STORAGE_KEYS.worldState, JSON.stringify(worldState));
      localStorage.setItem(STORAGE_KEYS.encounterHistory, JSON.stringify(encounterHistory));
      localStorage.setItem(STORAGE_KEYS.lastSave, JSON.stringify(save));

      console.debug('Game saved successfully at', new Date(save.timestamp).toISOString());
      return true;
    } catch (err) {
      console.error('Failed to save game:', err);
      return false;
    }
  }

  /**
   * Load complete game state from localStorage
   */
  static loadGame(): GameSave | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.lastSave);
      if (!saved) {
        return null;
      }

      const save = JSON.parse(saved) as GameSave;

      // Validate version
      if (save.version !== STORAGE_VERSION) {
        console.warn(
          `Save version mismatch: expected ${STORAGE_VERSION}, got ${save.version}`
        );
        // Attempt migration if applicable
        return this.migrateGameState(save);
      }

      console.debug('Game loaded successfully from', new Date(save.timestamp).toISOString());
      return save;
    } catch (err) {
      console.error('Failed to load game:', err);
      return null;
    }
  }

  /**
   * Load individual components
   */
  static loadGameState(): GameState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.gameState);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Failed to load game state:', err);
      return null;
    }
  }

  static loadStoryState(): StoryProgressionState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.storyState);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Failed to load story state:', err);
      return null;
    }
  }

  static loadWorldState(): WorldState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.worldState);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Failed to load world state:', err);
      return null;
    }
  }

  static loadEncounterHistory(): Record<string, any> | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.encounterHistory);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Failed to load encounter history:', err);
      return null;
    }
  }

  /**
   * Clear all saved data
   */
  static clearAllSaves(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      console.debug('All saved data cleared');
    } catch (err) {
      console.error('Failed to clear saves:', err);
    }
  }

  /**
   * Get save metadata without loading full state
   */
  static getSaveMetadata(): SaveMetadata | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.lastSave);
      if (!saved) return null;

      const save = JSON.parse(saved) as GameSave;

      return {
        version: save.version,
        timestamp: save.timestamp,
        playerLevel: save.gameState.level,
        playerName: save.gameState.player.name,
        chapterNumber: 1,
        playtime: save.gameState.playTime,
      };
    } catch (err) {
      console.error('Failed to get save metadata:', err);
      return null;
    }
  }

  /**
   * Check if save exists
   */
  static hasSave(): boolean {
    return localStorage.getItem(STORAGE_KEYS.lastSave) !== null;
  }

  /**
   * Get storage usage
   */
  static getStorageUsage(): { used: number; percent: number } {
    try {
      let used = 0;
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          used += localStorage.getItem(key)?.length || 0;
        }
      }

      // Estimate total localStorage at 5MB
      const total = 5 * 1024 * 1024;
      return {
        used,
        percent: Math.round((used / total) * 100),
      };
    } catch {
      return { used: 0, percent: 0 };
    }
  }

  /**
   * Migrate game state from older version
   */
  private static migrateGameState(save: GameSave): GameSave | null {
    // Version 1 is current, no migration needed yet
    if (save.version === STORAGE_VERSION) {
      return save;
    }

    // Future migrations would go here
    console.warn(`No migration available for version ${save.version}`);
    return null;
  }

  /**
   * Validate game state integrity
   */
  static validateGameState(state: GameState): boolean {
    try {
      // Check required fields
      if (!state.player || !state.quests) {
        return false;
      }

      // Check player stats are valid
      const { stats } = state.player;
      if (!stats || stats.maxHealth <= 0 || stats.health > stats.maxHealth) {
        return false;
      }

      // Check level is non-negative
      if (state.level < 1) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Export save as JSON string (for backup/transfer)
   */
  static exportSaveAsJSON(): string | null {
    try {
      const save = this.loadGame();
      if (!save) return null;
      return JSON.stringify(save, null, 2);
    } catch (err) {
      console.error('Failed to export save:', err);
      return null;
    }
  }

  /**
   * Import save from JSON string
   */
  static importSaveFromJSON(jsonString: string): boolean {
    try {
      const save = JSON.parse(jsonString) as GameSave;

      // Validate before importing
      if (!this.validateGameState(save.gameState)) {
        console.error('Invalid game state in import');
        return false;
      }

      // Save imported data
      return this.saveGame(
        save.gameState,
        save.storyState,
        save.worldState,
        save.encounterHistory
      );
    } catch (err) {
      console.error('Failed to import save:', err);
      return false;
    }
  }

  /**
   * Auto-save (called periodically during gameplay)
   */
  static autoSave(
    gameState: GameState,
    storyState: StoryProgressionState,
    worldState: WorldState,
    encounterHistory: Record<string, any>
  ): void {
    // Don't spam errors on auto-save
    try {
      this.saveGame(gameState, storyState, worldState, encounterHistory);
    } catch (err) {
      console.debug('Auto-save failed (will retry):', err);
    }
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Format save date for display
 */
export function formatSaveDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Format playtime for display
 */
export function formatPlaytime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Format storage usage for display
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
