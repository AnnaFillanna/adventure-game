/**
 * Adventure Game - World State Integration Manager
 * Synchronizes WorldStateManager (Phase 3) with GameStore (Phase 1-2 UI)
 * Bridge between backend game systems and React UI
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '../state/gameStore';
import type { WorldStateManager } from '../quests/worldStateManager';

// ============================================================================
// WORLD STATE SYNC MANAGER
// ============================================================================

/**
 * Singleton manager that syncs WorldStateManager → GameStore
 * Runs periodically to update UI with procedurally generated world state
 */
export class WorldStateSyncManager {
  private static instance: WorldStateSyncManager | null = null;
  private worldManager: WorldStateManager | null = null;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private readonly syncIntervalMs = 500; // Update game store every 500ms

  private constructor() {}

  /**
   * Get or create singleton instance
   */
  static getInstance(): WorldStateSyncManager {
    if (!WorldStateSyncManager.instance) {
      WorldStateSyncManager.instance = new WorldStateSyncManager();
    }
    return WorldStateSyncManager.instance;
  }

  /**
   * Initialize with WorldStateManager
   * Creates sync loop that runs every syncIntervalMs
   */
  initialize(worldManager: WorldStateManager): void {
    if (this.worldManager) return;

    this.worldManager = worldManager;
    this.startSyncLoop();
  }

  /**
   * Start periodic sync loop
   */
  private startSyncLoop(): void {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      this.syncToGameStore();
    }, this.syncIntervalMs);
  }

  /**
   * Stop sync loop
   */
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Sync WorldStateManager state to GameStore (one-way pull)
   */
  private syncToGameStore(): void {
    if (!this.worldManager) return;

    const worldState = this.worldManager.getActiveObjects();

    // Process world objects for UI updates
    for (const obj of worldState) {
      if (obj.type === 'coin' || obj.type === 'resource') {
        // Track collectible items
        useGameStore.getState().addItem({
          id: obj.id,
          name: obj.name || 'Item',
          type: 'coin',
          quantity: 1,
          description: obj.description || 'A collected item',
          icon: '📦',
        });
      }
    }
  }

  /**
   * Execute action on world (player collects item, defeats enemy, etc)
   */
  executeWorldAction(actionType: string, objectId: string): void {
    if (!this.worldManager) return;

    const objects = this.worldManager.getActiveObjects();
    const obj = objects.find((o) => o.id === objectId);
    if (!obj) return;

    switch (actionType) {
      case 'collect':
        useGameStore.getState().addItem({
          id: objectId,
          name: obj.name || 'Unknown Item',
          type: 'quest_item',
          quantity: 1,
          description: 'Collected from the world',
          icon: '📦',
        });
        break;

      case 'defeat':
        useGameStore.getState().addXP(50);
        break;

      case 'interact':
        // NPC interaction - handled by dialogue system
        break;
    }
  }

  /**
   * Get story progress info
   */
  getStoryProgress(): number {
    if (!this.worldManager) {
      return 0;
    }

    return this.worldManager.getStoryProgress();
  }
}

// ============================================================================
// REACT HOOK
// ============================================================================

/**
 * Hook to use WorldStateSyncManager in React components
 * Initializes sync on mount, cleans up on unmount
 */
export function useWorldStateSyncManager(
  worldManager: WorldStateManager | null
): WorldStateSyncManager {
  const syncManagerRef = useRef(WorldStateSyncManager.getInstance());

  useEffect(() => {
    if (!worldManager) return;

    syncManagerRef.current.initialize(worldManager);

    return () => {
      syncManagerRef.current.stop();
    };
  }, [worldManager]);

  return syncManagerRef.current;
}
