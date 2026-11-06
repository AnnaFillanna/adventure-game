import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import App from '../App';
import { preferencesManager } from '../game/utils/storage';
import { useGameStore } from '../game/state/gameStore';
import { loadWalkMap } from '../game/walk/mapProvider';
import { loadWalk } from '../game/walk/progress';
vi.mock('../game/walk/mapProvider', () => ({loadWalkMap:vi.fn()}));
vi.mock('../components/Map/LocationMap', () => ({LocationMap: ({onMapReady,onMapUnavailable}: {onMapReady:()=>void;onMapUnavailable:()=>void}) => <div><button onClick={onMapReady}>Test: Karte geladen</button><button onClick={onMapUnavailable}>Test: Kartenfehler</button></div>}));
let container: HTMLDivElement, root: Root;
let getCurrentPosition: ReturnType<typeof vi.fn>, watchPosition: ReturnType<typeof vi.fn>, clearWatch: ReturnType<typeof vi.fn>;
const browserFix=(i=0,accuracy=5)=>({coords:{latitude:50+i*.00045,longitude:7,accuracy},timestamp:Date.now()});
beforeEach(()=>{
 (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true; vi.useFakeTimers(); localStorage.clear();useGameStore.getState().resetGame();
 preferencesManager.setPreference('campaignHero','saira'); window.history.replaceState({},'', '/hub/walk');
 getCurrentPosition=vi.fn(success=>success(browserFix()));watchPosition=vi.fn(()=>19);clearWatch=vi.fn();
 Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition,watchPosition,clearWatch}});
 vi.mocked(loadWalkMap).mockResolvedValue({osm3s:{timestamp_osm_base:new Date().toISOString()},elements:[{type:'way',id:1,nodes:[1,2,3,4,5,6,7],geometry:Array.from({length:7},(_,i)=>({lat:50+i*.00045,lon:7})),tags:{highway:'footway',surface:'paved'}}]});
 container=document.createElement('div');document.body.append(container);root=createRoot(container);
});
afterEach(async()=>{await act(async()=>root.unmount()); container.remove();vi.useRealTimers();vi.restoreAllMocks();});
async function click(text:string){const b=[...container.querySelectorAll('button')].find(x=>x.textContent===text);expect(b,text).toBeDefined();await act(async()=>b!.click());}
async function prepare(){
 await act(async()=>root.render(<App/>)); await click('Standort und Wege suchen');
 expect(container.textContent).toContain('Dein Wegvorschlag');
 const start=()=>[...container.querySelectorAll('button')].find(b=>b.textContent==='Test-Spaziergang starten')!;
 expect(start().disabled).toBe(true);await click('Weg auf der Karte ansehen');await click('Test: Karte geladen');
 expect(start().disabled).toBe(true);await act(async()=>container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click());
 expect(start().disabled).toBe(false);await click('Test-Spaziergang starten');
}
async function emit(i:number,seconds=20,accuracy=5){await act(async()=>{vi.advanceTimersByTime(seconds*1000);watchPosition.mock.calls.at(-1)![0](browserFix(i,accuracy));});}
it('plays three GPS tasks only after movement and saves reward once across reload',async()=>{
 await prepare();await emit(0,0);
 for(const [i,answer] of [[2,'Die Sonne'],[4,'Die Spur zum Licht'],[6,'Alle Zeichen zusammenlegen']] as const){
   await emit(i-1);await emit(i);expect(container.textContent).not.toContain('Ich stehe an einem geeigneten Ort');
   await emit(i,6);await click('Ich stehe an einem geeigneten Ort');await click(answer);
 }
 expect(container.textContent).toContain('Alle drei Zeichen gefunden');expect(loadWalk('saira')?.gold).toBe(20);expect(clearWatch).toHaveBeenCalledWith(19);
 await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));
 expect(container.textContent).toContain('Alle drei Zeichen gefunden');expect(loadWalk('saira')?.gold).toBe(20);
});
it('locks the task immediately on inaccurate GPS and pauses when signal disappears',async()=>{
 await prepare();await emit(0,0);await emit(1);await emit(2);await emit(2,6);await click('Ich stehe an einem geeigneten Ort');
 await emit(2,1,200);expect(container.textContent).not.toContain('Welches Zeichen meint der Magier?');expect(loadWalk('saira')?.completed).toEqual([]);
 await act(async()=>vi.advanceTimersByTime(21000));expect(container.textContent).toContain('Aufgaben sind pausiert');expect(clearWatch).toHaveBeenCalledWith(19);
});
it('allows retry after permission denial without proceeding without GPS',async()=>{
 getCurrentPosition.mockImplementation((_s,e)=>e({code:1,PERMISSION_DENIED:1,POSITION_UNAVAILABLE:2,TIMEOUT:3,message:'denied'}));
 await act(async()=>root.render(<App/>));await click('Standort und Wege suchen');expect(container.textContent).toContain('nicht freigegeben');expect(watchPosition).not.toHaveBeenCalled();
 getCurrentPosition.mockImplementation(s=>s(browserFix()));await click('Standort und Wege suchen');expect(container.textContent).toContain('Dein Wegvorschlag');
});
it('fails closed on a map error, and cancels GPS when leaving',async()=>{
 await prepare();await click('Test: Kartenfehler');expect(container.textContent).toContain('Karte ist ausgefallen');expect(clearWatch).toHaveBeenCalledWith(19);
 await click('Zur Abenteuerübersicht');expect(window.location.pathname).toBe('/hub');
});
it('resumes only remaining tasks after a saved first task and a reload',async()=>{
 await prepare();await emit(0,0);await emit(1);await emit(2);await emit(2,6);await click('Ich stehe an einem geeigneten Ort');await click('Die Sonne');
 await click('Spaziergang pausieren');expect(loadWalk('saira')?.completed).toEqual(['message']);
 await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));
 await click('Verbleibende Aufgaben hier suchen');expect(container.textContent).toContain('1 von 3 Aufgaben gespeichert');
 await click('Weg auf der Karte ansehen');await click('Test: Karte geladen');await act(async()=>container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click());await click('Test-Spaziergang starten');
 expect(container.textContent).toContain('Die verborgene Spur');expect(container.textContent).not.toContain('Die Botschaft im Licht');
});
it('recovers from a browser that never answers and ignores a late GPS callback',async()=>{
 getCurrentPosition.mockImplementation(()=>{});await act(async()=>root.render(<App/>));await click('Standort und Wege suchen');
 const late=getCurrentPosition.mock.calls[0][0];await act(async()=>vi.advanceTimersByTime(16000));expect(container.textContent).toContain('noch keinen Standort geliefert');
 await act(async()=>late(browserFix()));expect(container.textContent).not.toContain('Dein Wegvorschlag');
});
