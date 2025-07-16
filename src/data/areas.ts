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
          { itemId: 'bones', quantity: 1, chance: 0.5 },
          { itemId: 'leather', quantity: 1, chance: 0.3 }
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
          { itemId: 'bronze_sword', quantity: 1, chance: 0.1 },
          { itemId: 'leather', quantity: 1, chance: 0.25 }
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
          { itemId: 'bread', quantity: 2, chance: 0.3 },
          { itemId: 'hard_leather', quantity: 1, chance: 0.2 }
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
          { itemId: 'iron_ore', quantity: 1, chance: 0.1 },
          { itemId: 'hard_leather', quantity: 1, chance: 0.15 }
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
        toolRequired: 'bronze_pickaxe'
      },
      {
        id: 'coal',
        name: 'Coal',
        skill: 'mining',
        levelRequired: 20,
        experience: 50,
        toolRequired: 'bronze_pickaxe'
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
        toolRequired: 'bronze_axe'
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
          { itemId: 'iron_sword', quantity: 1, chance: 0.1 },
          { itemId: 'studded_leather', quantity: 1, chance: 0.18 }
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
          { itemId: 'bread', quantity: 3, chance: 0.4 },
          { itemId: 'studded_leather', quantity: 1, chance: 0.15 }
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
        toolRequired: 'iron_pickaxe'
      },
      {
        id: 'gold_ore',
        name: 'Gold Ore',
        skill: 'mining',
        levelRequired: 40,
        experience: 65,
        toolRequired: 'iron_pickaxe'
      },
      {
        id: 'salmon',
        name: 'Salmon',
        skill: 'fishing',
        levelRequired: 30,
        experience: 70,
        toolRequired: 'iron_fishing_rod'
      },
      {
        id: 'yew_logs',
        name: 'Yew Tree',
        skill: 'woodcutting',
        levelRequired: 60,
        experience: 175,
        toolRequired: 'iron_axe'
      }
    ]
  },
  {
    id: 'catherby',
    name: 'Catherby',
    description: 'A coastal town with adamant resources and dangerous sea monsters.',
    requiredLevel: 40,
    monsters: [
      {
        id: 'sea_troll',
        name: 'Sea Troll',
        level: 42,
        hp: 120,
        attack: 55,
        defense: 45,
        experience: 150,
        dropTable: [
          { itemId: 'coins', quantity: 80, chance: 0.9 },
          { itemId: 'adamant_ore', quantity: 1, chance: 0.12 },
          { itemId: 'steel_sword', quantity: 1, chance: 0.08 },
          { itemId: 'cooked_salmon', quantity: 2, chance: 0.3 },
          { itemId: 'green_dhide', quantity: 1, chance: 0.12 }
        ]
      },
      {
        id: 'lobster_warrior',
        name: 'Lobster Warrior',
        level: 45,
        hp: 140,
        attack: 60,
        defense: 50,
        experience: 180,
        dropTable: [
          { itemId: 'coins', quantity: 100, chance: 0.9 },
          { itemId: 'adamant_sword', quantity: 1, chance: 0.03 },
          { itemId: 'steel_helmet', quantity: 1, chance: 0.05 },
          { itemId: 'bones', quantity: 3, chance: 0.7 },
          { itemId: 'green_dhide', quantity: 1, chance: 0.1 }
        ]
      },
      {
        id: 'pirate_captain',
        name: 'Pirate Captain',
        level: 48,
        hp: 160,
        attack: 65,
        defense: 55,
        experience: 220,
        dropTable: [
          { itemId: 'coins', quantity: 150, chance: 0.9 },
          { itemId: 'adamant_chestplate', quantity: 1, chance: 0.02 },
          { itemId: 'mithril_sword', quantity: 1, chance: 0.1 },
          { itemId: 'bread', quantity: 5, chance: 0.5 },
          { itemId: 'blue_dhide', quantity: 1, chance: 0.08 }
        ]
      }
    ],
    resources: [
      {
        id: 'adamant_ore',
        name: 'Adamant Ore',
        skill: 'mining',
        levelRequired: 50,
        experience: 120,
        toolRequired: 'mithril_pickaxe'
      },
      {
        id: 'lobster',
        name: 'Lobster',
        skill: 'fishing',
        levelRequired: 40,
        experience: 90,
        toolRequired: 'iron_fishing_rod'
      },
      {
        id: 'maple_logs',
        name: 'Maple Tree',
        skill: 'woodcutting',
        levelRequired: 45,
        experience: 100,
        toolRequired: 'iron_axe'
      },
      {
        id: 'magic_logs',
        name: 'Magic Tree',
        skill: 'woodcutting',
        levelRequired: 75,
        experience: 250,
        toolRequired: 'mithril_axe'
      }
    ]
  },
  {
    id: 'ardougne',
    name: 'Ardougne',
    description: 'A mysterious city with rune resources and undead guardians.',
    requiredLevel: 60,
    monsters: [
      {
        id: 'necromancer',
        name: 'Necromancer',
        level: 62,
        hp: 200,
        attack: 80,
        defense: 60,
        experience: 280,
        dropTable: [
          { itemId: 'coins', quantity: 200, chance: 0.9 },
          { itemId: 'rune_ore', quantity: 1, chance: 0.1 },
          { itemId: 'adamant_sword', quantity: 1, chance: 0.08 },
          { itemId: 'bones', quantity: 5, chance: 0.8 },
          { itemId: 'blue_dhide', quantity: 1, chance: 0.1 }
        ]
      },
      {
        id: 'shadow_warrior',
        name: 'Shadow Warrior',
        level: 65,
        hp: 220,
        attack: 85,
        defense: 70,
        experience: 320,
        dropTable: [
          { itemId: 'coins', quantity: 250, chance: 0.9 },
          { itemId: 'rune_sword', quantity: 1, chance: 0.02 },
          { itemId: 'adamant_helmet', quantity: 1, chance: 0.04 },
          { itemId: 'cooked_trout', quantity: 3, chance: 0.4 },
          { itemId: 'red_dhide', quantity: 1, chance: 0.08 }
        ]
      },
      {
        id: 'lich_king',
        name: 'Lich King',
        level: 70,
        hp: 280,
        attack: 95,
        defense: 80,
        experience: 400,
        dropTable: [
          { itemId: 'coins', quantity: 400, chance: 0.9 },
          { itemId: 'rune_chestplate', quantity: 1, chance: 0.015 },
          { itemId: 'rune_helmet', quantity: 1, chance: 0.02 },
          { itemId: 'dragon_ore', quantity: 1, chance: 0.05 },
          { itemId: 'red_dhide', quantity: 1, chance: 0.06 }
        ]
      }
    ],
    resources: [
      {
        id: 'rune_ore',
        name: 'Rune Ore',
        skill: 'mining',
        levelRequired: 60,
        experience: 180,
        toolRequired: 'adamant_pickaxe'
      },
      {
        id: 'shark',
        name: 'Shark',
        skill: 'fishing',
        levelRequired: 50,
        experience: 110,
        toolRequired: 'mithril_fishing_rod'
      },
      {
        id: 'tuna',
        name: 'Tuna',
        skill: 'fishing',
        levelRequired: 35,
        experience: 80,
        toolRequired: 'mithril_fishing_rod'
      },
      {
        id: 'palm_logs',
        name: 'Palm Tree',
        skill: 'woodcutting',
        levelRequired: 68,
        experience: 200,
        toolRequired: 'mithril_axe'
      }
    ]
  },
  {
    id: 'dragon_isle',
    name: 'Dragon Isle',
    description: 'A volcanic island home to ancient dragons and dragon metal.',
    requiredLevel: 80,
    monsters: [
      {
        id: 'red_dragon',
        name: 'Red Dragon',
        level: 82,
        hp: 350,
        attack: 120,
        defense: 100,
        experience: 500,
        dropTable: [
          { itemId: 'coins', quantity: 500, chance: 0.9 },
          { itemId: 'dragon_ore', quantity: 1, chance: 0.08 },
          { itemId: 'rune_sword', quantity: 1, chance: 0.05 },
          { itemId: 'dragon_sword', quantity: 1, chance: 0.01 },
          { itemId: 'black_dhide', quantity: 1, chance: 0.1 }
        ]
      },
      {
        id: 'dragon_knight',
        name: 'Dragon Knight',
        level: 85,
        hp: 400,
        attack: 130,
        defense: 110,
        experience: 600,
        dropTable: [
          { itemId: 'coins', quantity: 600, chance: 0.9 },
          { itemId: 'dragon_helmet', quantity: 1, chance: 0.01 },
          { itemId: 'dragon_shield', quantity: 1, chance: 0.008 },
          { itemId: 'barrows_ore', quantity: 1, chance: 0.03 },
          { itemId: 'black_dhide', quantity: 1, chance: 0.08 }
        ]
      },
      {
        id: 'ancient_dragon',
        name: 'Ancient Dragon',
        level: 90,
        hp: 500,
        attack: 150,
        defense: 130,
        experience: 800,
        dropTable: [
          { itemId: 'coins', quantity: 1000, chance: 0.9 },
          { itemId: 'dragon_chestplate', quantity: 1, chance: 0.005 },
          { itemId: 'dragon_legs', quantity: 1, chance: 0.006 },
          { itemId: 'third_age_ore', quantity: 1, chance: 0.02 },
          { itemId: 'ancient_dhide', quantity: 1, chance: 0.06 }
        ]
      }
    ],
    resources: [
      {
        id: 'dragon_ore',
        name: 'Dragon Ore',
        skill: 'mining',
        levelRequired: 70,
        experience: 250,
        toolRequired: 'rune_pickaxe'
      },
      {
        id: 'manta_ray',
        name: 'Manta Ray',
        skill: 'fishing',
        levelRequired: 60,
        experience: 140,
        toolRequired: 'adamant_fishing_rod'
      },
      {
        id: 'redwood_logs',
        name: 'Redwood Tree',
        skill: 'woodcutting',
        levelRequired: 80,
        experience: 300,
        toolRequired: 'adamant_axe'
      },
      {
        id: 'elder_logs',
        name: 'Elder Tree',
        skill: 'woodcutting',
        levelRequired: 90,
        experience: 400,
        toolRequired: 'rune_axe'
      }
    ]
  },
  {
    id: 'barrows_crypts',
    name: 'Barrows Crypts',
    description: 'Ancient burial grounds filled with undead warriors and cursed metals.',
    requiredLevel: 85,
    monsters: [
      {
        id: 'barrows_wight',
        name: 'Barrows Wight',
        level: 87,
        hp: 420,
        attack: 140,
        defense: 120,
        experience: 650,
        dropTable: [
          { itemId: 'coins', quantity: 700, chance: 0.9 },
          { itemId: 'barrows_ore', quantity: 1, chance: 0.06 },
          { itemId: 'dragon_sword', quantity: 1, chance: 0.03 },
          { itemId: 'bones', quantity: 10, chance: 0.9 },
          { itemId: 'ancient_dhide', quantity: 1, chance: 0.08 }
        ]
      },
      {
        id: 'barrows_brother',
        name: 'Barrows Brother',
        level: 90,
        hp: 480,
        attack: 155,
        defense: 135,
        experience: 750,
        dropTable: [
          { itemId: 'coins', quantity: 800, chance: 0.9 },
          { itemId: 'barrows_helmet', quantity: 1, chance: 0.008 },
          { itemId: 'barrows_sword', quantity: 1, chance: 0.006 },
          { itemId: 'third_age_ore', quantity: 1, chance: 0.015 },
          { itemId: 'barrows_leather', quantity: 1, chance: 0.06 }
        ]
      },
      {
        id: 'barrows_king',
        name: 'Barrows King',
        level: 95,
        hp: 600,
        attack: 175,
        defense: 150,
        experience: 1000,
        dropTable: [
          { itemId: 'coins', quantity: 1200, chance: 0.9 },
          { itemId: 'barrows_chestplate', quantity: 1, chance: 0.003 },
          { itemId: 'barrows_shield', quantity: 1, chance: 0.004 },
          { itemId: 'primal_ore', quantity: 1, chance: 0.01 },
          { itemId: 'barrows_leather', quantity: 1, chance: 0.05 }
        ]
      }
    ],
    resources: [
      {
        id: 'barrows_ore',
        name: 'Barrows Ore',
        skill: 'mining',
        levelRequired: 80,
        experience: 350,
        toolRequired: 'dragon_pickaxe'
      },
      {
        id: 'dark_crab',
        name: 'Dark Crab',
        skill: 'fishing',
        levelRequired: 70,
        experience: 180,
        toolRequired: 'rune_fishing_rod'
      },
      {
        id: 'spirit_logs',
        name: 'Spirit Tree',
        skill: 'woodcutting',
        levelRequired: 83,
        experience: 380,
        toolRequired: 'rune_axe'
      }
    ]
  },
  {
    id: 'primal_realm',
    name: 'Primal Realm',
    description: 'The ultimate endgame area with primal resources and legendary beings.',
    requiredLevel: 95,
    monsters: [
      {
        id: 'primal_elemental',
        name: 'Primal Elemental',
        level: 97,
        hp: 650,
        attack: 190,
        defense: 160,
        experience: 1200,
        dropTable: [
          { itemId: 'coins', quantity: 1500, chance: 0.9 },
          { itemId: 'primal_ore', quantity: 1, chance: 0.04 },
          { itemId: 'third_age_sword', quantity: 1, chance: 0.02 },
          { itemId: 'barrows_helmet', quantity: 1, chance: 0.01 },
          { itemId: 'barrows_leather', quantity: 1, chance: 0.08 }
        ]
      },
      {
        id: 'primal_guardian',
        name: 'Primal Guardian',
        level: 99,
        hp: 750,
        attack: 200,
        defense: 180,
        experience: 1500,
        dropTable: [
          { itemId: 'coins', quantity: 2000, chance: 0.9 },
          { itemId: 'primal_helmet', quantity: 1, chance: 0.003 },
          { itemId: 'primal_sword', quantity: 1, chance: 0.002 },
          { itemId: 'third_age_chestplate', quantity: 1, chance: 0.005 },
          { itemId: 'primal_leather', quantity: 1, chance: 0.06 }
        ]
      },
      {
        id: 'primal_god',
        name: 'Primal God',
        level: 99,
        hp: 999,
        attack: 250,
        defense: 200,
        experience: 2000,
        dropTable: [
          { itemId: 'coins', quantity: 5000, chance: 0.9 },
          { itemId: 'primal_chestplate', quantity: 1, chance: 0.001 },
          { itemId: 'primal_shield', quantity: 1, chance: 0.001 },
          { itemId: 'primal_legs', quantity: 1, chance: 0.0015 },
          { itemId: 'primal_leather', quantity: 1, chance: 0.04 }
        ]
      }
    ],
    resources: [
      {
        id: 'primal_ore',
        name: 'Primal Ore',
        skill: 'mining',
        levelRequired: 95,
        experience: 500,
        toolRequired: 'third_age_pickaxe'
      },
      {
        id: 'third_age_ore',
        name: 'Third Age Ore',
        skill: 'mining',
        levelRequired: 90,
        experience: 450,
        toolRequired: 'barrows_pickaxe'
      },
      {
        id: 'anglerfish',
        name: 'Anglerfish',
        skill: 'fishing',
        levelRequired: 80,
        experience: 220,
        toolRequired: 'dragon_fishing_rod'
      },
      {
        id: 'primal_logs',
        name: 'Primal Tree',
        skill: 'woodcutting',
        levelRequired: 95,
        experience: 500,
        toolRequired: 'third_age_axe'
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