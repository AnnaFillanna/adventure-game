/**
 * Debug Campaign Page
 * Shows the full campaign screen with all technical UI elements
 * Accessible only via /debug/campaign route
 */

import { Navigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { preferencesManager } from '../game/utils/storage';
import type { HeroId } from '../game/characters/types';
import { CampaignScreen } from '../components/Campaign/CampaignScreen';

export default function DebugCampaignPage() {
  const selectedHeroId = useGameStore(state => state.selectedHeroId);
  const heroId = selectedHeroId ?? preferencesManager.getPreference<unknown>('campaignHero', null);
  const validHero = typeof heroId === 'string' && ['aeran', 'velar', 'varg', 'ravena', 'saira'].includes(heroId);
  
  return validHero ? (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        background: 'rgba(228, 193, 123, 0.2)', 
        padding: '8px 12px', 
        borderRadius: '4px',
        fontSize: '11px',
        color: '#d7be7d',
        fontFamily: 'monospace',
        zIndex: 10000
      }}>
        DEBUG: Vollständige Kampagnenübersicht
      </div>
      <CampaignScreen key={heroId} heroId={heroId as HeroId} />
    </div>
  ) : (
    <Navigate to="/character-select" replace />
  );
}
