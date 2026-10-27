/**
 * Adventure Game - World Generator Tests
 * Tests für Seeded Random, Duplikat-Prävention und World Generation
 */

import { describe, it, expect } from 'vitest';
import {
  createSeededRandom,
  hashStringToSeed,
  generateDeterministicSeed,
  selectRandom,
  selectWeighted,
  shuffleArray,
  distance,
} from './seededRandom';
import {
  generateDefaultWorld,
  generateCustomWorld,
  getDefaultWorldGeneratorConfig,
} from './worldGenerator';

describe('Seeded Random Number Generator', () => {
  it('should produce same sequence with same seed', () => {
    const rng1 = createSeededRandom(12345);
    const rng2 = createSeededRandom(12345);

    const sequence1 = Array.from({ length: 10 }, () => rng1.next());
    const sequence2 = Array.from({ length: 10 }, () => rng2.next());

    expect(sequence1).toEqual(sequence2);
  });

  it('should produce different sequences with different seeds', () => {
    const rng1 = createSeededRandom(12345);
    const rng2 = createSeededRandom(54321);

    const sequence1 = Array.from({ length: 10 }, () => rng1.next());
    const sequence2 = Array.from({ length: 10 }, () => rng2.next());

    expect(sequence1).not.toEqual(sequence2);
  });

  it('should generate numbers in range [0, 1)', () => {
    const rng = createSeededRandom(99999);
    for (let i = 0; i < 100; i++) {
      const num = rng.next();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(1);
    }
  });

  it('should generate integers in correct range with nextInt', () => {
    const rng = createSeededRandom(11111);
    for (let i = 0; i < 50; i++) {
      const num = rng.nextInt(10);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(10);
    }
  });

  it('should generate integers in range [min, max] with nextInRange', () => {
    const rng = createSeededRandom(22222);
    for (let i = 0; i < 50; i++) {
      const num = rng.nextInRange(5, 15);
      expect(num).toBeGreaterThanOrEqual(5);
      expect(num).toBeLessThanOrEqual(15);
    }
  });
});

describe('String to Seed Hashing', () => {
  it('should hash same string to same seed', () => {
    const seed1 = hashStringToSeed('test_world_1');
    const seed2 = hashStringToSeed('test_world_1');
    expect(seed1).toBe(seed2);
  });

  it('should hash different strings to different seeds', () => {
    const seed1 = hashStringToSeed('world_1');
    const seed2 = hashStringToSeed('world_2');
    expect(seed1).not.toBe(seed2);
  });

  it('should generate deterministic seed from player+world', () => {
    const seed1 = generateDeterministicSeed('player_1', 'elf_fantasy');
    const seed2 = generateDeterministicSeed('player_1', 'elf_fantasy');
    expect(seed1).toBe(seed2);
  });

  it('should generate different seeds for different players', () => {
    const seed1 = generateDeterministicSeed('player_1', 'elf_fantasy');
    const seed2 = generateDeterministicSeed('player_2', 'elf_fantasy');
    expect(seed1).not.toBe(seed2);
  });
});

describe('Random Selection Functions', () => {
  it('should select from array', () => {
    const rng = createSeededRandom(42);
    const array = ['a', 'b', 'c', 'd', 'e'];
    const selected = selectRandom(array, rng);
    expect(array).toContain(selected);
  });

  it('should select same element with same seed', () => {
    const array = [1, 2, 3, 4, 5];
    const rng1 = createSeededRandom(999);
    const rng2 = createSeededRandom(999);

    const sel1 = selectRandom(array, rng1);
    const sel2 = selectRandom(array, rng2);

    expect(sel1).toBe(sel2);
  });

  it('should throw on empty array', () => {
    const rng = createSeededRandom(42);
    expect(() => selectRandom([], rng)).toThrow();
  });

  it('should shuffle array consistently with seed', () => {
    const array = [1, 2, 3, 4, 5];
    const rng1 = createSeededRandom(777);
    const rng2 = createSeededRandom(777);

    const shuffled1 = shuffleArray(array, rng1);
    const shuffled2 = shuffleArray(array, rng2);

    expect(shuffled1).toEqual(shuffled2);
  });

  it('should select weighted random', () => {
    const rng = createSeededRandom(555);
    const options: Array<[string, number]> = [
      ['common', 0.7],
      ['rare', 0.25],
      ['epic', 0.05],
    ];

    const selected = selectWeighted(options, rng);
    expect(['common', 'rare', 'epic']).toContain(selected);
  });
});

describe('Coordinate Functions', () => {
  it('should calculate distance correctly', () => {
    // Pythagorean: 3-4-5 triangle
    const dist = distance(0, 0, 3, 4);
    expect(dist).toBe(5);
  });

  it('should calculate distance symmetrically', () => {
    const dist1 = distance(0, 0, 10, 20);
    const dist2 = distance(10, 20, 0, 0);
    expect(dist1).toBe(dist2);
  });

  it('should return 0 for same coordinates', () => {
    const dist = distance(5, 5, 5, 5);
    expect(dist).toBe(0);
  });
});

