import { describe, it, expect } from 'vitest';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../campaignData';
import { initializeCampaignProgress, initializeEpisodeProgress, completeEvent, completeEpisode, unlockNextEpisode, startEpisode, pauseEpisode, resumeEpisode } from '../episodeManager';
const first = campaign.episodes[0];
const initial = () => initializeCampaignProgress(campaign.id, 'hero_aeran');

describe('Progression guards', () => {
  it('rejects unknown, out-of-order, locked and paused events', () => {
    let progress = initializeEpisodeProgress(first.id, 'locked');
    expect(completeEvent(progress, first.events[0].id)).toBe(progress);
    progress = initializeEpisodeProgress(first.id, 'in_progress');
    expect(completeEvent(progress, 'foreign')).toBe(progress);
    expect(completeEvent(progress, first.events[1].id)).toBe(progress);
    progress = pauseEpisode(progress);
    expect(completeEvent(progress, first.events[0].id)).toBe(progress);
  });
  it('requires every mandatory event, preserves pause progress and completes once', () => {
    let progress = initializeEpisodeProgress(first.id, 'locked');
    expect(completeEpisode(progress)).toBe(progress);
    progress = initializeEpisodeProgress(first.id, 'in_progress');
    for (const event of first.events) {
      expect(completeEpisode(progress)).toBe(progress);
      progress = completeEvent(progress, event.id);
      expect(completeEvent(progress, event.id)).toBe(progress);
      progress = resumeEpisode(pauseEpisode(progress));
    }
    progress = completeEpisode(progress);
    expect(progress.status).toBe('completed');
    expect(completeEpisode(progress)).toBe(progress);
    expect(completeEvent(progress, 'foreign')).toBe(progress);
  });
  it('rejects unknown and unfinished episode unlock requests', () => {
    const progress = initial();
    expect(unlockNextEpisode(progress, 'unknown', campaign)).toBe(progress);
    expect(unlockNextEpisode(progress, first.id, campaign)).toBe(progress);
    const last = campaign.episodes.at(-1)!;
    progress.episodeProgress[last.id].status = 'completed';
    expect(unlockNextEpisode(progress, last.id, campaign)).toBe(progress);
  });
  it('plays all 30 episodes and completes only after the final episode', () => {
    let progress = initial();
    for (const episode of campaign.episodes) {
      let ep = startEpisode(progress.episodeProgress[episode.id]);
      expect(ep.status).toBe('in_progress');
      for (const event of episode.events) ep = completeEvent(ep, event.id);
      progress.episodeProgress[episode.id] = completeEpisode(ep);
      progress = unlockNextEpisode(progress, episode.id, campaign);
      expect(progress.status === 'completed').toBe(episode.number === 30);
    }
  });
  it('keeps every mandatory event in all distance modes', () => {
    for (const episode of campaign.episodes) {
      for (const mode of Object.values(episode.distanceModes)) {
        expect(mode.eventIds).toEqual(episode.events.map(event => event.id));
      }
    }
  });
});
