/**
 * Adventure Game - HUD Component
 * Zeigt Spielerstatistiken, Level, XP und aktive Quest
 */

import React from 'react';
import { getText } from '../../locales';
import type { Character, Quest } from '../../game/state/types';
import styles from './HUD.module.scss';

interface HUDProps {
  player: Character;
  activeQuest: Quest | undefined;
  questProgress: number;
}

export const GameHUD: React.FC<HUDProps> = ({ player, activeQuest, questProgress }) => {
  const healthPercentage = (player.stats.health / player.stats.maxHealth) * 100;
  const manaPercentage = (player.stats.mana / player.stats.maxMana) * 100;
  const xpPercentage = (player.experience / (100 * player.level)) * 100;

  return (
    <div className={styles.hud}>
      {/* Player Info */}
      <div className={styles.playerInfo}>
        <div className={styles.header}>
          <h2 className={styles.playerName}>{player.name}</h2>
          <span className={styles.level}>{getText('statLabels.level')} {player.level}</span>
        </div>

        {/* Health Bar */}
        <div className={styles.stat}>
          <label>{getText('statLabels.hp')}</label>
          <div className={styles.barContainer}>
            <div
              className={styles.bar + ' ' + styles.healthBar}
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
          <span className={styles.value}>
            {player.stats.health}/{player.stats.maxHealth}
          </span>
        </div>

        {/* Mana Bar */}
        <div className={styles.stat}>
          <label>{getText('statLabels.mana')}</label>
          <div className={styles.barContainer}>
            <div
              className={styles.bar + ' ' + styles.manaBar}
              style={{ width: `${manaPercentage}%` }}
            ></div>
          </div>
          <span className={styles.value}>
            {player.stats.mana}/{player.stats.maxMana}
          </span>
        </div>

        {/* XP Bar */}
        <div className={styles.stat}>
          <label>{getText('statLabels.xp')}</label>
          <div className={styles.barContainer}>
            <div
              className={styles.bar + ' ' + styles.xpBar}
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
          <span className={styles.value}>
            {player.experience}/{100 * player.level}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <div className={styles.icon}>⚔️</div>
          <div className={styles.statValue}>{player.stats.attack}</div>
          <div className={styles.statLabel}>{getText('statLabels.attack')}</div>
        </div>

        <div className={styles.statBox}>
          <div className={styles.icon}>🛡️</div>
          <div className={styles.statValue}>{player.stats.defense}</div>
          <div className={styles.statLabel}>{getText('statLabels.defense')}</div>
        </div>

        <div className={styles.statBox}>
          <div className={styles.icon}>✨</div>
          <div className={styles.statValue}>{player.stats.magic}</div>
          <div className={styles.statLabel}>{getText('statLabels.magic')}</div>
        </div>

        <div className={styles.statBox}>
          <div className={styles.icon}>⚡</div>
          <div className={styles.statValue}>{player.stats.speed}</div>
          <div className={styles.statLabel}>{getText('statLabels.speed')}</div>
        </div>
      </div>

      {/* Active Quest */}
      {activeQuest && (
        <div className={styles.questSection}>
          <div className={styles.questHeader}>
            <h3 className={styles.questTitle}>{activeQuest.title}</h3>
            <div className={styles.questProgress}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${questProgress}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{questProgress}%</span>
            </div>
          </div>

          <div className={styles.objectives}>
            {activeQuest.objectives.map((obj) => (
              <div key={obj.id} className={styles.objective}>
                <span className={styles.objectiveIcon}>
                  {obj.completed ? '✓' : '○'}
                </span>
                <span className={styles.objectiveText}>
                  {obj.description} ({obj.progress}/{obj.required})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHUD;
