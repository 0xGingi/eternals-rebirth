import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

const smithingRecipes = [
  // Swords
  { 
    id: 'bronze_sword',
    name: 'Bronze Sword',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 50,
    quantity: 1
  },
  { 
    id: 'iron_sword',
    name: 'Iron Sword',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 100,
    quantity: 1
  },
  { 
    id: 'steel_sword',
    name: 'Steel Sword',
    materials: [{ item: 'steel_bar', quantity: 1 }],
    level: 20,
    experience: 125,
    quantity: 1
  },
  { 
    id: 'mithril_sword',
    name: 'Mithril Sword',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 200,
    quantity: 1
  },
  { 
    id: 'adamant_sword',
    name: 'Adamant Sword',
    materials: [{ item: 'adamant_bar', quantity: 1 }],
    level: 40,
    experience: 300,
    quantity: 1
  },
  { 
    id: 'rune_sword',
    name: 'Rune Sword',
    materials: [{ item: 'rune_bar', quantity: 1 }],
    level: 50,
    experience: 500,
    quantity: 1
  },
  { 
    id: 'dragon_sword',
    name: 'Dragon Sword',
    materials: [{ item: 'dragon_bar', quantity: 1 }],
    level: 60,
    experience: 750,
    quantity: 1
  },
  { 
    id: 'barrows_sword',
    name: 'Barrows Sword',
    materials: [{ item: 'barrows_bar', quantity: 1 }],
    level: 70,
    experience: 1000,
    quantity: 1
  },
  { 
    id: 'third_age_sword',
    name: 'Third Age Sword',
    materials: [{ item: 'third_age_bar', quantity: 1 }],
    level: 80,
    experience: 1500,
    quantity: 1
  },
  { 
    id: 'primal_sword',
    name: 'Primal Sword',
    materials: [{ item: 'primal_bar', quantity: 1 }],
    level: 90,
    experience: 2000,
    quantity: 1
  },

  // Helmets
  { 
    id: 'bronze_helmet',
    name: 'Bronze Helmet',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 35,
    quantity: 1
  },
  { 
    id: 'iron_helmet',
    name: 'Iron Helmet',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 70,
    quantity: 1
  },
  { 
    id: 'steel_helmet',
    name: 'Steel Helmet',
    materials: [{ item: 'steel_bar', quantity: 1 }],
    level: 20,
    experience: 90,
    quantity: 1
  },
  { 
    id: 'mithril_helmet',
    name: 'Mithril Helmet',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 140,
    quantity: 1
  },
  { 
    id: 'adamant_helmet',
    name: 'Adamant Helmet',
    materials: [{ item: 'adamant_bar', quantity: 1 }],
    level: 40,
    experience: 210,
    quantity: 1
  },
  { 
    id: 'rune_helmet',
    name: 'Rune Helmet',
    materials: [{ item: 'rune_bar', quantity: 1 }],
    level: 50,
    experience: 350,
    quantity: 1
  },
  { 
    id: 'dragon_helmet',
    name: 'Dragon Helmet',
    materials: [{ item: 'dragon_bar', quantity: 1 }],
    level: 60,
    experience: 525,
    quantity: 1
  },
  { 
    id: 'barrows_helmet',
    name: 'Barrows Helmet',
    materials: [{ item: 'barrows_bar', quantity: 1 }],
    level: 70,
    experience: 700,
    quantity: 1
  },
  { 
    id: 'third_age_helmet',
    name: 'Third Age Helmet',
    materials: [{ item: 'third_age_bar', quantity: 1 }],
    level: 80,
    experience: 1050,
    quantity: 1
  },
  { 
    id: 'primal_helmet',
    name: 'Primal Helmet',
    materials: [{ item: 'primal_bar', quantity: 1 }],
    level: 90,
    experience: 1400,
    quantity: 1
  },

  // Chestplates
  { 
    id: 'bronze_chestplate',
    name: 'Bronze Chestplate',
    materials: [{ item: 'bronze_bar', quantity: 3 }],
    level: 1,
    experience: 100,
    quantity: 1
  },
  { 
    id: 'iron_chestplate',
    name: 'Iron Chestplate',
    materials: [{ item: 'iron_bar', quantity: 3 }],
    level: 15,
    experience: 200,
    quantity: 1
  },
  { 
    id: 'steel_chestplate',
    name: 'Steel Chestplate',
    materials: [{ item: 'steel_bar', quantity: 3 }],
    level: 20,
    experience: 250,
    quantity: 1
  },
  { 
    id: 'mithril_chestplate',
    name: 'Mithril Chestplate',
    materials: [{ item: 'mithril_bar', quantity: 3 }],
    level: 30,
    experience: 400,
    quantity: 1
  },
  { 
    id: 'adamant_chestplate',
    name: 'Adamant Chestplate',
    materials: [{ item: 'adamant_bar', quantity: 3 }],
    level: 40,
    experience: 600,
    quantity: 1
  },
  { 
    id: 'rune_chestplate',
    name: 'Rune Chestplate',
    materials: [{ item: 'rune_bar', quantity: 3 }],
    level: 50,
    experience: 1000,
    quantity: 1
  },
  { 
    id: 'dragon_chestplate',
    name: 'Dragon Chestplate',
    materials: [{ item: 'dragon_bar', quantity: 3 }],
    level: 60,
    experience: 1500,
    quantity: 1
  },
  { 
    id: 'barrows_chestplate',
    name: 'Barrows Chestplate',
    materials: [{ item: 'barrows_bar', quantity: 3 }],
    level: 70,
    experience: 2000,
    quantity: 1
  },
  { 
    id: 'third_age_chestplate',
    name: 'Third Age Chestplate',
    materials: [{ item: 'third_age_bar', quantity: 3 }],
    level: 80,
    experience: 3000,
    quantity: 1
  },
  { 
    id: 'primal_chestplate',
    name: 'Primal Chestplate',
    materials: [{ item: 'primal_bar', quantity: 3 }],
    level: 90,
    experience: 4000,
    quantity: 1
  },

  // Legs
  { 
    id: 'bronze_legs',
    name: 'Bronze Legs',
    materials: [{ item: 'bronze_bar', quantity: 2 }],
    level: 1,
    experience: 75,
    quantity: 1
  },
  { 
    id: 'iron_legs',
    name: 'Iron Legs',
    materials: [{ item: 'iron_bar', quantity: 2 }],
    level: 15,
    experience: 150,
    quantity: 1
  },
  { 
    id: 'steel_legs',
    name: 'Steel Legs',
    materials: [{ item: 'steel_bar', quantity: 2 }],
    level: 20,
    experience: 190,
    quantity: 1
  },
  { 
    id: 'mithril_legs',
    name: 'Mithril Legs',
    materials: [{ item: 'mithril_bar', quantity: 2 }],
    level: 30,
    experience: 300,
    quantity: 1
  },
  { 
    id: 'adamant_legs',
    name: 'Adamant Legs',
    materials: [{ item: 'adamant_bar', quantity: 2 }],
    level: 40,
    experience: 450,
    quantity: 1
  },
  { 
    id: 'rune_legs',
    name: 'Rune Legs',
    materials: [{ item: 'rune_bar', quantity: 2 }],
    level: 50,
    experience: 750,
    quantity: 1
  },
  { 
    id: 'dragon_legs',
    name: 'Dragon Legs',
    materials: [{ item: 'dragon_bar', quantity: 2 }],
    level: 60,
    experience: 1125,
    quantity: 1
  },
  { 
    id: 'barrows_legs',
    name: 'Barrows Legs',
    materials: [{ item: 'barrows_bar', quantity: 2 }],
    level: 70,
    experience: 1500,
    quantity: 1
  },
  { 
    id: 'third_age_legs',
    name: 'Third Age Legs',
    materials: [{ item: 'third_age_bar', quantity: 2 }],
    level: 80,
    experience: 2250,
    quantity: 1
  },
  { 
    id: 'primal_legs',
    name: 'Primal Legs',
    materials: [{ item: 'primal_bar', quantity: 2 }],
    level: 90,
    experience: 3000,
    quantity: 1
  },

  // Gloves
  { 
    id: 'bronze_gloves',
    name: 'Bronze Gloves',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 25,
    quantity: 1
  },
  { 
    id: 'iron_gloves',
    name: 'Iron Gloves',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 50,
    quantity: 1
  },
  { 
    id: 'steel_gloves',
    name: 'Steel Gloves',
    materials: [{ item: 'steel_bar', quantity: 1 }],
    level: 20,
    experience: 65,
    quantity: 1
  },
  { 
    id: 'mithril_gloves',
    name: 'Mithril Gloves',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 100,
    quantity: 1
  },
  { 
    id: 'adamant_gloves',
    name: 'Adamant Gloves',
    materials: [{ item: 'adamant_bar', quantity: 1 }],
    level: 40,
    experience: 150,
    quantity: 1
  },
  { 
    id: 'rune_gloves',
    name: 'Rune Gloves',
    materials: [{ item: 'rune_bar', quantity: 1 }],
    level: 50,
    experience: 250,
    quantity: 1
  },
  { 
    id: 'dragon_gloves',
    name: 'Dragon Gloves',
    materials: [{ item: 'dragon_bar', quantity: 1 }],
    level: 60,
    experience: 375,
    quantity: 1
  },
  { 
    id: 'barrows_gloves',
    name: 'Barrows Gloves',
    materials: [{ item: 'barrows_bar', quantity: 1 }],
    level: 70,
    experience: 500,
    quantity: 1
  },
  { 
    id: 'third_age_gloves',
    name: 'Third Age Gloves',
    materials: [{ item: 'third_age_bar', quantity: 1 }],
    level: 80,
    experience: 750,
    quantity: 1
  },
  { 
    id: 'primal_gloves',
    name: 'Primal Gloves',
    materials: [{ item: 'primal_bar', quantity: 1 }],
    level: 90,
    experience: 1000,
    quantity: 1
  },

  // Boots
  { 
    id: 'bronze_boots',
    name: 'Bronze Boots',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 25,
    quantity: 1
  },
  { 
    id: 'iron_boots',
    name: 'Iron Boots',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 50,
    quantity: 1
  },
  { 
    id: 'steel_boots',
    name: 'Steel Boots',
    materials: [{ item: 'steel_bar', quantity: 1 }],
    level: 20,
    experience: 65,
    quantity: 1
  },
  { 
    id: 'mithril_boots',
    name: 'Mithril Boots',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 100,
    quantity: 1
  },
  { 
    id: 'adamant_boots',
    name: 'Adamant Boots',
    materials: [{ item: 'adamant_bar', quantity: 1 }],
    level: 40,
    experience: 150,
    quantity: 1
  },
  { 
    id: 'rune_boots',
    name: 'Rune Boots',
    materials: [{ item: 'rune_bar', quantity: 1 }],
    level: 50,
    experience: 250,
    quantity: 1
  },
  { 
    id: 'dragon_boots',
    name: 'Dragon Boots',
    materials: [{ item: 'dragon_bar', quantity: 1 }],
    level: 60,
    experience: 375,
    quantity: 1
  },
  { 
    id: 'barrows_boots',
    name: 'Barrows Boots',
    materials: [{ item: 'barrows_bar', quantity: 1 }],
    level: 70,
    experience: 500,
    quantity: 1
  },
  { 
    id: 'third_age_boots',
    name: 'Third Age Boots',
    materials: [{ item: 'third_age_bar', quantity: 1 }],
    level: 80,
    experience: 750,
    quantity: 1
  },
  { 
    id: 'primal_boots',
    name: 'Primal Boots',
    materials: [{ item: 'primal_bar', quantity: 1 }],
    level: 90,
    experience: 1000,
    quantity: 1
  },

  // Shields
  { 
    id: 'bronze_shield',
    name: 'Bronze Shield',
    materials: [{ item: 'bronze_bar', quantity: 2 }],
    level: 1,
    experience: 75,
    quantity: 1
  },
  { 
    id: 'iron_shield',
    name: 'Iron Shield',
    materials: [{ item: 'iron_bar', quantity: 2 }],
    level: 15,
    experience: 150,
    quantity: 1
  },
  { 
    id: 'steel_shield',
    name: 'Steel Shield',
    materials: [{ item: 'steel_bar', quantity: 2 }],
    level: 20,
    experience: 190,
    quantity: 1
  },
  { 
    id: 'mithril_shield',
    name: 'Mithril Shield',
    materials: [{ item: 'mithril_bar', quantity: 2 }],
    level: 30,
    experience: 300,
    quantity: 1
  },
  { 
    id: 'adamant_shield',
    name: 'Adamant Shield',
    materials: [{ item: 'adamant_bar', quantity: 2 }],
    level: 40,
    experience: 450,
    quantity: 1
  },
  { 
    id: 'rune_shield',
    name: 'Rune Shield',
    materials: [{ item: 'rune_bar', quantity: 2 }],
    level: 50,
    experience: 750,
    quantity: 1
  },
  { 
    id: 'dragon_shield',
    name: 'Dragon Shield',
    materials: [{ item: 'dragon_bar', quantity: 2 }],
    level: 60,
    experience: 1125,
    quantity: 1
  },
  { 
    id: 'barrows_shield',
    name: 'Barrows Shield',
    materials: [{ item: 'barrows_bar', quantity: 2 }],
    level: 70,
    experience: 1500,
    quantity: 1
  },
  { 
    id: 'third_age_shield',
    name: 'Third Age Shield',
    materials: [{ item: 'third_age_bar', quantity: 2 }],
    level: 80,
    experience: 2250,
    quantity: 1
  },
  { 
    id: 'primal_shield',
    name: 'Primal Shield',
    materials: [{ item: 'primal_bar', quantity: 2 }],
    level: 90,
    experience: 3000,
    quantity: 1
  },

  // Tools
  { 
    id: 'bronze_pickaxe',
    name: 'Bronze Pickaxe',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 40,
    quantity: 1
  },
  { 
    id: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 80,
    quantity: 1
  },
  { 
    id: 'bronze_axe',
    name: 'Bronze Axe',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 40,
    quantity: 1
  },
  { 
    id: 'iron_axe',
    name: 'Iron Axe',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 80,
    quantity: 1
  },
  { 
    id: 'mithril_pickaxe',
    name: 'Mithril Pickaxe',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 120,
    quantity: 1
  },
  { 
    id: 'adamant_pickaxe',
    name: 'Adamant Pickaxe',
    materials: [{ item: 'adamant_bar', quantity: 1 }],
    level: 40,
    experience: 200,
    quantity: 1
  },
  { 
    id: 'rune_pickaxe',
    name: 'Rune Pickaxe',
    materials: [{ item: 'rune_bar', quantity: 1 }],
    level: 50,
    experience: 350,
    quantity: 1
  },
  { 
    id: 'dragon_pickaxe',
    name: 'Dragon Pickaxe',
    materials: [{ item: 'dragon_bar', quantity: 1 }],
    level: 60,
    experience: 500,
    quantity: 1
  },
  { 
    id: 'barrows_pickaxe',
    name: 'Barrows Pickaxe',
    materials: [{ item: 'barrows_bar', quantity: 1 }],
    level: 70,
    experience: 700,
    quantity: 1
  },
  { 
    id: 'third_age_pickaxe',
    name: 'Third Age Pickaxe',
    materials: [{ item: 'third_age_bar', quantity: 1 }],
    level: 80,
    experience: 1000,
    quantity: 1
  },
  { 
    id: 'primal_pickaxe',
    name: 'Primal Pickaxe',
    materials: [{ item: 'primal_bar', quantity: 1 }],
    level: 90,
    experience: 1500,
    quantity: 1
  },
  { 
    id: 'mithril_axe',
    name: 'Mithril Axe',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 120,
    quantity: 1
  },
  { 
    id: 'adamant_axe',
    name: 'Adamant Axe',
    materials: [{ item: 'adamant_bar', quantity: 1 }],
    level: 40,
    experience: 200,
    quantity: 1
  },
  { 
    id: 'rune_axe',
    name: 'Rune Axe',
    materials: [{ item: 'rune_bar', quantity: 1 }],
    level: 50,
    experience: 350,
    quantity: 1
  },
  { 
    id: 'dragon_axe',
    name: 'Dragon Axe',
    materials: [{ item: 'dragon_bar', quantity: 1 }],
    level: 60,
    experience: 500,
    quantity: 1
  },
  { 
    id: 'barrows_axe',
    name: 'Barrows Axe',
    materials: [{ item: 'barrows_bar', quantity: 1 }],
    level: 70,
    experience: 700,
    quantity: 1
  },
  { 
    id: 'third_age_axe',
    name: 'Third Age Axe',
    materials: [{ item: 'third_age_bar', quantity: 1 }],
    level: 80,
    experience: 1000,
    quantity: 1
  },
  { 
    id: 'primal_axe',
    name: 'Primal Axe',
    materials: [{ item: 'primal_bar', quantity: 1 }],
    level: 90,
    experience: 1500,
    quantity: 1
  },

  // Arrow heads
  { 
    id: 'bronze_arrow_head',
    name: 'Bronze Arrow Head',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 25,
    quantity: 15
  },
  { 
    id: 'iron_arrow_head',
    name: 'Iron Arrow Head',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 50,
    quantity: 15
  },

  // Fishing Rods
  { 
    id: 'iron_fishing_rod',
    name: 'Iron Fishing Rod',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 80,
    quantity: 1
  },
  { 
    id: 'mithril_fishing_rod',
    name: 'Mithril Fishing Rod',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 120,
    quantity: 1
  },
  { 
    id: 'adamant_fishing_rod',
    name: 'Adamant Fishing Rod',
    materials: [{ item: 'adamant_bar', quantity: 1 }],
    level: 40,
    experience: 200,
    quantity: 1
  },
  { 
    id: 'rune_fishing_rod',
    name: 'Rune Fishing Rod',
    materials: [{ item: 'rune_bar', quantity: 1 }],
    level: 50,
    experience: 350,
    quantity: 1
  },
  { 
    id: 'dragon_fishing_rod',
    name: 'Dragon Fishing Rod',
    materials: [{ item: 'dragon_bar', quantity: 1 }],
    level: 60,
    experience: 500,
    quantity: 1
  },
  { 
    id: 'barrows_fishing_rod',
    name: 'Barrows Fishing Rod',
    materials: [{ item: 'barrows_bar', quantity: 1 }],
    level: 70,
    experience: 700,
    quantity: 1
  },
  { 
    id: 'third_age_fishing_rod',
    name: 'Third Age Fishing Rod',
    materials: [{ item: 'third_age_bar', quantity: 1 }],
    level: 80,
    experience: 1000,
    quantity: 1
  },
  { 
    id: 'primal_fishing_rod',
    name: 'Primal Fishing Rod',
    materials: [{ item: 'primal_bar', quantity: 1 }],
    level: 90,
    experience: 1500,
    quantity: 1
  },
];

