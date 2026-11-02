import type { EpisodeProgress } from '../../types/campaign';
import { completeEvent } from './episodeManager';
import { initialThirdEpisode, validThirdEpisodeState, type ThirdEpisodeState } from './thirdEpisodeState';

export const THIRD_EPISODE_ID = 'episode_03_stolen_lantern';
export type ThirdEpisodeInput = 
  | 'merchantGreet' 
  | 'trace_morning' | 'trace_evening' | 'trace_help'
  | 'bandit_listen' | 'bandit_investigate' | 'bandit_offer_help' | 'bandit_escape'
  | 'lantern_light';

export { initialThirdEpisode, validThirdEpisodeState };

export function getThirdEpisodeState(progress: EpisodeProgress): ThirdEpisodeState {
  return progress.playerChoices.thirdEpisode ?? initialThirdEpisode();
}

/** Episode 3: Die gestohlene Laterne
 * Event 1: Merchant inquiry - merchant tells story of stolen lantern
 * Event 2: Supply trace comparison - find correct traces (morning traces are correct)
 * Event 3: Convince bandits - convince through dialogue OR simple combat
 * Event 4: Light the lantern - complete episode
 */
export function playThirdEpisode(progress: EpisodeProgress, eventId: string, input: ThirdEpisodeInput): EpisodeProgress {
  if (progress.episodeId !== THIRD_EPISODE_ID || progress.status !== 'in_progress') return progress;
  const number = progress.completedEvents.length + 1;
  if (number > 4 || eventId !== `${THIRD_EPISODE_ID}_event_${number}`) return progress;
  
  const stored = progress.playerChoices.thirdEpisode;
  if (stored !== undefined && !validThirdEpisodeState(stored)) return progress;
  
  let state = { ...getThirdEpisodeState(progress) };
  let solved = false;

  // Event 1: Merchant inquiry
  if (number === 1) {
    if (input === 'merchantGreet') {
      state.merchantDialogStep++;
      state.feedback = 'merchantGreet';
      if (state.merchantDialogStep >= 2) solved = true;
    } else {
      return progress;
    }
  }
  // Event 2: Supply trace comparison
  else if (number === 2) {
    if (input === 'trace_help') {
      state.feedback = 'traceHelp';
    } else if (input === 'trace_morning') {
      // Morning trace is correct
      state.traceSelected = 'morning';
      state.traceStep++;
      state.feedback = 'traceCorrect';
      if (state.traceStep >= 2) solved = true;
    } else if (input === 'trace_evening') {
      // Evening trace is wrong
      state.traceStep = 0;
      state.feedback = 'traceWrong';
    } else {
      return progress;
    }
  }
  // Event 3: Bandit Encounter (Discovery-based, not combat)
  // Story: Bandits are cursed by the lantern they stole, not evil
  // Progression: Listen → Understand curse → Help → Resolution
  else if (number === 3) {
    if (state.banditEncounterPhase === 'initial') {
      if (input === 'bandit_listen') {
        state.banditEncounterPhase = 'listening';
        state.dialogueProgress = 'greeted';
        state.feedback = 'banditGreeted';
      } else if (input === 'bandit_escape') {
        // Escape without helping - immediate resolution
        state.banditEncounterPhase = 'resolved';
        state.dialogueProgress = 'chose_solution';
        state.feedback = 'solutionChosen';
        solved = true;
      } else {
        return progress;
      }
    } else if (state.banditEncounterPhase === 'listening') {
      if (input === 'bandit_investigate') {
        // Player investigates deeper - curse becomes clear
        state.curseRevealed = true;
        state.banditEncounterPhase = 'deciding';
        state.dialogueProgress = 'understood_curse';
        state.feedback = 'curseRevealed';
      } else if (input === 'bandit_listen') {
        // Continue listening - curse hints but not fully revealed
        state.feedback = 'banditListening';
      } else {
        return progress;
      }
    } else if (state.banditEncounterPhase === 'deciding') {
      if (input === 'bandit_offer_help') {
        // Player offers help - situation resolved
        state.banditEncounterPhase = 'resolved';
        state.dialogueProgress = 'chose_solution';
        state.feedback = 'banditThankful';
        solved = true;
      } else if (input === 'bandit_escape') {
        // Escape even after understanding - still resolves
        state.banditEncounterPhase = 'resolved';
        state.feedback = 'solutionChosen';
        solved = true;
      } else if (input === 'bandit_investigate') {
        // Continue investigating curse details
        state.feedback = 'curseProblem';
      } else {
        return progress;
      }
    } else {
      return progress;
    }
  }
  // Event 4: Light the lantern
  else if (number === 4) {
    if (input === 'lantern_light') {
      state.lanternLit = true;
      state.feedback = 'lanternLit';
      solved = true;
    } else {
      return progress;
    }
  } else {
    return progress;
  }

  const next = { ...progress, playerChoices: { ...progress.playerChoices, thirdEpisode: state } };
  return solved ? completeEvent(next, eventId) : next;
}
