import type { LatLng } from '../geo/types';
import type { WalkMapData } from './planner';
const endpoint = import.meta.env.VITE_OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
let cached: { key: string; at: number; data: WalkMapData } | null = null;
let lastRequest = 0;
/** One explicit bounded request; no background fetch, retries or GPS history. */
export async function loadWalkMap(position: LatLng, signal: AbortSignal): Promise<WalkMapData> {
  if (!Number.isFinite(position.lat) || !Number.isFinite(position.lng) || position.lat < 47.2 || position.lat > 55.2 || position.lng < 5.8 || position.lng > 15.1) throw new Error('Die Wegsuche ist zunächst auf die Region Deutschland begrenzt.');
  const lat = position.lat.toFixed(3), lng = position.lng.toFixed(3), key = `${lat},${lng}`;
  if (cached?.key === key && Date.now() - cached.at < 5 * 60000) return cached.data;
  if (Date.now() - lastRequest < 60000) throw new Error('Bitte warte eine Minute vor einer neuen Wegsuche. Dein Fortschritt bleibt erhalten.');
  lastRequest = Date.now();
  const area = `(around:1100,${lat},${lng})`;
  const query = `[out:json][timeout:20][maxsize:16777216];(way${area}["highway"];way${area}["waterway"];way${area}["railway"];node${area}["barrier"];node${area}["highway"="crossing"];node${area}["railway"="level_crossing"];);out body geom;`;
  let response: Response;
  try { response = await fetch(endpoint, { method: 'POST', body: new URLSearchParams({ data: query }), signal }); }
  catch { throw new Error('Der Kartendienst ist nicht erreichbar. Prüfe deine Internetverbindung und versuche es später erneut.'); }
  if (!response.ok) throw new Error(response.status === 429 || response.status >= 500
    ? 'Der Kartendienst ist gerade ausgelastet. Bitte versuche es später erneut.' : 'Die Wegdaten konnten nicht geladen werden. Bitte versuche es später erneut.');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Der Kartendienst hat keine Wegdaten geliefert.');
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const result = await reader.read(); if (result.done) break;
      size += result.value.byteLength;
      if (size > 4_000_000) { await reader.cancel(); throw new Error('Zu viele Kartendaten für diese Wegsuche. Bitte versuche einen weniger dicht bebauten Startbereich.'); }
      chunks.push(result.value);
    }
  } finally { reader.releaseLock(); }
  const all = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.length; }
  let raw: unknown;
  try { raw = JSON.parse(new TextDecoder().decode(all)); } catch { throw new Error('Die Antwort des Kartendiensts ist unvollständig. Bitte versuche es später erneut.'); }
  if (!raw || typeof raw !== 'object' || 'remark' in raw || !('elements' in raw) || !Array.isArray(raw.elements) || !('osm3s' in raw)) throw new Error('Die Antwort des Kartendiensts ist unvollständig.');
  const data = raw as WalkMapData;
  if (data.elements.some(e => !e || typeof e !== 'object' || !['node', 'way'].includes(e.type) || !Number.isFinite(e.id)
    || (e.nodes && (!Array.isArray(e.nodes) || !e.nodes.every(Number.isFinite)))
    || (e.geometry && (!Array.isArray(e.geometry) || e.geometry.some(p => !p || !Number.isFinite(p.lat) || !Number.isFinite(p.lon))))
    || (e.tags && (typeof e.tags !== 'object' || Object.values(e.tags).some(v => typeof v !== 'string'))))) throw new Error('Die Wegdaten sind ungültig.');
  cached = { key, at: Date.now(), data };
  return data;
}
