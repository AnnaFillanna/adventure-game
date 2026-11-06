import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import GameWorld from '../../pages/GameWorld';
import { useGameStore } from '../../game/state/gameStore';
import { preferencesManager } from '../../game/utils/storage';
import { loadCampaignProgress } from '../../game/campaign/campaignStorage';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../../game/campaign/campaignData';

let container: HTMLDivElement; let root: Root;
beforeEach(async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear(); useGameStore.getState().resetGame(); useGameStore.getState().selectHero('aeran');
  preferencesManager.setPreference('campaignHero', 'aeran');
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
  await act(async () => root.render(<MemoryRouter><GameWorld /></MemoryRouter>));
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.restoreAllMocks(); });
async function click(label: string) {
  const button = [...container.querySelectorAll('button')].find(b => b.textContent === label);
  expect(button, label).toBeDefined();
  await act(async () => button!.click());
}
it('plays, pauses, reloads and completes an episode through the actual game screen', async () => {
  await click('Abenteuer beginnen');
  await click('Botschaft gelesen – weiter');
  await click('Pause & Übersicht');
  expect(loadCampaignProgress(campaign.id, 'aeran')!.episodeProgress[campaign.episodes[0].id].status).toBe('paused');
  await act(async () => root.unmount());
  useGameStore.getState().resetGame(); // A page reload loses the in-memory hero selection.
  root = createRoot(container);
  await act(async () => root.render(<MemoryRouter><GameWorld /></MemoryRouter>));
  expect(container.textContent).toContain('Abenteuer pausiert');
  await click('Fortsetzen');
  await click('Zur aufgehenden Sonne');
  await click('Weiter');
  await click('Sonne'); await click('Pfad'); await click('Turm');
  const saved = loadCampaignProgress(campaign.id, 'aeran')!;
  expect(saved.episodeProgress[campaign.episodes[0].id].status).toBe('completed');
  expect(saved.totalXpEarned).toBe(100); expect(saved.totalGoldEarned).toBe(20);
  expect(saved.episodeProgress[campaign.episodes[1].id].status).toBe('unlocked');
  // Episode 2 should auto-load on page reload
  await act(async () => root.unmount());
  useGameStore.getState().resetGame();
  root = createRoot(container);
  await act(async () => root.render(<MemoryRouter><GameWorld /></MemoryRouter>));
  expect(container.querySelector('article h2')?.textContent).toBe('Die stumme Glocke');
  await click('Abenteuer beginnen'); await click('Der Hüterin helfen');
  await click('Wurzel'); await click('Welle'); await click('Stern');
  await click('Ruhig zuhören'); await click('An seinen Namen Lior erinnern'); await click('Das Glockenlied summen');
  await click('Glockenerinnerung öffnen'); await click('Glockensiegel im Tagebuch bewahren');
  expect(loadCampaignProgress(campaign.id, 'aeran')!.totalGoldEarned).toBe(40);
  // Episode 3 should auto-load on page reload
  await act(async () => root.unmount());
  useGameStore.getState().resetGame();
  root = createRoot(container);
  await act(async () => root.render(<MemoryRouter><GameWorld /></MemoryRouter>));
  expect(container.querySelector('article h2')?.textContent).toBe('Die gestohlene Laterne');
});
it('does not advance the UI or rewards on write failure, and retries once safely', async () => {
  await click('Abenteuer beginnen');
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('full'); });
  vi.spyOn(console, 'error').mockImplementation(() => {});
  await click('Botschaft gelesen – weiter');
  expect(container.querySelector('[role="alert"]')?.textContent).toContain('Speichern fehlgeschlagen');
  expect(loadCampaignProgress(campaign.id, 'aeran')!.episodeProgress[campaign.episodes[0].id].completedEvents).toHaveLength(0);
  spy.mockRestore(); await click('Botschaft gelesen – weiter');
  expect(loadCampaignProgress(campaign.id, 'aeran')!.episodeProgress[campaign.episodes[0].id].completedEvents).toHaveLength(1);
});

it('shows a load error without replacing a damaged campaign save', async () => {
  await act(async () => root.unmount());
  localStorage.setItem('adventure_game_campaign_progress', '{broken');
  root = createRoot(container);
  await act(async () => root.render(<MemoryRouter><GameWorld /></MemoryRouter>));
  expect(container.textContent).toContain('Spielstand nicht verfügbar');
  expect(localStorage.getItem('adventure_game_campaign_progress')).toBe('{broken');
});

it('plays episode 3 completely with all four events', async () => {
  await click('Abenteuer beginnen');
  // Episode 1
  await click('Botschaft gelesen – weiter'); await click('Zur aufgehenden Sonne');
  await click('Weiter');
  await click('Sonne'); await click('Pfad'); await click('Turm');
  // Episode 2
  await act(async () => root.unmount());
  useGameStore.getState().resetGame();
  root = createRoot(container);
  await act(async () => root.render(<MemoryRouter><GameWorld /></MemoryRouter>));
  expect(container.querySelector('article h2')?.textContent).toBe('Die stumme Glocke');
  await click('Abenteuer beginnen'); await click('Der Hüterin helfen');
  await click('Wurzel'); await click('Welle'); await click('Stern');
  await click('Ruhig zuhören'); await click('An seinen Namen Lior erinnern'); await click('Das Glockenlied summen');
  await click('Glockenerinnerung öffnen'); await click('Glockensiegel im Tagebuch bewahren');
  expect(loadCampaignProgress(campaign.id, 'aeran')!.totalGoldEarned).toBe(40);
  // Episode 3
  await act(async () => root.unmount());
  useGameStore.getState().resetGame();
  root = createRoot(container);
  await act(async () => root.render(<MemoryRouter><GameWorld /></MemoryRouter>));
  expect(container.querySelector('article h2')?.textContent).toBe('Die gestohlene Laterne');
  await click('Abenteuer beginnen');
  // Event 1: Merchant dialog
  expect(container.textContent).toContain('Händler befragen');
  await click('Weiter hören'); await click('Weiter hören');
  // Event 2: Trace puzzle
  expect(container.textContent).toContain('Vorratsspuren vergleichen');
  await click('Morgenquellen folgen'); await click('Morgenquellen folgen');
  // Event 3: Bandit encounter - Discovery-based dialogue
  expect(container.textContent).toContain('Das Geheimnis der Banditen');
  await click('👂 Zuhören');
  await click('🔍 Fragen stellen');
  await click('🤝 Ich kann euch helfen');
  // Event 4: Light lantern
  expect(container.textContent).toContain('Laterne entzünden');
  await click('Laterne entzünden');
  const saved = loadCampaignProgress(campaign.id, 'aeran')!;
  expect(saved.episodeProgress[campaign.episodes[0].id].status).toBe('completed');
  expect(saved.episodeProgress[campaign.episodes[1].id].status).toBe('completed');
  expect(saved.episodeProgress[campaign.episodes[2].id].status).toBe('completed');
  expect(saved.totalXpEarned).toBe(300); // Episodes 1, 2 & 3 completed
  expect(saved.totalGoldEarned).toBe(60);
  expect(saved.episodeProgress[campaign.episodes[3].id].status).toBe('unlocked');
});