const smeltingRecipes = [
  {
    id: 'bronze_bar',
    name: 'Bronze Bar',
    materials: [{ item: 'copper_ore', quantity: 1 }, { item: 'tin_ore', quantity: 1 }],
    level: 1,
    experience: 30,
    quantity: 1
  },
  {
    id: 'iron_bar',
    name: 'Iron Bar', 
    materials: [{ item: 'iron_ore', quantity: 1 }, { item: 'coal', quantity: 1 }],
    level: 15,
    experience: 70,
    quantity: 1
  },
  {
    id: 'steel_bar',
    name: 'Steel Bar',
    materials: [{ item: 'iron_ore', quantity: 1 }, { item: 'coal', quantity: 2 }],
    level: 20,
    experience: 100,
    quantity: 1
  },
  {
    id: 'mithril_bar',
    name: 'Mithril Bar',
    materials: [{ item: 'mithril_ore', quantity: 1 }, { item: 'coal', quantity: 4 }],
    level: 30,
    experience: 150,
    quantity: 1
  },
  {
    id: 'gold_bar',
    name: 'Gold Bar',
    materials: [{ item: 'gold_ore', quantity: 5 }],
    level: 35,
    experience: 200,
    quantity: 1
  },
  {
    id: 'adamant_bar',
    name: 'Adamant Bar',
    materials: [{ item: 'adamant_ore', quantity: 1 }, { item: 'coal', quantity: 6 }],
    level: 40,
    experience: 250,
    quantity: 1
  },
  {
    id: 'rune_bar',
    name: 'Rune Bar',
    materials: [{ item: 'rune_ore', quantity: 1 }, { item: 'coal', quantity: 8 }],
    level: 50,
    experience: 500,
    quantity: 1
  },
  {
    id: 'dragon_bar',
    name: 'Dragon Bar',
    materials: [{ item: 'dragon_ore', quantity: 1 }, { item: 'coal', quantity: 10 }],
    level: 60,
    experience: 750,
    quantity: 1
  },
  {
    id: 'barrows_bar',
    name: 'Barrows Bar',
    materials: [{ item: 'barrows_ore', quantity: 1 }, { item: 'coal', quantity: 12 }],
    level: 70,
    experience: 1000,
    quantity: 1
  },
  {
    id: 'third_age_bar',
    name: 'Third Age Bar',
    materials: [{ item: 'third_age_ore', quantity: 1 }, { item: 'coal', quantity: 15 }],
    level: 80,
    experience: 1500,
    quantity: 1
  },
  {
    id: 'primal_bar',
    name: 'Primal Bar',
    materials: [{ item: 'primal_ore', quantity: 1 }, { item: 'coal', quantity: 20 }],
    level: 90,
    experience: 2000,
    quantity: 1
  },
];

