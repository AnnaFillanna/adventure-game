import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import App from '../App';
import { useGameStore } from '../game/state/gameStore';
import { preferencesManager } from '../game/utils/storage';
import { loadCampaignProgress } from '../game/campaign/campaignStorage';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../game/campaign/campaignData';

let container: HTMLDivElement;
let root: Root;
let getCurrentPosition: ReturnType<typeof vi.fn>;
let watchPosition: ReturnType<typeof vi.fn>;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  useGameStore.getState().resetGame();
  window.history.replaceState({}, '', '/');
  getCurrentPosition = vi.fn(); watchPosition = vi.fn();
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition, watchPosition, clearWatch: vi.fn() } });
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.restoreAllMocks(); });
async function render() { await act(async () => root.render(<App />)); }
async function click(label: string) {
  const button = [...container.querySelectorAll('button')].find(b => b.textContent?.trim() === label);
  expect(button, label).toBeDefined();
  await act(async () => button!.click());
}
async function reloadAtStart() {
  await act(async () => root.unmount());
  useGameStore.getState().resetGame();
  window.history.replaceState({}, '', '/');
  root = createRoot(container); await render();
}
it('guides a first visit through selection, GPS, task, pause and persisted resume', async () => {
  await render();
  await click('▶Held wählen & Abenteuer öffnen');
  const cards = [...container.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')];
  expect(cards).toHaveLength(5);
  expect(container.textContent).not.toContain('Select a hero');
  expect([...container.querySelectorAll('button')].find(b => b.textContent === 'Held auswählen')?.disabled).toBe(true);
  await act(async () => cards.find(b => b.title === 'Saira')!.click());
  expect(container.querySelector('button[aria-pressed="true"]')?.getAttribute('title')).toBe('Saira');
  await click('Held auswählen');
  expect(window.location.pathname).toBe('/hub');
  expect(container.textContent).toContain('Dein Held: Saira');
  expect(container.textContent).toContain('Sichere die erste Spur');
  await click('Standort prüfen');
  expect(getCurrentPosition).not.toHaveBeenCalled();
  getCurrentPosition.mockImplementation(success => success({ coords: { latitude: 48, longitude: 11, accuracy: 10 }, timestamp: Date.now() }));
  await click('Standort freigeben');
  expect(getCurrentPosition).toHaveBeenCalledTimes(1);
  expect(watchPosition).not.toHaveBeenCalled();
  expect(container.textContent).toContain('kein geprüfter Spazierweg');
  expect(container.textContent).not.toContain('Der alte Baum');
  await click('Zur Abenteuerübersicht');
  await click('Erste Aufgabe öffnen');
  await click('Abenteuer beginnen');
  await click('Botschaft gelesen – weiter');
  await click('Pause & Übersicht');
  expect(window.location.pathname).toBe('/hub');
  expect(container.textContent).toContain('1 von 4 Aufgaben');
  const saved = loadCampaignProgress(campaign.id, 'saira')!;
  expect(saved.episodeProgress[campaign.episodes[0].id].status).toBe('paused');
  await reloadAtStart();
  expect(window.location.pathname).toBe('/hub');
  await click('Geschichte fortsetzen');
  await click('Fortsetzen');
  expect(container.textContent).toContain('Fußspuren virtuell untersuchen');
  expect(container.textContent).not.toContain('DebugCampaign');
});
it.each([
  [1, 'nicht freigegeben'], [2, 'gerade nicht verfügbar'], [3, 'zu lange gedauert'],
])('explains GPS error %s in German and allows return without losing the hero', async (code, expected) => {
  preferencesManager.setPreference('campaignHero', 'aeran');
  window.history.replaceState({}, '', '/hub/outdoor');
  getCurrentPosition.mockImplementation((_success, error) => error({ code, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3, message: 'raw browser error' }));
  await render(); await click('Standort freigeben');
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(expected);
  expect(container.textContent).not.toContain('raw browser error');
  await click('Zur Abenteuerübersicht');
  expect(container.textContent).toContain('Dein Held: Aeran');
});
it.each(['/outdoor', '/game/outdoor'])('redirects the old GPS link %s to the real entry', async path => {
  window.history.replaceState({}, '', path);
  await render();
  expect(window.location.pathname).toBe('/hub/outdoor');
  expect(container.textContent).toContain('Standort freigeben');
});
it('does not unlock targets from inaccurate GPS or a stored demo preference', async () => {
  localStorage.setItem('__ADVENTURE_GAME_DEMO_MODE__', 'true');
  window.history.replaceState({}, '', '/hub/outdoor');
  getCurrentPosition.mockImplementation(success => success({ coords: { latitude: 52.52, longitude: 13.3654, accuracy: 500 }, timestamp: Date.now() }));
  await render(); await click('Standort freigeben');
  expect(container.textContent).toContain('zu ungenau');
  expect(watchPosition).not.toHaveBeenCalled();
  expect(container.textContent).not.toContain('Gold');
});
