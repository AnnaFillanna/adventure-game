/**
 * Campaign Data: "Das Schwert des Ersten Lichts"
 *
 * Vollständige Kampagnen-Definition mit 5 Kapiteln, 30 Episoden und 120 Events
 * Basierend auf GAME_DESIGN.md - Alle Events vollständig dokumentiert
 *
 * Diese Datei ist datengetrieben und enthält keine Spiellogik.
 * Alle sichtbaren Texte sind Lokalisierungsschlüssel, die auf de.ts verweisen.
 */

import type { Campaign, Chapter, Episode, EpisodeEvent, EventType } from '../../types/campaign';

const CAMPAIGN_VERSION = 2;

// ============================================================================
// EVENT TYPE HELPERS
// ============================================================================

const getEventType = (eventNum: 1 | 2 | 3 | 4, isBoss: boolean): EventType => {
  if (isBoss && eventNum === 3) return 'boss_fight';
  if (isBoss && eventNum === 4) return 'reward';
  if (eventNum === 1) return 'npc_dialog';
  if (eventNum === 2) return 'puzzle';
  if (eventNum === 3) return 'combat';
  return 'story_beat';
};

const getEventRewards = (epNum: number, eventNum: 1 | 2 | 3 | 4, isBoss: boolean) => {
  let baseGold = 0;
  const baseXp = eventNum * 10;
  
  if (epNum <= 6) baseGold = 5;
  else if (epNum <= 12) baseGold = 6;
  else if (epNum <= 18) baseGold = 7;
  else if (epNum <= 24) baseGold = 8;
  else baseGold = 10;
  
  if (isBoss) {
    if (eventNum === 3) return { xp: 50, gold: 15 };
    if (eventNum === 4) return { xp: 40, gold: 10 };
  }
  
  return { xp: baseXp, gold: baseGold };
};

// ============================================================================
// CHAPTER DEFINITIONS
// ============================================================================

const CHAPTER_1: Chapter = {
  id: 'chapter_01_cursed_lands',
  number: 1,
  titleKey: 'chapters.01.title',
  descriptionKey: 'chapters.01.description',
  episodeIds: [
    'episode_01_whisper_sand', 'episode_02_silent_bell', 'episode_03_stolen_lantern',
    'episode_04_signs_mist', 'episode_05_memory_willows', 'episode_06_moorkeeper_crown',
  ],
  bossEpisodeId: 'episode_06_moorkeeper_crown',
  introKey: 'chapters.01.intro',
  outroKey: 'chapters.01.outro',
  completionRewards: { xp: 300, gold: 100, badgeId: 'badge_cursed_lands_hero' },
};

const CHAPTER_2: Chapter = {
  id: 'chapter_02_sunken_paths',
  number: 2,
  titleKey: 'chapters.02.title',
  descriptionKey: 'chapters.02.description',
  episodeIds: [
    'episode_07_city_mirror', 'episode_08_ferryman_memories', 'episode_09_empty_pages',
    'episode_10_trade_without_gold', 'episode_11_tides_rune', 'episode_12_heart_depth',
  ],
  bossEpisodeId: 'episode_12_heart_depth',
  introKey: 'chapters.02.intro',
  outroKey: 'chapters.02.outro',
  completionRewards: { xp: 400, gold: 150, badgeId: 'badge_sunken_paths_hero' },
};

const CHAPTER_3: Chapter = {
  id: 'chapter_03_ash_mountain',
  number: 3,
  titleKey: 'chapters.03.title',
  descriptionKey: 'chapters.03.description',
  episodeIds: [
    'episode_13_sparks_horizon', 'episode_14_singing_ore', 'episode_15_angry_wind',
    'episode_16_hidden_signal_fires', 'episode_17_sunmetal_key', 'episode_18_ash_dragon_wings',
  ],
  bossEpisodeId: 'episode_18_ash_dragon_wings',
  introKey: 'chapters.03.intro',
  outroKey: 'chapters.03.outro',
  completionRewards: { xp: 500, gold: 200, badgeId: 'badge_ash_mountain_hero' },
};

