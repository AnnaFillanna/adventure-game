/**
 * Outdoor Adventure Component
 * GPS-based discovery with automatic language detection
 */

import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import type { GeoPoint as LocationPoint } from '../game/geo/types';
import { geolocationService } from '../game/geo/geolocation';
import { demoMode } from '../game/geo/demo';
import {
  createInitialOutdoorQuest,
  updateOutdoorQuestPosition,
  loadOutdoorQuestState,
  saveOutdoorQuestState,
  getQuestProgress,
  calculateDistance,
} from '../game/outdoor/questEngine';
import type { OutdoorQuestState, GeoPoint, LocationError } from '../game/outdoor/types';
import { outdoorAdventure as text } from '../locales/outdoorAdventure';
import styles from './OutdoorAdventure.module.scss';

const LocationMap = lazy(() => import('../components/Map/LocationMap').then(module => ({ default: module.LocationMap })));

interface OutdoorAdventureProps {
  onReturn?: () => void;
  allowDemoMode?: boolean;
}

// Convert geolocation GeoPoint to outdoor GeoPoint
function toOutdoorGeoPoint(geoPoint: any): GeoPoint {
  return {
    lat: geoPoint.lat,
    lng: geoPoint.lng,
    accuracy: geoPoint.accuracy,
    altitude: geoPoint.altitude,
    timestamp: geoPoint.timestamp || Date.now(),
  };
}

