/**
 * Adventure Game - Hero Info Page
 * Display hero statistics, level, XP, etc.
 */

import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { preferencesManager } from '../game/utils/storage';
import type { HeroId } from '../game/characters/types';
import { getHeroDefinition } from '../game/characters/heroDefinitions';
import styles from './HeroInfoPage.module.scss';

export default function HeroInfoPage() {
  const navigate = useNavigate();
  const selectedHeroId = useGameStore(state => state.selectedHeroId);
  const heroId = selectedHeroId ?? preferencesManager.getPreference<unknown>('campaignHero', null);
  const validHero = typeof heroId === 'string' && ['aeran', 'velar', 'varg', 'ravena', 'saira'].includes(heroId);

  if (!validHero) {
    return (
      <main className={styles.error}>
        <h1>Held nicht selektiert</h1>
        <button onClick={() => navigate('/character-select')}>Zurück zur Auswahl</button>
      </main>
    );
  }

  const hero = getHeroDefinition(heroId as HeroId);

  return (
    <main className={styles.heroInfoPage}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/hub')} title="Zurück zum Menü">
          ← Zurück
        </button>
        <h1 className={styles.title}>{hero.name}</h1>
      </header>

      <div className={styles.content}>
        {/* Hero Portrait/Avatar */}
        <section className={styles.heroSection}>
          <div className={styles.heroEmoji}>{hero.icon}</div>
          <p className={styles.heroClass}>{hero.backstory}</p>
        </section>

        {/* Basic Stats */}
        <section className={styles.statsSection}>
          <h2>Statistiken</h2>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Klasse</span>
              <span className={styles.statValue}>{hero.class}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Herkunft</span>
              <span className={styles.statValue}>{hero.backstory.split('.')[0]}</span>
            </div>
          </div>
        </section>

        {/* Abilities/Skills */}
        <section className={styles.abilitiesSection}>
          <h2>Fähigkeiten</h2>
          <div className={styles.abilitiesList}>
            <div className={styles.abilityItem}>
              <span className={styles.abilityIcon}>⚔️</span>
              <span className={styles.abilityText}>{hero.name} kämpft mutig</span>
            </div>
            <div className={styles.abilityItem}>
              <span className={styles.abilityIcon}>🛡️</span>
              <span className={styles.abilityText}>Verteidigungsfähigkeiten</span>
            </div>
            <div className={styles.abilityItem}>
              <span className={styles.abilityIcon}>✨</span>
              <span className={styles.abilityText}>Speziale Fähigkeiten</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className={styles.actions}>
          <button className={styles.primaryButton} onClick={() => navigate('/hub')}>
            Hauptmenü
          </button>
          <button className={styles.secondaryButton} onClick={() => navigate('/character-select')}>
            Held wechseln
          </button>
        </section>
      </div>
    </main>
  );
}
