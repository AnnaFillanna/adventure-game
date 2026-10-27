/**
 * Adventure Game - Distance Calculations
 * Haversine formula and distance utilities for GPS coordinates
 */

import type { LatLng, GeoPoint } from './types';

/**
 * Earth's radius in meters
 */
const EARTH_RADIUS_METERS = 6371000;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in meters
 *
 * @param from Starting coordinate
 * @param to Ending coordinate
 * @returns Distance in meters
 */
export function calculateDistance(from: LatLng, to: LatLng): number {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_METERS * c;

  return distance;
}

/**
 * Alternative distance calculation using Spherical Law of Cosines
 * More accurate for shorter distances
 * Returns distance in meters
 */
export function calculateDistanceSpherical(from: LatLng, to: LatLng): number {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const angle =
    Math.acos(
      Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLng)
    ) || 0;

  return EARTH_RADIUS_METERS * angle;
}

/**
 * Calculate bearing (azimuth) from one point to another
 * Returns angle in degrees (0-360, where 0/360 is north, 90 is east, etc.)
 */
export function calculateBearing(from: LatLng, to: LatLng): number {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  const bearing = toDegrees(Math.atan2(y, x));

  // Normalize to 0-360
  return (bearing + 360) % 360;
}

/**
 * Check if a point is within a radius
 * Considers GPS accuracy if available
 */
export function isWithinRadius(
  point: GeoPoint,
  target: GeoPoint,
  radiusMeters: number
): boolean {
  const distance = calculateDistance(point, target);
  const effectiveRadius = radiusMeters + (point.accuracy || 0);

  return distance <= effectiveRadius;
}

/**
 * Calculate destination point given starting point, distance, and bearing
 * Useful for generating test/demo positions
 */
export function calculateDestination(
  from: LatLng,
  distanceMeters: number,
  bearingDegrees: number
): LatLng {
  const lat1 = toRadians(from.lat);
  const lng1 = toRadians(from.lng);
  const angle = toRadians(bearingDegrees);
  const angularDistance = distanceMeters / EARTH_RADIUS_METERS;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(angle)
  );

  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(angle) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: toDegrees(lat2),
    lng: toDegrees(lng2),
  };
}

/**
 * Get the center point between two coordinates (midpoint)
 */
export function getMidpoint(point1: LatLng, point2: LatLng): LatLng {
  const lat1 = toRadians(point1.lat);
  const lng1 = toRadians(point1.lng);
  const lat2 = toRadians(point2.lat);
  const lng2 = toRadians(point2.lng);

  const bx = Math.cos(lat2) * Math.cos(lng2 - lng1);
  const by = Math.cos(lat2) * Math.sin(lng2 - lng1);

  const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bx) ** 2 + by ** 2));
  const lng3 = lng1 + Math.atan2(by, Math.cos(lat1) + bx);

  return {
    lat: toDegrees(lat3),
    lng: toDegrees(lng3),
  };
}