export function OutdoorAdventureDemo({ onReturn, allowDemoMode = false }: OutdoorAdventureProps) {
  const [questState, setQuestState] = useState<OutdoorQuestState | null>(null);
  const [currentPosition, setCurrentPosition] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSafetyNotice, setShowSafetyNotice] = useState(false);
  const [demoModeEnabled, setDemoModeEnabled] = useState(false);

  useEffect(() => () => {
    geolocationService.stopTracking();
    demoMode.disable();
  }, []);

  // Initialize quest on mount
  useEffect(() => {
    const initializeQuest = () => {
      // Try to load saved quest state
      const saved = loadOutdoorQuestState();

      if (saved && saved.status !== 'completed') {
        setQuestState(saved);
      } else {
        // Create new quest with current position (or null)
        const newQuest = createInitialOutdoorQuest(null);
        setQuestState(newQuest);
      }

      // Show safety notice on first start
      if (!localStorage.getItem('adventure_game_safety_noticed')) {
        setShowSafetyNotice(true);
        localStorage.setItem('adventure_game_safety_noticed', 'true');
      }

      setIsLoading(false);
    };

    initializeQuest();
  }, []);

  // Request location permission and start tracking
  const startAdventure = () => {
    if (!questState) return;

    setIsLoading(true);
    setError(null);

    // Check for demo mode
    const isDemoMode = allowDemoMode && localStorage.getItem('__ADVENTURE_GAME_DEMO_MODE__') === 'true';

    if (isDemoMode) {
      setDemoModeEnabled(true);
      demoMode.enable();
      demoMode.reset();
      const demoPos = demoMode.getPosition();

      const geoPoint: GeoPoint = {
        lat: demoPos.lat,
        lng: demoPos.lng,
        accuracy: demoPos.accuracy,
        timestamp: Date.now(),
      };

      setCurrentPosition(geoPoint);
      const { newState } = updateOutdoorQuestPosition(questState, geoPoint);
      setQuestState(newState);
      saveOutdoorQuestState(newState);
      setIsLoading(false);
      return;
    }

    // Request real GPS access
    if (!geolocationService.canUseGeolocation()) {
      const canUseHTTPS = geolocationService.isHTTPS() || geolocationService.isLocalhost();
      const supported = geolocationService.isSupported();

      setError({
        code: !supported ? 'POSITION_UNAVAILABLE' : canUseHTTPS ? 'POSITION_UNAVAILABLE' : 'HTTPS_REQUIRED',
        message: !supported
          ? text.locationUnavailable
          : !canUseHTTPS
            ? text.httpsRequired
            : text.locationUnavailable,
        timestamp: Date.now(),
      });

      setIsLoading(false);
      return;
    }

    geolocationService.getCurrentPosition(
      (position) => {
        const geoPoint = toOutdoorGeoPoint(position);
        setCurrentPosition(geoPoint);
        const { newState } = updateOutdoorQuestPosition(questState, geoPoint);
        setQuestState(newState);
        saveOutdoorQuestState(newState);
        setIsLoading(false);

        // Start continuous tracking
        geolocationService.startTracking(
          (trackedPosition) => {
            const trackedGeoPoint = toOutdoorGeoPoint(trackedPosition);
            setCurrentPosition(trackedGeoPoint);
            setQuestState((prev) => {
              if (!prev) return null;
              const { newState: updated } = updateOutdoorQuestPosition(prev, trackedGeoPoint);
              saveOutdoorQuestState(updated);
              return updated;
            });
          },
          (err) => {
            setError(err);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        );
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Stop adventure and clean up
  const stopAdventure = () => {
    geolocationService.stopTracking();
    if (demoModeEnabled) {
      demoMode.disable();
    }
    onReturn?.();
  };

  // Handle demo mode movement
  const simulateMovement = (direction: 'north' | 'east' | 'south' | 'west') => {
    if (!demoModeEnabled || !questState) return;

    switch (direction) {
      case 'north':
        demoMode.moveNorth();
        break;
      case 'south':
        demoMode.moveSouth();
        break;
      case 'east':
        demoMode.moveEast();
        break;
      case 'west':
        demoMode.moveWest();
        break;
    }

    const pos = demoMode.getPosition();
    const geoPoint: GeoPoint = {
      lat: pos.lat,
      lng: pos.lng,
      accuracy: pos.accuracy,
      timestamp: Date.now(),
    };

    setCurrentPosition(geoPoint);
    const { newState } = updateOutdoorQuestPosition(questState, geoPoint);
    setQuestState(newState);
    saveOutdoorQuestState(newState);
  };

  if (isLoading || !questState) {
    return (
      <div className={styles.container}>
        <p>{text.preparing}</p>
      </div>
    );
  }

  const progress = getQuestProgress(questState);
  const isActive = questState.status === 'in_progress' || questState.status === 'completed';

  return (
    <div className={styles.container}>
      {/* Safety Notice */}
      {showSafetyNotice && (
        <div className={styles.modal}>
          <article className={styles.safetyNotice}>
            <h2>{text.safetyTitle}</h2>
            <p>{text.safetyMessage}</p>
            <button onClick={() => setShowSafetyNotice(false)}>{text.safetyAccepted}</button>
          </article>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <h1>{text.title}</h1>
        <p>{text.subtitle}</p>
      </header>

      {/* Status */}
      <section className={styles.status}>
        {error ? (
          <div className={styles.error}>
            <p className={styles.errorIcon}>⚠️</p>
            <p className={styles.errorMessage}>{error.message}</p>
          </div>
        ) : isActive ? (
          <>
            <div className={styles.statusBadge}>
              {demoModeEnabled ? '🎮 Demo Mode' : '📍 GPS Aktiv'}
            </div>
            <div className={styles.progress}>
              <p>
                {text.progress
                  .replace('{current}', String(questState.completedTargets.length))
                  .replace('{total}', String(questState.targets.length))}
              </p>
              <progress value={progress} max={100} />
              <p>{Math.round(progress)}% {text.progressPercent.replace('{percent}', '')}</p>
            </div>
          </>
        ) : (
          <div className={styles.idle}>
            <p>{text.idle}</p>
          </div>
        )}
      </section>

      {/* Position Info */}
      {currentPosition && (
        <section className={styles.positionInfo}>
          <div>
            <small>{text.currentPosition}</small>
            <p>
              {currentPosition.lat.toFixed(4)}° {currentPosition.lng.toFixed(4)}°
            </p>
          </div>
          {currentPosition.accuracy && (
            <div>
              <small>{text.accuracy.replace('{accuracy}', Math.round(currentPosition.accuracy).toString())}</small>
            </div>
          )}
        </section>
      )}

      {/* Discovery Targets */}
      <section className={styles.targets}>
        <h2>{text.discoveryTitle}</h2>
        <div className={styles.targetList}>
          {questState.targets.map((target) => {
            const discovered = questState.completedTargets.includes(target.id);
            const distance = currentPosition
              ? calculateDistance(currentPosition.lat, currentPosition.lng, target.latitude, target.longitude)
              : Infinity;
            const nearbyThreshold = target.radiusMeters * 1.5;

            return (
              <article key={target.id} className={`${styles.targetCard} ${discovered ? styles.discovered : ''}`}>
                <div className={styles.targetHeader}>
                  <span className={styles.targetIcon}>
                    {discovered ? '✨' : distance < nearbyThreshold ? '🧭' : '🔍'}
                  </span>
                  <h3>{target.name}</h3>
                </div>
                <p className={styles.targetDescription}>{target.description}</p>
                {currentPosition && (
                  <p className={styles.targetDistance}>
                    📍 {Math.round(distance)}m{' '}
                    {discovered ? `(${text.targetFound})` : distance < nearbyThreshold ? `(${text.targetNearby})` : ''}
                  </p>
                )}
                {discovered && (
                  <p className={styles.discoveryMessage}>💫 {target.reward.message}</p>
                )}
                <div className={styles.reward}>
                  <span>+{target.reward.xp} XP</span>
                  <span>+{target.reward.gold} Gold</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Demo Mode Controls */}
      {demoModeEnabled && (
        <section className={styles.demoControls}>
          <p>Demo-Modus: Verwende die Pfeile, um dich zu bewegen</p>
          <div className={styles.demoButtons}>
            <button onClick={() => simulateMovement('north')}>⬆️ Nord</button>
            <button onClick={() => simulateMovement('south')}>⬇️ Süd</button>
            <button onClick={() => simulateMovement('east')}>➡️ Ost</button>
            <button onClick={() => simulateMovement('west')}>⬅️ West</button>
          </div>
        </section>
      )}

      {/* Rewards Summary */}
      {questState.totalXpEarned > 0 && (
        <section className={styles.rewardsSummary}>
          <div>
            <span>⭐ {questState.totalXpEarned} XP</span>
            <span>💰 {questState.totalGoldEarned} Gold</span>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <section className={styles.actions}>
        {!isActive ? (
          <button className={styles.primaryButton} onClick={startAdventure}>
            {questState.startedAt ? text.continueQuest : text.startQuest}
          </button>
        ) : (
          <>
            <button className={styles.secondaryButton} onClick={stopAdventure}>
              {text.stopQuest}
            </button>
          </>
        )}
        {onReturn && (
          <button className={styles.cancelButton} onClick={onReturn}>
            {text.back}
          </button>
        )}
      </section>

      {/* Completion message */}
      {questState.status === 'completed' && (
        <article className={styles.completionMessage}>
          <h2>🎉 {text.allDiscovered}</h2>
          <p>
            Du hast {questState.totalXpEarned} XP und {questState.totalGoldEarned} Gold verdient!
          </p>
        </article>
      )}
    </div>
  );
}

/** Real entry: location capability only, until eligible walking routes exist. */
export function OutdoorAdventure({ onReturn }: OutdoorAdventureProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState<LocationPoint | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [tracking, setTracking] = useState(false);
  const watchGeneration = useRef(0);
  const watchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  const requestId = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    mounted.current = true;
    const pauseWhenHidden = () => {
      if (document.visibilityState !== 'hidden') return;
      watchGeneration.current++;
      requestId.current++;
      clearTimeout(timeoutRef.current);
      clearTimeout(watchTimer.current);
      geolocationService.stopTracking();
      setTracking(false);
      setStatus('idle');
      setMessage('GPS pausiert, weil das Spiel im Hintergrund war. Starte die Standortsuche erneut, wenn du weitermachen möchtest.');
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => {
      mounted.current = false;
      requestId.current++;
      watchGeneration.current++;
      clearTimeout(timeoutRef.current);
      clearTimeout(watchTimer.current);
      geolocationService.stopTracking();
      document.removeEventListener('visibilitychange', pauseWhenHidden);
    };
  }, []);
  function stopLive() {
    watchGeneration.current++;
    clearTimeout(watchTimer.current);
    geolocationService.stopTracking();
    setTracking(false);
  }
  function startLive() {
    stopLive();
    const generation = watchGeneration.current;
    setTracking(true);
    setStatus('ready');
    setMessage('GPS wird laufend aktualisiert, solange dieser Bildschirm geöffnet ist.');
    const armTimeout = () => {
      clearTimeout(watchTimer.current);
      watchTimer.current = setTimeout(() => {
        if (!mounted.current || generation !== watchGeneration.current) return;
        stopLive();
        setStatus('error');
        setMessage('Seit 20 Sekunden kein aktueller Standort. GPS wurde pausiert. Du kannst die Suche erneut starten.');
      }, 20000);
    };
    armTimeout();
    geolocationService.startTracking(next => {
      if (!mounted.current || generation !== watchGeneration.current) return;
      if (!validPosition(next)) return;
      if (next.timestamp && Date.now() - next.timestamp > 30000) return;
      armTimeout();
      setPosition(next);
      setStatus('ready');
      setMessage((next.accuracy ?? Infinity) > 100 ? 'GPS verbunden, aber noch zu ungenau. Die Karte zeigt nur einen ungefähren Standort.' : 'GPS aktiv. Dein Standort auf der Karte wird aktualisiert.');
    }, error => {
      if (!mounted.current || generation !== watchGeneration.current) return;
      stopLive();
      setStatus('error');
      setMessage(error.code === 'PERMISSION_DENIED'
        ? 'Die Standortfreigabe wurde entzogen. GPS ist pausiert. Erlaube den Zugriff in deinen Browsereinstellungen und versuche es erneut.'
        : 'Das GPS-Signal ist gerade nicht verfügbar. Die letzte Position bleibt sichtbar; starte die Suche erneut.');
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 });
  }
  function validPosition(point: LocationPoint) {
    return Number.isFinite(point.lat) && Math.abs(point.lat) <= 90 && Number.isFinite(point.lng) && Math.abs(point.lng) <= 180 &&
      (point.accuracy === undefined || (Number.isFinite(point.accuracy) && point.accuracy >= 0));
  }
  function checkLocation() {
    stopLive();
    const id = ++requestId.current;
    clearTimeout(timeoutRef.current);
    const finish = () => {
      if (!mounted.current || requestId.current !== id) return false;
      clearTimeout(timeoutRef.current);
      requestId.current++;
      return true;
    };
    setStatus('loading');
    setMessage('Dein Standort wird ermittelt … Du kannst auch ohne Standort weiterspielen.');
    timeoutRef.current = setTimeout(() => {
      if (!finish()) return;
      setStatus('error');
      setMessage('Dein Browser hat noch keinen Standort geliefert. Auch nach der Erlaubnis kann die Suche scheitern. Versuche es erneut oder spiele ohne GPS weiter.');
    }, 15000);
    geolocationService.getCurrentPosition(position => {
      if (!finish()) return;
      if (!validPosition(position)) {
        setStatus('error');
        setMessage('Dein Browser hat keinen gültigen Standort geliefert. Bitte versuche es erneut.');
        return;
      }
      setPosition(position);
      setStatus('ready');
      setMessage((position.accuracy ?? Infinity) > 100
        ? 'Dein Standort ist noch zu ungenau. Versuche es später unter freiem Himmel erneut.'
        : 'Standort empfangen. GPS funktioniert. Du kannst jetzt die Karte öffnen und deinen Standort live aktualisieren.');
    }, error => {
      if (!finish()) return;
      setStatus('error');
      const messages: Record<string, string> = {
        PERMISSION_DENIED: 'Du hast den Standort nicht freigegeben. Du kannst die Geschichte ohne GPS spielen oder den Zugriff in deinen Browsereinstellungen erlauben.',
        TIMEOUT: 'Die Standortsuche hat zu lange gedauert. Versuche es erneut oder spiele ohne GPS weiter.',
        HTTPS_REQUIRED: 'Die Standortsuche benötigt eine sichere Verbindung. Öffne das Spiel über seine HTTPS-Adresse.',
      };
      setMessage(messages[error.code] ?? 'Dein Standort ist gerade nicht verfügbar. Versuche es später erneut oder spiele ohne GPS weiter.');
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  }
  return <main className={styles.container}>
    <header className={styles.header}><h1>Dein GPS-Standort</h1><p>Standort empfangen → Karte öffnen → GPS live starten</p></header>
    <section className={styles.status}>
      <h2>{tracking ? 'GPS ist eingeschaltet' : position ? 'Standort empfangen' : 'GPS einschalten'}</h2>
      <p>Erst wenn du „Standort freigeben“ antippst, fragt dein Browser nach deiner Erlaubnis. Zunächst wird dein Standort einmal abgerufen. Mit „GPS live starten“ aktualisierst du ihn laufend. Beim Verlassen oder Ausblenden dieser Seite stoppt die Aktualisierung. Eine Wegstrecke wird nicht gespeichert.</p>
      <p>Die GPS-Karte ist verfügbar. Aufgaben entlang geprüfter Spazierwege sind noch nicht eingerichtet.</p>
      <p role={status === 'error' ? 'alert' : 'status'}>{message}</p>
    </section>
    {position && <section className={styles.status} aria-label="Empfangener Standort">
      <h2>{tracking ? 'GPS live' : 'Letzter empfangener Standort'}</h2>
      <p>Genauigkeit: {position.accuracy === undefined ? 'unbekannt' : `${Math.round(position.accuracy)} m`}</p>
      <p>Breite: {position.lat.toLocaleString('de-DE', { maximumFractionDigits: 5 })} · Länge: {position.lng.toLocaleString('de-DE', { maximumFractionDigits: 5 })}</p>
      {position.timestamp && <p>Empfangen um {new Date(position.timestamp).toLocaleTimeString('de-DE')}</p>}
      <p>Es ist noch kein geprüfter Spazierweg verfügbar. Die Karte zeigt deinen Standort, keine freigegebene Spielroute.</p>
      {!showMap ? <><p>Beim Öffnen lädt OpenStreetMap Kartenbilder für diesen Bereich und erhält dabei deine IP-Adresse und den angezeigten Kartenausschnitt.</p><button className={styles.secondaryButton} onClick={() => setShowMap(true)}>Karte anzeigen</button></> : <Suspense fallback={<p>Karte wird geladen …</p>}><LocationMap position={position} /></Suspense>}
      {tracking ? <button className={styles.secondaryButton} onClick={() => { stopLive(); setMessage('GPS pausiert. Die letzte Position bleibt sichtbar.'); }}>GPS pausieren</button>
        : <button className={styles.primaryButton} disabled={status === 'loading'} onClick={startLive}>GPS live starten</button>}
    </section>}
    <section className={styles.actions}>
      {status === 'ready' && <button className={styles.secondaryButton} onClick={onReturn}>Geschichte öffnen</button>}
      <button className={status === 'ready' ? styles.secondaryButton : styles.primaryButton} disabled={status === 'loading'} onClick={checkLocation}>
        {status === 'loading' ? 'Standort wird gesucht …' : status === 'idle' ? 'Standort freigeben' : 'Standort erneut prüfen'}
      </button>
      <button className={styles.secondaryButton} onClick={onReturn}>Zur Abenteuerübersicht</button>
      {status !== 'ready' && <button className={styles.secondaryButton} onClick={onReturn}>Ohne Standort weiterspielen</button>}
    </section>
  </main>;
}
