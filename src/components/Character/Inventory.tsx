/**
 * Adventure Game - Inventory Component
 * Displays player inventory with items and equipment
 */

import React, { useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';
import styles from './Inventory.module.scss';

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  description?: string;
}

const RARITY_COLORS: Record<string, string> = {
  common: '#9e9e9e',
  uncommon: '#4caf50',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#fdd835',
};

export const Inventory: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const playerInventory = useGameStore((state) => state.player.inventory);

  const inventoryItems: InventoryItem[] = Object.values(playerInventory.items).map((item) => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
    rarity: 'common',
    quantity: item.quantity,
    description: item.description,
  }));

  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={styles.inventoryContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Inventory</h2>
        <div className={styles.stats}>
          <span className={styles.statBadge}>
            Items: <strong>{totalItems}</strong>/30
          </span>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className={styles.gridContainer}>
        <div className={styles.itemsGrid}>
          {inventoryItems.map((item) =>
            item.quantity > 0 ? (
              <div
                key={item.id}
                className={`${styles.itemCard} ${styles[`rarity_${item.rarity}`]}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className={styles.itemIcon}>{item.icon}</div>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  {item.quantity > 1 && (
                    <span className={styles.itemQuantity}>x{item.quantity}</span>
                  )}
                </div>
              </div>
            ) : null
          )}
        </div>

        {/* Item Details Panel */}
        {selectedItem && (
          <div className={styles.detailsPanel}>
            <div className={styles.detailsHeader}>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedItem(null)}
                aria-label="Close details"
              >
                ✕
              </button>
              <h3 className={styles.detailsTitle}>{selectedItem.name}</h3>
            </div>

            <div className={styles.detailsContent}>
              <div className={styles.largeIcon}>{selectedItem.icon}</div>

              <div
                className={styles.rarityBadge}
                style={{ borderColor: RARITY_COLORS[selectedItem.rarity] }}
              >
                <span style={{ color: RARITY_COLORS[selectedItem.rarity] }}>
                  {selectedItem.rarity.toUpperCase()}
                </span>
              </div>

              <p className={styles.description}>{selectedItem.description}</p>

              <div className={styles.quantity}>
                <span>You have:</span>
                <strong>{selectedItem.quantity}</strong>
              </div>

              <button className={styles.useButton}>Use Item</button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {totalItems === 0 && !selectedItem && (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📦</p>
          <p className={styles.emptyText}>Your inventory is empty</p>
          <p className={styles.emptyHint}>Collect items by exploring the world</p>
        </div>
      )}
    </div>
  );
};
