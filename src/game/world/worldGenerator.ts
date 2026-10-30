/**
 * Adventure Game - Procedural World Generator
 * Generiert Spielobjekte (NPCs, Gegner, Items, etc.) basierend auf Seed
 * 
 * Features:
 * - Reproduzierbare Generierung (Seed-basiert)
 * - Sichere Demo-Lokationen (keine zufälligen GPS-Koordinaten)
 * - Duplikat-Prävention
 * - Konfigurierbare Spawn-Regeln
 * - Loot-Tabellen für Gegenstände
 */

import type {
  WorldObject,
  WorldObjectType,
  DemoLocation,
  WorldGeneratorConfig,
  GeneratedWorld,
  LootItem,
} from './types';
import type { Position } from '../state/types';
import {
  createSeededRandom,
  offsetPosition,
  selectRandom,
  distance,
} from './seededRandom';

// ============================================================================
// DEMO LOCATIONS - Vordefinierte sichere Spawn-Punkte
// ============================================================================

/**
 * Sichere Demo-Lokationen für Entwicklung
 * Keine zufälligen GPS-Koordinaten!
 */
export const DEMO_LOCATIONS: DemoLocation[] = [
  {
    id: 'location_central_plaza',
    name: 'Central Plaza',
    description: 'Zentral gelegener Treffpunkt in der Fantasy-Welt',
    position: { x: 50, y: 50 },
    type: 'safe_zone',
  },
  {
    id: 'location_forest_edge',
    name: 'Forest Edge',
    description: 'Am Rand des mystischen Waldes',
    position: { x: 30, y: 30 },
    type: 'quest_hub',
  },
  {
    id: 'location_ancient_ruins',
    name: 'Ancient Ruins',
    description: 'Überreste einer alten Zivilisation',
    position: { x: 70, y: 70 },
    type: 'resource_area',
  },
  {
    id: 'location_goblin_cave',
    name: 'Goblin Cave',
    description: 'Versteck der Goblins',
    position: { x: 20, y: 80 },
    type: 'event_zone',
  },
];

// ============================================================================
// DEFAULT OBJECT NAMES
// ============================================================================

const NPC_NAMES = [
  'Gandalf', 'Elara', 'Theron', 'Lirien', 'Aldor',
  'Mira', 'Kael', 'Sylvus', 'Talia', 'Eamon',
];

const ENEMY_NAMES = [
  'Goblin Scout', 'Goblin Warrior', 'Dark Knight',
  'Shadow Beast', 'Corrupted Sprite', 'Stone Golem',
];

const NPC_DIALOGUES = [
  'Hast du eine Moment zum Reden?',
  'Ich hätte gerne deine Hilfe...',
  'Willkommen, Abenteurer!',
  'Vorsicht vor den Goblins!',
  'Hast du etwas zu tauschen?',
];

// ============================================================================
// DEFAULT LOOT TABLES
// ============================================================================

const LOOT_TABLES: Record<string, LootItem[]> = {
  'loot_goblin': [
    { itemId: 'coin', probability: 0.8, quantityMin: 1, quantityMax: 3 },
    { itemId: 'torn_cloth', probability: 0.3, quantityMin: 1, quantityMax: 1 },
    { itemId: 'healing_potion', probability: 0.1, quantityMin: 1, quantityMax: 1 },
  ],
  'loot_chest': [
    { itemId: 'coin', probability: 1.0, quantityMin: 5, quantityMax: 15 },
    { itemId: 'healing_potion', probability: 0.5, quantityMin: 1, quantityMax: 2 },
    { itemId: 'magic_gem', probability: 0.2, quantityMin: 1, quantityMax: 1 },
  ],
};

// ============================================================================
// DEFAULT GENERATOR CONFIG
// ============================================================================

export function getDefaultWorldGeneratorConfig(): WorldGeneratorConfig {
  return {
    seed: 0,
    maxObjects: 50,
    objectDensity: {
      npc: 0.1,      // 10% NPCs
      enemy: 0.15,   // 15% Enemies
      coin: 0.3,     // 30% Coins
      resource: 0.15, // 15% Resources
      chest: 0.05,   // 5% Treasure Chests
      portal: 0.05,  // 5% Portals
      quest_point: 0.05, // 5% Quest Points
    },
    objectRadius: 15, // Spawn im Radius von 15 Einheiten
    lootTables: LOOT_TABLES,
    minDistanceBetweenObjects: 5,
    allowDuplicates: false,
    worldSize: {
      minX: 0,
      maxX: 100,
      minY: 0,
      maxY: 100,
    },
  };
}

// ============================================================================
// WORLD GENERATOR
// ============================================================================

/**
 * Generiert eine Spielwelt basierend auf Konfiguration und Seed
 */
export class WorldGenerator {
  private config: WorldGeneratorConfig;
  private existingPositions: Array<{ x: number; y: number }> = [];

  constructor(config: WorldGeneratorConfig) {
    this.config = config;
  }

  /**
   * Generiere World Objects
   */
  generate(): GeneratedWorld {
    const rng = createSeededRandom(this.config.seed);
    this.existingPositions = [];
    const objects: WorldObject[] = [];

    // Berechne anzahl pro Objekttyp
    const objectTypes = this.calculateObjectDistribution();

    for (const [type, count] of Object.entries(objectTypes)) {
      for (let i = 0; i < count; i++) {
        try {
          const obj = this.generateObject(
            type as WorldObjectType,
            objects.length,
            rng
          );
          if (obj) {
            objects.push(obj);
          }
        } catch (err) {
          // Silently skip if generation fails (e.g., no valid position)
          console.debug(`Failed to generate ${type} #${i}:`, err);
        }
      }
    }

    return {
      seed: this.config.seed,
      generatedAt: Date.now(),
      objects,
      totalObjectCount: objects.length,
    };
  }

