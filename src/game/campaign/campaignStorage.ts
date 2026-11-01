import type { CampaignProgress } from '../../types/campaign';
import { isRecord, migrateProgress, validateCampaignProgress } from './progressSchema';
export { validateCampaignProgress } from './progressSchema';

const STORAGE_KEY = 'adventure_game_campaign_progress';
const VERSION_KEY = 'adventure_game_campaign_version';
const BACKUP_KEY = `${STORAGE_KEY}_corrupt_backup`;
const entryKey = (campaignId: string, heroId: string) => JSON.stringify([campaignId, heroId]);

function readEntries(recover = false): Record<string, unknown> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) throw new Error('Invalid campaign storage container');
    return parsed;
  } catch (error) {
    if (!recover) throw error;
    // Preserve the original before replacing unreadable storage. If backup fails, abort.
    localStorage.setItem(BACKUP_KEY, raw);
    return {};
  }
}

export function loadCampaignProgress(campaignId: string, heroId?: string): CampaignProgress | null {
  try {
    const entries = readEntries();
    const candidates = heroId === undefined
      ? Object.values(entries)
      : [entries[entryKey(campaignId, heroId)], entries[campaignId]];
    const matches = candidates.map(migrateProgress).filter((p): p is CampaignProgress =>
      p !== null && p.campaignId === campaignId && (heroId === undefined || p.heroId === heroId));
    // Legacy callers without a hero must never silently choose between different heroes.
    if (new Set(matches.map(p => p.heroId)).size > 1) return null;
    return matches.sort((a, b) => (b.lastSavedAt ?? 0) - (a.lastSavedAt ?? 0))[0] ?? null;
  } catch (error) {
    console.error('Failed to load campaign progress:', error);
    return null;
  }
}

export function saveCampaignProgress(progress: CampaignProgress): boolean {
  if (!validateCampaignProgress(progress)) return false;
  try {
    const entries = readEntries(true);
    const key = entryKey(progress.campaignId, progress.heroId);
    // Never overwrite a save written by an unsupported future version.
    for (const existing of [entries[key], entries[progress.campaignId]]) {
      if (isRecord(existing) && existing.heroId === progress.heroId &&
          (Number(existing.progressVersion ?? 0) > 1 || Number(existing.version ?? 0) > 1)) return false;
    }
    const legacy = entries[progress.campaignId];
    if (isRecord(legacy) && legacy.heroId === progress.heroId) delete entries[progress.campaignId];
    entries[key] = { ...progress, lastSavedAt: Date.now() };
    // Per-record versions are authoritative; legacy metadata is written before the commit.
    localStorage.setItem(VERSION_KEY, '1');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Failed to save campaign progress:', error);
    return false;
  }
}

export function clearCampaignProgress(campaignId?: string, heroId?: string): boolean {
  try {
    if (campaignId === undefined) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);
      localStorage.removeItem(BACKUP_KEY);
    } else {
      const entries = readEntries();
      for (const [key, value] of Object.entries(entries)) {
        if (isRecord(value) && value.campaignId === campaignId &&
            (heroId === undefined || value.heroId === heroId)) delete entries[key];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
    return true;
  } catch (error) {
    console.error('Failed to clear campaign progress:', error);
    return false;
  }
}

export function exportCampaignProgress(campaignId: string, heroId?: string): string | null {
  const progress = loadCampaignProgress(campaignId, heroId);
  return progress ? JSON.stringify(progress, null, 2) : null;
}

export function importCampaignProgress(jsonString: string): CampaignProgress | null {
  try {
    const progress = migrateProgress(JSON.parse(jsonString));
    return progress && saveCampaignProgress(progress) ? progress : null;
  } catch (error) {
    console.error('Failed to import campaign progress:', error);
    return null;
  }
}

/** Distinguish a missing save from an unreadable one before starting a new game. */
export function hasCampaignSave(campaignId: string, heroId: string): boolean {
  try {
    const entries = readEntries();
    if (Object.hasOwn(entries, entryKey(campaignId, heroId))) return true;
    const legacy = entries[campaignId];
    return legacy !== undefined && (!isRecord(legacy) || legacy.heroId === heroId);
  } catch {
    return true; // Denied access or corrupt data must not trigger an automatic reset.
  }
}
