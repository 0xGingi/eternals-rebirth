import { Item } from '../models/Item';

export const defaultItems = [
  // Weapons
  {
    id: 'bronze_sword',
    name: 'Bronze Sword',
    description: 'A basic sword made of bronze.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 1,
    stats: { attack: 5, strength: 3, accuracy: 10, damage: 8 },
    stackable: false,
    value: 50
  },
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A sturdy sword made of iron.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 10,
    stats: { attack: 12, strength: 8, accuracy: 20, damage: 15 },
    stackable: false,
    value: 200
  },
  {
    id: 'mithril_sword',
    name: 'Mithril Sword',
    description: 'A magical sword made of mithril.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 20,
    stats: { attack: 25, strength: 18, accuracy: 35, damage: 25 },
    stackable: false,
    value: 800
  },
  {
    id: 'lost_femurs_of_phantasmic_isles',
    name: 'The Lost Femurs of Phantasmic Isles',
    description: 'dirty femur bones with a small gleam, its as if it wants to inspire you to give you hope. The real hope, is that someday it will actually do something…',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 1,
    stats: { attack: 20, strength: 20, accuracy: 20, damage: 20 },
    stackable: false,
    value: 1000
  },

  // Tools
  {
    id: 'bronze_pickaxe',
    name: 'Bronze Pickaxe',
    description: 'A basic pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 1,
    stats: { mining: 1 },
    stackable: false,
    value: 30
  },
  {
    id: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    description: 'A sturdy pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 10,
    stats: { mining: 3 },
    stackable: false,
    value: 120
  },
  {
    id: 'mithril_pickaxe',
    name: 'Mithril Pickaxe',
    description: 'A magical pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 20,
    stats: { mining: 5 },
    stackable: false,
    value: 500
  },
  {
    id: 'fishing_rod',
    name: 'Fishing Rod',
    description: 'A simple fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 1,
    stats: { fishing: 1 },
    stackable: false,
    value: 25
  },
  
  // Axes
  {
    id: 'bronze_axe',
    name: 'Bronze Axe',
    description: 'A basic axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 1,
    stats: { woodcutting: 1 },
    stackable: false,
    value: 30
  },
  {
    id: 'iron_axe',
    name: 'Iron Axe',
    description: 'A sturdy axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 10,
    stats: { woodcutting: 3 },
    stackable: false,
    value: 120
  },
  {
    id: 'mithril_axe',
    name: 'Mithril Axe',
    description: 'A magical axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 20,
    stats: { woodcutting: 5 },
    stackable: false,
    value: 500
  },
  
  // Food
  {
    id: 'bread',
    name: 'Bread',
    description: 'A loaf of bread that restores health.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 1,
    stackable: true,
    edible: true,
    healAmount: 15,
    value: 5
  },
  {
    id: 'cooked_shrimp',
    name: 'Cooked Shrimp',
    description: 'A tasty cooked shrimp.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 1,
    stackable: true,
    edible: true,
    healAmount: 10,
    value: 8
  },
  {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    description: 'A delicious cooked trout.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 15,
    stackable: true,
    edible: true,
    healAmount: 25,
    value: 15
  },
  {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    description: 'A perfectly cooked salmon.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 25,
    stackable: true,
    edible: true,
    healAmount: 35,
    value: 25
  },
  
  // Raw Resources
  {
    id: 'shrimp',
    name: 'Raw Shrimp',
    description: 'A raw shrimp that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 1,
    stackable: true,
    value: 3
  },
  {
    id: 'trout',
    name: 'Raw Trout',
    description: 'A raw trout that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 20,
    stackable: true,
    value: 8
  },
  {
    id: 'salmon',
    name: 'Raw Salmon',
    description: 'A raw salmon that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 30,
    stackable: true,
    value: 12
  },
  
  // Ores
  {
    id: 'copper_ore',
    name: 'Copper Ore',
    description: 'A chunk of copper ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 1,
    stackable: true,
    value: 5
  },
  {
    id: 'tin_ore',
    name: 'Tin Ore',
    description: 'A chunk of tin ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 1,
    stackable: true,
    value: 5
  },
  {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'A chunk of iron ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 15,
    stackable: true,
    value: 20
  },
  {
    id: 'coal',
    name: 'Coal',
    description: 'A piece of coal used for smelting.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 20,
    stackable: true,
    value: 30
  },
  {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    description: 'A magical chunk of mithril ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 30,
    stackable: true,
    value: 100
  },
  {
    id: 'gold_ore',
    name: 'Gold Ore',
    description: 'A shiny chunk of gold ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 40,
    stackable: true,
    value: 150
  },
  
  // Logs
  {
    id: 'normal_logs',
    name: 'Normal Logs',
    description: 'Logs cut from a normal tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 1,
    stackable: true,
    value: 10
  },
  {
    id: 'oak_logs',
    name: 'Oak Logs',
    description: 'Logs cut from an oak tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 15,
    stackable: true,
    value: 25
  },
  {
    id: 'willow_logs',
    name: 'Willow Logs',
    description: 'Logs cut from a willow tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 30,
    stackable: true,
    value: 50
  },
  {
    id: 'yew_logs',
    name: 'Yew Logs',
    description: 'Logs cut from a yew tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 60,
    stackable: true,
    value: 200
  },

  // Arrow Shafts
  {
    id: 'arrow_shaft',
    name: 'Arrow Shaft',
    description: 'A wooden shaft for arrows.',
    type: 'resource',
    subType: 'component',
    levelRequired: 1,
    stackable: true,
    value: 5
  },
  {
    id: 'oak_arrow_shaft',
    name: 'Oak Arrow Shaft',
    description: 'A sturdy oak shaft for arrows.',
    type: 'resource',
    subType: 'component',
    levelRequired: 15,
    stackable: true,
    value: 12
  },

  // Arrow Heads
  {
    id: 'bronze_arrow_head',
    name: 'Bronze Arrow Head',
    description: 'A bronze tip for arrows.',
    type: 'resource',
    subType: 'component',
    levelRequired: 1,
    stackable: true,
    value: 8
  },
  {
    id: 'iron_arrow_head',
    name: 'Iron Arrow Head',
    description: 'An iron tip for arrows.',
    type: 'resource',
    subType: 'component',
    levelRequired: 15,
    stackable: true,
    value: 20
  },
  {
    id: 'mithril_arrow_head',
    name: 'Mithril Arrow Head',
    description: 'A mithril tip for arrows.',
    type: 'resource',
    subType: 'component',
    levelRequired: 30,
    stackable: true,
    value: 50
  },

  // Bows
  {
    id: 'shortbow',
    name: 'Shortbow',
    description: 'A basic shortbow for ranged combat.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 1,
    stats: { range: 8, accuracy: 12, damage: 6 },
    stackable: false,
    value: 100
  },
  {
    id: 'oak_shortbow',
    name: 'Oak Shortbow',
    description: 'A sturdy oak shortbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 15,
    stats: { range: 15, accuracy: 20, damage: 12 },
    stackable: false,
    value: 250
  },
  {
    id: 'willow_shortbow',
    name: 'Willow Shortbow',
    description: 'A flexible willow shortbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 30,
    stats: { range: 25, accuracy: 30, damage: 18 },
    stackable: false,
    value: 500
  },

  // Staffs
  {
    id: 'basic_staff',
    name: 'Basic Staff',
    description: 'A simple wooden staff for magic.',
    type: 'weapon',
    subType: 'magic',
    levelRequired: 1,
    stats: { magic: 8, accuracy: 12, damage: 6 },
    stackable: false,
    value: 100
  },
  {
    id: 'oak_staff',
    name: 'Oak Staff',
    description: 'A sturdy oak staff.',
    type: 'weapon',
    subType: 'magic',
    levelRequired: 15,
    stats: { magic: 15, accuracy: 20, damage: 12 },
    stackable: false,
    value: 250
  },

  // Arrows
  {
    id: 'bronze_arrow',
    name: 'Bronze Arrow',
    description: 'An arrow with a bronze tip.',
    type: 'weapon',
    subType: 'ammunition',
    levelRequired: 1,
    stats: { damage: 2 },
    stackable: true,
    value: 15
  },
  {
    id: 'iron_arrow',
    name: 'Iron Arrow',
    description: 'An arrow with an iron tip.',
    type: 'weapon',
    subType: 'ammunition',
    levelRequired: 15,
    stats: { damage: 4 },
    stackable: true,
    value: 35
  },
  {
    id: 'mithril_arrow',
    name: 'Mithril Arrow',
    description: 'An arrow with a mithril tip.',
    type: 'weapon',
    subType: 'ammunition',
    levelRequired: 30,
    stats: { damage: 6 },
    stackable: true,
    value: 75
  },

  // Bars
  {
    id: 'bronze_bar',
    name: 'Bronze Bar',
    description: 'A bar of bronze, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 1,
    stackable: true,
    value: 15
  },
  {
    id: 'iron_bar',
    name: 'Iron Bar',
    description: 'A bar of iron, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 15,
    stackable: true,
    value: 50
  },
  {
    id: 'mithril_bar',
    name: 'Mithril Bar',
    description: 'A bar of mithril, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 30,
    stackable: true,
    value: 200
  },

  // Other
  {
    id: 'coins',
    name: 'Coins',
    description: 'Gold coins used as currency.',
    type: 'other',
    subType: 'misc',
    levelRequired: 1,
    stackable: true,
    value: 1
  },
  {
    id: 'bones',
    name: 'Bones',
    description: 'Bones from defeated creatures.',
    type: 'other',
    subType: 'misc',
    levelRequired: 1,
    stackable: true,
    value: 2
  }
];

export async function initializeItems() {
  try {
    for (const itemData of defaultItems) {
      const existingItem = await Item.findOne({ id: itemData.id });
      if (!existingItem) {
        await Item.create(itemData);
        console.log(`Created item: ${itemData.name}`);
      }
    }
  } catch (error) {
    console.error('Error initializing items:', error);
  }
}