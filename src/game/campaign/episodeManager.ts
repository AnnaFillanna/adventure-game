/**
 * Episode Manager – Episodensteuerung und Fortschrittverwaltung
 *
 * Enthält die Geschäftslogik für:
 * - Episode freischalten
 * - Episode starten
 * - Fortschritt speichern
 * - Episode pausieren/fortsetzen
 * - Episode abschließen
 * - Nächste Episode freischalten
 */

import type { Episode, EpisodeProgress, CampaignProgress, Campaign } from '../../types/campaign';
import { CAMPAIGNS, getNextEpisode } from './campaignData';
import { migrateProgress, CURRENT_PROGRESS_VERSION } from './progressSchema';

/**
 * Episode-Status-Konstanten
 */
export const EPISODE_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

/**
 * Neue Episode-Fortschritt initialisieren
 */
export function initializeEpisodeProgress(episodeId: string, status: 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'paused' = 'unlocked'): EpisodeProgress {
  return {
    episodeId,
    status,
    startedAt: 0,
    completedEvents: [],
    rewardsGranted: {
      xp: false,
      gold: false,
      itemIds: [],
    },
    playerChoices: {},
  };
}

/**
 * Episode freischalten
 */
export function unlockEpisode(progress: EpisodeProgress): EpisodeProgress {
  if (progress.status === EPISODE_STATUS.LOCKED) {
    return { ...progress, status: EPISODE_STATUS.UNLOCKED };
  }
  return progress;
}

/**
 * Episode starten
 */
export function startEpisode(progress: EpisodeProgress): EpisodeProgress {
  if (progress.status === EPISODE_STATUS.UNLOCKED) {
    return {
      ...progress,
      status: EPISODE_STATUS.IN_PROGRESS,
      startedAt: Date.now(),
    };
  }
  return progress;
}

/**
 * Episode pausieren
 */
export function pauseEpisode(progress: EpisodeProgress): EpisodeProgress {
  if (progress.status === EPISODE_STATUS.IN_PROGRESS) {
    return {
      ...progress,
      status: EPISODE_STATUS.PAUSED,
      pausedAt: Date.now(),
    };
  }
  return progress;
}

/**
 * Episode fortsetzen
 */
export function resumeEpisode(progress: EpisodeProgress): EpisodeProgress {
  if (progress.status === EPISODE_STATUS.PAUSED) {
    return {
      ...progress,
      status: EPISODE_STATUS.IN_PROGRESS,
      pausedAt: undefined,
    };
  }
  return progress;
}

/**
 * Event-Abschluss registrieren
 */
function findEpisode(episodeId: string): Episode | undefined {
  return Object.values(CAMPAIGNS).flatMap(campaign => campaign.episodes)
    .find(episode => episode.id === episodeId);
}

export function completeEvent(progress: EpisodeProgress, eventId: string): EpisodeProgress {
  const episode = findEpisode(progress.episodeId);
  if (!episode || progress.status !== EPISODE_STATUS.IN_PROGRESS) return progress;
  const nextEvent = [...episode.events].sort((a, b) => a.order - b.order)
    .find(event => !progress.completedEvents.includes(event.id));
  if (nextEvent?.id !== eventId) return progress;
  if (!progress.completedEvents.includes(eventId)) {
    return {
      ...progress,
      completedEvents: [...progress.completedEvents, eventId],
      currentEventId: eventId,
    };
  }
  return progress;
}

/**
 * Episode abschließen
 */
export function completeEpisode(progress: EpisodeProgress): EpisodeProgress {
  const episode = findEpisode(progress.episodeId);
  if (!episode || progress.status !== EPISODE_STATUS.IN_PROGRESS ||
      !episode.events.every(event => progress.completedEvents.includes(event.id))) return progress;
  return {
    ...progress,
    status: EPISODE_STATUS.COMPLETED,
    completedAt: Date.now(),
  };
}

/**
 * Belohnungen als vergeben markieren
 */
export function grantRewards(progress: EpisodeProgress, rewards: { xp?: boolean; gold?: boolean; itemIds?: string[] }): EpisodeProgress {
  return {
    ...progress,
    rewardsGranted: {
      xp: rewards.xp ?? progress.rewardsGranted.xp,
      gold: rewards.gold ?? progress.rewardsGranted.gold,
      itemIds: rewards.itemIds ?? progress.rewardsGranted.itemIds,
    },
  };
}

/**
 * Prüfe ob Episode freigeschalten werden kann
 */
export function canUnlockEpisode(
  episode: Episode | undefined,
  campaignProgress: CampaignProgress,
  campaign: Campaign | undefined
): boolean {
  if (!episode || !campaign) return false;

  // Episode 1 ist immer freizuschalten
  if (episode.number === 1) return true;

  // Prüfe Voraussetzungen
  if (episode.prerequisites.previousEpisodeId) {
    const prevProgress = campaignProgress.episodeProgress[episode.prerequisites.previousEpisodeId];
    if (!prevProgress || prevProgress.status !== EPISODE_STATUS.COMPLETED) {
      return false;
    }
  }

  return true;
}

/**
 * Kampagnen-Fortschritt initialisieren
 */
