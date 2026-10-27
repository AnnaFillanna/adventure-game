/**
 * Adventure Game - Quest Log Component
 */

import React from 'react';
import type { Quest } from '../../game/state/types';
import { getQuestProgress } from '../../game/engine/questEngine';
import styles from './QuestLog.module.scss';

interface QuestLogProps {
  quests: Quest[];
  activeQuestId: string | null;
  onClose: () => void;
}

export const QuestLog: React.FC<QuestLogProps> = ({ quests, activeQuestId, onClose }) => {
  const activeQuests = quests.filter((q) => q.status === 'active');
  const completedQuests = quests.filter((q) => q.status === 'completed');

  return (
    <div className={styles.questLogOverlay} onClick={onClose}>
      <div className={styles.questLogContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>📜 Quest Log</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Active Quests */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Active Quests ({activeQuests.length})</h3>
          {activeQuests.length > 0 ? (
            <div className={styles.questsList}>
              {activeQuests.map((quest) => {
                const progress = getQuestProgress(quest);
                const isActive = quest.id === activeQuestId;
                return (
                  <div
                    key={quest.id}
                    className={
                      styles.questItem +
                      ' ' +
                      (isActive ? styles.active : '')
                    }
                  >
                    <div className={styles.questHeader}>
                      <h4>{quest.title}</h4>
                      <span className={styles.progress}>{progress}%</span>
                    </div>
                    <p className={styles.description}>{quest.description}</p>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className={styles.objectives}>
                      {quest.objectives.map((obj) => (
                        <div key={obj.id} className={styles.objective}>
                          <span className={styles.icon}>
                            {obj.completed ? '✓' : '○'}
                          </span>
                          <span>{obj.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={styles.empty}>No active quests</p>
          )}
        </div>

        {/* Completed Quests */}
        {completedQuests.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Completed ({completedQuests.length})</h3>
            <div className={styles.completedList}>
              {completedQuests.map((quest) => (
                <div key={quest.id} className={styles.completedItem}>
                  <span className={styles.icon}>✓</span>
                  <span>{quest.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className={styles.closeMainButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default QuestLog;
