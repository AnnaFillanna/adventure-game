/**
 * Tests for Outdoor Quest Engine
 */

import { describe, it, expect } from 'vitest';
import {
  createInitialOutdoorQuest,
  updateOutdoorQuestPosition,
  calculateDistance,
  checkDiscoveryProximity,
  getQuestProgress,
  FIRST_OUTDOOR_QUEST_ID,
} from './questEngine';
import type { GeoPoint } from './types';

describe('OutdoorQuestEngine', () => {
  describe('createInitialOutdoorQuest', () => {
    it('should create a new quest with idle status', () => {
      const quest = createInitialOutdoorQuest(null);
      expect(quest.status).toBe('idle');
      expect(quest.questId).toBe(FIRST_OUTDOOR_QUEST_ID);
      expect(quest.version).toBe(1);
    });

    it('should have 3 discovery targets', () => {
      const quest = createInitialOutdoorQuest(null);
      expect(quest.targets).toHaveLength(3);
      expect(quest.targets.every((t) => !t.discovered)).toBe(true);
    });

    it('should initialize with empty completions', () => {
      const quest = createInitialOutdoorQuest(null);
      expect(quest.completedTargets).toHaveLength(0);
      expect(quest.totalXpEarned).toBe(0);
      expect(quest.totalGoldEarned).toBe(0);
    });

    it('should accept initial position', () => {
      const pos: GeoPoint = {
        lat: 52.52,
        lng: 13.365,
        accuracy: 10,
        timestamp: Date.now(),
      };
      const quest = createInitialOutdoorQuest(pos);
      expect(quest.currentPosition).toEqual(pos);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // Berlin Tiergarten area
      const distance = calculateDistance(52.52, 13.365, 52.521, 13.366);
      expect(distance).toBeGreaterThan(100);
      expect(distance).toBeLessThan(200);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(52.52, 13.365, 52.52, 13.365);
      expect(distance).toBe(0);
    });

    it('should calculate roughly correct distances', () => {
      // Approximately 1111 meters difference in latitude
      const distance = calculateDistance(52.52, 13.365, 53.52, 13.365);
      expect(distance).toBeGreaterThan(100000); // > 100 km
    });
  });

  describe('checkDiscoveryProximity', () => {
    it('should detect nearby targets', () => {
      const playerPos: GeoPoint = {
        lat: 52.52,
        lng: 13.365,
        accuracy: 10,
        timestamp: Date.now(),
      };

      const quest = createInitialOutdoorQuest(null);
      const target = quest.targets[0];

      // Manually set target to a position very close to player
      const testTarget = {
        ...target,
        latitude: 52.52,
        longitude: 13.365,
        radiusMeters: 100,
        discovered: false,
      };

      expect(checkDiscoveryProximity(playerPos, testTarget)).toBe(true);
    });

    it('should not detect distant targets', () => {
      const playerPos: GeoPoint = {
        lat: 52.0,
        lng: 13.0,
        accuracy: 10,
        timestamp: Date.now(),
      };

      const quest = createInitialOutdoorQuest(null);
      const target = quest.targets[0];

      expect(checkDiscoveryProximity(playerPos, target)).toBe(false);
    });

    it('should not re-discover already discovered targets', () => {
      const playerPos: GeoPoint = {
        lat: 52.52,
        lng: 13.365,
        accuracy: 10,
        timestamp: Date.now(),
      };

      const quest = createInitialOutdoorQuest(null);
      const target = {
        ...quest.targets[0],
        discovered: true,
      };

      expect(checkDiscoveryProximity(playerPos, target)).toBe(false);
    });
  });

  describe('updateOutdoorQuestPosition', () => {
    it('should update current position', () => {
      const quest = createInitialOutdoorQuest(null);
      const newPos: GeoPoint = {
        lat: 52.52,
        lng: 13.365,
        accuracy: 10,
        timestamp: Date.now(),
      };

      const { newState } = updateOutdoorQuestPosition(quest, newPos);
      expect(newState.currentPosition).toEqual(newPos);
      expect(newState.lastLocationUpdate).toBe(newPos.timestamp);
    });

    it('should change status from idle to in_progress on first update', () => {
      const quest = createInitialOutdoorQuest(null);
      const newPos: GeoPoint = {
        lat: 52.52,
        lng: 13.365,
        accuracy: 10,
        timestamp: Date.now(),
      };

      const { newState } = updateOutdoorQuestPosition(quest, newPos);
      expect(newState.status).toBe('in_progress');
      expect(newState.startedAt).toBeDefined();
    });

    it('should detect discoveries when player is nearby', () => {
      // Start at position near first target
      const questData = createInitialOutdoorQuest(null);
      const startPos: GeoPoint = {
        lat: questData.targets[0].latitude + 0.0001,
        lng: questData.targets[0].longitude + 0.0001,
        accuracy: 10,
        timestamp: Date.now(),
      };

      const { newState, discoveries } = updateOutdoorQuestPosition(questData, startPos);

      expect(discoveries.length).toBeGreaterThan(0);
      expect(newState.completedTargets).toContain(discoveries[0].targetId);
    });

    it('should award rewards on discovery', () => {
      const questData = createInitialOutdoorQuest(null);
      const startPos: GeoPoint = {
        lat: questData.targets[0].latitude + 0.0001,
        lng: questData.targets[0].longitude + 0.0001,
        accuracy: 10,
        timestamp: Date.now(),
      };

      const { newState } = updateOutdoorQuestPosition(questData, startPos);
      const firstTarget = questData.targets[0];

      expect(newState.totalXpEarned).toBe(firstTarget.reward.xp);
      expect(newState.totalGoldEarned).toBe(firstTarget.reward.gold);
    });

    it('should mark quest complete when all targets discovered', () => {
      let quest = createInitialOutdoorQuest(null);

      // Move to each target location
      for (const target of quest.targets) {
        const pos: GeoPoint = {
          lat: target.latitude + 0.00001,
          lng: target.longitude + 0.00001,
          accuracy: 10,
          timestamp: Date.now(),
        };
        const result = updateOutdoorQuestPosition(quest, pos);
        quest = result.newState;
      }

      expect(quest.status).toBe('completed');
      expect(quest.completedAt).toBeDefined();
      expect(quest.completedTargets).toHaveLength(3);
    });

    it('should not duplicate rewards on multiple updates at same location', () => {
      const questData = createInitialOutdoorQuest(null);
      const startPos: GeoPoint = {
        lat: questData.targets[0].latitude + 0.00001,
        lng: questData.targets[0].longitude + 0.00001,
        accuracy: 10,
        timestamp: Date.now(),
      };

      let quest = questData;
      const { newState: state1 } = updateOutdoorQuestPosition(quest, startPos);
      const xpAfterFirst = state1.totalXpEarned;

      // Update again at same location
      const { newState: state2 } = updateOutdoorQuestPosition(state1, startPos);
      const xpAfterSecond = state2.totalXpEarned;

      expect(xpAfterFirst).toBe(xpAfterSecond);
    });
  });

  describe('getQuestProgress', () => {
    it('should return 0% for new quest', () => {
      const quest = createInitialOutdoorQuest(null);
      expect(getQuestProgress(quest)).toBe(0);
    });

    it('should return progress percentage', () => {
      let quest = createInitialOutdoorQuest(null);

      const pos: GeoPoint = {
        lat: quest.targets[0].latitude + 0.00001,
        lng: quest.targets[0].longitude + 0.00001,
        accuracy: 10,
        timestamp: Date.now(),
      };

      const { newState } = updateOutdoorQuestPosition(quest, pos);
      expect(getQuestProgress(newState)).toBeCloseTo(33.33, 1);
    });

    it('should return 100% when complete', () => {
      let quest = createInitialOutdoorQuest(null);

      for (const target of quest.targets) {
        const pos: GeoPoint = {
          lat: target.latitude + 0.00001,
          lng: target.longitude + 0.00001,
          accuracy: 10,
          timestamp: Date.now(),
        };
        const result = updateOutdoorQuestPosition(quest, pos);
        quest = result.newState;
      }

      expect(getQuestProgress(quest)).toBe(100);
    });
  });

  describe('Target data', () => {
    it('should have properly defined targets with all required fields', () => {
      const quest = createInitialOutdoorQuest(null);

      quest.targets.forEach((target) => {
        expect(target.id).toBeDefined();
        expect(target.name).toBeDefined();
        expect(target.description).toBeDefined();
        expect(target.latitude).toBeGreaterThan(50);
        expect(target.latitude).toBeLessThan(55);
        expect(target.longitude).toBeGreaterThan(10);
        expect(target.longitude).toBeLessThan(16);
        expect(target.radiusMeters).toBeGreaterThan(20);
        expect(target.reward.xp).toBeGreaterThan(0);
        expect(target.reward.gold).toBeGreaterThan(0);
        expect(target.reward.message).toBeDefined();
      });
    });

    it('should have targets within Berlin area', () => {
      const quest = createInitialOutdoorQuest(null);
      const berlinLat = 52.52;
      const berlinLng = 13.365;
      const maxDistanceKm = 5;

      quest.targets.forEach((target) => {
        const distance = calculateDistance(berlinLat, berlinLng, target.latitude, target.longitude);
        expect(distance).toBeLessThan(maxDistanceKm * 1000);
      });
    });
  });
});
