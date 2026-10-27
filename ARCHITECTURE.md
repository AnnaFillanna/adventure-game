# Adventure Game - Architektur-Dokumentation

## Übersicht der Game Engine

### Schichtenmodell

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  React Components (GameWorld, HUD, Combat, Inventory)   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    STATE LAYER                          │
│  Zustand Store (gameStore.ts)                          │
│  - Inventory Management                                 │
│  - Quest State                                          │
│  - Player Stats                                         │
│  - Combat State                                         │
└───────────────────────────┬─────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────────┐ ┌─────▼──────────┐ ┌────▼───────────┐
│  COMBAT ENGINE   │ │ QUEST ENGINE   │ │  GAME RULES    │
│  - Calculations  │ │ - Progression  │ │  - Balance     │
│  - AI Actions    │ │ - Objectives   │ │  - Constants   │
└───────────────────┘ └────────────────┘ └────────────────┘
        │                   │                   │
└───────┴───────────────────┴───────────────────┘
                   │
        ┌──────────▼──────────┐
        │  PERSISTENCE LAYER  │
        │  - localStorage API │
        │  - Save Management  │
        │  - Preferences      │
        └─────────────────────┘
```

## Module Breakdown

### 1. Types System (`src/game/state/types.ts`)

**Verantwortung**: Zentrale TypeScript-Definitionen für alle Spielentitäten

**Wichtige Interfaces**:

```typescript
// Spieler-Charakter
interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  stats: CharacterStats;
  inventory: Inventory;
  position: Position;
  direction: Direction;
}

// NPCs und Gegner
interface NPC { /* ... */ }
interface Enemy { /* ... */ }

// Quests
interface Quest { /* ... */ }
interface QuestObjective { /* ... */ }

// Kampf
interface CombatState { /* ... */ }
interface CombatMove { /* ... */ }

// Globaler Game State
interface GameState {
  player: Character;
  quests: Quest[];
  npcLocations: Record<string, NPC>;
  enemyLocations: Record<string, Enemy>;
  combatState: CombatState | null;
  // ... weitere Felder
}
```

**Verwendung**:
- Alle Dateien importieren diese Types
- Gewährleistet Type Safety
- Ermöglicht IntelliSense & Auto-Completion

---

### 2. State Management (`src/game/state/gameStore.ts`)

**Verantwortung**: Zentraler State Store mit Zustand

**Hauptfunktionen**:

```typescript
interface GameStore extends GameState {
  // Inventory
  addItem(item: Item): void;
  removeItem(itemId: string, quantity?: number): void;
  hasItem(itemId: string, quantity?: number): boolean;

  // Quests
  startQuest(quest: Quest): void;
  completeQuest(questId: string): void;
  updateQuestObjective(questId: string, objectiveId: string, progress: number): void;
  getActiveQuest(): Quest | undefined;

  // Combat
  initiatesCombat(enemy: Enemy): void;
  executeCombatAction(action: string, targetId?: string): void;
  endCombat(): void;

  // Progression
  addXP(amount: number): void;
  levelUp(): void;

  // Persistence
  saveGame(): string;
  loadGame(saveData: string): void;
  resetGame(): void;
}
```

**Verwendung in Komponenten**:

```typescript
// Hook aus Komponente
const addItem = useGameStore((state) => state.addItem);
const player = useGameStore((state) => state.player);
const quests = useGameStore((state) => state.quests);

// State wird automatisch aktualisiert
// Komponente re-rendern nur wenn relevante State sich ändert
```

**Architektur-Vorteile**:
- Single Source of Truth
- Unidirektionaler Datenfluss
- Minimale Re-Renders
- Keine Boilerplate (im Vergleich zu Redux)

---

### 3. Game Engine (`src/game/engine/`)

#### 3a. Combat Engine (`combatEngine.ts`)

**Verantwortung**: Reine Kampflogik (keine State Mutations)

**Funktionen**:

```typescript
// Schaden-Berechnung
export const calculateDamage = (
  attacker: Character | Enemy,
  defender: Character | Enemy,
  action: 'attack' | 'magic' = 'attack'
): number

