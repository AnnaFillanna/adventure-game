import { calculateDistance } from '../geo/distance';
import type { GeoPoint } from '../geo/types';
import { locateOnPath, validFix, type WalkPlan, type WalkStation } from './planner';
export interface WalkSample { fix: GeoPoint; along: number; stationarySince: number; stationaryOrigin: GeoPoint }
export function acceptWalkFix(plan: WalkPlan, previous: WalkSample | null, fix: GeoPoint, now = Date.now()): WalkSample | null {
  if (plan.expiresAt < now || !validFix(fix, now)) return null;
  const match = locateOnPath(fix, plan.path);
  if (match.distance > 12 || match.distance + fix.accuracy! > 35) return null;
  if (!previous) {
    // A session must begin at the first existing path segment, not at a distant task.
    if (match.along > 35) return null;
    return { fix, along: match.along, stationarySince: now, stationaryOrigin: fix };
  }
  const dt = (fix.timestamp! - previous.fix.timestamp!) / 1000;
  if (dt <= 0 || dt > 30) return null;
  const traveled = calculateDistance(previous.fix, fix);
  if (traveled > 4 * dt + 20 || Math.abs(match.along - previous.along) > 4 * dt + 20) return null;
  const moved = calculateDistance(previous.stationaryOrigin, fix) > Math.max(4, (previous.stationaryOrigin.accuracy! + fix.accuracy!) / 2) || Math.abs(match.along - previous.along) > 8;
  return { fix, along: match.along, stationarySince: moved ? now : previous.stationarySince, stationaryOrigin: moved ? fix : previous.stationaryOrigin };
}
export function stationReady(sample: WalkSample | null, station: WalkStation, now = Date.now()): boolean {
  return !!sample && validFix(sample.fix, now) && now - sample.stationarySince >= 5000
    && Math.abs(sample.along - station.along) <= 30 && calculateDistance(sample.fix, station) + sample.fix.accuracy! <= 40;
}
