# 🗺️ GPS & Map Features - Quick Start

## 📍 GPS Geolocation Service

### Browser API Wrapper

```typescript
import { geolocationService } from '@/game/geo';

// Überprüfe Support
if (geolocationService.isSupported()) {
  console.log('GPS verfügbar');
}

// Einmalige Position
geolocationService.getCurrentPosition(
  (position) => console.log(position),
  (error) => console.error(error)
);

// Fortlaufendes Tracking
geolocationService.startTracking(
  (position) => console.log('Position:', position),
  (error) => console.error('GPS Error:', error)
);

// Später stoppen
geolocationService.stopTracking();
```

---

## 🗺️ Interaktive Karte

### Komponente Einbinden

```typescript
import { InteractiveMap } from '@/components/Map/InteractiveMap';
import type { GeoPoint } from '@/game/geo';

const MyMap = () => {
  const playerPos: GeoPoint = {
    lat: 48.8566,
    lng: 2.3522,
    accuracy: 10,
    timestamp: Date.now(),
  };

  const gameObjects = [
    {
      id: 'npc_1',
      position: { lat: 48.8570, lng: 2.3525 },
      type: 'npc' as const,
    },
    {
      id: 'coin_1',
      position: { lat: 48.8560, lng: 2.3520 },
      type: 'item' as const,
    },
  ];

  return (
    <InteractiveMap
      playerPosition={playerPos}
      objects={gameObjects}
      interactionRadius={30}
      onMarkerClick={(id, type) => console.log(`Clicked ${id}`)}
      zoom={15}
      showRadius={true}
    />
  );
};
```

---

## 📏 Distanzberechnungen

### Haversine Formel

```typescript
import { calculateDistance, calculateBearing } from '@/game/geo';

const paris = { lat: 48.8566, lng: 2.3522 };
const london = { lat: 51.5074, lng: -0.1278 };

// Distanz in Metern
const distance = calculateDistance(paris, london);
console.log(`${distance / 1000} km`); // ~343 km

// Azimuth (Richtung)
const bearing = calculateBearing(paris, london);
console.log(`Richtung: ${bearing}°`); // ~330° (WNW)
```

### Interaktionsradius

```typescript
import { interactionService } from '@/game/geo';

const player = { lat: 48.8566, lng: 2.3522, accuracy: 5 };
const npc = { lat: 48.8570, lng: 2.3525 };

// Einfache Prüfung
const canInteract = interactionService.canInteract(player, npc, 30);
console.log(canInteract); // true/false

// Detaillierte Info
const status = interactionService.getInteractionStatus(player, npc);
console.log(status.distance); // Distanz in Metern
console.log(status.inRange); // true/false

// Alle Targets in Reichweite
const targets = [
  { id: 'npc_1', type: 'npc' as const, lat: 48.8570, lng: 2.3525 },
  { id: 'coin_1', type: 'item' as const, lat: 48.8560, lng: 2.3520 },
];

const inRange = interactionService.getTargetsInRange(player, targets, 50);
inRange.forEach((t) => console.log(`${t.id}: ${t.distance}m`));
```

---

## 🎮 Demo Mode (Development)

### Aktivierung

```typescript
import { demoMode } from '@/game/geo';

// Browser Console:
localStorage.setItem('__ADVENTURE_GAME_DEMO_MODE__', 'true');
demoMode.enable();

// Jetzt funktioniert Demo Mode!
demoMode.moveNorth();
demoMode.moveEast();
demoMode.moveSouth();
demoMode.moveWest();

// Position checken
const pos = demoMode.getPosition();
console.log(`${pos.lat}, ${pos.lng}`);
```

### Teleportieren (Testing)

```typescript
// Paris
demoMode.teleportTo(48.8566, 2.3522);

// London
demoMode.teleportTo(51.5074, -0.1278);

// Bewegungsgeschwindigkeit ändern
demoMode.setSpeed(20); // 20m pro Schritt

// Reset zu Default
demoMode.reset();
```

### Deaktivieren

```typescript
demoMode.disable();
localStorage.removeItem('__ADVENTURE_GAME_DEMO_MODE__');
```

---

## 🛡️ Safety & Permissions

### Fehlerbehandlung

