/**
 * Outdoor Adventure Component
 * GPS-based discovery with automatic language detection
 */

import { useEffect, useState } from 'react';
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

export function OutdoorAdventure({ onReturn, allowDemoMode = false }: OutdoorAdventureProps) {
  const [questState, setQuestState] = useState<OutdoorQuestState | null>(null);
  const [currentPosition, setCurrentPosition] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSafetyNotice, setShowSafetyNotice] = useState(false);
  const [demoModeEnabled, setDemoModeEnabled] = useState(false);

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
