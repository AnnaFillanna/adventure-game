import { beforeEach, expect, it } from 'vitest';
import { useGameStore } from './gameStore';
import type { Quest } from './types';
const quest: Quest = {
  id: 'test-reward', title: 'Test', description: '', status: 'not_started',
  objectives: [{ id: 'collect', type: 'collect', target: 'coin', description: '', required: 1, progress: 0, completed: false }],
  rewards: { xp: 10, items: [{ itemId: 'reward', quantity: 2 }], gold: 0 },
  npcGiver: 'npc', createdAt: 0,
};
beforeEach(() => useGameStore.getState().resetGame());
it('grants quest XP and items exactly once, including after save/load', () => {
  const store = useGameStore;
  store.getState().startQuest(quest);
  store.getState().completeQuest(quest.id);
  expect(store.getState().totalXP).toBe(0);
  store.getState().updateQuestObjective(quest.id, 'collect', 1);
  expect(store.getState().quests[0].status).toBe('active');
  const oldItems = store.getState().player.inventory.items;
  store.getState().completeQuest(quest.id);
  expect(oldItems.reward).toBeUndefined();
  const saved = store.getState().saveGame();
  store.getState().resetGame();
  store.getState().loadGame(saved);
  store.getState().completeQuest(quest.id);
  store.getState().startQuest(quest);
  store.getState().updateQuestObjective(quest.id, 'collect', 0);
  expect(store.getState().totalXP).toBe(10);
  expect(store.getState().player.inventory.items.reward.quantity).toBe(2);
  expect(store.getState().quests).toHaveLength(1);
  expect(store.getState().quests[0].status).toBe('completed');
});
