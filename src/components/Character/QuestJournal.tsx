/**
 * Adventure Game - Quest Journal Component
 * Displays active quests, progress, and completed quest history
 */

import React, { useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';
import styles from './QuestJournal.module.scss';

interface QuestDisplay {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  status: 'active' | 'completed';
}

export const QuestJournal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const quests = useGameStore((state) => state.quests);
  const level = useGameStore((state) => state.level);

  const questsDisplay: QuestDisplay[] = quests.map((quest) => ({
    id: quest.id,
    title: quest.title,
    description: quest.description,
    progress: quest.objectives?.[0]?.progress || 0,
    maxProgress: quest.objectives?.length || 1,
    reward: quest.rewards?.xp || 100,
    status: quest.status === 'completed' ? 'completed' : 'active',
  }));

  const activeQuests = questsDisplay.filter((q) => q.status === 'active');
  const completedQuests = questsDisplay.filter((q) => q.status === 'completed');

  const chapterProgress = [
    {
      chapter: 'Chapter 1: The Lost Kingdom',
      unlocked: level >= 1,
      completed: level > 1,
    },
    {
      chapter: 'Chapter 2: Whispers in the Dark',
      unlocked: level >= 5,
      completed: level > 5,
    },
    {
      chapter: 'Chapter 3: The Shadow Realm',
      unlocked: level >= 10,
      completed: level > 10,
    },
  ];

  return (
    <div className={styles.journalContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>📖 Quest Journal</h2>
        <div className={styles.chapterBadge}>
          Level {level}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Quests ({activeQuests.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completedQuests.length})
        </button>
      </div>

      {/* Active Quests Tab */}
      {activeTab === 'active' && (
        <div className={styles.questList}>
          {activeQuests.length > 0 ? (
            activeQuests.map((quest) => (
              <div key={quest.id} className={styles.questCard}>
                <div className={styles.questHeader}>
                  <h3 className={styles.questTitle}>{quest.title}</h3>
                  <span className={styles.reward}>
                    ⭐ {quest.reward} XP
                  </span>
                </div>

                <p className={styles.description}>{quest.description}</p>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${(quest.progress / quest.maxProgress) * 100}%`,
                    }}
                  />
                </div>

                <div className={styles.progressText}>
                  {quest.progress}/{quest.maxProgress} completed
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No active quests</p>
              <p className={styles.hint}>Explore the world to find new quests</p>
            </div>
          )}
        </div>
      )}

      {/* Completed Quests Tab */}
      {activeTab === 'completed' && (
        <div className={styles.questList}>
          {completedQuests.length > 0 ? (
            completedQuests.map((quest) => (
              <div key={quest.id} className={`${styles.questCard} ${styles.completed}`}>
                <div className={styles.questHeader}>
                  <h3 className={styles.questTitle}>
                    ✓ {quest.title}
                  </h3>
                  <span className={styles.reward}>
                    ⭐ {quest.reward} XP
                  </span>
                </div>

                <p className={styles.description}>{quest.description}</p>

                <div className={styles.completionBadge}>
                  Completed!
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No completed quests yet</p>
              <p className={styles.hint}>Complete quests to see them here</p>
            </div>
          )}
        </div>
      )}

      {/* Chapter Progress */}
      <div className={styles.chapterSection}>
        <h3 className={styles.sectionTitle}>Story Progress</h3>
        <div className={styles.chapterList}>
          {chapterProgress.map((ch) => (
            <div
              key={ch.chapter}
              className={`${styles.chapterItem} ${ch.unlocked ? styles.unlocked : ''} ${
                ch.completed ? styles.completed : ''
              }`}
            >
              <span className={styles.chapterIcon}>
                {ch.completed ? '✓' : ch.unlocked ? '▶' : '🔒'}
              </span>
              <span className={styles.chapterName}>{ch.chapter}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
