/**
 * Campaign and Episode Type Definitions
 *
 * Datengetriebene Architektur für die Kampagne "Das Schwert des Ersten Lichts"
 * mit 5 Kapiteln und 30 Episoden
 */

/**
 * Episodenereignis-Typen
 */
export type EventType = 'npc_dialog' | 'combat' | 'puzzle' | 'collection' | 'boss_fight' | 'story_beat' | 'reward';

/**
 * Gegner-Definition für Episoden-Events
 */
export interface Enemy {
  id: string;
  nameKey: string; // Lokalisierungsschlüssel
  level: number;
  hp: number;
  attack: number;
  defense: number;
  reward: {
    xp: number;
    gold: number;
  };
}

/**
 * Sammelobjekt-Definition
 */
export interface CollectibleItem {
  id: string;
  nameKey: string; // Lokalisierungsschlüssel
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic'; // Visuell, kein Gameplay-Einfluss
}

/**
 * Episoden-Event (Ereignis innerhalb einer Episode)
 */
export interface EpisodeEvent {
  id: string;
  type: EventType;
  order: number; // Reihenfolge innerhalb Episode
  titleKey: string; // Lokalisierungsschlüssel
  descriptionKey: string; // Lokalisierungsschlüssel
  
  // Event-spezifische Daten
  enemies?: Enemy[];
  puzzleType?: 'symbol_matching' | 'sequence' | 'memory' | 'rhythm'; // Optional für puzzle-Events
  collectibles?: CollectibleItem[];
  
  // Bedingungen
  requiresCompletedEpisode?: string; // ID einer vorherigen Episode
  
  // Belohnungen
  rewards: {
    xp: number;
    gold: number;
    items?: CollectibleItem[];
    itemsGranted?: string[]; // IDs von Gegensänden, die für die Quest vergeben werden
  };
}

/**
 * Episode-Fortschritt (gespeicherte Daten pro Spieler)
 */
export interface EpisodeProgress {
  episodeId: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'paused' | undefined;
  startedAt: number; // Unix timestamp
  pausedAt?: number; // Unix timestamp, wenn pausiert
  completedAt?: number; // Unix timestamp
  
  // Event-bezogener Fortschritt
  completedEvents: string[]; // Event-IDs die abgeschlossen wurden
  currentEventId?: string; // Aktuell aktives Event
  
  // Belohnungen
  rewardsGranted: {
    xp: boolean;
    gold: boolean;
    itemIds: string[];
  };
  
  // Spieler-Entscheidungen (z.B. gewählte Lösung für Rätsel)
  playerChoices: Record<string, any>;
}

/**
 * Episode-Definition
 */
export interface Episode {
  id: string;
  number: number; // 1-30
  chapterId: string; // Kapitel-ID
  titleKey: string; // Lokalisierungsschlüssel: "episodes.01.title"
  descriptionKey: string; // Lokalisierungsschlüssel: "episodes.01.description"
  
  // Episoden-Eigenschaften
  recommendedLevel: number;
  distanceModes: {
    short: { distanceKm: number; eventIds: string[] };
    normal: { distanceKm: number; eventIds: string[] };
    long: { distanceKm: number; eventIds: string[] };
  };
  
  // Ereignisse in dieser Episode
  events: EpisodeEvent[];
  
  // Story-Fortschritt
  storyProgressKey?: string; // Was der Spieler in dieser Episode über die Story lernt
  
  // Voraussetzungen
  prerequisites: {
    previousEpisodeId?: string; // Muss vorherige Episode abgeschlossen sein
    previousChapterCompletionRequired?: boolean; // Muss vorheriges Kapitel vollständig sein
  };
}

/**
 * Kapitel-Definition
 */
export interface Chapter {
  id: string;
  number: number; // 1-5
  titleKey: string; // Lokalisierungsschlüssel: "chapters.01.title"
  descriptionKey: string; // Lokalisierungsschlüssel: "chapters.01.description"
  
  // Kapitel-Eigenschaften
  episodeIds: string[]; // IDs der Episoden in diesem Kapitel (sollten 6 sein)
  bossEpisodeId: string; // Welche Episode ist der Boss-Fight
  
  // Story
  introKey?: string; // Intro-Text des Kapitels
  outroKey?: string; // Outro-Text des Kapitels
  
  // Belohnungen für Kapitel-Abschluss
  completionRewards: {
    xp: number;
    gold: number;
    badgeId?: string; // Optionales Abzeichen
  };
}

/**
 * Kampagnen-Definition (Sammlung aller Kapitel)
 */
export interface Campaign {
  id: string;
  titleKey: string; // Lokalisierungsschlüssel: "campaigns.firstLight.title"
  descriptionKey: string; // Lokalisierungsschlüssel: "campaigns.firstLight.description"
  
  // Kampagnen-Struktur
  chapters: Chapter[];
  episodes: Episode[];
  
  // Versioning für Save-Kompatibilität
  version: number; // Änderung bei breaking changes der Episode-Struktur
  
  // Metadaten
  createdAt: number;
  lastUpdatedAt: number;
}

/**
 * Gesamt-Kampagnen-Fortschritt (Pro Spieler, Held)
 */
export interface CampaignProgress {
  campaignId: string;
  heroId: string; // ID des gewählten Helden
  
  // Allgemeiner Status
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt: number; // Unix timestamp
  completedAt?: number; // Unix timestamp
  
  // Episoden-Fortschritt
  episodeProgress: Record<string, EpisodeProgress>; // episodeId -> EpisodeProgress
  
  // Kapitel-Abschlüsse
  completedChapterIds: string[];
  
  // Gesamtbelohnungen
  totalXpEarned: number;
  totalGoldEarned: number;
  
  // Versioning und Speicher-Metadaten
  progressVersion: number; // Für Migration alter Save-Daten
  version?: number; // Alias für Storage-Layer
  lastSavedAt?: number; // Unix timestamp des letzten Speicherns
}

/**
 * Kampagnen-Konfiguration für Sicherheit
 */
export interface CampaignSafetyConfig {
  requiresAdultConfirmation: boolean;
  minAgeRecommended: number;
  gpsEnabled: boolean; // Ob GPS-basierte Events aktiviert sind
  maxPlayersPerParty: number;
  includeAccessibilityFeatures: boolean;
}
