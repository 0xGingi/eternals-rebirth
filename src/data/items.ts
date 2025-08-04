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
    id: 'steel_sword',
    name: 'Steel Sword',
    description: 'A well-forged sword made of steel.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 20,
    stats: { attack: 18, strength: 12, accuracy: 25, damage: 20 },
    stackable: false,
    value: 400
  },
  {
    id: 'mithril_sword',
    name: 'Mithril Sword',
    description: 'A magical sword made of mithril.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 30,
    stats: { attack: 25, strength: 18, accuracy: 35, damage: 25 },
    stackable: false,
    value: 800
  },
  {
    id: 'adamant_sword',
    name: 'Adamant Sword',
    description: 'A strong sword made of adamant.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 40,
    stats: { attack: 32, strength: 22, accuracy: 45, damage: 30 },
    stackable: false,
    value: 1600
  },
  {
    id: 'rune_sword',
    name: 'Rune Sword',
    description: 'A powerful sword made of rune.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 50,
    stats: { attack: 40, strength: 28, accuracy: 55, damage: 35 },
    stackable: false,
    value: 3200
  },
  {
    id: 'dragon_sword',
    name: 'Dragon Sword',
    description: 'A legendary sword made of dragon metal.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 60,
    stats: { attack: 48, strength: 35, accuracy: 65, damage: 40 },
    stackable: false,
    value: 6400
  },
  {
    id: 'barrows_sword',
    name: 'Barrows Sword',
    description: 'An ancient sword from the barrows.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 70,
    stats: { attack: 56, strength: 42, accuracy: 75, damage: 45 },
    stackable: false,
    value: 12800
  },
  {
    id: 'third_age_sword',
    name: 'Third Age Sword',
    description: 'A rare sword from the Third Age.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 80,
    stats: { attack: 64, strength: 50, accuracy: 85, damage: 50 },
    stackable: false,
    value: 25600
  },
  {
    id: 'primal_sword',
    name: 'Primal Sword',
    description: 'The ultimate sword of primal power.',
    type: 'weapon',
    subType: 'melee',
    levelRequired: 90,
    stats: { attack: 72, strength: 58, accuracy: 95, damage: 55 },
    stackable: false,
    value: 51200
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

  // Armor - Helmets
  {
    id: 'bronze_helmet',
    name: 'Bronze Helmet',
    description: 'A basic helmet made of bronze.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 1,
    stats: { defense: 3, attack: 1, strength: 1 },
    stackable: false,
    value: 30
  },
  {
    id: 'iron_helmet',
    name: 'Iron Helmet',
    description: 'A sturdy helmet made of iron.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 10,
    stats: { defense: 6, attack: 2, strength: 2 },
    stackable: false,
    value: 120
  },
  {
    id: 'steel_helmet',
    name: 'Steel Helmet',
    description: 'A well-forged helmet made of steel.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 20,
    stats: { defense: 9, attack: 3, strength: 3 },
    stackable: false,
    value: 240
  },
  {
    id: 'mithril_helmet',
    name: 'Mithril Helmet',
    description: 'A magical helmet made of mithril.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 30,
    stats: { defense: 12, attack: 4, strength: 4 },
    stackable: false,
    value: 480
  },
  {
    id: 'adamant_helmet',
    name: 'Adamant Helmet',
    description: 'A strong helmet made of adamant.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 40,
    stats: { defense: 15, attack: 5, strength: 5 },
    stackable: false,
    value: 960
  },
  {
    id: 'rune_helmet',
    name: 'Rune Helmet',
    description: 'A powerful helmet made of rune.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 50,
    stats: { defense: 18, attack: 6, strength: 6 },
    stackable: false,
    value: 1920
  },
  {
    id: 'dragon_helmet',
    name: 'Dragon Helmet',
    description: 'A legendary helmet made of dragon metal.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 60,
    stats: { defense: 21, attack: 7, strength: 7 },
    stackable: false,
    value: 3840
  },
  {
    id: 'barrows_helmet',
    name: 'Barrows Helmet',
    description: 'An ancient helmet from the barrows.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 70,
    stats: { defense: 24, attack: 8, strength: 8 },
    stackable: false,
    value: 7680
  },
  {
    id: 'third_age_helmet',
    name: 'Third Age Helmet',
    description: 'A rare helmet from the Third Age.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 80,
    stats: { defense: 27, attack: 9, strength: 9 },
    stackable: false,
    value: 15360
  },
  {
    id: 'primal_helmet',
    name: 'Primal Helmet',
    description: 'The ultimate helmet of primal power.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 90,
    stats: { defense: 30, attack: 10, strength: 10 },
    stackable: false,
    value: 30720
  },

  // Armor - Chestplates
  {
    id: 'bronze_chestplate',
    name: 'Bronze Chestplate',
    description: 'A basic chestplate made of bronze.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 1,
    stats: { defense: 5, attack: 2, strength: 1 },
    stackable: false,
    value: 50
  },
  {
    id: 'iron_chestplate',
    name: 'Iron Chestplate',
    description: 'A sturdy chestplate made of iron.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 10,
    stats: { defense: 10, attack: 4, strength: 2 },
    stackable: false,
    value: 200
  },
  {
    id: 'steel_chestplate',
    name: 'Steel Chestplate',
    description: 'A well-forged chestplate made of steel.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 20,
    stats: { defense: 15, attack: 6, strength: 3 },
    stackable: false,
    value: 400
  },
  {
    id: 'mithril_chestplate',
    name: 'Mithril Chestplate',
    description: 'A magical chestplate made of mithril.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 30,
    stats: { defense: 20, attack: 8, strength: 4 },
    stackable: false,
    value: 800
  },
  {
    id: 'adamant_chestplate',
    name: 'Adamant Chestplate',
    description: 'A strong chestplate made of adamant.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 40,
    stats: { defense: 25, attack: 10, strength: 5 },
    stackable: false,
    value: 1600
  },
  {
    id: 'rune_chestplate',
    name: 'Rune Chestplate',
    description: 'A powerful chestplate made of rune.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 50,
    stats: { defense: 30, attack: 12, strength: 6 },
    stackable: false,
    value: 3200
  },
  {
    id: 'dragon_chestplate',
    name: 'Dragon Chestplate',
    description: 'A legendary chestplate made of dragon metal.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 60,
    stats: { defense: 35, attack: 14, strength: 7 },
    stackable: false,
    value: 6400
  },
  {
    id: 'barrows_chestplate',
    name: 'Barrows Chestplate',
    description: 'An ancient chestplate from the barrows.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 70,
    stats: { defense: 40, attack: 16, strength: 8 },
    stackable: false,
    value: 12800
  },
  {
    id: 'third_age_chestplate',
    name: 'Third Age Chestplate',
    description: 'A rare chestplate from the Third Age.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 80,
    stats: { defense: 45, attack: 18, strength: 9 },
    stackable: false,
    value: 25600
  },
  {
    id: 'primal_chestplate',
    name: 'Primal Chestplate',
    description: 'The ultimate chestplate of primal power.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 90,
    stats: { defense: 50, attack: 20, strength: 10 },
    stackable: false,
    value: 51200
  },

  // Armor - Legs
  {
    id: 'bronze_legs',
    name: 'Bronze Legs',
    description: 'Basic leg armor made of bronze.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 1,
    stats: { defense: 4, attack: 1, strength: 1 },
    stackable: false,
    value: 40
  },
  {
    id: 'iron_legs',
    name: 'Iron Legs',
    description: 'Sturdy leg armor made of iron.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 10,
    stats: { defense: 8, attack: 2, strength: 2 },
    stackable: false,
    value: 160
  },
  {
    id: 'steel_legs',
    name: 'Steel Legs',
    description: 'Well-forged leg armor made of steel.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 20,
    stats: { defense: 12, attack: 3, strength: 3 },
    stackable: false,
    value: 320
  },
  {
    id: 'mithril_legs',
    name: 'Mithril Legs',
    description: 'Magical leg armor made of mithril.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 30,
    stats: { defense: 16, attack: 4, strength: 4 },
    stackable: false,
    value: 640
  },
  {
    id: 'adamant_legs',
    name: 'Adamant Legs',
    description: 'Strong leg armor made of adamant.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 40,
    stats: { defense: 20, attack: 5, strength: 5 },
    stackable: false,
    value: 1280
  },
  {
    id: 'rune_legs',
    name: 'Rune Legs',
    description: 'Powerful leg armor made of rune.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 50,
    stats: { defense: 24, attack: 6, strength: 6 },
    stackable: false,
    value: 2560
  },
  {
    id: 'dragon_legs',
    name: 'Dragon Legs',
    description: 'Legendary leg armor made of dragon metal.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 60,
    stats: { defense: 28, attack: 7, strength: 7 },
    stackable: false,
    value: 5120
  },
  {
    id: 'barrows_legs',
    name: 'Barrows Legs',
    description: 'Ancient leg armor from the barrows.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 70,
    stats: { defense: 32, attack: 8, strength: 8 },
    stackable: false,
    value: 10240
  },
  {
    id: 'third_age_legs',
    name: 'Third Age Legs',
    description: 'Rare leg armor from the Third Age.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 80,
    stats: { defense: 36, attack: 9, strength: 9 },
    stackable: false,
    value: 20480
  },
  {
    id: 'primal_legs',
    name: 'Primal Legs',
    description: 'Ultimate leg armor of primal power.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 90,
    stats: { defense: 40, attack: 10, strength: 10 },
    stackable: false,
    value: 40960
  },

  // Armor - Gloves
  {
    id: 'bronze_gloves',
    name: 'Bronze Gloves',
    description: 'Basic gloves made of bronze.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 1,
    stats: { defense: 2, attack: 1, strength: 1 },
    stackable: false,
    value: 20
  },
  {
    id: 'iron_gloves',
    name: 'Iron Gloves',
    description: 'Sturdy gloves made of iron.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 10,
    stats: { defense: 4, attack: 2, strength: 2 },
    stackable: false,
    value: 80
  },
  {
    id: 'steel_gloves',
    name: 'Steel Gloves',
    description: 'Well-forged gloves made of steel.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 20,
    stats: { defense: 6, attack: 3, strength: 3 },
    stackable: false,
    value: 160
  },
  {
    id: 'mithril_gloves',
    name: 'Mithril Gloves',
    description: 'Magical gloves made of mithril.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 30,
    stats: { defense: 8, attack: 4, strength: 4 },
    stackable: false,
    value: 320
  },
  {
    id: 'adamant_gloves',
    name: 'Adamant Gloves',
    description: 'Strong gloves made of adamant.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 40,
    stats: { defense: 10, attack: 5, strength: 5 },
    stackable: false,
    value: 640
  },
  {
    id: 'rune_gloves',
    name: 'Rune Gloves',
    description: 'Powerful gloves made of rune.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 50,
    stats: { defense: 12, attack: 6, strength: 6 },
    stackable: false,
    value: 1280
  },
  {
    id: 'dragon_gloves',
    name: 'Dragon Gloves',
    description: 'Legendary gloves made of dragon metal.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 60,
    stats: { defense: 14, attack: 7, strength: 7 },
    stackable: false,
    value: 2560
  },
  {
    id: 'barrows_gloves',
    name: 'Barrows Gloves',
    description: 'Ancient gloves from the barrows.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 70,
    stats: { defense: 16, attack: 8, strength: 8 },
    stackable: false,
    value: 5120
  },
  {
    id: 'third_age_gloves',
    name: 'Third Age Gloves',
    description: 'Rare gloves from the Third Age.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 80,
    stats: { defense: 18, attack: 9, strength: 9 },
    stackable: false,
    value: 10240
  },
  {
    id: 'primal_gloves',
    name: 'Primal Gloves',
    description: 'Ultimate gloves of primal power.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 90,
    stats: { defense: 20, attack: 10, strength: 10 },
    stackable: false,
    value: 20480
  },

  // Armor - Boots
  {
    id: 'bronze_boots',
    name: 'Bronze Boots',
    description: 'Basic boots made of bronze.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 1,
    stats: { defense: 2, attack: 1, strength: 1 },
    stackable: false,
    value: 20
  },
  {
    id: 'iron_boots',
    name: 'Iron Boots',
    description: 'Sturdy boots made of iron.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 10,
    stats: { defense: 4, attack: 2, strength: 2 },
    stackable: false,
    value: 80
  },
  {
    id: 'steel_boots',
    name: 'Steel Boots',
    description: 'Well-forged boots made of steel.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 20,
    stats: { defense: 6, attack: 3, strength: 3 },
    stackable: false,
    value: 160
  },
  {
    id: 'mithril_boots',
    name: 'Mithril Boots',
    description: 'Magical boots made of mithril.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 30,
    stats: { defense: 8, attack: 4, strength: 4 },
    stackable: false,
    value: 320
  },
  {
    id: 'adamant_boots',
    name: 'Adamant Boots',
    description: 'Strong boots made of adamant.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 40,
    stats: { defense: 10, attack: 5, strength: 5 },
    stackable: false,
    value: 640
  },
  {
    id: 'rune_boots',
    name: 'Rune Boots',
    description: 'Powerful boots made of rune.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 50,
    stats: { defense: 12, attack: 6, strength: 6 },
    stackable: false,
    value: 1280
  },
  {
    id: 'dragon_boots',
    name: 'Dragon Boots',
    description: 'Legendary boots made of dragon metal.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 60,
    stats: { defense: 14, attack: 7, strength: 7 },
    stackable: false,
    value: 2560
  },
  {
    id: 'barrows_boots',
    name: 'Barrows Boots',
    description: 'Ancient boots from the barrows.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 70,
    stats: { defense: 16, attack: 8, strength: 8 },
    stackable: false,
    value: 5120
  },
  {
    id: 'third_age_boots',
    name: 'Third Age Boots',
    description: 'Rare boots from the Third Age.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 80,
    stats: { defense: 18, attack: 9, strength: 9 },
    stackable: false,
    value: 10240
  },
  {
    id: 'primal_boots',
    name: 'Primal Boots',
    description: 'Ultimate boots of primal power.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 90,
    stats: { defense: 20, attack: 10, strength: 10 },
    stackable: false,
    value: 20480
  },

  // Armor - Shields
  {
    id: 'bronze_shield',
    name: 'Bronze Shield',
    description: 'A basic shield made of bronze.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 1,
    stats: { defense: 4, attack: 1, strength: 1 },
    stackable: false,
    value: 40
  },
  {
    id: 'iron_shield',
    name: 'Iron Shield',
    description: 'A sturdy shield made of iron.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 10,
    stats: { defense: 8, attack: 2, strength: 2 },
    stackable: false,
    value: 160
  },
  {
    id: 'steel_shield',
    name: 'Steel Shield',
    description: 'A well-forged shield made of steel.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 20,
    stats: { defense: 12, attack: 3, strength: 3 },
    stackable: false,
    value: 320
  },
  {
    id: 'mithril_shield',
    name: 'Mithril Shield',
    description: 'A magical shield made of mithril.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 30,
    stats: { defense: 16, attack: 4, strength: 4 },
    stackable: false,
    value: 640
  },
  {
    id: 'adamant_shield',
    name: 'Adamant Shield',
    description: 'A strong shield made of adamant.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 40,
    stats: { defense: 20, attack: 5, strength: 5 },
    stackable: false,
    value: 1280
  },
  {
    id: 'rune_shield',
    name: 'Rune Shield',
    description: 'A powerful shield made of rune.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 50,
    stats: { defense: 24, attack: 6, strength: 6 },
    stackable: false,
    value: 2560
  },
  {
    id: 'dragon_shield',
    name: 'Dragon Shield',
    description: 'A legendary shield made of dragon metal.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 60,
    stats: { defense: 28, attack: 7, strength: 7 },
    stackable: false,
    value: 5120
  },
  {
    id: 'barrows_shield',
    name: 'Barrows Shield',
    description: 'An ancient shield from the barrows.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 70,
    stats: { defense: 32, attack: 8, strength: 8 },
    stackable: false,
    value: 10240
  },
  {
    id: 'third_age_shield',
    name: 'Third Age Shield',
    description: 'A rare shield from the Third Age.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 80,
    stats: { defense: 36, attack: 9, strength: 9 },
    stackable: false,
    value: 20480
  },
  {
    id: 'primal_shield',
    name: 'Primal Shield',
    description: 'The ultimate shield of primal power.',
    type: 'armor',
    subType: 'shield',
    levelRequired: 90,
    stats: { defense: 40, attack: 10, strength: 10 },
    stackable: false,
    value: 40960
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
  {
    id: 'iron_fishing_rod',
    name: 'Iron Fishing Rod',
    description: 'A sturdy iron fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 10,
    stats: { fishing: 3 },
    stackable: false,
    value: 120
  },
  {
    id: 'mithril_fishing_rod',
    name: 'Mithril Fishing Rod',
    description: 'A magical mithril fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 20,
    stats: { fishing: 5 },
    stackable: false,
    value: 500
  },
  {
    id: 'adamant_fishing_rod',
    name: 'Adamant Fishing Rod',
    description: 'A strong adamant fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 40,
    stats: { fishing: 7 },
    stackable: false,
    value: 1000
  },
  {
    id: 'rune_fishing_rod',
    name: 'Rune Fishing Rod',
    description: 'A powerful rune fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 50,
    stats: { fishing: 10 },
    stackable: false,
    value: 2000
  },
  {
    id: 'dragon_fishing_rod',
    name: 'Dragon Fishing Rod',
    description: 'A legendary dragon fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 60,
    stats: { fishing: 15 },
    stackable: false,
    value: 4000
  },
  {
    id: 'barrows_fishing_rod',
    name: 'Barrows Fishing Rod',
    description: 'An ancient barrows fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 70,
    stats: { fishing: 20 },
    stackable: false,
    value: 8000
  },
  {
    id: 'third_age_fishing_rod',
    name: 'Third Age Fishing Rod',
    description: 'A rare third age fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 80,
    stats: { fishing: 25 },
    stackable: false,
    value: 16000
  },
  {
    id: 'primal_fishing_rod',
    name: 'Primal Fishing Rod',
    description: 'The ultimate primal fishing rod.',
    type: 'tool',
    subType: 'rod',
    levelRequired: 90,
    stats: { fishing: 30 },
    stackable: false,
    value: 32000
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
  {
    id: 'adamant_pickaxe',
    name: 'Adamant Pickaxe',
    description: 'A strong pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 40,
    stats: { mining: 7 },
    stackable: false,
    value: 1000
  },
  {
    id: 'rune_pickaxe',
    name: 'Rune Pickaxe',
    description: 'A powerful pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 50,
    stats: { mining: 10 },
    stackable: false,
    value: 2000
  },
  {
    id: 'dragon_pickaxe',
    name: 'Dragon Pickaxe',
    description: 'A legendary pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 60,
    stats: { mining: 15 },
    stackable: false,
    value: 4000
  },
  {
    id: 'barrows_pickaxe',
    name: 'Barrows Pickaxe',
    description: 'An ancient pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 70,
    stats: { mining: 20 },
    stackable: false,
    value: 8000
  },
  {
    id: 'third_age_pickaxe',
    name: 'Third Age Pickaxe',
    description: 'A rare pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 80,
    stats: { mining: 25 },
    stackable: false,
    value: 16000
  },
  {
    id: 'primal_pickaxe',
    name: 'Primal Pickaxe',
    description: 'The ultimate pickaxe for mining.',
    type: 'tool',
    subType: 'pickaxe',
    levelRequired: 90,
    stats: { mining: 30 },
    stackable: false,
    value: 32000
  },
  {
    id: 'adamant_axe',
    name: 'Adamant Axe',
    description: 'A strong axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 40,
    stats: { woodcutting: 7 },
    stackable: false,
    value: 1000
  },
  {
    id: 'rune_axe',
    name: 'Rune Axe',
    description: 'A powerful axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 50,
    stats: { woodcutting: 10 },
    stackable: false,
    value: 2000
  },
  {
    id: 'dragon_axe',
    name: 'Dragon Axe',
    description: 'A legendary axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 60,
    stats: { woodcutting: 15 },
    stackable: false,
    value: 4000
  },
  {
    id: 'barrows_axe',
    name: 'Barrows Axe',
    description: 'An ancient axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 70,
    stats: { woodcutting: 20 },
    stackable: false,
    value: 8000
  },
  {
    id: 'third_age_axe',
    name: 'Third Age Axe',
    description: 'A rare axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 80,
    stats: { woodcutting: 25 },
    stackable: false,
    value: 16000
  },
  {
    id: 'primal_axe',
    name: 'Primal Axe',
    description: 'The ultimate axe for woodcutting.',
    type: 'tool',
    subType: 'axe',
    levelRequired: 90,
    stats: { woodcutting: 30 },
    stackable: false,
    value: 32000
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
  {
    id: 'cooked_lobster',
    name: 'Cooked Lobster',
    description: 'A delicious cooked lobster.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 40,
    stackable: true,
    edible: true,
    healAmount: 45,
    value: 40
  },
  {
    id: 'cooked_tuna',
    name: 'Cooked Tuna',
    description: 'A perfectly cooked tuna.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 35,
    stackable: true,
    edible: true,
    healAmount: 40,
    value: 30
  },
  {
    id: 'cooked_shark',
    name: 'Cooked Shark',
    description: 'A hearty cooked shark.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 50,
    stackable: true,
    edible: true,
    healAmount: 55,
    value: 60
  },
  {
    id: 'cooked_manta_ray',
    name: 'Cooked Manta Ray',
    description: 'A nutritious cooked manta ray.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 60,
    stackable: true,
    edible: true,
    healAmount: 65,
    value: 100
  },
  {
    id: 'cooked_dark_crab',
    name: 'Cooked Dark Crab',
    description: 'A rare cooked dark crab.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 70,
    stackable: true,
    edible: true,
    healAmount: 75,
    value: 160
  },
  {
    id: 'cooked_anglerfish',
    name: 'Cooked Anglerfish',
    description: 'The ultimate cooked fish.',
    type: 'food',
    subType: 'cooked',
    levelRequired: 80,
    stackable: true,
    edible: true,
    healAmount: 85,
    value: 240
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
  {
    id: 'lobster',
    name: 'Raw Lobster',
    description: 'A raw lobster that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 40,
    stackable: true,
    value: 20
  },
  {
    id: 'tuna',
    name: 'Raw Tuna',
    description: 'A raw tuna that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 35,
    stackable: true,
    value: 15
  },
  {
    id: 'shark',
    name: 'Raw Shark',
    description: 'A raw shark that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 50,
    stackable: true,
    value: 30
  },
  {
    id: 'manta_ray',
    name: 'Raw Manta Ray',
    description: 'A raw manta ray that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 60,
    stackable: true,
    value: 50
  },
  {
    id: 'dark_crab',
    name: 'Raw Dark Crab',
    description: 'A raw dark crab that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 70,
    stackable: true,
    value: 80
  },
  {
    id: 'anglerfish',
    name: 'Raw Anglerfish',
    description: 'A raw anglerfish that can be cooked.',
    type: 'resource',
    subType: 'raw',
    levelRequired: 80,
    stackable: true,
    value: 120
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
  {
    id: 'adamant_ore',
    name: 'Adamant Ore',
    description: 'A strong chunk of adamant ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 50,
    stackable: true,
    value: 300
  },
  {
    id: 'rune_ore',
    name: 'Rune Ore',
    description: 'A powerful chunk of rune ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 60,
    stackable: true,
    value: 600
  },
  {
    id: 'dragon_ore',
    name: 'Dragon Ore',
    description: 'A legendary chunk of dragon ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 70,
    stackable: true,
    value: 1200
  },
  {
    id: 'barrows_ore',
    name: 'Barrows Ore',
    description: 'An ancient chunk of barrows ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 80,
    stackable: true,
    value: 2400
  },
  {
    id: 'third_age_ore',
    name: 'Third Age Ore',
    description: 'A rare chunk of third age ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 90,
    stackable: true,
    value: 4800
  },
  {
    id: 'primal_ore',
    name: 'Primal Ore',
    description: 'The ultimate chunk of primal ore.',
    type: 'resource',
    subType: 'ore',
    levelRequired: 95,
    stackable: true,
    value: 9600
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
  {
    id: 'maple_logs',
    name: 'Maple Logs',
    description: 'Logs cut from a maple tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 45,
    stackable: true,
    value: 150
  },
  {
    id: 'magic_logs',
    name: 'Magic Logs',
    description: 'Logs cut from a magic tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 75,
    stackable: true,
    value: 300
  },
  {
    id: 'palm_logs',
    name: 'Palm Logs',
    description: 'Logs cut from a palm tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 68,
    stackable: true,
    value: 250
  },
  {
    id: 'redwood_logs',
    name: 'Redwood Logs',
    description: 'Logs cut from a redwood tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 80,
    stackable: true,
    value: 400
  },
  {
    id: 'elder_logs',
    name: 'Elder Logs',
    description: 'Logs cut from an elder tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 90,
    stackable: true,
    value: 500
  },
  {
    id: 'spirit_logs',
    name: 'Spirit Logs',
    description: 'Logs cut from a spirit tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 83,
    stackable: true,
    value: 450
  },
  {
    id: 'primal_logs',
    name: 'Primal Logs',
    description: 'Logs cut from a primal tree.',
    type: 'resource',
    subType: 'wood',
    levelRequired: 95,
    stackable: true,
    value: 600
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
  {
    id: 'maple_shortbow',
    name: 'Maple Shortbow',
    description: 'A reliable maple shortbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 45,
    stats: { range: 32, accuracy: 38, damage: 22 },
    stackable: false,
    value: 800
  },
  {
    id: 'yew_shortbow',
    name: 'Yew Shortbow',
    description: 'A powerful yew shortbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 60,
    stats: { range: 40, accuracy: 45, damage: 28 },
    stackable: false,
    value: 1200
  },
  {
    id: 'magic_shortbow',
    name: 'Magic Shortbow',
    description: 'A magical shortbow with enhanced power.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 75,
    stats: { range: 48, accuracy: 55, damage: 32 },
    stackable: false,
    value: 2000
  },
  {
    id: 'elder_shortbow',
    name: 'Elder Shortbow',
    description: 'An ancient shortbow of great power.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 90,
    stats: { range: 56, accuracy: 65, damage: 38 },
    stackable: false,
    value: 3200
  },

  // Longbows
  {
    id: 'longbow',
    name: 'Longbow',
    description: 'A basic longbow with extended range.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 5,
    stats: { range: 12, accuracy: 15, damage: 10 },
    stackable: false,
    value: 150
  },
  {
    id: 'oak_longbow',
    name: 'Oak Longbow',
    description: 'A sturdy oak longbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 20,
    stats: { range: 20, accuracy: 25, damage: 16 },
    stackable: false,
    value: 400
  },
  {
    id: 'willow_longbow',
    name: 'Willow Longbow',
    description: 'A flexible willow longbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 35,
    stats: { range: 30, accuracy: 35, damage: 22 },
    stackable: false,
    value: 700
  },
  {
    id: 'maple_longbow',
    name: 'Maple Longbow',
    description: 'A reliable maple longbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 50,
    stats: { range: 38, accuracy: 42, damage: 28 },
    stackable: false,
    value: 1000
  },
  {
    id: 'yew_longbow',
    name: 'Yew Longbow',
    description: 'A powerful yew longbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 65,
    stats: { range: 46, accuracy: 52, damage: 35 },
    stackable: false,
    value: 1600
  },
  {
    id: 'magic_longbow',
    name: 'Magic Longbow',
    description: 'A magical longbow with superior range.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 80,
    stats: { range: 55, accuracy: 62, damage: 42 },
    stackable: false,
    value: 2600
  },
  {
    id: 'elder_longbow',
    name: 'Elder Longbow',
    description: 'The ultimate longbow of ancient power.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 95,
    stats: { range: 64, accuracy: 75, damage: 50 },
    stackable: false,
    value: 4200
  },

  // Crossbows
  {
    id: 'bronze_crossbow',
    name: 'Bronze Crossbow',
    description: 'A basic crossbow made of bronze.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 10,
    stats: { range: 16, accuracy: 18, damage: 14 },
    stackable: false,
    value: 200
  },
  {
    id: 'iron_crossbow',
    name: 'Iron Crossbow',
    description: 'A sturdy iron crossbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 20,
    stats: { range: 24, accuracy: 28, damage: 20 },
    stackable: false,
    value: 500
  },
  {
    id: 'steel_crossbow',
    name: 'Steel Crossbow',
    description: 'A well-forged steel crossbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 30,
    stats: { range: 32, accuracy: 36, damage: 26 },
    stackable: false,
    value: 800
  },
  {
    id: 'mithril_crossbow',
    name: 'Mithril Crossbow',
    description: 'A magical mithril crossbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 40,
    stats: { range: 40, accuracy: 45, damage: 32 },
    stackable: false,
    value: 1200
  },
  {
    id: 'adamant_crossbow',
    name: 'Adamant Crossbow',
    description: 'A strong adamant crossbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 50,
    stats: { range: 48, accuracy: 55, damage: 38 },
    stackable: false,
    value: 2000
  },
  {
    id: 'rune_crossbow',
    name: 'Rune Crossbow',
    description: 'A powerful rune crossbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 60,
    stats: { range: 56, accuracy: 65, damage: 45 },
    stackable: false,
    value: 3200
  },
  {
    id: 'dragon_crossbow',
    name: 'Dragon Crossbow',
    description: 'A legendary dragon crossbow.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 70,
    stats: { range: 64, accuracy: 75, damage: 52 },
    stackable: false,
    value: 5200
  },
  {
    id: 'barrows_crossbow',
    name: 'Barrows Crossbow',
    description: 'An ancient crossbow from the barrows.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 80,
    stats: { range: 72, accuracy: 85, damage: 58 },
    stackable: false,
    value: 8400
  },
  {
    id: 'primal_crossbow',
    name: 'Primal Crossbow',
    description: 'The ultimate crossbow of primal power.',
    type: 'weapon',
    subType: 'ranged',
    levelRequired: 90,
    stats: { range: 80, accuracy: 95, damage: 65 },
    stackable: false,
    value: 13600
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
  {
    id: 'willow_staff',
    name: 'Willow Staff',
    description: 'A flexible willow staff with enhanced magical properties.',
    type: 'weapon',
    subType: 'magic',
    levelRequired: 30,
    stats: { magic: 23, accuracy: 28, damage: 18 },
    stackable: false,
    value: 400
  },
  {
    id: 'maple_staff',
    name: 'Maple Staff',
    description: 'A reliable maple staff for advanced magic users.',
    type: 'weapon',
    subType: 'magic',
    levelRequired: 45,
    stats: { magic: 32, accuracy: 36, damage: 24 },
    stackable: false,
    value: 600
  },
  {
    id: 'dragon_orb',
    name: 'Dragon Orb',
    description: 'A powerful orb forged from dragon metal, used to create dragon staves.',
    type: 'resource',
    subType: 'component',
    levelRequired: 60,
    stats: { magic: 20 },
    stackable: false,
    value: 1000
  },
  {
    id: 'barrows_orb',
    name: 'Barrows Orb',
    description: 'An ancient orb from the barrows, radiating dark magical energy.',
    type: 'resource',
    subType: 'component',
    levelRequired: 70,
    stats: { magic: 25 },
    stackable: false,
    value: 1800
  },
  {
    id: 'third_age_orb',
    name: 'Third Age Orb',
    description: 'A rare orb from the Third Age, containing immense magical power.',
    type: 'resource',
    subType: 'component',
    levelRequired: 80,
    stats: { magic: 30 },
    stackable: false,
    value: 3600
  },
  {
    id: 'primal_orb',
    name: 'Primal Orb',
    description: 'The ultimate orb of primal magical energy, sought after by master wizards.',
    type: 'resource',
    subType: 'component',
    levelRequired: 90,
    stats: { magic: 35 },
    stackable: false,
    value: 7200
  },
  {
    id: 'dragon_staff',
    name: 'Dragon Staff',
    description: 'A legendary staff combining dragon orb with yew wood.',
    type: 'weapon',
    subType: 'magic',
    levelRequired: 60,
    stats: { magic: 42, accuracy: 45, damage: 30 },
    stackable: false,
    value: 1400
  },
  {
    id: 'barrows_staff',
    name: 'Barrows Staff',
    description: 'An ancient staff from the barrows, infused with dark magic.',
    type: 'weapon',
    subType: 'magic',
    levelRequired: 70,
    stats: { magic: 52, accuracy: 55, damage: 36 },
    stackable: false,
    value: 2400
  },
  {
    id: 'third_age_staff',
    name: 'Third Age Staff',
    description: 'A rare staff from the Third Age, wielding immense magical power.',
    type: 'weapon',
    subType: 'magic',
    levelRequired: 80,
    stats: { magic: 62, accuracy: 65, damage: 42 },
    stackable: false,
    value: 4200
  },
  {
    id: 'primal_staff',
    name: 'Primal Staff',
    description: 'The ultimate staff of primal magical energy, unmatched in power.',
    type: 'weapon',
    subType: 'magic',
    levelRequired: 90,
    stats: { magic: 72, accuracy: 75, damage: 48 },
    stackable: false,
    value: 7800
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
    id: 'steel_bar',
    name: 'Steel Bar',
    description: 'A bar of steel, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 20,
    stackable: true,
    value: 100
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
  {
    id: 'gold_bar',
    name: 'Gold Bar',
    description: 'A bar of gold, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 35,
    stackable: true,
    value: 300
  },
  {
    id: 'adamant_bar',
    name: 'Adamant Bar',
    description: 'A bar of adamant, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 40,
    stackable: true,
    value: 400
  },
  {
    id: 'rune_bar',
    name: 'Rune Bar',
    description: 'A bar of rune, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 50,
    stackable: true,
    value: 800
  },
  {
    id: 'dragon_bar',
    name: 'Dragon Bar',
    description: 'A bar of dragon metal, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 60,
    stackable: true,
    value: 1600
  },
  {
    id: 'barrows_bar',
    name: 'Barrows Bar',
    description: 'A bar of barrows metal, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 70,
    stackable: true,
    value: 3200
  },
  {
    id: 'third_age_bar',
    name: 'Third Age Bar',
    description: 'A bar of third age metal, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 80,
    stackable: true,
    value: 6400
  },
  {
    id: 'primal_bar',
    name: 'Primal Bar',
    description: 'A bar of primal metal, used for smithing.',
    type: 'resource',
    subType: 'bar',
    levelRequired: 90,
    stackable: true,
    value: 12800
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
  },

  // Leather Materials
  {
    id: 'leather',
    name: 'Leather',
    description: 'Basic leather for crafting armor.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 1,
    stackable: true,
    value: 10
  },
  {
    id: 'hard_leather',
    name: 'Hard Leather',
    description: 'Toughened leather for better protection.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 10,
    stackable: true,
    value: 25
  },
  {
    id: 'studded_leather',
    name: 'Studded Leather',
    description: 'Leather reinforced with metal studs.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 20,
    stackable: true,
    value: 50
  },
  {
    id: 'green_dhide',
    name: 'Green Dragonhide',
    description: 'Hide from a green dragon.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 30,
    stackable: true,
    value: 100
  },
  {
    id: 'blue_dhide',
    name: 'Blue Dragonhide',
    description: 'Hide from a blue dragon.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 40,
    stackable: true,
    value: 200
  },
  {
    id: 'red_dhide',
    name: 'Red Dragonhide',
    description: 'Hide from a red dragon.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 50,
    stackable: true,
    value: 400
  },
  {
    id: 'black_dhide',
    name: 'Black Dragonhide',
    description: 'Hide from a black dragon.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 60,
    stackable: true,
    value: 800
  },
  {
    id: 'ancient_dhide',
    name: 'Ancient Dragonhide',
    description: 'Hide from an ancient dragon.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 70,
    stackable: true,
    value: 1600
  },
  {
    id: 'barrows_leather',
    name: 'Barrows Leather',
    description: 'Cursed leather from the barrows.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 80,
    stackable: true,
    value: 3200
  },
  {
    id: 'primal_leather',
    name: 'Primal Leather',
    description: 'Ultimate leather of primal power.',
    type: 'resource',
    subType: 'leather',
    levelRequired: 90,
    stackable: true,
    value: 6400
  },

  // Ranged Armor - Leather Sets
  {
    id: 'leather_coif',
    name: 'Leather Coif',
    description: 'A basic leather coif for ranged protection.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 1,
    stats: { defense: 2, range: 2, accuracy: 1 },
    stackable: false,
    value: 20
  },
  {
    id: 'leather_body',
    name: 'Leather Body',
    description: 'A basic leather body for ranged protection.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 1,
    stats: { defense: 4, range: 3, accuracy: 2 },
    stackable: false,
    value: 40
  },
  {
    id: 'leather_chaps',
    name: 'Leather Chaps',
    description: 'Basic leather chaps for ranged protection.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 1,
    stats: { defense: 3, range: 2, accuracy: 1 },
    stackable: false,
    value: 30
  },
  {
    id: 'leather_vambraces',
    name: 'Leather Vambraces',
    description: 'Basic leather vambraces for ranged protection.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 1,
    stats: { defense: 1, range: 2, accuracy: 1 },
    stackable: false,
    value: 15
  },
  {
    id: 'leather_boots',
    name: 'Leather Boots',
    description: 'Basic leather boots for ranged protection.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 1,
    stats: { defense: 1, range: 1, accuracy: 1 },
    stackable: false,
    value: 15
  },

  // Hard Leather Set
  {
    id: 'hard_leather_coif',
    name: 'Hard Leather Coif',
    description: 'A toughened leather coif for better protection.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 10,
    stats: { defense: 4, range: 4, accuracy: 2 },
    stackable: false,
    value: 50
  },
  {
    id: 'hard_leather_body',
    name: 'Hard Leather Body',
    description: 'A toughened leather body for better protection.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 10,
    stats: { defense: 8, range: 6, accuracy: 3 },
    stackable: false,
    value: 100
  },
  {
    id: 'hard_leather_chaps',
    name: 'Hard Leather Chaps',
    description: 'Toughened leather chaps for better protection.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 10,
    stats: { defense: 6, range: 4, accuracy: 2 },
    stackable: false,
    value: 75
  },
  {
    id: 'hard_leather_vambraces',
    name: 'Hard Leather Vambraces',
    description: 'Toughened leather vambraces for better protection.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 10,
    stats: { defense: 2, range: 3, accuracy: 2 },
    stackable: false,
    value: 40
  },
  {
    id: 'hard_leather_boots',
    name: 'Hard Leather Boots',
    description: 'Toughened leather boots for better protection.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 10,
    stats: { defense: 2, range: 2, accuracy: 2 },
    stackable: false,
    value: 40
  },

  // Studded Leather Set
  {
    id: 'studded_coif',
    name: 'Studded Coif',
    description: 'A studded leather coif with metal reinforcement.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 20,
    stats: { defense: 6, range: 6, accuracy: 3 },
    stackable: false,
    value: 100
  },
  {
    id: 'studded_body',
    name: 'Studded Body',
    description: 'A studded leather body with metal reinforcement.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 20,
    stats: { defense: 12, range: 9, accuracy: 4 },
    stackable: false,
    value: 200
  },
  {
    id: 'studded_chaps',
    name: 'Studded Chaps',
    description: 'Studded leather chaps with metal reinforcement.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 20,
    stats: { defense: 9, range: 6, accuracy: 3 },
    stackable: false,
    value: 150
  },
  {
    id: 'studded_vambraces',
    name: 'Studded Vambraces',
    description: 'Studded leather vambraces with metal reinforcement.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 20,
    stats: { defense: 3, range: 4, accuracy: 3 },
    stackable: false,
    value: 75
  },
  {
    id: 'studded_boots',
    name: 'Studded Boots',
    description: 'Studded leather boots with metal reinforcement.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 20,
    stats: { defense: 3, range: 3, accuracy: 3 },
    stackable: false,
    value: 75
  },

  // Green Dragonhide Set
  {
    id: 'green_dhide_coif',
    name: 'Green D\'hide Coif',
    description: 'A coif made from green dragonhide.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 30,
    stats: { defense: 8, range: 8, accuracy: 4 },
    stackable: false,
    value: 200
  },
  {
    id: 'green_dhide_body',
    name: 'Green D\'hide Body',
    description: 'A body made from green dragonhide.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 30,
    stats: { defense: 16, range: 12, accuracy: 5 },
    stackable: false,
    value: 400
  },
  {
    id: 'green_dhide_chaps',
    name: 'Green D\'hide Chaps',
    description: 'Chaps made from green dragonhide.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 30,
    stats: { defense: 12, range: 8, accuracy: 4 },
    stackable: false,
    value: 300
  },
  {
    id: 'green_dhide_vambraces',
    name: 'Green D\'hide Vambraces',
    description: 'Vambraces made from green dragonhide.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 30,
    stats: { defense: 4, range: 5, accuracy: 4 },
    stackable: false,
    value: 150
  },
  {
    id: 'green_dhide_boots',
    name: 'Green D\'hide Boots',
    description: 'Boots made from green dragonhide.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 30,
    stats: { defense: 4, range: 4, accuracy: 4 },
    stackable: false,
    value: 150
  },

  // Blue Dragonhide Set
  {
    id: 'blue_dhide_coif',
    name: 'Blue D\'hide Coif',
    description: 'A coif made from blue dragonhide.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 40,
    stats: { defense: 10, range: 10, accuracy: 5 },
    stackable: false,
    value: 400
  },
  {
    id: 'blue_dhide_body',
    name: 'Blue D\'hide Body',
    description: 'A body made from blue dragonhide.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 40,
    stats: { defense: 20, range: 15, accuracy: 6 },
    stackable: false,
    value: 800
  },
  {
    id: 'blue_dhide_chaps',
    name: 'Blue D\'hide Chaps',
    description: 'Chaps made from blue dragonhide.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 40,
    stats: { defense: 15, range: 10, accuracy: 5 },
    stackable: false,
    value: 600
  },
  {
    id: 'blue_dhide_vambraces',
    name: 'Blue D\'hide Vambraces',
    description: 'Vambraces made from blue dragonhide.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 40,
    stats: { defense: 5, range: 6, accuracy: 5 },
    stackable: false,
    value: 300
  },
  {
    id: 'blue_dhide_boots',
    name: 'Blue D\'hide Boots',
    description: 'Boots made from blue dragonhide.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 40,
    stats: { defense: 5, range: 5, accuracy: 5 },
    stackable: false,
    value: 300
  },

  // Red Dragonhide Set
  {
    id: 'red_dhide_coif',
    name: 'Red D\'hide Coif',
    description: 'A coif made from red dragonhide.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 50,
    stats: { defense: 12, range: 12, accuracy: 6 },
    stackable: false,
    value: 800
  },
  {
    id: 'red_dhide_body',
    name: 'Red D\'hide Body',
    description: 'A body made from red dragonhide.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 50,
    stats: { defense: 24, range: 18, accuracy: 7 },
    stackable: false,
    value: 1600
  },
  {
    id: 'red_dhide_chaps',
    name: 'Red D\'hide Chaps',
    description: 'Chaps made from red dragonhide.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 50,
    stats: { defense: 18, range: 12, accuracy: 6 },
    stackable: false,
    value: 1200
  },
  {
    id: 'red_dhide_vambraces',
    name: 'Red D\'hide Vambraces',
    description: 'Vambraces made from red dragonhide.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 50,
    stats: { defense: 6, range: 7, accuracy: 6 },
    stackable: false,
    value: 600
  },
  {
    id: 'red_dhide_boots',
    name: 'Red D\'hide Boots',
    description: 'Boots made from red dragonhide.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 50,
    stats: { defense: 6, range: 6, accuracy: 6 },
    stackable: false,
    value: 600
  },

  // Black Dragonhide Set
  {
    id: 'black_dhide_coif',
    name: 'Black D\'hide Coif',
    description: 'A coif made from black dragonhide.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 60,
    stats: { defense: 14, range: 14, accuracy: 7 },
    stackable: false,
    value: 1600
  },
  {
    id: 'black_dhide_body',
    name: 'Black D\'hide Body',
    description: 'A body made from black dragonhide.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 60,
    stats: { defense: 28, range: 21, accuracy: 8 },
    stackable: false,
    value: 3200
  },
  {
    id: 'black_dhide_chaps',
    name: 'Black D\'hide Chaps',
    description: 'Chaps made from black dragonhide.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 60,
    stats: { defense: 21, range: 14, accuracy: 7 },
    stackable: false,
    value: 2400
  },
  {
    id: 'black_dhide_vambraces',
    name: 'Black D\'hide Vambraces',
    description: 'Vambraces made from black dragonhide.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 60,
    stats: { defense: 7, range: 8, accuracy: 7 },
    stackable: false,
    value: 1200
  },
  {
    id: 'black_dhide_boots',
    name: 'Black D\'hide Boots',
    description: 'Boots made from black dragonhide.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 60,
    stats: { defense: 7, range: 7, accuracy: 7 },
    stackable: false,
    value: 1200
  },

  // Ancient Dragonhide Set
  {
    id: 'ancient_dhide_coif',
    name: 'Ancient D\'hide Coif',
    description: 'A coif made from ancient dragonhide.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 70,
    stats: { defense: 16, range: 16, accuracy: 8 },
    stackable: false,
    value: 3200
  },
  {
    id: 'ancient_dhide_body',
    name: 'Ancient D\'hide Body',
    description: 'A body made from ancient dragonhide.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 70,
    stats: { defense: 32, range: 24, accuracy: 9 },
    stackable: false,
    value: 6400
  },
  {
    id: 'ancient_dhide_chaps',
    name: 'Ancient D\'hide Chaps',
    description: 'Chaps made from ancient dragonhide.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 70,
    stats: { defense: 24, range: 16, accuracy: 8 },
    stackable: false,
    value: 4800
  },
  {
    id: 'ancient_dhide_vambraces',
    name: 'Ancient D\'hide Vambraces',
    description: 'Vambraces made from ancient dragonhide.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 70,
    stats: { defense: 8, range: 9, accuracy: 8 },
    stackable: false,
    value: 2400
  },
  {
    id: 'ancient_dhide_boots',
    name: 'Ancient D\'hide Boots',
    description: 'Boots made from ancient dragonhide.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 70,
    stats: { defense: 8, range: 8, accuracy: 8 },
    stackable: false,
    value: 2400
  },

  // Barrows Leather Set
  {
    id: 'barrows_leather_coif',
    name: 'Barrows Leather Coif',
    description: 'A cursed coif made from barrows leather.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 80,
    stats: { defense: 18, range: 18, accuracy: 9 },
    stackable: false,
    value: 6400
  },
  {
    id: 'barrows_leather_body',
    name: 'Barrows Leather Body',
    description: 'A cursed body made from barrows leather.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 80,
    stats: { defense: 36, range: 27, accuracy: 10 },
    stackable: false,
    value: 12800
  },
  {
    id: 'barrows_leather_chaps',
    name: 'Barrows Leather Chaps',
    description: 'Cursed chaps made from barrows leather.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 80,
    stats: { defense: 27, range: 18, accuracy: 9 },
    stackable: false,
    value: 9600
  },
  {
    id: 'barrows_leather_vambraces',
    name: 'Barrows Leather Vambraces',
    description: 'Cursed vambraces made from barrows leather.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 80,
    stats: { defense: 9, range: 10, accuracy: 9 },
    stackable: false,
    value: 4800
  },
  {
    id: 'barrows_leather_boots',
    name: 'Barrows Leather Boots',
    description: 'Cursed boots made from barrows leather.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 80,
    stats: { defense: 9, range: 9, accuracy: 9 },
    stackable: false,
    value: 4800
  },

  // Primal Leather Set
  {
    id: 'primal_leather_coif',
    name: 'Primal Leather Coif',
    description: 'The ultimate coif made from primal leather.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 90,
    stats: { defense: 20, range: 20, accuracy: 10 },
    stackable: false,
    value: 12800
  },
  {
    id: 'primal_leather_body',
    name: 'Primal Leather Body',
    description: 'The ultimate body made from primal leather.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 90,
    stats: { defense: 40, range: 30, accuracy: 11 },
    stackable: false,
    value: 25600
  },
  {
    id: 'primal_leather_chaps',
    name: 'Primal Leather Chaps',
    description: 'Ultimate chaps made from primal leather.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 90,
    stats: { defense: 30, range: 20, accuracy: 10 },
    stackable: false,
    value: 19200
  },
  {
    id: 'primal_leather_vambraces',
    name: 'Primal Leather Vambraces',
    description: 'Ultimate vambraces made from primal leather.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 90,
    stats: { defense: 10, range: 11, accuracy: 10 },
    stackable: false,
    value: 9600
  },
  {
    id: 'primal_leather_boots',
    name: 'Primal Leather Boots',
    description: 'Ultimate boots made from primal leather.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 90,
    stats: { defense: 10, range: 10, accuracy: 10 },
    stackable: false,
    value: 9600
  },

  // Rune Essence
  {
    id: 'rune_essence',
    name: 'Rune Essence',
    description: 'Pure essence used to craft runes.',
    type: 'resource',
    subType: 'essence',
    levelRequired: 1,
    stackable: true,
    value: 5
  },

  // Runes
  {
    id: 'air_rune',
    name: 'Air Rune',
    description: 'A rune containing the power of air.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 1,
    stackable: true,
    value: 10
  },
  {
    id: 'earth_rune',
    name: 'Earth Rune',
    description: 'A rune containing the power of earth.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 1,
    stackable: true,
    value: 10
  },
  {
    id: 'water_rune',
    name: 'Water Rune',
    description: 'A rune containing the power of water.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 5,
    stackable: true,
    value: 12
  },
  {
    id: 'fire_rune',
    name: 'Fire Rune',
    description: 'A rune containing the power of fire.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 9,
    stackable: true,
    value: 15
  },
  {
    id: 'mind_rune',
    name: 'Mind Rune',
    description: 'A rune containing mental power.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 2,
    stackable: true,
    value: 12
  },
  {
    id: 'body_rune',
    name: 'Body Rune',
    description: 'A rune containing physical power.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 20,
    stackable: true,
    value: 25
  },
  {
    id: 'cosmic_rune',
    name: 'Cosmic Rune',
    description: 'A rune containing cosmic power.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 27,
    stackable: true,
    value: 35
  },
  {
    id: 'chaos_rune',
    name: 'Chaos Rune',
    description: 'A rune containing chaotic power.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 35,
    stackable: true,
    value: 50
  },
  {
    id: 'nature_rune',
    name: 'Nature Rune',
    description: 'A rune containing natural power.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 44,
    stackable: true,
    value: 75
  },
  {
    id: 'law_rune',
    name: 'Law Rune',
    description: 'A rune containing lawful power.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 54,
    stackable: true,
    value: 100
  },
  {
    id: 'death_rune',
    name: 'Death Rune',
    description: 'A rune containing the power of death.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 65,
    stackable: true,
    value: 150
  },
  {
    id: 'blood_rune',
    name: 'Blood Rune',
    description: 'A rune containing blood magic.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 77,
    stackable: true,
    value: 300
  },
  {
    id: 'soul_rune',
    name: 'Soul Rune',
    description: 'A rune containing soul power.',
    type: 'resource',
    subType: 'rune',
    levelRequired: 90,
    stackable: true,
    value: 500
  },

  // Talismans for Runecrafting
  {
    id: 'air_talisman',
    name: 'Air Talisman',
    description: 'A talisman that allows access to the Air Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 1,
    stackable: false,
    value: 50
  },
  {
    id: 'earth_talisman',
    name: 'Earth Talisman',
    description: 'A talisman that allows access to the Earth Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 1,
    stackable: false,
    value: 50
  },
  {
    id: 'water_talisman',
    name: 'Water Talisman',
    description: 'A talisman that allows access to the Water Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 5,
    stackable: false,
    value: 75
  },
  {
    id: 'fire_talisman',
    name: 'Fire Talisman',
    description: 'A talisman that allows access to the Fire Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 9,
    stackable: false,
    value: 100
  },
  {
    id: 'mind_talisman',
    name: 'Mind Talisman',
    description: 'A talisman that allows access to the Mind Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 2,
    stackable: false,
    value: 60
  },
  {
    id: 'body_talisman',
    name: 'Body Talisman',
    description: 'A talisman that allows access to the Body Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 20,
    stackable: false,
    value: 200
  },
  {
    id: 'cosmic_talisman',
    name: 'Cosmic Talisman',
    description: 'A talisman that allows access to the Cosmic Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 27,
    stackable: false,
    value: 300
  },
  {
    id: 'chaos_talisman',
    name: 'Chaos Talisman',
    description: 'A talisman that allows access to the Chaos Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 35,
    stackable: false,
    value: 500
  },
  {
    id: 'nature_talisman',
    name: 'Nature Talisman',
    description: 'A talisman that allows access to the Nature Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 44,
    stackable: false,
    value: 750
  },
  {
    id: 'law_talisman',
    name: 'Law Talisman',
    description: 'A talisman that allows access to the Law Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 54,
    stackable: false,
    value: 1000
  },
  {
    id: 'death_talisman',
    name: 'Death Talisman',
    description: 'A talisman that allows access to the Death Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 65,
    stackable: false,
    value: 1500
  },
  {
    id: 'blood_talisman',
    name: 'Blood Talisman',
    description: 'A talisman that allows access to the Blood Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 77,
    stackable: false,
    value: 3000
  },
  {
    id: 'soul_talisman',
    name: 'Soul Talisman',
    description: 'A talisman that allows access to the Soul Altar.',
    type: 'tool',
    subType: 'talisman',
    levelRequired: 90,
    stackable: false,
    value: 5000
  },

  // Cloth materials for magic robes
  {
    id: 'cloth',
    name: 'Cloth',
    description: 'Basic cloth material for crafting robes.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 1,
    stackable: true,
    value: 5
  },
  {
    id: 'soft_cloth',
    name: 'Soft Cloth',
    description: 'Soft cloth material for crafting robes.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 10,
    stackable: true,
    value: 15
  },
  {
    id: 'fine_cloth',
    name: 'Fine Cloth',
    description: 'Fine cloth material for crafting robes.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 20,
    stackable: true,
    value: 35
  },
  {
    id: 'silk_cloth',
    name: 'Silk Cloth',
    description: 'Premium silk cloth for crafting robes.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 30,
    stackable: true,
    value: 75
  },
  {
    id: 'mystic_cloth',
    name: 'Mystic Cloth',
    description: 'Magical cloth imbued with mystical energy.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 40,
    stackable: true,
    value: 150
  },
  {
    id: 'enchanted_cloth',
    name: 'Enchanted Cloth',
    description: 'Cloth woven with enchanted threads.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 50,
    stackable: true,
    value: 300
  },
  {
    id: 'lunar_cloth',
    name: 'Lunar Cloth',
    description: 'Rare cloth blessed by lunar magic.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 60,
    stackable: true,
    value: 600
  },
  {
    id: 'infinity_cloth',
    name: 'Infinity Cloth',
    description: 'Mystical cloth that seems to shimmer with infinite power.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 70,
    stackable: true,
    value: 1200
  },
  {
    id: 'ancestral_cloth',
    name: 'Ancestral Cloth',
    description: 'Ancient cloth woven by master mages of old.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 80,
    stackable: true,
    value: 2400
  },
  {
    id: 'ethereal_cloth',
    name: 'Ethereal Cloth',
    description: 'The ultimate cloth material, shimmering with ethereal energy.',
    type: 'resource',
    subType: 'cloth',
    levelRequired: 90,
    stackable: true,
    value: 4800
  },

  // Magic Robe Sets (T1-90)
  // Wizard Robes (T1) - Level 1
  {
    id: 'wizard_hat',
    name: 'Wizard Hat',
    description: 'A basic pointed hat worn by novice wizards.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 1,
    stats: { defense: 2, magic: 3, accuracy: 5 },
    stackable: false,
    value: 25
  },
  {
    id: 'wizard_robe_top',
    name: 'Wizard Robe Top',
    description: 'Basic robes worn by novice wizards.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 1,
    stats: { defense: 4, magic: 6, accuracy: 8 },
    stackable: false,
    value: 50
  },
  {
    id: 'wizard_robe_bottom',
    name: 'Wizard Robe Bottom',
    description: 'Basic robe bottoms for novice wizards.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 1,
    stats: { defense: 3, magic: 4, accuracy: 6 },
    stackable: false,
    value: 35
  },
  {
    id: 'wizard_gloves',
    name: 'Wizard Gloves',
    description: 'Basic gloves for casting spells.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 1,
    stats: { defense: 1, magic: 2, accuracy: 3 },
    stackable: false,
    value: 15
  },
  {
    id: 'wizard_boots',
    name: 'Wizard Boots',
    description: 'Basic boots for aspiring wizards.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 1,
    stats: { defense: 1, magic: 2, accuracy: 3 },
    stackable: false,
    value: 15
  },

  // Apprentice Robes (T10) - Level 10
  {
    id: 'apprentice_hat',
    name: 'Apprentice Hat',
    description: 'A hat worn by apprentice mages.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 10,
    stats: { defense: 4, magic: 6, accuracy: 8 },
    stackable: false,
    value: 120
  },
  {
    id: 'apprentice_robe_top',
    name: 'Apprentice Robe Top',
    description: 'Robes worn by apprentice mages.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 10,
    stats: { defense: 8, magic: 12, accuracy: 10 },
    stackable: false,
    value: 240
  },
  {
    id: 'apprentice_robe_bottom',
    name: 'Apprentice Robe Bottom',
    description: 'Robe bottoms for apprentice mages.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 10,
    stats: { defense: 6, magic: 8, accuracy: 9 },
    stackable: false,
    value: 180
  },
  {
    id: 'apprentice_gloves',
    name: 'Apprentice Gloves',
    description: 'Gloves that aid in spell casting.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 10,
    stats: { defense: 2, magic: 4, accuracy: 5 },
    stackable: false,
    value: 90
  },
  {
    id: 'apprentice_boots',
    name: 'Apprentice Boots',
    description: 'Boots worn by apprentice mages.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 10,
    stats: { defense: 2, magic: 4, accuracy: 5 },
    stackable: false,
    value: 90
  },

  // Adept Robes (T20) - Level 20
  {
    id: 'adept_hat',
    name: 'Adept Hat',
    description: 'A hat worn by adept mages.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 20,
    stats: { defense: 6, magic: 9, accuracy: 12 },
    stackable: false,
    value: 480
  },
  {
    id: 'adept_robe_top',
    name: 'Adept Robe Top',
    description: 'Robes worn by adept mages.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 20,
    stats: { defense: 12, magic: 18, accuracy: 15 },
    stackable: false,
    value: 960
  },
  {
    id: 'adept_robe_bottom',
    name: 'Adept Robe Bottom',
    description: 'Robe bottoms for adept mages.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 20,
    stats: { defense: 9, magic: 12, accuracy: 13 },
    stackable: false,
    value: 720
  },
  {
    id: 'adept_gloves',
    name: 'Adept Gloves',
    description: 'Gloves that enhance magical abilities.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 20,
    stats: { defense: 3, magic: 6, accuracy: 8 },
    stackable: false,
    value: 360
  },
  {
    id: 'adept_boots',
    name: 'Adept Boots',
    description: 'Boots worn by adept mages.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 20,
    stats: { defense: 3, magic: 6, accuracy: 8 },
    stackable: false,
    value: 360
  },

  // Mystic Robes (T30) - Level 30
  {
    id: 'mystic_hat',
    name: 'Mystic Hat',
    description: 'A mystical hat imbued with magical energy.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 30,
    stats: { defense: 8, magic: 12, accuracy: 15 },
    stackable: false,
    value: 1600
  },
  {
    id: 'mystic_robe_top',
    name: 'Mystic Robe Top',
    description: 'Mystical robes that enhance magical power.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 30,
    stats: { defense: 16, magic: 24, accuracy: 20 },
    stackable: false,
    value: 3200
  },
  {
    id: 'mystic_robe_bottom',
    name: 'Mystic Robe Bottom',
    description: 'Mystical robe bottoms for skilled mages.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 30,
    stats: { defense: 12, magic: 16, accuracy: 17 },
    stackable: false,
    value: 2400
  },
  {
    id: 'mystic_gloves',
    name: 'Mystic Gloves',
    description: 'Gloves that channel mystical energy.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 30,
    stats: { defense: 4, magic: 8, accuracy: 10 },
    stackable: false,
    value: 1200
  },
  {
    id: 'mystic_boots',
    name: 'Mystic Boots',
    description: 'Boots imbued with mystical power.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 30,
    stats: { defense: 4, magic: 8, accuracy: 10 },
    stackable: false,
    value: 1200
  },

  // Enchanted Robes (T40) - Level 40
  {
    id: 'enchanted_hat',
    name: 'Enchanted Hat',
    description: 'A hat enhanced with powerful enchantments.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 40,
    stats: { defense: 10, magic: 15, accuracy: 18 },
    stackable: false,
    value: 3200
  },
  {
    id: 'enchanted_robe_top',
    name: 'Enchanted Robe Top',
    description: 'Robes woven with magical enchantments.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 40,
    stats: { defense: 20, magic: 30, accuracy: 25 },
    stackable: false,
    value: 6400
  },
  {
    id: 'enchanted_robe_bottom',
    name: 'Enchanted Robe Bottom',
    description: 'Enchanted robe bottoms for powerful mages.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 40,
    stats: { defense: 15, magic: 20, accuracy: 21 },
    stackable: false,
    value: 4800
  },
  {
    id: 'enchanted_gloves',
    name: 'Enchanted Gloves',
    description: 'Gloves enhanced with magical enchantments.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 40,
    stats: { defense: 5, magic: 10, accuracy: 12 },
    stackable: false,
    value: 2400
  },
  {
    id: 'enchanted_boots',
    name: 'Enchanted Boots',
    description: 'Boots enhanced with magical properties.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 40,
    stats: { defense: 5, magic: 10, accuracy: 12 },
    stackable: false,
    value: 2400
  },

  // Battlemage Robes (T50) - Level 50
  {
    id: 'battlemage_hat',
    name: 'Battlemage Hat',
    description: 'A hat worn by battle-hardened mages.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 50,
    stats: { defense: 12, magic: 18, accuracy: 22 },
    stackable: false,
    value: 6400
  },
  {
    id: 'battlemage_robe_top',
    name: 'Battlemage Robe Top',
    description: 'Robes designed for combat magic.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 50,
    stats: { defense: 24, magic: 36, accuracy: 30 },
    stackable: false,
    value: 12800
  },
  {
    id: 'battlemage_robe_bottom',
    name: 'Battlemage Robe Bottom',
    description: 'Robe bottoms for battlemages.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 50,
    stats: { defense: 18, magic: 24, accuracy: 25 },
    stackable: false,
    value: 9600
  },
  {
    id: 'battlemage_gloves',
    name: 'Battlemage Gloves',
    description: 'Gloves designed for battle magic.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 50,
    stats: { defense: 6, magic: 12, accuracy: 15 },
    stackable: false,
    value: 4800
  },
  {
    id: 'battlemage_boots',
    name: 'Battlemage Boots',
    description: 'Boots worn by battlemages.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 50,
    stats: { defense: 6, magic: 12, accuracy: 15 },
    stackable: false,
    value: 4800
  },

  // Lunar Robes (T60) - Level 60
  {
    id: 'lunar_hat',
    name: 'Lunar Hat',
    description: 'A hat blessed by lunar magic.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 60,
    stats: { defense: 14, magic: 21, accuracy: 26 },
    stackable: false,
    value: 12800
  },
  {
    id: 'lunar_robe_top',
    name: 'Lunar Robe Top',
    description: 'Robes blessed by the power of the moon.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 60,
    stats: { defense: 28, magic: 42, accuracy: 35 },
    stackable: false,
    value: 25600
  },
  {
    id: 'lunar_robe_bottom',
    name: 'Lunar Robe Bottom',
    description: 'Robe bottoms infused with lunar energy.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 60,
    stats: { defense: 21, magic: 28, accuracy: 29 },
    stackable: false,
    value: 19200
  },
  {
    id: 'lunar_gloves',
    name: 'Lunar Gloves',
    description: 'Gloves blessed by lunar magic.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 60,
    stats: { defense: 7, magic: 14, accuracy: 18 },
    stackable: false,
    value: 9600
  },
  {
    id: 'lunar_boots',
    name: 'Lunar Boots',
    description: 'Boots blessed by the moon.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 60,
    stats: { defense: 7, magic: 14, accuracy: 18 },
    stackable: false,
    value: 9600
  },

  // Infinity Robes (T70) - Level 70
  {
    id: 'infinity_hat',
    name: 'Infinity Hat',
    description: 'A hat that channels infinite magical power.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 70,
    stats: { defense: 16, magic: 24, accuracy: 30 },
    stackable: false,
    value: 25600
  },
  {
    id: 'infinity_robe_top',
    name: 'Infinity Robe Top',
    description: 'Robes that harness infinite magical energy.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 70,
    stats: { defense: 32, magic: 48, accuracy: 40 },
    stackable: false,
    value: 51200
  },
  {
    id: 'infinity_robe_bottom',
    name: 'Infinity Robe Bottom',
    description: 'Robe bottoms imbued with infinite power.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 70,
    stats: { defense: 24, magic: 32, accuracy: 33 },
    stackable: false,
    value: 38400
  },
  {
    id: 'infinity_gloves',
    name: 'Infinity Gloves',
    description: 'Gloves that channel infinite magic.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 70,
    stats: { defense: 8, magic: 16, accuracy: 20 },
    stackable: false,
    value: 19200
  },
  {
    id: 'infinity_boots',
    name: 'Infinity Boots',
    description: 'Boots imbued with infinite magical energy.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 70,
    stats: { defense: 8, magic: 16, accuracy: 20 },
    stackable: false,
    value: 19200
  },

  // Ancestral Robes (T80) - Level 80
  {
    id: 'ancestral_hat',
    name: 'Ancestral Hat',
    description: 'An ancient hat worn by master mages of old.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 80,
    stats: { defense: 18, magic: 27, accuracy: 34 },
    stackable: false,
    value: 51200
  },
  {
    id: 'ancestral_robe_top',
    name: 'Ancestral Robe Top',
    description: 'Ancient robes passed down through generations of master mages.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 80,
    stats: { defense: 36, magic: 54, accuracy: 45 },
    stackable: false,
    value: 102400
  },
  {
    id: 'ancestral_robe_bottom',
    name: 'Ancestral Robe Bottom',
    description: 'Ancient robe bottoms worn by legendary mages.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 80,
    stats: { defense: 27, magic: 36, accuracy: 37 },
    stackable: false,
    value: 76800
  },
  {
    id: 'ancestral_gloves',
    name: 'Ancestral Gloves',
    description: 'Ancient gloves that have channeled countless spells.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 80,
    stats: { defense: 9, magic: 18, accuracy: 22 },
    stackable: false,
    value: 38400
  },
  {
    id: 'ancestral_boots',
    name: 'Ancestral Boots',
    description: 'Ancient boots worn by master mages.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 80,
    stats: { defense: 9, magic: 18, accuracy: 22 },
    stackable: false,
    value: 38400
  },

  // Ethereal Robes (T90) - Level 90
  {
    id: 'ethereal_hat',
    name: 'Ethereal Hat',
    description: 'The ultimate magical hat, shimmering with ethereal energy.',
    type: 'armor',
    subType: 'helmet',
    levelRequired: 90,
    stats: { defense: 20, magic: 30, accuracy: 38 },
    stackable: false,
    value: 102400
  },
  {
    id: 'ethereal_robe_top',
    name: 'Ethereal Robe Top',
    description: 'The ultimate magical robes, crafted from ethereal energy.',
    type: 'armor',
    subType: 'chest',
    levelRequired: 90,
    stats: { defense: 40, magic: 60, accuracy: 50 },
    stackable: false,
    value: 204800
  },
  {
    id: 'ethereal_robe_bottom',
    name: 'Ethereal Robe Bottom',
    description: 'Ultimate robe bottoms that transcend physical reality.',
    type: 'armor',
    subType: 'legs',
    levelRequired: 90,
    stats: { defense: 30, magic: 40, accuracy: 42 },
    stackable: false,
    value: 153600
  },
  {
    id: 'ethereal_gloves',
    name: 'Ethereal Gloves',
    description: 'Ultimate gloves that channel pure magical essence.',
    type: 'armor',
    subType: 'gloves',
    levelRequired: 90,
    stats: { defense: 10, magic: 20, accuracy: 25 },
    stackable: false,
    value: 76800
  },
  {
    id: 'ethereal_boots',
    name: 'Ethereal Boots',
    description: 'Ultimate boots that seem to float above the ground.',
    type: 'armor',
    subType: 'boots',
    levelRequired: 90,
    stats: { defense: 10, magic: 20, accuracy: 25 },
    stackable: false,
    value: 76800
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