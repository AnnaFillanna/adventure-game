import {beforeEach,afterEach,it,expect,vi} from 'vitest';
beforeEach(()=>{vi.resetModules();});
afterEach(()=>vi.unstubAllGlobals());
const data={osm3s:{timestamp_osm_base:new Date().toISOString()},elements:[]};
const fix={lat:50.43912345,lng:7.40298765};
it('sends a rounded bounded request only once and caches the same area',async()=>{
 const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify(data)));vi.stubGlobal('fetch',fetcher);
 const {loadWalkMap}=await import('./mapProvider');const signal=new AbortController().signal;
 expect(await loadWalkMap(fix,signal)).toEqual(data);await loadWalkMap(fix,signal);expect(fetcher).toHaveBeenCalledTimes(1);
 const args=fetcher.mock.calls[0][1];expect(args.method).toBe('POST');expect(args.signal).toBe(signal);
 expect(args.body.get('data')).toContain('around:1100,50.439,7.403');expect(args.body.get('data')).not.toContain('50.43912345');
 expect(args.body.get('data')).toContain('wr(around:1100,50.439,7.403)["natural"="water"]');
 expect(args.body.get('data')).toContain('rel(pivot.containing)');
 expect(args.body.get('data')).toContain('out body geom;');
 await expect(loadWalkMap({lat:50.5,lng:7.5},signal)).rejects.toThrow('Minute');
});
it.each([429,503])('reports service unavailability %i without automatic retries',async status=>{
 const fetcher=vi.fn().mockResolvedValue(new Response('',{status}));vi.stubGlobal('fetch',fetcher);
 const {loadWalkMap}=await import('./mapProvider');await expect(loadWalkMap(fix,new AbortController().signal)).rejects.toThrow('ausgelastet');expect(fetcher).toHaveBeenCalledTimes(1);
});
it.each(['{"remark":"timeout","elements":[],"osm3s":{}}','not json',JSON.stringify({...data,elements:[{type:'way',id:1,geometry:[{lat:'bad',lon:7}]}]})])('rejects partial or malformed data',async body=>{
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(body)));const {loadWalkMap}=await import('./mapProvider');await expect(loadWalkMap(fix,new AbortController().signal)).rejects.toThrow();
});
it('accepts water relation geometry and rejects malformed members',async()=>{
 const relation={type:'relation',id:42,tags:{type:'multipolygon',natural:'water'},members:[{type:'way',ref:4,role:'outer',geometry:[{lat:50,lon:7},{lat:50.001,lon:7}]}]};
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({...data,elements:[relation]}))));
 const {loadWalkMap}=await import('./mapProvider');expect((await loadWalkMap(fix,new AbortController().signal)).elements[0]).toEqual(relation);
 vi.resetModules();vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({...data,elements:[{...relation,members:[{type:'way',ref:4,role:'outer',geometry:[null]}]}]}))));
 const again=await import('./mapProvider');await expect(again.loadWalkMap(fix,new AbortController().signal)).rejects.toThrow('ungültig');
});
