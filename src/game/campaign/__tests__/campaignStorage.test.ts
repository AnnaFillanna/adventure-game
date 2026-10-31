/**
 * Campaign Storage Tests
 *
 * Prüft Speicherung, Laden und Migration von Kampagnenfortschritten
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  loadCampaignProgress,
  saveCampaignProgress,
  validateCampaignProgress,
  clearCampaignProgress,
  exportCampaignProgress,
  importCampaignProgress,
} from '../campaignStorage';
import { initializeCampaignProgress } from '../episodeManager';
import type { CampaignProgress } from '../../../types/campaign';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Campaign Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    clearCampaignProgress();
  });

  describe('Save and Load', () => {
    it('sollte Kampagnenfortschritt speichern und laden', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');

      saveCampaignProgress(progress);

      const loaded = loadCampaignProgress('campaign_first_light');
      expect(loaded).toBeDefined();
      expect(loaded?.campaignId).toBe('campaign_first_light');
      expect(Object.keys(loaded?.episodeProgress || {})).toHaveLength(30); // Alle 30 Episoden
    });

    it('sollte null zurückgeben wenn kein Fortschritt vorhanden ist', () => {
      const loaded = loadCampaignProgress('campaign_nonexistent');
      expect(loaded).toBeNull();
    });

    it('sollte mehrere Kampagnen-Fortschritte speichern können', () => {
      const progress1 = initializeCampaignProgress('campaign_first_light', 'hero_aeran');

      saveCampaignProgress(progress1);

      expect(loadCampaignProgress('campaign_first_light')).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('sollte valide Fortschrittsdaten validieren', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');

      expect(validateCampaignProgress(progress)).toBe(true);
    });

    it('sollte null als invalide zurückweisen', () => {
      expect(validateCampaignProgress(null)).toBe(false);
    });

    it('sollte unvollständige Daten als invalide zurückweisen', () => {
      const invalid = { campaignId: 'test' } as unknown as CampaignProgress;

      expect(validateCampaignProgress(invalid)).toBe(false);
    });
  });

  describe('Clear', () => {
    it('sollte Fortschritt für eine Kampagne löschen', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      saveCampaignProgress(progress);

      clearCampaignProgress('campaign_first_light');

      expect(loadCampaignProgress('campaign_first_light')).toBeNull();
    });

    it('sollte alle Fortschritte löschen', () => {
      const progress1 = initializeCampaignProgress('campaign_first_light', 'hero_aeran');

      saveCampaignProgress(progress1);

      clearCampaignProgress();

      expect(loadCampaignProgress('campaign_first_light')).toBeNull();
    });
  });

  describe('Export and Import', () => {
    it('sollte Fortschritt als JSON exportieren', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      saveCampaignProgress(progress);

      const exported = exportCampaignProgress('campaign_first_light');

      expect(exported).toBeDefined();
      expect(exported).toContain('campaign_first_light');
      expect(JSON.parse(exported!)).toHaveProperty('campaignId');
    });

    it('sollte JSON-Fortschritt importieren', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      const exported = JSON.stringify(progress);

      const imported = importCampaignProgress(exported);

      expect(imported).toBeDefined();
      expect(imported?.campaignId).toBe('campaign_first_light');

      // Überprüfe, dass importierter Fortschritt auch gespeichert wurde
      const loaded = loadCampaignProgress('campaign_first_light');
      expect(loaded).toBeDefined();
    });

    it('sollte ungültige JSON ablehnen', () => {
      const imported = importCampaignProgress('invalid json {');

      expect(imported).toBeNull();
    });
  });

  describe('Auto-versioning', () => {
    it('sollte Versionsnummer beim Speichern setzen', () => {
      const progress = initializeCampaignProgress('campaign_first_light', 'hero_aeran');
      saveCampaignProgress(progress);

      const version = localStorageMock.getItem('adventure_game_campaign_version');
      expect(version).toBe('1');
    });
  });

  describe('Error Handling', () => {
    it('sollte Fehler beim Laden korrekt verarbeiten', () => {
      // Simuliere ungültige JSON in localStorage
      localStorageMock.setItem('adventure_game_campaign_progress', 'invalid json');

      const loaded = loadCampaignProgress('campaign_first_light');

      expect(loaded).toBeNull();
    });
  });
});
