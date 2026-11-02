import { describe, it, expect } from 'vitest';
import { playThirdEpisode, THIRD_EPISODE_ID } from '../thirdEpisode';
import { initialThirdEpisode, validThirdEpisodeState, type ThirdEpisodeState } from '../thirdEpisodeState';
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

  // Event 3: Discovery-based bandit encounter
  it('event 3 listen starts dialogue', () => {
    const p = createProgress(2);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'bandit_listen');
    expect(result.playerChoices.thirdEpisode?.banditEncounterPhase).toBe('listening');
    expect(result.playerChoices.thirdEpisode?.dialogueProgress).toBe('greeted');
  });

  it('event 3 investigate reveals curse', () => {
    const state: ThirdEpisodeState = { ...initialThirdEpisode(), banditEncounterPhase: 'listening', dialogueProgress: 'greeted' };
    const p = createProgress(2, state);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'bandit_investigate');
    expect(result.playerChoices.thirdEpisode?.curseRevealed).toBe(true);
    expect(result.playerChoices.thirdEpisode?.banditEncounterPhase).toBe('deciding');
    expect(result.playerChoices.thirdEpisode?.dialogueProgress).toBe('understood_curse');
  });

  it('event 3 offer help after understanding curse resolves encounter', () => {
    const state: ThirdEpisodeState = { ...initialThirdEpisode(), banditEncounterPhase: 'deciding', curseRevealed: true, dialogueProgress: 'understood_curse' };
    const p = createProgress(2, state);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'bandit_offer_help');
    expect(result.playerChoices.thirdEpisode?.banditEncounterPhase).toBe('resolved');
    expect(result.completedEvents).toHaveLength(3);
  });

  it('event 3 escape from initial completes without investigation', () => {
    const p = createProgress(2);
    const result = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'bandit_escape');
    expect(result.playerChoices.thirdEpisode?.banditEncounterPhase).toBe('resolved');
    expect(result.completedEvents).toHaveLength(3);
  });

  it('event 3 full dialogue path (listen → investigate → help)', () => {
    let p = createProgress(2);
    
    // Listen
    p = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'bandit_listen');
    expect(p.playerChoices.thirdEpisode?.banditEncounterPhase).toBe('listening');
    
    // Investigate
    p = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'bandit_investigate');
    expect(p.playerChoices.thirdEpisode?.curseRevealed).toBe(true);
    expect(p.playerChoices.thirdEpisode?.banditEncounterPhase).toBe('deciding');
    
    // Help
    p = playThirdEpisode(p, `${THIRD_EPISODE_ID}_event_3`, 'bandit_offer_help');
    expect(p.playerChoices.thirdEpisode?.banditEncounterPhase).toBe('resolved');
    expect(p.completedEvents).toHaveLength(3);
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
    
    const invalid = { ...valid, curseRevealed: 'yes' as any };
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
