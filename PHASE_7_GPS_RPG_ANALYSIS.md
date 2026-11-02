# Adventure Game – GPS-RPG Analyse & Implementierungsplan

**Stand:** November 2, 2026  
**Branch:** `feature/phase-6-desert-adventure` (bereit für Phase 7)  
**Ziel:** Erweiterung zu einem GPS-basierten Open-World RPG mit dynamischer Quest-Generierung

---

## 1. PROJEKTSTAND ANALYSE

### 1.1 Vorhandene Komponenten (✅ KÖNNEN WIEDERVERWENDET WERDEN)

#### **Campaign System** (Phase 6.4 abgeschlossen)
- ✅ 30-Episode-Kampagne mit 5 Kapiteln
- ✅ Episodenspeicherung und Fortschritt
- ✅ Kampfsystem (Episode 3: Banditenkampf)
- ✅ Rätsel-Engine (Spurenfolge, Puzzle)
- ✅ NPC-Dialoge
- ✅ XP- und Gold-Verwaltung
- ✅ Inventar-System
- **→ KERN-SPIELMECHANIK ist fertig und stabil**

#### **Character System** (Phase 5 abgeschlossen)
- ✅ 5 Helden mit unterschiedlichen Stats
- ✅ Charakter-Persistierung
- ✅ Attribut-System (Stärke, Ausdauer, Intelligenz, Glück)
- ✅ Klassen-System (Krieger, Magier, Schurke, Paladin)

#### **Geo-Infrastruktur** (teilweise vorhanden)
- ✅ `geolocation.ts` – Browser Geolocation API Wrapper
  - getCurrentPosition()
  - startTracking() / stopTracking()
  - Fehlerbehandlung, HTTPS-Check
- ✅ `demo.ts` – Demo-GPS-Modus für Entwicklung
  - Simulierte Position
  - Manuelle Bewegungen (Nord, Süd, Ost, West)
  - Teleport-Funktion
- ✅ `distance.ts` – Entfernungsberechnungen
- ✅ `safe-spawn.ts` – Sicherheitszone-Definitionen
- **→ GPS-Basis bereits vorhanden, braucht Integration**

#### **Karten-Integration**
- ✅ Leaflet & react-leaflet bereits installiert
- ✅ GameMap.tsx & InteractiveMap.tsx vorhanden
- **→ Kann für GPS-Kartendarstellung erweitert werden**

#### **Quest-System** (teilweise vorhanden)
- ✅ `quests/types.ts` – ExtendedQuest, QuestSummary, Chapter
- ✅ `dynamicEncounters.ts` – Encounter-Generator
- ✅ `storyProgression.ts` – Story-Kontext-Engine
- ✅ `persistenceManager.ts` – Quest-Speicherung
- ✅ `worldStateManager.ts` – World-State-Tracking
- **→ Quest-Framework existiert, braucht GPS-Integration**

#### **State Management**
- ✅ Zustand (State Store)
- ✅ localStorage-Persistierung
- ✅ Game State Struktur mit Geo-Support
- **→ Kann für GPS-State erweitert werden**

#### **UI-Komponenten**
- ✅ CampaignScreen.tsx (Kampagnen-Spielfeld)
- ✅ QuestJournal.tsx, QuestLog.tsx
- ✅ SafetyNotice.tsx
- ✅ HUD.tsx (Heads-up Display)
- **→ Können als Basis für GPS-UI dienen**

### 1.2 Lücken (❌ MÜSSEN GELÖST WERDEN)

| Lücke | Auswirkung | Priorität |
|-------|-----------|-----------|
| **GPS-Quest-Integration** | Quests können noch nicht GPS-basiert generiert werden | 🔴 P0 |
| **Kartenpunkt-Generierung** | Keine automatische Bestimmung von geeigneten Quest-Orten | 🔴 P0 |
| **Offline-Kartendaten** | Erfordert externe Dienste (OSM, Google Maps API) | 🔴 P0 |
| **Dynamische Quest-Generierung** | Quests sind derzeit nur manuell in Episode 1-30 | 🟠 P1 |
| **Capacitor-Integration** | Mobile-App noch nicht konfiguriert | 🟠 P1 |
| **GPS-UI Integration** | Kampagne muss mit GPS-Map-View kombiniert werden | 🟠 P1 |
| **Entfernungs-Validierung** | Location Triggering für Quest-Events | 🟡 P2 |
| **Weltgenerierung** | Seed-basierte Weltgenerierung für Konsistenz | 🟡 P2 |

