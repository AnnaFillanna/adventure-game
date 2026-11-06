// Independent regression cases from the Copilot review of e382ac9. Only imports/types adapted.
import { beforeEach, expect, it } from 'vitest';
import { planWalk, walkable, type WalkMapData } from './planner';
import { acceptWalkFix, stationReady } from './locationGate';
import { emptyWalk, loadWalk, saveWalk, solveTask, WALK_TASKS } from './progress';

const now = Date.now();
const fix = (i = 0, timestamp = now, lng = 7) => ({ lat: 50 + i * .00045, lng, timestamp, accuracy: 5 });
const map = (): WalkMapData => ({
  osm3s: { timestamp_osm_base: new Date(now).toISOString() },
  elements: [{
    type: 'way', id: 1, nodes: [1, 2, 3, 4, 5, 6, 7],
    geometry: Array.from({ length: 7 }, (_, i) => ({ lat: fix(i).lat, lon: 7 })),
    tags: { highway: 'footway', surface: 'paved' },
  }],
});
beforeEach(() => localStorage.clear());

it('rejects a mapped road touching the middle of a footway at different OSM node IDs', () => {
  const data = map();
  data.elements.push({
    type: 'way', id: 2, nodes: [90, 91],
    geometry: [{ lat: fix(2).lat, lon: 6.999 }, { lat: fix(2).lat, lon: 7 }],
    tags: { highway: 'residential' },
  });
  expect(() => planWalk(data, fix(), 3, now)).toThrow();
});

it('rejects a footway inside a known water polygon without a waterway centerline', () => {
  const data = map();
  data.elements.push({
    type: 'way', id: 2, nodes: [90, 91, 92, 93, 90],
    geometry: [
      { lat: 49.999, lon: 6.999 }, { lat: 50.004, lon: 6.999 },
      { lat: 50.004, lon: 7.001 }, { lat: 49.999, lon: 7.001 },
      { lat: 49.999, lon: 6.999 },
    ],
    tags: { natural: 'water', water: 'lake' },
  });
  expect(() => planWalk(data, fix(), 3, now)).toThrow();
});

it.each([{ foot: 'use_sidepath' }, { access: 'license' }])('rejects a known non-public access value %j', extra => {
  expect(walkable({ highway: 'footway', surface: 'paved', ...extra } as unknown as Record<string, string>)).toBe(false);
});

it('does not reward movement on a topologically disconnected parallel way', () => {
  const data = map();
  data.elements.push({
    ...data.elements[0], id: 2, nodes: [11, 12, 13, 14, 15, 16, 17],
    geometry: Array.from({ length: 7 }, (_, i) => ({ lat: fix(i).lat, lon: 7.0001 })),
  });
  const plan = planWalk(data, fix(), 3, now);
  let sample = acceptWalkFix(plan, null, fix(0, now, 7.0001), now);
  let progress = emptyWalk();
  let time = now;
  for (let i = 1; i <= 6; i++) {
    time += 20000;
    sample = acceptWalkFix(plan, sample, fix(i, time, 7.0001), time);
    if (i % 2 === 0) {
      time += 6000;
      sample = acceptWalkFix(plan, sample, fix(i, time, 7.0001), time);
      const task = WALK_TASKS[progress.completed.length];
      if (task && stationReady(sample, plan.stations[progress.completed.length], time)) {
        progress = solveTask(progress, task.id, task.correct);
      }
    }
  }
  expect(progress.gold).toBe(0);
});

it('strips non-schema fields instead of persisting coordinates in a valid progress envelope', () => {
  const value = { ...emptyWalk(), latitude: 50, longitude: 7 };
  expect(saveWalk('saira', value)).toBe(true);
  expect(localStorage.getItem('adventure_game_gps_walk_v1_saira')).not.toContain('latitude');
});

it('rejects a saved progress object with additional unrecognized coordinate data', () => {
  const key = 'adventure_game_gps_walk_v1_saira';
  const raw = JSON.stringify({ ...emptyWalk(), coordinates: { lat: 50, lng: 7 } });
  localStorage.setItem(key, raw);
  expect(loadWalk('saira')).toBeNull();
  expect(localStorage.getItem(key)).toBe(raw);
});

it('rejects overlapping road and footway geometry even if the nodes differ', () => {
  const data = map();
  data.elements.push({
    type: 'way', id: 2, nodes: [90, 91],
    geometry: [{ lat: fix(1).lat, lon: 7 }, { lat: fix(3).lat, lon: 7 }],
    tags: { highway: 'residential' },
  });
  expect(() => planWalk(data, fix(), 3, now)).toThrow();
});

it('preserves corrupt and future-version saves verbatim', () => {
  const key = 'adventure_game_gps_walk_v1_saira';
  for (const raw of ['{broken', '{"version":2,"completed":["message"]}']) {
    localStorage.setItem(key, raw);
    expect(loadWalk('saira')).toBeNull();
    expect(saveWalk('saira', emptyWalk())).toBe(false);
    expect(localStorage.getItem(key)).toBe(raw);
  }
});

it('keeps only remaining tasks after moving the planning origin', () => {
  const progress = solveTask(emptyWalk(), 'message', 0);
  expect(saveWalk('saira', progress)).toBe(true);
  const data = map();
  data.elements[0].geometry!.forEach(p => { p.lon += .01; });
  const plan = planWalk(data, fix(0, now, 7.01), 3 - loadWalk('saira')!.completed.length, now);
  expect(plan.stations).toHaveLength(2);
  expect(WALK_TASKS.slice(loadWalk('saira')!.completed.length).map(t => t.id)).toEqual(['trail', 'sign']);
});

it('rejects a direct GPS jump to a station and expired sample readiness', () => {
  const plan = planWalk(map(), fix(), 3, now);
  const initial = acceptWalkFix(plan, null, fix(), now);
  expect(acceptWalkFix(plan, initial, fix(2, now + 1000), now + 1000)).toBeNull();
  expect(stationReady(initial, plan.stations[0], now + 16000)).toBe(false);
});
