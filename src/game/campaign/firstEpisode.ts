import type { EpisodeProgress } from '../../types/campaign';
import { completeEvent } from './episodeManager';

export const FIRST_EPISODE_ID = 'episode_01_whisper_sand';
export type FirstEpisodeInput = 'read' | 'trail_dawn' | 'trail_dusk' | 'trail_help' | 'attack' | 'guard' | 'combat_help' | 'retry' | 'stone_sun' | 'stone_path' | 'stone_tower' | 'stone_help';
export { initialFirstEpisode, validFirstEpisodeState } from './firstEpisodeState';
import { initialFirstEpisode, validFirstEpisodeState, type FirstEpisodeState } from './firstEpisodeState';
export function getFirstEpisodeState(progress: EpisodeProgress): FirstEpisodeState {
  return progress.playerChoices.firstEpisode ?? initialFirstEpisode();
}

/** Inputs are bound to the visible event so repeated/stale clicks cannot solve the next one. */
export function playFirstEpisode(progress: EpisodeProgress, eventId: string, input: FirstEpisodeInput): EpisodeProgress {
  if (progress.episodeId !== FIRST_EPISODE_ID || progress.status !== 'in_progress') return progress;
  const number = progress.completedEvents.length + 1;
  if (number > 4 || eventId !== `${FIRST_EPISODE_ID}_event_${number}`) return progress;
  const stored = progress.playerChoices.firstEpisode;
  if (stored !== undefined && !validFirstEpisodeState(stored)) return progress;
  let state = { ...getFirstEpisodeState(progress) };
  let solved = false;
  if (number === 1 && input === 'read') solved = true;
  else if (number === 2) {
    if (input === 'trail_dawn') { solved = true; state.feedback = 'none'; }
    else if (input === 'trail_dusk') state.feedback = 'wrongTrail';
    else if (input === 'trail_help') state.feedback = 'trailHelp';
    else return progress;
  } else if (number === 3) {
    if (state.health === 0) {
      if (input !== 'retry') return progress;
      state = { ...initialFirstEpisode(), feedback: 'retry' };
    } else if (input === 'attack' || input === 'guard' || input === 'combat_help') {
      const heavy = state.turn % 2 === 1;
      const damage = input === 'attack' ? 2 : input === 'combat_help' || heavy ? 1 : 0;
      state.shadowHealth = Math.max(0, state.shadowHealth - damage);
      if (state.shadowHealth > 0 && input === 'attack') state.health = Math.max(0, state.health - (heavy ? 4 : 1));
      state.turn++;
      state.feedback = state.health === 0 ? 'defeat' : input === 'combat_help' ? 'combatHelp' : input;
      solved = state.shadowHealth === 0;
    } else return progress;
  } else if (number === 4) {
    if (input === 'stone_help') state.feedback = 'stoneHelp';
    else if (['stone_sun', 'stone_path', 'stone_tower'].includes(input)) {
      const expected = ['stone_sun', 'stone_path', 'stone_tower'][state.stoneStep];
      if (input === expected) { state.stoneStep++; state.feedback = 'piece'; }
      else { state.stoneStep = 0; state.feedback = 'wrongStone'; }
      solved = state.stoneStep === 3;
    } else return progress;
  } else return progress;
  if (solved) state.feedback = 'none';
  const next = { ...progress, playerChoices: { ...progress.playerChoices, firstEpisode: state } };
  return solved ? completeEvent(next, eventId) : next;
}
