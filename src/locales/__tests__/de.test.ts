/**
 * Localization System - Unit Tests
 * Validates getText() function, key derivation, and parameter substitution
 */

import { describe, it, expect } from 'vitest';
import { getText, getAllTextKeys, hasTextKey, getTextWithFallback, de } from '../index';

describe('Localization System - getText()', () => {
  // ============================================================================
  // Test: Key Resolution
  // ============================================================================
  describe('Key Resolution', () => {
    it('should resolve simple top-level keys', () => {
      expect(getText('common.continue')).toBe('Weiter');
      expect(getText('common.cancel')).toBe('Abbrechen');
    });

    it('should resolve nested keys', () => {
      expect(getText('startScreen.title')).toBe('Adventure Game');
      expect(getText('startScreen.subtitle')).toBe('Deine Welt. Dein Abenteuer.');
      expect(getText('startScreen.buttonStart')).toBe('Neues Abenteuer');
    });

    it('should resolve hero names', () => {
      expect(getText('heroes.aeran.name')).toBe('Aeran');
      expect(getText('heroes.velar.name')).toBe('Velar');
      expect(getText('heroes.varg.name')).toBe('Varg');
      expect(getText('heroes.ravena.name')).toBe('Ravena');
      expect(getText('heroes.saira.name')).toBe('Saira');
    });

    it('should resolve hero abilities', () => {
      expect(getText('heroes.aeran.abilities.healingMelody.name')).toBe('Heilende Melodie');
      expect(getText('heroes.velar.abilities.fireMagic.name')).toBe('Feuermagie');
      expect(getText('heroes.varg.abilities.wolfForm.name')).toBe('Wolfsgestalt');
      expect(getText('heroes.ravena.abilities.windMagic.name')).toBe('Windmagie');
      expect(getText('heroes.saira.abilities.shadowClone.name')).toBe('Schattendoppelgänger');
    });

    it('should resolve special abilities', () => {
      expect(getText('heroes.aeran.specialAbility.name')).toBe('Magisches Lied');
      expect(getText('heroes.varg.specialAbility.name')).toBe('Wolfsverwandlung');
      expect(getText('heroes.ravena.specialAbility.name')).toBe('Greifvogelverwandlung');
      expect(getText('heroes.saira.specialAbility.name')).toBe('Schattenbeherrschung');
    });

    it('should resolve intro scene dialogue', () => {
      expect(getText('intro.tower.title')).toBe('Der Turm des letzten Magiers');
      expect(getText('intro.tower.magician.line1')).toContain('Aeran');
      expect(getText('intro.tower.aeran.line')).toContain('Stimme');
    });

    it('should resolve campaign information', () => {
      expect(getText('campaigns.firstLight.title')).toBe('Das Schwert des Ersten Lichts');
      expect(getText('campaigns.firstLight.chapters.chapter1.title')).toContain('Kapitel 1');
    });
  });

  // ============================================================================
  // Test: Parameter Substitution
  // ============================================================================
  describe('Parameter Substitution', () => {
    it('should substitute single parameters', () => {
      const result = getText('rewards.gold', { amount: 50 });
      expect(result).toBe('Goldmünzen: 50');
    });

    it('should substitute multiple parameters', () => {
      const result = getText('combat.feedback.hit', {
        attacker: 'Varg',
        target: 'Gegner'
      });
      expect(result).toBe('Varg trifft Gegner!');
    });

    it('should handle parameter values of different types', () => {
      expect(getText('rewards.gold', { amount: 123 })).toBe('Goldmünzen: 123');
      expect(getText('rewards.gold', { amount: '99' })).toBe('Goldmünzen: 99');
      expect(getText('rewards.gold', { amount: 0 })).toBe('Goldmünzen: 0');
    });

    it('should ignore missing parameters', () => {
      const result = getText('combat.feedback.hit', { attacker: 'Velar' });
      expect(result).toContain('Velar');
      expect(result).toContain('{target}'); // Not substituted
    });

    it('should handle empty params object', () => {
      const result = getText('common.continue', {});
      expect(result).toBe('Weiter');
    });
  });

  // ============================================================================
  // Test: Type Safety (Compile-Time Protection)
  // ============================================================================
  describe('Type Safety', () => {
    // Note: TypeScript enforces TextKey type at compile-time. Invalid keys
    // are caught by the TypeScript compiler before runtime (TS2345 error).
    // No runtime error handling tests are needed since the type system prevents
    // invalid keys from being called.
    
    it('should only accept valid TextKey values at compile-time', () => {
      // Valid keys work fine
      expect(getText('common.continue')).toBe('Weiter');
      expect(getText('startScreen.title')).toBe('Adventure Game');
      expect(getText('heroes.aeran.name')).toBe('Aeran');
      // Invalid keys like getText('nonexistent.key') would cause TypeScript
      // error TS2345 and fail to compile. No runtime test needed.
    });
  });

  // ============================================================================
  // Test: Text Validation
  // ============================================================================
  describe('Text Validation', () => {
    it('should not contain hardcoded English UI words in German text', () => {
      // Verify that we can access all keys without errors
      const allKeys = getAllTextKeys();
      expect(allKeys.size).toBeGreaterThan(0);
      
      // Sample check: verify StartScreen is in German
      for (const key of allKeys) {
        if (key.startsWith('startScreen')) {
          const text = getText(key);
          expect(text).not.toEqual(''); // All texts should be non-empty
          expect(text).not.toMatch(/^Start Adventure/); // Not in English
        }
      }
    });

    it('should have non-empty strings for all keys', () => {
      const allKeys = getAllTextKeys();
      for (const key of allKeys) {
        const text = getText(key);
        expect(text).toBeTruthy();
        expect(text.length).toBeGreaterThan(0);
        expect(text).not.toMatch(/^\[/); // Not a fallback
      }
    });
  });

  // ============================================================================
  // Test: Key Enumeration & Validation Functions
  // ============================================================================
  describe('Key Enumeration & Validation', () => {
    it('getAllTextKeys() should return all keys as strings', () => {
      const keys = getAllTextKeys();
      expect(keys.size).toBeGreaterThan(0);
      for (const key of keys) {
        expect(typeof key).toBe('string');
        expect(key.includes('.')).toBe(true); // At least one nesting level
      }
    });

    it('getAllTextKeys() should include common keys', () => {
      const keys = getAllTextKeys();
      expect(keys.has('common.continue')).toBe(true);
      expect(keys.has('startScreen.title')).toBe(true);
      expect(keys.has('heroes.aeran.name')).toBe(true);
    });

    it('hasTextKey() should return true for valid keys', () => {
      expect(hasTextKey('common.continue')).toBe(true);
      expect(hasTextKey('startScreen.title')).toBe(true);
      expect(hasTextKey('heroes.saira.name')).toBe(true);
    });

    it('hasTextKey() should return false for invalid keys', () => {
      expect(hasTextKey('nonexistent.key')).toBe(false);
      expect(hasTextKey('common.invalidField')).toBe(false);
      expect(hasTextKey('')).toBe(false);
    });
  });

  // ============================================================================
  // Test: Fallback Functions
  // ============================================================================
  describe('getTextWithFallback()', () => {
    it('should return the text if key exists', () => {
      const result = getTextWithFallback('common.continue');
      expect(result).toBe('Weiter');
    });

    it('should return fallback if key does not exist', () => {
      const result = getTextWithFallback(
        'nonexistent.key',
        'Fallback Text'
      );
      expect(result).toBe('Fallback Text');
    });

    it('should return [key] if key missing and no fallback provided', () => {
      const result = getTextWithFallback('nonexistent.key');
      expect(result).toBe('[nonexistent.key]');
    });

    it('should support parameters even with fallback', () => {
      const result = getTextWithFallback(
        'rewards.gold',
        'No reward',
        { amount: 100 }
      );
      expect(result).toBe('Goldmünzen: 100');
    });
  });

  // ============================================================================
  // Test: All Heroes Structure
  // ============================================================================
  describe('Heroes Data Structure', () => {
    const heroNames = ['aeran', 'velar', 'varg', 'ravena', 'saira'] as const;

    it('should have all five heroes defined', () => {
      for (const heroName of heroNames) {
        expect(hasTextKey(`heroes.${heroName}.name`)).toBe(true);
        expect(hasTextKey(`heroes.${heroName}.title`)).toBe(true);
        expect(hasTextKey(`heroes.${heroName}.class`)).toBe(true);
      }
    });

    it('should have hero descriptions', () => {
      for (const heroName of heroNames) {
        const key = `heroes.${heroName}.description`;
        expect(hasTextKey(key)).toBe(true);
        const text = getText(key);
        expect(text.length).toBeGreaterThan(20); // Descriptions should be detailed
      }
    });

    it('should have hero abilities', () => {
      // Check that at least some abilities exist for each hero
      const heroNames = ['aeran', 'velar', 'varg', 'ravena', 'saira'] as const;
      
      for (const heroName of heroNames) {
        // Aeran has healing melody
        if (heroName === 'aeran') {
          expect(hasTextKey(`heroes.${heroName}.abilities.healingMelody.name`)).toBe(true);
        }
        // Velar has fire magic
        if (heroName === 'velar') {
          expect(hasTextKey(`heroes.${heroName}.abilities.fireMagic.name`)).toBe(true);
        }
        // Varg has wolf form
        if (heroName === 'varg') {
          expect(hasTextKey(`heroes.${heroName}.abilities.wolfForm.name`)).toBe(true);
        }
        // Ravena has wind magic
        if (heroName === 'ravena') {
          expect(hasTextKey(`heroes.${heroName}.abilities.windMagic.name`)).toBe(true);
        }
        // Saira has shadow clone
        if (heroName === 'saira') {
          expect(hasTextKey(`heroes.${heroName}.abilities.shadowClone.name`)).toBe(true);
        }
      }
    });

    it('should have hero special abilities', () => {
      const heroNames = ['aeran', 'velar', 'varg', 'ravena', 'saira'] as const;
      
      for (const heroName of heroNames) {
        expect(hasTextKey(`heroes.${heroName}.specialAbility.name`)).toBe(true);
        expect(hasTextKey(`heroes.${heroName}.specialAbility.description`)).toBe(true);
      }
    });

    it('should have stat labels for character display', () => {
      expect(hasTextKey('statLabels.health')).toBe(true);
      expect(hasTextKey('statLabels.mana')).toBe(true);
      expect(hasTextKey('statLabels.attack')).toBe(true);
      expect(hasTextKey('statLabels.defense')).toBe(true);
      expect(hasTextKey('statLabels.magic')).toBe(true);
      expect(hasTextKey('statLabels.speed')).toBe(true);
    });
  });

  // ============================================================================
  // Test: StartScreen Content (Phase 1 Implementation)
  // ============================================================================
  describe('StartScreen Localization', () => {
    it('should have all required StartScreen texts', () => {
      expect(getText('startScreen.title')).toBe('Adventure Game');
      expect(getText('startScreen.subtitle')).toBe('Deine Welt. Dein Abenteuer.');
      expect(getText('startScreen.buttonStart')).toBe('Neues Abenteuer');
      expect(getText('startScreen.buttonContinue')).toBe('Abenteuer fortsetzen');
      expect(getText('startScreen.buttonLoadGame')).toBe('Spielstand laden');
      expect(getText('startScreen.welcomeMessage')).toBe('Willkommen, Abenteurer!');
      expect(getText('startScreen.description')).toContain('Erkunde');
    });

    it('should not have English UI words on StartScreen', () => {
      const startScreenTexts = [
        getText('startScreen.title'),
        getText('startScreen.subtitle'),
        getText('startScreen.buttonStart'),
        getText('startScreen.buttonContinue'),
        getText('startScreen.buttonLoadGame'),
      ];

      const englishPatterns = [
        /Welcome/i,
        /Start Adventure/i,
        /Click/i,
      ];

      for (const text of startScreenTexts) {
        for (const pattern of englishPatterns) {
          expect(text).not.toMatch(pattern);
        }
      }
    });
  });

  // ============================================================================
  // Test: Raw German Object
  // ============================================================================
  describe('Raw German Object (de)', () => {
    it('should export the de object directly', () => {
      expect(de).toBeDefined();
      expect(typeof de).toBe('object');
    });

    it('should have all expected categories', () => {
      const expectedCategories = [
        'common',
        'startScreen',
        'characterSelection',
        'heroes',
        'intro',
        'campaigns',
        'quests',
        'combat',
        'inventory',
        'items',
        'abilities',
        'transformations',
        'rewards',
        'notifications',
        'errors',
        'settings',
        'safety',
        'accessibility',
      ];

      for (const category of expectedCategories) {
        expect(de).toHaveProperty(category);
      }
    });
  });
});