---

## 2. ARCHITEKTUR-VORSCHLAG

### 2.1 Verarbeitungs-Flow (GPS-Quest-Generierung)

```
┌─────────────────────────────────────────────────────────────────┐
│                     SPIELER ÖFFNET APP                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
         ┌────────────────────────────────────────┐
         │  1. GPS-POSITION ERMITTELN             │
         │  - Browser Geolocation API             │
         │  - Demo-Modus (Entwicklung)            │
         │  - Fallback: Letzte bekannte Position  │
         └────────────────────┬───────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────────────┐
         │  2. GEEIGNETE QUEST-ORTE IN 1 KM RADIUS       │
         │  - OSM Daten (via Overpass API)               │
         │  - Nach Typ filtern: Parks, Plätze, POIs      │
         │  - Gefährliche Zonen ausschließen             │
         └────────────────────┬───────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────────────┐
         │  3. QUEST-GENERIERUNG                         │
         │  - Prozedural basierend auf Ort-Typ           │
         │  - Story-Kontext aus Kampagnen-Fortschritt    │
         │  - NPC-Namen, Gegner-Level seeded             │
         └────────────────────┬───────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────────────┐
         │  4. PERSISTIERUNG                             │
         │  - Quest speichern in localStorage             │
         │  - Nicht bei jedem Refresh neu generieren     │
         └────────────────────┬───────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────────────┐
         │  5. UI-ANZEIGE                                │
         │  - Map View mit aktuen Quests                  │
         │  - Kampagne bleibt verfügbar                  │
         │  - Entfernung zu Quest-Zielen                 │
         └────────────────────────────────────────────────┘
```

### 2.2 Modul-Struktur

```
src/game/
├── campaign/           (✅ EXISTIERT - BLEIBT UNVERÄNDERT)
│   ├── episodeManager.ts
│   ├── campaignData.ts
│   ├── firstEpisode.ts
│   ├── secondEpisode.ts
│   └── thirdEpisode.ts
│
├── geo/               (✅ EXISTIERT - WIRD ERWEITERT)
│   ├── geolocation.ts
│   ├── distance.ts
│   ├── demo.ts
│   ├── types.ts
│   ├── interaction.ts
│   ├── safe-spawn.ts
│   └── ← NEU: locationTrigger.ts (Distanz-Check)
│
├── quests/            (✅ EXISTIERT - WIRD ERWEITERT)
│   ├── dynamicEncounters.ts
│   ├── storyProgression.ts
│   ├── persistenceManager.ts
│   ├── worldStateManager.ts
│   └── ← NEU: gpsQuestGenerator.ts
│
├── world/             (✅ EXISTIERT - WIRD ERWEITERT)
│   ├── worldGenerator.ts
│   ├── seededRandom.ts
│   └── ← NEU: osm-integration.ts (Kartendaten)
│
├── gps/               (❌ NEU MODUL)
│   ├── gpsManager.ts        – Zentrale GPS-Verwaltung
│   ├── gpsStore.ts          – Zustand für GPS-Position
│   ├── questLocationFinder.ts – OSM-basierte Ortssuche
│   └── mockGpsProvider.ts   – Entwicklungs-GPS-Mock
│
└── state/             (✅ EXISTIERT - WIRD ERWEITERT)
    ├── gameStore.ts
    └── ← NEU: GPS-State in gameStore integrieren
```

### 2.3 Daten-Struktur: GPS-Quest

