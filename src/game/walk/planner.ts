import { waterRings, segmentInWater, nearWater } from './water';
import { project, segmentsMeet } from './geometry';
export { project } from './geometry';
import { calculateDistance } from '../geo/distance';
import type { GeoPoint, LatLng } from '../geo/types';

export interface MapElement {
  type: 'node' | 'way' | 'relation'; id: number; lat?: number; lon?: number;
  members?: { type: 'node' | 'way' | 'relation'; ref: number; role: string; geometry?: {lat:number;lon:number}[] }[];
  nodes?: number[]; geometry?: { lat: number; lon: number }[]; tags?: Record<string, string>;
}
export interface WalkMapData { elements: MapElement[]; osm3s: { timestamp_osm_base: string } }
export interface WalkStation extends LatLng { along: number; name: string }
export interface WalkPlan {
  alternativeEdges: { a: LatLng; b: LatLng; shared: LatLng[] }[];
  path: LatLng[]; stations: WalkStation[]; oneWayMeters: number;
  sourceTime: string; checkedAt: number; expiresAt: number; wayIds: number[];
  review: 'unreviewed'; checks: string[];
}
export class WalkPlanningError extends Error {}
const paved = new Set(['asphalt', 'paved', 'concrete', 'paving_stones', 'sett', 'compacted', 'fine_gravel']);
const footHighways = new Set(['footway', 'pedestrian', 'path']);
const publicAccess = new Set(['yes', 'designated', 'permissive']);
const allowsAccess = (value: string | undefined) => value === undefined || publicAccess.has(value);
export function walkable(tags: Record<string, string>): boolean {
  return footHighways.has(tags.highway) && paved.has(tags.surface) && allowsAccess(tags.access) && allowsAccess(tags.foot)
    && tags.area !== 'yes' && tags.footway !== 'crossing' && tags.crossing === undefined
    && !['bridge', 'tunnel', 'ford', 'construction', 'proposed', 'sac_scale', 'opening_hours', 'access:conditional', 'foot:conditional', 'seasonal'].some(key => tags[key] && tags[key] !== 'no')
    && (!tags.layer || tags.layer === '0') && (!tags.incline || tags.incline === '0' || tags.incline === '0%');
}
export function validFix(point: GeoPoint, now = Date.now()): boolean {
  return Number.isFinite(point.lat) && Math.abs(point.lat) <= 90 && Number.isFinite(point.lng) && Math.abs(point.lng) <= 180
    && typeof point.accuracy === 'number' && Number.isFinite(point.accuracy) && point.accuracy >= 0 && point.accuracy <= 25
    && typeof point.timestamp === 'number' && point.timestamp <= now + 5000 && now - point.timestamp <= 15000;
}
export function locateOnPath(point: LatLng, path: LatLng[]) {
  let walked = 0, best = { distance: Infinity, along: 0 };
  for (let i = 1; i < path.length; i++) {
    const segment = calculateDistance(path[i - 1], path[i]);
    const p = project(point, path[i - 1], path[i]);
    if (p.distance < best.distance) best = { distance: p.distance, along: walked + p.fraction * segment };
    walked += segment;
  }
  return best;
}
/** Routes are graph-derived candidates. Passing these checks is NOT operational approval. */
export function planWalk(data: WalkMapData, origin: GeoPoint, remaining = 3, now = Date.now()): WalkPlan {
  if (!validFix(origin, now)) throw new WalkPlanningError('Dein Standort ist noch zu ungenau oder veraltet. Warte auf ein genaueres GPS-Signal.');
  if (origin.lat < 47.2 || origin.lat > 55.2 || origin.lng < 5.8 || origin.lng > 15.1) throw new WalkPlanningError('Die Wegsuche ist zunächst auf die Region Deutschland begrenzt.');
  if (!Number.isInteger(remaining) || remaining < 1 || remaining > 3) throw new WalkPlanningError('Die Aufgaben konnten nicht vorbereitet werden.');
  const sourceTime = Date.parse(data?.osm3s?.timestamp_osm_base);
  if (!Array.isArray(data?.elements) || data.elements.length > 18000 || !Number.isFinite(sourceTime)
      || now - sourceTime > 48 * 3600000 || sourceTime > now + 300000) throw new WalkPlanningError('Die Wegdaten sind unvollständig oder nicht aktuell genug. Bitte versuche es später erneut.');
  const water = waterRings(data.elements);
  const points = new Map<number, LatLng>();
  const graph = new Map<number, { to: number; distance: number; way: number }[]>();
  const forbiddenNodes = new Set<number>();
  const hazardPoints: LatLng[] = [];
  const hazardSegments: [LatLng, LatLng][] = [];
  const ways = data.elements.filter(e => e.type === 'way' && e.geometry && e.nodes && e.geometry.length === e.nodes.length);
  for (const e of data.elements) {
    const t = e.tags ?? {};
    if (e.type === 'node' && (t.barrier && t.barrier !== 'no' || t.highway === 'crossing' || t.railway === 'level_crossing' || t.ford)) {
      forbiddenNodes.add(e.id);
      if (Number.isFinite(e.lat) && Number.isFinite(e.lon)) hazardPoints.push({ lat: e.lat!, lng: e.lon! });
    }
  }
  for (const w of ways) {
    const t = w.tags ?? {};
    const dangerous = t.waterway || t.railway || (t.highway && !footHighways.has(t.highway));
    if (dangerous) {
      w.nodes!.forEach(id => forbiddenNodes.add(id));
      for (let i = 1; i < w.geometry!.length; i++) {
        const a = w.geometry![i - 1], b = w.geometry![i];
        hazardSegments.push([{ lat: a.lat, lng: a.lon }, { lat: b.lat, lng: b.lon }]);
      }
    }
  }
  const add = (a: number, b: number, way: number) => {
    const distance = calculateDistance(points.get(a)!, points.get(b)!);
    if (distance < .1 || distance > 250) return;
    graph.set(a, [...(graph.get(a) ?? []), { to: b, distance, way }]);
  };
  for (const w of ways) {
    if (!walkable(w.tags ?? {})) continue;
    for (let i = 1; i < w.nodes!.length; i++) {
      const aId = w.nodes![i - 1], bId = w.nodes![i];
      if (forbiddenNodes.has(aId) || forbiddenNodes.has(bId)) continue;
      const aa = w.geometry![i - 1], bb = w.geometry![i];
      const a = { lat: aa.lat, lng: aa.lon }, b = { lat: bb.lat, lng: bb.lon };
      if (![a.lat, a.lng, b.lat, b.lng].every(Number.isFinite) || calculateDistance(origin, a) > 1050 || calculateDistance(origin, b) > 1050) continue;
      if (segmentInWater(a,b,water) || hazardPoints.some(p => project(p, a, b).distance < 10) || hazardSegments.some(([c, d]) => segmentsMeet(a, b, c, d))) continue;
      points.set(aId, a); points.set(bId, b); add(aId, bId, w.id); add(bId, aId, w.id);
    }
  }
  // Snap only onto an existing edge, never bridge disconnected paths by proximity.
  let snap: { a: number; b: number; way: number; point: LatLng; distance: number } | undefined;
  for (const [a, edges] of graph) for (const edge of edges) {
    const p = project(origin, points.get(a)!, points.get(edge.to)!);
    if (!snap || p.distance < snap.distance) snap = { a, b: edge.to, way: edge.way, point: p.position, distance: p.distance };
  }
  if (!snap || snap.distance > 20) throw new WalkPlanningError('An deinem Standort ist kein ausreichend dokumentierter Fußweg verbunden. Es wird keine Strecke über Straßen oder Privatgrund ergänzt. Suche später von einem öffentlichen Fußweg erneut.');
  points.set(-1, snap.point);
  add(-1, snap.a, snap.way); add(snap.a, -1, snap.way); add(-1, snap.b, snap.way); add(snap.b, -1, snap.way);
  // At an exact node the zero-length edge is intentionally omitted; alias it directly.
  const start = calculateDistance(snap.point, points.get(snap.a)!) < .1 ? snap.a : calculateDistance(snap.point, points.get(snap.b)!) < .1 ? snap.b : -1;
  const distances = new Map<number, number>([[start, 0]]);
  const previous = new Map<number, { node: number; way: number }>();
  const queue = new Set<number>([start]); const visited = new Set<number>();
  while (queue.size) {
    const current = [...queue].reduce((a, b) => distances.get(a)! < distances.get(b)! ? a : b);
    queue.delete(current); visited.add(current);
    for (const edge of graph.get(current) ?? []) {
      const next = distances.get(current)! + edge.distance;
      if (next > 500 || visited.has(edge.to) || next >= (distances.get(edge.to) ?? Infinity)) continue;
      distances.set(edge.to, next); previous.set(edge.to, { node: current, way: edge.way }); queue.add(edge.to);
    }
  }
  const safeStop = (point: LatLng) => !nearWater(point,water) && !hazardPoints.some(p => calculateDistance(p, point) < 30)
    && !hazardSegments.some(([a, b]) => project(point, a, b).distance < 20);
  const endpoints = [...distances].filter(([id, d]) => d >= remaining * 45 && safeStop(points.get(id)!)).sort((a, b) => b[1] - a[1]);
  for (const [end, length] of endpoints) {
    const ids = [end]; const used = new Set<number>();
    while (ids[0] !== start) { const prev = previous.get(ids[0])!; used.add(prev.way); ids.unshift(prev.node); }
    const path = ids.map(id => points.get(id)!);
    const edgeKey = (a: number, b: number) => a < b ? `${a}:${b}` : `${b}:${a}`;
    const chosen = new Set(ids.slice(1).map((id,i) => edgeKey(ids[i],id)));
    if (ids.includes(-1)) chosen.add(edgeKey(snap.a,snap.b));
    // Include non-walkable ways too: GPS must not match a nearby private path or road.
    const alternativeEdges: WalkPlan['alternativeEdges'] = [];
    const chosenNodes = new Set(ids);
    for (const way of ways) {
      if (!way.tags?.highway) continue;
      for (let i = 1; i < way.nodes!.length; i++) {
        if (chosen.has(edgeKey(way.nodes![i-1],way.nodes![i]))) continue;
        const a=way.geometry![i-1], b=way.geometry![i];
        const shared = [way.nodes![i-1],way.nodes![i]].filter(id => chosenNodes.has(id)).map(id => points.get(id)!);
        alternativeEdges.push({ a:{lat:a.lat,lng:a.lon}, b:{lat:b.lat,lng:b.lon}, shared });
      }
    }
    const stations: WalkStation[] = []; let along = 0;
    for (let i = 1; i < path.length; i++) {
      along += calculateDistance(path[i - 1], path[i]);
      if (along >= (stations.length + 1) * length / remaining - 10 && safeStop(path[i]) && (stations.length === 0 || along - stations.at(-1)!.along >= 40)) {
        stations.push({ ...path[i], along, name: `Haltepunkt ${stations.length + 1}` });
      }
      if (stations.length === remaining) break;
    }
    if (stations.length !== remaining) continue;
    return { path, alternativeEdges, stations, oneWayMeters: length, wayIds: [...used], sourceTime: data.osm3s.timestamp_osm_base,
      checkedAt: now, expiresAt: now + 24 * 3600000, review: 'unreviewed',
      checks: ['Verbundene Fußwege', 'Bekannter Wegbelag', 'Unbekannte Zugangswerte ausgeschlossen; fehlende Zugangstags bleiben unsicher', 'Keine kartierten Privatwege, Treppen oder Brücken', 'Keine erkannten Straßen- oder Bahnquerungen', 'Kartierte Wasserpolygone ausgeschlossen (einschließlich Inseln)', 'Haltekandidaten mit Abstand zu kartierten Verkehrswegen'] };
  }
  throw new WalkPlanningError('Es wurden keine ausreichend verbundenen Fußwege mit passenden Haltekandidaten gefunden. Dein Fortschritt bleibt erhalten.');
}
