/**
 * Adventure Game - Safe Spawn Service
 * Architecture for safe spawn locations
 *
 * IMPORTANT: This is a preparation layer.
 * - No random GPS coordinates are used as actual game targets
 * - Objects are NOT placed on roads, railways, water, or private properties
 * - Actual game points must be explicitly validated on public walking paths
 * - OpenStreetMap data alone is not sufficient for safety validation
 * - Current development phase uses only explicit mock points
 */

import type { SafeSpawnPoint, LatLng } from './types';

class SafeSpawnService {
  private safePoints: Map<string, SafeSpawnPoint> = new Map();
  private validationQueue: SafeSpawnPoint[] = [];

  /**
   * Register a safe spawn point for development/testing
   * Should only be used with explicitly vetted locations
   */
  registerSafePoint(point: SafeSpawnPoint): void {
    // Ensure point is explicitly marked and documented
    if (!point.id || !point.name) {
      console.warn('Safe spawn point missing id or name');
      return;
    }

    this.safePoints.set(point.id, {
      ...point,
      validated: false, // All new points start unvalidated
    });
  }

  /**
   * Get a safe spawn point by ID
   */
  getSafePoint(id: string): SafeSpawnPoint | null {
    return this.safePoints.get(id) || null;
  }

  /**
   * Get all registered safe points
   */
  getAllSafePoints(): SafeSpawnPoint[] {
    return Array.from(this.safePoints.values());
  }

  /**
   * Get validated safe points only
   */
  getValidatedSafePoints(): SafeSpawnPoint[] {
    return Array.from(this.safePoints.values()).filter((p) => p.validated);
  }

  /**
   * Mark a point as validated
   * In production, this would be part of a backend validation workflow
   */
  validateSafePoint(id: string, notes?: string): boolean {
    const point = this.safePoints.get(id);
    if (!point) {
      return false;
    }

    point.validated = true;
    if (notes) {
      point.notes = notes;
    }

    return true;
  }

  /**
   * Queue a point for validation
   * In production, this would notify admins/validators
   */
  queueForValidation(point: SafeSpawnPoint): void {
    if (this.validationQueue.some((p) => p.id === point.id)) {
      return;
    }

    this.validationQueue.push(point);
  }

  /**
   * Check if a location is safe (basic checks only)
   * THIS IS NOT A COMPREHENSIVE SAFETY CHECK
   * In production, use proper geographic/safety APIs
   */
  isSafeZone(lat: number, lng: number, maxDistanceMeters: number = 1000): boolean {
    const validatedPoints = this.getValidatedSafePoints();

    // Check if location is near any validated safe zone
    for (const point of validatedPoints) {
      const distance = this.calculateSimpleDistance(
        { lat, lng },
        { lat: point.lat, lng: point.lng }
      );

      if (distance <= maxDistanceMeters) {
        return true;
      }
    }

    return false;
  }

  /**
   * Simple distance calculation for basic checks
   * NOT suitable for game logic - use distance.ts for that
   */
  private calculateSimpleDistance(from: LatLng, to: LatLng): number {
    const lat1 = (from.lat * Math.PI) / 180;
    const lat2 = (to.lat * Math.PI) / 180;
    const deltaLat = ((to.lat - from.lat) * Math.PI) / 180;
    const deltaLng = ((to.lng - from.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const R = 6371000; // Earth's radius in meters

    return R * c;
  }

  /**
   * Get safety warnings/notices to display to players
   */
  getSafetyNotice(): string {
    return (
      'Adventure Game requires real-world movement. ' +
      'Please stay aware of your surroundings. ' +
      'Parents/guardians should supervise children. ' +
      'Avoid dangerous areas, traffic, and private property. ' +
      'Follow local laws and trespassing regulations.'
    );
  }

  /**
   * Clear all points and validation queue
   */
  clear(): void {
    this.safePoints.clear();
    this.validationQueue = [];
  }

  /**
   * Get validation statistics
   */
  getStats(): { total: number; validated: number; pending: number } {
    return {
      total: this.safePoints.size,
      validated: Array.from(this.safePoints.values()).filter((p) => p.validated).length,
      pending: this.validationQueue.length,
    };
  }
}

// Export singleton instance
export const safeSpawnService = new SafeSpawnService();
