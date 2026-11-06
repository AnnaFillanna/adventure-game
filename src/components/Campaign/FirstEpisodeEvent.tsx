import type { EpisodeProgress } from '../../types/campaign';
import type { FirstEpisodeInput } from '../../game/campaign/firstEpisode';
import { getFirstEpisodeState } from '../../game/campaign/firstEpisode';
import { firstEpisodeText as text } from '../../locales/firstEpisode';

export function FirstEpisodeEvent({ progress, eventNumber, onInput }: {
  progress: EpisodeProgress; eventNumber: number; onInput: (input: FirstEpisodeInput) => void;
}) {
  const state = getFirstEpisodeState(progress);
  return <div className="playable-event">
    {eventNumber === 1 && <><blockquote>{text.message}</blockquote><button className="primary" onClick={() => onInput('read')}>{text.read}</button></>}
    {eventNumber === 2 && <><p>{text.trail}</p><div className="event-actions"><button onClick={() => onInput('trail_dawn')}>{text.dawn}</button><button onClick={() => onInput('trail_dusk')}>{text.dusk}</button><button onClick={() => onInput('trail_help')}>{text.help}</button></div></>}
    {eventNumber === 3 && <><p>{text.passage}</p><button className="big-action-button" onClick={() => onInput('continue_story')}>{text.continueStory}</button></>}
    {eventNumber === 4 && <><p>{text.stone}</p><p>Eingesetzte Splitter: {state.stoneStep} / 3</p><div className="event-actions"><button onClick={() => onInput('stone_tower')}>{text.tower}</button><button onClick={() => onInput('stone_sun')}>{text.sun}</button><button onClick={() => onInput('stone_path')}>{text.path}</button><button onClick={() => onInput('stone_help')}>{text.help}</button></div></>}
    <p role="status">{eventNumber === 3 ? '' : text.feedback[state.feedback]}</p>
  </div>;
}
