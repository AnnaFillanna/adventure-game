/**
 * Adventure Game - Combat UI Component
 * Rundenbasiertes Kampf-Interface
 */

import React from 'react';
import { getText } from '../../locales';
import { useGameStore } from '../../game/state/gameStore';
import type { CombatState } from '../../game/state/types';
import styles from './CombatUI.module.scss';

interface CombatUIProps {
  combatState: CombatState;
}

export const CombatUI: React.FC<CombatUIProps> = ({ combatState }) => {
  const { executeCombatAction, endCombat } = useGameStore((state) => ({
    executeCombatAction: state.executeCombatAction,
    endCombat: state.endCombat,
  }));

  const { playerCharacter, enemy, combatLog, playerTurn, reward } = combatState;

  if (!enemy) return null;

  const playerHealthPercent = (playerCharacter.stats.health / playerCharacter.stats.maxHealth) * 100;
  const enemyHealthPercent = (enemy.stats.health / enemy.stats.maxHealth) * 100;

  return (
    <div className={styles.combatOverlay}>
      <div className={styles.combatContainer}>
        {/* Combat Title */}
        <h2 className={styles.title}>⚔️ {getText('combat.title')} ⚔️</h2>

        {/* Combatants */}
        <div className={styles.combatants}>
          {/* Player */}
          <div className={styles.character + ' ' + styles.player}>
            <div className={styles.characterIcon}>🧙</div>
            <h3>{playerCharacter.name}</h3>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span>{getText('statLabels.hp')}:</span>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar + ' ' + styles.healthBar}
                    style={{ width: `${playerHealthPercent}%` }}
                  ></div>
                </div>
                <span className={styles.value}>
                  {playerCharacter.stats.health}/{playerCharacter.stats.maxHealth}
                </span>
              </div>
              <div className={styles.stat}>
                <span>{getText('statLabels.level')}:</span>
                <span className={styles.value}>{playerCharacter.level}</span>
              </div>
            </div>
          </div>

          {/* VS */}
          <div className={styles.vs}>{getText('combat.vs')}</div>

          {/* Enemy */}
          <div className={styles.character + ' ' + styles.enemy}>
            <div className={styles.characterIcon}>👹</div>
            <h3>{enemy.name}</h3>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span>{getText('statLabels.hp')}:</span>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar + ' ' + styles.healthBar}
                    style={{ width: `${enemyHealthPercent}%` }}
                  ></div>
                </div>
                <span className={styles.value}>
                  {enemy.stats.health}/{enemy.stats.maxHealth}
                </span>
              </div>
              <div className={styles.stat}>
                <span>{getText('statLabels.level')}:</span>
                <span className={styles.value}>{enemy.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Log */}
        <div className={styles.combatLog}>
          <h4>{getText('combat.log')}</h4>
          <div className={styles.logEntries}>
            {combatLog.slice(-5).map((log, i) => (
              <p key={i} className={styles.logEntry}>
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* Combat Actions */}
        <div className={styles.actions}>
          {!reward && playerTurn && (
            <>
              <button
                className={styles.actionButton + ' ' + styles.attack}
                onClick={() => executeCombatAction('attack')}
              >
                ⚔️ {getText('combat.actions.attack')}
              </button>
              <button
                className={styles.actionButton + ' ' + styles.defend}
                onClick={() => executeCombatAction('defend')}
              >
                🛡️ {getText('combat.actions.defend')}
              </button>
              <button
                className={styles.actionButton + ' ' + styles.magic}
                onClick={() => executeCombatAction('magic')}
              >
                ✨ {getText('combat.actions.magic')}
              </button>
              <button
                className={styles.actionButton + ' ' + styles.potion}
                onClick={() => executeCombatAction('potion')}
              >
                🧪 {getText('combat.actions.potion')}
              </button>
            </>
          )}

          {reward && (
            <div className={styles.reward}>
              <h4>{getText('combat.feedback.victoryMessage')}</h4>
              <p>{getText('rewards.xp', { amount: reward.xp })}</p>
              <p>{getText('rewards.gold', { amount: reward.gold })}</p>
              <button className={styles.continueButton} onClick={endCombat}>
                {getText('common.continue')}
              </button>
            </div>
          )}

          {playerCharacter.stats.health <= 0 && (
            <div className={styles.defeat}>
              <h4>💀 {getText('combat.feedback.defeated')} 💀</h4>
              <p>{getText('combat.feedback.defeatMessage')}</p>
              <button className={styles.continueButton} onClick={endCombat}>
                {getText('common.continue')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombatUI;
