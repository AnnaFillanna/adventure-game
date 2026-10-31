/**
 * Campaign Storage & Persistence
 *
 * Verwaltet Speicherung und Wiederherstellung von Kampagnenfortschritten
 * mit Migrations-Support für alte Save-Formate
 */

import type { CampaignProgress } from '../../types/campaign';

const CAMPAIGN_STORAGE_KEY = 'adventure_game_campaign_progress';
const CAMPAIGN_VERSION_KEY = 'adventure_game_campaign_version';
const CURRENT_CAMPAIGN_VERSION = 1;

/**
 * Kampagnenfortschritt aus localStorage laden
 */
export function loadCampaignProgress(campaignId: string): CampaignProgress | null {
  try {
    const stored = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as Record<string, CampaignProgress>;
    const progress = data[campaignId];

    if (!progress) return null;

    // Version prüfen und bei Bedarf migrieren
    const version = localStorage.getItem(CAMPAIGN_VERSION_KEY);
    if (!version || parseInt(version, 10) < CURRENT_CAMPAIGN_VERSION) {
      return migrateCampaignProgress(progress, campaignId);
    }

    return progress;
  } catch (error) {
    console.error('Failed to load campaign progress:', error);
    return null;
  }
}

/**
 * Kampagnenfortschritt in localStorage speichern
 */
export function saveCampaignProgress(progress: CampaignProgress): void {
  try {
    const stored = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    const allProgress: Record<string, CampaignProgress> = stored ? JSON.parse(stored) : {};

    allProgress[progress.campaignId] = {
      ...progress,
      lastSavedAt: Date.now(),
    };

    localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(allProgress));
    localStorage.setItem(CAMPAIGN_VERSION_KEY, String(CURRENT_CAMPAIGN_VERSION));
  } catch (error) {
    console.error('Failed to save campaign progress:', error);
  }
}

/**
 * Migriert alte Campaign-Fortschritte zu neuem Format
 */
function migrateCampaignProgress(oldProgress: CampaignProgress, _campaignId: string): CampaignProgress {
  // Version 0 → 1: Keine Breaking Changes, nur Format-Update
  return {
    ...oldProgress,
    version: CURRENT_CAMPAIGN_VERSION,
  };
}

/**
 * Überprüft, ob gespeicherte Daten valide sind
 */
export function validateCampaignProgress(progress: CampaignProgress | null): progress is CampaignProgress {
  if (!progress) return false;

  // Validiere erforderliche Felder
  if (!progress.campaignId || !progress.episodeProgress || typeof progress.episodeProgress !== 'object') {
    return false;
  }

  // Validiere Episode-Fortschritte
  const episodeIds = Object.keys(progress.episodeProgress);
  return episodeIds.every((id) => {
    const ep = progress.episodeProgress[id];
    return ep && typeof ep === 'object' && 'status' in ep && 'completedEvents' in ep;
  });
}

/**
 * Kampagnenfortschritt völlig löschen (nur für Debugging)
 */
export function clearCampaignProgress(campaignId?: string): void {
  try {
    if (campaignId) {
      const stored = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
      if (stored) {
        const allProgress: Record<string, CampaignProgress> = JSON.parse(stored);
        delete allProgress[campaignId];
        localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(allProgress));
      }
    } else {
      localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
      localStorage.removeItem(CAMPAIGN_VERSION_KEY);
    }
  } catch (error) {
    console.error('Failed to clear campaign progress:', error);
  }
}

/**
 * Exportiert Kampagnenfortschritt als JSON (für Backup)
 */
export function exportCampaignProgress(campaignId: string): string | null {
  const progress = loadCampaignProgress(campaignId);
  if (!progress) return null;

  try {
    return JSON.stringify(progress, null, 2);
  } catch (error) {
    console.error('Failed to export campaign progress:', error);
    return null;
  }
}

/**
 * Importiert Kampagnenfortschritt aus JSON
 */
export function importCampaignProgress(jsonString: string): CampaignProgress | null {
  try {
    const progress = JSON.parse(jsonString) as CampaignProgress;

    if (!validateCampaignProgress(progress)) {
      console.error('Invalid campaign progress data');
      return null;
    }

    saveCampaignProgress(progress);
    return progress;
  } catch (error) {
    console.error('Failed to import campaign progress:', error);
    return null;
  }
}
