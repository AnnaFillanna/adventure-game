/**
 * Adventure Game - Geolocation Module
 * Public API for all GPS and location services
 */

// Services
export { geolocationService } from './geolocation';
export { demoMode } from './demo';
export { interactionService, DEFAULT_INTERACTION_RADIUS } from './interaction';
export { safeSpawnService } from './safe-spawn';

// Distance utilities
export {
  calculateDistance,
  calculateDistanceSpherical,
  calculateBearing,
  isWithinRadius,
  calculateDestination,
  getMidpoint,
} from './distance';

// Types
export type {
  LatLng,
  GeoPoint,
  GeoError,
  GeoErrorCode,
  WatchPositionOptions,
  SafeSpawnPoint,
  DemoSettings,
  InteractionTarget,
} from './types';
