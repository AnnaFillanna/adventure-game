/**
 * Adventure Game - Quest Engine
 * Quest-Verwaltung und Fortschrittslogik
 */

import type { Quest, QuestObjective } from '../state/types';

// ============================================================================
// QUEST LOGIC
// ============================================================================

/**
 * Überprüft, ob eine Quest gestartet werden kann (Voraussetzungen erfüllt)
 */
export const canStartQuest = (quest: Quest, completedQuests: Quest[]): boolean => {
  if (!quest.prerequisiteQuest) return true;

  return completedQuests.some(
    (q) => q.id === quest.prerequisiteQuest && q.status === 'completed'
  );
};

/**
 * Aktualisiert den Quest-Fortschritt basierend auf Spieleraktion
 */
export const updateQuestProgress = (
  _quest: Quest,
  objective: QuestObjective,
  progressDelta: number
): QuestObjective => {
  const newProgress = Math.min(objective.progress + progressDelta, objective.required);

  return {
    ...objective,
    progress: newProgress,
    completed: newProgress >= objective.required,
  };
};

/**
 * Überprüft, ob alle Quest-Ziele erfüllt sind
 */
export const areAllObjectivesComplete = (objectives: QuestObjective[]): boolean => {
  return objectives.length > 0 && objectives.every((obj) => obj.completed);
};

/**
 * Gibt den Quest-Status als prozentuale Vollendung zurück (0-100)
 */
export const getQuestProgress = (quest: Quest): number => {
  if (quest.objectives.length === 0) return 0;

  const completedObjectives = quest.objectives.filter((obj) => obj.completed).length;
  return Math.round((completedObjectives / quest.objectives.length) * 100);
};

/**
 * Gibt die nächste unvollendete Quest-Aufgabe zurück
 */
export const getNextIncompleteObjective = (quest: Quest): QuestObjective | undefined => {
  return quest.objectives.find((obj) => !obj.completed);
};

/**
 * Gibt eine lesbare Beschreibung des aktuellen Quest-Ziels zurück
 */
export const getObjectiveDescription = (objective: QuestObjective): string => {
  return `${objective.description} (${objective.progress}/${objective.required})`;
};

/**
 * Gibt Questbelohnungen als formatierter String zurück
 */
export const formatRewards = (quest: Quest): string => {
  const parts: string[] = [];

  if (quest.rewards.xp > 0) {
    parts.push(`+${quest.rewards.xp} XP`);
  }

  if (quest.rewards.gold > 0) {
    parts.push(`+${quest.rewards.gold} Gold`);
  }

  if (quest.rewards.items.length > 0) {
    const itemCount = quest.rewards.items.reduce((sum, item) => sum + item.quantity, 0);
    parts.push(`+${itemCount} Item${itemCount > 1 ? 's' : ''}`);
  }

  return parts.join(', ');
};

/**
 * Bestimmt, ob eine Quest als "aktiv" gilt
 */
export const isQuestActive = (quest: Quest): boolean => {
  return quest.status === 'active';
};

/**
 * Bestimmt, ob eine Quest abgeschlossen werden kann
 */
export const canCompleteQuest = (quest: Quest): boolean => {
  return areAllObjectivesComplete(quest.objectives) && quest.status === 'active';
};
