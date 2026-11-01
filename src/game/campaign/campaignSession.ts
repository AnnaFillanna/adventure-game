import { SECOND_EPISODE_ID, playSecondEpisode, type SecondEpisodeInput } from './secondEpisode';
import { FIRST_EPISODE_ID, playFirstEpisode, type FirstEpisodeInput } from './firstEpisode';
import { playThirdEpisode, type ThirdEpisodeInput } from './thirdEpisode';
import type { CampaignProgress } from '../../types/campaign';
import { CAMPAIGN_FIRST_LIGHT as campaign } from './campaignData';
import { completeEvent, completeEpisode, startEpisode, pauseEpisode, resumeEpisode, unlockNextEpisode, markChapterCompleted, isChapterCompleted } from './episodeManager';

export type CampaignAction =
  | { type: 'playSecond'; episodeId: string; eventId: string; input: SecondEpisodeInput }
  | { type: 'play'; episodeId: string; eventId: string; input: FirstEpisodeInput }
  | { type: 'playThird'; episodeId: string; eventId: string; input: ThirdEpisodeInput }
  | { type: 'start'; episodeId: string; mode: 'short' | 'normal' | 'long' }
  | { type: 'pause'; episodeId: string }
  | { type: 'resume'; episodeId: string }
  | { type: 'finish'; episodeId: string }
  | { type: 'event'; episodeId: string; eventId: string };

/** A single snapshot owns progress and campaign rewards; never credit a second store. */
export function transitionCampaign(progress: CampaignProgress, action: CampaignAction): CampaignProgress {
  const episode = campaign.episodes.find(ep => ep.id === action.episodeId);
  const previous = progress.episodeProgress[action.episodeId];
  if (!episode || !previous || progress.campaignId !== campaign.id) return progress;
  let ep = previous;
  if (action.type === 'start') {
    if (Object.values(progress.episodeProgress).some(p => p.status === 'in_progress' || p.status === 'paused')) return progress;
    ep = startEpisode(ep);
    if (ep === previous) return progress;
    ep = { ...ep, playerChoices: { ...ep.playerChoices, distanceMode: action.mode } };
  } else if (action.type === 'pause') ep = pauseEpisode(ep);
  else if (action.type === 'resume') ep = resumeEpisode(ep);
  else if (action.type === 'finish') ep = completeEpisode(ep);
  else if (action.type === 'playSecond') {
    ep = playSecondEpisode(ep, action.eventId, action.input);
    if (ep === previous) return progress;
    ep = completeEpisode(ep);
  } else if (action.type === 'play') {
    ep = playFirstEpisode(ep, action.eventId, action.input);
    if (ep === previous) return progress;
    ep = completeEpisode(ep);
  } else if (action.type === 'playThird') {
    ep = playThirdEpisode(ep, action.eventId, action.input);
    if (ep === previous) return progress;
    ep = completeEpisode(ep);
  } else {
    if ((episode.id === FIRST_EPISODE_ID || episode.id === SECOND_EPISODE_ID)) return progress;
    ep = completeEvent(ep, action.eventId);
    if (ep === previous) return progress;
    ep = completeEpisode(ep);
  }
  if (ep === previous) return progress;
  let next: CampaignProgress = {
    ...progress, status: 'in_progress', episodeProgress: { ...progress.episodeProgress, [episode.id]: ep },
  };
  // Pay once at episode completion; flags and totals are committed together.
  if (ep.status === 'completed') {
    const xp = episode.events.reduce((sum, event) => sum + event.rewards.xp, 0);
    const gold = episode.events.reduce((sum, event) => sum + event.rewards.gold, 0);
    next = {
      ...next,
      totalXpEarned: next.totalXpEarned + (ep.rewardsGranted.xp ? 0 : xp),
      totalGoldEarned: next.totalGoldEarned + (ep.rewardsGranted.gold ? 0 : gold),
      episodeProgress: { ...next.episodeProgress, [episode.id]: {
        ...ep, rewardsGranted: { ...ep.rewardsGranted, xp: true, gold: true },
      } },
    };
    for (const chapter of campaign.chapters) {
      if (isChapterCompleted(next, chapter)) next = markChapterCompleted(next, chapter.id, chapter.completionRewards.xp, chapter.completionRewards.gold);
    }
    next = unlockNextEpisode(next, episode.id, campaign);
    if (next.status === 'completed') next = { ...next, completedAt: Date.now() };
  }
  return next;
}