  /**
   * Berechne wie viele Objekte pro Typ generiert werden
   */
  private calculateObjectDistribution(): Record<WorldObjectType, number> {
    const result: Record<WorldObjectType, number> = {
      npc: 0,
      enemy: 0,
      coin: 0,
      resource: 0,
      chest: 0,
      portal: 0,
      quest_point: 0,
    };

    const types = Object.keys(result) as WorldObjectType[];
    const maxPerType = Math.ceil(this.config.maxObjects / types.length);

    for (const type of types) {
      const density = this.config.objectDensity[type];
      result[type] = Math.floor(maxPerType * density);
    }

    return result;
  }

  /**
   * Generiere einzelnes World Object
   */
  private generateObject(
    type: WorldObjectType,
    objectIndex: number,
    rng: any
  ): WorldObject | null {
    // Wähle Demo-Location für dieses Objekt
    const location = selectRandom(DEMO_LOCATIONS, rng);

    // Generiere Position im Spawn-Radius
    const position = offsetPosition(
      location.position.x,
      location.position.y,
      this.config.objectRadius,
      this.config.objectRadius,
      rng
    );

    // Duplikat-Check
    if (!this.isValidPosition(position)) {
      return null;
    }

    this.existingPositions.push(position);

    const baseId = `obj_${objectIndex}_${this.config.seed}`;

    switch (type) {
      case 'npc':
        return this.generateNPC(position, baseId, rng);
      case 'enemy':
        return this.generateEnemy(position, baseId, rng);
      case 'coin':
        return this.generateCoin(position, baseId, rng);
      case 'resource':
        return this.generateResource(position, baseId, rng);
      case 'chest':
        return this.generateChest(position, baseId, rng);
      case 'portal':
        return this.generatePortal(position, baseId, rng);
      case 'quest_point':
        return this.generateQuestPoint(position, baseId, rng);
      default:
        return null;
    }
  }

  /**
   * Überprüfe ob Position gültig ist (Duplikat-Check)
   */
  private isValidPosition(position: Position): boolean {
    if (this.config.allowDuplicates) return true;

    for (const existing of this.existingPositions) {
      const dist = distance(position.x, position.y, existing.x, existing.y);
      if (dist < this.config.minDistanceBetweenObjects) {
        return false;
      }
    }

    return true;
  }

  // ========================================================================
  // OBJECT GENERATORS
  // ========================================================================

  private generateNPC(position: Position, id: string, rng: any): WorldObject {
    return {
      id,
      type: 'npc',
      name: selectRandom(NPC_NAMES, rng),
      description: selectRandom(NPC_DIALOGUES, rng),
      position,
      isGPS: false,
      status: 'active',
      createdAt: Date.now(),
      interactionRadius: 10,
    };
  }

  private generateEnemy(position: Position, id: string, rng: any): WorldObject {
    return {
      id,
      type: 'enemy',
      name: selectRandom(ENEMY_NAMES, rng),
      position,
      isGPS: false,
      status: 'active',
      createdAt: Date.now(),
      lootTable: LOOT_TABLES['loot_goblin'],
      interactionRadius: 10,
    };
  }

  private generateCoin(position: Position, id: string, _rng: any): WorldObject {
    return {
      id,
      type: 'coin',
      name: 'Gold Coin',
      position,
      isGPS: false,
      status: 'active',
      createdAt: Date.now(),
      interactionRadius: 8,
    };
  }

  private generateResource(position: Position, id: string, rng: any): WorldObject {
    const resourceTypes = ['Crystal', 'Herb', 'Metal Ore', 'Wood'];
    return {
      id,
      type: 'resource',
      name: selectRandom(resourceTypes, rng),
      position,
      isGPS: false,
      status: 'active',
      createdAt: Date.now(),
      interactionRadius: 8,
    };
  }

  private generateChest(position: Position, id: string, _rng: any): WorldObject {
    return {
      id,
      type: 'chest',
      name: 'Treasure Chest',
      description: 'Eine alte Schatztruhe',
      position,
      isGPS: false,
      status: 'active',
      createdAt: Date.now(),
      lootTable: LOOT_TABLES['loot_chest'],
      interactionRadius: 10,
    };
  }

  private generatePortal(position: Position, id: string, _rng: any): WorldObject {
    return {
      id,
      type: 'portal',
      name: 'Mystical Portal',
      description: 'Ein glimmerndes Portal zu einem unbekannten Ort',
      position,
      isGPS: false,
      status: 'active',
      createdAt: Date.now(),
      interactionRadius: 12,
    };
  }

  private generateQuestPoint(position: Position, id: string, _rng: any): WorldObject {
    return {
      id,
      type: 'quest_point',
      name: 'Quest Marker',
      description: 'Ein wichtiger Ort für die Quest',
      position,
      isGPS: false,
      status: 'active',
      createdAt: Date.now(),
      interactionRadius: 15,
    };
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Generiere World mit Default-Config
 */
export function generateDefaultWorld(seed: number): GeneratedWorld {
  const config = getDefaultWorldGeneratorConfig();
  config.seed = seed;
  const generator = new WorldGenerator(config);
  return generator.generate();
}

/**
 * Generiere World mit Custom-Config
 */
export function generateCustomWorld(config: WorldGeneratorConfig): GeneratedWorld {
  const generator = new WorldGenerator(config);
  return generator.generate();
}
