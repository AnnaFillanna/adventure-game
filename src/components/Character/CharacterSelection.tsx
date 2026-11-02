/**
 * Adventure Game - Character Selection Screen
 * Mobile-first UI with 3-column compact card grid and detail area
 */

import React, { useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';
import { HEROES, ALL_HERO_IDS } from '../../game/characters/heroDefinitions';
import type { HeroId } from '../../game/characters/types';
import { getText } from '../../locales';
import styles from './CharacterSelection.module.scss';

// ============================================================================
// COMPACT CHARACTER CARD COMPONENT
// ============================================================================

interface CompactCharacterCardProps {
  heroId: HeroId;
  isSelected: boolean;
  onSelect: (heroId: HeroId) => void;
}

const CompactCharacterCard: React.FC<CompactCharacterCardProps> = ({
  heroId,
  isSelected,
  onSelect,
}) => {
  const hero = HEROES[heroId];

  return (
    <button
      className={`${styles.compactCard} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(heroId)}
      aria-pressed={isSelected}
      title={hero.name}
    >
      <div className={styles.cardInner}>
        {/* Hero Icon */}
        <div className={styles.heroIconCompact}>{hero.icon}</div>

        {/* Hero Name */}
        <h3 className={styles.heroNameCompact}>{hero.name}</h3>

        {/* Selection Indicator */}
        {isSelected && (
          <div className={styles.checkmark}>✓</div>
        )}
      </div>
    </button>
  );
};

// ============================================================================
// DETAIL PANEL COMPONENT
// ============================================================================

interface DetailPanelProps {
  heroId: HeroId | null;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ heroId }) => {
  if (!heroId) {
    return (
      <div className={styles.detailsContainer}>
        <p className={styles.noSelectionMessage}>Select a hero to view details</p>
      </div>
    );
  }

  const hero = HEROES[heroId];

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailHeader}>
        {/* Icon and Name */}
        <div className={styles.heroIdentity}>
          <div className={styles.heroIconDetail}>{hero.icon}</div>
          <div className={styles.nameAndClass}>
            <h2 className={styles.heroNameDetail}>{hero.name}</h2>
            <p className={styles.heroClassDetail}>{hero.class}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={styles.descriptionBox}>
        <p>{hero.description}</p>
      </div>

      {/* Abilities */}
      <div className={styles.abilitiesBox}>
        <h3>{getText('characterSelection.abilities')}</h3>
        <ul className={styles.abilitiesList}>
          {hero.abilities.map(ability => (
            <li key={ability.id} className={styles.abilityItem}>
              <span className={styles.abilityIcon}>{ability.icon}</span>
              <div className={styles.abilityDetails}>
                <span className={styles.abilityName}>{ability.name}</span>
                <span className={styles.abilityDescription}>{ability.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
          <h1 className={styles.title}>{getText('characterSelection.title')}</h1>
          <p className={styles.subtitle}>
            {getText('characterSelection.subtitle')}
          </p>
        </div>

        {/* Compact Character Cards Grid - 3 columns on mobile */}
        <div className={styles.compactCardsGrid}>
          {ALL_HERO_IDS.map(heroId => (
            <CompactCharacterCard
              key={heroId}
              heroId={heroId}
              isSelected={selectedHeroId === heroId}
              onSelect={handleSelectHero}
            />
          ))}
        </div>

        {/* Detail Panel for Selected Hero */}
        <DetailPanel heroId={selectedHeroId} />

        {/* Action Button */}
        <div className={styles.actions}>
          <button
            className={`${styles.startButton} ${isReady ? styles.ready : ''} ${
              isStarting ? styles.loading : ''
            }`}
            onClick={handleStartAdventure}
            disabled={!isReady || isStarting}
          >
            {isStarting ? getText('characterSelection.startingAdventure') : getText('characterSelection.startAdventure')}
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
