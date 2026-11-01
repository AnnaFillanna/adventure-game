import type { EpisodeProgress } from '../../types/campaign';
import { getSecondEpisodeState, type SecondEpisodeInput } from '../../game/campaign/secondEpisode';
import { secondEpisodeText as text } from '../../locales/secondEpisode';
export function SecondEpisodeEvent({ progress, eventNumber, onInput }: {
  progress: EpisodeProgress; eventNumber: number; onInput: (input: SecondEpisodeInput) => void;
}) {
  const state = getSecondEpisodeState(progress);
  return <div className="playable-event">
    {eventNumber === 1 && <><blockquote>{text.meet}</blockquote><button className="primary" onClick={() => onInput('meet')}>{text.accept}</button></>}
    {eventNumber === 2 && <><p>{text.bells}</p><p>Geordnete Zeichen: {state.bellStep} / 3</p><div className="event-actions">
      <button onClick={() => onInput('star')}>{text.star}</button><button onClick={() => onInput('root')}>{text.root}</button><button onClick={() => onInput('wave')}>{text.wave}</button><button onClick={() => onInput('bell_help')}>{text.help}</button></div></>}
    {eventNumber === 3 && <><p>{text.encounter}</p><p className="telegraph">{text.stages[state.calmStep]}</p><p>Vertrauen: {state.calmStep} / 3</p><div className="event-actions">
      <button onClick={() => onInput('listen')}>{text.listen}</button><button onClick={() => onInput('name')}>{text.name}</button><button onClick={() => onInput('hum')}>{text.hum}</button><button onClick={() => onInput('threaten')}>{text.threaten}</button><button onClick={() => onInput('calm_help')}>{text.help}</button></div></>}
    {eventNumber === 4 && <><p>{text.memoryIntro}</p>{state.memoryOpened ? <><blockquote>{text.memory}</blockquote><button className="primary" onClick={() => onInput('keep_memory')}>{text.keep}</button></> : <button className="primary" onClick={() => onInput('open_memory')}>{text.open}</button>}</>}
    <p role="status">{text.feedback[state.feedback]}</p>
  </div>;
}
