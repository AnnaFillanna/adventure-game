export interface FirstEpisodeState {
  version: 1;
  health: number;
  shadowHealth: number;
  turn: number;
  stoneStep: number;
  feedback: 'none' | 'wrongTrail' | 'trailHelp' | 'attack' | 'guard' | 'combatHelp' | 'defeat' | 'retry' | 'wrongStone' | 'stoneHelp' | 'piece';
}
export const initialFirstEpisode = (): FirstEpisodeState => ({ version: 1, health: 5, shadowHealth: 5, turn: 0, stoneStep: 0, feedback: 'none' });
export function validFirstEpisodeState(value: unknown): value is FirstEpisodeState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const s = value as FirstEpisodeState;
  return s.version === 1 && [s.health, s.shadowHealth, s.turn, s.stoneStep].every(Number.isSafeInteger) &&
    s.health >= 0 && s.health <= 5 && s.shadowHealth >= 0 && s.shadowHealth <= 5 && s.turn >= 0 && s.stoneStep >= 0 && s.stoneStep <= 3 &&
    ['none', 'wrongTrail', 'trailHelp', 'attack', 'guard', 'combatHelp', 'defeat', 'retry', 'wrongStone', 'stoneHelp', 'piece'].includes(s.feedback);
}
