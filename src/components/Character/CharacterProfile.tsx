/**
 * Adventure Game - Character Profile Component
 * Displays player stats, level, equipment, and progression
 */

import React from 'react';
import { useGameStore } from '../../game/state/gameStore';
import styles from './CharacterProfile.module.scss';

export const CharacterProfile: React.FC = () => {
  const player = useGameStore((state) => state.player);
  const level = useGameStore((state) => state.level);
  const totalXP = useGameStore((state) => state.totalXP);

  const nextLevelXP = level * 100;
  const xpTowardNextLevel = totalXP % nextLevelXP;
  const xpProgressPercent = (xpTowardNextLevel / nextLevelXP) * 100;

  return (
    <div className={styles.profileCard}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarIcon}>🧙</span>
        </div>
        <div className={styles.titleSection}>
          <h2 className={styles.playerName}>{player.name}</h2>
          <p className={styles.playerClass}>{player.class.toUpperCase()}</p>
        </div>
      </div>

      <div className={styles.stats}>
        {/* Level Section */}
        <div className={styles.statGroup}>
          <label>Level</label>
          <div className={styles.levelDisplay}>{level}</div>
        </div>

        {/* Health */}
        <div className={styles.statGroup}>
          <label>Health Points</label>
          <div className={styles.statRow}>
            <div className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{
                  width: `${(player.stats.health / player.stats.maxHealth) * 100}%`,
                  backgroundColor: player.stats.health > player.stats.maxHealth * 0.3 ? '#7cb342' : '#d32f2f',
                }}
              />
            </div>
            <span className={styles.statValue}>
              {player.stats.health}/{player.stats.maxHealth}
            </span>
          </div>
        </div>

        {/* Mana */}
        <div className={styles.statGroup}>
          <label>Mana Points</label>
          <div className={styles.statRow}>
            <div className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{
                  width: `${(player.stats.mana / player.stats.maxMana) * 100}%`,
                  backgroundColor: '#1e88e5',
                }}
              />
            </div>
            <span className={styles.statValue}>
              {player.stats.mana}/{player.stats.maxMana}
            </span>
          </div>
        </div>

        {/* Experience */}
        <div className={styles.statGroup}>
          <label>Experience</label>
          <div className={styles.statRow}>
            <div className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{
                  width: `${xpProgressPercent}%`,
                  backgroundColor: '#fdd835',
                }}
              />
            </div>
            <span className={styles.statValue}>{xpTowardNextLevel}/{nextLevelXP}</span>
          </div>
        </div>
      </div>

      <div className={styles.attributes}>
        <div className={styles.attribute}>
          <span className={styles.label}>ATK</span>
          <span className={styles.value}>{player.stats.attack}</span>
        </div>
        <div className={styles.attribute}>
          <span className={styles.label}>DEF</span>
          <span className={styles.value}>{player.stats.defense}</span>
        </div>
        <div className={styles.attribute}>
          <span className={styles.label}>MAG</span>
          <span className={styles.value}>{player.stats.magic}</span>
        </div>
        <div className={styles.attribute}>
          <span className={styles.label}>SPD</span>
          <span className={styles.value}>{player.stats.speed}</span>
        </div>
      </div>

      <div className={styles.equipment}>
        <h3 className={styles.equipmentTitle}>Equipment</h3>
        <div className={styles.equipmentSlots}>
          <div className={styles.slot}>
            <span className={styles.icon}>🎯</span>
            <span className={styles.name}>Weapon</span>
          </div>
          <div className={styles.slot}>
            <span className={styles.icon}>🛡️</span>
            <span className={styles.name}>Armor</span>
          </div>
          <div className={styles.slot}>
            <span className={styles.icon}>💍</span>
            <span className={styles.name}>Ring</span>
          </div>
        </div>
      </div>
    </div>
  );
};
