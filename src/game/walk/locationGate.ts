import { calculateDistance } from '../geo/distance';
import type { GeoPoint } from '../geo/types';
import { project } from './geometry';
import { locateOnPath, validFix, type WalkPlan, type WalkStation } from './planner';
export interface WalkSample { fix: GeoPoint; along: number; stationarySince: number; stationaryOrigin: GeoPoint }
export function acceptWalkFix(plan: WalkPlan, previous: WalkSample | null, fix: GeoPoint, now = Date.now()): WalkSample | null {
  if (plan.expiresAt < now || !validFix(fix, now)) return null;
  const match = locateOnPath(fix, plan.path);
  if (match.distance > 12 || match.distance + fix.accuracy! > 35) return null;
  // Two accuracy disks plus a small map allowance must distinguish this edge.
  // Even a fix on the planned line is ambiguous when another path lies within that band.
  if (plan.alternativeEdges.some(({a,b,shared}) => {
    const other = project(fix,a,b);
    // A common OSM node belongs to both paths. This does not exempt movement
    // along the other edge or geometrically coincident but disconnected nodes.
    if (shared.some(node => calculateDistance(other.position,node) < .25 && calculateDistance(fix,node) <= fix.accuracy!)) return false;
    return other.distance <= match.distance + 2 * fix.accuracy! + 2;
  })) return null;
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
