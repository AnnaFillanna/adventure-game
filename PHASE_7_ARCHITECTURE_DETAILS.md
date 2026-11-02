# Phase 7: GPS-RPG – Detaillierte Architektur

---

## 1. KOMPONENTEN-ABHÄNGIGKEITEN

### Bestehende Komponenten (KEINE ÄNDERUNGEN NÖTIG)

```
┌──────────────────────────────────────────────────┐
│              GAME WORLD                          │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │   CampaignScreen.tsx ← UNVERÄNDERT ✅   │    │
│  ├─────────────────────────────────────────┤    │
│  │ - Episode 1, 2, 3 (Event-basiert)       │    │
│  │ - Kampfmechanik                         │    │
│  │ - Rätsel-Engine                         │    │
│  │ - XP/Gold-System                        │    │
│  │ - Speichern/Laden                       │    │
│  │                                         │    │
│  │ Uses: campaignSession.ts                │    │
│  │       episodeManager.ts                 │    │
│  │       campaignStorage.ts                │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Neue GPS-Komponenten (ADDON)

```
┌──────────────────────────────────────────────────────────────┐
│              NEW: GPS GAME WORLD                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   GPSGameScreen.tsx (NEU)                           │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Hybrid View:                                        │   │
│  │ - Links: Leaflet Map mit GPS-Position             │   │
│  │ - Rechts: Quest-Details                            │   │
│  │ - Oben: HUD (Distanz, XP, Gold)                   │   │
│  │ - Unten: Quest-Aktionen                            │   │
│  │                                                     │   │
│  │ Uses: gpsManager.ts                                │   │
│  │       questLocationFinder.ts                       │   │
│  │       gpsQuestGenerator.ts                         │   │
│  │       locationTrigger.ts                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Leaflet Map Component                            │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ - Player Position (blauer Punkt)                  │   │
│  │ - Quest-Marker (rote Flaggen)                     │   │
│  │ - Sichtbarer Radius (1km)                         │   │
│  │ - Zoom/Pan Controls                               │   │
│  │                                                     │   │
│  │ Uses: react-leaflet                                │   │
│  │       geolocation.ts                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. DATA FLOW DIAGRAM

### GPS-Position ermitteln → Quest generieren → Spielen

```
START: Spieler öffnet App
  │
  ├─→ [1. GPS REQUEST]
  │   ├─ Browser.geolocation.getCurrentPosition()
  │   ├─ OR: Demo Mode (localStorage flag)
  │   └─ Callback: onLocationAcquired()
  │
  ├─→ [2. FIND QUESTS NEARBY]
  │   ├─ questLocationFinder.ts
  │   ├─ Search in 1km radius
  │   ├─ Query: Overpass API OR local cache
  │   ├─ Filter: safe zones only
  │   └─ Result: Array<SafeSpawnPoint>
  │
  ├─→ [3. GENERATE GPS QUESTS]
  │   ├─ gpsQuestGenerator.ts
  │   ├─ For each location:
  │   │  ├─ Seed RNG with location hash
  │   │  ├─ Generate Quest type
  │   │  ├─ Generate NPC names
  │   │  ├─ Generate enemy level
  │   │  ├─ Generate rewards
  │   │  └─ Combine with story context
  │   └─ Result: Array<GPSQuest>
  │
  ├─→ [4. PERSIST QUESTS]
  │   ├─ Save to localStorage
  │   ├─ Store timestamp
  │   ├─ Track which ones completed
  │   └─ Use same quests until refreshed
  │
  ├─→ [5. RENDER MAP VIEW]
  │   ├─ Display all quests on map
  │   ├─ Show active quest details
  │   ├─ Calculate distance
  │   └─ Enable quest interaction
  │
  └─→ [6. MONITOR POSITION]
      ├─ continuousPositionTracking()
      ├─ Every 10-30 seconds:
      │  ├─ Update GPS position
      │  ├─ locationTrigger.check()
      │  └─ If within trigger distance:
      │     ├─ Quest wird "aktiviert"
      │     ├─ Quest kann gespielt werden
      │     └─ Spieler kann Quest-Event starten
      └─ Loop until app closes
```

