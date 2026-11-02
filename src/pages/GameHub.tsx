/**
 * Adventure Game - Game Hub (Main Menu)
 * Mobile-first 2×2 Grid Navigation
 * Displays: Campaign, GPS Adventure, Hero Info, Inventory
 */

import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { preferencesManager } from '../game/utils/storage';
import type { HeroId } from '../game/characters/types';
import { getHeroDefinition } from '../game/characters/heroDefinitions';
import styles from './GameHub.module.scss';

export default function GameHub() {
  const navigate = useNavigate();
  const selectedHeroId = useGameStore(state => state.selectedHeroId);
  const heroId = selectedHeroId ?? preferencesManager.getPreference<unknown>('campaignHero', null);
  const validHero = typeof heroId === 'string' && ['aeran', 'velar', 'varg', 'ravena', 'saira'].includes(heroId);

  if (!validHero) {
    return <div className={styles.error}>Held nicht selektiert. <button onClick={() => navigate('/character-select')}>Zurück</button></div>;
  }

  const hero = getHeroDefinition(heroId as HeroId);

  return (
    <main className={styles.gameHub}>
      {/* Minimalist header with hero name */}
      <header className={styles.header}>
        <h1 className={styles.heroTitle}>{hero.name}</h1>
        <p className={styles.subtitle}>Wähle dein Abenteuer</p>
      </header>

      {/* 2×2 Grid Navigation */}
      <nav className={styles.navGrid}>
        {/* Campaign */}
        <button
          className={`${styles.navButton} ${styles.campaign}`}
          onClick={() => navigate('/game')}
          title="Starte die Hauptkampagne"
        >
          <span className={styles.icon}>⚔️</span>
          <span className={styles.label}>Kampagne</span>
        </button>

        {/* GPS Adventure */}
        <button
          className={`${styles.navButton} ${styles.gps}`}
          onClick={() => navigate('/hub/outdoor')}
          title="Erkunde die Welt mit GPS"
        >
          <span className={styles.icon}>🗺️</span>
          <span className={styles.label}>GPS-Abenteuer</span>
        </button>

        {/* Hero Info */}
        <button
          className={`${styles.navButton} ${styles.hero}`}
          onClick={() => navigate('/hub/hero-info')}
          title="Schaue deine Heldenstatistiken"
        >
          <span className={styles.icon}>👤</span>
          <span className={styles.label}>Held</span>
        </button>

        {/* Inventory */}
        <button
          className={`${styles.navButton} ${styles.inventory}`}
          onClick={() => navigate('/hub/inventory')}
          title="Verwalte dein Inventar"
        >
          <span className={styles.icon}>🎒</span>
          <span className={styles.label}>Inventar</span>
        </button>
      </nav>

      {/* Footer with character swap option */}
      <footer className={styles.footer}>
        <button
          className={styles.changeHeroButton}
          onClick={() => navigate('/character-select')}
          title="Wechsle zu einem anderen Helden"
        >
          Helden wechseln
        </button>
      </footer>
    </main>
  );
}
