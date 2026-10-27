# Phase 5 Quick Reference - Character System API

## Import Statements

```typescript
// Hero data & types
import { HEROES, getHeroDefinition } from '@/game/characters';
import type { HeroId, HeroDefinition, HeroAbility } from '@/game/characters';

// Character managers
import { TransformationManager } from '@/game/characters';
import { AbilitiesManager, calculateAbilityDamage, calculateAbilityHealing } from '@/game/characters';

// Game state
import { useGameStore } from '@/game/state/gameStore';

// UI components
import { CharacterSelection } from '@/components/Character/CharacterSelection';
```

## Common Tasks

### Select a Hero

```typescript
const store = useGameStore();

// Select hero
store.selectHero('aeran');

// Get selected
const heroId = (store as any).selectedHeroId;

// Get hero data
const hero = getHeroDefinition(heroId);
console.log(hero.name, hero.stats);
```

### Check Hero Transformation

```typescript
const heroId = (store as any).selectedHeroId;
const hero = getHeroDefinition(heroId);

const canTransform = hero.transformation !== undefined;
console.log(canTransform ? 'Can transform' : 'No transformation');
```

### Manage Transformations

```typescript
const hero = getHeroDefinition('varg');
const manager = new TransformationManager('varg');

// Activate
if (manager.canTransform()) {
  manager.activateTransformation();
  console.log('Transformed!');
}

// Check status
console.log(manager.isTransformed()); // true/false
console.log(manager.getRemainingDuration()); // 5000ms
console.log(manager.getDurationProgress()); // 45%

// Update every frame/tick
if (manager.updateTransformationDuration()) {
  console.log('Transformation expired');
}

// Deactivate
manager.deactivateTransformation();
```

### Manage Abilities

```typescript
const abilityMgr = new AbilitiesManager('aeran');

// Get ability info
const ability = abilityMgr.getAbility('healing_melody', false);
console.log(ability?.name, ability?.cooldownMs);

// Check if can activate
const check = abilityMgr.canActivateAbility('healing_melody', 50, false);
if (check.success) {
  abilityMgr.activateAbility('healing_melody');
  const healing = calculateAbilityHealing(ability, heroMagic);
  console.log('Healed for:', healing);
} else {
  console.log(check.message);
}

// Get cooldown info
const remaining = abilityMgr.getCooldownRemaining('healing_melody');
const progress = abilityMgr.getCooldownProgress('healing_melody');
console.log(`${progress}% - ${remaining}ms remaining`);

// Get available abilities
const abilities = abilityMgr.getAvailableAbilities(isTransformed);
abilities.forEach(a => console.log(a.name));
```

### Get Stat Modifiers

```typescript
import { getTransformationStatModifiers } from '@/game/characters';

const baseStats = getHeroDefinition('varg').stats;
const modifiers = getTransformationStatModifiers('varg', true);

const transformedAttack = baseStats.attack + (modifiers.attack || 0);
console.log('Attack:', baseStats.attack, '=>', transformedAttack);
```

## Hero IDs

```typescript
type HeroId = 'aeran' | 'velar' | 'varg' | 'ravena';

// All heroes
import { ALL_HERO_IDS } from '@/game/characters';
console.log(ALL_HERO_IDS); // ['aeran', 'velar', 'varg', 'ravena']
```

## Hero Stats Structure

```typescript
interface CharacterStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  magic: number;
  magicDefense: number;
  speed: number;
}
```

## Ability Structure

```typescript
interface HeroAbility {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive';
  cooldownMs: number;
  manaCost: number;
  damageBonus?: number;
  healAmount?: number;
  icon: string;
}
```

## Transformation Structure

```typescript
interface TransformationState {
  type: 'wolf' | 'bird';
  isActive: boolean;
  activatedAt: number; // timestamp
  durationMs: number;
  cooldownMs: number;
  lastCooldownEnd: number; // timestamp
}
```

## Combat Integration

```typescript
// Apply hero stats
const heroStats = getHeroDefinition('varg').stats;

// Apply transformation modifiers
if (isTransformed) {
  const mods = getTransformationStatModifiers('varg', true);
  heroStats.attack = (mods.attack || heroStats.attack);
}

// In combat, use transformed abilities
const abilities = getAvailableAbilities('varg', isTransformed);

// Calculate damage
const ability = abilities.find(a => a.id === 'wolf_bite');
if (ability?.damageBonus) {
  const damage = calculateAbilityDamage(ability, heroStats.attack, heroStats.magic);
  applyDamage(enemy, damage);
}
```

## UI Component

```typescript
// Character selection screen
import { CharacterSelection } from '@/components/Character/CharacterSelection';

export function MainGame() {
  const selectedHero = (useGameStore() as any).selectedHeroId;

  if (!selectedHero) {
    return (
      <CharacterSelection
        onCharacterSelected={(heroId) => {
          console.log('Hero selected:', heroId);
          // Navigate to game map
        }}
      />
    );
  }

  return <GameMap />;
}
```

## Storage & Persistence

```typescript
// Game state saved automatically
const store = useGameStore();

// Heroes persist in localStorage
// On reload:
// - heroGameState restored
// - transformation state recovered
// - ability cooldowns reset (configurable)

// To reset character:
// store.resetGame(); // Resets everything including hero selection
```

## Testing Examples

```typescript
import { describe, it, expect } from 'vitest';
import { TransformationManager } from '@/game/characters';

describe('Character', () => {
  it('should transform', () => {
    const mgr = new TransformationManager('varg');
    expect(mgr.canTransform()).toBe(true);
    
    expect(mgr.activateTransformation()).toBe(true);
    expect(mgr.isTransformed()).toBe(true);
    
    mgr.deactivateTransformation();
    expect(mgr.isTransformed()).toBe(false);
  });
});
```

## Performance Notes

- **TransformationManager:** O(1) operations, no GC pressure
- **AbilitiesManager:** O(1) for ability lookups, O(n) for list operations
- **getAvailableAbilities:** O(n) where n = ability count (~5-10)
- **calculateDamage:** O(1) pure function
- **GameStore:** Zustand optimized updates, memoized selectors

## Common Patterns

### Game Loop Update

```typescript
function gameLoop(deltaTime: number) {
  const hero = (store as any).heroGameState;
  const transformMgr = new TransformationManager(hero.heroId, hero.transformationState);

  // Update transformation duration
  if (transformMgr.updateTransformationDuration()) {
    store.updateTransformationState(transformMgr.getState());
  }

  // Update UI
  setTransformProgress(transformMgr.getDurationProgress());
}
```

### Combat Turn

```typescript
function executeCombatAction(heroId: HeroId, abilityId: string, isTransformed: boolean) {
  const abilityMgr = new AbilitiesManager(heroId);
  const check = abilityMgr.canActivateAbility(abilityId, currentMana, isTransformed);

  if (!check.success) {
    showError(check.message);
    return false;
  }

  abilityMgr.activateAbility(abilityId);
  store.recordAbilityUsage(abilityId);

  return true;
}
```

---

**Quick Links:**
- Full docs: [PHASE_5_CHARACTER_SYSTEM.md](./PHASE_5_CHARACTER_SYSTEM.md)
- Tests: `src/game/characters/__tests__/characterSystem.test.ts`
- Types: `src/game/characters/types.ts`
- UI: `src/components/Character/CharacterSelection.tsx`
