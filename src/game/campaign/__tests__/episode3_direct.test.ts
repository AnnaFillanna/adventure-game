import { describe, it, expect } from 'vitest';
import { playThirdEpisode, THIRD_EPISODE_ID } from '../thirdEpisode';
import { completeEpisode } from '../episodeManager';
import type { EpisodeProgress } from '../../../types/campaign';
import { EPISODE_STATUS } from '../episodeManager';

describe('Episode 3 Discovery-Based Encounter', () => {
  it('should complete discovery encounter without save errors', () => {
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

    // Event 3: Discovery encounter (listen → investigate → help)
    let encounterProgress = progress;
    
    // Listen to bandits
    encounterProgress = playThirdEpisode(encounterProgress, `${THIRD_EPISODE_ID}_event_3`, 'bandit_listen');
    let state = encounterProgress.playerChoices.thirdEpisode;
    expect(state.banditEncounterPhase).toBe('listening');
    expect(state.dialogueProgress).toBe('greeted');
    
    // Investigate the curse
    encounterProgress = playThirdEpisode(encounterProgress, `${THIRD_EPISODE_ID}_event_3`, 'bandit_investigate');
    state = encounterProgress.playerChoices.thirdEpisode;
    expect(state.curseRevealed).toBe(true);
    expect(state.banditEncounterPhase).toBe('deciding');
    expect(state.dialogueProgress).toBe('understood_curse');
    
    // Offer help to resolve
    encounterProgress = playThirdEpisode(encounterProgress, `${THIRD_EPISODE_ID}_event_3`, 'bandit_offer_help');
    state = encounterProgress.playerChoices.thirdEpisode;
    expect(state.banditEncounterPhase).toBe('resolved');
    expect(state.dialogueProgress).toBe('chose_solution');
    expect(encounterProgress.completedEvents).toContain(`${THIRD_EPISODE_ID}_event_3`);
    
    // Verify state is valid
    expect(state.banditEncounterPhase).toMatch(/initial|listening|deciding|resolved/);

    // Event 4: Lantern
    let finalProgress = playThirdEpisode(encounterProgress, `${THIRD_EPISODE_ID}_event_4`, 'lantern_light');
    expect(finalProgress.completedEvents).toContain(`${THIRD_EPISODE_ID}_event_4`);
    
    // Complete episode
    finalProgress = completeEpisode(finalProgress);
    expect(finalProgress.status).toBe(EPISODE_STATUS.COMPLETED);
  });
});
