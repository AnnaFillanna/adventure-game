/**
 * Adventure Game - Safety Notice Component
 * Displays GPS safety warnings to players
 */

import React, { useState } from 'react';
import { getText } from '../../locales';
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
        <h3>{getText('safetyNotice.title')}</h3>
        {dismissible && (
          <button
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label={getText('safetyNotice.dismissAriaLabel')}
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.content}>
        <ul>
          <li>
            <strong>{getText('safetyNotice.awareness.title')}</strong> {getText('safetyNotice.awareness.text')}
          </li>
          <li>
            <strong>{getText('safetyNotice.supervision.title')}</strong> {getText('safetyNotice.supervision.text')}
          </li>
          <li>
            <strong>{getText('safetyNotice.avoidDangers.title')}</strong> {getText('safetyNotice.avoidDangers.text')}
          </li>
          <li>
            <strong>{getText('safetyNotice.trespassing.title')}</strong> {getText('safetyNotice.trespassing.text')}
          </li>
          <li>
            <strong>{getText('safetyNotice.gpsAccuracy.title')}</strong> {getText('safetyNotice.gpsAccuracy.text')}
          </li>
          <li>
            <strong>{getText('safetyNotice.batteryData.title')}</strong> {getText('safetyNotice.batteryData.text')}
          </li>
        </ul>
      </div>

      <div className={styles.footer}>
        <p className={styles.emphasis}>{getText('safetyNotice.emphasis')}</p>
      </div>
    </div>
  );
};
