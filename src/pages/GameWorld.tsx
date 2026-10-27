/**
 * Adventure Game - Game World Component
 * Hauptspielansicht mit Spielercharakter, NPCs, Items und Kampfsystem
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { NPCS, ENEMIES, QUESTS, GAME_CONFIG } from '../game/data/config';
import { canStartQuest, getQuestProgress, getNextIncompleteObjective } from '../game/engine/questEngine';
import { saveManager } from '../game/utils/storage';
import { GameHUD } from '../components/UI/HUD';
import { CombatUI } from '../components/UI/CombatUI';
import { QuestLog } from '../components/UI/QuestLog';
import { Inventory } from '../components/UI/Inventory';
import { GameMap } from '../components/GameMap';
import styles from './GameWorld.module.scss';

export const GameWorld: React.FC = () => {
  const navigate = useNavigate();
  const gameState = useGameStore((state) => ({
    player: state.player,
    quests: state.quests,
    activeQuestId: state.activeQuestId,
    combatState: state.combatState,
    npcLocations: state.npcLocations,
    enemyLocations: state.enemyLocations,
  }));

  const {
    startQuest,
    completeQuest,
    updateQuestObjective,
    addItem,
    initiatesCombat,
  } = useGameStore((state) => ({
    startQuest: state.startQuest,
    completeQuest: state.completeQuest,
    updateQuestObjective: state.updateQuestObjective,
    movePlayer: state.movePlayer,
    addItem: state.addItem,
    initiatesCombat: state.initiatesCombat,
  }));

  const [showInventory, setShowInventory] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [dialogueMessage, setDialogueMessage] = useState<string | null>(null);

  // Initialize game world on first load
  useEffect(() => {
    // Initialize NPCs and Enemies
    useGameStore.setState({
      npcLocations: NPCS,
      enemyLocations: ENEMIES,
    });

    // Auto-save periodically
    const autoSaveInterval = setInterval(() => {
      const state = useGameStore.getState();
      saveManager.save(state as any, 1);
    }, GAME_CONFIG.AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, []);

  // Interact with NPC
  const interactWithNPC = (npcId: string) => {
    const npc = NPCS[npcId];
    if (!npc) return;

    setDialogueMessage(npc.dialogue);

    // Check if NPC offers a quest
    if (npc.quest) {
      const questId = npc.quest;
      const quest = QUESTS[questId];
      const existingQuest = gameState.quests.find((q) => q.id === questId);

      // If quest not started and prerequisites are met
      if (!existingQuest && canStartQuest(quest, gameState.quests)) {
        setTimeout(() => {
          startQuest(quest);
          setDialogueMessage(`${npc.name}: ${npc.dialogue}\n\n[Quest Started: ${quest.title}]`);
        }, 500);
      } else if (existingQuest?.status === 'active' && questId === 'quest_collect_coins') {
        const nextObj = getNextIncompleteObjective(existingQuest);
        if (nextObj) {
          setDialogueMessage(
            `${npc.name}: ${nextObj.description} (${nextObj.progress}/${nextObj.required})`
          );
        }
      } else if (existingQuest?.status === 'active' && questId === 'quest_defeat_goblin') {
        setDialogueMessage(`${npc.name}: Have you defeated the goblin yet?`);
      }
    }

    setTimeout(() => setDialogueMessage(null), 3000);
  };

  // Simulate coin collection
  const collectCoin = () => {
    const activeQuest = gameState.quests.find(
      (q) => q.id === gameState.activeQuestId && q.status === 'active'
    );

    if (activeQuest?.id === 'quest_collect_coins') {
      const objective = activeQuest.objectives[0];
      if (objective && !objective.completed) {
        updateQuestObjective('quest_collect_coins', objective.id, objective.progress + 1);
        addItem({
          id: 'gold_coin',
          name: 'Gold Coin',
          type: 'coin',
          quantity: 1,
          description: 'A shiny gold coin',
          icon: '🪙',
        });

        // Check if quest is complete
        if (objective.progress + 1 >= objective.required) {
          setTimeout(() => {
            setDialogueMessage('Quest Completed! Talk to Elder Elara for your reward.');
            completeQuest('quest_collect_coins');

            // Start next quest
            const nextQuest = QUESTS['quest_defeat_goblin'];
            setTimeout(() => {
              startQuest(nextQuest);
              setDialogueMessage('New Quest: Defeat the Goblin!');
            }, 1500);
          }, 500);
        }
      }
    } else if (!activeQuest) {
      // Just collect the coin if no active quest
      addItem({
        id: 'gold_coin',
        name: 'Gold Coin',
        type: 'coin',
        quantity: 1,
        description: 'A shiny gold coin',
        icon: '🪙',
      });
    }
  };

  // Handle menu navigation
  const handleMenuExit = () => {
    const state = useGameStore.getState();
    saveManager.save(state as any, 1);
    navigate('/');
  };

  const activeQuest = gameState.quests.find(
    (q) => q.id === gameState.activeQuestId && q.status === 'active'
  );
  const activeQuestProgress = activeQuest ? getQuestProgress(activeQuest) : 0;

  return (
    <div className={styles.gameWorld}>
      {/* Game Map */}
      <GameMap
        playerPosition={gameState.player.position}
        npcs={Object.values(NPCS)}
        enemies={Object.values(ENEMIES)}
        onInteractNPC={interactWithNPC}
        onCollectCoin={collectCoin}
        onEncounterEnemy={(enemy) => initiatesCombat(enemy)}
      />

      {/* HUD (Top-left stats) */}
      <GameHUD
        player={gameState.player}
        activeQuest={activeQuest}
        questProgress={activeQuestProgress}
      />

      {/* Combat UI (if in combat) */}
      {gameState.combatState?.isActive && (
        <CombatUI combatState={gameState.combatState} />
      )}

      {/* Dialogue Message */}
      {dialogueMessage && (
        <div className={styles.dialogueBox}>
          <p>{dialogueMessage}</p>
        </div>
      )}

      {/* Bottom Control Panel */}
      <div className={styles.controlPanel}>
        <button
          className={styles.controlButton}
          onClick={() => setShowInventory(!showInventory)}
          title="Inventory"
        >
          🎒
        </button>
        <button
          className={styles.controlButton}
          onClick={() => setShowQuestLog(!showQuestLog)}
          title="Quest Log"
        >
          📜
        </button>
        <button
          className={styles.controlButton}
          onClick={handleMenuExit}
          title="Menu"
        >
          ⚙️
        </button>
      </div>

      {/* Inventory Modal */}
      {showInventory && (
        <Inventory
          inventory={gameState.player.inventory}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* Quest Log Modal */}
      {showQuestLog && (
        <QuestLog
          quests={gameState.quests}
          activeQuestId={gameState.activeQuestId}
          onClose={() => setShowQuestLog(false)}
        />
      )}
    </div>
  );
};

export default GameWorld;