export const data = new SlashCommandBuilder()
  .setName('smith')
  .setDescription('Smith items or smelt ores')
  .addStringOption(option =>
    option.setName('action')
      .setDescription('What to do')
      .setRequired(true)
      .addChoices(
        { name: 'Smelt', value: 'smelt' },
        { name: 'Smith', value: 'smith' }
      )
  )
  .addStringOption(option =>
    option.setName('item')
      .setDescription('The item to create')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many to create (default: 1)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(100)
  );

export async function autocomplete(interaction: any) {
  const focusedValue = interaction.options.getFocused();
  const focusedOption = interaction.options.getFocused(true);
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    if (!player) {
      await interaction.respond([]);
      return;
    }

    if (focusedOption.name === 'item') {
      const action = interaction.options.getString('action');
      if (!action) {
        // Provide helpful message when no action is selected
        await interaction.respond([
          { name: 'Please select an action (smelt/smith) first', value: 'no_action' }
        ]);
        return;
      }

      const availableItems = [];
      const recipes = action === 'smelt' ? smeltingRecipes : smithingRecipes;

      for (const recipe of recipes) {
        // Check if player has required materials
        const hasAllMaterials = recipe.materials.every(material => {
          const invItem = player.inventory.find(item => item.itemId === material.item);
          return invItem && invItem.quantity >= material.quantity;
        });

        if (hasAllMaterials) {
          const materialsText = recipe.materials.map(m => `${m.quantity}x ${m.item}`).join(', ');
          const name = `${recipe.name} (Requires: ${materialsText})`;
          if (name.toLowerCase().includes(focusedValue.toLowerCase())) {
            availableItems.push({
              name: name,
              value: recipe.id
            });
          }
        }
      }

      // Limit to 25 choices (Discord limit)
      const choices = availableItems.slice(0, 25);
      await interaction.respond(choices);
    }
  } catch (error) {
    console.error('Error in smith autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const action = interaction.options.getString('action');
  const itemName = interaction.options.getString('item')?.toLowerCase();
  const requestedQuantity = interaction.options.getInteger('quantity') || 1;

  try {
    const player = await Player.findOne({ userId });
    
    if (!player) {
      await interaction.reply({
        content: 'You need to register first! Use `/register` to create your character.',
        ephemeral: true
      });
      return;
    }

    if (player.inCombat) {
      await interaction.reply({
        content: 'You cannot smith while in combat!',
        ephemeral: true
      });
      return;
    }

    if (player.isSkilling) {
      const timeRemaining = player.skillingEndTime ? Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000) : 0;
      await interaction.reply({
        content: `You are already ${player.currentSkill}! Please wait ${timeRemaining} seconds.`,
        ephemeral: true
      });
      return;
    }

    const smithingLevel = calculateLevelFromExperience(player.skills?.smithing?.experience || 0);
    let recipe;
    
    if (action === 'smelt') {
      recipe = smeltingRecipes.find(r => 
        r.name.toLowerCase().includes(itemName!) || 
        r.id.toLowerCase().includes(itemName!)
      );
    } else {
      recipe = smithingRecipes.find(r => 
        r.name.toLowerCase().includes(itemName!) || 
        r.id.toLowerCase().includes(itemName!)
      );
    }
    
    if (!recipe) {
      await interaction.reply({
        content: `That item cannot be ${action}ed!`,
        ephemeral: true
      });
      return;
    }

    if (smithingLevel < recipe.level) {
      await interaction.reply({
        content: `You need smithing level ${recipe.level} to ${action} this item!`,
        ephemeral: true
      });
      return;
    }

    // Calculate maximum possible actions based on available materials
    let maxActions = requestedQuantity;
    for (const material of recipe.materials) {
      const inventoryItem = player.inventory.find(item => item.itemId === material.item);
      if (!inventoryItem) {
        await interaction.reply({
          content: `You need ${material.quantity}x ${material.item} to ${action} this item!`,
          ephemeral: true
        });
        return;
      }
      const possibleActions = Math.floor(inventoryItem.quantity / material.quantity);
      maxActions = Math.min(maxActions, possibleActions);
    }

    if (maxActions === 0) {
      await interaction.reply({
        content: `You don't have enough materials to ${action} this item!`,
        ephemeral: true
      });
      return;
    }

    if (maxActions === 1) {
      for (const material of recipe.materials) {
        const inventoryItem = player.inventory.find(item => item.itemId === material.item);
        if (inventoryItem) {
          inventoryItem.quantity -= material.quantity * maxActions;
          if (inventoryItem.quantity <= 0) {
            const filteredInventory = player.inventory.filter(item => item.itemId !== material.item);
            player.inventory.splice(0, player.inventory.length, ...filteredInventory);
          }
        }
      }

      const totalExperience = recipe.experience * maxActions;
      const expResult = addExperience(player.skills?.smithing?.experience || 0, totalExperience);
      if (player.skills?.smithing) {
        player.skills.smithing.experience = expResult.newExp;
      }

      const totalItemsCreated = recipe.quantity * maxActions;
      const createdItem = player.inventory.find(item => item.itemId === recipe.id);
      if (createdItem) {
        createdItem.quantity += totalItemsCreated;
      } else {
        player.inventory.push({ itemId: recipe.id, quantity: totalItemsCreated });
      }

      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x808080)
        .setTitle(`${action === 'smelt' ? 'Smelting' : 'Smithing'} Success!`)
        .setDescription(`You successfully ${action}ed **${recipe.name}**!`)
        .addFields(
          { name: 'Experience Gained', value: `${totalExperience} Smithing XP`, inline: true },
          { name: 'Items Created', value: `${recipe.name} x${totalItemsCreated}`, inline: true },
          { name: 'Materials Used', value: recipe.materials.map(m => `${m.item} x${m.quantity * maxActions}`).join('\n'), inline: true }
        );

      if (expResult.leveledUp) {
        embed.addFields({ name: 'Level Up!', value: `Smithing level is now ${expResult.newLevel}!`, inline: false });
      }

      await interaction.reply({ embeds: [embed] });
    } else {
      const minTime = maxActions * 2000;
      const maxTime = maxActions * 8000;
      const totalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

      player.isSkilling = true;
      player.currentSkill = 'smithing';
      player.skillingEndTime = new Date(Date.now() + totalTime);
      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x808080)
        .setTitle(`${action === 'smelt' ? 'Smelting' : 'Smithing'} in Progress...`)
        .setDescription(`You begin ${action}ing **${maxActions}x ${recipe.name}**...`)
        .addFields(
          { name: 'Expected Time', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true },
          { name: 'Target', value: `${recipe.name} x${maxActions}`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        try {
          const updatedPlayer = await Player.findOne({ userId });
          if (!updatedPlayer) return;

          for (const material of recipe.materials) {
            const inventoryItem = updatedPlayer.inventory.find(item => item.itemId === material.item);
            if (inventoryItem) {
              inventoryItem.quantity -= material.quantity * maxActions;
              if (inventoryItem.quantity <= 0) {
                const filteredInventory = updatedPlayer.inventory.filter(item => item.itemId !== material.item);
                updatedPlayer.inventory.splice(0, updatedPlayer.inventory.length, ...filteredInventory);
              }
            }
          }

          const totalExperience = recipe.experience * maxActions;
          const expResult = addExperience(updatedPlayer.skills?.smithing?.experience || 0, totalExperience);
          if (updatedPlayer.skills?.smithing) {
            updatedPlayer.skills.smithing.experience = expResult.newExp;
          }

          const totalItemsCreated = recipe.quantity * maxActions;
          const createdItem = updatedPlayer.inventory.find(item => item.itemId === recipe.id);
          if (createdItem) {
            createdItem.quantity += totalItemsCreated;
          } else {
            updatedPlayer.inventory.push({ itemId: recipe.id, quantity: totalItemsCreated });
          }

          updatedPlayer.isSkilling = false;
          updatedPlayer.currentSkill = null as any;
          updatedPlayer.skillingEndTime = null as any;
          await updatedPlayer.save();

          const completedEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`${action === 'smelt' ? 'Smelting' : 'Smithing'} Complete!`)
            .setDescription(`You successfully ${action}ed **${maxActions}x ${recipe.name}**!`)
            .addFields(
              { name: 'Experience Gained', value: `${totalExperience} Smithing XP`, inline: true },
              { name: 'Items Created', value: `${recipe.name} x${totalItemsCreated}`, inline: true },
              { name: 'Time Taken', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true }
            );

          if (maxActions < requestedQuantity) {
            completedEmbed.addFields({ name: 'Note', value: `Only ${action}ed ${maxActions} out of ${requestedQuantity} requested (insufficient materials)`, inline: false });
          }

          if (expResult.leveledUp) {
            completedEmbed.addFields({ name: 'Level Up!', value: `Smithing level is now ${expResult.newLevel}!`, inline: false });
          }

          try {
            await interaction.followUp({ embeds: [completedEmbed] });
          } catch (followUpError) {
            console.error('Error sending follow-up message:', followUpError);
            await interaction.channel?.send({ embeds: [completedEmbed] });
          }
        } catch (error) {
          console.error('Error completing smithing:', error);
          const errorPlayer = await Player.findOne({ userId });
          if (errorPlayer) {
            errorPlayer.isSkilling = false;
            errorPlayer.currentSkill = null as any;
            errorPlayer.skillingEndTime = null as any;
            await errorPlayer.save();
          }
          
          try {
            await interaction.editReply({
              content: 'An error occurred while completing smithing. Please try again.',
            });
          } catch (editError: any) {
            if (editError.code === 50027) {
              console.log('Smithing failed and interaction expired');
            } else {
              console.error('Error editing reply:', editError);
            }
          }
        }
      }, totalTime);
    }
  } catch (error) {
    console.error('Error smithing:', error);
    await interaction.reply({
      content: 'An error occurred while smithing. Please try again.',
      ephemeral: true
    });
  }
}