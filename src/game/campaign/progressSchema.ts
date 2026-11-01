import { validSecondEpisodeState } from './secondEpisodeState';
import { validFirstEpisodeState } from './firstEpisodeState';
import type { CampaignProgress } from '../../types/campaign';
import { CAMPAIGNS } from './campaignData';

export const CURRENT_PROGRESS_VERSION = 1;
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const nonnegative = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === 'string') && new Set(value).size === value.length;

/** Validate untrusted saves before any game logic consumes them. */
export function validateCampaignProgress(value: unknown): value is CampaignProgress {
  if (!isRecord(value) || typeof value.campaignId !== 'string' ||
      !Object.hasOwn(CAMPAIGNS, value.campaignId) || typeof value.heroId !== 'string' || !value.heroId ||
      !['not_started', 'in_progress', 'completed'].includes(String(value.status)) ||
      value.progressVersion !== CURRENT_PROGRESS_VERSION ||
      (value.version !== undefined && value.version !== CURRENT_PROGRESS_VERSION) ||
      !nonnegative(value.startedAt) || !nonnegative(value.totalXpEarned) || !nonnegative(value.totalGoldEarned) ||
      !strings(value.completedChapterIds) || !isRecord(value.episodeProgress)) return false;
  for (const field of ['completedAt', 'lastSavedAt']) {
    if (value[field] !== undefined && !nonnegative(value[field])) return false;
  }
  const campaign = CAMPAIGNS[value.campaignId];
  const episodes = value.episodeProgress;
  if (Object.keys(episodes).length !== campaign.episodes.length) return false;
  for (const episode of campaign.episodes) {
    const ep = episodes[episode.id];
    if (!isRecord(ep) || ep.episodeId !== episode.id ||
        !['locked', 'unlocked', 'in_progress', 'paused', 'completed'].includes(String(ep.status)) ||
        !nonnegative(ep.startedAt) || !strings(ep.completedEvents) || !isRecord(ep.playerChoices) ||
        !isRecord(ep.rewardsGranted) || typeof ep.rewardsGranted.xp !== 'boolean' ||
        typeof ep.rewardsGranted.gold !== 'boolean' || !strings(ep.rewardsGranted.itemIds)) return false;
    if (ep.playerChoices.secondEpisode !== undefined && !validSecondEpisodeState(ep.playerChoices.secondEpisode)) return false;
    if (ep.playerChoices.firstEpisode !== undefined && !validFirstEpisodeState(ep.playerChoices.firstEpisode)) return false;
    for (const field of ['pausedAt', 'completedAt']) {
      if (ep[field] !== undefined && !nonnegative(ep[field])) return false;
    }
    const eventIds = [...episode.events].sort((a, b) => a.order - b.order).map(event => event.id);
    if (!ep.completedEvents.every((id, index) => id === eventIds[index]) ||
        (ep.currentEventId !== undefined && !eventIds.includes(String(ep.currentEventId))) ||
        (ep.status === 'completed' && ep.completedEvents.length !== eventIds.length)) return false;
    if (ep.status !== 'locked' && episode.prerequisites.previousEpisodeId) {
      const previous = episodes[episode.prerequisites.previousEpisodeId];
      if (!isRecord(previous) || previous.status !== 'completed') return false;
    }
  }
  if (!value.completedChapterIds.every(id => campaign.chapters.some(chapter => chapter.id === id &&
      chapter.episodeIds.every(epId => (episodes[epId] as Record<string, unknown>).status === 'completed')))) return false;
  return value.status !== 'completed' || campaign.episodes.every(ep =>
    (episodes[ep.id] as Record<string, unknown>).status === 'completed');
}

/** Only missing legacy fields get defaults; malformed or future data is rejected. */
export function migrateProgress(value: unknown): CampaignProgress | null {
  if (!isRecord(value)) return null;
  const version = value.progressVersion ?? value.version ?? 0;
  if (version === CURRENT_PROGRESS_VERSION) return validateCampaignProgress(value) ? value : null;
  if (version !== 0 || typeof value.campaignId !== 'string' || !Object.hasOwn(CAMPAIGNS, value.campaignId) ||
      !isRecord(value.episodeProgress)) return null;
  const campaign = CAMPAIGNS[value.campaignId];
  const episodes: Record<string, unknown> = { ...value.episodeProgress };
  for (const episode of campaign.episodes) {
    const old = episodes[episode.id];
    if (old !== undefined && !isRecord(old)) return null;
    // Missing payout history cannot safely be reconstructed after progress was made.
    if (isRecord(old) && old.rewardsGranted === undefined &&
        (old.status === 'completed' || (Array.isArray(old.completedEvents) && old.completedEvents.length > 0))) return null;
    episodes[episode.id] = {
      episodeId: episode.id, status: episode.number === 1 ? 'unlocked' : 'locked', startedAt: 0,
      completedEvents: [], rewardsGranted: { xp: false, gold: false, itemIds: [] }, playerChoices: {},
      ...(old as Record<string, unknown> | undefined),
    };
  }
  if (value.completedChapterIds === undefined && campaign.chapters.some(chapter =>
      chapter.episodeIds.every(id => isRecord(episodes[id]) && episodes[id].status === 'completed'))) return null;
  const migrated = {
    status: 'not_started', startedAt: 0, completedChapterIds: [], totalXpEarned: 0, totalGoldEarned: 0,
    ...value, episodeProgress: episodes, progressVersion: CURRENT_PROGRESS_VERSION, version: CURRENT_PROGRESS_VERSION,
  };
  return validateCampaignProgress(migrated) ? migrated : null;
}
