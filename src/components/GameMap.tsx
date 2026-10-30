/**
 * Adventure Game - Game Map Component
 * Zeigt die 2D-Spielwelt mit Spielercharakter, NPCs und Items
 */

import React, { useState, useEffect } from 'react';
import type { NPC, Enemy, Position } from '../game/state/types';
import styles from './GameMap.module.scss';

interface GameMapProps {
  playerPosition: Position;
  npcs: NPC[];
  enemies: Enemy[];
  onInteractNPC: (npcId: string) => void;
  onCollectCoin: () => void;
  onEncounterEnemy: (enemy: Enemy) => void;
}

export const GameMap: React.FC<GameMapProps> = ({
  playerPosition,
  npcs,
  enemies,
  onInteractNPC,
  onCollectCoin,
  onEncounterEnemy,
}) => {
  const [coins, setCoins] = useState<Array<{ id: string; position: Position }>>([
    { id: 'coin_1', position: { x: 30, y: 30 } },
    { id: 'coin_2', position: { x: 70, y: 20 } },
    { id: 'coin_3', position: { x: 40, y: 70 } },
    { id: 'coin_4', position: { x: 80, y: 80 } },
    { id: 'coin_5', position: { x: 20, y: 60 } },
  ]);

  // Check for coin collection
  useEffect(() => {
    const newCoins = coins.filter((coin) => {
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - coin.position.x, 2) +
        Math.pow(playerPosition.y - coin.position.y, 2)
      );
      if (distance < 5) {
        onCollectCoin();
        return false; // Remove coin
      }
      return true;
    });

    if (newCoins.length < coins.length) {
      setCoins(newCoins);
    }
  }, [playerPosition, coins, onCollectCoin]);

  // Check for enemy encounter
  useEffect(() => {
    enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - enemy.position.x, 2) +
        Math.pow(playerPosition.y - enemy.position.y, 2)
      );
      if (distance < 8) {
        onEncounterEnemy(enemy);
      }
    });
  }, [playerPosition, enemies, onEncounterEnemy]);

  const worldWidth = 100;
  const worldHeight = 100;

  const getScreenX = (worldX: number) => (worldX / worldWidth) * 100;
  const getScreenY = (worldY: number) => (worldY / worldHeight) * 100;

  return (
    <div className={styles.gameMap}>
      {/* Background grid */}
      <div className={styles.grid}></div>

      {/* Coins */}
      {coins.map((coin) => (
        <div
          key={coin.id}
          className={styles.coin}
          style={{
            left: `${getScreenX(coin.position.x)}%`,
            top: `${getScreenY(coin.position.y)}%`,
          }}
          onClick={() => {
            onCollectCoin();
            setCoins(coins.filter((c) => c.id !== coin.id));
          }}
          title="Click to collect"
        >
          🪙
        </div>
      ))}

      {/* NPCs */}
      {npcs.map((npc) => (
        <div
          key={npc.id}
          className={styles.npc}
          style={{
            left: `${getScreenX(npc.position.x)}%`,
            top: `${getScreenY(npc.position.y)}%`,
          }}
          onClick={() => onInteractNPC(npc.id)}
          title={npc.name}
        >
          <div className={styles.npcCharacter}>🧝</div>
          <div className={styles.npcName}>{npc.name}</div>
        </div>
      ))}

      {/* Enemies */}
      {enemies.map((enemy) => (
        <div
          key={enemy.id}
          className={styles.enemy}
          style={{
            left: `${getScreenX(enemy.position.x)}%`,
            top: `${getScreenY(enemy.position.y)}%`,
          }}
          title={enemy.name}
        >
          <div className={styles.enemyCharacter}>👹</div>
          <div className={styles.enemyName}>{enemy.name}</div>
        </div>
      ))}

      {/* Player */}
      <div
        className={styles.player}
        style={{
          left: `${getScreenX(playerPosition.x)}%`,
          top: `${getScreenY(playerPosition.y)}%`,
        }}
      >
        <div className={styles.playerCharacter}>🧙</div>
        <div className={styles.playerName}>You</div>
      </div>

      {/* Controls hint */}
      <div className={styles.controls}>
        <p>Click on NPCs to interact | Collect coins 🪙 | Avoid enemies</p>
      </div>
    </div>
  );
};

export default GameMap;
