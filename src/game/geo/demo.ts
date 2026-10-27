/**
 * Adventure Game - Demo Mode for GPS
 * Simulated GPS position and manual movement for development
 */

import type { GeoPoint, DemoSettings } from './types';
import { calculateDestination } from './distance';

interface DemoModeState {
  enabled: boolean;
  position: GeoPoint;
  speed: number; // meters per step
}

class DemoMode {
  private state: DemoModeState = {
    enabled: false,
    position: {
      lat: 48.8566,
      lng: 2.3522,
      accuracy: 5,
      timestamp: Date.now(),
    },
    speed: 10, // meters
  };

  /**
   * Initialize demo mode with custom settings
   */
  initialize(settings: Partial<DemoSettings>): void {
    if (settings.enabled !== undefined) {
      this.state.enabled = settings.enabled;
    }
    if (settings.startPosition) {
      this.state.position = {
        ...settings.startPosition,
        timestamp: Date.now(),
      };
    }
    if (settings.speed !== undefined) {
      this.state.speed = settings.speed;
    }
  }

  /**
   * Check if demo mode is enabled
   * Only available via explicit development setting (environment variable or localStorage)
   */
  isEnabled(): boolean {
    if (typeof window === 'undefined') return false;

    // Check environment variable or localStorage flag
    const isDevMode =
      import.meta.env.DEV && localStorage.getItem('__ADVENTURE_GAME_DEMO_MODE__') === 'true';

    return this.state.enabled && isDevMode;
  }

  /**
   * Enable demo mode (requires explicit dev setting to work)
   */
  enable(): void {
    this.state.enabled = true;
    localStorage.setItem('__ADVENTURE_GAME_DEMO_MODE__', 'true');
  }

  /**
   * Disable demo mode
   */
  disable(): void {
    this.state.enabled = false;
    localStorage.removeItem('__ADVENTURE_GAME_DEMO_MODE__');
  }

  /**
   * Get current demo position
   */
  getPosition(): GeoPoint {
    return {
      ...this.state.position,
      timestamp: Date.now(),
    };
  }

  /**
   * Move in a direction (for manual testing)
   * Direction: 0-360 degrees, where 0/360 = north, 90 = east, etc.
   */
  moveToDirection(bearingDegrees: number): void {
    const newPosition = calculateDestination(
      this.state.position,
      this.state.speed,
      bearingDegrees
    );

    this.state.position = {
      lat: newPosition.lat,
      lng: newPosition.lng,
      accuracy: 5,
      timestamp: Date.now(),
    };
  }

  /**
   * Move north
   */
  moveNorth(): void {
    this.moveToDirection(0);
  }

  /**
   * Move south
   */
  moveSouth(): void {
    this.moveToDirection(180);
  }

  /**
   * Move east
   */
  moveEast(): void {
    this.moveToDirection(90);
  }

  /**
   * Move west
   */
  moveWest(): void {
    this.moveToDirection(270);
  }

  /**
   * Move to specific coordinates
   */
  teleportTo(lat: number, lng: number): void {
    this.state.position = {
      lat,
      lng,
      accuracy: 5,
      timestamp: Date.now(),
    };
  }

  /**
   * Set movement speed (in meters per step)
   */
  setSpeed(metersPerStep: number): void {
    this.state.speed = Math.max(1, metersPerStep);
  }

  /**
   * Get current speed
   */
  getSpeed(): number {
    return this.state.speed;
  }

  /**
   * Reset to default position (Paris, 48.8566°N, 2.3522°E)
   */
  reset(): void {
    this.state.position = {
      lat: 48.8566,
      lng: 2.3522,
      accuracy: 5,
      timestamp: Date.now(),
    };
  }

  /**
   * Get all demo mode state (for debugging)
   */
  getState(): DemoModeState {
    return { ...this.state };
  }
}

// Export singleton instance
export const demoMode = new DemoMode();
