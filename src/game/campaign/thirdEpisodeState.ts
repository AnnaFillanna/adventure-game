/**
 * Episode 3 State: Discovery-based story
 * Event 3 is now a dialogue encounter with bandits, not combat-based
 */
export interface ThirdEpisodeState {
  version: 1;
  merchantDialogStep: number; // 0-2: dialog progression with merchant
  traceSelected: string | null; // which trace was selected: 'morning' | 'evening' | null
  traceStep: number; // 0-2: steps to find the correct trace
  
  // Event 3: Bandit Encounter (Discovery-based, not combat)
  // Progression states: 'initial' → 'listening' → 'deciding' → 'resolved'
  banditEncounterPhase: 'initial' | 'listening' | 'deciding' | 'resolved';
  // Player's chosen path: 'listen' → 'understand' → solve or fail
  dialogueProgress: 'none' | 'greeted' | 'understood_curse' | 'chose_solution';
  // Did player discover the bandit's curse/problem?
  curseRevealed: boolean;
  
  lanternLit: boolean;
  feedback: 'none' | 'merchantGreet' | 'traceWrong' | 'traceCorrect' | 'traceHelp' | 
            'banditGreeted' | 'banditListening' | 'curseProblem' | 'curseRevealed' | 
            'solutionChosen' | 'banditThankful' | 'lanternLit' | 'dialogEnd';
}

export const initialThirdEpisode = (): ThirdEpisodeState => ({
  version: 1,
  merchantDialogStep: 0,
  traceSelected: null,
  traceStep: 0,
  banditEncounterPhase: 'initial',
  dialogueProgress: 'none',
  curseRevealed: false,
  lanternLit: false,
  feedback: 'none'
});

export function validThirdEpisodeState(value: unknown): value is ThirdEpisodeState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const s = value as ThirdEpisodeState;
  return (
    s.version === 1 &&
    Number.isSafeInteger(s.merchantDialogStep) && s.merchantDialogStep >= 0 && s.merchantDialogStep <= 2 &&
    (s.traceSelected === null || s.traceSelected === 'morning' || s.traceSelected === 'evening') &&
    Number.isSafeInteger(s.traceStep) && s.traceStep >= 0 && s.traceStep <= 2 &&
    ['initial', 'listening', 'deciding', 'resolved'].includes(s.banditEncounterPhase) &&
    ['none', 'greeted', 'understood_curse', 'chose_solution'].includes(s.dialogueProgress) &&
    typeof s.curseRevealed === 'boolean' &&
    typeof s.lanternLit === 'boolean' &&
    ['none', 'merchantGreet', 'traceWrong', 'traceCorrect', 'traceHelp',
     'banditGreeted', 'banditListening', 'curseProblem', 'curseRevealed',
     'solutionChosen', 'banditThankful', 'lanternLit', 'dialogEnd'
    ].includes(s.feedback)
  );
}
