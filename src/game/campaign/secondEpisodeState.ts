export interface SecondEpisodeState {
  version: 1;
  bellStep: number;
  calmStep: number;
  memoryOpened: boolean;
  feedback: 'none' | 'wrongBell' | 'bellHelp' | 'bellPiece' | 'wrongCalm' | 'calmHelp' | 'calmer';
}
export const initialSecondEpisode = (): SecondEpisodeState => ({ version: 1, bellStep: 0, calmStep: 0, memoryOpened: false, feedback: 'none' });
export function validSecondEpisodeState(value: unknown): value is SecondEpisodeState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const s = value as SecondEpisodeState;
  return s.version === 1 && Number.isInteger(s.bellStep) && s.bellStep >= 0 && s.bellStep <= 3 &&
    Number.isInteger(s.calmStep) && s.calmStep >= 0 && s.calmStep <= 3 && typeof s.memoryOpened === 'boolean' &&
    ['none', 'wrongBell', 'bellHelp', 'bellPiece', 'wrongCalm', 'calmHelp', 'calmer'].includes(s.feedback);
}
