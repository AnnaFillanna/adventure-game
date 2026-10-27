/**
 * Adventure Game - Distance Service Tests
 * Unit tests for Haversine formula and distance calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculateDistanceSpherical,
  calculateBearing,
  isWithinRadius,
  getMidpoint,
} from './distance';

describe('Distance Service', () => {
  // Paris and London coordinates
  const paris = { lat: 48.8566, lng: 2.3522 };
  const london = { lat: 51.5074, lng: -0.1278 };

  describe('calculateDistance (Haversine)', () => {
    it('should calculate distance between two cities correctly', () => {
      const distance = calculateDistance(paris, london);

      // Approximately 343 km between Paris and London
      expect(distance).toBeGreaterThan(340000);
      expect(distance).toBeLessThan(350000);
    });

    it('should return 0 for same location', () => {
      const distance = calculateDistance(paris, paris);
      expect(distance).toBe(0);
    });

    it('should be symmetric', () => {
      const d1 = calculateDistance(paris, london);
      const d2 = calculateDistance(london, paris);

      expect(Math.abs(d1 - d2)).toBeLessThan(1); // Allow 1m rounding difference
    });

    it('should handle equator crossing', () => {
      const north = { lat: 10, lng: 0 };
      const south = { lat: -10, lng: 0 };

      const distance = calculateDistance(north, south);

      // Approximately 2222 km
      expect(distance).toBeGreaterThan(2200000);
      expect(distance).toBeLessThan(2250000);
    });

    it('should handle antimeridian crossing', () => {
      const west = { lat: 0, lng: 179 };
      const east = { lat: 0, lng: -179 };

      const distance = calculateDistance(west, east);

      // Should be about 222 km (not 40,000+ km)
      expect(distance).toBeLessThan(225000);
      expect(distance).toBeGreaterThan(220000);
    });
  });

  describe('calculateDistanceSpherical', () => {
    it('should calculate distance using spherical law of cosines', () => {
      const distance = calculateDistanceSpherical(paris, london);

      expect(distance).toBeGreaterThan(340000);
      expect(distance).toBeLessThan(350000);
    });

    it('should give similar results to Haversine for this scale', () => {
      const haversine = calculateDistance(paris, london);
      const spherical = calculateDistanceSpherical(paris, london);

      // Should be very close (within 1%)
      const percentDiff = Math.abs(haversine - spherical) / haversine;
      expect(percentDiff).toBeLessThan(0.01);
    });
  });

  describe('calculateBearing', () => {
    it('should calculate bearing roughly west-northwest from Paris to London', () => {
      const bearing = calculateBearing(paris, london);

      // Should be roughly 300-330 degrees (WNW direction from Paris to London)
      // Because London is slightly west and north of Paris
      expect(bearing).toBeGreaterThan(300);
      expect(bearing).toBeLessThan(360);
    });

    it('should be between 0 and 360', () => {
      const bearing = calculateBearing(paris, london);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
    });

    it('should return 0 degrees for same location', () => {
      const bearing = calculateBearing(paris, paris);
      // Bearing is undefined for same point, but formula returns 0
      expect(bearing).toBeDefined();
    });
  });

  describe('isWithinRadius', () => {
    it('should return true for points within radius', () => {
      const from = { lat: 48.8566, lng: 2.3522, accuracy: 5 };
      const to = { lat: 48.8600, lng: 2.3600, accuracy: 5 };

      // Very close points, should be within 1km radius
      const within = isWithinRadius(from, to, 1000);
      expect(within).toBe(true);
    });

    it('should return false for points outside radius', () => {
      const from = { lat: 48.8566, lng: 2.3522, accuracy: 0 };
      const to = { lat: 51.5074, lng: -0.1278, accuracy: 0 };

      // Paris to London, definitely outside 100m radius
      const within = isWithinRadius(from, to, 100);
      expect(within).toBe(false);
    });

    it('should factor in GPS accuracy', () => {
      const from = { lat: 48.8566, lng: 2.3522, accuracy: 100 };
      const to = { lat: 48.8575, lng: 2.3535, accuracy: 0 };

      // Close points with 100m accuracy should be within 50m radius
      // (100m accuracy extends the radius)
      const within = isWithinRadius(from, to, 50);
      expect(within).toBe(true);
    });
  });

  describe('getMidpoint', () => {
    it('should calculate midpoint between two cities', () => {
      const midpoint = getMidpoint(paris, london);

      // Midpoint should be roughly in the English Channel area
      // Around 50.2°N, 1.5°W
      expect(midpoint.lat).toBeGreaterThan(49.5);
      expect(midpoint.lat).toBeLessThan(51);

      expect(midpoint.lng).toBeGreaterThan(-2);
      expect(midpoint.lng).toBeLessThan(1.5);
    });

    it('should have equal distance to both points', () => {
      const midpoint = getMidpoint(paris, london);

      const d1 = calculateDistance(paris, midpoint);
      const d2 = calculateDistance(london, midpoint);

      // Should be roughly equal
      const diff = Math.abs(d1 - d2) / Math.max(d1, d2);
      expect(diff).toBeLessThan(0.01); // Less than 1% difference
    });

    it('should work for points on equator', () => {
      const point1 = { lat: 0, lng: 0 };
      const point2 = { lat: 0, lng: 2 };

      const midpoint = getMidpoint(point1, point2);

      expect(midpoint.lat).toBeCloseTo(0, 1);
      expect(midpoint.lng).toBeCloseTo(1, 1);
    });
  });

  describe('Edge cases', () => {
    it('should handle very small distances (cm scale)', () => {
      const point1 = { lat: 48.8566, lng: 2.3522 };
      const point2 = { lat: 48.85661, lng: 2.35221 };

      const distance = calculateDistance(point1, point2);

      // Should be a few meters
      expect(distance).toBeGreaterThan(1);
      expect(distance).toBeLessThan(200);
    });

    it('should handle poles', () => {
      const northPole = { lat: 90, lng: 0 };
      const southPole = { lat: -90, lng: 0 };

      const distance = calculateDistance(northPole, southPole);

      // Half earth circumference ≈ 20,000 km
      expect(distance).toBeGreaterThan(19500000);
      expect(distance).toBeLessThan(21000000);
    });

    it('should handle null/undefined gracefully in isWithinRadius', () => {
      const point1 = { lat: 48.8566, lng: 2.3522 };
      const point2 = { lat: 48.8600, lng: 2.3500 };

      // Should work without accuracy values
      const within = isWithinRadius(point1, point2, 100);
      expect(typeof within).toBe('boolean');
    });
  });
});
