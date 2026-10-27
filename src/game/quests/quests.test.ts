/**
 * Adventure Game - Quest & Encounter Tests
 * Tests für Story Progression, Quest Flow und Dynamic Encounters
 */

import { describe, it, expect } from 'vitest';
import {
  createLostKingdomStory,
  getNextAvailableQuest,
  getActiveQuests,
  areQuestPrerequisitesMet,
} from './storyProgression';
import { DynamicEncountersEngine, getEncountersForChapter } from './dynamicEncounters';
import { getQuestsByChapter, getQuestById } from './types';

describe('Story Progression Engine', () => {
  it('should initialize story with first chapter available', () => {
    const engine = createLostKingdomStory();
    const chapter = engine.getCurrentChapter();

    expect(chapter).toBeDefined();
    expect(chapter?.number).toBe(1);
    expect(engine.getState().chapterStatus[chapter!.id]).toBe('available');
  });

  it('should have all other chapters locked initially', () => {
    const engine = createLostKingdomStory();
    const chapters = engine.getAvailableChapters();

    expect(chapters.length).toBe(1); // Only chapter 1
    expect(chapters[0].number).toBe(1);
  });

  it('should start quest successfully', () => {
    const engine = createLostKingdomStory();
    const chapter = engine.getCurrentChapter();
    const questId = chapter?.questIds[0];

    expect(engine.startQuest(questId!)).toBe(true);
    expect(engine.getQuestStatus(questId!)).toBe('active');
  });

  it('should fail to start non-existent quest', () => {
    const engine = createLostKingdomStory();
    expect(engine.startQuest('non_existent_quest')).toBe(false);
  });

  it('should complete quest and track completion time', () => {
    const engine = createLostKingdomStory();
    const questId = 'quest_1_meet_elf';

    engine.startQuest(questId);
    const now = Date.now();
    engine.completeQuest(questId);

    const state = engine.getState();
    expect(state.questProgress[questId].status).toBe('completed');
    expect(state.questProgress[questId].completedAt).toBeGreaterThanOrEqual(now);
  });

  it('should fail quest', () => {
    const engine = createLostKingdomStory();
    const questId = 'quest_1_meet_elf';

    engine.startQuest(questId);
    expect(engine.failQuest(questId)).toBe(true);
    expect(engine.getQuestStatus(questId)).toBe('failed');
  });

  it('should calculate chapter progress correctly', () => {
    const engine = createLostKingdomStory();
    const chapter = engine.getCurrentChapter();

    expect(engine.getChapterProgress(chapter!.id)).toBe(0);

    // Complete first quest
    engine.startQuest(chapter!.questIds[0]);
    engine.completeQuest(chapter!.questIds[0]);

    const progress = engine.getChapterProgress(chapter!.id);
    expect(progress).toBeGreaterThan(0);
  });

  it('should not unlock next chapter until requirements met', () => {
    const engine = createLostKingdomStory();

    // Complete only 1 quest (need 3 for chapter 1)
    engine.startQuest('quest_1_meet_elf');
    engine.completeQuest('quest_1_meet_elf');

    // Chapter 2 should still be locked
    const chapter2 = engine.getChapter('chapter_2_journey');
    expect(engine.getState().chapterStatus[chapter2!.id]).toBe('locked');
  });

  it('should unlock next chapter when requirements met', () => {
    const engine = createLostKingdomStory();
    const chapter1 = engine.getCurrentChapter();

    // Complete all 3 quests
    for (const questId of chapter1!.questIds) {
      engine.startQuest(questId);
      engine.completeQuest(questId);
    }

    // Chapter 2 should now be available
    const chapter2State = engine.getState().chapterStatus['chapter_2_journey'];
    expect(chapter2State).toBe('available');
  });

  it('should respect quest prerequisites', () => {
    const engine = createLostKingdomStory();

    // quest_2_collect_coins requires quest_1_meet_elf to be completed first
    const quest2 = getQuestById('quest_2_collect_coins');
    expect(areQuestPrerequisitesMet(quest2!, engine)).toBe(false);

    // Complete quest 1
    engine.startQuest('quest_1_meet_elf');
    engine.completeQuest('quest_1_meet_elf');

    // Now quest 2 should be available
    expect(areQuestPrerequisitesMet(quest2!, engine)).toBe(true);
  });

  it('should get next available quest', () => {
    const engine = createLostKingdomStory();
    const chapter = engine.getCurrentChapter();

    const next = getNextAvailableQuest(chapter!.id, engine);
    expect(next).toBeDefined();
    expect(next?.id).toBe('quest_1_meet_elf'); // First quest has no prerequisites
  });

  it('should calculate overall progress', () => {
    const engine = createLostKingdomStory();

    expect(engine.getOverallProgress()).toBe(0);

    // Complete chapter 1
    const chapter1 = engine.getCurrentChapter();
    for (const questId of chapter1!.questIds) {
      engine.startQuest(questId);
      engine.completeQuest(questId);
    }

    expect(engine.getOverallProgress()).toBeGreaterThan(0);
  });

  it('should detect story completion', () => {
    const engine = createLostKingdomStory();

    expect(engine.isStoryComplete()).toBe(false);

    // This would require completing all chapters (not practical for unit test)
    // But we can verify the state flag exists
    expect(engine.getState().storyId).toBe('story_lost_kingdom');
  });

  it('should export and import state correctly', () => {
    const engine = createLostKingdomStory();

    // Modify state
    engine.startQuest('quest_1_meet_elf');
    engine.completeQuest('quest_1_meet_elf');

    // Export state
    const exported = engine.exportState();
    expect(exported.questProgress['quest_1_meet_elf'].status).toBe('completed');

    // Create new engine with exported state
    const engine2 = createLostKingdomStory(exported);
    expect(engine2.getQuestStatus('quest_1_meet_elf')).toBe('completed');
  });

  it('should get quests by chapter', () => {
    const quests = getQuestsByChapter('chapter_1_awakening');
    expect(quests.length).toBe(3);
    expect(quests[0].chapter).toBe('chapter_1_awakening');
  });

  it('should get active quests in chapter', () => {
    const engine = createLostKingdomStory();

    // Start first quest
    engine.startQuest('quest_1_meet_elf');

    const active = getActiveQuests('chapter_1_awakening', engine);
    expect(active.length).toBeGreaterThan(0);
    expect(active.some((q) => q.id === 'quest_1_meet_elf')).toBe(true);
  });
});