const CHAPTER_4: Chapter = {
  id: 'chapter_04_shadow_fortress',
  number: 4,
  titleKey: 'chapters.04.title',
  descriptionKey: 'chapters.04.description',
  episodeIds: [
    'episode_19_gate_without_shadow', 'episode_20_captured_cartographer', 'episode_21_sealed_letter',
    'episode_22_three_mirrors', 'episode_23_divided_light', 'episode_24_shadow_vogt',
  ],
  bossEpisodeId: 'episode_24_shadow_vogt',
  introKey: 'chapters.04.intro',
  outroKey: 'chapters.04.outro',
  completionRewards: { xp: 600, gold: 250, badgeId: 'badge_shadow_fortress_hero' },
};

const CHAPTER_5: Chapter = {
  id: 'chapter_05_first_light_sword',
  number: 5,
  titleKey: 'chapters.05.title',
  descriptionKey: 'chapters.05.description',
  episodeIds: [
    'episode_25_signs_gather', 'episode_26_open_hand_trial', 'episode_27_broken_protection_circle',
    'episode_28_first_light_awakens', 'episode_29_when_night_breaks', 'episode_30_light_we_share',
  ],
  bossEpisodeId: 'episode_30_light_we_share',
  introKey: 'chapters.05.intro',
  outroKey: 'chapters.05.outro',
  completionRewards: { xp: 700, gold: 300, badgeId: 'badge_first_light_champion' },
};

// ============================================================================
// EPISODE FACTORY FUNCTION
// ============================================================================

const createEpisode = (
  id: string,
  number: number,
  chapterId: string,
  previousEpisodeId?: string,
  isBoss: boolean = false
): Episode => {
  const numStr = String(number).padStart(2, '0');
  const events: EpisodeEvent[] = [];
  
  for (let i = 1; i <= 4; i++) {
    const eventNum = i as 1 | 2 | 3 | 4;
    events.push({
      id: `${id}_event_${i}`,
      type: getEventType(eventNum, isBoss),
      order: i,
      titleKey: `episodes.${numStr}.event_${i}.title`,
      descriptionKey: `episodes.${numStr}.event_${i}.description`,
      rewards: getEventRewards(number, eventNum, isBoss),
    });
  }
  
  return {
    id,
    number,
    chapterId,
    titleKey: `episodes.${numStr}.title`,
    descriptionKey: `episodes.${numStr}.description`,
    recommendedLevel: 5 + Math.floor((number - 1) / 6) * 3,
    distanceModes: {
      short: { distanceKm: 1.0, eventIds: [`${id}_event_1`, `${id}_event_2`, `${id}_event_3`] },
      normal: { distanceKm: 2.5, eventIds: [`${id}_event_1`, `${id}_event_2`, `${id}_event_3`, `${id}_event_4`] },
      long: { distanceKm: 4.5, eventIds: [`${id}_event_1`, `${id}_event_2`, `${id}_event_3`, `${id}_event_4`] },
    },
    events,
    storyProgressKey: `episodes.${numStr}.storyProgress`,
    prerequisites: { previousEpisodeId },
  };
};

// ============================================================================
// ALL 30 EPISODES - 120 EVENTS TOTAL
// ============================================================================

