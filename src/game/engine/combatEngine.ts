/**
 * Adventure Game - Combat Engine
 * Rundenbasierte Kampflogik
 */

import type { Character, Enemy, CombatMove } from '../state/types';
import { BALANCE } from '../data/config';

// ============================================================================
// COMBAT LOGIC
// ============================================================================

/**
 * Berechnet den Schaden basierend auf Angriff und Verteidigung
 */
export const calculateDamage = (
  attacker: Character | Enemy,
  defender: Character | Enemy,
  action: 'attack' | 'magic' = 'attack'
): number => {
  const isCharacter = 'class' in attacker;
  const stats = isCharacter ? attacker.stats : (attacker as Enemy).stats;
  const defenderStats = 'class' in defender ? defender.stats : (defender as Enemy).stats;

  let baseDamage = action === 'magic' ? stats.magic : stats.attack;
  const variance = 1 + (Math.random() * 2 - 1) * BALANCE.DAMAGE_VARIANCE;
  const defense = action === 'magic' ? defenderStats.magicDefense : defenderStats.defense;

  const reducedDamage = Math.max(1, baseDamage - defense * 0.3);
  const finalDamage = Math.floor(reducedDamage * variance);

  // Critical hit
  if (Math.random() < BALANCE.CRITICAL_CHANCE) {
    return Math.floor(finalDamage * BALANCE.CRITICAL_MULTIPLIER);
  }

  return finalDamage;
};

/**
 * Simuliert einen Kampfzug
 */
export const executeCombatRound = (
  playerMove: CombatMove,
  enemyAI: Enemy
): { playerMessage: string; enemyMessage: string } => {
  let playerMessage = '';
  let enemyMessage = '';

  switch (playerMove.action) {
    case 'attack':
      playerMessage = `Attack chosen!`;
      break;
    case 'defend':
      playerMessage = `Defensive stance taken!`;
      break;
    case 'magic':
      playerMessage = `Magic spell prepared!`;
      break;
    case 'potion':
      playerMessage = `Potion used!`;
      break;
    case 'flee':
      playerMessage = `Attempted to flee!`;
      break;
    default:
      playerMessage = `Unknown action!`;
  }

  // Enemy AI - simple random action
  const enemyActions: Array<'attack' | 'defend'> = ['attack', 'defend'];
  const enemyAction = enemyActions[Math.floor(Math.random() * enemyActions.length)];
  enemyMessage = `${enemyAI.name} uses ${enemyAction}!`;

  return { playerMessage, enemyMessage };
};

/**
 * Generiert Beute aus der Beute-Tabelle eines Gegners
 */
export const generateLoot = (enemy: Enemy): Record<string, number> => {
  const loot: Record<string, number> = {};

  enemy.lootTable.forEach(({ itemId, probability, quantity }) => {
    if (Math.random() < probability) {
      const variance = 1 + (Math.random() * 2 - 1) * BALANCE.LOOT_VARIANCE;
      const finalQuantity = Math.max(1, Math.floor(quantity * variance));
      loot[itemId] = (loot[itemId] || 0) + finalQuantity;
    }
  });

  return loot;
};

/**
 * Überprüft den Kampfstatus (Kampf beendet?)
 */
export const isCombatOver = (character: Character, enemy: Enemy): boolean => {
  return character.stats.health <= 0 || enemy.stats.health <= 0;
};

/**
 * Bestimmt den Kampfsieger
 */
export const determineCombatWinner = (
  character: Character,
  enemy: Enemy
): 'player' | 'enemy' | 'draw' => {
  if (character.stats.health <= 0 && enemy.stats.health <= 0) return 'draw';
  if (character.stats.health <= 0) return 'enemy';
  if (enemy.stats.health <= 0) return 'player';
  return 'draw'; // Should not happen
};
