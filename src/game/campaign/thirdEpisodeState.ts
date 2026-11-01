export interface ThirdEpisodeState {
  version: 1;
  merchantDialogStep: number; // 0-2: dialog progression with merchant
  traceSelected: string | null; // which trace was selected: 'morning' | 'evening' | null
  traceStep: number; // 0-2: steps to find the correct trace
  banditCombatPhase: number; // 0: not started, 1-3: combat rounds, 4: defeated
  banditHealth: number; // 0-3 HP
  playerHealth: number; // 0-3 HP (separate from campaign XP)
  lanternLit: boolean;
  feedback: 'none' | 'merchantGreet' | 'traceWrong' | 'traceCorrect' | 'traceHelp' | 
            'combatStart' | 'playerAttack' | 'playerDefend' | 'banditAttack' | 'combatHelp' |
            'banditDefeated' | 'playerDefeated' | 'combatRetry' | 'lanternLit' | 'dialogEnd';
}

export const initialThirdEpisode = (): ThirdEpisodeState => ({
  version: 1,
  merchantDialogStep: 0,
  traceSelected: null,
  traceStep: 0,
  banditCombatPhase: 0,
  banditHealth: 3,
  playerHealth: 3,
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
    Number.isSafeInteger(s.banditCombatPhase) && s.banditCombatPhase >= 0 && s.banditCombatPhase <= 4 &&
    Number.isSafeInteger(s.banditHealth) && s.banditHealth >= 0 && s.banditHealth <= 3 &&
    Number.isSafeInteger(s.playerHealth) && s.playerHealth >= 0 && s.playerHealth <= 3 &&
    typeof s.lanternLit === 'boolean' &&
    ['none', 'merchantGreet', 'traceWrong', 'traceCorrect', 'traceHelp',
     'combatStart', 'playerAttack', 'playerDefend', 'banditAttack', 'combatHelp',
     'banditDefeated', 'playerDefeated', 'combatRetry', 'lanternLit', 'dialogEnd'
    ].includes(s.feedback)
  );
}
