# Phase 7: GPS-RPG – Quickstart für lokale Entwicklung

**Ohne echte GPS-Bewegung testen!**

---

## 1. DEMO-MODE AKTIVIEREN (30 Sekunden)

### Schritt 1: App starten
```bash
cd /Users/annafilippi/Adventure
npm run dev
# → http://localhost:5173/game
```

### Schritt 2: Demo-Mode in Browser-Console aktivieren
```javascript
// Browser öffnen → F12 → Console:
localStorage.setItem('__ADVENTURE_GAME_DEMO_MODE__', 'true');
location.reload();
```

### Schritt 3: Bewegungen testen

```javascript
// Im selben Console-Tab:
import { demoMode } from './src/game/geo/demo.js';

// GPS-Position abrufen:
demoMode.getPosition();
// Output: { lat: 48.8566, lng: 2.3522, accuracy: 5, ... }

// Bewegungen (1 Schritt = 10 Meter):
demoMode.moveNorth();   // 10m Nord
demoMode.moveEast();    // 10m Ost
demoMode.moveSouth();   // 10m Süd
demoMode.moveWest();    // 10m West

// Oder: zu bestimmten Koordinaten teleportieren:
demoMode.teleportTo(52.5200, 13.3654);  // Berlin, Tiergarten

// Geschwindigkeit ändern (Meter pro Schritt):
demoMode.setSpeed(50);  // Jetzt 50m pro Bewegung
```

---

## 2. GEOLOCATION API TEST (Chrome DevTools)

### Chrome Browser:
1. Öffne DevTools: **F12**
2. Gehe zu: **More tools** → **Sensors**
3. Unter **Geolocation**, wähle:
   - "San Francisco" oder "Custom location"
   - Breitengrad: **52.5200** (Berlin)
   - Längengrad: **13.3654** (Berlin)
   - Genauigkeit: **10** Meter

### Firefox Browser:
1. Öffne DevTools: **F12**
2. Gehe zu: **Settings** → **Console**
3. Erlaube Geolocation für localhost
4. Browser fragt: "Allow location access?" → **Allow**

### Bei echter GPS-Berechtigung (optional):
```
Chrome: Settings → Privacy → Site Settings → Location → localhost → Allow
Firefox: Preferences → Privacy → Permissions → Location → Allow
```

---

## 3. MOCK-POSITION TESTEN (Programmatisch)

### Test-Datei erstellen:

```typescript
// src/game/gps/__tests__/demo-mode.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { demoMode } from '../demo';

describe('Demo Mode GPS Simulation', () => {
  beforeEach(() => {
    demoMode.enable();
    demoMode.reset();
  });

  it('should move north correctly', () => {
    const before = demoMode.getPosition();
    demoMode.moveNorth();
    const after = demoMode.getPosition();
    
    // Latitude should increase going north
    expect(after.lat).toBeGreaterThan(before.lat);
    expect(after.lng).toBe(before.lng);  // Longitude unchanged
  });

  it('should teleport to custom location', () => {
    demoMode.teleportTo(52.5200, 13.3654);  // Berlin
    const pos = demoMode.getPosition();
    
    expect(pos.lat).toBe(52.5200);
    expect(pos.lng).toBe(13.3654);
  });

  it('should change speed', () => {
    demoMode.setSpeed(100);
    expect(demoMode.getSpeed()).toBe(100);
  });
});
```

### Test laufen lassen:
```bash
npm test -- --run src/game/gps/__tests__/demo-mode.test.ts
```

---

## 4. DISTANCE CALCULATION TEST

### Teste Entfernungsberechnung (kein GPS nötig!):

```typescript
// src/game/geo/__tests__/distance.test.ts

import { describe, it, expect } from 'vitest';
import { calculateDistance } from '../distance';

describe('Distance Calculation', () => {
  it('should calculate distance between Berlin and Paris', () => {
    const berlin = { lat: 52.5200, lng: 13.3654 };
    const paris = { lat: 48.8566, lng: 2.3522 };
    
    const distanceMeters = calculateDistance(berlin, paris);
    
    // Real distance: ~877 km
    expect(distanceMeters).toBeGreaterThan(870000);
    expect(distanceMeters).toBeLessThan(890000);
  });

  it('should calculate short distance', () => {
    const point1 = { lat: 52.5200, lng: 13.3654 };
    const point2 = { lat: 52.5210, lng: 13.3664 };  // ~1.5km away
    
    const distanceMeters = calculateDistance(point1, point2);
    
    expect(distanceMeters).toBeCloseTo(1500, -2);  // Within 100m
  });
});
```

### Laufen lassen:
```bash
npm test -- --run src/game/geo/__tests__/distance.test.ts
```

---

## 5. QUEST-GENERIERUNG TEST (KEIN GPS!)

### Lokale Karte-Daten verwenden:

