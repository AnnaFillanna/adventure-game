import { describe, it, expect } from 'vitest';
import { playThirdEpisode, THIRD_EPISODE_ID } from '../thirdEpisode';
import { initialThirdEpisode, validThirdEpisodeState } from '../thirdEpisodeState';
import type { EpisodeProgress } from '../../../types/campaign';

const createProgress = (eventIndex = 0, state = initialThirdEpisode()): EpisodeProgress => ({
  episodeId: THIRD_EPISODE_ID,
  status: 'in_progress',
  completedEvents: Array(eventIndex).fill(null).map((_, i) => `${THIRD_EPISODE_ID}_event_${i + 1}`),
  playerChoices: { thirdEpisode: state },
  rewardsGranted: { xp: false, gold: false, itemIds: [] },
  startedAt: Date.now(),
  pausedAt: undefined,
  completedAt: undefined,
});

describe('Episode 3: Die gestohlene Laterne', () => {
  
  it('event 1 merchant dialog advances on merchantGreet', () => {
    const p = createProgress(0);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_1`, 'merchantGreet');
    expect(result.playerChoices.thirdEpisode?.merchantDialogStep).toBe(1);
    expect(result.completedEvents).toHaveLength(0);
  });

  it('event 1 completes after second merchantGreet', () => {
    const state = { ...initialThirdEpisode(), merchantDialogStep: 1 };
    const p = createProgress(0, state);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_1`, 'merchantGreet');
    expect(result.completedEvents).toHaveLength(1);
  });

  it('event 2 morning trace is correct', () => {
    const p = createProgress(1);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_2`, 'trace_morning');
    expect(result.playerChoices.thirdEpisode?.traceSelected).toBe('morning');
    expect(result.playerChoices.thirdEpisode?.traceStep).toBe(1);
  });

  it('event 2 evening trace is wrong', () => {
    const p = createProgress(1);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_2`, 'trace_evening');
    expect(result.playerChoices.thirdEpisode?.traceStep).toBe(0);
    expect(result.playerChoices.thirdEpisode?.feedback).toBe('traceWrong');
  });

  it('event 2 completes after finding trace twice', () => {
    const state = { ...initialThirdEpisode(), traceSelected: 'morning', traceStep: 1 };
    const p = createProgress(1, state);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_2`, 'trace_morning');
    expect(result.completedEvents).toHaveLength(2);
  });

  it('event 3 combat attack damages bandit', () => {
    const p = createProgress(2);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'combat_attack');
    expect(result.playerChoices.thirdEpisode?.banditCombatPhase).toBeGreaterThan(0);
  });

  it('event 3 defeat resets on retry', () => {
    const state = { ...initialThirdEpisode(), playerHealth: 0, banditCombatPhase: 2 };
    const p = createProgress(2, state);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'combat_retry');
    expect(result.playerChoices.thirdEpisode?.playerHealth).toBe(3);
    expect(result.playerChoices.thirdEpisode?.banditHealth).toBe(3);
  });

  it('event 4 lantern_light completes episode', () => {
    const p = createProgress(3);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_4`, 'lantern_light');
    expect(result.playerChoices.thirdEpisode?.lanternLit).toBe(true);
    expect(result.completedEvents).toHaveLength(4);
  });

  it('validates state correctly', () => {
    const valid = initialThirdEpisode();
    expect(validThirdEpisodeState(valid)).toBe(true);
    
    const invalid = { ...valid, playerHealth: -1 };
    expect(validThirdEpisodeState(invalid)).toBe(false);
  });

  it('rejects wrong event ID', () => {
    const p = createProgress(0);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_2`, 'merchantGreet');
    expect(result).toBe(p); // No change
  });

  it('rejects invalid input', () => {
    const p = createProgress(0);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_1`, 'trace_morning');
    expect(result).toBe(p); // No change
  });
});
