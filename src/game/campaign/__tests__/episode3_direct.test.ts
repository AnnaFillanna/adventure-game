import { describe, it, expect } from 'vitest';
import { playThirdEpisode, THIRD_EPISODE_ID } from '../thirdEpisode';
import { completeEpisode } from '../episodeManager';
import type { EpisodeProgress } from '../../../types/campaign';
import { EPISODE_STATUS } from '../episodeManager';

describe('Episode 3 Direct Combat Fix', () => {
  it('should complete combat without save errors', () => {
    let progress: EpisodeProgress = {
      episodeId: THIRD_EPISODE_ID,
      status: EPISODE_STATUS.IN_PROGRESS,
      startedAt: Date.now(),
      completedAt: undefined,
      completedEvents: [] as string[],
      playerChoices: { thirdEpisode: undefined } as any,
      rewardsGranted: { xp: false, gold: false, itemIds: [] },
    };

    // Event 1: Merchant (requires 2 greet inputs)
    progress = playThirdEpisode(progress, `${THIRD_EPISODE_ID}_event_1`, 'merchantGreet');
    expect(progress.completedEvents).not.toContain(`${THIRD_EPISODE_ID}_event_1`);
    progress = playThirdEpisode(progress, `${THIRD_EPISODE_ID}_event_1`, 'merchantGreet');
    expect(progress.completedEvents).toContain(`${THIRD_EPISODE_ID}_event_1`);

    // Event 2: Trace (requires 2 morning inputs)
    progress = playThirdEpisode(progress, `${THIRD_EPISODE_ID}_event_2`, 'trace_morning');
    expect(progress.completedEvents).not.toContain(`${THIRD_EPISODE_ID}_event_2`);
    progress = playThirdEpisode(progress, `${THIRD_EPISODE_ID}_event_2`, 'trace_morning');
    expect(progress.completedEvents).toContain(`${THIRD_EPISODE_ID}_event_2`);

    // Event 3: Combat (start + 3 attacks to defeat bandit with 3 HP)
    let combatProgress = progress;
    
    // Attack 1: Start combat
    combatProgress = playThirdEpisode(combatProgress, `${THIRD_EPISODE_ID}_event_3`, 'combat_attack');
    let state = combatProgress.playerChoices.thirdEpisode;
    expect(state.banditCombatPhase).toBe(1);
    
    // Attack 2: Deal damage (bandit 3→2 HP)
    combatProgress = playThirdEpisode(combatProgress, `${THIRD_EPISODE_ID}_event_3`, 'combat_attack');
    state = combatProgress.playerChoices.thirdEpisode;
    expect(state.banditHealth).toBe(2);
    expect(state.banditCombatPhase).toBe(2);
    
    // Attack 3: Deal damage (bandit 2→1 HP)
    combatProgress = playThirdEpisode(combatProgress, `${THIRD_EPISODE_ID}_event_3`, 'combat_attack');
    state = combatProgress.playerChoices.thirdEpisode;
    expect(state.banditHealth).toBe(1);
    expect(state.banditCombatPhase).toBe(3);
    
    // Attack 4: Deal final damage (bandit 1→0 HP, defeated!)
    combatProgress = playThirdEpisode(combatProgress, `${THIRD_EPISODE_ID}_event_3`, 'combat_attack');
    state = combatProgress.playerChoices.thirdEpisode;
    expect(state.banditHealth).toBe(0);
    expect(state.banditCombatPhase).toBe(4);
    expect(state.feedback).toBe('banditDefeated');
    expect(combatProgress.completedEvents).toContain(`${THIRD_EPISODE_ID}_event_3`);
    
    // Verify state is valid
    expect(state.banditCombatPhase).toBeLessThanOrEqual(4);
    expect(state.banditCombatPhase).toBeGreaterThanOrEqual(0);

    // Event 4: Lantern
    let finalProgress = playThirdEpisode(combatProgress, `${THIRD_EPISODE_ID}_event_4`, 'lantern_light');
    expect(finalProgress.completedEvents).toContain(`${THIRD_EPISODE_ID}_event_4`);
    
    // Complete episode
    finalProgress = completeEpisode(finalProgress);
    expect(finalProgress.status).toBe(EPISODE_STATUS.COMPLETED);
  });
});
