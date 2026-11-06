/**
 * Adventure Game - Simplified Campaign Screen
 * Minimalist, atmospheric gameplay - no technical UI clutter
 * Shows only the current story event and essential actions
 * GPS/Outdoor discovery integrated with simple header button
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SecondEpisodeEvent } from './SecondEpisodeEvent';
import { FirstEpisodeEvent } from './FirstEpisodeEvent';
import { ThirdEpisodeEvent } from './ThirdEpisodeEvent';
import { getTextDynamic } from '../../locales';
import { getHeroDefinition } from '../../game/characters/heroDefinitions';
import type { HeroId } from '../../game/characters/types';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../../game/campaign/campaignData';
import { initializeCampaignProgress } from '../../game/campaign/episodeManager';
import { hasCampaignSave, loadCampaignProgress, saveCampaignProgress } from '../../game/campaign/campaignStorage';
import { transitionCampaign } from '../../game/campaign/campaignSession';
import type { CampaignAction } from '../../game/campaign/campaignSession';
import './SimplifiedCampaignScreen.scss';

export function SimplifiedCampaignScreen({ heroId }: { heroId: HeroId }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => 
    loadCampaignProgress(campaign.id, heroId) ??
    (hasCampaignSave(campaign.id, heroId) ? null : initializeCampaignProgress(campaign.id, heroId))
  );
  const [error, setError] = useState('');
  
  // Find the first non-completed, non-locked episode
  const currentEpisode = campaign.episodes.find(ep => {
    const status = progress?.episodeProgress[ep.id].status;
    return status !== 'completed' && status !== 'locked';
  }) ?? campaign.episodes[0];

  const ep = progress?.episodeProgress[currentEpisode.id];
  const nextEvent = currentEpisode.events.find(event => !ep?.completedEvents.includes(event.id));

  function dispatch(action: CampaignAction) {
    if (!progress) return;
    const next = transitionCampaign(progress, action);
    if (next === progress) return;
    if (!saveCampaignProgress(next)) {
      setError('Speichern fehlgeschlagen. Dein Fortschritt bleibt erhalten.');
      return;
    }
    setProgress(next);
    setError('');
  }

  function handlePause() {
    if (ep?.status === 'in_progress' && progress) {
      const next = transitionCampaign(progress, { type: 'pause', episodeId: currentEpisode.id });
      if (!saveCampaignProgress(next)) {
        setError('Pause konnte nicht gespeichert werden.');
        return;
      }
    }
    navigate('/hub');
  }


  if (!progress || !ep) {
    return (
      <main className="simplified-campaign-screen error">
        <div className="error-container">
          <h1>Spielstand nicht verfügbar</h1>
          <p role="alert">Dein Spielstand konnte nicht sicher geladen werden.</p>
          <button onClick={() => navigate('/character-select')}>Zur Heldenauswahl</button>
        </div>
      </main>
    );
  }

  return (
    <main className="simplified-campaign-screen">
      {/* Minimalist header - hero name, GPS button, and pause */}
      <header className="minimalist-header">
        <div className="hero-info">
          <p className="hero-name">{getHeroDefinition(heroId).name}</p>
        </div>
        <div className="header-actions">
          <button className="pause-button" onClick={handlePause} title="Pausieren und zur Übersicht">Pause & Übersicht</button>
        </div>
      </header>

      {/* Error message if needed */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Story section - only show current event */}
      <article className="story-section">
        {/* Episode title - subtle */}
        <div className="episode-header">
          <h2 className="episode-title">{getTextDynamic(currentEpisode.titleKey)}</h2>
        </div>

        <p>Dein Ziel: {currentEpisode.number === 1 ? 'Sichere die erste Spur zum Schwert des Ersten Lichts.' : getTextDynamic(currentEpisode.descriptionKey)}</p>
        <p role="status">{ep.completedEvents.length} von {currentEpisode.events.length} Aufgaben erledigt.</p>
        <p>Jede bestätigte Aktion wird auf diesem Gerät gespeichert. Du kannst jederzeit pausieren und später fortsetzen.</p>
        {currentEpisode.number > 3 && <p>Dieser Teil ist bisher nur eine Vorschau mit simulierten Aufgaben.</p>}
        {/* Campaign completion */}
        {progress.status === 'completed' && (
          <section className="campaign-finale">
            <h2>Gemeinsam für das Licht</h2>
            <p>Die Kampagne ist abgeschlossen. Dein Erinnerungsbuch bleibt hier erhalten.</p>
            <button onClick={() => navigate('/')}>Zum Startbildschirm</button>
          </section>
        )}

        {/* Current event - only render if episode is in progress */}
        {ep.status === 'unlocked' && (
          <section className="episode-start">
            <p className="story-intro">{getTextDynamic(currentEpisode.descriptionKey)}</p>
            <button 
              className="big-action-button" 
              onClick={() => dispatch({ type: 'start', episodeId: currentEpisode.id, mode: 'short' })}
            >
              Abenteuer beginnen
            </button>
          </section>
        )}

        {ep.status === 'in_progress' && nextEvent && (
          <section className="event-section">
            {/* Event title - atmospheric */}
            <h2 className="event-title">{getTextDynamic(nextEvent.titleKey)}</h2>

            {/* Render the appropriate event component */}
            {currentEpisode.number === 1 ? (
              <FirstEpisodeEvent 
                progress={ep} 
                eventNumber={nextEvent.order}
                onInput={input => dispatch({ type: 'play', episodeId: currentEpisode.id, eventId: nextEvent.id, input })}
              />
            ) : currentEpisode.number === 2 ? (
              <SecondEpisodeEvent 
                progress={ep} 
                eventNumber={nextEvent.order}
                onInput={input => dispatch({ type: 'playSecond', episodeId: currentEpisode.id, eventId: nextEvent.id, input })}
              />
            ) : currentEpisode.number === 3 ? (
              <ThirdEpisodeEvent 
                progress={ep} 
                eventNumber={nextEvent.order}
                onInput={input => dispatch({ type: 'playThird', episodeId: currentEpisode.id, eventId: nextEvent.id, input })}
              />
            ) : (
              /* Fallback for episodes 4+ (simulated) */
              <div className="simulated-event">
                <p>{getTextDynamic(nextEvent.descriptionKey)}</p>
                <button 
                  className="big-action-button" 
                  onClick={() => dispatch({ type: 'event', episodeId: currentEpisode.id, eventId: nextEvent.id })}
                >
                  Fortfahren
                </button>
              </div>
            )}

            {/* Minimal pause button at bottom */}
            <div className="action-footer">
              <button 
                className="secondary-button" 
                onClick={() => dispatch({ type: 'pause', episodeId: currentEpisode.id })}
              >
                Pausieren
              </button>
            </div>
          </section>
        )}

        {ep.status === 'in_progress' && !nextEvent && (
          <section className="episode-completion">
            <h2>Abenteuer vollständig</h2>
            <p>{getTextDynamic(currentEpisode.storyProgressKey ?? 'game.continue')}</p>
            <button 
              className="big-action-button" 
              onClick={() => dispatch({ type: 'finish', episodeId: currentEpisode.id })}
            >
              Abschließen
            </button>
          </section>
        )}

        {ep.status === 'paused' && (
          <section className="episode-paused">
            <h2>Abenteuer pausiert</h2>
            <button 
              className="big-action-button" 
              onClick={() => dispatch({ type: 'resume', episodeId: currentEpisode.id })}
            >
              Fortsetzen
            </button>
          </section>
        )}

        {ep.status === 'completed' && (
          <section className="episode-completed">
            <h2>Episode abgeschlossen ✓</h2>
            <p>{getTextDynamic(currentEpisode.storyProgressKey ?? 'game.continue')}</p>
            <button 
              className="big-action-button" 
              onClick={() => window.location.reload()}
            >
              Nächstes Abenteuer
            </button>
          </section>
        )}
      </article>
    </main>
  );
}

export default SimplifiedCampaignScreen;