```typescript
// Neue Struktur für GPS-generierte Quests
interface GPSQuest {
  id: string;                    // "gps_quest_<timestamp>"
  type: 'gps_encounter';         // Unterschied zu Campaign-Quests
  status: 'active' | 'completed' | 'abandoned';
  
  // Lokation
  location: {
    lat: number;
    lng: number;
    accuracy: number;            // GPS-Genauigkeit
    placeName: string;            // "Charlottenburger Schloss"
    osmNodeId?: string;           // OpenStreetMap ID
    osmType: 'node' | 'way' | 'relation';
  };
  
  // Quest-Details
  questType: 'encounter' | 'collect' | 'battle' | 'puzzle' | 'treasure';
  title: string;                 // "Begegnung mit Wanderer"
  description: string;
  storyContext: string;          // Verbindung zur Kampagne
  
  // Progress
  createdAt: number;
  activatedAt?: number;          // Wann der Spieler sich der Lokation nähert
  completedAt?: number;
  
  // Belohnungen
  rewards: {
    xp: number;
    gold: number;
    items?: string[];
  };
  
  // Seeds für Konsistenz
  randomSeed: number;            // Für seeded NPC-Namen, Gegner-Stats
  
  // Trigger
  triggerDistance: number;       // Meter für Aktivierung (z.B. 50m)
  completionDistance?: number;   // Meter zum Abschluss
  
  // Verknüpfung zur Kampagne
  linkedCampaignId?: string;     // Optional: Zugehörige Episode
  linkedEpisodeId?: string;
}

// Storage-Struktur
interface GPSQuestState {
  activeQuests: GPSQuest[];      // Momentan verfügbare Quests
  completedQuests: GPSQuest[];   // Für Achievements/Stats
  lastGenerationTime: number;
  lastGenerationLocation: LatLng;
}
```

---

## 3. IMPLEMENTIERUNGS-PHASEN

### Phase 7.1: GPS-Core & Mock-System (Wochen 1-2)

**Ziele:**
- GPS-Service erweitern (bereits 60% vorhanden)
- Mock-GPS für lokale Entwicklung perfektionieren
- GPS-State in Zustand integrieren
- Tests ohne echte GPS-Bewegung

**Dateien:**
- `src/game/gps/gpsManager.ts` – NEU
- `src/game/gps/gpsStore.ts` – NEU
- `src/game/geo/geolocation.ts` – Erweitern
- `src/game/geo/demo.ts` – Erweitern
- Tests: `src/game/gps/__tests__/gpsManager.test.ts`

**Abhängigkeiten:**
- ✅ Keine neuen npm-Pakete
- Browser Geolocation API (vorhanden)

---

### Phase 7.2: OSM-Integration & Kartenpunkt-Generierung (Wochen 2-3)

**Ziele:**
- Überpass API Integration für POI-Suche
- Sichere Spawn-Punkt-Validierung
- Lokale Caching der OSM-Daten
- Kartendarstellung mit Leaflet

**Dateien:**
- `src/game/gps/questLocationFinder.ts` – NEU
- `src/game/world/osm-integration.ts` – NEU
- `src/game/geo/safe-spawn.ts` – Erweitern
- `src/components/Map/GPSMapView.tsx` – NEU

**Abhängigkeiten:**
- ✅ Leaflet (bereits vorhanden)
- Overpass API (öffentlich, kostenlos)
- Keine neuen npm-Pakete

