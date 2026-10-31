/**
 * Adventure Game - Inventory Component
 */

import React from 'react';
import { getText } from '../../locales';
import type { Inventory as InventoryType } from '../../game/state/types';
import styles from './Inventory.module.scss';

interface InventoryProps {
  inventory: InventoryType;
  onClose: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({ inventory, onClose }) => {
  const items = Object.values(inventory.items);
  const usedSlots = items.length;

  return (
    <div className={styles.inventoryOverlay} onClick={onClose}>
      <div className={styles.inventoryContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{getText('inventory.title')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.slotInfo}>
          <span>{getText('inventory.slots', { used: usedSlots, max: inventory.maxSlots })}</span>
        </div>

        <div className={styles.itemsGrid}>
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className={styles.itemSlot}>
                <div className={styles.itemIcon}>{item.icon}</div>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemQuantity}>x{item.quantity}</div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>{getText('inventory.empty')}</p>
          )}
        </div>

        <button className={styles.closeMainButton} onClick={onClose}>
          {getText('inventory.close')}
        </button>
      </div>
    </div>
  );
};

export default Inventory;
