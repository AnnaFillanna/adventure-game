/**
 * Adventure Game - Abilities Manager
 * Handles ability activation, cooldowns, and effects
 */

import type { HeroAbility, HeroId } from './types';
import { getHeroDefinition } from './heroDefinitions';
import { getAvailableAbilities } from './transformationManager';

// ============================================================================
// ABILITIES MANAGER
// ============================================================================

export interface AbilityActivationResult {
  success: boolean;
  message: string;
  cooldownRemainingMs?: number;
  manaCostRequired?: number;
  currentMana?: number;
}

export class AbilitiesManager {
  private abilityLastUsed: Record<string, number> = {};
  private heroId: HeroId;
  private isTransformed: boolean = false;

  constructor(heroId: HeroId, abilityLastUsed?: Record<string, number>) {
    this.heroId = heroId;
    this.abilityLastUsed = abilityLastUsed || {};
  }

  /**
   * Get ability by ID
   */
  getAbility(abilityId: string, isTransformed: boolean): HeroAbility | null {
    const hero = getHeroDefinition(this.heroId);

    // Check in regular abilities
    const regularAbility = hero.abilities.find(a => a.id === abilityId);
    if (regularAbility) {
      return regularAbility;
    }

    // Check in special ability
    if (hero.specialAbility.id === abilityId) {
      return hero.specialAbility;
    }

    // Check in transformation abilities
    if (isTransformed && hero.transformation) {
      const transformedAbility = hero.transformation.transformedAbilities.find(
        a => a.id === abilityId,
      );
      if (transformedAbility) {
        return transformedAbility;
      }
    }

    return null;
  }

  /**
   * Attempt to activate an ability
   */
  canActivateAbility(
    abilityId: string,
    currentMana: number,
    isTransformed: boolean,
  ): AbilityActivationResult {
    const ability = this.getAbility(abilityId, isTransformed);

    if (!ability) {
      return {
        success: false,
        message: 'Ability not found',
      };
    }

    // Check if ability is passive
    if (ability.type === 'passive') {
      return {
        success: false,
        message: 'Cannot activate passive ability',
      };
    }

    // Check mana cost
    if (ability.manaCost > currentMana) {
      return {
        success: false,
        message: 'Insufficient mana',
        manaCostRequired: ability.manaCost,
        currentMana,
      };
    }

    // Check cooldown
    const cooldownRemaining = this.getCooldownRemaining(abilityId);
    if (cooldownRemaining > 0) {
      return {
        success: false,
        message: 'Ability is on cooldown',
        cooldownRemainingMs: cooldownRemaining,
      };
    }

    return {
      success: true,
      message: 'Ability activated successfully',
    };
  }

  /**
   * Activate an ability and start its cooldown
   */
  activateAbility(abilityId: string): boolean {
    const ability = this.getAbility(abilityId, this.isTransformed);

    if (!ability || ability.type === 'passive') {
      return false;
    }

    const now = Date.now();
    this.abilityLastUsed[abilityId] = now + ability.cooldownMs;

    return true;
  }

  /**
   * Get cooldown remaining for an ability in milliseconds
   */
  getCooldownRemaining(abilityId: string): number {
    const lastUsedEnd = this.abilityLastUsed[abilityId];

    if (!lastUsedEnd) {
      return 0;
    }

    const now = Date.now();
    const remaining = lastUsedEnd - now;

    return Math.max(0, remaining);
  }

  /**
   * Check if ability is on cooldown
   */
  isOnCooldown(abilityId: string): boolean {
    return this.getCooldownRemaining(abilityId) > 0;
  }

  /**
   * Get cooldown progress (0-100%)
   */
  getCooldownProgress(abilityId: string): number {
    const ability = this.getAbility(abilityId, this.isTransformed);

    if (!ability) {
      return 0;
    }

    const lastUsedEnd = this.abilityLastUsed[abilityId];

    if (!lastUsedEnd) {
      return 100; // Not used yet, so fully ready (100%)
    }

    const cooldownDuration = ability.cooldownMs;
    const now = Date.now();
    const cooldownStart = lastUsedEnd - cooldownDuration;
    const elapsed = now - cooldownStart;

    const progress = (elapsed / cooldownDuration) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  /**
   * Get all available abilities for current hero state
   */
  getAvailableAbilities(isTransformed: boolean): HeroAbility[] {
    this.isTransformed = isTransformed;
    return getAvailableAbilities(this.heroId, isTransformed);
  }

  /**
   * Get ability state including cooldown info
   */
  getAbilityState(abilityId: string, isTransformed: boolean) {
    const ability = this.getAbility(abilityId, isTransformed);

    if (!ability) {
      return null;
    }

    const cooldownRemaining = this.getCooldownRemaining(abilityId);
    const cooldownProgress = this.getCooldownProgress(abilityId);

    return {
      ability,
      isOnCooldown: cooldownRemaining > 0,
      cooldownRemainingMs: cooldownRemaining,
      cooldownProgress,
      isReady: cooldownRemaining === 0,
    };
  }

  /**
   * Reset all ability cooldowns
   */
  resetAllCooldowns(): void {
    this.abilityLastUsed = {};
  }

  /**
   * Reset specific ability cooldown
   */
  resetAbilityCooldown(abilityId: string): void {
    delete this.abilityLastUsed[abilityId];
  }

  /**
   * Get ability last used timestamp
   */
  getAbilityLastUsed(): Record<string, number> {
    return { ...this.abilityLastUsed };
  }

  /**
   * Set ability last used state (for loading from storage)
   */
  setAbilityLastUsed(abilityLastUsed: Record<string, number>): void {
    this.abilityLastUsed = { ...abilityLastUsed };
  }

  /**
   * Get hero ID
   */
  getHeroId(): HeroId {
    return this.heroId;
  }
}

/**
 * Calculate ability damage with hero stats
 */
export function calculateAbilityDamage(
  ability: HeroAbility,
  heroAttack: number,
  heroMagic: number,
): number {
  if (!ability.damageBonus) {
    return 0;
  }

  // For physical abilities (high attack bonus relative to ability damage)
  if (ability.damageBonus > 30) {
    return Math.floor((heroAttack * 1.5) + ability.damageBonus);
  }

  // For magic abilities
  return Math.floor((heroMagic * 1.2) + ability.damageBonus);
}

/**
 * Calculate ability healing
 */
export function calculateAbilityHealing(
  ability: HeroAbility,
  heroMagic: number,
): number {
  if (!ability.healAmount) {
    return 0;
  }

  return Math.floor((heroMagic * 0.8) + ability.healAmount);
}
