import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../campaignData';
import { initializeCampaignProgress, startEpisode, completeEvent, pauseEpisode, migrateCampaignProgress } from '../episodeManager';
import { loadCampaignProgress, saveCampaignProgress, importCampaignProgress, exportCampaignProgress, clearCampaignProgress, validateCampaignProgress } from '../campaignStorage';
const KEY = 'adventure_game_campaign_progress';
const create = (hero = 'hero_aeran') => initializeCampaignProgress(campaign.id, hero);
beforeEach(() => { localStorage.clear(); vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(() => vi.restoreAllMocks());

describe('Save recovery and migration', () => {
  it('round trips paused progress, choices and reward markers without changing them', () => {
    const p = create(); const ep = campaign.episodes[0];
    p.episodeProgress[ep.id] = pauseEpisode(completeEvent(startEpisode(p.episodeProgress[ep.id]), ep.events[0].id));
    p.episodeProgress[ep.id].playerChoices = { answer: 'sun' };
    p.episodeProgress[ep.id].rewardsGranted = { xp: true, gold: true, itemIds: ['story-stone'] };
    expect(saveCampaignProgress(p)).toBe(true);
    expect(loadCampaignProgress(campaign.id, p.heroId)).toMatchObject(p);
    const exported = exportCampaignProgress(campaign.id, p.heroId)!;
    clearCampaignProgress();
    expect(importCampaignProgress(exported)).toMatchObject(p);
  });
  it('migrates version zero without mutating source or inventing rewards', () => {
    const p = create(); const ep = campaign.episodes[0];
    p.progressVersion = 0;
    p.episodeProgress[ep.id] = completeEvent(startEpisode(p.episodeProgress[ep.id]), ep.events[0].id);
    p.episodeProgress[ep.id].rewardsGranted.xp = true;
    const legacy = JSON.parse(JSON.stringify(p));
    delete legacy.totalGoldEarned; delete legacy.completedChapterIds;
    delete legacy.episodeProgress[campaign.episodes[1].id];
    const before = JSON.stringify(legacy);
    localStorage.setItem(KEY, JSON.stringify({ [campaign.id]: legacy }));
    localStorage.setItem('adventure_game_campaign_version', '1');
    const migrated = loadCampaignProgress(campaign.id)!;
    expect(migrated.progressVersion).toBe(1);
    expect(migrated.totalGoldEarned).toBe(0);
    expect(migrated.episodeProgress[ep.id]).toEqual(p.episodeProgress[ep.id]);
    expect(Object.keys(migrated.episodeProgress)).toHaveLength(30);
    expect(migrateCampaignProgress(legacy, 1)).toEqual(migrated);
    expect(JSON.stringify(legacy)).toBe(before);
    expect(importCampaignProgress(JSON.stringify(legacy))).toEqual(migrated);
  });
  it.each(['{broken', 'null', '[]', '17'])('backs up an unreadable container before replacing it: %s', raw => {
    localStorage.setItem(KEY, raw);
    expect(loadCampaignProgress(campaign.id)).toBeNull();
    expect(saveCampaignProgress(create())).toBe(true);
    expect(localStorage.getItem(`${KEY}_corrupt_backup`)).toBe(raw);
    expect(loadCampaignProgress(campaign.id)).not.toBeNull();
  });
  it('keeps both heroes and requires an explicit choice when ambiguous', () => {
    const first = create(); const second = create('hero_saira');
    localStorage.setItem(KEY, JSON.stringify({ [campaign.id]: first }));
    expect(saveCampaignProgress(second)).toBe(true);
    expect(loadCampaignProgress(campaign.id, first.heroId)).toMatchObject(first);
    expect(loadCampaignProgress(campaign.id, second.heroId)).toMatchObject(second);
    expect(loadCampaignProgress(campaign.id)).toBeNull();
    expect(clearCampaignProgress(campaign.id, second.heroId)).toBe(true);
    expect(loadCampaignProgress(campaign.id)).toMatchObject(first);
  });
  it('rejects future saves and never overwrites them', () => {
    const future = { ...create(), progressVersion: 99 };
    const raw = JSON.stringify({ [campaign.id]: future });
    localStorage.setItem(KEY, raw);
    expect(loadCampaignProgress(campaign.id)).toBeNull();
    expect(importCampaignProgress(JSON.stringify(future))).toBeNull();
    expect(saveCampaignProgress(create())).toBe(false);
    expect(localStorage.getItem(KEY)).toBe(raw);
  });
  it('reports write failure and leaves the previous save intact', () => {
    expect(saveCampaignProgress(create())).toBe(true);
    const raw = localStorage.getItem(KEY);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    expect(saveCampaignProgress(create())).toBe(false);
    expect(importCampaignProgress(JSON.stringify(create()))).toBeNull();
    expect(localStorage.getItem(KEY)).toBe(raw);
  });
  it('does not destroy corrupt data when the backup cannot be written', () => {
    localStorage.setItem(KEY, '{broken');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
    expect(saveCampaignProgress(create())).toBe(false);
    expect(localStorage.getItem(KEY)).toBe('{broken');
  });
  it('rejects legacy progress with missing payout history instead of enabling duplicate rewards', () => {
    const legacy = JSON.parse(JSON.stringify(create()));
    legacy.progressVersion = 0;
    const ep = campaign.episodes[0];
    legacy.episodeProgress[ep.id].status = 'in_progress';
    legacy.episodeProgress[ep.id].completedEvents = [ep.events[0].id];
    delete legacy.episodeProgress[ep.id].rewardsGranted;
    expect(importCampaignProgress(JSON.stringify(legacy))).toBeNull();
    expect(localStorage.getItem(KEY)).toBeNull();
  });
  it('handles denied reads', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
    expect(loadCampaignProgress(campaign.id)).toBeNull();
    expect(saveCampaignProgress(create())).toBe(false);
  });
  it('rejects malformed records and leaves valid stored progress intact', () => {
    const good = create(); saveCampaignProgress(good);
    const raw = localStorage.getItem(KEY);
    const mutations = [
      (p: any) => { p.episodeProgress = {}; },
      (p: any) => { p.totalXpEarned = -1; },
      (p: any) => { p.completedChapterIds = ['unknown']; },
      (p: any) => { p.episodeProgress[campaign.episodes[0].id].completedEvents = 42; },
      (p: any) => { p.episodeProgress[campaign.episodes[0].id].status = 'oops'; },
      (p: any) => { p.episodeProgress[campaign.episodes[0].id].completedEvents = [campaign.episodes[0].events[1].id]; },
      (p: any) => { p.episodeProgress[campaign.episodes[1].id].status = 'unlocked'; },
      (p: any) => { p.episodeProgress[campaign.episodes[0].id].status = 'completed'; },
      (p: any) => { p.heroId = ''; },
    ];
    for (const mutate of mutations) {
      const invalid = JSON.parse(JSON.stringify(good)); mutate(invalid);
      expect(validateCampaignProgress(invalid)).toBe(false);
      expect(importCampaignProgress(JSON.stringify(invalid))).toBeNull();
      expect(localStorage.getItem(KEY)).toBe(raw);
    }
  });
});
