/**
 * Adventure Game - Inventory Page
 * Display and manage hero inventory items
 */

import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { preferencesManager } from '../game/utils/storage';
import type { HeroId } from '../game/characters/types';
import { getHeroDefinition } from '../game/characters/heroDefinitions';
import styles from './InventoryPage.module.scss';

export default function InventoryPage() {
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

  // Mock inventory items
  const inventoryItems = [
    { id: 'sword', name: 'Schwert des Lichts', type: 'weapon', emoji: '⚔️', rarity: 'rare' },
    { id: 'shield', name: 'Schild der Hoffnung', type: 'armor', emoji: '🛡️', rarity: 'uncommon' },
    { id: 'potion', name: 'Trank der Heilung', type: 'consumable', emoji: '🧪', rarity: 'common' },
    { id: 'map', name: 'Alte Schatzkarte', type: 'quest', emoji: '🗺️', rarity: 'rare' },
    { id: 'amulet', name: 'Amulett der Weisheit', type: 'accessory', emoji: '✨', rarity: 'epic' },
  ];

  return (
    <main className={styles.inventoryPage}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/hub')} title="Zurück zum Menü">
          ← Zurück
        </button>
        <h1 className={styles.title}>Inventar</h1>
      </header>

      <div className={styles.content}>
        {/* Inventory Header */}
        <section className={styles.inventoryHeader}>
          <p className={styles.heroName}>{hero.name}</p>
          <p className={styles.itemCount}>{inventoryItems.length} Gegenstände</p>
        </section>

        {/* Items List */}
        <section className={styles.itemsList}>
          {inventoryItems.length > 0 ? (
            inventoryItems.map(item => (
              <div key={item.id} className={`${styles.itemCard} ${styles[item.rarity]}`}>
                <span className={styles.itemEmoji}>{item.emoji}</span>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemType}>{item.type}</p>
                </div>
                <span className={styles.rarityBadge}>{item.rarity}</span>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Dein Inventar ist noch leer</p>
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <section className={styles.actions}>
          <button className={styles.primaryButton} onClick={() => navigate('/hub')}>
            Hauptmenü
          </button>
        </section>
      </div>
    </main>
  );
}