```typescript
// src/game/gps/__tests__/quest-generation.test.ts

import { describe, it, expect } from 'vitest';
import { gpsQuestGenerator } from '../../quests/gpsQuestGenerator';

describe('GPS Quest Generation', () => {
  it('should generate quest for mocked location', () => {
    const mockLocation = {
      id: 'test_park_1',
      name: 'Tiergarten',
      lat: 52.5200,
      lng: 13.3654,
      type: 'safe_zone',
      radius: 100,
      validated: true
    };

    const quest = gpsQuestGenerator.generateQuest(
      mockLocation,
      { heroLevel: 5, chapterNumber: 1 }
    );

    // Assertions
    expect(quest).toBeDefined();
    expect(quest.location.lat).toBe(52.5200);
    expect(quest.location.lng).toBe(13.3654);
    expect(quest.questType).toMatch(/encounter|battle|puzzle|treasure/);
    expect(quest.rewards.xp).toBeGreaterThan(0);
    expect(quest.rewards.gold).toBeGreaterThan(0);
    
    // Seeding should be deterministic
    const quest2 = gpsQuestGenerator.generateQuest(
      mockLocation,
      { heroLevel: 5, chapterNumber: 1 }
    );
    expect(quest.title).toBe(quest2.title);  // Same seed = same quest
  });
});
```

### Laufen lassen:
```bash
npm test -- --run src/game/gps/__tests__/quest-generation.test.ts
```

---

## 6. BROWSER-INTEGRATION TEST (Mit Demo-Mode)

### Teste GPS-UI ohne echte GPS:

```typescript
// src/components/GPS/__tests__/GPSGameScreen.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { demoMode } from '../../../game/geo/demo';
import GPSGameScreen from '../GPSGameScreen';

describe('GPS Game Screen', () => {
  beforeEach(() => {
    demoMode.enable();
    demoMode.teleportTo(52.5200, 13.3654);  // Berlin
  });

  it('should display map with quests', async () => {
    render(<GPSGameScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/quest/i)).toBeInTheDocument();
    });
  });

  it('should show distance to quest', async () => {
    render(<GPSGameScreen />);
    
    // Demo-Position: Berlin
    demoMode.moveNorth();  // Move 10m
    
    await waitFor(() => {
      const distance = screen.queryByText(/distance.*\d+m/);
      expect(distance).toBeInTheDocument();
    });
  });

  it('should trigger quest when nearby', async () => {
    const { getByText } = render(<GPSGameScreen />);
    
    // Move towards quest (simulated)
    for (let i = 0; i < 50; i++) {
      demoMode.moveNorth();
      await new Promise(r => setTimeout(r, 10));
    }
    
    // Quest should trigger
    await waitFor(() => {
      expect(getByText(/quest.*triggered/i)).toBeInTheDocument();
    });
  });
});
```

---

## 7. LOKALE KARTENDATEN (OSM)

### Option A: Test mit Mock-Daten (SCHNELL)

```typescript
// src/game/gps/__tests__/mock-osm-data.ts

export const MOCK_OSM_LOCATIONS = [
  {
    id: 'tiergarten_berlin',
    name: 'Tiergarten',
    lat: 52.5200,
    lng: 13.3654,
    type: 'safe_zone',
    radius: 300,
    validated: true,
    notes: 'Large park, safe day and night'
  },
  {
    id: 'reichstag_berlin',
    name: 'Reichstag',
    lat: 52.5186,
    lng: 13.3761,
    type: 'safe_zone',
    radius: 100,
    validated: true,
    notes: 'Historic building, public area'
  },
  {
    id: 'potsdamer_platz',
    name: 'Potsdamer Platz',
    lat: 52.5093,
    lng: 13.3762,
    type: 'safe_zone',
    radius: 150,
    validated: true,
    notes: 'Public square, busy area'
  }
];

// Test-Usage:
describe('OSM Integration', () => {
  it('should find nearby locations', () => {
    const berlin = { lat: 52.5200, lng: 13.3654 };
    
    const nearby = MOCK_OSM_LOCATIONS.filter(loc => {
      const dist = calculateDistance(berlin, loc);
      return dist < 1000; // Within 1km
    });
    
    expect(nearby.length).toBeGreaterThan(0);
  });
});
```

### Option B: Overpass API testen (SPÄTER)

```typescript
// Später in Phase 7.2:
const OVERPASS_QUERY = `
[bbox:52.5,13.3,52.55,13.4];
(
  node["amenity"~"parking|cafe|restaurant"];
  way["leisure"="park"];
  way["place"="square"];
);
out body geom;
`;

// Tested against real OSM via Overpass API
```

---

## 8. PERFORMANCE PROFILING (OHNE GPS)

### Battery Impact testen:

