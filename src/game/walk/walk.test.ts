import { beforeEach, expect, it } from 'vitest';
import { planWalk, walkable, type WalkMapData } from './planner';
import { acceptWalkFix, stationReady } from './locationGate';
import { emptyWalk, loadWalk, saveWalk, solveTask, WALK_TASKS } from './progress';
const now = Date.now();
const fix = (i = 0, timestamp = now, accuracy = 5) => ({ lat: 50 + i * .00045, lng: 7, timestamp, accuracy });
const data = (): WalkMapData => ({ osm3s: { timestamp_osm_base: new Date(now).toISOString() }, elements: [{ type: 'way', id: 1, nodes: [1,2,3,4,5,6,7], geometry: Array.from({length:7}, (_,i) => ({ lat: fix(i).lat, lon: 7 })), tags: { highway: 'footway', surface: 'paved' } }] });
beforeEach(() => localStorage.clear());
it('plans connected out-and-back walking stations without claiming approval', () => {
 const plan = planWalk(data(), fix(), 3, now);
 expect(plan.stations).toHaveLength(3); expect(plan.review).toBe('unreviewed');
 expect(plan.oneWayMeters * 2).toBeLessThanOrEqual(1000); expect(plan.path[0]).toEqual({lat:50,lng:7});
});
it.each([{access:'private'}, {foot:'no'}, {bridge:'yes'}, {footway:'crossing'}, {surface:'unknown'}, {highway:'steps'}, {'access:conditional':'yes @ Mo-Fr'}])('rejects restricted or insufficiently mapped ways %j', extra => {
 expect(walkable({highway:'footway',surface:'paved',...extra} as unknown as Record<string,string>)).toBe(false);
});
it('rejects distant starts, stale fixes and stale map data', () => {
 expect(() => planWalk(data(), {...fix(), lng:7.01},3,now)).toThrow();
 expect(() => planWalk(data(), fix(0, now-16000),3,now)).toThrow();
 const old=data(); old.osm3s.timestamp_osm_base=new Date(now-49*3600000).toISOString();
 expect(() => planWalk(old,fix(),3,now)).toThrow();
});
it('does not join disconnected ways or cross a mapped road', () => {
 const disconnected=data(); disconnected.elements[0].nodes=[1,2]; disconnected.elements[0].geometry=disconnected.elements[0].geometry!.slice(0,2);
 disconnected.elements.push({...data().elements[0], id:2, nodes:[11,12,13,14,15,16,17]});
 // Separate topology at identical coordinates must not produce a connected route.
 expect(() => planWalk(disconnected,fix(),3,now)).toThrow();
 const crossing=data(); crossing.elements.push({type:'way',id:2,nodes:[90,91],geometry:[{lat:50.0006,lon:6.999},{lat:50.0006,lon:7.001}],tags:{highway:'residential'}});
 expect(() => planWalk(crossing,fix(),3,now)).toThrow();
});
it('requires arrival, fresh precise fixes and a halt; rejects teleporting', () => {
 const plan=planWalk(data(),fix(),3,now);
 expect(acceptWalkFix(plan,null,fix(4),now)).toBeNull();
 let sample=acceptWalkFix(plan,null,fix(),now)!;
 expect(acceptWalkFix(plan,sample,fix(4,now+1000),now+1000)).toBeNull();
 expect(acceptWalkFix(plan,sample,fix(0,now+1000,100),now+1000)).toBeNull();
 for(let i=1;i<=2;i++) sample=acceptWalkFix(plan,sample,fix(i,now+i*20000),now+i*20000)!;
 expect(sample).not.toBeNull();
 expect(stationReady(sample,plan.stations[0],now+40000)).toBe(false);
 sample=acceptWalkFix(plan,sample,fix(2,now+46000),now+46000)!;
 expect(stationReady(sample,plan.stations[0],now+46000)).toBe(true);
 expect(stationReady(sample,plan.stations[0],now+62000)).toBe(false);
});
it('persists only ordered task progress and awards once, without coordinates', () => {
 let p=emptyWalk(); expect(solveTask(p,'sign',2)).toBe(p);
 for(const task of WALK_TASKS) {p=solveTask(p,task.id,task.correct);expect(saveWalk('saira',p)).toBe(true);}
 expect(loadWalk('saira')).toEqual({...p,gold:20,rewarded:true});
 expect(solveTask(p,'sign',2)).toBe(p); expect(saveWalk('saira',emptyWalk())).toBe(false);
 expect(localStorage.getItem('adventure_game_gps_walk_v1_saira')).not.toMatch(/lat|lng|timestamp/);
 localStorage.setItem('adventure_game_gps_walk_v1_aeran','{"version":2}');
 expect(saveWalk('aeran',emptyWalk())).toBe(false);
});
it('rejects ambiguous fixes on the chosen line too, but accepts a well distinguished path', () => {
 const map=data();map.elements.push({...map.elements[0],id:2,nodes:[11,12,13,14,15,16,17],geometry:map.elements[0].geometry!.map(p=>({...p,lon:7.0001}))});
 const plan=planWalk(map,fix(),3,now);
 expect(acceptWalkFix(plan,null,fix(),now)).toBeNull();
 expect(acceptWalkFix(plan,null,fix(0,now,1),now)).not.toBeNull();
});
it('treats unknown access and conditional restrictions as unavailable',()=>{
 for (const value of ['license','use_sidepath','unknown','yes;private','']) expect(walkable({highway:'footway',surface:'paved',access:value})).toBe(false);
 for (const value of ['yes','designated','permissive']) expect(walkable({highway:'footway',surface:'paved',access:value,foot:'yes'})).toBe(true);
});
it('accepts a shared junction itself but not travel down its unselected branch',()=>{
 const map=data(); map.elements.push({type:'way',id:2,nodes:[1,90,91],geometry:[{lat:50,lon:7},{lat:50,lon:7.00045},{lat:50,lon:7.0009}],tags:{highway:'footway',surface:'paved'}});
 const plan=planWalk(map,fix(),3,now); expect(acceptWalkFix(plan,null,fix(),now)).not.toBeNull();
 expect(acceptWalkFix(plan,null,{...fix(),lng:7.0001},now)).toBeNull();
});
