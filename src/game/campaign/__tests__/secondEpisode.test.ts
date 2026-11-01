import { beforeEach, it, expect } from 'vitest';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../campaignData';
import { initializeCampaignProgress } from '../episodeManager';
import { transitionCampaign } from '../campaignSession';
import { type SecondEpisodeInput } from '../secondEpisode';
import { saveCampaignProgress, loadCampaignProgress, validateCampaignProgress } from '../campaignStorage';
const first = campaign.episodes[0]; const second = campaign.episodes[1];
let p = initializeCampaignProgress(campaign.id, 'saira');
const ep = () => p.episodeProgress[second.id];
const play = (event: number, input: SecondEpisodeInput) => {
  p = transitionCampaign(p, { type: 'playSecond', episodeId: second.id, eventId: second.events[event - 1].id, input });
};
beforeEach(() => {
  localStorage.clear(); p = initializeCampaignProgress(campaign.id, 'saira');
  p.episodeProgress[first.id] = { ...p.episodeProgress[first.id], status: 'completed', completedEvents: first.events.map(e => e.id), rewardsGranted: { xp: true, gold: true, itemIds: [] } };
  p.episodeProgress[second.id].status = 'unlocked'; p.totalXpEarned = 100; p.totalGoldEarned = 20;
  p = transitionCampaign(p, { type: 'start', episodeId: second.id, mode: 'short' });
});
it('rejects event simulation, foreign events and premature memory confirmation', () => {
  expect(transitionCampaign(p, { type: 'event', episodeId: second.id, eventId: second.events[0].id })).toBe(p);
  const before = p; play(4, 'keep_memory'); expect(p).toBe(before);
  play(1, 'meet'); play(2, 'root'); play(2, 'wave'); play(2, 'star'); play(3, 'listen'); play(3, 'name'); play(3, 'hum');
  const unread = p; play(4, 'keep_memory'); expect(p).toBe(unread);
});
it('recovers a partial bell puzzle through save/load and pause', () => {
  play(1, 'meet'); play(2, 'star'); expect(ep().playerChoices.secondEpisode.bellStep).toBe(0);
  play(2, 'root'); expect(saveCampaignProgress(p)).toBe(true);
  p = loadCampaignProgress(campaign.id, 'saira')!;
  p = transitionCampaign(p, { type: 'pause', episodeId: second.id });
  const paused = p; play(2, 'wave'); expect(p).toBe(paused);
  p = transitionCampaign(p, { type: 'resume', episodeId: second.id });
  play(2, 'wave'); play(2, 'star'); expect(ep().completedEvents).toHaveLength(2);
});
it('keeps peaceful dialogue progress on mistakes and restores memory before awarding once', () => {
  play(1, 'meet'); play(2, 'root'); play(2, 'wave'); play(2, 'star');
  play(3, 'listen'); play(3, 'threaten'); expect(ep().playerChoices.secondEpisode.calmStep).toBe(1);
  saveCampaignProgress(p); p = loadCampaignProgress(campaign.id, 'saira')!;
  play(3, 'name'); play(3, 'hum'); play(4, 'open_memory');
  saveCampaignProgress(p); p = loadCampaignProgress(campaign.id, 'saira')!;
  expect(ep().playerChoices.secondEpisode.memoryOpened).toBe(true);
  expect(p.totalGoldEarned).toBe(20);
  play(4, 'keep_memory'); expect(ep().status).toBe('completed');
  expect(p.totalGoldEarned).toBe(40); expect(p.totalXpEarned).toBe(200);
  expect(p.episodeProgress[campaign.episodes[2].id].status).toBe('unlocked');
  saveCampaignProgress(p); p = loadCampaignProgress(campaign.id, 'saira')!;
  const complete = p; play(4, 'keep_memory'); expect(p).toBe(complete);
});
it('rejects malformed state and permits legacy records without the optional new state', () => {
  expect(validateCampaignProgress(p)).toBe(true);
  ep().playerChoices.secondEpisode = { version: 1, bellStep: 99, calmStep: 0, memoryOpened: false, feedback: 'none' };
  expect(validateCampaignProgress(p)).toBe(false);
});
