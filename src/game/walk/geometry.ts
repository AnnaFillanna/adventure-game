import type { LatLng } from '../geo/types';
import { calculateDistance } from '../geo/distance';

export function project(point: LatLng, a: LatLng, b: LatLng) {
  const scale = Math.cos(a.lat * Math.PI / 180);
  const dx = (b.lng - a.lng) * scale, dy = b.lat - a.lat;
  const t = Math.max(0, Math.min(1, (((point.lng - a.lng) * scale) * dx + (point.lat - a.lat) * dy) / (dx * dx + dy * dy || 1)));
  const position = { lat: a.lat + t * (b.lat - a.lat), lng: a.lng + t * (b.lng - a.lng) };
  return { position, fraction: t, distance: calculateDistance(point, position) };
}
// A 25 cm tolerance handles rounded OSM coordinates and endpoint contacts.
export function segmentsMeet(a: LatLng, b: LatLng, c: LatLng, d: LatLng, tolerance = .25): boolean {
  const margin = tolerance / 60000;
  if (Math.max(a.lat,b.lat)+margin < Math.min(c.lat,d.lat) || Math.max(c.lat,d.lat)+margin < Math.min(a.lat,b.lat)
    || Math.max(a.lng,b.lng)+margin < Math.min(c.lng,d.lng) || Math.max(c.lng,d.lng)+margin < Math.min(a.lng,b.lng)) return false;
  const side = (p: LatLng, q: LatLng, r: LatLng) => (q.lng - p.lng) * (r.lat - p.lat) - (q.lat - p.lat) * (r.lng - p.lng);
  if (side(a,b,c) * side(a,b,d) < 0 && side(c,d,a) * side(c,d,b) < 0) return true;
  return Math.min(project(a,c,d).distance, project(b,c,d).distance, project(c,a,b).distance, project(d,a,b).distance) <= tolerance;
}
export function inRing(point: LatLng, ring: LatLng[]): boolean {
  let inside = false;
  for (let i = 1; i < ring.length; i++) {
    const a = ring[i-1], b = ring[i];
    if (project(point,a,b).distance <= .25) return true;
    if ((a.lat > point.lat) !== (b.lat > point.lat) && point.lng < (b.lng-a.lng)*(point.lat-a.lat)/(b.lat-a.lat)+a.lng) inside = !inside;
  }
  return inside;
}
