/**
 * Adventure Game - Character Selection Screen
 * Premium fantasy UI for hero selection before game start
 */

import React, { useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';
import { HEROES, ALL_HERO_IDS } from '../../game/characters/heroDefinitions';
import type { HeroId } from '../../game/characters/types';
import styles from './CharacterSelection.module.scss';

// ============================================================================
// CHARACTER CARD COMPONENT
// ============================================================================

interface CharacterCardProps {
  heroId: HeroId;
  isSelected: boolean;
  onSelect: (heroId: HeroId) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  heroId,
  isSelected,
  onSelect,
}) => {
  const hero = HEROES[heroId];

  return (
    <button
      className={`${styles.characterCard} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(heroId)}
      aria-pressed={isSelected}
    >
      <div className={styles.cardContent}>
        {/* Hero Icon/Avatar */}
        <div className={styles.heroIcon}>{hero.icon}</div>

        {/* Hero Name */}
        <h3 className={styles.heroName}>{hero.name}</h3>

        {/* Hero Class */}
        <p className={styles.heroClass}>{hero.class}</p>

        {/* Description */}
        <p className={styles.description}>{hero.description}</p>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.label}>HP</span>
            <span className={styles.value}>{hero.stats.maxHealth}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Mana</span>
            <span className={styles.value}>{hero.stats.maxMana}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>ATK</span>
            <span className={styles.value}>{hero.stats.attack}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>MGK</span>
            <span className={styles.value}>{hero.stats.magic}</span>
          </div>
        </div>

        {/* Abilities Preview */}
        <div className={styles.abilitiesPreview}>
          <h4>Abilities:</h4>
          <ul>
            {hero.abilities.slice(0, 2).map(ability => (
              <li key={ability.id} className={styles.abilityItem}>
                <span className={styles.abilityIcon}>{ability.icon}</span>
                <span className={styles.abilityName}>{ability.name}</span>
              </li>
            ))}
            {hero.abilities.length > 2 && (
              <li className={styles.more}>+{hero.abilities.length - 2} more</li>
            )}
          </ul>
        </div>

        {/* Special Ability */}
        <div className={styles.specialAbility}>
          <span className={styles.icon}>{hero.specialAbility.icon}</span>
          <span className={styles.name}>{hero.specialAbility.name}</span>
        </div>

        {/* Transformation Indicator */}
        {hero.transformation && (
          <div className={styles.transformationBadge}>
            {hero.transformation.type === 'wolf' ? '🐺' : '🦅'} Can Transform
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className={styles.selectionIndicator}>
            ✓ Selected
          </div>
        )}
      </div>
    </button>
  );
};

// ============================================================================
// CHARACTER SELECTION SCREEN
// ============================================================================

interface CharacterSelectionProps {
  selectedHero?: HeroId | null;
  onSelectHero?: (heroId: HeroId) => void;
  onCharacterSelected?: (heroId: HeroId) => void;
  onStartGame?: () => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  selectedHero: externalSelectedHero,
  onSelectHero: externalOnSelectHero,
  onCharacterSelected,
  onStartGame,
}) => {
  const [selectedHeroId, setSelectedHeroId] = useState<HeroId | null>(
    externalSelectedHero || null
  );
  const [isStarting, setIsStarting] = useState(false);
  const selectHero = useGameStore(state => state.selectHero);

  const handleSelectHero = (heroId: HeroId) => {
    setSelectedHeroId(heroId);
    externalOnSelectHero?.(heroId);
  };

  const handleStartAdventure = () => {
    if (!selectedHeroId) return;

    setIsStarting(true);
    selectHero(selectedHeroId);

    // Call external handler if provided
    if (onStartGame) {
      setTimeout(() => {
        onStartGame();
      }, 500);
    } else if (onCharacterSelected) {
      // Fallback to old API
      setTimeout(() => {
        onCharacterSelected(selectedHeroId);
      }, 500);
    }
  };

  const isReady = selectedHeroId !== null;

  return (
    <div className={styles.characterSelectionScreen}>
      {/* Background */}
      <div className={styles.background} />

      {/* Content */}
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Choose Your Hero</h1>
          <p className={styles.subtitle}>
            Select your character and begin your adventure in the enchanted forest
          </p>
        </div>

        {/* Character Cards Grid */}
        <div className={styles.charactersGrid}>
          {ALL_HERO_IDS.map(heroId => (
            <CharacterCard
              key={heroId}
              heroId={heroId}
              isSelected={selectedHeroId === heroId}
              onSelect={handleSelectHero}
            />
          ))}
        </div>

        {/* Selected Character Details */}
        {selectedHeroId && (
          <div className={styles.selectedDetails}>
            <div className={styles.backstory}>
              <h3>Background</h3>
              <p>{HEROES[selectedHeroId].backstory}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className={styles.actions}>
          <button
            className={`${styles.startButton} ${isReady ? styles.ready : ''} ${
              isStarting ? styles.loading : ''
            }`}
            onClick={handleStartAdventure}
            disabled={!isReady || isStarting}
          >
            {isStarting ? 'Starting Adventure...' : 'Start Adventure'}
          </button>
        </div>

        {/* Help Text */}
        {!isReady && (
          <p className={styles.helpText}>
            Select a hero to continue →
          </p>
        )}
      </div>
    </div>
  );
};

export default CharacterSelection;
