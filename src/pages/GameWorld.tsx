import { Navigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { preferencesManager } from '../game/utils/storage';
import type { HeroId } from '../game/characters/types';
import { SimplifiedCampaignScreen } from '../components/Campaign/SimplifiedCampaignScreen';

export default function GameWorld() {
  const selectedHeroId = useGameStore(state => state.selectedHeroId);
  const heroId = selectedHeroId ?? preferencesManager.getPreference<unknown>('campaignHero', null);
  const validHero = typeof heroId === 'string' && ['aeran', 'velar', 'varg', 'ravena', 'saira'].includes(heroId);
  return validHero ? <SimplifiedCampaignScreen key={heroId} heroId={heroId as HeroId} /> : <Navigate to="/character-select" replace />;
}
