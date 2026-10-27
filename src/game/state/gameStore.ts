/**
 * Adventure Game - Zustand Store
 * Zentrales State Management für das gesamte Spiel
 */

import { create } from 'zustand';
import type {
  GameState,
  Quest,
  CombatState,
  Item,
  Enemy,
  CharacterStats,
  QuestStatus,
} from './types';

// ============================================================================
// INITIAL STATE FACTORY
// ============================================================================

export const createInitialGameState = (): GameState => ({
  player: {
    id: 'player_1',
    name: 'Adventurer',
    class: 'warrior',
    level: 1,
    experience: 0,
    stats: {
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      attack: 15,
      defense: 10,
      magic: 5,
      magicDefense: 8,
      speed: 10,
    },
    inventory: {
      items: {},
      maxSlots: 20,
    },
    position: { x: 50, y: 50 },
    direction: 'idle',
  },
  quests: [],
  activeQuestId: null,
  npcLocations: {},
  enemyLocations: {},
  combatState: null,
  level: 1,
  totalXP: 0,
  playTime: 0,
  soundEnabled: true,
  musicEnabled: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  version: 1,
});

// ============================================================================
// ZUSTAND STORE
// ============================================================================

interface GameStore extends GameState {
  // Inventory Management
  addItem: (item: Item) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  hasItem: (itemId: string, quantity?: number) => boolean;
  
  // Quest Management
  startQuest: (quest: Quest) => void;
  completeQuest: (questId: string) => void;
  updateQuestObjective: (questId: string, objectiveId: string, progress: number) => void;
  getActiveQuest: () => Quest | undefined;
  
  // Player Movement & Combat
  movePlayer: (x: number, y: number) => void;
  initiatesCombat: (enemy: Enemy) => void;
  executeCombatAction: (action: string, targetId?: string) => void;
  endCombat: () => void;
  
  // Stats & Leveling
  addXP: (amount: number) => void;
  levelUp: () => void;
  
