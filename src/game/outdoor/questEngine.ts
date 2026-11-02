/**
 * Outdoor Quest Engine - GPS-based Discovery System
 * Minimal functional outdoor adventure with no time requirements
 */

import type { OutdoorQuestState, DiscoveryTarget, GeoPoint, DiscoveryEvent } from './types';

export const FIRST_OUTDOOR_QUEST_ID = 'outdoor_01_first_discovery';

/**
 * Generate initial outdoor quest state
 * Creates a simple discovery quest with 3 targets
 */
export function createInitialOutdoorQuest(currentPosition: GeoPoint | null): OutdoorQuestState {
  const targets: DiscoveryTarget[] = [
    {
      id: 'discovery_1',
      name: 'Der alte Baum',
      description: 'Ein uralter Baum mit geheimnisvollen Zeichen',
      latitude: 52.5200,
      longitude: 13.3654,
      radiusMeters: 50,
      discovered: false,
      reward: {
        xp: 25,
        gold: 5,
        message: 'Du hast die geheimnisvollen Zeichen gefunden! Der Baum flüstert alte Geschichten...',
      },
    },
    {
      id: 'discovery_2',
      name: 'Der verborgene Stein',
      description: 'Ein Stein mit eingraviertem Lichtzeichen',
      latitude: 52.5210,
      longitude: 13.3664,
      radiusMeters: 50,
      discovered: false,
      reward: {
        xp: 25,
        gold: 5,
        message: 'Ein Lichtzeichen aktiviert sich unter deiner Hand!',
      },
    },
    {
      id: 'discovery_3',
      name: 'Die verbundenen Pfade',
      description: 'Zwei Pfade verflechten sich geheimnisvoll',
      latitude: 52.5190,
      longitude: 13.3644,
      radiusMeters: 50,
      discovered: false,
      reward: {
        xp: 50,
        gold: 10,
        message: 'Die Pfade verbinden sich! Das Geheimnis wird enthüllt...',
      },
    },
  ];

  return {
    version: 1,
    questId: FIRST_OUTDOOR_QUEST_ID,
    status: 'idle',
    currentPosition,
    lastErrorMessage: null,
    targets,
    completedTargets: [],
    totalXpEarned: 0,
    totalGoldEarned: 0,
    lastLocationUpdate: Date.now(),
    gpsEnabled: false,
    startedAt: undefined,
    completedAt: undefined,
  };
}

/**
 * Calculate distance between two points in meters using Haversine formula
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if player is within discovery range
 */
export function checkDiscoveryProximity(playerPos: GeoPoint, target: DiscoveryTarget): boolean {
  if (target.discovered) return false;

  const distance = calculateDistance(playerPos.lat, playerPos.lng, target.latitude, target.longitude);
  return distance <= target.radiusMeters;
}

/**
 * Update outdoor quest state with new position
 * Returns array of newly discovered targets
 */
export function updateOutdoorQuestPosition(
  state: OutdoorQuestState,
  newPosition: GeoPoint
): { newState: OutdoorQuestState; discoveries: DiscoveryEvent[] } {
  const discoveries: DiscoveryEvent[] = [];
  const newState = { ...state };

  // Update current position
  newState.currentPosition = newPosition;
  newState.lastLocationUpdate = newPosition.timestamp;

  // If not started yet, change status to in_progress on first position update
  if (newState.status === 'idle' && newPosition) {
    newState.status = 'in_progress';
    newState.startedAt = Date.now();
  }

  // Check for proximity to undiscovered targets
  newState.targets = newState.targets.map((target) => {
    if (target.discovered) return target;

    const proximity = checkDiscoveryProximity(newPosition, target);

    if (proximity) {
      const distance = calculateDistance(newPosition.lat, newPosition.lng, target.latitude, target.longitude);

      discoveries.push({
        targetId: target.id,
        discoveredAt: Date.now(),
        playerLat: newPosition.lat,
        playerLng: newPosition.lng,
        distanceMeters: distance,
      });

      return {
        ...target,
        discovered: true,
        discoveredAt: Date.now(),
      };
    }

    return target;
  });

  // Update completed targets and rewards
  discoveries.forEach((discovery) => {
    const target = newState.targets.find((t) => t.id === discovery.targetId);
    if (target && !newState.completedTargets.includes(target.id)) {
      newState.completedTargets.push(target.id);
      newState.totalXpEarned += target.reward.xp;
      newState.totalGoldEarned += target.reward.gold;
    }
  });

  // Check if quest is complete
  if (newState.completedTargets.length === newState.targets.length) {
    newState.status = 'completed';
    newState.completedAt = Date.now();
  }

  return { newState, discoveries };
}

/**
 * Get completion percentage
 */
export function getQuestProgress(state: OutdoorQuestState): number {
  return state.targets.length > 0 ? (state.completedTargets.length / state.targets.length) * 100 : 0;
}

/**
 * Persist outdoor quest state to localStorage
 */
export function saveOutdoorQuestState(state: OutdoorQuestState): void {
  try {
    localStorage.setItem('adventure_game_outdoor_quest', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save outdoor quest state:', e);
  }
}

/**
 * Load outdoor quest state from localStorage
 */
export function loadOutdoorQuestState(): OutdoorQuestState | null {
  try {
    const saved = localStorage.getItem('adventure_game_outdoor_quest');
    if (saved) {
      return JSON.parse(saved) as OutdoorQuestState;
    }
  } catch (e) {
    console.error('Failed to load outdoor quest state:', e);
  }
  return null;
}

/**
 * Clear outdoor quest state
 */
export function clearOutdoorQuestState(): void {
  try {
    localStorage.removeItem('adventure_game_outdoor_quest');
  } catch (e) {
    console.error('Failed to clear outdoor quest state:', e);
  }
}
