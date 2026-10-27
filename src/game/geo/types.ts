/**
 * Adventure Game - Geolocation Types
 * Zentrale Typen für GPS und Standortdienste
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeoPoint extends LatLng {
  accuracy?: number; // in meters
  altitude?: number;
  timestamp?: number;
}

export type GeoErrorCode = 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'HTTPS_REQUIRED' | 'UNKNOWN';

export interface GeoError {
  code: GeoErrorCode;
  message: string;
  timestamp: number;
}

export interface WatchPositionOptions {
  enableHighAccuracy?: boolean;
  timeout?: number; // milliseconds
  maximumAge?: number; // milliseconds
}

export interface SafeSpawnPoint extends GeoPoint {
  id: string;
  name: string;
  description: string;
  type: 'safe_zone' | 'quest_location' | 'event_area';
  radius: number; // in meters
  validated: boolean;
  notes?: string;
}

export interface DemoSettings {
  enabled: boolean;
  startPosition: GeoPoint;
  speed: number; // grid units per update
}

export interface InteractionTarget {
  id: string;
  type: 'npc' | 'enemy' | 'item' | 'quest_point';
  position: LatLng | GeoPoint;
  distance: number; // Meters (for GPS) or grid units (for 2D)
  inRange: boolean; // Within interaction radius
}
