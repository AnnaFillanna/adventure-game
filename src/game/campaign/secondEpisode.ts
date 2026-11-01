import type { EpisodeProgress } from '../../types/campaign';
import { completeEvent } from './episodeManager';
import { initialSecondEpisode, validSecondEpisodeState, type SecondEpisodeState } from './secondEpisodeState';
export const SECOND_EPISODE_ID = 'episode_02_silent_bell';
export type SecondEpisodeInput = 'meet' | 'root' | 'wave' | 'star' | 'bell_help' | 'listen' | 'name' | 'hum' | 'threaten' | 'calm_help' | 'open_memory' | 'keep_memory';
export function getSecondEpisodeState(progress: EpisodeProgress): SecondEpisodeState {
  return progress.playerChoices.secondEpisode ?? initialSecondEpisode();
}
export function playSecondEpisode(progress: EpisodeProgress, eventId: string, input: SecondEpisodeInput): EpisodeProgress {
  if (progress.episodeId !== SECOND_EPISODE_ID || progress.status !== 'in_progress') return progress;
  const number = progress.completedEvents.length + 1;
  if (number > 4 || eventId !== `${SECOND_EPISODE_ID}_event_${number}`) return progress;
  const stored = progress.playerChoices.secondEpisode;
  if (stored !== undefined && !validSecondEpisodeState(stored)) return progress;
  const state = { ...getSecondEpisodeState(progress) };
  let solved = false;
  if (number === 1 && input === 'meet') solved = true;
  else if (number === 2) {
    if (input === 'bell_help') state.feedback = 'bellHelp';
    else if (['root', 'wave', 'star'].includes(input)) {
      if (input === ['root', 'wave', 'star'][state.bellStep]) { state.bellStep++; state.feedback = 'bellPiece'; }
      else { state.bellStep = 0; state.feedback = 'wrongBell'; }
      solved = state.bellStep === 3;
    } else return progress;
  } else if (number === 3) {
    if (input === 'calm_help') state.feedback = 'calmHelp';
    else if (['listen', 'name', 'hum', 'threaten'].includes(input)) {
      if (input === ['listen', 'name', 'hum'][state.calmStep]) { state.calmStep++; state.feedback = 'calmer'; }
      else state.feedback = 'wrongCalm';
      solved = state.calmStep === 3;
    } else return progress;
  } else if (number === 4) {
    if (input === 'open_memory') state.memoryOpened = true;
    else if (input === 'keep_memory' && state.memoryOpened) solved = true;
    else return progress;
  } else return progress;
  if (solved) state.feedback = 'none';
  const next = { ...progress, playerChoices: { ...progress.playerChoices, secondEpisode: state } };
  return solved ? completeEvent(next, eventId) : next;
}
