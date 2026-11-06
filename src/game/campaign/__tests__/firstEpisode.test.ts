import { beforeEach, expect, it } from 'vitest';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../campaignData';
import { initializeCampaignProgress } from '../episodeManager';
import { transitionCampaign } from '../campaignSession';
import type { FirstEpisodeInput } from '../firstEpisode';
import { saveCampaignProgress, loadCampaignProgress, validateCampaignProgress } from '../campaignStorage';
const episode = campaign.episodes[0];
let p = initializeCampaignProgress(campaign.id, 'aeran');
const play = (n: number, input: FirstEpisodeInput) => {
  p = transitionCampaign(p, { type: 'play', episodeId: episode.id, eventId: episode.events[n - 1].id, input });
};
const ep = () => p.episodeProgress[episode.id];
beforeEach(() => {
  localStorage.clear(); p = initializeCampaignProgress(campaign.id, 'aeran');
  p = transitionCampaign(p, { type: 'start', episodeId: episode.id, mode: 'short' });
});
it('blocks simulation and wrong-event inputs, requires correct puzzle answers', () => {
  expect(transitionCampaign(p, { type: 'event', episodeId: episode.id, eventId: episode.events[0].id })).toBe(p);
  const initial = p; play(2, 'trail_dawn'); expect(p).toBe(initial);
  play(1, 'read'); play(2, 'trail_dusk'); play(2, 'trail_help');
  expect(ep().completedEvents).toHaveLength(1); expect(p.totalGoldEarned).toBe(0);
  play(2, 'trail_dawn'); expect(ep().completedEvents).toHaveLength(2);
});
it('saves combat, pauses without damage and restores the exact turn', () => {
  play(1, 'read'); play(2, 'trail_dawn'); play(3, 'attack');
  const state = structuredClone(ep().playerChoices.firstEpisode);
  expect(state).toMatchObject({ health: 4, shadowHealth: 3, turn: 1 });
  p = transitionCampaign(p, { type: 'pause', episodeId: episode.id });
  const paused = p; play(3, 'attack'); expect(p).toBe(paused);
  expect(saveCampaignProgress(p)).toBe(true); p = loadCampaignProgress(campaign.id, 'aeran')!;
  expect(ep().playerChoices.firstEpisode).toEqual(state);
  p = transitionCampaign(p, { type: 'resume', episodeId: episode.id });
  play(3, 'guard'); expect(ep().playerChoices.firstEpisode).toMatchObject({ health: 4, shadowHealth: 2, turn: 2 });
  play(3, 'attack'); expect(ep().completedEvents).toHaveLength(3);
});
it('offers a free retry and help that can win without damage', () => {
  play(1, 'read'); play(2, 'trail_dawn'); play(3, 'attack'); play(3, 'attack');
  expect(ep().playerChoices.firstEpisode.health).toBe(0); expect(ep().completedEvents).toHaveLength(2);
  const defeated = p; play(3, 'attack'); expect(p).toBe(defeated);
  play(3, 'retry'); expect(ep().playerChoices.firstEpisode.health).toBe(5);
  for (let i = 0; i < 5; i++) play(3, 'combat_help');
  expect(ep().completedEvents).toHaveLength(3); expect(ep().playerChoices.firstEpisode.health).toBe(5);
});
it('restores stone pieces, rejects wrong sequence and pays only on completion', () => {
  play(1, 'read'); play(2, 'trail_dawn'); for (let i = 0; i < 5; i++) play(3, 'combat_help');
  play(4, 'stone_tower'); expect(ep().playerChoices.firstEpisode.stoneStep).toBe(0);
  play(4, 'stone_sun'); saveCampaignProgress(p); p = loadCampaignProgress(campaign.id, 'aeran')!;
  expect(ep().playerChoices.firstEpisode.stoneStep).toBe(1);
  play(4, 'stone_path'); expect(p.totalGoldEarned).toBe(0);
  play(4, 'stone_tower'); expect(ep().status).toBe('completed'); expect(p.totalGoldEarned).toBe(20);
  const completed = p; play(4, 'stone_tower'); expect(p).toBe(completed);
});
it('rejects malformed combat state but accepts old saves without event state', () => {
  expect(validateCampaignProgress(p)).toBe(true);
  ep().playerChoices.firstEpisode = { version: 1, health: -4 };
  expect(validateCampaignProgress(p)).toBe(false);
});
it.each(['aeran', 'velar', 'varg', 'ravena', 'saira'])('is completable by %s without spending resources', hero => {
  p = transitionCampaign(initializeCampaignProgress(campaign.id, hero), { type: 'start', episodeId: episode.id, mode: 'long' });
  play(1, 'read'); play(2, 'trail_dawn'); for (let i = 0; i < 5; i++) play(3, 'combat_help');
  play(4, 'stone_sun'); play(4, 'stone_path'); play(4, 'stone_tower');
  expect(ep().status).toBe('completed'); expect(saveCampaignProgress(p)).toBe(true);
});
it('continues past the old tutorial even after defeat, without skipping the next puzzle or duplicating rewards',()=>{
 const initial=p;play(1,'continue_story');expect(p).toBe(initial);
 play(1,'read');play(2,'trail_dawn');play(3,'attack');play(3,'attack');
 expect(ep().playerChoices.firstEpisode.health).toBe(0);
 saveCampaignProgress(p);p=loadCampaignProgress(campaign.id,'aeran')!;
 play(3,'continue_story');expect(ep().completedEvents).toHaveLength(3);expect(p.totalGoldEarned).toBe(0);
 const after=p;play(3,'continue_story');expect(p).toBe(after);
 play(4,'stone_sun');play(4,'stone_path');play(4,'stone_tower');expect(p.totalGoldEarned).toBe(20);
});
