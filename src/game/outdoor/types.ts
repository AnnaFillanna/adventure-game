/**
 * Outdoor Adventure Types - GPS-based Discovery Quest System
 */

export interface GeoPoint {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number | null;
  timestamp: number;
}

export interface DiscoveryTarget {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  discovered: boolean;
  discoveredAt?: number;
  reward: {
    xp: number;
    gold: number;
    message: string;
  };
}

export interface OutdoorQuestState {
  version: 1;
  questId: string;
  status: 'idle' | 'started' | 'in_progress' | 'completed' | 'failed';
  currentPosition: GeoPoint | null;
  lastErrorMessage: string | null;
  targets: DiscoveryTarget[];
  completedTargets: string[];
  totalXpEarned: number;
  totalGoldEarned: number;
  lastLocationUpdate: number;
  gpsEnabled: boolean;
  startedAt?: number;
  completedAt?: number;
}

export interface LocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'HTTPS_REQUIRED' | 'UNKNOWN';
  message: string;
  timestamp: number;
}

export interface DiscoveryEvent {
  targetId: string;
  discoveredAt: number;
  playerLat: number;
  playerLng: number;
  distanceMeters: number;
}
