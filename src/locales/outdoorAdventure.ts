/**
 * Outdoor Adventure Localization
 * Simple discovery-focused story without time pressure
 */

export const outdoorAdventure = {
  title: 'Outdoor Adventure',
  subtitle: 'Erkunde die Welt um dich herum',

  // Main UI
  startQuest: 'Abenteuer starten',
  continueQuest: 'Abenteuer fortsetzen',
  stopQuest: 'Abenteuer beenden',
  settingsOpen: 'Einstellungen',
  settingsClose: 'Fertig',

  // Status messages
  idle: 'Bereit zum Erkunden',
  preparing: 'Vorbereitung...',
  waitingForGPS: 'GPS wird aktiviert...',
  gpsActive: 'GPS aktiv',
  gpsLost: 'GPS-Signal verloren...',
  complete: 'Abenteuer abgeschlossen!',

  // Location permission
  locationRequest: 'Standortzugriff erforderlich',
  locationDescription: 'Adventure Game benötigt Zugang zu deinem Standort, um das Abenteuer zu aktivieren.',
  allowLocation: 'Standort freigeben',
  denyLocation: 'Ablehnen',

  // Error messages
  locationDenied: 'Standortzugriff wurde verweigert. Bitte erlaube die Standortnutzung in den Einstellungen.',
  locationUnavailable: 'Dein Standort konnte nicht ermittelt werden. Stelle sicher, dass GPS aktiviert ist.',
  locationTimeout: 'Standortabruf hat zu lange gedauert. Bitte versuche es erneut.',
  httpsRequired: 'Adventure Game benötigt HTTPS oder Localhost zum Zugriff auf GPS. Bitte überprüfe deine Verbindung.',
  unknownError: 'Ein unbekannter Fehler ist aufgetreten. Bitte versuche die App neu zu laden.',

  // Discovery targets
  discoveryTitle: 'Entdeckungen',
  discoveryDescription: 'Entdecke die Geheimnisse deiner Umgebung',
  targetFound: 'Entdeckt!',
  targetNearby: 'In der Nähe',
  targetFar: 'Nicht entdeckt',
  distance: 'Entfernung: {distance}m',
  reward: 'Belohnung: {xp} XP, {gold} Gold',

  // Target-specific messages
  targets: {
    discovery_1: {
      name: 'Der alte Baum',
      description: 'Ein uralter Baum mit geheimnisvollen Zeichen',
      discovered: 'Du hast die geheimnisvollen Zeichen gefunden! Der Baum flüstert alte Geschichten...',
    },
    discovery_2: {
      name: 'Der verborgene Stein',
      description: 'Ein Stein mit eingraviertem Lichtzeichen',
      discovered: 'Ein Lichtzeichen aktiviert sich unter deiner Hand!',
    },
    discovery_3: {
      name: 'Die verbundenen Pfade',
      description: 'Zwei Pfade verflechten sich geheimnisvoll',
      discovered: 'Die Pfade verbinden sich! Das Geheimnis wird enthüllt...',
    },
  },

  // Progress
  progress: 'Fortschritt: {current}/{total} Entdeckungen',
  progressPercent: '{percent}% abgeschlossen',
  allDiscovered: 'Alle Geheimnisse entdeckt!',

  // HUD
  currentPosition: 'Dein Standort',
  accuracy: 'Genauigkeit: {accuracy}m',
  lastUpdate: 'Zuletzt aktualisiert: {time}',
  connectedToGame: 'Mit Campaign verbunden',
  offlineMode: 'Offline-Modus',

  // Buttons
  refresh: 'Aktualisieren',
  back: 'Zurück',
  cancel: 'Abbrechen',

  // Safety notice
  safetyTitle: 'Sicherheitstipp',
  safetyMessage: 'Achte auf deine Umgebung während des Spielens. Spieliere nicht in gefährlichen Bereichen oder auf Straßen.',
  safetyAccepted: 'Verstanden',
};
