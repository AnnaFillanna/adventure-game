/**
 * Adventure Game - Interaction System
 * Handle proximity-based interactions with game objects
 */

import type { GeoPoint, InteractionTarget } from './types';
import { calculateDistance, isWithinRadius } from './distance';

interface InteractionConfig {
  defaultRadiusMeters: number;
  enableAccuracyAdjustment: boolean;
}

export const DEFAULT_INTERACTION_RADIUS = 30; // meters

class InteractionService {
  private config: InteractionConfig = {
    defaultRadiusMeters: DEFAULT_INTERACTION_RADIUS,
    enableAccuracyAdjustment: true,
  };

  /**
   * Configure interaction settings
   */
  configure(config: Partial<InteractionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if player can interact with a target
   * Takes GPS accuracy into account if available
   */
  canInteract(
    playerPosition: GeoPoint,
    targetPosition: GeoPoint,
    customRadiusMeters?: number
  ): boolean {
    const radius = customRadiusMeters ?? this.config.defaultRadiusMeters;
    return isWithinRadius(playerPosition, targetPosition, radius);
  }

  /**
   * Get distance and interaction status for a target
   */
  getInteractionStatus(
    playerPosition: GeoPoint,
    targetPosition: GeoPoint,
    customRadiusMeters?: number
  ): InteractionTarget {
    const distance = calculateDistance(playerPosition, targetPosition);
    const radius = customRadiusMeters ?? this.config.defaultRadiusMeters;
    const effectiveRadius = this.config.enableAccuracyAdjustment
      ? radius + (playerPosition.accuracy || 0)
      : radius;

    return {
      id: '',
      type: 'quest_point',
      position: targetPosition,
      distance,
      inRange: distance <= effectiveRadius,
    };
  }

  /**
   * Filter targets that are in range
   */
  getInteractableTargets(
    playerPosition: GeoPoint,
    targets: Array<GeoPoint & { id: string; type: InteractionTarget['type'] }>,
    customRadiusMeters?: number
  ): InteractionTarget[] {
    const radius = customRadiusMeters ?? this.config.defaultRadiusMeters;

    return targets
      .map((target) => {
        const distance = calculateDistance(playerPosition, target);
        const effectiveRadius = this.config.enableAccuracyAdjustment
          ? radius + (playerPosition.accuracy || 0)
          : radius;

        return {
          id: target.id,
          type: target.type,
          position: target,
          distance,
          inRange: distance <= effectiveRadius,
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Get closest interactable target
   */
  getClosestTarget(
    playerPosition: GeoPoint,
    targets: Array<GeoPoint & { id: string; type: InteractionTarget['type'] }>,
    customRadiusMeters?: number
  ): InteractionTarget | null {
    const interactable = this.getInteractableTargets(playerPosition, targets, customRadiusMeters);
    return interactable.length > 0 ? interactable[0] : null;
  }

  /**
   * Get all targets within range
   */
  getTargetsInRange(
    playerPosition: GeoPoint,
    targets: Array<GeoPoint & { id: string; type: InteractionTarget['type'] }>,
    customRadiusMeters?: number
  ): InteractionTarget[] {
    const allTargets = this.getInteractableTargets(playerPosition, targets, customRadiusMeters);
    return allTargets.filter((t) => t.inRange);
  }

  /**
   * Get current interaction radius (for UI display)
   */
  getRadiusMeters(): number {
    return this.config.defaultRadiusMeters;
  }

  /**
   * Get effective radius including GPS accuracy
   */
  getEffectiveRadiusMeters(gpsAccuracy?: number): number {
    const accuracy = this.config.enableAccuracyAdjustment ? gpsAccuracy || 0 : 0;
    return this.config.defaultRadiusMeters + accuracy;
  }

  /**
   * Set default interaction radius
   */
  setRadiusMeters(radiusMeters: number): void {
    this.config.defaultRadiusMeters = Math.max(1, radiusMeters);
  }

  /**
   * Enable/disable accuracy adjustment
   */
  setAccuracyAdjustment(enabled: boolean): void {
    this.config.enableAccuracyAdjustment = enabled;
  }
}

// Export singleton instance
export const interactionService = new InteractionService();
