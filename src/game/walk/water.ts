import type { LatLng } from '../geo/types';
import type { MapElement } from './planner';
import { inRing, project, segmentsMeet } from './geometry';
const same = (a: LatLng,b: LatLng) => a.lat === b.lat && a.lng === b.lng;
const fail = () => new Error('Die Wasserflächen sind unvollständig oder nicht eindeutig kartiert. Für diesen Bereich wird kein Weg vorgeschlagen.');
const isWater = (t: Record<string,string>) => t.natural === 'water' || t.waterway === 'riverbank' || t.landuse === 'reservoir';
function points(geometry: {lat:number;lon:number}[] | undefined): LatLng[] {
  if (!Array.isArray(geometry) || geometry.length < 2 || geometry.length > 3000
    || geometry.some(p => !p || !Number.isFinite(p.lat) || !Number.isFinite(p.lon) || Math.abs(p.lat)>90 || Math.abs(p.lon)>180)) throw fail();
  return geometry.map(p => ({lat:p.lat,lng:p.lon}));
}
function checkRing(ring: LatLng[]) {
  if (ring.length < 4 || ring.length > 3000 || !same(ring[0],ring.at(-1)!)) throw fail();
  for (let i=1;i<ring.length;i++) {
    if (same(ring[i-1],ring[i])) throw fail();
    for (let j=i+2;j<ring.length;j++) {
      if (i===1 && j===ring.length-1) continue;
      if (segmentsMeet(ring[i-1],ring[i],ring[j-1],ring[j],.01)) throw fail();
    }
  }
}
/** Conservative water mask: outer rings are filled, including islands/inner holes.
 * An inner member never grants access through an otherwise excluded water area.
 * Missing/ambiguous outer geometry rejects the whole candidate search.
 */
export function waterRings(elements: MapElement[]): LatLng[][] {
  const result: LatLng[][] = [];
  for (const element of elements) {
    if (!isWater(element.tags ?? {})) continue;
    if (element.type === 'way') {
      const ring = points(element.geometry); checkRing(ring); result.push(ring); continue;
    }
    if (element.type !== 'relation' || element.tags?.type !== 'multipolygon' || !Array.isArray(element.members)) throw fail();
    if (element.members.some(m => m.role !== 'inner' && m.role !== 'outer')) throw fail();
    const parts = element.members.filter(m => m.role === 'outer').map(m => {
      if (m.type !== 'way') throw fail();
      return points(m.geometry);
    });
    if (!parts.length) throw fail();
    while (parts.length) {
      const ring = [...parts.pop()!];
      while (!same(ring[0],ring.at(-1)!)) {
        const tail = ring.at(-1)!;
        const candidates = parts.map((p,i) => ({p,i})).filter(({p}) => same(tail,p[0]) || same(tail,p.at(-1)!));
        if (candidates.length !== 1) throw fail();
        const {p,i}=candidates[0]; parts.splice(i,1);
        const oriented = same(tail,p[0]) ? p : [...p].reverse();
        ring.push(...oriented.slice(1));
        if (ring.length > 3000) throw fail();
      }
      checkRing(ring); result.push(ring);
    }
  }
  return result;
}
export function segmentInWater(a: LatLng,b: LatLng,rings: LatLng[][]): boolean {
  return rings.some(ring => inRing(a,ring) || inRing(b,ring)
    || ring.slice(1).some((p,i) => segmentsMeet(a,b,ring[i],p)));
}
export function nearWater(point: LatLng,rings: LatLng[][]): boolean {
  return rings.some(ring => inRing(point,ring) || ring.slice(1).some((p,i) => project(point,ring[i],p).distance < 20));
}
