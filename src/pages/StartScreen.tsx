/**
 * Adventure Game - Start Screen Component
 * Atmosphärischer Startbildschirm mit Fantasy-Design
 * Verwendung von deutscher Lokalisierung (getText)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { saveManager } from '../game/utils/storage';
import { getText } from '../locales';
import styles from './StartScreen.module.scss';

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const loadGame = useGameStore((state) => state.loadGame);

  const handleNewGame = () => {
    navigate('/character-select');
  };

  const handleContinueGame = () => {
    const save = saveManager.load();
    if (save) {
      loadGame(JSON.stringify(save));
      navigate('/game');
    }
  };

  const handleLoadGame = () => {
    // Placeholder for load screen
    navigate('/load');
  };

  const hasSave = saveManager.hasSave();

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

        {/* Button container */}
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleNewGame}>
            <span className={styles.buttonIcon}>▶</span>
            {getText('startScreen.buttonStart')}
          </button>

          {hasSave && (
            <button className={styles.secondaryButton} onClick={handleContinueGame}>
              <span className={styles.buttonIcon}>◀</span>
              {getText('startScreen.buttonContinue')}
            </button>
          )}

          {hasSave && (
            <button className={styles.tertiaryButton} onClick={handleLoadGame}>
              <span className={styles.buttonIcon}>⚙</span>
              {getText('startScreen.buttonLoadGame')}
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className={styles.footer}>
          <p className={styles.version}>v0.1.0 - Early Access</p>
          <p className={styles.copyright}>Made with ✨ for adventurers</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
