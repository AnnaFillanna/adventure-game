/**
 * Adventure Game - Enhanced Combat UI Component
 * Premium combat interface with animations and visual feedback
 */

import React, { useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';
import styles from './EnhancedCombatUI.module.scss';

interface DamagePopup {
  id: string;
  amount: number;
  x: number;
  y: number;
  isHeal: boolean;
  isCritical: boolean;
}

export const EnhancedCombatUI: React.FC = () => {
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const combatState = useGameStore((state) => state.combatState);
  const player = useGameStore((state) => state.player);
  const executeAction = useGameStore((state) => state.executeCombatAction);

  if (!combatState?.enemy) {
    return null;
  }

  const enemy = combatState.enemy;
  const playerHpPercent = (player.stats.health / player.stats.maxHealth) * 100;
  const enemyHpPercent = (enemy.stats.health / enemy.stats.maxHealth) * 100;

  const handleAction = (action: string) => {
    // Add action feedback
    setActionFeedback(action);
    setTimeout(() => setActionFeedback(null), 1000);

    // Execute combat action
    executeAction(action, enemy.id);

    // Simulate damage popup (in real implementation, this would come from game engine)
    const damage = Math.floor(Math.random() * 30) + 10;
    const popup: DamagePopup = {
      id: `${Date.now()}-${Math.random()}`,
      amount: damage,
      x: Math.random() * 200 - 100,
      y: Math.random() * 50,
      isHeal: false,
      isCritical: Math.random() > 0.7,
    };

    setDamagePopups((prev) => [...prev, popup]);
    setTimeout(
      () => {
        setDamagePopups((prev) => prev.filter((p) => p.id !== popup.id));
      },
      1500
    );
  };

  return (
    <div className={styles.combatContainer}>
      {/* Enemy Info */}
      <div className={styles.combatRow}>
        <div className={styles.combatant}>
          <div className={styles.portrait}>
            <span className={styles.portraitIcon}>👹</span>
          </div>

          <div className={styles.info}>
            <h3 className={styles.name}>{enemy.name}</h3>
            <p className={styles.level}>Lvl {enemy.level}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statRow}>
            <label>HP</label>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${enemyHpPercent < 30 ? styles.critical : ''}`}
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
            <span className={styles.value}>
              {enemy.stats.health}/{enemy.stats.maxHealth}
            </span>
          </div>
        </div>
      </div>

      {/* VS Text */}
      <div className={styles.vsText}>VS</div>

      {/* Player Info */}
      <div className={styles.combatRow}>
        <div className={styles.stats}>
          <div className={styles.statRow}>
            <label>HP</label>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${playerHpPercent < 30 ? styles.critical : ''}`}
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
            <span className={styles.value}>
              {player.stats.health}/{player.stats.maxHealth}
            </span>
          </div>
        </div>

        <div className={styles.combatant}>
          <div className={styles.portrait}>
            <span className={styles.portraitIcon}>🧙</span>
          </div>

          <div className={styles.info}>
            <h3 className={styles.name}>{player.name}</h3>
            <p className={styles.level}>Lvl {player.level}</p>
          </div>
        </div>
      </div>

      {/* Damage Popups */}
      {damagePopups.map((popup) => (
        <div
          key={popup.id}
          className={`${styles.damagePopup} ${popup.isCritical ? styles.critical : ''}`}
          style={{
            left: `calc(50% + ${popup.x}px)`,
            top: `calc(50% + ${popup.y}px)`,
          }}
        >
          {popup.isCritical && <span className={styles.criticalText}>CRIT!</span>}
          {popup.amount}
        </div>
      ))}

      {/* Action Feedback */}
      {actionFeedback && (
        <div className={styles.actionFeedback}>
          {actionFeedback.toUpperCase()}!
        </div>
      )}

      {/* Combat Actions */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.attack}`}
          onClick={() => handleAction('attack')}
          title="Deal physical damage"
        >
          <span className={styles.icon}>⚔️</span>
          <span className={styles.label}>Attack</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.defense}`}
          onClick={() => handleAction('defense')}
          title="Reduce incoming damage"
        >
          <span className={styles.icon}>🛡️</span>
          <span className={styles.label}>Defend</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.magic}`}
          onClick={() => handleAction('magic')}
          title="Use magical abilities"
        >
          <span className={styles.icon}>✨</span>
          <span className={styles.label}>Magic</span>
        </button>

        <button
          className={`${styles.actionButton} ${styles.potion}`}
          onClick={() => handleAction('potion')}
          title="Restore health"
        >
          <span className={styles.icon}>🧪</span>
          <span className={styles.label}>Potion</span>
        </button>
      </div>

      {/* Combat Log */}
      <div className={styles.combatLog}>
        <p className={styles.logEntry}>Combat started with {enemy.name}</p>
      </div>
    </div>
  );
};
