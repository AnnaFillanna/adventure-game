import type { EpisodeProgress } from '../../types/campaign';
import { getThirdEpisodeState, type ThirdEpisodeInput } from '../../game/campaign/thirdEpisode';
import { thirdEpisode as text } from '../../locales/thirdEpisode';

export function ThirdEpisodeEvent({ progress, eventNumber, onInput }: {
  progress: EpisodeProgress; eventNumber: number; onInput: (input: ThirdEpisodeInput) => void;
}) {
  const state = getThirdEpisodeState(progress);
  
  return <div className="playable-event">
    {eventNumber === 1 && <>
      <blockquote>{text.event1.merchant.intro}</blockquote>
      {state.merchantDialogStep >= 1 && <blockquote>{text.event1.merchant.second}</blockquote>}
      {state.merchantDialogStep >= 1 && <blockquote>{text.event1.merchant.third}</blockquote>}
      <button className="primary" onClick={() => onInput('merchantGreet')}>
        {text.event1.button}
      </button>
    </>}
    
    {eventNumber === 2 && <>
      <p>{text.event2.scene}</p>
      <p>Gefundene Spuren: {state.traceStep} / 2</p>
      <div className="event-actions">
        <button onClick={() => onInput('trace_morning')}>{text.event2.buttons.morning}</button>
        <button onClick={() => onInput('trace_evening')}>{text.event2.buttons.evening}</button>
        <button onClick={() => onInput('trace_help')}>{text.event2.buttons.help}</button>
      </div>
    </>}
    
    {eventNumber === 3 && <>
      <p>{text.event3.scene}</p>
      {state.banditCombatPhase === 0 && (
        <>
          <p>{text.event3.banditLeader.intro}</p>
          <div className="event-actions">
            <button onClick={() => onInput('combat_attack')}>{text.event3.buttons.attack}</button>
            <button onClick={() => onInput('combat_help')}>{text.event3.buttons.help}</button>
          </div>
        </>
      )}
      {state.banditCombatPhase > 0 && state.playerHealth > 0 && (
        <>
          <div className="combat-meters">
            <label>Deine Kraft: {state.playerHealth} / 3<progress max={3} value={state.playerHealth} /></label>
            <label>Bandit-Anführer: {state.banditHealth} / 3<progress max={3} value={state.banditHealth} /></label>
          </div>
          <div className="event-actions">
            <button onClick={() => onInput('combat_attack')}>{text.event3.buttons.attack}</button>
            <button onClick={() => onInput('combat_defend')}>{text.event3.buttons.defend}</button>
            <button onClick={() => onInput('combat_help')}>{text.event3.buttons.help}</button>
          </div>
        </>
      )}
      {state.playerHealth === 0 && (
        <>
          <p className="telegraph">{text.event3.combat.playerDefeated}</p>
          <button onClick={() => onInput('combat_retry')}>{text.event3.buttons.retry}</button>
        </>
      )}
    </>}
    
    {eventNumber === 4 && <>
      <p>{text.event4.scene}</p>
      <p>{text.event4.lantern.intro}</p>
      <button className="primary" onClick={() => onInput('lantern_light')}>
        {text.event4.button}
      </button>
      {state.lanternLit && <p className="telegraph">{text.event4.lantern.after}</p>}
    </>}
    
    <p role="status">{getFeedbackText(state.feedback, text)}</p>
  </div>;
}

function getFeedbackText(feedback: string, text: any): string {
  switch (feedback) {
    case 'merchantGreet':
      return 'Der Händler erzählt dir von der gestohlenen Laterne...';
    case 'traceCorrect':
      return text.event2.feedback.traceCorrect;
    case 'traceWrong':
      return text.event2.feedback.traceWrong;
    case 'traceHelp':
      return text.event2.feedback.traceHelp;
    case 'combatStart':
      return text.event3.combat.combatStart;
    case 'playerAttack':
      return text.event3.combat.playerAttack;
    case 'playerDefend':
      return text.event3.combat.playerDefend;
    case 'combatHelp':
      return text.event3.combat.combatHelp;
    case 'banditAttack':
      return text.event3.combat.banditAttack;
    case 'banditDefeated':
      return text.event3.combat.banditDefeated;
    case 'playerDefeated':
      return text.event3.combat.playerDefeated;
    case 'combatRetry':
      return text.event3.combat.combatRetry;
    case 'lanternLit':
      return 'Die Laterne entzündet sich mit violettem Licht!';
    case 'none':
    default:
      return '';
  }
}