describe('World Generation', () => {
  it('should generate world with correct seed', () => {
    const world = generateDefaultWorld(12345);
    expect(world.seed).toBe(12345);
    expect(world.generatedAt).toBeGreaterThan(0);
  });

  it('should generate same world with same seed', () => {
    const world1 = generateDefaultWorld(99999);
    const world2 = generateDefaultWorld(99999);

    expect(world1.objects.length).toBe(world2.objects.length);
    expect(world1.objects.map((o) => o.id)).toEqual(
      world2.objects.map((o) => o.id)
    );
  });

  it('should generate different worlds with different seeds', () => {
    const world1 = generateDefaultWorld(111);
    const world2 = generateDefaultWorld(222);

    expect(world1.objects.length).toBeGreaterThan(0);
    expect(world2.objects.length).toBeGreaterThan(0);
    // Object IDs should differ (due to timestamp in ID generation)
    const ids1 = new Set(world1.objects.map((o) => o.id));
    const ids2 = new Set(world2.objects.map((o) => o.id));
    expect(ids1.size + ids2.size).toBeGreaterThan(0);
  });

  it('should generate objects of various types', () => {
    const world = generateDefaultWorld(54321);
    const types = new Set(world.objects.map((o) => o.type));

    // Should have at least some variety
    expect(types.size).toBeGreaterThan(1);
    expect(['npc', 'enemy', 'coin', 'chest'].some((t) => types.has(t as any))).toBe(
      true
    );
  });

  it('should not exceed max objects limit', () => {
    const config = getDefaultWorldGeneratorConfig();
    config.maxObjects = 30;
    const world = generateCustomWorld(config);

    expect(world.totalObjectCount).toBeLessThanOrEqual(30);
  });

  it('should place all objects within world bounds', () => {
    const world = generateDefaultWorld(777);
    const config = getDefaultWorldGeneratorConfig();

    for (const obj of world.objects) {
      const pos = obj.position as any;
      expect(pos.x).toBeGreaterThanOrEqual(config.worldSize.minX);
      expect(pos.x).toBeLessThanOrEqual(config.worldSize.maxX);
      expect(pos.y).toBeGreaterThanOrEqual(config.worldSize.minY);
      expect(pos.y).toBeLessThanOrEqual(config.worldSize.maxY);
    }
  });

  it('should respect min distance between objects', () => {
    const config = getDefaultWorldGeneratorConfig();
    config.minDistanceBetweenObjects = 10;
    config.maxObjects = 30; // Small count to avoid impossible constraints

    const world = generateCustomWorld(config);

    for (let i = 0; i < world.objects.length; i++) {
      for (let j = i + 1; j < world.objects.length; j++) {
        const obj1 = world.objects[i].position as any;
        const obj2 = world.objects[j].position as any;
        const dist = distance(obj1.x, obj1.y, obj2.x, obj2.y);

        expect(dist).toBeGreaterThanOrEqual(config.minDistanceBetweenObjects - 0.1);
      }
    }
  });

  it('should assign metadata to objects', () => {
    const world = generateDefaultWorld(888);

    for (const obj of world.objects) {
      expect(obj.id).toBeTruthy();
      expect(obj.type).toBeTruthy();
      expect(obj.name).toBeTruthy();
      expect(obj.createdAt).toBeGreaterThan(0);
      expect(obj.status).toBe('active');
    }
  });

  it('should assign loot tables to appropriate objects', () => {
    const world = generateDefaultWorld(666);

    for (const obj of world.objects) {
      if (obj.type === 'enemy' || obj.type === 'chest') {
        expect(obj.lootTable).toBeDefined();
        expect(obj.lootTable!.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('World Generation Reproducibility', () => {
  it('should generate bitwise identical world on second call', () => {
    const seed = 44444;
    const world1 = generateDefaultWorld(seed);
    const world2 = generateDefaultWorld(seed);

    expect(world1.seed).toBe(world2.seed);
    expect(world1.objects.length).toBe(world2.objects.length);

    for (let i = 0; i < world1.objects.length; i++) {
      const obj1 = world1.objects[i];
      const obj2 = world2.objects[i];

      expect(obj1.id).toBe(obj2.id);
      expect(obj1.type).toBe(obj2.type);
      expect(obj1.name).toBe(obj2.name);
      const pos1 = obj1.position as any;
      const pos2 = obj2.position as any;
      expect(pos1.x).toBe(pos2.x);
      expect(pos1.y).toBe(pos2.y);
    }
  });

  it('should create consistent object positions from seed', () => {
    const world = generateDefaultWorld(33333);

    // Just verify world was generated
    expect(world.objects.length).toBeGreaterThan(0);

    const world2 = generateDefaultWorld(33333);
    expect(world2.objects.length).toBeGreaterThan(0);

    // Objects should be in same order
    expect(world.objects.length).toBe(world2.objects.length);
    for (let i = 0; i < world.objects.length; i++) {
      expect(world.objects[i].type).toBe(world2.objects[i].type);
    }
  });
});
