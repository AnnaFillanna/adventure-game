/**
 * Adventure Game - Combat UI Component
 * Rundenbasiertes Kampf-Interface
 */

import React from 'react';
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
        <h2 className={styles.title}>⚔️ Combat ⚔️</h2>

        {/* Combatants */}
        <div className={styles.combatants}>
          {/* Player */}
          <div className={styles.character + ' ' + styles.player}>
            <div className={styles.characterIcon}>🧙</div>
            <h3>{playerCharacter.name}</h3>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span>HP:</span>
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
                <span>Level:</span>
                <span className={styles.value}>{playerCharacter.level}</span>
              </div>
            </div>
          </div>

          {/* VS */}
          <div className={styles.vs}>VS</div>

          {/* Enemy */}
          <div className={styles.character + ' ' + styles.enemy}>
            <div className={styles.characterIcon}>👹</div>
            <h3>{enemy.name}</h3>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span>HP:</span>
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
                <span>Level:</span>
                <span className={styles.value}>{enemy.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Log */}
        <div className={styles.combatLog}>
          <h4>Combat Log</h4>
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
                ⚔️ Attack
              </button>
              <button
                className={styles.actionButton + ' ' + styles.defend}
                onClick={() => executeCombatAction('defend')}
              >
                🛡️ Defend
              </button>
              <button
                className={styles.actionButton + ' ' + styles.magic}
                onClick={() => executeCombatAction('magic')}
              >
                ✨ Magic
              </button>
              <button
                className={styles.actionButton + ' ' + styles.potion}
                onClick={() => executeCombatAction('potion')}
              >
                🧪 Potion
              </button>
            </>
          )}

          {reward && (
            <div className={styles.reward}>
              <h4>🎉 Victory! 🎉</h4>
              <p>+{reward.xp} XP</p>
              <p>+{reward.gold} Gold</p>
              <button className={styles.continueButton} onClick={endCombat}>
                Continue
              </button>
            </div>
          )}

          {playerCharacter.stats.health <= 0 && (
            <div className={styles.defeat}>
              <h4>💀 Defeated! 💀</h4>
              <p>You were defeated in combat.</p>
              <button className={styles.continueButton} onClick={endCombat}>
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombatUI;
