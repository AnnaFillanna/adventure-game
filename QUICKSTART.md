# 🚀 Quick Start Guide

## Installation & Start (2 Minuten)

```bash
cd /Users/annafilippi/Adventure
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎮 Spielanleitung

### Start Screen
1. Klicke **"Start New Adventure"** für ein neues Spiel
2. Oder **"Continue Adventure"** um Fortschritt zu laden

### Spielwelt

**Navigation**:
- 🧝 **Elder Elara klicken** = Mit NPC sprechen
- 🪙 **Münzen sammeln** = In Nähe automatisch gesammelt
- 👹 **Goblin vermeiden** = Versteckt sich oben rechts

**Steuerung**:
- 🎒 = Inventar (oben rechts)
- 📜 = Quest Log (oben rechts)
- ⚙️ = Menü (oben rechts)

### Quest: "The Lost Treasure"

1. **Münzen sammeln**: 5 Goldmünzen einsammeln
   - Verteilt auf der Spielwelt
   - HUD zeigt Fortschritt: 0/5

2. **Quest abschließen**: Mit Elder Elara sprechen
   - Erhältst Belohnung: +100 XP, Potion

3. **Goblin besiegen**: Neuer Gegner spawnt
   - Einfacher Kampf: Attack, Defend, Magic, Potion
   - Besiege den Goblin Scout

4. **Sieg!**: Spielstand wird gespeichert

---

## 📁 Wichtige Dateien

### Spiellogik (Anfangen hier!)

| Datei | Beschreibung |
|-------|-------------|
| `src/game/state/types.ts` | Alle TypeScript Typen & Interfaces |
| `src/game/state/gameStore.ts` | Central State Management (Zustand) |
| `src/game/data/config.ts` | NPCs, Gegner, Items, Quests, Balance |
| `src/game/engine/combatEngine.ts` | Kampf-Logik |
| `src/game/engine/questEngine.ts` | Quest-Logik |

### UI Komponenten

| Datei | Beschreibung |
|-------|-------------|
| `src/pages/StartScreen.tsx` | Startbildschirm |
| `src/pages/GameWorld.tsx` | Hauptspielansicht |
| `src/components/GameMap.tsx` | 2D Spielwelt |
| `src/components/UI/HUD.tsx` | Spieler-Stats Anzeige |
| `src/components/UI/CombatUI.tsx` | Kampf-Interface |
| `src/components/UI/Inventory.tsx` | Inventar |
| `src/components/UI/QuestLog.tsx` | Quest-Übersicht |

### Styles

```
SCSS Modules verwenden:
src/components/UI/*.module.scss
src/pages/*.module.scss
```

Dark Forest Theme:
- Waldgrün (#1a472a)
- Gold Akzente (#d4af37)

---

## ⚙️ Häufige Anpassungen

### 🎨 Design ändern

```scss
// src/game/data/config.ts
export const COLORS = {
  forestGreen: '#1a472a',    // ← Ändere hier
  goldAccent: '#d4af37',     // ← Ändere hier
}
```

### 🎯 Balance anpassen

```typescript
// src/game/data/config.ts
export const BALANCE = {
  DAMAGE_VARIANCE: 0.2,      // ← Schaden-Varianz
  CRITICAL_CHANCE: 0.1,      // ← Kritischer Hit
  LEVEL_UP_STAT_INCREASE: {
    maxHealth: 10,           // ← HP pro Level
    attack: 3,               // ← Attack pro Level
  }
}
```

### 👹 Neuen Gegner hinzufügen

```typescript
// src/game/data/config.ts
export const ENEMIES = {
  dragon: {
    id: 'dragon',
    name: 'Dragon',
    level: 10,
    stats: {
      health: 200,
      maxHealth: 200,
      mana: 100,
      maxMana: 100,
      attack: 40,
      defense: 20,
      magic: 30,
      magicDefense: 25,
      speed: 8,
    },
    lootTable: [
      { itemId: 'gold_coin', probability: 0.9, quantity: 100 },
    ],
    xpReward: 500,
    position: { x: 90, y: 20 },
  }
}
```

### 📝 Neue Quest erstellen

```typescript
// src/game/data/config.ts
export const QUESTS = {
  quest_find_treasure: {
    id: 'quest_find_treasure',
    title: 'Find the Hidden Treasure',
    description: 'Hunt for ancient treasure in the forest',
    status: 'not_started',
    objectives: [
      {
        id: 'obj_find_chest',
        type: 'explore',
        target: 'treasure_location',
        description: 'Find the treasure chest',
        progress: 0,
        required: 1,
        completed: false,
      }
    ],
    rewards: {
      xp: 200,
      items: [{ itemId: 'gold_coin', quantity: 50 }],
      gold: 100,
    },
    npcGiver: 'elder_elf',
    prerequisiteQuest: 'quest_defeat_goblin',
    createdAt: Date.now(),
  }
}
```

---

## 🧪 Debugging

### State anschauen
```typescript
// In Browser Console:
useGameStore.getState()
```

### Manuell Münze sammeln
```typescript
// In Browser Console:
useGameStore.getState().addItem({
  id: 'gold_coin',
  name: 'Gold Coin',
  type: 'coin',
  quantity: 5,
  description: 'A shiny gold coin',
  icon: '🪙',
})
```

### Spielstand löschen
```typescript
// In Browser Console:
useGameStore.getState().resetGame()
```

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Output in dist/ Ordner
# Ready für Deployment zu Netlify, Vercel, etc.

# Local preview
npm run preview
```

---

## 🔗 Wichtige Links

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Zustand**: https://github.com/pmndrs/zustand
- **Vite**: https://vitejs.dev
- **SCSS**: https://sass-lang.com

---

## 🆘 Häufige Fehler

### "Cannot find module"
- Überprüfe Pfade in Import-Statements
- Ggf. `npm install` erneut ausführen

### Vite Server startet nicht
```bash
# Port ist blockiert? Ändere in vite.config.ts
# Oder: kill -9 <PID>
```

### TypeScript Fehler
```bash
# Überprüfe Types:
npx tsc --noEmit
```

---

## 🚀 Nächste Schritte

1. **Spiellogik erweitern** → Siehe [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Design anpassen** → Styles in `/src` Dateien
3. **Neue Features** → Mit Store Extensions
4. **Backend hinzufügen** → API Layer vorbereitet

---

**Happy Game Development! 🎮✨**