```typescript
geolocationService.startTracking(
  (position) => console.log('✅ GPS OK', position),
  (error) => {
    switch (error.code) {
      case 'PERMISSION_DENIED':
        console.log('Benutzer verweigerte GPS-Zugriff');
        break;
      case 'POSITION_UNAVAILABLE':
        console.log('GPS nicht verfügbar');
        break;
      case 'TIMEOUT':
        console.log('GPS Timeout');
        break;
      case 'HTTPS_REQUIRED':
        console.log('HTTPS erforderlich (production)');
        break;
    }
  }
);
```

### Safety Notice anzeigen

```typescript
import { SafetyNotice } from '@/components/UI/SafetyNotice';

<SafetyNotice
  dismissible={true}
  onDismiss={() => console.log('Safety notice dismissed')}
/>
```

---

## 🔒 Safe Spawn Points

### Punkte registrieren

```typescript
import { safeSpawnService } from '@/game/geo';

safeSpawnService.registerSafePoint({
  id: 'park_1',
  name: 'Central Park',
  description: 'Safe meeting point',
  lat: 48.8566,
  lng: 2.3522,
  accuracy: 5,
  type: 'safe_zone',
  radius: 50,
  validated: false, // Noch zu validieren
});
```

### Validierung

```typescript
// Admin-Funktion später
safeSpawnService.validateSafePoint('park_1', 'Verified on-site');

// Nur validierte Punkte abrufen
const validPoints = safeSpawnService.getValidatedSafePoints();
```

### Zone prüfen

```typescript
const isSafe = safeSpawnService.isSafeZone(
  48.8566, // player lat
  2.3522, // player lng
  1000 // radius in meters
);

if (!isSafe) {
  console.log('Spieler nicht in sicherer Zone!');
}
```

---

## 🧪 Unit Tests

### Tests ausführen

```bash
npm run test
```

### Spezifische Tests

```bash
npm run test distance.test.ts
```

### UI Preview

```bash
npm run test:ui
```

---

## 📱 Mobile Testing

### Lokaler Dev Server

```bash
npm run dev
# Open http://localhost:5173
```

### Mobile Device Testing

```bash
# 1. Finde deine IP
ifconfig

# 2. Öffne in Browser (z.B. 192.168.1.100:5173)
# 3. Demo Mode aktivieren (kein echtes GPS nötig)
# 4. Bewegung auf Karte testen
```

### iOS Safari

- ✅ Demo Mode funktioniert
- ⚠️ Real GPS braucht HTTPS + App Permissions
- 📍 Simulator: Im Safari Console `//@sourceURL=` hacken

### Android Chrome

- ✅ Demo Mode funktioniert
- ✅ Real GPS im Chrome (mit Permissions)
- 📍 DevTools über chrome://inspect

---

## 🐛 Debugging

### Console Helpers

```typescript
// State anschauen
geolocationService.getLastPosition();
geolocationService.getLastError();
geolocationService.isCurrentlyTracking();

// Demo Mode State
demoMode.getState();

// Interaction Debug
interactionService.getRadiusMeters();
interactionService.getEffectiveRadiusMeters();

// Safe Spawn Stats
safeSpawnService.getStats();
```

### Browser DevTools

```javascript
// Console:
const geo = window.__geolocation; // Wenn globalisiert
geo.startTracking(pos => console.table(pos), err => console.error(err));

// Watchdog Timer
setInterval(() => {
  const pos = geo.getLastPosition();
  console.log(`GPS Update: ${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}, ±${pos.accuracy}m`);
}, 1000);
```

---

## 🚀 Integration Checklist

- [ ] Leaflet + React Leaflet installiert
- [ ] InteractiveMap Komponente importiert
- [ ] geolocationService implementiert
- [ ] GPS Permissions definiert
- [ ] SafetyNotice Komponente angezeigt
- [ ] Demo Mode für Development aktivierbar
- [ ] Distanzberechnung getestet
- [ ] Interaktionsradius konfiguriert
- [ ] Safe Spawn Points registriert
- [ ] HTTPS für Production geplant
- [ ] Mobile Testing durchgeführt
- [ ] Unit Tests bestanden

---

## 📚 Weitere Ressourcen

- **Leaflet Docs:** https://leafletjs.com
- **React Leaflet:** https://react-leaflet.js.org
- **Geolocation API:** https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- **Haversine Formel:** https://en.wikipedia.org/wiki/Haversine_formula
- **OpenStreetMap:** https://www.openstreetmap.org

---

**Happy GPS Gaming! 🗺️📍✨**