export function initializeCampaignProgress(campaignId: string, heroId: string): CampaignProgress {
  const campaign = CAMPAIGNS[campaignId];
  if (!campaign) {
    throw new Error(`Campaign ${campaignId} nicht gefunden`);
  }

  const episodeProgress: Record<string, EpisodeProgress> = {};

  // Erste Episode freischalten, Rest gesperrt
  campaign.episodes.forEach((episode) => {
    if (episode.number === 1) {
      episodeProgress[episode.id] = initializeEpisodeProgress(episode.id, EPISODE_STATUS.UNLOCKED);
    } else {
      episodeProgress[episode.id] = initializeEpisodeProgress(episode.id, EPISODE_STATUS.LOCKED);
    }
  });

  return {
    campaignId,
    heroId,
    status: 'not_started',
    startedAt: Date.now(),
    episodeProgress,
    completedChapterIds: [],
    totalXpEarned: 0,
    totalGoldEarned: 0,
    progressVersion: 1,
  };
}

/**
 * Nächste Episode freischalten nach Abschluss
 */
export function unlockNextEpisode(
  campaignProgress: CampaignProgress,
  completedEpisodeId: string,
  campaign: Campaign
): CampaignProgress {
  const completedEpisode = campaign.episodes.find(episode => episode.id === completedEpisodeId);
  if (campaignProgress.campaignId !== campaign.id || !completedEpisode ||
      campaignProgress.episodeProgress[completedEpisodeId]?.status !== EPISODE_STATUS.COMPLETED ||
      !canUnlockEpisode(completedEpisode, campaignProgress, campaign)) return campaignProgress;
  const nextEpisode = getNextEpisode(campaign.id, completedEpisodeId);
  if (!nextEpisode) {
    if (!campaign.episodes.every(episode =>
      campaignProgress.episodeProgress[episode.id]?.status === EPISODE_STATUS.COMPLETED)) return campaignProgress;
    // Kampagne ist komplett
    return { ...campaignProgress, status: 'completed' };
  }

  const nextProgress = campaignProgress.episodeProgress[nextEpisode.id];
  if (nextProgress && nextProgress.status === EPISODE_STATUS.LOCKED) {
    return {
      ...campaignProgress,
      episodeProgress: {
        ...campaignProgress.episodeProgress,
        [nextEpisode.id]: unlockEpisode(nextProgress),
      },
    };
  }

  return campaignProgress;
}

/**
 * Alle Episoden eines Kapitels abgeschlossen?
 */
export function isChapterCompleted(campaignProgress: CampaignProgress, chapter: any): boolean {
  return chapter.episodeIds.every((episodeId: string) => {
    const progress = campaignProgress.episodeProgress[episodeId];
    return progress?.status === EPISODE_STATUS.COMPLETED;
  });
}

/**
 * Kapitel-Abschluss registrieren
 */
export function markChapterCompleted(
  campaignProgress: CampaignProgress,
  chapterId: string,
  xpReward: number,
  goldReward: number
): CampaignProgress {
  if (!campaignProgress.completedChapterIds.includes(chapterId)) {
    return {
      ...campaignProgress,
      completedChapterIds: [...campaignProgress.completedChapterIds, chapterId],
      totalXpEarned: campaignProgress.totalXpEarned + xpReward,
      totalGoldEarned: campaignProgress.totalGoldEarned + goldReward,
    };
  }
  return campaignProgress;
}

/** Shared migration for storage and direct callers. Invalid saves are rejected. */
export function migrateCampaignProgress(oldProgress: unknown, currentVersion: number): CampaignProgress {
  const progress = currentVersion === CURRENT_PROGRESS_VERSION ? migrateProgress(oldProgress) : null;
  if (!progress) throw new Error('Invalid or unsupported campaign save');
  return progress;
}

/**
 * Kampagnen-Fortschritt validieren
 */
export function validateCampaignProgress(
  progress: CampaignProgress,
  campaign: Campaign
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Prüfe ob alle Episoden vorhanden sind
  campaign.episodes.forEach((episode) => {
    if (!progress.episodeProgress[episode.id]) {
      issues.push(`Episode ${episode.id} fehlt im Fortschritt`);
    }
  });

  // Prüfe Episode-Reihenfolge (abgeschlossene Episoden sollten Vorgänger abgeschlossen haben)
  campaign.episodes.forEach((episode) => {
    const episodeProgress = progress.episodeProgress[episode.id];
    if (episodeProgress?.status === EPISODE_STATUS.COMPLETED && episode.prerequisites.previousEpisodeId) {
      const prevProgress = progress.episodeProgress[episode.prerequisites.previousEpisodeId];
      if (!prevProgress || prevProgress.status !== EPISODE_STATUS.COMPLETED) {
        issues.push(`Episode ${episode.id} abgeschlossen, aber Vorgänger nicht`);
      }
    }
  });

  // Prüfe Kapitel-Abschlüsse
  campaign.chapters.forEach((chapter) => {
    const isCompleted = progress.completedChapterIds.includes(chapter.id);
    const episodesCompleted = chapter.episodeIds.every((epId) => {
      const ep = progress.episodeProgress[epId];
      return ep?.status === EPISODE_STATUS.COMPLETED;
    });

    if (isCompleted !== episodesCompleted) {
      issues.push(`Kapitel ${chapter.id} Abschluss-Status konsistent mit Episoden-Status`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Fortschritt zurücksetzen (nur für Testzwecke)
 */
export function resetCampaignProgress(campaignId: string, heroId: string): CampaignProgress {
  return initializeCampaignProgress(campaignId, heroId);
}
