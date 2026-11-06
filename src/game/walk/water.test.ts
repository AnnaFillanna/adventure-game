import {expect,it} from 'vitest';
import {waterRings,segmentInWater,nearWater} from './water';
import {segmentsMeet} from './geometry';
import {planWalk,type MapElement} from './planner';
const square=[{lat:49.999,lon:6.999},{lat:50.004,lon:6.999},{lat:50.004,lon:7.001},{lat:49.999,lon:7.001},{lat:49.999,lon:6.999}];
const lake:MapElement={type:'way',id:2,tags:{natural:'water'},geometry:square};
const relation:MapElement={type:'relation',id:3,tags:{type:'multipolygon',natural:'water'},members:[
 {type:'way',ref:20,role:'outer',geometry:square.slice(0,3)},
 {type:'way',ref:21,role:'outer',geometry:[...square.slice(2)].reverse()}
]};
it('assembles reversed outer members and excludes enclosed, crossing and shore segments',()=>{
 const rings=waterRings([relation]);expect(rings).toHaveLength(1);
 expect(segmentInWater({lat:50,lng:7},{lat:50.001,lng:7},rings)).toBe(true);
 expect(segmentInWater({lat:50,lng:6.998},{lat:50,lng:7.002},rings)).toBe(true);
 expect(nearWater({lat:50,lng:7.0011},rings)).toBe(true);
 expect(segmentInWater({lat:50,lng:7.01},{lat:50.001,lng:7.01},rings)).toBe(false);
});
it.each([
 {...relation,members:relation.members!.slice(0,1)},
 {...relation,members:[{type:'way' as const,ref:21,role:'outer'}]},
 {...lake,geometry:square.slice(0,4)},
 {...lake,geometry:[square[0],square[2],square[1],square[3],square[0]]},
 {...relation,members:[{type:'relation' as const,ref:44,role:'outer'}]}
])('rejects incomplete or unsupported water geometry',element=>{expect(()=>waterRings([element])).toThrow();});
it('does not use inner islands as an automatic permission to enter the area',()=>{
 const water={...relation,members:[...relation.members!,{type:'way' as const,ref:40,role:'inner',geometry:[{lat:50,lon:6.9995},{lat:50.002,lon:6.9995},{lat:50.002,lon:7.0005},{lat:50,lon:7.0005},{lat:50,lon:6.9995}]}]};
 expect(segmentInWater({lat:50.001,lng:7},{lat:50.0015,lng:7},waterRings([water]))).toBe(true);
});
it('rejects planning in a multipart water polygon',()=>{
 const now=Date.now();expect(()=>planWalk({osm3s:{timestamp_osm_base:new Date(now).toISOString()},elements:[relation,{type:'way',id:1,nodes:[1,2,3,4,5,6,7],geometry:Array.from({length:7},(_,i)=>({lat:50+i*.00045,lon:7})),tags:{highway:'footway',surface:'paved'}}]}, {lat:50,lng:7,accuracy:5,timestamp:now})).toThrow();
});
it('detects endpoint contact, overlap and sub-meter rounding but preserves separated segments',()=>{
 const a={lat:50,lng:7},b={lat:50.001,lng:7};
 expect(segmentsMeet(a,b,{lat:50.0005,lng:6.999},{lat:50.0005,lng:7})).toBe(true);
 expect(segmentsMeet(a,b,{lat:50.0002,lng:7},{lat:50.0008,lng:7})).toBe(true);
 expect(segmentsMeet(a,b,{lat:50.0005,lng:6.999},{lat:50.0005,lng:6.999999})).toBe(true);
 expect(segmentsMeet(a,b,{lat:50,lng:7.0001},{lat:50.001,lng:7.0001})).toBe(false);
});