// Kampfzug simulieren
export const executeCombatRound = (
  playerMove: CombatMove,
  enemyAI: Enemy
): { playerMessage: string; enemyMessage: string }

// Beute generieren
export const generateLoot = (enemy: Enemy): Record<string, number>

// Kampf-Status prüfen
export const isCombatOver = (character: Character, enemy: Enemy): boolean
export const determineCombatWinner = (): 'player' | 'enemy' | 'draw'
```

**Design-Pattern**: Pure Functions
- Input → Output
- Keine Seiteneffekte
- Leicht testbar
- Deterministisch

#### 3b. Quest Engine (`questEngine.ts`)

**Verantwortung**: Quest-Logik und Fortschritts-Tracking

**Funktionen**:

```typescript
// Voraussetzungen checken
export const canStartQuest = (quest: Quest, completedQuests: Quest[]): boolean

// Fortschritt aktualisieren
export const updateQuestProgress = (
  quest: Quest,
  objective: QuestObjective,
  progressDelta: number
): QuestObjective

// Status prüfen
export const areAllObjectivesComplete = (objectives: QuestObjective[]): boolean
export const canCompleteQuest = (quest: Quest): boolean

// Informationen abrufen
export const getQuestProgress = (quest: Quest): number // 0-100
export const getNextIncompleteObjective = (quest: Quest): QuestObjective | undefined
```

---

### 4. Data & Configuration (`src/game/data/config.ts`)

**Verantwortung**: Game Balance, Content, Konstanten

**Inhalt**:

```typescript
// Game Balance
export const BALANCE = {
  DAMAGE_VARIANCE: 0.2,
  CRITICAL_CHANCE: 0.1,
  LEVEL_UP_STAT_INCREASE: { /* ... */ },
  // ...
}

// Color Palette
export const COLORS = {
  forestGreen: '#1a472a',
  goldAccent: '#d4af37',
  // ...
}

// Spielkonfiguration
export const GAME_CONFIG = {
  WORLD_WIDTH: 100,
  WORLD_HEIGHT: 100,
  PLAYER_SPEED: 2,
  AUTO_SAVE_INTERVAL: 30000,
  // ...
}

// Content: NPCs, Gegner, Items, Quests
export const NPCS: Record<string, NPC> = { /* ... */ }
export const ENEMIES: Record<string, Enemy> = { /* ... */ }
export const ITEMS: Record<string, Item> = { /* ... */ }
export const QUESTS: Record<string, Quest> = { /* ... */ }
```

**Verwendung**:
- Zentrale Definitionsquelle für Balance
- Einfach anzupassen ohne Code-Änderungen
- Leicht skalierbar auf hunderte Content

---

### 5. Persistence (`src/game/utils/storage.ts`)

**Verantwortung**: localStorage-Verwaltung

```typescript
export const saveManager = {
  save(gameState: GameState, slot?: number): boolean
  load(slot?: number): SaveFile | null
  delete(slot?: number): boolean
  getAllSaves(): SaveFile[]
  hasSave(slot?: number): boolean
  clearAll(): boolean
}

export const preferencesManager = {
  setPreference(key: string, value: unknown): void
  getPreference<T>(key: string, defaultValue: T): T
  deletePreference(key: string): void
}

