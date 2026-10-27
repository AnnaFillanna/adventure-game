/**
 * Adventure Game - Storage Utilities
 * Persistierung von Spielstand über localStorage
 */

import type { GameState } from '../state/types';
import { GAME_CONFIG } from '../data/config';

export interface SaveFile {
  gameState: GameState;
  timestamp: number;
  version: number;
  slot: number;
}

// ============================================================================
// SAVE MANAGEMENT
// ============================================================================

export const saveManager = {
  /**
   * Speichert den aktuellen Spielstand in localStorage
   */
  save: (gameState: GameState, slot: number = 1): boolean => {
    try {
      const saveFile: SaveFile = {
        gameState,
        timestamp: Date.now(),
        version: 1,
        slot,
      };

      const key = `${GAME_CONFIG.STORAGE_KEY}_slot_${slot}`;
      localStorage.setItem(key, JSON.stringify(saveFile));
      
      // Update last played slot
      localStorage.setItem(`${GAME_CONFIG.STORAGE_KEY}_last_slot`, String(slot));
      
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  },

  /**
   * Lädt einen Spielstand aus localStorage
   */
  load: (slot: number = 1): SaveFile | null => {
    try {
      const key = `${GAME_CONFIG.STORAGE_KEY}_slot_${slot}`;
      const data = localStorage.getItem(key);

      if (!data) {
        console.warn(`No save file found for slot ${slot}`);
        return null;
      }

      return JSON.parse(data) as SaveFile;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  },

  /**
   * Löscht einen Spielstand
   */
  delete: (slot: number = 1): boolean => {
    try {
      const key = `${GAME_CONFIG.STORAGE_KEY}_slot_${slot}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to delete game:', error);
      return false;
    }
  },

  /**
   * Gibt alle verfügbaren Spielstände zurück
   */
  getAllSaves: (): SaveFile[] => {
    try {
      const saves: SaveFile[] = [];
      for (let i = 1; i <= 5; i++) {
        const save = saveManager.load(i);
        if (save) saves.push(save);
      }
      return saves;
    } catch (error) {
      console.error('Failed to list saves:', error);
      return [];
    }
  },

  /**
   * Gibt den zuletzt gespielten Slot zurück
   */
  getLastPlayedSlot: (): number => {
    try {
      const slot = localStorage.getItem(`${GAME_CONFIG.STORAGE_KEY}_last_slot`);
      return slot ? parseInt(slot, 10) : 1;
    } catch {
      return 1;
    }
  },

  /**
   * Überprüft, ob ein Spielstand existiert
   */
  hasSave: (slot: number = 1): boolean => {
    try {
      const key = `${GAME_CONFIG.STORAGE_KEY}_slot_${slot}`;
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },

  /**
   * Löscht alle Spielstände
   */
  clearAll: (): boolean => {
    try {
      for (let i = 1; i <= 5; i++) {
        saveManager.delete(i);
      }
      localStorage.removeItem(`${GAME_CONFIG.STORAGE_KEY}_last_slot`);
      return true;
    } catch (error) {
      console.error('Failed to clear all saves:', error);
      return false;
    }
  },
};

// ============================================================================
// PREFERENCE MANAGEMENT
// ============================================================================

export const preferencesManager = {
  /**
   * Speichert Spieler-Präferenzen
   */
  setPreference: (key: string, value: unknown): void => {
    try {
      const prefKey = `${GAME_CONFIG.STORAGE_KEY}_pref_${key}`;
      localStorage.setItem(prefKey, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to set preference:', error);
    }
  },

  /**
   * Lädt eine Spieler-Präferenz
   */
  getPreference: <T>(key: string, defaultValue: T): T => {
    try {
      const prefKey = `${GAME_CONFIG.STORAGE_KEY}_pref_${key}`;
      const value = localStorage.getItem(prefKey);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (error) {
      console.error('Failed to get preference:', error);
      return defaultValue;
    }
  },

  /**
   * Löscht eine Spieler-Präferenz
   */
  deletePreference: (key: string): void => {
    try {
      const prefKey = `${GAME_CONFIG.STORAGE_KEY}_pref_${key}`;
      localStorage.removeItem(prefKey);
    } catch (error) {
      console.error('Failed to delete preference:', error);
    }
  },
};

// ============================================================================
// ANALYTICS (optional future use)
// ============================================================================

export interface GameEvent {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export const analyticsManager = {
  /**
   * Loggt ein Spielereignis
   */
  logEvent: (type: string, data: Record<string, unknown> = {}): void => {
    try {
      const event: GameEvent = {
        type,
        timestamp: Date.now(),
        data,
      };

      const events = analyticsManager.getEvents();
      events.push(event);

      // Keep only last 100 events to avoid storage bloat
      if (events.length > 100) {
        events.shift();
      }

      localStorage.setItem(
        `${GAME_CONFIG.STORAGE_KEY}_events`,
        JSON.stringify(events)
      );
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  },

  /**
   * Gibt alle Spielereignisse zurück
   */
  getEvents: (): GameEvent[] => {
    try {
      const events = localStorage.getItem(`${GAME_CONFIG.STORAGE_KEY}_events`);
      return events ? (JSON.parse(events) as GameEvent[]) : [];
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  },

  /**
   * Löscht alle Ereignisse
   */
  clearEvents: (): void => {
    try {
      localStorage.removeItem(`${GAME_CONFIG.STORAGE_KEY}_events`);
    } catch (error) {
      console.error('Failed to clear events:', error);
    }
  },
};
