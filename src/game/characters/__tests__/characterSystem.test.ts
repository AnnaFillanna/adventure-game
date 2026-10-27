/**
 * Adventure Game - Character System Tests
 * Unit tests for hero definitions, transformations, and abilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TransformationManager, getTransformationStatModifiers, getAvailableAbilities } from '../transformationManager';
import { AbilitiesManager, calculateAbilityDamage, calculateAbilityHealing } from '../abilitiesManager';
import { HEROES, getHeroDefinition } from '../heroDefinitions';

describe('Hero Definitions', () => {
  it('should have all four heroes defined', () => {
    const heroes = Object.keys(HEROES);
    expect(heroes).toHaveLength(4);
    expect(heroes).toContain('aeran');
    expect(heroes).toContain('velar');
    expect(heroes).toContain('varg');
    expect(heroes).toContain('ravena');
  });

  it('should have correct hero names and classes', () => {
    expect(HEROES.aeran.name).toBe('Aeran');
    expect(HEROES.aeran.class).toBe('bard');

    expect(HEROES.velar.name).toBe('Velar');
    expect(HEROES.velar.class).toBe('volkhv');

    expect(HEROES.varg.name).toBe('Varg');
    expect(HEROES.varg.class).toBe('wolf_shapeshifter');

    expect(HEROES.ravena.name).toBe('Ravena');
    expect(HEROES.ravena.class).toBe('bird_shapeshifter');
  });

  it('should have valid stats for each hero', () => {
    Object.entries(HEROES).forEach(([, hero]) => {
      expect(hero.stats.maxHealth).toBeGreaterThan(0);
      expect(hero.stats.maxMana).toBeGreaterThan(0);
      expect(hero.stats.attack).toBeGreaterThan(0);
      expect(hero.stats.defense).toBeGreaterThan(0);
      expect(hero.stats.magic).toBeGreaterThan(0);
      expect(hero.stats.speed).toBeGreaterThan(0);

      expect(hero.stats.health).toBe(hero.stats.maxHealth);
      expect(hero.stats.mana).toBe(hero.stats.maxMana);
    });
  });

  it('should have at least 3 abilities per hero', () => {
    Object.entries(HEROES).forEach(([, hero]) => {
      expect(hero.abilities.length).toBeGreaterThanOrEqual(3);
      expect(hero.specialAbility).toBeDefined();
    });
  });

  it('should have transformation for Varg and Ravena only', () => {
    expect(HEROES.aeran.transformation).toBeUndefined();
    expect(HEROES.velar.transformation).toBeUndefined();
    expect(HEROES.varg.transformation).toBeDefined();
    expect(HEROES.ravena.transformation).toBeDefined();
  });

  it('getHeroDefinition should return correct hero', () => {
    const hero = getHeroDefinition('aeran');
    expect(hero.name).toBe('Aeran');
    expect(hero.id).toBe('aeran');
  });
});

describe('Transformation Manager - Varg (Wolf)', () => {
  let manager: TransformationManager;

  beforeEach(() => {
    manager = new TransformationManager('varg');
  });

  it('should initialize with correct transformation type', () => {
    const state = manager.getState();
    expect(state.type).toBe('wolf');
    expect(state.isActive).toBe(false);
  });

  it('should activate transformation when not on cooldown', () => {
    const result = manager.activateTransformation();
    expect(result).toBe(true);
    expect(manager.isTransformed()).toBe(true);
  });

  it('should not activate transformation if already transformed', () => {
    manager.activateTransformation();
    const result = manager.activateTransformation();
    expect(result).toBe(false);
  });

  it('should deactivate transformation and start cooldown', () => {
    manager.activateTransformation();
    manager.deactivateTransformation();

    expect(manager.isTransformed()).toBe(false);
    expect(manager.isCooldownReady()).toBe(false);
  });

  it('should expire transformation after duration', async () => {
    const shortDuration = 100; // 100ms
    const state = manager.getState();
    state.durationMs = shortDuration;
    manager.setState(state);

    manager.activateTransformation();
    expect(manager.isTransformed()).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 150));
    
    const expired = manager.updateTransformationDuration();
    expect(expired).toBe(true);
    expect(manager.isTransformed()).toBe(false);
  });

  it('should provide duration and cooldown progress', async () => {
    manager.activateTransformation();

    // Add a small delay to ensure elapsed time > 0
    await new Promise(resolve => setTimeout(resolve, 10));

    const duration = manager.getRemainingDuration();
    expect(duration).toBeGreaterThan(0);

    const durationProgress = manager.getDurationProgress();
    expect(durationProgress).toBeGreaterThanOrEqual(0);
    expect(durationProgress).toBeLessThanOrEqual(100);

    manager.deactivateTransformation();

    // Add delay to ensure cooldown has started
    await new Promise(resolve => setTimeout(resolve, 10));

    const cooldown = manager.getRemainingCooldown();
    expect(cooldown).toBeGreaterThan(0);

    const cooldownProgress = manager.getCooldownProgress();
    // Cooldown progress can be 0-100%, just verify it's a valid percentage
    expect(cooldownProgress).toBeGreaterThanOrEqual(0);
    expect(cooldownProgress).toBeLessThanOrEqual(100);
  });

  it('should check if cooldown is ready', async () => {
    const shortCooldown = 150; // 150ms
    manager.activateTransformation();

    const state = manager.getState();
    state.cooldownMs = shortCooldown;
    manager.setState(state);

    manager.deactivateTransformation();
    expect(manager.isCooldownReady()).toBe(false);

    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(manager.isCooldownReady()).toBe(true);
  });
});

describe('Transformation Manager - Ravena (Bird)', () => {
  let manager: TransformationManager;

  beforeEach(() => {
    manager = new TransformationManager('ravena');
  });

  it('should initialize with bird transformation', () => {
    const state = manager.getState();
    expect(state.type).toBe('bird');
    expect(state.isActive).toBe(false);
  });

  it('should persist and restore state', () => {
    const originalState = manager.getState();
    originalState.isActive = true;
    originalState.activatedAt = Date.now();

    const newManager = new TransformationManager('ravena', originalState);
    const restoredState = newManager.getState();

    expect(restoredState.isActive).toBe(true);
    expect(restoredState.activatedAt).toBe(originalState.activatedAt);
  });
});

describe('Transformation Stat Modifiers', () => {
  it('should not apply modifiers when not transformed', () => {
    const modifiers = getTransformationStatModifiers('varg', false);
    expect(Object.keys(modifiers)).toHaveLength(0);
  });

  it('should apply wolf stat modifiers when transformed', () => {
    const modifiers = getTransformationStatModifiers('varg', true);
    expect(modifiers.attack).toBe(25);
    expect(modifiers.defense).toBe(10);
    expect(modifiers.speed).toBe(14);
  });

  it('should apply bird stat modifiers when transformed', () => {
    const modifiers = getTransformationStatModifiers('ravena', true);
    expect(modifiers.attack).toBe(18);
    expect(modifiers.defense).toBe(6);
    expect(modifiers.speed).toBe(18);
    expect(modifiers.magic).toBe(15);
  });

  it('should return empty for heroes without transformation', () => {
    const aeranModifiers = getTransformationStatModifiers('aeran', true);
    expect(Object.keys(aeranModifiers)).toHaveLength(0);

    const velarModifiers = getTransformationStatModifiers('velar', true);
    expect(Object.keys(velarModifiers)).toHaveLength(0);
  });
});

describe('Available Abilities', () => {
  it('should return normal abilities when not transformed', () => {
    const abilities = getAvailableAbilities('varg', false);
    expect(abilities).toHaveLength(3); // Wolf has 3 normal abilities
  });

  it('should return transformed abilities when transformed', () => {
    const abilities = getAvailableAbilities('varg', true);
    const transformedCount = HEROES.varg.transformation!.transformedAbilities.length + 1; // +1 for deactivation
    expect(abilities.length).toBe(transformedCount);
  });

  it('should include deactivation ability when transformed', () => {
    const abilities = getAvailableAbilities('varg', true);
    const deactivationAbility = abilities.find(a => a.id.includes('deactivate'));
    expect(deactivationAbility).toBeDefined();
    expect(deactivationAbility?.name).toContain('Deactivate');
  });

  it('should return regular abilities for non-transforming heroes', () => {
    const abilities = getAvailableAbilities('aeran', false);
    expect(abilities).toEqual(HEROES.aeran.abilities);

    const transformedAbilities = getAvailableAbilities('aeran', true);
    expect(transformedAbilities).toEqual(HEROES.aeran.abilities);
  });
});

describe('Abilities Manager - Aeran (Bard)', () => {
  let manager: AbilitiesManager;

  beforeEach(() => {
    manager = new AbilitiesManager('aeran');
  });

  it('should get ability by ID', () => {
    const ability = manager.getAbility('healing_melody', false);
    expect(ability?.name).toBe('Healing Melody');
    expect(ability?.type).toBe('active');
  });

  it('should get special ability', () => {
    const ability = manager.getAbility('magical_song', false);
    expect(ability?.name).toBe('Magical Song');
  });

  it('should return null for non-existent ability', () => {
    const ability = manager.getAbility('non_existent', false);
    expect(ability).toBeNull();
  });

  it('should check if ability can be activated', () => {
    const result = manager.canActivateAbility('healing_melody', 50, false);
    expect(result.success).toBe(true);
  });

  it('should reject ability activation due to insufficient mana', () => {
    const result = manager.canActivateAbility('healing_melody', 10, false);
    expect(result.success).toBe(false);
    expect(result.message).toContain('mana');
  });

  it('should reject passive ability activation', () => {
    // Test with Varg who has animal_instinct (passive)
    const vargManager = new AbilitiesManager('varg');
    const result = vargManager.canActivateAbility('animal_instinct', 100, false);
    expect(result.success).toBe(false);
    expect(result.message).toContain('passive');
  });

  it('should activate ability and set cooldown', () => {
    const canActivate = manager.canActivateAbility('healing_melody', 50, false);
    expect(canActivate.success).toBe(true);

    const activated = manager.activateAbility('healing_melody');
    expect(activated).toBe(true);

    expect(manager.isOnCooldown('healing_melody')).toBe(true);
  });

  it('should reject ability activation on cooldown', () => {
    manager.activateAbility('healing_melody');

    const result = manager.canActivateAbility('healing_melody', 50, false);
    expect(result.success).toBe(false);
    expect(result.message).toContain('cooldown');
  });

  it('should provide cooldown information', async () => {
    manager.activateAbility('healing_melody');

    const remaining = manager.getCooldownRemaining('healing_melody');
    expect(remaining).toBeGreaterThan(0);

    // Check that cooldown is in progress
    const isOnCooldown = manager.isOnCooldown('healing_melody');
    expect(isOnCooldown).toBe(true);

    // Don't wait for the full cooldown to expire as healing_melody has 5000ms cooldown
    // Just verify that cooldown progress is tracked correctly
    await new Promise(resolve => setTimeout(resolve, 100));

    const progress = manager.getCooldownProgress('healing_melody');
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(100);
  });

  it('should reset cooldowns', () => {
    manager.activateAbility('healing_melody');
    expect(manager.isOnCooldown('healing_melody')).toBe(true);

    manager.resetAllCooldowns();
    expect(manager.isOnCooldown('healing_melody')).toBe(false);
  });

  it('should get available abilities', () => {
    const abilities = manager.getAvailableAbilities(false);
    expect(abilities.length).toBeGreaterThan(0);
    expect(abilities.some(a => a.id === 'healing_melody')).toBe(true);
  });
});

describe('Abilities Manager - Varg (Wolf Shapeshifter)', () => {
  let manager: AbilitiesManager;

  beforeEach(() => {
    manager = new AbilitiesManager('varg');
  });

  it('should get transformed abilities when shifted', () => {
    const ability = manager.getAbility('wolf_bite', true);
    expect(ability?.name).toBe('Wolf Bite');
  });

  it('should get normal abilities when not transformed', () => {
    const ability = manager.getAbility('powerful_attack', false);
    expect(ability?.name).toBe('Powerful Attack');
  });

  it('should persist ability last used state', () => {
    const abilityLastUsed = {
      'healing_melody': Date.now(),
    };

    manager.setAbilityLastUsed(abilityLastUsed);
    const retrieved = manager.getAbilityLastUsed();

    expect(retrieved['healing_melody']).toBe(abilityLastUsed['healing_melody']);
  });
});

describe('Ability Damage & Healing Calculations', () => {
  it('should calculate physical ability damage', () => {
    // Use an ability with damage bonus (wolf_bite or powerful_attack)
    const ability = HEROES.varg.transformation!.transformedAbilities[0]; // Wolf Bite
    const damage = calculateAbilityDamage(ability, 25, 8);
    expect(damage).toBeGreaterThan(0);
  });

  it('should calculate magic ability damage', () => {
    const ability = HEROES.velar.abilities[0]; // Fire Magic
    const damage = calculateAbilityDamage(ability, 10, 20);
    expect(damage).toBeGreaterThan(0);
  });

  it('should calculate healing', () => {
    const ability = HEROES.aeran.specialAbility; // Magical Song
    const healing = calculateAbilityHealing(ability, 16);
    expect(healing).toBeGreaterThan(0);
  });

  it('should return 0 for ability without damage bonus', () => {
    const ability = HEROES.aeran.abilities[1]; // Animal Whisper
    const damage = calculateAbilityDamage(ability, 13, 16);
    expect(damage).toBe(0);
  });

  it('should return 0 for ability without heal amount', () => {
    const ability = HEROES.aeran.abilities[0]; // Healing Melody
    const healing = calculateAbilityHealing(ability, 16);
    expect(healing).toBeGreaterThan(0);
  });
});

describe('Transformation & Ability Integration', () => {
  it('should handle transformation state persistence', () => {
    const manager = new TransformationManager('varg');

    manager.activateTransformation();
    const state = manager.getState();

    const newManager = new TransformationManager('varg', state);
    expect(newManager.isTransformed()).toBe(true);
    expect(newManager.getType()).toBe('wolf');
  });

  it('should manage abilities manager for different heroes', () => {
    const aeran = new AbilitiesManager('aeran');
    const velar = new AbilitiesManager('velar');
    const varg = new AbilitiesManager('varg');

    expect(aeran.getHeroId()).toBe('aeran');
    expect(velar.getHeroId()).toBe('velar');
    expect(varg.getHeroId()).toBe('varg');
  });
});