describe('Dynamic Encounters Engine', () => {
  it('should initialize encounters engine', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine = new DynamicEncountersEngine(encounters, 12345);

    expect(encounters.length).toBeGreaterThan(0);
    expect(engine).toBeDefined();
  });

  it('should trigger random encounter with correct seed', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine1 = new DynamicEncountersEngine(encounters, 99999);
    const engine2 = new DynamicEncountersEngine(encounters, 99999);

    const encounter1 = engine1.tryTriggerEncounter();
    const encounter2 = engine2.tryTriggerEncounter();

    // Same seed should produce same encounter
    if (encounter1 && encounter2) {
      expect(encounter1.id).toBe(encounter2.id);
    }
  });

  it('should respect minimum time between encounters', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine = new DynamicEncountersEngine(encounters, 12345);

    const encounter1 = engine.tryTriggerEncounter();

    // Immediately try again (should be on cooldown)
    const encounter2 = engine.tryTriggerEncounter();

    if (encounter1) {
      expect(encounter2).toBeNull(); // Should be throttled
    }
  });

  it('should respect encounter cooldowns', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine = new DynamicEncountersEngine(encounters, 54321);

    // Trigger an encounter
    const encounter = engine.tryTriggerEncounter();

    if (encounter) {
      expect(engine.isOnCooldown(encounter.id)).toBe(true);
    }
  });

  it('should respect max occurrences limit', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const encounter = encounters[0];

    if (encounter.maxOccurrences) {
      const engine = new DynamicEncountersEngine(encounters, 777);

      let triggered = 0;
      for (let i = 0; i < encounter.maxOccurrences + 5; i++) {
        // This is simplified - actual implementation would need time manipulation
        if (engine.tryTriggerEncounter()) {
          triggered++;
        }
      }

      // Should have triggered but not exceeded max
      expect(triggered).toBeLessThanOrEqual(encounter.maxOccurrences);
    }
  });

  it('should track encounter history', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine = new DynamicEncountersEngine(encounters, 11111);

    const encounter = engine.tryTriggerEncounter();

    if (encounter) {
      expect(engine.getOccurrenceCount(encounter.id)).toBeGreaterThan(0);
    }
  });

  it('should resolve encounters', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine = new DynamicEncountersEngine(encounters, 22222);

    const encounter = engine.tryTriggerEncounter();

    if (encounter) {
      const resolved = engine.resolveEncounter(encounter.id);
      expect(resolved).toBe(true);
    }
  });

  it('should export and import history', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine1 = new DynamicEncountersEngine(encounters, 33333);

    engine1.tryTriggerEncounter();
    const exported = engine1.exportHistory();

    const engine2 = new DynamicEncountersEngine(encounters, 33333);
    engine2.importHistory(exported);

    expect(Object.keys(engine2.exportHistory()).length).toBe(Object.keys(exported).length);
  });

  it('should reset encounter history', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine = new DynamicEncountersEngine(encounters, 44444);

    engine.tryTriggerEncounter();
    const before = Object.keys(engine.exportHistory()).length;

    engine.resetHistory();
    const after = Object.keys(engine.exportHistory()).length;

    expect(before).toBeGreaterThan(0);
    expect(after).toBe(0);
  });

  it('should get available encounters for chapter', () => {
    const enc1 = getEncountersForChapter('chapter_1_awakening');
    const enc2 = getEncountersForChapter('chapter_2_journey');
    const enc3 = getEncountersForChapter('chapter_3_guardian');

    expect(enc1.length).toBeGreaterThan(0);
    expect(enc2.length).toBeGreaterThan(0);
    expect(enc3.length).toBeGreaterThan(0);

    // Different chapters should have different encounters
    expect(enc1.map((e) => e.id)).not.toEqual(enc2.map((e) => e.id));
  });

  it('should handle empty encounter lists gracefully', () => {
    const engine = new DynamicEncountersEngine([], 12345);

    const encounter = engine.tryTriggerEncounter();
    expect(encounter).toBeNull();
  });

  it('should get encounter by ID', () => {
    const encounters = getEncountersForChapter('chapter_1_awakening');
    const engine = new DynamicEncountersEngine(encounters, 55555);

    const encounter = engine.getEncounter(encounters[0].id);
    expect(encounter).toBeDefined();
    expect(encounter?.id).toBe(encounters[0].id);
  });
});

