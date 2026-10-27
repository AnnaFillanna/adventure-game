/**
 * Adventure Game - Transformation Manager
 * Handles character transformations (Varg: Wolf, Ravena: Bird)
 */

import type { TransformationState, TransformationType } from './types';
import { getHeroDefinition } from './heroDefinitions';
import type { HeroId } from './types';

// ============================================================================
// TRANSFORMATION MANAGER
// ============================================================================

export class TransformationManager {
  private transformationState: TransformationState;

  constructor(heroId: HeroId, initialState?: TransformationState) {
    const heroDefinition = getHeroDefinition(heroId);
    const transformationType = heroDefinition.transformation?.type || 'none';
    const duration = heroDefinition.transformation?.durationMs || 0;
    const cooldown = heroDefinition.transformation?.cooldownMs || 0;

    this.transformationState = initialState || {
      type: transformationType,
      isActive: false,
      activatedAt: 0,
      durationMs: duration,
      cooldownMs: cooldown,
      lastCooldownEnd: 0,
    };
  }

  /**
   * Activate transformation (if cooldown is ready)
   */
  activateTransformation(): boolean {
    const now = Date.now();
    
    // Check if transformation is available
    if (!this.canTransform()) {
      return false;
    }

    // Check if already transformed
    if (this.transformationState.isActive) {
      return false;
    }

    // Activate transformation
    this.transformationState.isActive = true;
    this.transformationState.activatedAt = now;

    return true;
  }

  /**
   * Deactivate transformation and start cooldown
   */
  deactivateTransformation(): void {
    const now = Date.now();
    this.transformationState.isActive = false;
    this.transformationState.lastCooldownEnd = now + this.transformationState.cooldownMs;
  }

  /**
   * Check if transformation duration has expired
   */
  updateTransformationDuration(): boolean {
    if (!this.transformationState.isActive) {
      return false;
    }

    const now = Date.now();
    const elapsed = now - this.transformationState.activatedAt;

    if (elapsed >= this.transformationState.durationMs) {
      this.deactivateTransformation();
      return true; // Duration expired
    }

    return false;
  }

  /**
   * Check if cooldown is ready
   */
  isCooldownReady(): boolean {
    const now = Date.now();
    return now >= this.transformationState.lastCooldownEnd;
  }

  /**
   * Check if transformation can be activated
   */
  canTransform(): boolean {
    // Only Varg (wolf) and Ravena (bird) can transform
    if (this.transformationState.type === 'none') {
      return false;
    }

    // Can't transform if already transformed
    if (this.transformationState.isActive) {
      return false;
    }

    // Check cooldown
    return this.isCooldownReady();
  }

  /**
   * Get remaining duration in milliseconds
   */
  getRemainingDuration(): number {
    if (!this.transformationState.isActive) {
      return 0;
    }

    const now = Date.now();
    const elapsed = now - this.transformationState.activatedAt;
    const remaining = this.transformationState.durationMs - elapsed;

    return Math.max(0, remaining);
  }

  /**
   * Get remaining cooldown in milliseconds
   */
  getRemainingCooldown(): number {
    if (this.isCooldownReady()) {
      return 0;
    }

    const now = Date.now();
    const remaining = this.transformationState.lastCooldownEnd - now;

    return Math.max(0, remaining);
  }

  /**
   * Get current transformation state
   */
  getState(): TransformationState {
    return { ...this.transformationState };
  }

  /**
   * Set transformation state (for loading from storage)
   */
  setState(state: TransformationState): void {
    this.transformationState = { ...state };
  }

  /**
   * Get transformation type
   */
  getType(): TransformationType {
    return this.transformationState.type;
  }

  /**
   * Check if currently transformed
   */
  isTransformed(): boolean {
    return this.transformationState.isActive;
  }

  /**
   * Get percentage of transformation duration used (0-100)
   */
  getDurationProgress(): number {
    if (!this.transformationState.isActive) {
      return 0;
    }

    const now = Date.now();
    const elapsed = now - this.transformationState.activatedAt;
    const progress = (elapsed / this.transformationState.durationMs) * 100;

    return Math.min(100, progress);
  }

  /**
   * Get percentage of cooldown used (0-100)
   */
  getCooldownProgress(): number {
    if (this.isCooldownReady()) {
      return 100;
    }

    const now = Date.now();
    const elapsed = now - (this.transformationState.lastCooldownEnd - this.transformationState.cooldownMs);
    const progress = (elapsed / this.transformationState.cooldownMs) * 100;

    return Math.min(100, progress);
  }
}

/**
 * Get transformation stat modifiers
 */
export function getTransformationStatModifiers(
  heroId: HeroId,
  isTransformed: boolean,
): Record<string, number> {
  if (!isTransformed) {
    return {};
  }

  const hero = getHeroDefinition(heroId);
  if (!hero.transformation) {
    return {};
  }

  return {
    attack: hero.transformation.transformedStats.attack,
    defense: hero.transformation.transformedStats.defense,
    speed: hero.transformation.transformedStats.speed,
    ...(hero.transformation.transformedStats.magic && {
      magic: hero.transformation.transformedStats.magic,
    }),
  };
}

/**
 * Get available abilities based on transformation state
 */
export function getAvailableAbilities(
  heroId: HeroId,
  isTransformed: boolean,
) {
  const hero = getHeroDefinition(heroId);

  if (isTransformed && hero.transformation) {
    return [
      ...hero.transformation.transformedAbilities,
      {
        id: `deactivate_transformation_${hero.transformation.type}`,
        name: `Deactivate ${hero.transformation.type === 'wolf' ? 'Wolf' : 'Bird'} Form`,
        description: `Return to your normal form`,
        type: 'active' as const,
        cooldownMs: 0,
        manaCost: 0,
        icon: '🔄',
      },
    ];
  }

  return hero.abilities;
}
