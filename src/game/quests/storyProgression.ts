/**
 * Adventure Game - Story Progression Engine
 * Verwaltet Kapitel, Quest-Sequenzen und Story-Abhängigkeiten
 */

import type { Chapter, StoryLine, ExtendedQuest } from './types';
import { STORY_THE_LOST_KINGDOM, getQuestsByChapter } from './types';

// ============================================================================
// STORY PROGRESSION STATE
// ============================================================================

export interface StoryProgressionState {
  storyId: string;
  currentChapterId: string;
  completedChapterIds: string[];
  chapterStatus: Record<string, 'locked' | 'available' | 'active' | 'completed'>;
  questProgress: Record<
    string,
    {
      status: 'not_started' | 'active' | 'completed' | 'failed';
      completedAt?: number;
    }
  >;

  // Tracking
  startedAt: number;
  updatedAt: number;
}

// ============================================================================
// STORY PROGRESSION ENGINE
// ============================================================================

export class StoryProgressionEngine {
  private story: StoryLine;
  private state: StoryProgressionState;

  constructor(story: StoryLine, initialState?: StoryProgressionState) {
    this.story = story;

    if (initialState) {
      this.state = initialState;
    } else {
      // Initialize new story
      this.state = {
        storyId: story.id,
        currentChapterId: this.story.chapters[0].id,
        completedChapterIds: [],
        chapterStatus: {},
        questProgress: {},
        startedAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Initialize chapter status
      for (let i = 0; i < this.story.chapters.length; i++) {
        const chapter = this.story.chapters[i];
        if (i === 0) {
          this.state.chapterStatus[chapter.id] = 'available';
        } else {
          this.state.chapterStatus[chapter.id] = 'locked';
        }
      }

      // Initialize quest progress
      for (const chapter of this.story.chapters) {
        for (const questId of chapter.questIds) {
          this.state.questProgress[questId] = {
            status: 'not_started',
          };
        }
      }
    }
  }

  /**
   * Get current state
   */
  getState(): StoryProgressionState {
    return this.state;
  }

  /**
   * Get current chapter
   */
  getCurrentChapter(): Chapter | undefined {
    return this.story.chapters.find((c) => c.id === this.state.currentChapterId);
  }

  /**
   * Get chapter by ID
   */
  getChapter(chapterId: string): Chapter | undefined {
    return this.story.chapters.find((c) => c.id === chapterId);
  }

  /**
   * Get all available chapters (unlocked)
   */
  getAvailableChapters(): Chapter[] {
    return this.story.chapters.filter(
      (c) =>
        this.state.chapterStatus[c.id] === 'available' ||
        this.state.chapterStatus[c.id] === 'active' ||
        this.state.chapterStatus[c.id] === 'completed'
    );
  }

  /**
   * Get quests for current chapter
   */
  getCurrentChapterQuests(): ExtendedQuest[] {
    const chapter = this.getCurrentChapter();
    if (!chapter) return [];
    return getQuestsByChapter(chapter.id);
  }

  /**
   * Mark quest as started
   */
  startQuest(questId: string): boolean {
    if (!this.state.questProgress[questId]) {
      return false;
    }

    this.state.questProgress[questId].status = 'active';
    this.state.updatedAt = Date.now();
    return true;
  }

  /**
   * Mark quest as completed
   */
  completeQuest(questId: string): boolean {
    const progress = this.state.questProgress[questId];
    if (!progress) {
      return false;
    }

    progress.status = 'completed';
    progress.completedAt = Date.now();
    this.state.updatedAt = Date.now();

    // Check if chapter is now complete
    this.updateChapterProgress();

    return true;
  }

  /**
   * Mark quest as failed
   */
  failQuest(questId: string): boolean {
    const progress = this.state.questProgress[questId];
    if (!progress) {
      return false;
    }

    progress.status = 'failed';
    this.state.updatedAt = Date.now();
    return true;
  }

  /**
   * Get quest status
   */
  getQuestStatus(questId: string): string {
    return this.state.questProgress[questId]?.status || 'not_started';
  }

  /**
   * Check how many quests in chapter are completed
   */
  getChapterCompletionCount(chapterId: string): number {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return 0;

    return chapter.questIds.filter(
      (qId) => this.state.questProgress[qId]?.status === 'completed'
    ).length;
  }

  /**
   * Update chapter progress and unlock next chapters
   */
  private updateChapterProgress(): void {
    for (const chapter of this.story.chapters) {
      const completedCount = this.getChapterCompletionCount(chapter.id);
      const isChapterComplete =
        completedCount >= chapter.requiredCompletionCount;

      // Mark as completed
      if (isChapterComplete && this.state.chapterStatus[chapter.id] !== 'completed') {
        this.state.chapterStatus[chapter.id] = 'completed';

        // Unlock next chapter
        if (chapter.unlocksChapterId) {
          const nextChapter = this.getChapter(chapter.unlocksChapterId);
          if (nextChapter) {
            this.state.chapterStatus[nextChapter.id] = 'available';
          }
        }
      }
    }
  }

  /**
   * Get chapter progress (0-100)
   */
  getChapterProgress(chapterId: string): number {
    const chapter = this.getChapter(chapterId);
    if (!chapter) return 0;

    const completed = this.getChapterCompletionCount(chapterId);
    return Math.round((completed / chapter.requiredCompletionCount) * 100);
  }

  /**
   * Get overall story progress (0-100)
   */
  getOverallProgress(): number {
    const totalChapters = this.story.chapters.length;
    if (totalChapters === 0) return 0;

    const completedChapters = Object.entries(this.state.chapterStatus).filter(
      ([_, status]) => status === 'completed'
    ).length;

    return Math.round((completedChapters / totalChapters) * 100);
  }

  /**
   * Check if story is complete (all chapters done)
   */
  isStoryComplete(): boolean {
    return (
      this.state.chapterStatus[this.story.chapters[this.story.chapters.length - 1].id] ===
      'completed'
    );
  }

  /**
   * Export state for persistence
   */
  exportState(): StoryProgressionState {
    return JSON.parse(JSON.stringify(this.state));
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create story progression engine for "The Lost Kingdom"
 */
export function createLostKingdomStory(
  initialState?: StoryProgressionState
): StoryProgressionEngine {
  return new StoryProgressionEngine(STORY_THE_LOST_KINGDOM, initialState);
}

/**
 * Check if quest prerequisites are met
 */
export function areQuestPrerequisitesMet(
  quest: ExtendedQuest,
  engine: StoryProgressionEngine
): boolean {
  if (!quest.prerequisiteQuest) {
    return true;
  }

  return engine.getQuestStatus(quest.prerequisiteQuest) === 'completed';
}

/**
 * Get next available quest in chapter
 */
export function getNextAvailableQuest(
  chapterId: string,
  engine: StoryProgressionEngine
): ExtendedQuest | undefined {
  const quests = getQuestsByChapter(chapterId);

  for (const quest of quests) {
    const status = engine.getQuestStatus(quest.id);

    // If not started and prerequisites met
    if (status === 'not_started' && areQuestPrerequisitesMet(quest, engine)) {
      return quest;
    }
  }

  return undefined;
}

/**
 * Get active quests in chapter
 */
export function getActiveQuests(
  chapterId: string,
  engine: StoryProgressionEngine
): ExtendedQuest[] {
  const quests = getQuestsByChapter(chapterId);

  return quests.filter(
    (q) =>
      engine.getQuestStatus(q.id) === 'active' ||
      engine.getQuestStatus(q.id) === 'completed'
  );
}