**Externe APIs:**
- Overpass API (https://overpass-api.de)
  - Kostenlos, keine Authentifizierung
  - Rate Limit: ~1 req/s (ausreichend)
  - Fallback: Lokale Caches für Offline

---

### Phase 7.3: Dynamische Quest-Generierung (Wochen 3-4)

**Ziele:**
- GPS-Quest-Generator bauen
- Prozedual generierte Quest-Texte
- Story-Kontext-Integration
- Seeded Zufälligkeit

**Dateien:**
- `src/game/quests/gpsQuestGenerator.ts` – NEU
- `src/game/quests/questSeeds.ts` – NEU (NPC-Namen, Gegner-Templates)
- `src/game/quests/storyProgression.ts` – Erweitern

**Abhängigkeiten:**
- ✅ Keine neuen npm-Pakete
- Vorhandenes worldGenerator-System

---

### Phase 7.4: Location Triggering & UI-Integration (Wochen 4-5)

**Ziele:**
- Distanz-basiertes Quest-Triggering
- GPS-Kampagne-Hybrid-UI
- Karte + Kampagne kombinieren
- Spieler-Benachrichtigungen

**Dateien:**
- `src/game/geo/locationTrigger.ts` – NEU
- `src/components/GPS/GPSGameScreen.tsx` – NEU
- `src/components/Map/QuestMarkers.tsx` – NEU
- `src/pages/GPSGameWorld.tsx` – NEU

**Abhängigkeiten:**
- ✅ react-leaflet (bereits vorhanden)
- Browser Notification API

---

### Phase 7.5: Mobile-App & Capacitor (Wochen 5-6)

**Ziele:**
- Capacitor Integration
- Native GPS auf iOS/Android
- App Shell konfigurieren
- Store Deployment vorbereiten

**Dateien:**
- `capacitor.config.ts` – NEU
- `src/game/gps/nativeGeolocation.ts` – NEU
- `ios/` & `android/` Ordner – NEU

**Abhängigkeiten:**
```json
{
  "@capacitor/core": "^7.0.0",
  "@capacitor/geolocation": "^7.0.0",
  "@capacitor/cli": "^7.0.0"
}
```

---

### Phase 7.6: Quest-Persistierung & Speichern (Woche 6)

**Ziele:**
- GPS-Quests speichern/laden
- Kampagnen + GPS-Quests kombinieren
- Speicher-Migration
- Offline-Unterstützung

**Dateien:**
- `src/game/gps/gpsQuestPersistence.ts` – NEU
- `src/game/state/gameStore.ts` – Erweitern

---

### Phase 7.7: Beta-Test & Polish (Wochen 7-8)

**Ziele:**
- Real-GPS Feldtest
- Performance-Optimierung
- Akkulaufzeit reduzieren
- Sicherheit/Datenschutz-Audit

---

## 4. TECHNISCHE RISIKEN & LÖSUNGEN

### Risk #1: OSM-API Ausfälle
**Problem:** Overpass API kann überlastet sein oder ausfallen  
**Lösung:**
- ✅ Lokale Cache-Daten für Deutschland (bei Installation)
- ✅ Fallback auf generische Karte ohne Spezial-POIs
- ✅ Demo-Mode für Entwicklung ohne API-Zugriff
**Kosten:** Keine (kostenlos)

### Risk #2: GPS-Genauigkeit variiert
**Problem:** GPS hat 5-50m Fehler, nicht auf jeden Meter verlässlich  
**Lösung:**
- ✅ Trigger-Entfernungen großzügig (z.B. 100m statt 5m)
- ✅ Hysterese: Quest aktiviert bei 100m, deaktiviert erst bei 150m
- ✅ Höhengenauigkeit berücksichtigen
- ✅ Langsame GPS-Updates buffern (5-10 Sekunden)

### Risk #3: Spieler an unsicheren Orten (Straßen, Gewässer, Privatgrundstücke)
**Problem:** Zufällige Quests könnten gefährliche Orte aufweisen  
**Lösung:**
- ✅ `safe-spawn.ts` filtert vorher
- ✅ OSM-Tags prüfen: `area=yes`, `access=private`, `highway=*`
- ✅ Spieler-Warnung: "Diesen Ort sicher erreichen?"
- ✅ Quests nur an bewährten Orten in der Nähe

### Risk #4: Akkulaufzeit
**Problem:** GPS + Display Tracking drainiert Batterie schnell  
**Lösung:**
- ✅ Position nur alle 10-30 Sekunden updatenn
- ✅ Display-Helligkeit anpassen
- ✅ Backgrounding mit Capacitor
- ✅ User kann Tracking pausieren

### Risk #5: Datenschutz & Standortspeicherung
**Problem:** GPS-Daten sind sensibel  
**Lösung:**
- ✅ Standort-Daten NICHT senden an Server (nur lokal)
- ✅ Explizite Genehmigung vor GPS-Zugriff
- ✅ Transparente Privacy Policy
- ✅ Alte GPS-Logs nach 30 Tagen löschen

### Risk #6: Kosten für externe Services
**Problem:** Google Maps, Mapbox sind teuer  
**Lösung:**
- ✅ Leaflet + OSM (kostenlos, Open Source)
- ✅ Overpass API (kostenlos)
- ✅ Keine Backend-Kosten (alles lokal)
- **Geschätzte Kosten: 0 EUR/Monat** (nur Entwicklerzeit)

---

## 5. EXTERNE DIENSTE & KOSTEN

### 5.1 OSM / Overpass API

| Service | Kosten | Limit | Alternative |
|---------|--------|-------|-------------|
| Overpass API | 🟢 Kostenlos | ~1 req/sec | Lokale OSM-Daten |
| Leaflet Tiles | 🟢 Kostenlos | Unbegrenzt | OSM Tiles |
| Google Maps API | 🔴 $7+ pro 1000 Anfragen | - | ❌ Zu teuer |

**Empfehlung:** Overpass API + Leaflet (0 EUR)

### 5.2 iOS/Android Deployment

| Plattform | Kosten | Periodizität |
|-----------|--------|-------------|
| Apple Developer | $99 | Jährlich |
| Google Play Console | $25 | Einmalig |
| **Summe** | **$124** | **Pro Jahr** |

### 5.3 Geschätzte Gesamt-Kosten (erstes Jahr)

| Kategorie | Kosten |
|-----------|--------|
| Externe APIs | 🟢 0 EUR |
| Mobile App Developer Accounts | 🟡 124 EUR |
| Server/Backend | 🟢 0 EUR (lokal) |
| CDN/Hosting | 🟢 0 EUR (client-side) |
| **Total** | **~124 EUR/Jahr** |

---

## 6. LOKALE TESTS OHNE ECHTES GPS

### 6.1 Demo-Modus (Bereits vorhanden!)

```typescript
// In Browser Console aktivieren:
localStorage.setItem('__ADVENTURE_GAME_DEMO_MODE__', 'true');
location.reload();

// Dann auf Karte:
import { demoMode } from './game/geo/demo';

demoMode.moveNorth();      // 1 Schritt Nord
demoMode.moveEast();       // 1 Schritt Ost
demoMode.teleportTo(48.8566, 2.3522);  // Teleport zu Koordinaten
```

### 6.2 Unit Tests (GPS-unabhängig)

```bash
npm test -- --run src/game/gps/__tests__
```

Alle Quest-Generierung, Entfernungs-Berechnungen, etc. können ohne echtes GPS getestet werden.

### 6.3 Mock-GPS Provider

```typescript
// Für Tests können wir Mock-GPS verwenden:
class MockGPSProvider {
  getCurrentPosition() { return mockPosition; }
  startTracking() { return setInterval(...) }
}
```

### 6.4 Browser DevTools Simulator

Chrome DevTools: 
- Sensors Tab → Geolocation
- Custom Latitude/Longitude eintragen
- Quest-Triggered prüfen

---

## 7. BESTEHENDE KAMPAGNE NICHT BEEINTRÄCHTIGT ✅

**Garantiert:**

1. ✅ Alle 30 Episoden bleiben spielbar
2. ✅ Campaign-Speicherstände erhalten
3. ✅ XP, Gold, Inventar unverändert
4. ✅ Bestehende Tests (265) müssen alle bestehen
5. ✅ Keine Breaking Changes in Zustand-Struktur
6. ✅ GPS-Features sind **OPTIONAL** – spielbar auch ohne GPS

**New Features sind Additive:**
- GPS-Quest-Screen ist NEUER Screen (neben Campaign)
- Campaign-Screen bleibt unberührt
- User wählt: "Kampagne" oder "Freie GPS-Quests"

---

## 8. NEXT STEPS ZUM COMMIT

### Wenn Plan GENEHMIGT:
1. ✅ Phase 7.1 starten: GPS-Core ausbauen
2. ✅ Mock-GPS perfektionieren für lokale Tests
3. ✅ Keine Kampagnen-Dateien ändern
4. ✅ Alle neuen Tests schreiben
5. ✅ Production Build muss bestehen

### Falls Fragen:
- Externe APIs zu teuer? → Lass uns lokale Datenbank bauen
- Capacitor kompliziert? → Können wir PWA machen
- Datenenschutz bedenken? → Alles lokal, kein Server

---

## 9. RESSOURCEN & DOKUMENTATION

- [Geolocation API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Overpass API Turbo](https://overpass-turbo.osm.de/)
- [Leaflet Dokumentation](https://leafletjs.com/)
- [Capacitor Docs](https://capacitorjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)

---

**Status:** 🟡 BEREIT FÜR REVIEW

Bitte geben Sie Feedback zu:
1. Phase-Aufteilung (zu groß/zu klein?)
2. Technische Ansätze (Overpass vs. andere Lösung?)
3. Prioritäten (Mobile zuerst oder Kampagnen+GPS?)
4. Budget-Rahmenbedingungen