export const analyticsManager = {
  logEvent(type: string, data: Record<string, unknown>): void
  getEvents(): GameEvent[]
  clearEvents(): void
}
```

---

### 6. React Components

#### Page Components

**StartScreen** (`src/pages/StartScreen.tsx`)
- Einstiegspunkt
- Navigation zu GameWorld
- Spielstand laden/fortsetzten

**GameWorld** (`src/pages/GameWorld.tsx`)
- Hauptspiel-Loop
- Orchestriert alle Sub-Komponenten
- Handhabt Game Events
- Auto-Save Management

#### UI Components (`src/components/UI/`)

**HUD.tsx**
- Zeigt Spieler-Stats
- Aktive Quest-Info
- Read-only (keine State-Mutations)

**CombatUI.tsx**
- Kampf-Overlay
- Action-Buttons
- Combat Log
- Result-Screens

**Inventory.tsx**
- Item-Display
- Slot-Management
- Modal-Interface

**QuestLog.tsx**
- Quest-Übersicht
- Active/Completed Tabs
- Objective-Tracking

**GameMap.tsx**
- 2D-Welt-Darstellung
- Character Rendering
- Interaktionen (Coins, NPCs)
- Collision Detection

---

## Data Flow Diagramm

### Quest-Initialisierung

```
User drückt "Start Adventure"
        ↓
StartScreen → navigate("/game")
        ↓
GameWorld mountet
        ↓
Initialisiere NPCs & Enemies in Store
        ↓
Render GameMap + HUD
        ↓
Player sieh Elder Elara
```

### Coin-Sammlung

```
Player nähert sich Coin
        ↓
GameMap erkennt Nähe (distance < 5)
        ↓
GameMap.onCollectCoin() aufgerufen
        ↓
GameWorld → addItem() Store-Action
        ↓
Inventory.items aktualisiert
        ↓
Komponenten re-rendern (zugeordnete)
```

### Quest-Abschluss

```
Spieler hat 5 Coins gesammelt
        ↓
Quest-Objektiv completed = true
        ↓
GameWorld erkennt Abschluss
        ↓
completeQuest() aufgerufen
        ↓
Store:
  - Quest Status → completed
  - XP vergeben
  - Items ins Inventar
  - Nächste Quest starten (falls Abhängigkeit)
        ↓
HUD aktualisiert mit neuer Quest
```

### Kampf-Loop

```
Player trifft Gegner
        ↓
GameWorld.initiatesCombat(enemy)
        ↓
Store.combatState = { isActive: true, ... }
        ↓
CombatUI rendert (Modal-Overlay)
        ↓
Player drückt Aktion (z.B. "Attack")
        ↓
executeCombatAction("attack")
        ↓
Store:
  - Spieler Schaden berechnet
  - Gegner HP reduziert
  - Enemy Counter-Attack
  - combatLog aktualisiert
        ↓
CombatUI re-rendert mit neuem Zustand
        ↓
Wenn Kampf vorbei:
  - XP vergeben
  - Loot generiert
  - combatState = null
        ↓
CombatUI unmount
        ↓
GameWorld weiterhin sichtbar
```

---

## Erweiterungspunkte

### 1. Neuen NPC hinzufügen

```typescript
// 1. In config.ts
export const NPCS = {
  new_merchant: {
    id: 'new_merchant',
    name: 'Merchant',
    type: 'merchant',
    dialogue: '...',
    position: { x: 25, y: 75 },
    quest: 'quest_trading'
  }
}

// 2. In config.ts - neue Quest erstellen
export const QUESTS = {
  quest_trading: {
    id: 'quest_trading',
    title: 'Trading Quest',
    // ...
  }
}

// 3. NPC ist auto verfügbar
// - Wird in GameWorld initialisiert
// - Spieler kann mit klicken interagieren
```

### 2. Neuen Gegner hinzufügen

```typescript
// 1. In config.ts
export const ENEMIES = {
  orc_warrior: {
    id: 'orc_warrior',
    name: 'Orc Warrior',
    level: 5,
    stats: { /* ... */ },
    lootTable: [ /* ... */ ],
    xpReward: 150,
    position: { x: 80, y: 80 }
  }
}

// 2. Neu gegner spawnen automatisch
// - Collision wird erkannt
// - Kampf wird initiiert
```

### 3. Neues Item hinzufügen

```typescript
// 1. In config.ts
export const ITEMS = {
  sword_iron: {
    id: 'sword_iron',
    name: 'Iron Sword',
    type: 'weapon',
    quantity: 0,
    icon: '⚔️',
    attackBonus: 5,
    // ...
  }
}