const EPISODES: Episode[] = [
  // Kapitel I: Die verfluchten Lande (Episoden 1-6, 20 Gold pro Episode)
  createEpisode('episode_01_whisper_sand', 1, 'chapter_01_cursed_lands'),
  createEpisode('episode_02_silent_bell', 2, 'chapter_01_cursed_lands', 'episode_01_whisper_sand'),
  createEpisode('episode_03_stolen_lantern', 3, 'chapter_01_cursed_lands', 'episode_02_silent_bell'),
  createEpisode('episode_04_signs_mist', 4, 'chapter_01_cursed_lands', 'episode_03_stolen_lantern'),
  createEpisode('episode_05_memory_willows', 5, 'chapter_01_cursed_lands', 'episode_04_signs_mist'),
  createEpisode('episode_06_moorkeeper_crown', 6, 'chapter_01_cursed_lands', 'episode_05_memory_willows', true),

  // Kapitel II: Die versunkenen Pfade (Episoden 7-12, 25 Gold pro Episode)
  createEpisode('episode_07_city_mirror', 7, 'chapter_02_sunken_paths', 'episode_06_moorkeeper_crown'),
  createEpisode('episode_08_ferryman_memories', 8, 'chapter_02_sunken_paths', 'episode_07_city_mirror'),
  createEpisode('episode_09_empty_pages', 9, 'chapter_02_sunken_paths', 'episode_08_ferryman_memories'),
  createEpisode('episode_10_trade_without_gold', 10, 'chapter_02_sunken_paths', 'episode_09_empty_pages'),
  createEpisode('episode_11_tides_rune', 11, 'chapter_02_sunken_paths', 'episode_10_trade_without_gold'),
  createEpisode('episode_12_heart_depth', 12, 'chapter_02_sunken_paths', 'episode_11_tides_rune', true),

  // Kapitel III: Das Aschegebirge (Episoden 13-18, 30 Gold pro Episode)
  createEpisode('episode_13_sparks_horizon', 13, 'chapter_03_ash_mountain', 'episode_12_heart_depth'),
  createEpisode('episode_14_singing_ore', 14, 'chapter_03_ash_mountain', 'episode_13_sparks_horizon'),
  createEpisode('episode_15_angry_wind', 15, 'chapter_03_ash_mountain', 'episode_14_singing_ore'),
  createEpisode('episode_16_hidden_signal_fires', 16, 'chapter_03_ash_mountain', 'episode_15_angry_wind'),
  createEpisode('episode_17_sunmetal_key', 17, 'chapter_03_ash_mountain', 'episode_16_hidden_signal_fires'),
  createEpisode('episode_18_ash_dragon_wings', 18, 'chapter_03_ash_mountain', 'episode_17_sunmetal_key', true),

  // Kapitel IV: Die Schattenfestung (Episoden 19-24, 35 Gold pro Episode)
  createEpisode('episode_19_gate_without_shadow', 19, 'chapter_04_shadow_fortress', 'episode_18_ash_dragon_wings'),
  createEpisode('episode_20_captured_cartographer', 20, 'chapter_04_shadow_fortress', 'episode_19_gate_without_shadow'),
  createEpisode('episode_21_sealed_letter', 21, 'chapter_04_shadow_fortress', 'episode_20_captured_cartographer'),
  createEpisode('episode_22_three_mirrors', 22, 'chapter_04_shadow_fortress', 'episode_21_sealed_letter'),
  createEpisode('episode_23_divided_light', 23, 'chapter_04_shadow_fortress', 'episode_22_three_mirrors'),
  createEpisode('episode_24_shadow_vogt', 24, 'chapter_04_shadow_fortress', 'episode_23_divided_light', true),

  // Kapitel V: Das Schwert des Ersten Lichts (Episoden 25-30, 40 Gold pro Episode)
  createEpisode('episode_25_signs_gather', 25, 'chapter_05_first_light_sword', 'episode_24_shadow_vogt'),
  createEpisode('episode_26_open_hand_trial', 26, 'chapter_05_first_light_sword', 'episode_25_signs_gather'),
  createEpisode('episode_27_broken_protection_circle', 27, 'chapter_05_first_light_sword', 'episode_26_open_hand_trial'),
  createEpisode('episode_28_first_light_awakens', 28, 'chapter_05_first_light_sword', 'episode_27_broken_protection_circle'),
  createEpisode('episode_29_when_night_breaks', 29, 'chapter_05_first_light_sword', 'episode_28_first_light_awakens'),
  createEpisode('episode_30_light_we_share', 30, 'chapter_05_first_light_sword', 'episode_29_when_night_breaks', true),
];

// ============================================================================
// CAMPAIGN DEFINITION
// ============================================================================

