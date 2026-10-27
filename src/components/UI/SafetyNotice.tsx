/**
 * Adventure Game - Safety Notice Component
 * Displays GPS safety warnings to players
 */

import React, { useState } from 'react';
import styles from './SafetyNotice.module.scss';

interface SafetyNoticeProps {
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const SafetyNotice: React.FC<SafetyNoticeProps> = ({ dismissible = true, onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed && dismissible) {
    return null;
  }

  return (
    <div className={styles.safetyNotice}>
      <div className={styles.header}>
        <span className={styles.icon}>⚠️</span>
        <h3>GPS Adventure Safety</h3>
        {dismissible && (
          <button
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label="Dismiss safety notice"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.content}>
        <ul>
          <li>
            <strong>Stay Aware:</strong> Always pay attention to your surroundings while playing
          </li>
          <li>
            <strong>Parental Supervision:</strong> Children should only play under appropriate
            adult supervision
          </li>
          <li>
            <strong>Avoid Dangers:</strong> Do not venture into traffic, private property, or
            dangerous areas
          </li>
          <li>
            <strong>Trespassing Laws:</strong> Respect local laws and private property rights
          </li>
          <li>
            <strong>GPS Accuracy:</strong> Your location may not be 100% accurate. Do not rely on
            it for navigation
          </li>
          <li>
            <strong>Battery & Data:</strong> GPS uses significant battery and data. Monitor your
            device
          </li>
        </ul>
      </div>

      <div className={styles.footer}>
        <p className={styles.emphasis}>By playing, you acknowledge these safety guidelines.</p>
      </div>
    </div>
  );
};