  // Persistence
  saveGame: () => string;
  loadGame: (saveData: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialGameState(),

  // ========================================================================
  // INVENTORY MANAGEMENT
  // ========================================================================

  addItem: (item: Item) => {
    set((state) => {
      const inventory = { ...state.player.inventory };
      const existingItem = inventory.items[item.id];

      if (existingItem) {
        inventory.items[item.id] = {
          ...existingItem,
          quantity: existingItem.quantity + (item.quantity || 1),
        };
      } else {
        inventory.items[item.id] = item;
      }

      return {
        player: {
          ...state.player,
          inventory,
        },
        updatedAt: Date.now(),
      };
    });
  },

  removeItem: (itemId: string, quantity = 1) => {
    set((state) => {
      const inventory = { ...state.player.inventory };
      const item = inventory.items[itemId];

      if (!item) return { updatedAt: Date.now() };

      if (item.quantity <= quantity) {
        delete inventory.items[itemId];
      } else {
        inventory.items[itemId] = {
          ...item,
          quantity: item.quantity - quantity,
        };
      }

      return {
        player: {
          ...state.player,
          inventory,
        },
        updatedAt: Date.now(),
      };
    });
  },

  hasItem: (itemId: string, quantity = 1) => {
    const state = get();
    const item = state.player.inventory.items[itemId];
    return item ? item.quantity >= quantity : false;
  },

  // ========================================================================
  // QUEST MANAGEMENT
  // ========================================================================

  startQuest: (quest: Quest) => {
    set((state) => {
      const updatedQuest = { ...quest, status: 'active' as QuestStatus };
      return {
        quests: [...state.quests, updatedQuest],
        activeQuestId: quest.id,
        updatedAt: Date.now(),
      };
    });
  },

  completeQuest: (questId: string) => {
    set((state) => {
      const updatedQuests = state.quests.map((q) =>
        q.id === questId ? { ...q, status: 'completed' as QuestStatus, completedAt: Date.now() } : q
      );

      const completedQuest = updatedQuests.find((q) => q.id === questId);
      let newState: Partial<GameStore> = {
        quests: updatedQuests,
        updatedAt: Date.now(),
      };

      // Award XP and items
      if (completedQuest) {
        const { xp, items } = completedQuest.rewards;
        newState.totalXP = state.totalXP + xp;
        newState.player = {
          ...state.player,
          experience: state.player.experience + xp,
        };

        // Add reward items to inventory
        items.forEach(({ itemId, quantity }) => {
          get().addItem({
            id: itemId,
            name: '',
            type: 'quest_item',
            quantity,
            description: '',
            icon: '',
          });
        });
      }

      return newState;
    });
  },

  updateQuestObjective: (questId: string, objectiveId: string, progress: number) => {
    set((state) => {
      const updatedQuests = state.quests.map((quest) => {
        if (quest.id === questId) {
          const updatedObjectives = quest.objectives.map((obj) =>
            obj.id === objectiveId
              ? {
                  ...obj,
                  progress: Math.min(progress, obj.required),
                  completed: Math.min(progress, obj.required) >= obj.required,
                }
              : obj
          );

          // Check if all objectives are completed
          const allCompleted = updatedObjectives.every((obj) => obj.completed);

          return {
            ...quest,
            objectives: updatedObjectives,
            status: allCompleted ? ('completed' as QuestStatus) : quest.status,
          };
        }
        return quest;
      });

      return {
        quests: updatedQuests,
        updatedAt: Date.now(),
      };
    });
  },

  getActiveQuest: () => {
    const state = get();
    return state.quests.find((q) => q.id === state.activeQuestId && q.status === 'active');
  },

  // ========================================================================
  // PLAYER MOVEMENT
  // ========================================================================

  movePlayer: (x: number, y: number) => {
    set((state) => ({
      player: {
        ...state.player,
        position: { x, y },
      },
      updatedAt: Date.now(),
    }));
  },

  // ========================================================================
  // COMBAT
  // ========================================================================

  initiatesCombat: (enemy: Enemy) => {
    set((state) => ({
      combatState: {
        isActive: true,
        playerCharacter: state.player,
        enemy,
        currentRound: 1,
        combatLog: [`Combat started against ${enemy.name}!`],
        playerTurn: true,
      },
    }));
  },

  executeCombatAction: (action: string, _targetId?: string) => {
    set((state) => {
      if (!state.combatState || !state.combatState.isActive) return state;

      const { playerCharacter, enemy } = state.combatState;
      let damage = 0;
      let message = '';

      switch (action) {
        case 'attack':
          damage = Math.max(1, playerCharacter.stats.attack + Math.floor(Math.random() * 10) - 5);
          message = `${playerCharacter.name} attacks for ${damage} damage!`;
          break;
        case 'defend':
          message = `${playerCharacter.name} takes a defensive stance!`;
          break;
        case 'magic':
          if (playerCharacter.stats.mana >= 20) {
            damage = Math.max(1, playerCharacter.stats.magic + Math.floor(Math.random() * 15));
            playerCharacter.stats.mana -= 20;
            message = `${playerCharacter.name} casts a spell for ${damage} damage!`;
          } else {
            message = `Not enough mana!`;
          }
          break;
        case 'potion':
          if (get().hasItem('potion_health')) {
            const healed = 30;
            playerCharacter.stats.health = Math.min(
              playerCharacter.stats.maxHealth,
              playerCharacter.stats.health + healed
            );
            get().removeItem('potion_health', 1);
            message = `${playerCharacter.name} used a potion and restored ${healed} HP!`;
          } else {
            message = `No potions available!`;
          }
          break;
        default:
          break;
      }

      const newCombatState: CombatState = {
        ...state.combatState,
        combatLog: [...state.combatState.combatLog, message],
        playerTurn: false,
      };

      // Enemy counter-attack
      if (damage > 0 && enemy) {
        enemy.stats.health -= damage;
        if (enemy.stats.health <= 0) {
          newCombatState.combatLog.push(`${enemy.name} has been defeated!`);
          newCombatState.reward = {
            xp: enemy.xpReward,
            loot: [],
            gold: 50,
          };
        } else {
          const enemyDamage = Math.max(1, enemy.stats.attack + Math.floor(Math.random() * 10) - 5);
          playerCharacter.stats.health -= enemyDamage;
          newCombatState.combatLog.push(`${enemy.name} attacks for ${enemyDamage} damage!`);

          if (playerCharacter.stats.health <= 0) {
            newCombatState.combatLog.push('You have been defeated!');
            newCombatState.isActive = false;
          }
        }
      }

      return {
        player: playerCharacter,
        combatState: newCombatState,
        updatedAt: Date.now(),
      };
    });
  },

  endCombat: () => {
    set((state) => {
      if (state.combatState?.reward) {
        get().addXP(state.combatState.reward.xp);
      }
      return {
        combatState: null,
        updatedAt: Date.now(),
      };
    });
  },

  // ========================================================================
  // STATS & LEVELING
  // ========================================================================

  addXP: (amount: number) => {
    set((state) => {
      const newXP = state.player.experience + amount;
      const newTotalXP = state.totalXP + amount;
      const xpPerLevel = 100 * state.player.level;

      if (newXP >= xpPerLevel) {
        get().levelUp();
      }

      return {
        player: {
          ...state.player,
          experience: newXP % xpPerLevel,
        },
        totalXP: newTotalXP,
        updatedAt: Date.now(),
      };
    });
  },

  levelUp: () => {
    set((state) => {
      const newStats: CharacterStats = {
        ...state.player.stats,
        maxHealth: state.player.stats.maxHealth + 10,
        health: state.player.stats.maxHealth + 10,
        maxMana: state.player.stats.maxMana + 5,
        mana: state.player.stats.maxMana + 5,
        attack: state.player.stats.attack + 3,
        defense: state.player.stats.defense + 2,
        magic: state.player.stats.magic + 2,
      };

      return {
        player: {
          ...state.player,
          level: state.player.level + 1,
          stats: newStats,
          experience: 0,
        },
        level: state.level + 1,
        updatedAt: Date.now(),
      };
    });
  },

  // ========================================================================
  // PERSISTENCE
  // ========================================================================

  saveGame: () => {
    const state = get();
    const saveData = {
      gameState: state,
      timestamp: Date.now(),
      version: 1,
    };
    return JSON.stringify(saveData);
  },

  loadGame: (saveData: string) => {
    try {
      const { gameState } = JSON.parse(saveData);
      set(gameState);
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  },

  resetGame: () => {
    set(createInitialGameState());
  },
}));