---

## 3. ZUSTAND-STRUKTUR (State Tree)

```typescript
// GameStore (Zustand)
{
  // BESTEHEND (Campaign)
  selectedHeroId: 'aeran',
  campaignProgress: {...},  // Unverändert
  inventory: {...},         // Unverändert
  
  // NEUE GPS-FEATURES
  gps: {
    // Current Position
    currentPosition: {
      lat: 48.8566,
      lng: 2.3522,
      accuracy: 10,
      timestamp: 1729424000000
    },
    
    // Tracking State
    isTracking: boolean,
    lastUpdate: number,
    
    // OSM Cache
    cachedLocations: {
      'tile_x_y': [
        { id: 'node_123', name: 'Park', lat, lng, type }
      ]
    },
    
    // GPS Quests
    gpsQuests: {
      active: [
        {
          id: 'gps_quest_1',
          location: { lat, lng },
          questType: 'encounter',
          status: 'active',
          distanceToQuest: 450,  // meters
          triggered: false
        }
      ],
      completed: [],
      abandoned: []
    },
    
    // Demo Mode
    demoMode: {
      enabled: boolean,
      position: GeoPoint
    },
    
    // Errors
    error: null | GeoError
  }
}
```

---

## 4. MODUL-SCHNITTSTELLEN (PUBLIC APIs)

### 4.1 GPS Manager

```typescript
// src/game/gps/gpsManager.ts
export class GPSManager {
  // Lifecycle
  initialize(): Promise<void>
  start(): Promise<void>
  stop(): void
  destroy(): void
  
  // Position
  getCurrentPosition(): Promise<GeoPoint>
  getLastPosition(): GeoPoint | null
  getAccuracy(): number
  
  // Tracking
  startTracking(callback: PositionCallback): void
  stopTracking(): void
  isTracking(): boolean
  
  // Demo Mode
  enableDemoMode(): void
  disableDemoMode(): void
  demoMove(direction: 'N'|'S'|'E'|'W'): void
  demoTeleport(lat: number, lng: number): void
  
  // Events
  on(event: 'position-changed', callback: ...): void
  off(event: string): void
}

// Export singleton
export const gpsManager = new GPSManager();
```

### 4.2 Quest Location Finder

```typescript
// src/game/gps/questLocationFinder.ts
export class QuestLocationFinder {
  // Find nearby locations
  async findNearby(
    center: LatLng,
    radiusMeters: number = 1000
  ): Promise<SafeSpawnPoint[]>
  
  // Search OSM with filters
  async searchByType(
    center: LatLng,
    type: 'park' | 'square' | 'monument' | 'shop',
    radius?: number
  ): Promise<SafeSpawnPoint[]>
  
  // Cache management
  getFromCache(tileKey: string): SafeSpawnPoint[] | null
  updateCache(tileKey: string, points: SafeSpawnPoint[]): void
  
  // Safety checks
  validateSpawnPoint(point: SafeSpawnPoint): boolean
}

export const questLocationFinder = new QuestLocationFinder();
```

### 4.3 GPS Quest Generator

```typescript
// src/game/quests/gpsQuestGenerator.ts
export class GPSQuestGenerator {
  // Generate quests for locations
  generateQuestsForLocations(
    locations: SafeSpawnPoint[],
    storyContext: StoryContext
  ): GPSQuest[]
  
  // Generate single quest
  generateQuest(
    location: SafeSpawnPoint,
    storyContext: StoryContext
  ): GPSQuest
  
  // Quest templates
  getQuestTemplate(type: QuestType): QuestTemplate
  getRandomNPCName(seed: number): string
  getRandomEnemyStats(level: number, seed: number): EnemyStats
}

export const gpsQuestGenerator = new GPSQuestGenerator();
```

