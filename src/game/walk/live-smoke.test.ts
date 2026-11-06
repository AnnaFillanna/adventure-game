/// <reference types="node" />
import {readFileSync} from 'node:fs';
import {it,expect} from 'vitest';
import {planWalk,walkable,type WalkMapData} from './planner';
it.skipIf(!process.env.WALK_MAP_FILE)('inspects real Overpass public pedestrian data',()=>{
 const data=JSON.parse(readFileSync(process.env.WALK_MAP_FILE!,'utf8')) as WalkMapData;
 let successes=0, eligible=0;
 for(const way of data.elements){
  if(way.type!=='way'||!walkable(way.tags??{})||!way.geometry)continue;
  eligible++;
  for(const point of way.geometry.slice(0,1)){
   try{const plan=planWalk(data,{lat:point.lat,lng:point.lon,accuracy:5,timestamp:Date.now()});successes++;console.log(JSON.stringify({way:way.id,meters:Math.round(plan.oneWayMeters*2),stations:plan.stations.length}));}catch{}
  }
 }
 console.log({eligible,successes});expect(successes).toBeGreaterThan(0);
},30000);
