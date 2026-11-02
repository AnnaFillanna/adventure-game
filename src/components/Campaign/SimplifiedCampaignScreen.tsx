/**
 * Adventure Game - Simplified Campaign Screen
 * Minimalist, atmospheric gameplay - no technical UI clutter
 * Shows only the current story event and essential actions
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
    navigate('/character-select');
  }

  function handleDebugMode() {
    navigate('/debug/campaign');
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
      {/* Minimalist header - just hero name and pause */}
      <header className="minimalist-header">
        <div className="hero-info">
          <p className="hero-name">{getHeroDefinition(heroId).name}</p>
        </div>
        <button className="pause-button" onClick={handlePause} title="Pausieren und Heldenauswahl">⏸</button>
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
              onClick={() => dispatch({ type: 'start', episodeId: currentEpisode.id, mode: 'normal' })}
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

      {/* Debug footer - subtle, optional */}
      <footer className="debug-footer">
        <button className="debug-button" onClick={handleDebugMode} title="Vollständige Kampagnenübersicht">DebugCampaign</button>
      </footer>
    </main>
  );
}

export default SimplifiedCampaignScreen;
