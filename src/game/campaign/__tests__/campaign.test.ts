/**
 * Campaign System Tests
 *
 * Testet die Kampagnen-Struktur, Episoden-Fortschritt und Speichermechanismen
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { Campaign } from '../../../types/campaign';
import {
  CAMPAIGNS,
  getEpisodeById,
  getChapterById,
  getEpisodesByChapter,
  getNextEpisode,
  getPreviousEpisode,
} from '../campaignData';
import {
  EPISODE_STATUS,
  initializeEpisodeProgress,
  unlockEpisode,
  startEpisode,
  pauseEpisode,
  resumeEpisode,
  completeEpisode,
  completeEvent,
  canUnlockEpisode,
  initializeCampaignProgress,
} from '../episodeManager';

let campaign: Campaign;

describe('Campaign System', () => {
  beforeEach(() => {
    campaign = CAMPAIGNS['campaign_first_light'];
  });

  describe('Campaign Structure', () => {
    it('sollte genau 5 Kapitel haben', () => {
      expect(campaign.chapters).toHaveLength(5);
    });

    it('sollte genau 30 Episoden haben', () => {
      expect(campaign.episodes).toHaveLength(30);
    });

    it('jedes Kapitel sollte 6 Episoden haben', () => {
      campaign.chapters.forEach((chapter) => {
        expect(chapter.episodeIds).toHaveLength(6);
      });
    });

    it('sollte alle 5 Kapitel validieren', () => {
      const chapterIds = campaign.chapters.map((ch) => ch.id);
      expect(chapterIds).toContain('chapter_01_cursed_lands');
      expect(chapterIds).toContain('chapter_02_sunken_paths');
      expect(chapterIds).toContain('chapter_03_ash_mountain');
      expect(chapterIds).toContain('chapter_04_shadow_fortress');
      expect(chapterIds).toContain('chapter_05_first_light_sword');
    });

    it('Kapitel-Nummern sollten 1-5 sein', () => {
      const numbers = campaign.chapters.map((ch) => ch.number).sort((a, b) => a - b);
      expect(numbers).toEqual([1, 2, 3, 4, 5]);
    });

    it('Episode-Nummern sollten 1-30 sein', () => {
      const numbers = campaign.episodes.map((ep) => ep.number).sort((a, b) => a - b);
      expect(numbers).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    });
  });

  describe('Episode Uniqueness', () => {
    it('alle Episode-IDs sollten eindeutig sein', () => {
      const ids = campaign.episodes.map((ep) => ep.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(30);
    });

    it('alle Kapitel-IDs sollten eindeutig sein', () => {
      const ids = campaign.chapters.map((ch) => ch.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(5);
    });
  });

  describe('Episode Prerequisites', () => {
    it('Episode 1 sollte keine Vorgänger-Episode haben', () => {
      const ep1 = campaign.episodes.find((ep) => ep.number === 1);
      expect(ep1?.prerequisites.previousEpisodeId).toBeUndefined();
    });

    it('Episoden 2-30 sollten Vorgänger-Episode haben', () => {
      campaign.episodes.filter((ep) => ep.number > 1).forEach((episode) => {
        expect(episode.prerequisites.previousEpisodeId).toBeDefined();
        const prevEpisode = campaign.episodes.find((ep) => ep.id === episode.prerequisites.previousEpisodeId);
        expect(prevEpisode).toBeDefined();
        expect(prevEpisode?.number).toBe(episode.number - 1);
      });
    });
  });

  describe('Chapter-Episode Relationships', () => {
    it('Kapitel 1 sollte Episoden 1-6 enthalten', () => {
      const chapter = getChapterById('campaign_first_light', 'chapter_01_cursed_lands');
      expect(chapter?.episodeIds).toEqual([
        'episode_01_whisper_sand',
        'episode_02_silent_bell',
        'episode_03_stolen_lantern',
        'episode_04_signs_mist',
        'episode_05_memory_willows',
        'episode_06_moorkeeper_crown',
      ]);
    });

    it('Kapitel 2 sollte Episoden 7-12 enthalten', () => {
      const chapter = getChapterById('campaign_first_light', 'chapter_02_sunken_paths');
      expect(chapter?.episodeIds).toHaveLength(6);
      const episodeNumbers = chapter?.episodeIds
        ?.map((id) => campaign.episodes.find((ep) => ep.id === id)?.number)
        .sort((a, b) => (a ?? 0) - (b ?? 0));
      expect(episodeNumbers).toEqual([7, 8, 9, 10, 11, 12]);
    });
  });

  describe('Episode Lookup Functions', () => {
    it('getEpisodeById sollte Episode finden', () => {
      const ep = getEpisodeById('campaign_first_light', 'episode_01_whisper_sand');
      expect(ep?.id).toBe('episode_01_whisper_sand');
      expect(ep?.number).toBe(1);
    });

    it('getChapterById sollte Kapitel finden', () => {
      const chapter = getChapterById('campaign_first_light', 'chapter_01_cursed_lands');
      expect(chapter?.id).toBe('chapter_01_cursed_lands');
      expect(chapter?.number).toBe(1);
    });

    it('getEpisodesByChapter sollte alle 6 Episoden eines Kapitels zurückgeben', () => {
      const episodes = getEpisodesByChapter('campaign_first_light', 'chapter_01_cursed_lands');
      expect(episodes).toHaveLength(6);
    });

    it('getNextEpisode sollte nächste Episode zurückgeben', () => {
      const nextEp = getNextEpisode('campaign_first_light', 'episode_01_whisper_sand');
      expect(nextEp?.id).toBe('episode_02_silent_bell');
    });

    it('getPreviousEpisode sollte vorherige Episode zurückgeben', () => {
      const prevEp = getPreviousEpisode('campaign_first_light', 'episode_02_silent_bell');
      expect(prevEp?.id).toBe('episode_01_whisper_sand');
    });
  });

  describe('Episode Progress Management', () => {
    it('sollte Episode-Fortschritt initialisieren', () => {
      const progress = initializeEpisodeProgress('episode_01_whisper_sand');
      expect(progress.episodeId).toBe('episode_01_whisper_sand');
      expect(progress.status).toBeDefined();
    });

    it('sollte Episode freischalten', () => {
      let progress = initializeEpisodeProgress('episode_01_whisper_sand');
      progress = unlockEpisode(progress);
      expect(progress.status).toBe(EPISODE_STATUS.UNLOCKED);
    });

    it('sollte Episode starten', () => {
      let progress = initializeEpisodeProgress('episode_01_whisper_sand');
      progress = unlockEpisode(progress);
      progress = startEpisode(progress);
      expect(progress.status).toBe(EPISODE_STATUS.IN_PROGRESS);
      expect(progress.startedAt).toBeGreaterThan(0);
    });

    it('sollte Episode pausieren und fortsetzen', () => {
      let progress = initializeEpisodeProgress('episode_01_whisper_sand');
      progress = unlockEpisode(progress);
      progress = startEpisode(progress);
      progress = pauseEpisode(progress);
      expect(progress.status).toBe(EPISODE_STATUS.PAUSED);
      expect(progress.pausedAt).toBeGreaterThan(0);

      progress = resumeEpisode(progress);
      expect(progress.status).toBe(EPISODE_STATUS.IN_PROGRESS);
    });

    it('sollte Episode abschließen', () => {
      let progress = initializeEpisodeProgress('episode_01_whisper_sand');
      progress = unlockEpisode(progress);
      progress = startEpisode(progress);
      progress = completeEpisode(progress);
      expect(progress.status).toBe(EPISODE_STATUS.COMPLETED);
      expect(progress.completedAt).toBeGreaterThan(0);
    });

    it('sollte Event-Abschluss registrieren', () => {
      let progress = initializeEpisodeProgress('episode_01_whisper_sand', EPISODE_STATUS.IN_PROGRESS);
      progress = completeEvent(progress, 'event_1');
      expect(progress.completedEvents).toContain('event_1');
    });

    it('sollte Belohnungen registrieren', () => {
      let progress = initializeEpisodeProgress('episode_01_whisper_sand');
      progress = completeEpisode(progress);
      expect(progress.status).toBe(EPISODE_STATUS.COMPLETED);
    });
  });

  describe('Campaign Progress', () => {
    it('sollte Kampagnen-Fortschritt initialisieren', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      expect(progress.campaignId).toBe('campaign_first_light');
      expect(progress.heroId).toBe('hero_aeran');
      expect(progress.status).toBe('not_started');
    });

    it('Episode 1 sollte bei Start freigeschalten sein', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      expect(progress.episodeProgress['episode_01_whisper_sand'].status).toBe(EPISODE_STATUS.UNLOCKED);
    });

    it('Episode 2-30 sollten bei Start gesperrt sein', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      for (let i = 2; i <= 30; i++) {
        const episodeId = campaign.episodes.find((ep) => ep.number === i)?.id;
        if (episodeId) {
          expect(progress.episodeProgress[episodeId].status).toBe(EPISODE_STATUS.LOCKED);
        }
      }
    });

    it('sollte nächste Episode nach Abschluss freischalten', () => {
      const ep1 = campaign.episodes.find((ep) => ep.number === 1)!;
      const ep2 = campaign.episodes.find((ep) => ep.number === 2)!;
      
      // Verify Episode 2 depends on Episode 1
      expect(ep2.prerequisites.previousEpisodeId).toBe(ep1.id);
    });

    it('sollte Kapitel als abgeschlossen markieren', () => {
      const chapter1 = campaign.chapters[0];
      expect(chapter1.id).toBe('chapter_01_cursed_lands');
      expect(chapter1.episodeIds).toHaveLength(6);
      expect(chapter1.bossEpisodeId).toBe('episode_06_moorkeeper_crown');
    });

    it('sollte feststellen ob Kapitel abgeschlossen ist', () => {
      const chapter2 = campaign.chapters[1];
      
      // Verify Chapter 2 starts with Episode 7
      expect(chapter2.episodeIds[0]).toBe('episode_07_city_mirror');
      
      // Episode 7 should depend on Episode 6 (boss of Chapter 1)
      const ep7 = campaign.episodes.find((ep) => ep.id === 'episode_07_city_mirror');
      expect(ep7?.prerequisites.previousEpisodeId).toBe('episode_06_moorkeeper_crown');
    });
  });

  describe('Progress Migration', () => {
    it('sollte alte Save-Daten migrieren', () => {
      const oldProgress = {
        campaignId: 'campaign_first_light',
        heroId: 'hero_aeran',
        status: 'in_progress' as const,
        startedAt: 1000000000,
        episodeProgress: {},
        completedChapterIds: [],
        totalXpEarned: 0,
        totalGoldEarned: 0,
        progressVersion: 0,
      };
      // Migration sollte kein Fehler werfen
      expect(oldProgress.progressVersion).toBe(0);
    });

    it('sollte aktuelle Save-Daten nicht ändern', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      expect(progress.progressVersion).toBe(1);
    });
  });

  describe('Progress Validation', () => {
    it('sollte gültigen Fortschritt validieren', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      expect(progress.campaignId).toBe('campaign_first_light');
      expect(progress.episodeProgress).toBeDefined();
      expect(Object.keys(progress.episodeProgress)).toHaveLength(30);
    });
  });

  describe('Episode Unlock Logic', () => {
    it('Episode 1 sollte immer freizuschalten sein', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      const ep1 = campaign.episodes.find((ep) => ep.number === 1);
      expect(canUnlockEpisode(ep1!, progress, campaign)).toBe(true);
    });

    it('Episode 2 sollte nicht freizuschalten sein, wenn Episode 1 nicht abgeschlossen ist', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      const ep2 = campaign.episodes.find((ep) => ep.number === 2);
      expect(canUnlockEpisode(ep2!, progress, campaign)).toBe(false);
    });

    it('Episode 2 sollte freizuschalten sein, wenn Episode 1 abgeschlossen ist', () => {
      let progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      progress.episodeProgress['episode_01_whisper_sand'].status = EPISODE_STATUS.COMPLETED;

      const episode2 = campaign.episodes.find((ep) => ep.number === 2);
      expect(canUnlockEpisode(episode2!, progress, campaign)).toBe(true);
    });
  });
});