// 2. Im Quest/Loot verwenden
rewards: {
  items: [{ itemId: 'sword_iron', quantity: 1 }]
}

// 3. Wird automatisch ins Inventar hinzugefügt
```

### 4. Balance anpassen

```typescript
// In config.ts - BALANCE Objekt
export const BALANCE = {
  DAMAGE_VARIANCE: 0.3,  // Mehr Varianz
  CRITICAL_CHANCE: 0.15, // Höhere Chance
  LEVEL_UP_STAT_INCREASE: {
    maxHealth: 15,  // +15 statt +10
    attack: 5,      // +5 statt +3
    // ...
  }
}
```

---

## Testing-Strategie

### Unit Tests (Engine-Funktionen)

```typescript
// combatEngine.test.ts
describe('calculateDamage', () => {
  it('should calculate damage based on stats', () => {
    const attacker = { stats: { attack: 15 } };
    const defender = { stats: { defense: 5 } };
    const damage = calculateDamage(attacker, defender);
    expect(damage).toBeGreaterThan(0);
  });
});
```

### Integration Tests (Store)

```typescript
// gameStore.test.ts
describe('Quest Completion', () => {
  it('should complete quest and award XP', () => {
    const store = useGameStore();
    store.completeQuest('quest_1');
    expect(store.totalXP).toBeGreaterThan(0);
  });
});
```

### E2E Tests (Gameplay)

```typescript
// gameplay.e2e.test.ts
describe('Full Game Loop', () => {
  it('should complete first quest', () => {
    // Start game
    // Collect 5 coins
    // Complete quest
    // Verify rewards
  });
});
```

---

## Performance-Optimierungen

### 1. Store Subscriptions

```typescript
// Nur relevante State subscriben
const player = useGameStore((state) => state.player);
// ↓ Nicht:
// const gameState = useGameStore();
```

### 2. Memoization

```typescript
export const GameMap = React.memo(({ playerPosition, npcs }) => {
  // Re-render nur wenn props sich ändern
});
```

### 3. Lazy Loading (Zukünftig)

```typescript
const CombatUI = React.lazy(() => import('./CombatUI'));

<Suspense fallback={null}>
  <CombatUI />
</Suspense>
```

---

## Migration zu Backend

### Phase 1: API Integration

```typescript
// Neue Layer: API Client
export const gameAPI = {
  saveGame(state: GameState) {
    return fetch('/api/save', { method: 'POST', body: JSON.stringify(state) })
  },
  
  loadGame(userId: string) {
    return fetch(`/api/load/${userId}`)
  },
  
  completeQuest(questId: string) {
    return fetch(`/api/quests/${questId}/complete`, { method: 'POST' })
  }
}
```

### Phase 2: Server Validation

```typescript
// Backend validiert all actions
// Verhindert Cheating
// Authoritative Game State auf Server
```

### Phase 3: Real-time Sync

```typescript
// WebSocket für Live-Updates
// Multiplayer-Ready
// Push-Notifications
```

---

## Best Practices

1. **Type Safety First**: Alle Daten typisiert
2. **Immutability**: Keine State Mutations
3. **Pure Functions**: Engine-Logik ist deterministische
4. **Separation of Concerns**: Layers haben klare Rollen
5. **DRY Principle**: Keine Code-Duplikation
6. **Documentation**: Code ist selbsterklärend & kommentiert

---

## Zusammenfassung

Das Adventure Game hat eine **modulare, skalierbare Architektur**:

- ✅ Type-safe Entwicklung mit TypeScript
- ✅ Zentrales State Management mit Zustand
- ✅ Reine Game Engine Funktionen
- ✅ Leicht erweiterbar (neue NPCs, Quests, Items, Balance)
- ✅ Prepared für Backend-Integration
- ✅ Mobile-first responsive Design
- ✅ Production-ready Code Quality

**Nächste Phase**: GPS-Integration, Backend-API, Multiplayer
