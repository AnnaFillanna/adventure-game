/**
 * Adventure Game - NPC Dialogue System
 * Interactive dialogue UI with character portraits, dialogue choices, and quest interactions
 */

import type { ExtendedQuest } from '../quests/types';

// ============================================================================
// DIALOGUE TYPES
// ============================================================================

export interface DialogueOption {
  id: string;
  text: string;
  action: 'accept_quest' | 'decline_quest' | 'continue' | 'end';
  nextDialogueId?: string;
  consequence?: () => void;
}

export interface DialogueNode {
  id: string;
  npcName: string;
  npcPortrait: string;
  text: string;
  options: DialogueOption[];
  questId?: string;
  requiresQuestComplete?: string;
}

export interface NPCData {
  id: string;
  name: string;
  portrait: string;
  title: string;
  dialogues: DialogueNode[];
  quests: ExtendedQuest[];
}

// ============================================================================
// NPC DATABASE
// ============================================================================

/**
 * Predefined NPC dialogues with story-driven content
 * Chapter 1: Awakening - Meet the Elf, collect coins, defeat Goblin
 */
export const NPC_DIALOGUE_DATABASE: Record<string, NPCData> = {
  elf_guardian: {
    id: 'elf_guardian',
    name: 'Eldara',
    portrait: '🧝',
    title: 'Forest Guardian',
    dialogues: [
      {
        id: 'dialogue_intro',
        npcName: 'Eldara',
        npcPortrait: '🧝',
        text: 'Greetings, traveler! I am Eldara, guardian of these enchanted woods. I sense a great darkness approaching our realm. Would you be willing to help?',
        options: [
          {
            id: 'opt_accept_help',
            text: 'I will help you! What do you need?',
            action: 'continue',
            nextDialogueId: 'dialogue_quest_explain',
          },
          {
            id: 'opt_decline_help',
            text: 'I am not ready for this journey.',
            action: 'end',
          },
        ],
        questId: 'quest_1_meet_elf',
      },
      {
        id: 'dialogue_quest_explain',
        npcName: 'Eldara',
        npcPortrait: '🧝',
        text: 'The ancient artifacts of our kingdom have been scattered. I need five golden coins to perform a protective ritual. Will you search the forest for them?',
        options: [
          {
            id: 'opt_accept_quest',
            text: 'I will find the golden coins for you!',
            action: 'accept_quest',
            consequence: () => console.log('Quest 2 started: Collect Coins'),
          },
          {
            id: 'opt_decline_quest',
            text: 'That sounds too dangerous.',
            action: 'decline_quest',
          },
        ],
        questId: 'quest_2_collect_coins',
      },
      {
        id: 'dialogue_coins_found',
        npcName: 'Eldara',
        npcPortrait: '🧝',
        text: 'You found all five coins! Your courage will be remembered. But wait... I sense a dark presence. A goblin has entered our realm!',
        options: [
          {
            id: 'opt_confront_goblin',
            text: 'I will defeat the goblin and protect the forest!',
            action: 'accept_quest',
            nextDialogueId: 'dialogue_quest_goblin',
            consequence: () => console.log('Quest 3 started: Defeat Goblin'),
          },
        ],
        questId: 'quest_3_defeat_goblin',
      },
      {
        id: 'dialogue_quest_goblin',
        npcName: 'Eldara',
        npcPortrait: '🧝',
        text: 'The goblin lurks in the nearby cave. It is dangerous, but I believe in your strength. Go forth and vanquish this foe!',
        options: [
          {
            id: 'opt_to_cave',
            text: 'I will go to the goblin cave now.',
            action: 'end',
            consequence: () => console.log('Player heading to goblin cave'),
          },
        ],
      },
      {
        id: 'dialogue_chapter_complete',
        npcName: 'Eldara',
        npcPortrait: '🧝',
        text: 'You did it! The goblin has been defeated and the coins secured the ritual. You have brought hope back to our kingdom. Your legend will be sung for generations!',
        options: [
          {
            id: 'opt_continue',
            text: 'What comes next in our adventure?',
            action: 'end',
          },
        ],
      },
    ],
    quests: [],
  },

  goblin_dark_lord: {
    id: 'goblin_dark_lord',
    name: 'Gruk',
    portrait: '👹',
    title: 'Dark Goblin',
    dialogues: [
      {
        id: 'dialogue_goblin_intro',
        npcName: 'Gruk',
        npcPortrait: '👹',
        text: 'Fool! You dare challenge Gruk, Lord of Darkness? Prepare to meet your doom!',
        options: [
          {
            id: 'opt_fight',
            text: 'Let\'s settle this in combat!',
            action: 'end',
            consequence: () => console.log('Combat initiated with Gruk'),
          },
          {
            id: 'opt_flee',
            text: 'Perhaps we can negotiate...',
            action: 'end',
            consequence: () => console.log('Player attempting negotiation (failed)'),
          },
        ],
      },
      {
        id: 'dialogue_goblin_defeated',
        npcName: 'Gruk',
        npcPortrait: '👹',
        text: 'Argh! You... you have bested me. I yield. Perhaps there is more to this world than conquest and darkness. Farewell, warrior...',
        options: [
          {
            id: 'opt_accept_surrender',
            text: 'Your time of terror has ended.',
            action: 'end',
            consequence: () => console.log('Goblin defeated and quest complete'),
          },
        ],
      },
    ],
    quests: [],
  },
};