### 4.4 Location Trigger

```typescript
// src/game/geo/locationTrigger.ts
export class LocationTrigger {
  // Check if quest should be triggered
  shouldTriggerQuest(
    playerPosition: GeoPoint,
    questLocation: LatLng,
    triggerDistance: number
  ): boolean
  
  // Get distance to quest
  getDistance(
    from: GeoPoint,
    to: LatLng
  ): number  // in meters
  
  // Hysterese to prevent flickering
  checkWithHysteresis(
    questId: string,
    playerPos: GeoPoint,
    questLoc: LatLng,
    triggerDist: number,
    deactivateDist: number
  ): 'triggered' | 'still_triggered' | 'deactivated'
}

export const locationTrigger = new LocationTrigger();
```

---

## 5. INTEGRATION MIT BESTEHENDEN SYSTEMEN

### 5.1 Campaign + GPS Quests (HYBRID MODE)

```typescript
// User kann BEIDE Modi spielen

enum GameMode {
  CAMPAIGN = 'campaign',      // Episode 1-30
  GPS_QUESTS = 'gps_quests',  // Generierte Quests
}

// In GameStore
gameMode: GameMode;

// UI Router:
if (gameMode === CAMPAIGN) {
  return <CampaignScreen />;  // Existierend
} else {
  return <GPSGameScreen />;   // Neu
}
```

### 5.2 Story Progression (GPS erfüllt Campaign-Missionen)

```typescript
// Wenn Spieler GPS-Quest erfüllt:
// - XP wird zum Campaign-Progress addiert
// - Gold wird zum Campaign-Inventory addiert
// - Kann optional mit Kampagne verknüpft werden

// Beispiel: Episode 4 braucht "5 Gegner besiegt"
// GPS-Quest Kampf = zählt als 1/5 ✅

interface QuestLinker {
  linkedCampaignId?: string;      // "campaign_first_light"
  linkedEpisodeId?: string;       // "episode_04_foggy_signs"
  countsTowardsObjective?: string; // "defeat_count"
}
```

### 5.3 Inventory & Rewards

```typescript
// GPS-Quest Rewards werden zu Campaign-Inventory addiert

// Bestehend:
state.inventory.gold += 50;
state.inventory.xp += 100;
state.inventory.items.push(itemId);

// GPS-Quest completion:
gpsQuestRewardHandler.applyRewards(gpsQuest, gameState)
  → updateGameStore() 
    → same inventory functions as campaign
```

---

## 6. OFFLINE-BETRIEB & FALLBACKS

### 6.1 Wenn GPS nicht verfügbar

```
┌─────────────────────────────────────────────┐
│ User denies GPS permission OR GPS unavailable│
└──────────┬──────────────────────────────────┘
           │
           ├─→ Option 1: Demo Mode
           │   └─ Simulate GPS locally
           │
           ├─→ Option 2: Campaign Mode
           │   └─ Play episodes normally
           │
           └─→ Option 3: Last Known Position
               └─ Use cached GPS data
                  (if available from previous session)
```

### 6.2 Offline Kartendaten

```typescript
// Bei App-Installation:
// - Download OSM tiles für Deutschland (~100 MB)
// - Store in IndexedDB
// - Falls Overpass API offline: use cached tiles

class OfflineMapData {
  getCachedTile(x, y, z): Tile | null {
    return indexedDB.get(`tile_${x}_${y}_${z}`);
  }
  
  hasOfflineSupport(): boolean {
    return cachedTileCount > 1000; // Rough check
  }
}
```

---

## 7. PERFORMANCE & BATTERY

### 7.1 GPS Update Frequenz

```typescript
// NOT: Update position every 100ms (battery drain!)
// ✅ SMART: Update based on movement

class SmartGPSUpdater {
  private lastPosition: GeoPoint;
  private minDistanceForUpdate = 50; // meters
  private maxUpdateInterval = 30000;  // 30 seconds
  
  shouldUpdate(newPosition: GeoPoint): boolean {
    const distance = getDistance(this.lastPosition, newPosition);
    const timeSinceUpdate = Date.now() - this.lastUpdateTime;
    
    return distance > this.minDistanceForUpdate 
        || timeSinceUpdate > this.maxUpdateInterval;
  }
}
```

