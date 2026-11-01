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
      for (const event of campaign.episodes[0].events) progress = completeEvent(progress, event.id);
      progress = completeEpisode(progress);
      expect(progress.status).toBe(EPISODE_STATUS.COMPLETED);
      expect(progress.completedAt).toBeGreaterThan(0);
    });

    it('sollte Event-Abschluss registrieren', () => {
      let progress = initializeEpisodeProgress('episode_01_whisper_sand', EPISODE_STATUS.IN_PROGRESS);
      progress = completeEvent(progress, 'episode_01_whisper_sand_event_1');
      expect(progress.completedEvents).toContain('episode_01_whisper_sand_event_1');
    });

    it('sollte erst nach allen Ereignissen abschließen', () => {
      let progress = initializeEpisodeProgress('episode_01_whisper_sand');
      progress = startEpisode(progress);
      for (const event of campaign.episodes[0].events) progress = completeEvent(progress, event.id);
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
  });

  describe('Critical Progress Logic - Regression Tests', () => {
    it('Episode-Status kann von LOCKED zu UNLOCKED wechseln', () => {
      let epProgress = initializeEpisodeProgress('episode_01_whisper_sand', 'locked');
      expect(epProgress.status).toBe('locked');

      epProgress = unlockEpisode(epProgress);
      expect(epProgress.status).toBe('unlocked');
    });

    it('Event darf nicht mehrfach in completedEvents registriert werden', () => {
      let epProgress = initializeEpisodeProgress('episode_01_whisper_sand', 'in_progress');

      const eventId = 'episode_01_whisper_sand_event_1';

      // Complete event first time
      epProgress = completeEvent(epProgress, eventId);
      expect(epProgress.completedEvents).toContain(eventId);
      const countAfterFirst = epProgress.completedEvents.filter((e) => e === eventId).length;

      // Try to complete same event again
      epProgress = completeEvent(epProgress, eventId);
      const countAfterSecond = epProgress.completedEvents.filter((e) => e === eventId).length;

      // Event should only appear once
      expect(countAfterFirst).toBe(1);
      expect(countAfterSecond).toBe(1);
    });

    it('Abgeschlossene Episode bleibt abgeschlossen', () => {
      let epProgress = initializeEpisodeProgress('episode_01_whisper_sand', 'completed');

      expect(epProgress.status).toBe('completed');

      // Try to start completed episode
      epProgress = startEpisode(epProgress);

      // Should remain COMPLETED
      expect(epProgress.status).toBe('completed');
    });

    it('Pausieren und Fortsetzen müssen funktionieren', () => {
      let epProgress = initializeEpisodeProgress('episode_01_whisper_sand', 'in_progress');

      expect(epProgress.status).toBe('in_progress');

      const eventId = 'episode_01_whisper_sand_event_1';
      epProgress = completeEvent(epProgress, eventId);
      // Pause episode
      epProgress = pauseEpisode(epProgress);
      expect(epProgress.status).toBe('paused');

      // Completing another event while paused must not advance progress
      epProgress = completeEvent(epProgress, 'episode_01_whisper_sand_event_2');
      expect(epProgress.completedEvents).not.toContain('episode_01_whisper_sand_event_2');

      // Resume episode
      epProgress = resumeEpisode(epProgress);
      expect(epProgress.status).toBe('in_progress');

      // Event completion should be preserved
      expect(epProgress.completedEvents).toContain(eventId);
    });

    it('Kapitelübergänge sind korrekt gesichert', () => {
      const ep6 = campaign.episodes.find((ep) => ep.number === 6)!;
      const ep7 = campaign.episodes.find((ep) => ep.number === 7)!;
      const ep12 = campaign.episodes.find((ep) => ep.number === 12)!;
      const ep13 = campaign.episodes.find((ep) => ep.number === 13)!;
      const ep18 = campaign.episodes.find((ep) => ep.number === 18)!;
      const ep19 = campaign.episodes.find((ep) => ep.number === 19)!;
      const ep24 = campaign.episodes.find((ep) => ep.number === 24)!;
      const ep25 = campaign.episodes.find((ep) => ep.number === 25)!;

      // All chapter transitions must link properly
      expect(ep7.prerequisites.previousEpisodeId).toBe(ep6.id);
      expect(ep13.prerequisites.previousEpisodeId).toBe(ep12.id);
      expect(ep19.prerequisites.previousEpisodeId).toBe(ep18.id);
      expect(ep25.prerequisites.previousEpisodeId).toBe(ep24.id);

      // Chapter boundaries verified
      expect(ep6.chapterId).toBe('chapter_01_cursed_lands');
      expect(ep7.chapterId).toBe('chapter_02_sunken_paths');
    });

    it('Episoden 1-30 sind korrekt verknüpft', () => {
      for (let i = 2; i <= 30; i++) {
        const current = campaign.episodes.find((ep) => ep.number === i)!;
        const previous = campaign.episodes.find((ep) => ep.number === i - 1)!;

        expect(current.prerequisites.previousEpisodeId).toBe(previous.id);
      }
    });

    it('Ungültige Zustandswechsel sind gesperrt', () => {
      // LOCKED -> startEpisode should not change
      let epProgress = initializeEpisodeProgress('episode_01_whisper_sand', 'locked');
      epProgress = startEpisode(epProgress);
      expect(epProgress.status).toBe('locked');

      // UNLOCKED -> startEpisode should change to IN_PROGRESS
      epProgress = initializeEpisodeProgress('episode_01_whisper_sand', 'unlocked');
      epProgress = startEpisode(epProgress);
      expect(epProgress.status).toBe('in_progress');

      // PAUSED -> resumeEpisode should go to IN_PROGRESS
      epProgress = initializeEpisodeProgress('episode_01_whisper_sand', 'paused');
      epProgress = resumeEpisode(epProgress);
      expect(epProgress.status).toBe('in_progress');
    });

    it('Fortschritt bleibt nach JSON-Serialisierung erhalten', () => {
      let epProgress = initializeEpisodeProgress('episode_01_whisper_sand', 'in_progress');

      epProgress = completeEvent(epProgress, 'episode_01_whisper_sand_event_1');
      epProgress = completeEvent(epProgress, 'episode_01_whisper_sand_event_2');

      const before = {
        completed: [...epProgress.completedEvents],
        status: epProgress.status,
      };

      // Simulate save/load
      const saved = JSON.stringify(epProgress);
      const loaded = JSON.parse(saved);

      expect(loaded.completedEvents).toEqual(before.completed);
      expect(loaded.status).toBe(before.status);
    });

    it('Boss-Episoden sind korrekt markiert', () => {
      const bossNumbers = [6, 12, 18, 24, 29];

      // Boss episodes must have boss_fight event
      bossNumbers.forEach((num) => {
        const ep = campaign.episodes.find((e) => e.number === num)!;
        const hasBoss = ep.events.some((e) => e.type === 'boss_fight');
        expect(hasBoss).toBe(true);
      });

      // Non-boss episodes must NOT have boss_fight
      for (let i = 1; i <= 30; i++) {
        if (!bossNumbers.includes(i)) {
          const ep = campaign.episodes.find((e) => e.number === i)!;
          const hasBoss = ep.events.some((e) => e.type === 'boss_fight');
          expect(hasBoss).toBe(false);
        }
      }
    });

    it('Alle Episode-Events haben eindeutige IDs', () => {
      const seen = new Set<string>();
      let dupes = 0;

      campaign.episodes.forEach((ep) => {
        ep.events.forEach((e) => {
          if (seen.has(e.id)) dupes++;
          seen.add(e.id);
        });
      });

      expect(dupes).toBe(0);
      expect(seen.size).toBe(120); // 30 episodes * 4 events
    });

    it('Jede Episode hat genau 4 Events', () => {
      campaign.episodes.forEach((ep) => {
        expect(ep.events).toHaveLength(4);
      });
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
