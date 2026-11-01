/**
 * Adventure Game - Character Selection Page
 * Page wrapper for character selection with routing integration
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { CharacterSelection } from '../components/Character/CharacterSelection';
import type { HeroId } from '../game/characters/types';
import styles from './CharacterSelectionPage.module.scss';
import { preferencesManager } from '../game/utils/storage';

export const CharacterSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const selectHero = useGameStore((state) => state.selectHero);
  const [selectedHero, setSelectedHero] = useState<HeroId | null>(null);

  const handleStartGame = () => {
    if (!selectedHero) return;
    
    // Select hero in game store
    selectHero(selectedHero);
    preferencesManager.setPreference('campaignHero', selectedHero);
    
    // Navigate to game
    navigate('/game');
  };

  return (
    <div className={styles.characterSelectionPageContainer}>
      <CharacterSelection 
        selectedHero={selectedHero}
        onSelectHero={setSelectedHero}
        onStartGame={handleStartGame}
      />
    </div>
  );
};

export default CharacterSelectionPage;
