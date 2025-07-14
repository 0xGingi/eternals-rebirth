import { Area } from '../models/Area';

export const defaultAreas = [
  {
    id: 'lumbridge',
    name: 'Lumbridge',
    description: 'A peaceful starting town with basic resources and weak monsters.',
    requiredLevel: 1,
    monsters: [
      {
        id: 'rat',
        name: 'Rat',
        level: 1,
        hp: 8,
        attack: 3,
        defense: 1,
        experience: 15,
        dropTable: [
          { itemId: 'coins', quantity: 3, chance: 0.8 },
          { itemId: 'bones', quantity: 1, chance: 0.5 }
        ]
      },
      {
        id: 'goblin',
        name: 'Goblin',
        level: 3,
        hp: 15,
        attack: 6,
        defense: 3,
        experience: 25,
        dropTable: [
          { itemId: 'coins', quantity: 8, chance: 0.9 },
          { itemId: 'bones', quantity: 1, chance: 0.6 },
          { itemId: 'bronze_sword', quantity: 1, chance: 0.1 }
        ]
      }
    ],
    resources: [
      {
        id: 'copper_ore',
        name: 'Copper Ore',
        skill: 'mining',
        levelRequired: 1,
        experience: 15,
        toolRequired: 'bronze_pickaxe'
      },
      {
        id: 'tin_ore',
        name: 'Tin Ore',
        skill: 'mining',
        levelRequired: 1,
        experience: 15,
        toolRequired: 'bronze_pickaxe'
      },
      {
        id: 'shrimp',
        name: 'Shrimp',
        skill: 'fishing',
        levelRequired: 1,
        experience: 20,
        toolRequired: 'fishing_rod'
      },
      {
        id: 'normal_logs',
        name: 'Normal Tree',
        skill: 'woodcutting',
        levelRequired: 1,
        experience: 25,
        toolRequired: 'bronze_axe'
      },
      {
        id: 'oak_logs',
        name: 'Oak Tree',
        skill: 'woodcutting',
        levelRequired: 15,
        experience: 38,
        toolRequired: 'bronze_axe'
      }
    ]
  },
  {
    id: 'varrock',
    name: 'Varrock',
    description: 'A bustling city with stronger monsters and better resources.',
    requiredLevel: 10,
    monsters: [
      {
        id: 'guard',
        name: 'Guard',
        level: 15,
        hp: 45,
        attack: 25,
        defense: 20,
        experience: 50,
        dropTable: [
          { itemId: 'coins', quantity: 25, chance: 0.9 },
          { itemId: 'iron_sword', quantity: 1, chance: 0.05 },
          { itemId: 'bread', quantity: 2, chance: 0.3 }
        ]
      },
      {
        id: 'skeleton',
        name: 'Skeleton',
        level: 12,
        hp: 35,
        attack: 20,
        defense: 15,
        experience: 40,
        dropTable: [
          { itemId: 'coins', quantity: 15, chance: 0.8 },
          { itemId: 'bones', quantity: 2, chance: 0.7 },
          { itemId: 'iron_ore', quantity: 1, chance: 0.1 }
        ]
      }
    ],
    resources: [
      {
        id: 'iron_ore',
        name: 'Iron Ore',
        skill: 'mining',
        levelRequired: 15,
        experience: 35,
        toolRequired: 'iron_pickaxe'
      },
      {
        id: 'coal',
        name: 'Coal',
        skill: 'mining',
        levelRequired: 20,
        experience: 50,
        toolRequired: 'iron_pickaxe'
      },
      {
        id: 'trout',
        name: 'Trout',
        skill: 'fishing',
        levelRequired: 20,
        experience: 50,
        toolRequired: 'fishing_rod'
      },
      {
        id: 'willow_logs',
        name: 'Willow Tree',
        skill: 'woodcutting',
        levelRequired: 30,
        experience: 68,
        toolRequired: 'iron_axe'
      }
    ]
  },
  {
    id: 'falador',
    name: 'Falador',
    description: 'A mining town with dangerous monsters and valuable ores.',
    requiredLevel: 25,
    monsters: [
      {
        id: 'dwarf',
        name: 'Dwarf Warrior',
        level: 25,
        hp: 60,
        attack: 35,
        defense: 30,
        experience: 80,
        dropTable: [
          { itemId: 'coins', quantity: 40, chance: 0.9 },
          { itemId: 'mithril_ore', quantity: 1, chance: 0.15 },
          { itemId: 'iron_sword', quantity: 1, chance: 0.1 }
        ]
      },
      {
        id: 'knight',
        name: 'White Knight',
        level: 30,
        hp: 80,
        attack: 40,
        defense: 35,
        experience: 100,
        dropTable: [
          { itemId: 'coins', quantity: 60, chance: 0.9 },
          { itemId: 'mithril_sword', quantity: 1, chance: 0.05 },
          { itemId: 'bread', quantity: 3, chance: 0.4 }
        ]
      }
    ],
    resources: [
      {
        id: 'mithril_ore',
        name: 'Mithril Ore',
        skill: 'mining',
        levelRequired: 30,
        experience: 80,
        toolRequired: 'mithril_pickaxe'
      },
      {
        id: 'gold_ore',
        name: 'Gold Ore',
        skill: 'mining',
        levelRequired: 40,
        experience: 65,
        toolRequired: 'mithril_pickaxe'
      },
      {
        id: 'salmon',
        name: 'Salmon',
        skill: 'fishing',
        levelRequired: 30,
        experience: 70,
        toolRequired: 'fishing_rod'
      },
      {
        id: 'yew_logs',
        name: 'Yew Tree',
        skill: 'woodcutting',
        levelRequired: 60,
        experience: 175,
        toolRequired: 'mithril_axe'
      }
    ]
  }
];

export async function initializeAreas() {
  try {
    for (const areaData of defaultAreas) {
      const existingArea = await Area.findOne({ id: areaData.id });
      if (!existingArea) {
        await Area.create(areaData);
        console.log(`Created area: ${areaData.name}`);
      }
    }
  } catch (error) {
    console.error('Error initializing areas:', error);
  }
}