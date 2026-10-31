/**
 * Adventure Game - Game World Component
 * Hauptspielansicht mit Spielercharakter, NPCs, Items und Kampfsystem
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getText } from '../locales';
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

  // Use separate individual selectors for each property to avoid object recreation
  const player = useGameStore((s) => s.player);
  const quests = useGameStore((s) => s.quests);
  const activeQuestId = useGameStore((s) => s.activeQuestId);
  const combatState = useGameStore((s) => s.combatState);
  const selectedHeroId = useGameStore((s) => s.selectedHeroId);

  // Get actions from store
  const startQuest = useGameStore((s) => s.startQuest);
  const completeQuest = useGameStore((s) => s.completeQuest);
  const updateQuestObjective = useGameStore((s) => s.updateQuestObjective);
  const addItem = useGameStore((s) => s.addItem);
  const initiatesCombat = useGameStore((s) => s.initiatesCombat);

  // Initialize state hooks BEFORE any conditional returns
  const [showInventory, setShowInventory] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [dialogueMessage, setDialogueMessage] = useState<string | null>(null);

  // Initialize game world on first load
  useEffect(() => {
    // If no hero selected, redirect to character selection
    if (!selectedHeroId) {
      navigate('/character-select');
      return;
    }

    // Initialize world locations
    useGameStore.setState({
      npcLocations: NPCS,
      enemyLocations: ENEMIES,
    });

    const autoSaveInterval = setInterval(() => {
      const state = useGameStore.getState();
      saveManager.save(state as any, 1);
    }, GAME_CONFIG.AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, [navigate, selectedHeroId]);

  // Interact with NPC
  const interactWithNPC = useCallback((npcId: string) => {
    const npc = NPCS[npcId];
    if (!npc) return;

    setDialogueMessage(npc.dialogue);

    if (npc.quest) {
      const questId = npc.quest;
      const quest = QUESTS[questId];
      const existingQuest = quests.find((q) => q.id === questId);

      if (!existingQuest && canStartQuest(quest, quests)) {
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
  }, [quests, startQuest]);

  // Collect coin
  const collectCoin = useCallback(() => {
    const activeQuest = quests.find(
      (q) => q.id === activeQuestId && q.status === 'active'
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

        if (objective.progress + 1 >= objective.required) {
          setTimeout(() => {
            setDialogueMessage('Quest Completed! Talk to Elder Elara for your reward.');
            completeQuest('quest_collect_coins');

            const nextQuest = QUESTS['quest_defeat_goblin'];
            setTimeout(() => {
              startQuest(nextQuest);
              setDialogueMessage('New Quest: Defeat the Goblin!');
            }, 1500);
          }, 500);
        }
      }
    } else if (!activeQuest) {
      addItem({
        id: 'gold_coin',
        name: 'Gold Coin',
        type: 'coin',
        quantity: 1,
        description: 'A shiny gold coin',
        icon: '🪙',
      });
    }
  }, [activeQuestId, quests, updateQuestObjective, addItem, completeQuest, startQuest]);

  // Handle menu exit
  const handleMenuExit = useCallback(() => {
    const state = useGameStore.getState();
    saveManager.save(state as any, 1);
    navigate('/');
  }, [navigate]);

  // Defensive: handle undefined player
  if (!player) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading game...</p>
      </div>
    );
  }

  const activeQuest = quests.find(
    (q) => q.id === activeQuestId && q.status === 'active'
  );
  const activeQuestProgress = activeQuest ? getQuestProgress(activeQuest) : 0;

  return (
    <div className={styles.gameWorld}>
      <GameMap
        playerPosition={player.position}
        npcs={Object.values(NPCS)}
        enemies={Object.values(ENEMIES)}
        onInteractNPC={interactWithNPC}
        onCollectCoin={collectCoin}
        onEncounterEnemy={(enemy) => initiatesCombat(enemy)}
      />

      <GameHUD
        player={player}
        activeQuest={activeQuest}
        questProgress={activeQuestProgress}
      />

      {combatState?.isActive && (
        <CombatUI combatState={combatState} />
      )}

      {dialogueMessage && (
        <div className={styles.dialogueBox}>
          <p>{dialogueMessage}</p>
        </div>
      )}

      <div className={styles.controlPanel}>
        <button
          className={styles.controlButton}
          onClick={() => setShowInventory(!showInventory)}
          title={getText('inventory.title')}
        >
          🎒
        </button>
        <button
          className={styles.controlButton}
          onClick={() => setShowQuestLog(!showQuestLog)}
          title={getText('quests.log')}
        >
          📜
        </button>
        <button
          className={styles.controlButton}
          onClick={handleMenuExit}
          title={getText('common.close')}
        >
          ⚙️
        </button>
      </div>

      {showInventory && (
        <Inventory
          inventory={player.inventory}
          onClose={() => setShowInventory(false)}
        />
      )}

      {showQuestLog && (
        <QuestLog
          quests={quests}
          activeQuestId={activeQuestId}
          onClose={() => setShowQuestLog(false)}
        />
      )}
    </div>
  );
};

export default GameWorld;
