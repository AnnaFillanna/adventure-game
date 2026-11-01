import type { EpisodeProgress } from '../../types/campaign';
import { completeEvent } from './episodeManager';
import { initialThirdEpisode, validThirdEpisodeState, type ThirdEpisodeState } from './thirdEpisodeState';

export const THIRD_EPISODE_ID = 'episode_03_stolen_lantern';
export type ThirdEpisodeInput = 
  | 'merchantGreet' 
  | 'trace_morning' | 'trace_evening' | 'trace_help'
  | 'combat_attack' | 'combat_defend' | 'combat_help' | 'combat_retry'
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
  // Event 3: Convince bandits (combat or dialogue)
  else if (number === 3) {
    if (state.banditCombatPhase === 0 && input === 'combat_attack') {
      // Start combat
      state.banditCombatPhase = 1;
      state.feedback = 'combatStart';
    } else if (state.banditCombatPhase > 0) {
      if (state.playerHealth === 0 && input !== 'combat_retry') {
        return progress; // Defeat state, must retry
      }
      if (input === 'combat_retry') {
        state = { ...initialThirdEpisode() };
        state.feedback = 'combatRetry';
      } else if (input === 'combat_attack') {
        const damage = 1;
        state.banditHealth = Math.max(0, state.banditHealth - damage);
        state.feedback = 'playerAttack';
        if (state.banditHealth > 0) {
          // Enemy attacks back
          state.playerHealth = Math.max(0, state.playerHealth - 1);
          state.feedback = state.playerHealth === 0 ? 'playerDefeated' : 'banditAttack';
        } else {
          state.banditCombatPhase = 4;
          state.feedback = 'banditDefeated';
          solved = true;
        }
        state.banditCombatPhase++;
      } else if (input === 'combat_defend') {
        state.feedback = 'playerDefend';
        if (state.banditHealth > 0) {
          state.playerHealth = Math.max(0, state.playerHealth - 1);
          if (state.playerHealth > 0) {
            state.feedback = 'banditAttack'; // Only show bandit attack if player survives
          } else {
            state.feedback = 'playerDefeated';
          }
        }
        state.banditCombatPhase++;
      } else if (input === 'combat_help') {
        state.feedback = 'combatHelp';
        if (state.banditHealth > 0) {
          state.playerHealth = Math.max(0, state.playerHealth - 1);
          if (state.playerHealth > 0) {
            state.feedback = 'banditAttack'; // Only show bandit attack if player survives
          } else {
            state.feedback = 'playerDefeated';
          }
        }
        state.banditCombatPhase++;
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

  if (solved) state.feedback = 'none';
  const next = { ...progress, playerChoices: { ...progress.playerChoices, thirdEpisode: state } };
  return solved ? completeEvent(next, eventId) : next;
}