### 7.2 Rendering Optimization

```typescript
// Nur sichtbare Marker rendern
const visibleMarkers = quests.filter(q =>
  q.distance < 2000  // Only within 2km (not 1km radius + buffer)
);

// Use Marker Clustering
const clusteredMarkers = L.markerClusterGroup();
```

### 7.3 Location Caching

```typescript
// Cache OSM lookups
// Tile = 1000m × 1000m
const tileKey = `${Math.floor(lat/0.01)}_${Math.floor(lng/0.01)}`;

// Reuse cached tile data within 1 hour
if (cache.has(tileKey) && cache.getAge(tileKey) < 3600000) {
  return cache.get(tileKey);
}
```

---

## 8. MIGRATION PATH (Kein Datenverulst!)

### Bestehendes Game speichert:
```json
{
  "version": 1,
  "selectedHero": "aeran",
  "campaignProgress": {...},
  "inventory": {...}
}
```

### Nach Phase 7 erweitert zu:
```json
{
  "version": 2,
  "selectedHero": "aeran",
  "campaignProgress": {...},
  "inventory": {...},
  "gpsData": {
    "gpsQuests": [],
    "lastPosition": null
  }
}
```

### Migration:
```typescript
function migrateToV2(oldData: V1) {
  return {
    version: 2,
    ...oldData,
    gpsData: {
      gpsQuests: [],
      lastPosition: null
    }
  };
}
```

**GARANTIERT:** Kein Datenverlust, alte Spielstände können geladen werden

---

## 9. TEST-STRATEGIE

### Ohne echtes GPS testen:

```bash
# Demo Mode aktivieren
localStorage.setItem('__ADVENTURE_GAME_DEMO_MODE__', 'true');

# Tests laufen
npm test -- src/game/gps

# Browser DevTools Geolocation simulator nutzen
# Chrome → F12 → More tools → Sensors
```

### Unittest Beispiel:

```typescript
describe('GPS Quest Generation', () => {
  it('should generate quest for Berlin park', () => {
    const location: SafeSpawnPoint = {
      id: 'test_park',
      name: 'Tiergarten',
      lat: 52.5200,
      lng: 13.3654,
      type: 'safe_zone',
      radius: 100
    };
    
    const quest = gpsQuestGenerator.generateQuest(location, {...});
    
    expect(quest.location.lat).toBe(location.lat);
    expect(quest.questType).toMatch(/encounter|battle|puzzle/);
    expect(quest.rewards.xp).toBeGreaterThan(0);
  });
});
```

### Integration Test:

```typescript
describe('GPS Game Flow', () => {
  it('should trigger quest when player approaches', async () => {
    // Setup
    demoMode.enable();
    demoMode.teleportTo(52.5, 13.3);  // Berlin
    
    // Start GPS tracking
    gpsManager.startTracking();
    
    // Move towards quest
    for (let i = 0; i < 100; i++) {
      demoMode.moveNorth();
      await sleep(50);
    }
    
    // Check if quest triggered
    const quest = getActiveQuest();
    expect(quest.triggered).toBe(true);
  });
});
```

---

## 10. FINAL CHECKLIST BEFORE PHASE 7 START

- [ ] Plan reviewed with stakeholders
- [ ] Existing campaign tests (265) still passing
- [ ] No Breaking changes to gameStore interface
- [ ] Mock GPS extended and documented
- [ ] OSM integration strategy approved
- [ ] Capacity allocation (dev time/resources)
- [ ] Budget approved (~124 EUR/Jahr)
- [ ] Mobile platform strategy clear (iOS first? or Android?)

**Status:** READY FOR IMPLEMENTATION ✅