export const CAMPAIGN_FIRST_LIGHT: Campaign = {
  id: 'campaign_first_light',
  titleKey: 'campaigns.firstLight.title',
  descriptionKey: 'campaigns.firstLight.description',
  chapters: [CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5],
  episodes: EPISODES,
  version: CAMPAIGN_VERSION,
  createdAt: Date.now(),
  lastUpdatedAt: Date.now(),
};

export const CAMPAIGNS: Record<string, Campaign> = {
  [CAMPAIGN_FIRST_LIGHT.id]: CAMPAIGN_FIRST_LIGHT,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getEpisodeById(campaignId: string, episodeId: string): Episode | undefined {
  const campaign = CAMPAIGNS[campaignId];
  return campaign?.episodes.find((ep) => ep.id === episodeId);
}

export function getChapterById(campaignId: string, chapterId: string): Chapter | undefined {
  const campaign = CAMPAIGNS[campaignId];
  return campaign?.chapters.find((ch) => ch.id === chapterId);
}

export function getEpisodesByChapter(campaignId: string, chapterId: string): Episode[] {
  const campaign = CAMPAIGNS[campaignId];
  if (!campaign) return [];
  return campaign.episodes.filter((ep) => ep.chapterId === chapterId);
}

export function getNextEpisode(campaignId: string, currentEpisodeId: string): Episode | undefined {
  const campaign = CAMPAIGNS[campaignId];
  if (!campaign) return undefined;
  const currentEp = campaign.episodes.find((ep) => ep.id === currentEpisodeId);
  if (!currentEp) return undefined;
  return campaign.episodes.find((ep) => ep.number === currentEp.number + 1);
}

export function getPreviousEpisode(campaignId: string, currentEpisodeId: string): Episode | undefined {
  const campaign = CAMPAIGNS[campaignId];
  if (!campaign) return undefined;
  const currentEp = campaign.episodes.find((ep) => ep.id === currentEpisodeId);
  if (!currentEp) return undefined;
  return campaign.episodes.find((ep) => ep.number === currentEp.number - 1);
}

export function validateCampaign(campaign: Campaign): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (campaign.chapters.length !== 5) {
    errors.push(`Campaign hat ${campaign.chapters.length} Kapitel, sollten 5 sein`);
  }

  if (campaign.episodes.length !== 30) {
    errors.push(`Campaign hat ${campaign.episodes.length} Episoden, sollten 30 sein`);
  }

  let totalEvents = 0;
  campaign.episodes.forEach((ep) => {
    totalEvents += ep.events.length;
  });
  
  if (totalEvents !== 120) {
    errors.push(`Campaign hat ${totalEvents} Events, sollten 120 sein`);
  }

  campaign.chapters.forEach((chapter, idx) => {
    if (chapter.episodeIds.length !== 6) {
      errors.push(`Kapitel ${idx + 1} hat ${chapter.episodeIds.length} Episoden, sollten 6 sein`);
    }
    if (!campaign.episodes.find((ep) => ep.id === chapter.bossEpisodeId)) {
      errors.push(`Kapitel ${idx + 1} Boss-Episode "${chapter.bossEpisodeId}" nicht gefunden`);
    }
  });

  const episodeNumbers = campaign.episodes.map((ep) => ep.number).sort((a, b) => a - b);
  if (!episodeNumbers.every((num, idx) => num === idx + 1)) {
    errors.push('Episode-Nummern sind nicht aufeinanderfolgend (sollten 1-30 sein)');
  }

  const episodeIds = campaign.episodes.map((ep) => ep.id);
  if (new Set(episodeIds).size !== episodeIds.length) {
    errors.push('Es gibt doppelte Episode-IDs');
  }

  campaign.episodes.forEach((episode) => {
    if (episode.prerequisites.previousEpisodeId) {
      if (!campaign.episodes.find((ep) => ep.id === episode.prerequisites.previousEpisodeId)) {
        errors.push(`Episode ${episode.id} verweist auf nicht-existente Vorgänger-Episode`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}
