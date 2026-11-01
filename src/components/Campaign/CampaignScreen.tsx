import { SecondEpisodeEvent } from './SecondEpisodeEvent';
import { FirstEpisodeEvent } from './FirstEpisodeEvent';
import { ThirdEpisodeEvent } from './ThirdEpisodeEvent';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTextDynamic } from '../../locales';
import { getHeroDefinition } from '../../game/characters/heroDefinitions';
import type { HeroId } from '../../game/characters/types';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../../game/campaign/campaignData';
import { initializeCampaignProgress } from '../../game/campaign/episodeManager';
import { hasCampaignSave, loadCampaignProgress, saveCampaignProgress } from '../../game/campaign/campaignStorage';
import { transitionCampaign } from '../../game/campaign/campaignSession';
import type { CampaignAction } from '../../game/campaign/campaignSession';
import './CampaignScreen.scss';

export function CampaignScreen({ heroId }: { heroId: HeroId }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => loadCampaignProgress(campaign.id, heroId) ??
    (hasCampaignSave(campaign.id, heroId) ? null : initializeCampaignProgress(campaign.id, heroId)));
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'short' | 'normal' | 'long'>('short');
  const [selectedId, setSelectedId] = useState(() => campaign.episodes.find(ep =>
    progress?.episodeProgress[ep.id].status !== 'completed' && progress?.episodeProgress[ep.id].status !== 'locked')?.id ?? campaign.episodes[0].id);
  const episode = campaign.episodes.find(ep => ep.id === selectedId)!;
  const ep = progress?.episodeProgress[selectedId];
  const nextEvent = episode.events.find(event => !ep?.completedEvents.includes(event.id));

  function dispatch(action: CampaignAction) {
    if (!progress) return;
    const next = transitionCampaign(progress, action);
    if (next === progress) return;
    if (!saveCampaignProgress(next)) {
      setError('Speichern fehlgeschlagen. Dein bisheriger Fortschritt bleibt erhalten. Bitte versuche die Aktion erneut.');
      return;
    }
    setProgress(next);
    setError('');
  }

  function leave() {
    if (ep?.status === 'in_progress' && progress) {
      const next = transitionCampaign(progress, { type: 'pause', episodeId: selectedId });
      if (!saveCampaignProgress(next)) { setError('Pause konnte nicht gespeichert werden. Bitte versuche es erneut.'); return; }
    }
    navigate('/character-select');
  }

  if (!progress || !ep) return <main className="campaign-screen"><h1>Spielstand nicht verfügbar</h1>
    <p role="alert">Dein Spielstand konnte nicht sicher geladen werden. Die gespeicherten Daten wurden nicht verändert.</p>
    <button onClick={() => navigate('/character-select')}>Zur Heldenauswahl</button></main>;
  const completed = Object.values(progress.episodeProgress).filter(p => p.status === 'completed').length;
  return <main className="campaign-screen">
    <header><div><p className="eyebrow">{getHeroDefinition(heroId).name} · Das erste Abenteuer</p>
      <h1>{getTextDynamic(campaign.titleKey)}</h1></div><button onClick={leave}>Pause & Heldenauswahl</button></header>
    <aside className="demo-notice"><strong>Abenteuer · ohne GPS</strong><p>Episoden 1, 2 und 3 sind vollständig spielbar. Episoden 4–30 bleiben eine Story-Demo mit simulierten Ereignissen. Du musst dich nicht bewegen. Jeder Zug wird gespeichert.</p></aside>
    <div className="campaign-stats" aria-live="polite"><span>{completed} / 30 Episoden</span><span>{progress.totalXpEarned} XP</span><span>{progress.totalGoldEarned} Gold · Kampagne</span></div>
    {error && <p role="alert" className="save-error">{error}</p>}
    {progress.status === 'completed' && <section className="campaign-finale"><h2>Gemeinsam für das Licht</h2><p>Die Kampagne ist abgeschlossen. Dein Erinnerungsbuch bleibt hier erhalten.</p></section>}
    <div className="campaign-layout"><nav aria-label="Kapitel und Episoden">
      {campaign.chapters.map(chapter => <section key={chapter.id}><h2>{getTextDynamic(chapter.titleKey)}</h2>
        {campaign.episodes.filter(item => item.chapterId === chapter.id).map(item => {
          const status = progress.episodeProgress[item.id].status;
          const active = Object.values(progress.episodeProgress).some(p => p.episodeId !== item.id && (p.status === 'in_progress' || p.status === 'paused'));
          return <button key={item.id} disabled={status === 'locked' || active} aria-current={selectedId === item.id ? 'step' : undefined}
            onClick={() => setSelectedId(item.id)}>{status === 'completed' ? '✓' : status === 'locked' ? '🔒' : '○'} {item.number}. {getTextDynamic(item.titleKey)}</button>;
        })}</section>)}
    </nav><article className="episode-panel"><p className="eyebrow">Episode {episode.number} · {ep.completedEvents.length} / 4 Ereignisse</p>
      <h2>{getTextDynamic(episode.titleKey)}</h2><p>{getTextDynamic(episode.descriptionKey)}</p>
      <ol>{episode.events.map(event => <li key={event.id} className={ep.completedEvents.includes(event.id) ? 'done' : ''}>{getTextDynamic(event.titleKey)}{ep.completedEvents.includes(event.id) ? ' ✓' : ''}</li>)}</ol>
      {ep.status === 'unlocked' && <><label htmlFor="distance-mode">Abenteuerlänge</label><select id="distance-mode" value={mode} onChange={e => setMode(e.target.value as typeof mode)}>
        <option value="short">Kurz · 1 km</option><option value="normal">Normal · 2,5 km</option><option value="long">Lang · 4,5 km</option></select>
        <p>Nur eine Auswahl für später. In der Demo ist keine Strecke erforderlich; alle Modi enthalten dieselben vier Ereignisse.</p>
        <button className="primary" onClick={() => dispatch({ type: 'start', episodeId: selectedId, mode })}>Episode starten</button></>}
      {ep.status === 'in_progress' && nextEvent && <section className="event-card"><p className="eyebrow">Ereignis {nextEvent.order} · {episode.number <= 3 ? 'Spielbar' : 'Simulation'}</p><h3>{getTextDynamic(nextEvent.titleKey)}</h3>
        {episode.number === 1 ? <FirstEpisodeEvent progress={ep} eventNumber={nextEvent.order}
          onInput={input => dispatch({ type: 'play', episodeId: selectedId, eventId: nextEvent.id, input })} />
          : episode.number === 2 ? <SecondEpisodeEvent progress={ep} eventNumber={nextEvent.order}
            onInput={input => dispatch({ type: 'playSecond', episodeId: selectedId, eventId: nextEvent.id, input })} />
          : episode.number === 3 ? <ThirdEpisodeEvent progress={ep} eventNumber={nextEvent.order}
            onInput={input => dispatch({ type: 'playThird', episodeId: selectedId, eventId: nextEvent.id, input })} />
          : <><p>{getTextDynamic(nextEvent.descriptionKey)}</p><button className="primary" onClick={() => dispatch({ type: 'event', episodeId: selectedId, eventId: nextEvent.id })}>Ereignis simulieren</button></>}
        <button onClick={() => dispatch({ type: 'pause', episodeId: selectedId })}>Pausieren</button></section>}
      {ep.status === 'in_progress' && !nextEvent && <button className="primary" onClick={() => dispatch({ type: 'finish', episodeId: selectedId })}>Episode abschließen</button>}
      {ep.status === 'paused' && <section><h3>Abenteuer pausiert</h3><p>Du kannst hier jederzeit fortsetzen.</p><button className="primary" onClick={() => dispatch({ type: 'resume', episodeId: selectedId })}>Fortsetzen</button></section>}
      {ep.status === 'completed' && <section className="event-card"><h3>Episode abgeschlossen</h3><p>{getTextDynamic(episode.storyProgressKey!)}</p><p>Die Belohnungen wurden einmalig in deiner Kampagne verbucht.</p>
        {campaign.episodes[episode.number] && <button className="primary" onClick={() => setSelectedId(campaign.episodes[episode.number].id)}>Nächste Episode</button>}</section>}
    </article></div>
  </main>;
}