```typescript
// src/game/gps/__tests__/performance.test.ts

import { describe, it, expect } from 'vitest';
import { gpsManager } from '../gpsManager';

describe('GPS Performance', () => {
  it('should not spam position updates', async () => {
    let updateCount = 0;
    const positionCallback = () => updateCount++;
    
    gpsManager.startTracking(positionCallback);
    
    // Simulate 1 second of position changes
    for (let i = 0; i < 20; i++) {
      demoMode.moveNorth();
      await new Promise(r => setTimeout(r, 50));
    }
    
    gpsManager.stopTracking();
    
    // Should NOT update 20 times (battery drain!)
    // Should be smart: maybe only 2-3 updates
    expect(updateCount).toBeLessThan(5);
  });

  it('should cache tile data', async () => {
    const tile1 = await questLocationFinder.findNearby(
      { lat: 52.52, lng: 13.36 },
      1000
    );
    
    const startTime = Date.now();
    const tile1Again = await questLocationFinder.findNearby(
      { lat: 52.52, lng: 13.36 },
      1000
    );
    const cacheTime = Date.now() - startTime;
    
    // Cached should be fast (< 10ms)
    expect(cacheTime).toBeLessThan(10);
  });
});
```

---

## 9. INTEGRATION MIT CAMPAIGN TESTEN

### GPS-Quests geben auch Campaign-XP:

```typescript
// src/game/campaign/__tests__/gps-campaign-integration.test.ts

import { describe, it, expect } from 'vitest';
import { getCampaignState } from '../campaignSession';
import { completeGPSQuest } from '../../gps/gpsQuestManager';

describe('GPS + Campaign Integration', () => {
  it('should add GPS quest XP to campaign total', async () => {
    const campaignBefore = getCampaignState('aeran');
    const xpBefore = campaignBefore.totalXpEarned;
    
    // Complete a GPS quest
    const gpsQuest = {
      id: 'gps_1',
      rewards: { xp: 100, gold: 25 }
    };
    
    completeGPSQuest(gpsQuest, 'aeran');
    
    const campaignAfter = getCampaignState('aeran');
    expect(campaignAfter.totalXpEarned).toBe(xpBefore + 100);
  });

  it('should not break existing campaign save', async () => {
    const hero = 'aeran';
    
    // Save campaign before
    const originalState = getCampaignState(hero);
    
    // Complete GPS quest
    completeGPSQuest({ id: 'gps_1', rewards: { xp: 50 } }, hero);
    
    // Campaign episodes should still be valid
    const episodeIds = Object.keys(getCampaignState(hero).episodeProgress);
    expect(episodeIds).toContain('episode_01_whisper_sand');
    expect(episodeIds).toContain('episode_02_silent_bell');
    expect(episodeIds).toContain('episode_03_stolen_lantern');
  });
});
```

---

## 10. CHECKLISTE FÜR LOKALE TESTS

- [ ] Demo-Mode aktiviert (`localStorage` flag)
- [ ] Distance calculations tested (no GPS needed)
- [ ] Quest generation working (mock locations)
- [ ] All 265 existing campaign tests still pass
- [ ] GPS position simulation working
- [ ] UI renders with mock GPS data
- [ ] No breaking changes to campaign system
- [ ] TypeScript compiles without errors
- [ ] Production build succeeds

---

## 11. TROUBLESHOOTING

### Problem: "Cannot find module './geo/demo'"
**Lösung:** Stelle sicher, dass `src/game/geo/demo.ts` existiert
```bash
ls -la src/game/geo/demo.ts
```

### Problem: Demo-Mode funktioniert nicht
**Lösung:** Prüfe ob localStorage richtig gesetzt ist
```javascript
// In Console:
console.log(localStorage.getItem('__ADVENTURE_GAME_DEMO_MODE__'));
// Should output: 'true'
```

### Problem: GPS Tests schlagen fehl
**Lösung:** Mock-Daten verwenden statt echter GPS
```typescript
// ✅ RICHTIG:
const mockPosition = { lat: 52.5, lng: 13.3 };

// ❌ FALSCH:
const realPosition = navigator.geolocation.getCurrentPosition(...);
```

### Problem: Tests sind zu langsam
**Lösung:** Async Tests mit `waitFor` nicht blockieren
```typescript
// ✅ RICHTIG:
await waitFor(() => {
  expect(element).toBeVisible();
});

// ❌ FALSCH:
for (let i = 0; i < 1000; i++) {
  await sleep(100);
}
```

---

## 12. NEXT: In Phase 7.1 starten

Sobald genehmigt:

```bash
# Branch erstellen
git checkout -b feature/phase-7-gps-core

# GPS-Core Modul erstellen
mkdir -p src/game/gps
touch src/game/gps/gpsManager.ts
touch src/game/gps/gpsStore.ts

# Tests schreiben
mkdir -p src/game/gps/__tests__
touch src/game/gps/__tests__/gpsManager.test.ts

# Und los geht's!
npm test -- src/game/gps/__tests__
```

---

**Du kannst SOFORT testen, ohne echte GPS zu benutzen!** 🚀

