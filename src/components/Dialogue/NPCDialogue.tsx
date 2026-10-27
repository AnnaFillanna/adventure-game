/**
 * Adventure Game - NPC Dialogue UI Component
 * Premium dialogue interface with character portrait, text, and choices
 */

import React, { useEffect, useState } from 'react';
import type { DialogueNode } from '../../game/systems/dialogueSystem';
import { DialogueManager } from '../../game/systems/dialogueSystem';
import styles from './NPCDialogue.module.scss';

interface NPCDialogueProps {
  npcId: string;
  questCompleted?: string;
  onDialogueEnd?: () => void;
  onQuestAccept?: (questId: string) => void;
}

export const NPCDialogue: React.FC<NPCDialogueProps> = ({
  npcId,
  questCompleted,
  onDialogueEnd,
  onQuestAccept,
}) => {
  const [manager] = useState(() => new DialogueManager());
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize dialogue on mount
  useEffect(() => {
    const dialogue = manager.startDialogue(npcId, questCompleted);
    if (dialogue) {
      setCurrentDialogue(dialogue);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [npcId, questCompleted, manager]);

  if (!currentDialogue) {
    return null;
  }

  const npc = manager.getNPCInfo();
  if (!npc) {
    return null;
  }

  const handleOptionClick = (optionId: string) => {
    const option = currentDialogue.options.find((o) => o.id === optionId);
    if (!option) return;

    // Handle quest acceptance
    if (option.action === 'accept_quest' && currentDialogue.questId) {
      onQuestAccept?.(currentDialogue.questId);
    }

    // Get next dialogue or end
    const nextDialogue = manager.selectOption(optionId);

    if (nextDialogue) {
      setIsAnimating(true);
      setCurrentDialogue(nextDialogue);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      // Dialogue ended
      onDialogueEnd?.();
    }
  };

  return (
    <div className={styles.dialogueOverlay}>
      <div className={`${styles.dialogueContainer} ${isAnimating ? styles.animating : ''}`}>
        {/* NPC Profile Section */}
        <div className={styles.npcProfile}>
          <div className={styles.portrait}>{npc.portrait}</div>
          <div className={styles.npcInfo}>
            <h2 className={styles.npcName}>{npc.name}</h2>
            <p className={styles.npcTitle}>{npc.title}</p>
          </div>
        </div>

        {/* Dialogue Text */}
        <div className={styles.dialogueContent}>
          <p className={styles.dialogueText}>{currentDialogue.text}</p>
        </div>

        {/* Options / Choices */}
        <div className={styles.options}>
          {currentDialogue.options.map((option) => (
            <button
              key={option.id}
              className={`${styles.optionButton} ${styles[option.action]}`}
              onClick={() => handleOptionClick(option.id)}
              disabled={isAnimating}
            >
              <span className={styles.optionText}>{option.text}</span>
              {option.action === 'accept_quest' && <span className={styles.questIcon}>📜</span>}
              {option.action === 'decline_quest' && <span className={styles.declineIcon}>✕</span>}
              {option.action === 'continue' && <span className={styles.continueIcon}>→</span>}
              {option.action === 'end' && <span className={styles.endIcon}>✓</span>}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button className={styles.closeButton} onClick={onDialogueEnd} title="Close dialogue">
          ✕
        </button>
      </div>
    </div>
  );
};
