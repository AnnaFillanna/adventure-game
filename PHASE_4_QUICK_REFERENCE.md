# Phase 4 - Quick Reference Guide

## 🎨 Component Quick Links

### Dialogue System
```tsx
import { NPCDialogue } from '@/components/Dialogue/NPCDialogue';

<NPCDialogue
  npcId="npc_id"
  questCompleted={false}
  onDialogueEnd={handleEnd}
  onQuestAccept={handleAccept}
/>
```

### Character Stats
```tsx
import { CharacterProfile } from '@/components/Character/CharacterProfile';

<CharacterProfile />
```

### Inventory
```tsx
import { Inventory } from '@/components/Character/Inventory';

<Inventory />
```

### Quest Tracking
```tsx
import { QuestJournal } from '@/components/Character/QuestJournal';

<QuestJournal />
```

### Combat Interface
```tsx
import { EnhancedCombatUI } from '@/components/Combat/EnhancedCombatUI';

<EnhancedCombatUI />
```

---

## 🎯 Color System

Import from `@/styles/colors.scss`:

```scss
// Primary Colors
$color-primary-dark: #1a3a2a;
$color-primary: #2a5a3a;
$color-primary-light: #3a7a4a;

// Accents
$color-gold: #d4a574;
$color-gold-light: #e0b885;
$color-gold-dark: #c89560;

// Status
$color-success: #7cb342;
$color-danger: #d32f2f;
$color-warning: #ff9800;
$color-info: #1e88e5;

// Shadows
$shadow-small: 0 2px 4px rgba(0, 0, 0, 0.2);
$shadow-medium: 0 8px 16px rgba(0, 0, 0, 0.3);
$shadow-large: 0 16px 32px rgba(0, 0, 0, 0.4);
```

---

## 📐 Spacing & Typography

### Font Sizes
- Headers: 16-32px, bold, uppercase
- Body: 12-14px, regular
- Labels: 10-11px, uppercase, letter-spacing

### Spacing Scale
- Small: 8px
- Medium: 12-16px
- Large: 20-24px
- XL: 32px+

---

## 🔄 State Management

### Using GameStore
```tsx
import { useGameStore } from '@/game/state/gameStore';

const player = useGameStore((state) => state.player);
const quests = useGameStore((state) => state.quests);
const addItem = useGameStore((state) => state.addItem);
```

### Available Actions
```tsx
// Inventory
addItem(item: Item)
removeItem(itemId: string, quantity?: number)
hasItem(itemId: string, quantity?: number): boolean

// Quests
startQuest(quest: Quest)
completeQuest(questId: string)
updateQuestObjective(questId: string, objectiveId: string, progress: number)

// Stats
addXP(amount: number)
levelUp()

// Combat
initiatesCombat(enemy: Enemy)
executeCombatAction(action: string, targetId?: string)
endCombat()
```

---

## 🎨 Animation Utilities

### Common Animations
```scss
// Fade in
animation: fadeIn 0.3s ease-in-out;

// Slide up
animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

// Glow effect
animation: portraitGlow 3s ease-in-out infinite;

// Shimmer
animation: shimmer 2s infinite;

// Float
animation: popupFloat 1.5s ease-out forwards;
```

### Bouncy Easing
```scss
cubic-bezier(0.34, 1.56, 0.64, 1)  // Bouncy, playful
```

### Smooth Transitions
```scss
transition: all 0.2s ease;  // For hover states
transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);  // For bars
```

---

## 🎯 Type Definitions

### Item Type
```tsx
interface Item {
  id: string;
  name: string;
  type: 'coin' | 'potion' | 'weapon' | 'armor' | 'quest_item';
  quantity: number;
  description: string;
  icon: string;
  value?: number;
  healAmount?: number;
  attackBonus?: number;
  defenseBonus?: number;
}
```

### Quest Type
```tsx
interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'active' | 'completed' | 'rewarded';
  objectives: QuestObjective[];
  rewards: { xp: number; items: Array<{...}>; gold: number };
  npcGiver: string;
  npcCompletion?: string;
  prerequisiteQuest?: string;
}
```

### Enemy Type
```tsx
interface Enemy {
  id: string;
  name: string;
  level: number;
  stats: CharacterStats;
  attackPattern: 'aggressive' | 'defensive' | 'mixed';
  lootTable: Item[];
}
```

---

## 📱 Mobile Breakpoints

```scss
// Desktop
(min-width: 769px) { ... }

// Tablet
@media (max-width: 768px) { ... }

// Mobile
@media (max-width: 640px) { ... }
```

---

## ♿ Accessibility

### Motion Preferences
```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### Touch Target Sizes
- Minimum: 44px × 44px
- Recommended: 48-64px

### Color Contrast
- Text on background: WCAG AAA (7:1 ratio)
- Icons: WCAG AAA compliant
- Status indicators: Color + pattern/icon

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### TypeScript Check
```bash
npx tsc --noEmit
```

### Production Build
```bash
npm run build
```

---

## 🚀 Integration Points

### WorldStateSyncManager
```tsx
import { useWorldStateSyncManager } from '@/game/integration';

const syncManager = useWorldStateSyncManager(worldStateManager);
syncManager.getStoryProgress();
syncManager.executeWorldAction('collect', objectId);
```

### DialogueSystem
```tsx
import { DialogueManager } from '@/game/systems/dialogueSystem';

const manager = new DialogueManager();
const nextDialogue = manager.selectOption(optionIndex);
```

---

## 🐛 Debugging Tips

### Check Component State
```tsx
// Add to component
console.log('Player state:', player);
console.log('Quests:', quests);
console.log('Combat state:', combatState);
```

### Inspect Store
```tsx
// In browser console
import { useGameStore } from '@/game/state/gameStore';
const state = useGameStore.getState();
console.log(state);
```

### CSS Issues
- Open DevTools → Elements
- Check computed styles
- Look for CSS Module scoping
- Verify SCSS variables imported

### Animation Problems
- Disable prefers-reduced-motion in OS settings
- Check animation keyframes defined
- Verify browser support (Chrome/Firefox latest)
- Use DevTools Performance tab to profile

---

## 📚 Resources

- **Phase 3 Backend:** `src/game/quests/`
- **Phase 2 Map:** `src/components/Map/`
- **Phase 1 Game Engine:** `src/game/state/`
- **Colors:** `src/styles/colors.scss`
- **Documentation:** `PHASE_4_SUMMARY.md`

---

## ✅ Pre-Commit Checklist

- [ ] `npx tsc --noEmit` (0 errors)
- [ ] `npm run test` (77+ tests pass)
- [ ] `npm run build` (success)
- [ ] Mobile responsive tested
- [ ] Accessibility checked
- [ ] No console errors
- [ ] No breaking changes to Phase 1-3

---

## 🎉 You're Ready!

All Phase 4 components are production-ready. Start building Phase 5! 🚀