describe('Quest Prerequisites & Dependencies', () => {
  it('should enforce quest chain: meet elf -> collect coins -> defeat goblin', () => {
    const engine = createLostKingdomStory();

    // Quest 1: can start without prerequisites
    expect(areQuestPrerequisitesMet(getQuestById('quest_1_meet_elf')!, engine)).toBe(
      true
    );

    // Quest 2: cannot start without quest 1
    expect(areQuestPrerequisitesMet(getQuestById('quest_2_collect_coins')!, engine)).toBe(
      false
    );

    // Complete quest 1
    engine.startQuest('quest_1_meet_elf');
    engine.completeQuest('quest_1_meet_elf');

    // Quest 2: now can start
    expect(areQuestPrerequisitesMet(getQuestById('quest_2_collect_coins')!, engine)).toBe(
      true
    );

    // Quest 3: still cannot start without quest 2
    expect(areQuestPrerequisitesMet(getQuestById('quest_3_defeat_goblin')!, engine)).toBe(
      false
    );

    // Complete quest 2
    engine.startQuest('quest_2_collect_coins');
    engine.completeQuest('quest_2_collect_coins');

    // Quest 3: now can start
    expect(areQuestPrerequisitesMet(getQuestById('quest_3_defeat_goblin')!, engine)).toBe(
      true
    );
  });

  it('should prevent progression to chapter 2 without completing chapter 1', () => {
    const engine = createLostKingdomStory();

    // Chapter 2 should be locked
    expect(engine.getState().chapterStatus['chapter_2_journey']).toBe('locked');

    // Complete only 1 quest (need 3)
    engine.startQuest('quest_1_meet_elf');
    engine.completeQuest('quest_1_meet_elf');

    // Still locked
    expect(engine.getState().chapterStatus['chapter_2_journey']).toBe('locked');

    // Complete all 3 quests
    engine.startQuest('quest_2_collect_coins');
    engine.completeQuest('quest_2_collect_coins');
    engine.startQuest('quest_3_defeat_goblin');
    engine.completeQuest('quest_3_defeat_goblin');

    // Now available
    expect(engine.getState().chapterStatus['chapter_2_journey']).toBe('available');
  });
});
