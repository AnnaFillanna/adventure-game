/**
 * Adventure Game - Start Screen Component
 * Minimal atmosphärischer Startbildschirm mit zentaler "Spielen"-Aktion
 * Automatisches Fortsetzen bei vorhandenem Spielstand
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { saveManager, preferencesManager } from '../game/utils/storage';
import { getText } from '../locales';
import styles from './StartScreen.module.scss';

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const loadGame = useGameStore((state) => state.loadGame);

  // Auto-continue if save exists
  useEffect(() => {
    const hero = preferencesManager.getPreference('campaignHero', '');
    if (['aeran', 'velar', 'varg', 'ravena', 'saira'].includes(hero)) {
      navigate('/hub', { replace: true });
      return;
    }
    const hasSave = saveManager.hasSave();
    if (hasSave) {
      const save = saveManager.load();
      if (save) {
        // Auto-load game and navigate to campaign (skip character select)
        loadGame(JSON.stringify(save));
        navigate('/hub', { replace: true });
      }
    }
  }, [navigate, loadGame]);

  const handlePlay = () => {
    // New game or first visit: go to character selection
    navigate('/character-select');
  };

  return (
    <div className={styles.startScreen}>
      {/* Background with gradient overlay */}
      <div className={styles.background}>
        <div className={styles.forestPattern}></div>
        <div className={styles.overlay}></div>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{getText('startScreen.title')}</h1>
          <p className={styles.subtitle}>{getText('startScreen.subtitle')}</p>
        </div>

        {/* Decorative elements */}
        <div className={styles.decorativeElements}>
          <div className={styles.leaf + ' ' + styles.leaf1}>🍃</div>
          <div className={styles.leaf + ' ' + styles.leaf2}>🍂</div>
          <div className={styles.leaf + ' ' + styles.leaf3}>🍃</div>
        </div>

        {/* Button container - single play button only */}
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handlePlay}>
            <span className={styles.buttonIcon}>▶</span>
            {getText('startScreen.buttonStart')}
          </button>
        </div>

        {/* Footer info */}
        <div className={styles.footer}>
          <p className={styles.version}>Adventure Game · In Entwicklung</p>
          <p className={styles.copyright}>Dein Fortschritt bleibt auf diesem Gerät gespeichert.</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
