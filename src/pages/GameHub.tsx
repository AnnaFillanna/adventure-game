import { useState } from 'react';
import { initializeCampaignProgress } from '../game/campaign/episodeManager';
import { transitionCampaign } from '../game/campaign/campaignSession';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { preferencesManager } from '../game/utils/storage';
import type { HeroId } from '../game/characters/types';
import { getHeroDefinition } from '../game/characters/heroDefinitions';
import { loadCampaignProgress, hasCampaignSave, saveCampaignProgress } from '../game/campaign/campaignStorage';
import { CAMPAIGN_FIRST_LIGHT as campaign } from '../game/campaign/campaignData';
import { getTextDynamic } from '../locales';
import styles from './GameHub.module.scss';

export default function GameHub() {
  const navigate = useNavigate();
  const [entryError, setEntryError] = useState('');
  const selectedHeroId = useGameStore(state => state.selectedHeroId);
  const heroId = selectedHeroId ?? preferencesManager.getPreference<unknown>('campaignHero', null);
  if (typeof heroId !== 'string' || !['aeran', 'velar', 'varg', 'ravena', 'saira'].includes(heroId)) {
    return <Navigate to="/character-select" replace />;
  }
  const hero = getHeroDefinition(heroId as HeroId);
  const progress = loadCampaignProgress(campaign.id, heroId);
  const unreadable = !progress && hasCampaignSave(campaign.id, heroId);
  const episode = campaign.episodes.find(ep => {
    const status = progress?.episodeProgress[ep.id]?.status;
    return status !== 'completed' && status !== 'locked';
  }) ?? campaign.episodes[0];
  const completed = progress?.episodeProgress[episode.id]?.completedEvents.length ?? 0;
  function continueGame() {
    if (unreadable) { navigate('/game'); return; }
    const current = progress ?? initializeCampaignProgress(campaign.id, heroId as string);
    const state = current.episodeProgress[episode.id]?.status;
    const next = state === 'unlocked' ? transitionCampaign(current, {type:'start',episodeId:episode.id,mode:'short'})
      : state === 'paused' ? transitionCampaign(current, {type:'resume',episodeId:episode.id}) : current;
    if (next !== progress && !saveCampaignProgress(next)) { setEntryError('Speichern fehlgeschlagen. Bitte versuche es erneut. Dein Fortschritt bleibt erhalten.'); return; }
    navigate('/game');
  }
  return <main className={styles.gameHub}>
    <header className={styles.header}>
      <p>Dein Held: {hero.name}</p>
      <h1>{progress?.status === 'completed' ? 'Dein Erinnerungsbuch' : getTextDynamic(episode.titleKey)}</h1>
      <p>{episode.number === 1 ? 'Sichere die erste Spur zum Schwert des Ersten Lichts.' : getTextDynamic(episode.descriptionKey)}</p>
    </header>
    <section className={styles.introduction} aria-label="Dein nächster Schritt">
      <h2>{progress ? 'Hier geht es weiter' : 'Dein erstes Abenteuer'}</h2>
      <p>{completed} von {episode.events.length} Aufgaben erledigt.</p>
      <p>Setze dein Abenteuer an der letzten Stelle fort.</p>
      <button className={styles.primaryAction} onClick={continueGame}>
        Fortsetzen
      </button>
      {entryError && <p role="alert">{entryError}</p>}
      {unreadable && <p role="alert">Dein Spielstand konnte nicht geladen werden. Er bleibt erhalten; öffne die Geschichte für weitere Informationen.</p>}
      <p>Bestätigte Aktionen werden auf diesem Gerät gespeichert. Mit „Pause & Übersicht“ kannst du aufhören und später hier fortsetzen.</p>
    </section>
    <section className={styles.introduction}>
      <h2>Draußen entdecken</h2>
      <p>Starte eine kurze Test-GPS-Wanderung von deinem aktuellen Standort. Die App sucht zusammenhängende Fußwege und drei Aufgaben. Prüfe den Vorschlag vor Ort; Karten allein bestätigen keinen sicheren Weg.</p>
      <button className={styles.primaryAction} onClick={() => navigate('/hub/walk')}>GPS-Abenteuer in meiner Nähe</button>
      <button onClick={() => navigate('/hub/outdoor')}>Standort prüfen</button>
    </section>
    <nav className={styles.secondaryNav} aria-label="Dein Held">
      <button onClick={() => navigate('/hub/hero-info')}>Held ansehen</button>
      <button onClick={() => navigate('/hub/inventory')}>Inventar</button>
      <button onClick={() => navigate('/character-select')}>Helden wechseln</button>
    </nav>
  </main>;
}
