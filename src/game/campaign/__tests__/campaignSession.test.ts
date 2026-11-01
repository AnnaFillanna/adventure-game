import { beforeEach, expect, it } from 'vitest';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../campaignData';
import { initializeCampaignProgress } from '../episodeManager';
import { transitionCampaign } from '../campaignSession';
import { loadCampaignProgress, saveCampaignProgress } from '../campaignStorage';
import { hasTextKey } from '../../../locales';

beforeEach(() => localStorage.clear());
it('completes the entire campaign through saved sessions with exactly-once rewards', () => {
  let progress = initializeCampaignProgress(campaign.id, 'aeran');
  let expectedXp = 0; let expectedGold = 0;
  for (const episode of campaign.episodes) {
    progress = transitionCampaign(progress, { type: 'start', episodeId: episode.id, mode: 'short' });
    for (const event of episode.events) {
      if (episode.number === 1) {
        const inputs = [['read'], ['trail_dawn'], ['attack', 'guard', 'attack'], ['stone_sun', 'stone_path', 'stone_tower']] as const;
        for (const input of inputs[event.order - 1]) progress = transitionCampaign(progress, { type: 'play', episodeId: episode.id, eventId: event.id, input });
      } else if (episode.number === 2) {
        const inputs = [['meet'], ['root', 'wave', 'star'], ['listen', 'name', 'hum'], ['open_memory', 'keep_memory']] as const;
        for (const input of inputs[event.order - 1]) progress = transitionCampaign(progress, { type: 'playSecond', episodeId: episode.id, eventId: event.id, input });
      } else progress = transitionCampaign(progress, { type: 'event', episodeId: episode.id, eventId: event.id });
      expect(transitionCampaign(progress, { type: 'event', episodeId: episode.id, eventId: event.id })).toBe(progress);
      expect(saveCampaignProgress(progress)).toBe(true);
      progress = loadCampaignProgress(campaign.id, 'aeran')!;
      expect(progress).not.toBeNull();
      expectedXp += event.rewards.xp; expectedGold += event.rewards.gold;
    }
    const chapter = campaign.chapters.find(ch => ch.episodeIds.at(-1) === episode.id);
    if (chapter) { expectedXp += chapter.completionRewards.xp; expectedGold += chapter.completionRewards.gold; }
    expect(progress.totalXpEarned).toBe(expectedXp);
    expect(progress.totalGoldEarned).toBe(expectedGold);
  }
  expect(progress.status).toBe('completed');
  expect(progress.completedAt).toBeGreaterThan(0);
  expect(progress.completedChapterIds).toHaveLength(5);
});
it('preserves mode through pause, blocks events while paused and resumes', () => {
  const ep = campaign.episodes[0];
  let p = transitionCampaign(initializeCampaignProgress(campaign.id, 'aeran'), { type: 'start', episodeId: ep.id, mode: 'long' });
  p = transitionCampaign(p, { type: 'pause', episodeId: ep.id });
  expect(transitionCampaign(p, { type: 'event', episodeId: ep.id, eventId: ep.events[0].id })).toBe(p);
  saveCampaignProgress(p); p = loadCampaignProgress(campaign.id, 'aeran')!;
  p = transitionCampaign(p, { type: 'resume', episodeId: ep.id });
  expect(p.episodeProgress[ep.id].playerChoices.distanceMode).toBe('long');
  expect(p.episodeProgress[ep.id].status).toBe('in_progress');
});
it('resolves every campaign text and places the final boss before the peaceful ending', () => {
  function visit(value: unknown): void {
    if (typeof value !== 'object' || value === null) return;
    for (const [key, child] of Object.entries(value)) {
      if (key.endsWith('Key') && typeof child === 'string') expect(hasTextKey(child), child).toBe(true);
      else visit(child);
    }
  }
  visit(campaign);
  expect(campaign.chapters[4].bossEpisodeId).toBe(campaign.episodes[28].id);
  expect(campaign.episodes[28].events.some(e => e.type === 'boss_fight')).toBe(true);
  expect(campaign.episodes[29].events.every(e => e.type === 'story_beat')).toBe(true);
});