// ============================================================================
// DIALOGUE MANAGER
// ============================================================================

export class DialogueManager {
  private currentDialogue: DialogueNode | null = null;
  private npcData: NPCData | null = null;
  private dialogueHistory: string[] = [];

  /**
   * Start dialogue with NPC
   */
  startDialogue(npcId: string, questCompleted?: string): DialogueNode | null {
    const npc = NPC_DIALOGUE_DATABASE[npcId];
    if (!npc) {
      console.error(`NPC not found: ${npcId}`);
      return null;
    }

    this.npcData = npc;

    // Select appropriate dialogue node
    let dialogueId = 'dialogue_intro';

    if (questCompleted === 'quest_2_collect_coins') {
      dialogueId = 'dialogue_coins_found';
    } else if (questCompleted === 'quest_3_defeat_goblin') {
      dialogueId = 'dialogue_chapter_complete';
    }

    const dialogue = npc.dialogues.find((d) => d.id === dialogueId);
    if (!dialogue) {
      console.error(`Dialogue not found: ${dialogueId}`);
      return null;
    }

    this.currentDialogue = dialogue;
    this.dialogueHistory = [dialogueId];
    return dialogue;
  }

  /**
   * Get current dialogue
   */
  getCurrentDialogue(): DialogueNode | null {
    return this.currentDialogue;
  }

  /**
   * Get NPC info
   */
  getNPCInfo(): NPCData | null {
    return this.npcData;
  }

  /**
   * Process dialogue option selection
   */
  selectOption(optionId: string): DialogueNode | null {
    if (!this.currentDialogue) return null;

    const option = this.currentDialogue.options.find((o) => o.id === optionId);
    if (!option) return null;

    // Execute consequence if any
    if (option.consequence) {
      option.consequence();
    }

    // Handle action
    switch (option.action) {
      case 'accept_quest':
      case 'continue':
        if (option.nextDialogueId) {
          const nextDialogue = this.npcData?.dialogues.find((d) => d.id === option.nextDialogueId);
          if (nextDialogue) {
            this.currentDialogue = nextDialogue;
            this.dialogueHistory.push(option.nextDialogueId);
            return nextDialogue;
          }
        }
        return null;

      case 'decline_quest':
      case 'end':
        this.currentDialogue = null;
        return null;

      default:
        return null;
    }
  }

  /**
   * Get dialogue history
   */
  getHistory(): string[] {
    return [...this.dialogueHistory];
  }

  /**
   * Reset dialogue state
   */
  reset(): void {
    this.currentDialogue = null;
    this.npcData = null;
    this.dialogueHistory = [];
  }
}

// ============================================================================
// QUEST DIALOGUE HELPERS
// ============================================================================

/**
 * Get dialogue for quest locked (player doesn't meet prerequisites)
 */
export const getQuestLockedDialogue = (questTitle: string): DialogueNode => ({
  id: 'dialogue_quest_locked',
  npcName: 'NPC',
  npcPortrait: '❓',
  text: `I cannot give you "${questTitle}" yet. You must first complete other quests and prove yourself worthy.`,
  options: [
    {
      id: 'opt_leave',
      text: 'I understand. I will return when I am ready.',
      action: 'end',
    },
  ],
});

/**
 * Get dialogue for quest already active
 */
export const getQuestActiveDialogue = (
  questTitle: string,
  progress: string
): DialogueNode => ({
  id: 'dialogue_quest_active',
  npcName: 'NPC',
  npcPortrait: '⏳',
  text: `I see you are working on "${questTitle}". ${progress} Keep pushing forward!`,
  options: [
    {
      id: 'opt_continue_quest',
      text: 'I will not let you down!',
      action: 'end',
    },
  ],
});

/**
 * Get dialogue for quest already completed
 */
export const getQuestCompleteDialogue = (questTitle: string, reward: string): DialogueNode => ({
  id: 'dialogue_quest_completed',
  npcName: 'NPC',
  npcPortrait: '🎉',
  text: `You have already completed "${questTitle}"! Thank you for your help. Here is your reward: ${reward}`,
  options: [
    {
      id: 'opt_continue',
      text: 'Thank you!',
      action: 'end',
    },
  ],
});
