import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Area } from '../models/Area';
import { Item } from '../models/Item';

const ITEMS_PER_PAGE = 10;

const smithingRecipes = [
  // Weapons - Swords
  { id: 'bronze_sword', name: 'Bronze Sword', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 50, quantity: 1 },
  { id: 'iron_sword', name: 'Iron Sword', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 100, quantity: 1 },
  { id: 'steel_sword', name: 'Steel Sword', materials: [{ item: 'steel_bar', quantity: 1 }], level: 20, experience: 125, quantity: 1 },
  { id: 'mithril_sword', name: 'Mithril Sword', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 200, quantity: 1 },
  { id: 'adamant_sword', name: 'Adamant Sword', materials: [{ item: 'adamant_bar', quantity: 1 }], level: 40, experience: 300, quantity: 1 },
  { id: 'rune_sword', name: 'Rune Sword', materials: [{ item: 'rune_bar', quantity: 1 }], level: 50, experience: 500, quantity: 1 },
  { id: 'dragon_sword', name: 'Dragon Sword', materials: [{ item: 'dragon_bar', quantity: 1 }], level: 60, experience: 750, quantity: 1 },
  { id: 'barrows_sword', name: 'Barrows Sword', materials: [{ item: 'barrows_bar', quantity: 1 }], level: 70, experience: 1000, quantity: 1 },
  { id: 'third_age_sword', name: 'Third Age Sword', materials: [{ item: 'third_age_bar', quantity: 1 }], level: 80, experience: 1500, quantity: 1 },
  { id: 'primal_sword', name: 'Primal Sword', materials: [{ item: 'primal_bar', quantity: 1 }], level: 90, experience: 2000, quantity: 1 },
  
  // Armor - Helmets
  { id: 'bronze_helmet', name: 'Bronze Helmet', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 35, quantity: 1 },
  { id: 'iron_helmet', name: 'Iron Helmet', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 70, quantity: 1 },
  { id: 'steel_helmet', name: 'Steel Helmet', materials: [{ item: 'steel_bar', quantity: 1 }], level: 20, experience: 88, quantity: 1 },
  { id: 'mithril_helmet', name: 'Mithril Helmet', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 140, quantity: 1 },
  { id: 'adamant_helmet', name: 'Adamant Helmet', materials: [{ item: 'adamant_bar', quantity: 1 }], level: 40, experience: 210, quantity: 1 },
  { id: 'rune_helmet', name: 'Rune Helmet', materials: [{ item: 'rune_bar', quantity: 1 }], level: 50, experience: 350, quantity: 1 },
  { id: 'dragon_helmet', name: 'Dragon Helmet', materials: [{ item: 'dragon_bar', quantity: 1 }], level: 60, experience: 525, quantity: 1 },
  { id: 'barrows_helmet', name: 'Barrows Helmet', materials: [{ item: 'barrows_bar', quantity: 1 }], level: 70, experience: 700, quantity: 1 },
  { id: 'third_age_helmet', name: 'Third Age Helmet', materials: [{ item: 'third_age_bar', quantity: 1 }], level: 80, experience: 1050, quantity: 1 },
  { id: 'primal_helmet', name: 'Primal Helmet', materials: [{ item: 'primal_bar', quantity: 1 }], level: 90, experience: 1400, quantity: 1 },
  
  // Armor - Chestplates
  { id: 'bronze_chestplate', name: 'Bronze Chestplate', materials: [{ item: 'bronze_bar', quantity: 3 }], level: 1, experience: 105, quantity: 1 },
  { id: 'iron_chestplate', name: 'Iron Chestplate', materials: [{ item: 'iron_bar', quantity: 3 }], level: 15, experience: 210, quantity: 1 },
  { id: 'steel_chestplate', name: 'Steel Chestplate', materials: [{ item: 'steel_bar', quantity: 3 }], level: 20, experience: 263, quantity: 1 },
  { id: 'mithril_chestplate', name: 'Mithril Chestplate', materials: [{ item: 'mithril_bar', quantity: 3 }], level: 30, experience: 420, quantity: 1 },
  { id: 'adamant_chestplate', name: 'Adamant Chestplate', materials: [{ item: 'adamant_bar', quantity: 3 }], level: 40, experience: 630, quantity: 1 },
  { id: 'rune_chestplate', name: 'Rune Chestplate', materials: [{ item: 'rune_bar', quantity: 3 }], level: 50, experience: 1050, quantity: 1 },
  { id: 'dragon_chestplate', name: 'Dragon Chestplate', materials: [{ item: 'dragon_bar', quantity: 3 }], level: 60, experience: 1575, quantity: 1 },
  { id: 'barrows_chestplate', name: 'Barrows Chestplate', materials: [{ item: 'barrows_bar', quantity: 3 }], level: 70, experience: 2100, quantity: 1 },
  { id: 'third_age_chestplate', name: 'Third Age Chestplate', materials: [{ item: 'third_age_bar', quantity: 3 }], level: 80, experience: 3150, quantity: 1 },
  { id: 'primal_chestplate', name: 'Primal Chestplate', materials: [{ item: 'primal_bar', quantity: 3 }], level: 90, experience: 4200, quantity: 1 },
  
  // Tools - Pickaxes
  { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 40, quantity: 1 },
  { id: 'iron_pickaxe', name: 'Iron Pickaxe', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 80, quantity: 1 },
  { id: 'mithril_pickaxe', name: 'Mithril Pickaxe', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 150, quantity: 1 },
  { id: 'adamant_pickaxe', name: 'Adamant Pickaxe', materials: [{ item: 'adamant_bar', quantity: 1 }], level: 40, experience: 240, quantity: 1 },
  { id: 'rune_pickaxe', name: 'Rune Pickaxe', materials: [{ item: 'rune_bar', quantity: 1 }], level: 50, experience: 400, quantity: 1 },
  { id: 'dragon_pickaxe', name: 'Dragon Pickaxe', materials: [{ item: 'dragon_bar', quantity: 1 }], level: 60, experience: 600, quantity: 1 },
  { id: 'barrows_pickaxe', name: 'Barrows Pickaxe', materials: [{ item: 'barrows_bar', quantity: 1 }], level: 70, experience: 800, quantity: 1 },
  { id: 'third_age_pickaxe', name: 'Third Age Pickaxe', materials: [{ item: 'third_age_bar', quantity: 1 }], level: 80, experience: 1200, quantity: 1 },
  { id: 'primal_pickaxe', name: 'Primal Pickaxe', materials: [{ item: 'primal_bar', quantity: 1 }], level: 90, experience: 1600, quantity: 1 },
  
  // Tools - Axes
  { id: 'bronze_axe', name: 'Bronze Axe', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 40, quantity: 1 },
  { id: 'iron_axe', name: 'Iron Axe', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 80, quantity: 1 },
  { id: 'mithril_axe', name: 'Mithril Axe', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 150, quantity: 1 },
  { id: 'adamant_axe', name: 'Adamant Axe', materials: [{ item: 'adamant_bar', quantity: 1 }], level: 40, experience: 240, quantity: 1 },
  { id: 'rune_axe', name: 'Rune Axe', materials: [{ item: 'rune_bar', quantity: 1 }], level: 50, experience: 400, quantity: 1 },
  { id: 'dragon_axe', name: 'Dragon Axe', materials: [{ item: 'dragon_bar', quantity: 1 }], level: 60, experience: 600, quantity: 1 },
  { id: 'barrows_axe', name: 'Barrows Axe', materials: [{ item: 'barrows_bar', quantity: 1 }], level: 70, experience: 800, quantity: 1 },
  { id: 'third_age_axe', name: 'Third Age Axe', materials: [{ item: 'third_age_bar', quantity: 1 }], level: 80, experience: 1200, quantity: 1 },
  { id: 'primal_axe', name: 'Primal Axe', materials: [{ item: 'primal_bar', quantity: 1 }], level: 90, experience: 1600, quantity: 1 },
  
  // Arrow heads
  { id: 'bronze_arrow_head', name: 'Bronze Arrow Head', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 25, quantity: 15 },
  { id: 'iron_arrow_head', name: 'Iron Arrow Head', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 50, quantity: 15 },
  { id: 'mithril_arrow_head', name: 'Mithril Arrow Head', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 100, quantity: 15 },
  
  // Crossbows
  { id: 'bronze_crossbow', name: 'Bronze Crossbow', materials: [{ item: 'bronze_bar', quantity: 2 }], level: 10, experience: 70, quantity: 1 },
  { id: 'iron_crossbow', name: 'Iron Crossbow', materials: [{ item: 'iron_bar', quantity: 2 }], level: 20, experience: 140, quantity: 1 },
  { id: 'steel_crossbow', name: 'Steel Crossbow', materials: [{ item: 'steel_bar', quantity: 2 }], level: 30, experience: 175, quantity: 1 },
  { id: 'mithril_crossbow', name: 'Mithril Crossbow', materials: [{ item: 'mithril_bar', quantity: 2 }], level: 40, experience: 280, quantity: 1 },
  { id: 'adamant_crossbow', name: 'Adamant Crossbow', materials: [{ item: 'adamant_bar', quantity: 2 }], level: 50, experience: 420, quantity: 1 },
  { id: 'rune_crossbow', name: 'Rune Crossbow', materials: [{ item: 'rune_bar', quantity: 2 }], level: 60, experience: 700, quantity: 1 },
  { id: 'dragon_crossbow', name: 'Dragon Crossbow', materials: [{ item: 'dragon_bar', quantity: 2 }], level: 70, experience: 1050, quantity: 1 },
  { id: 'barrows_crossbow', name: 'Barrows Crossbow', materials: [{ item: 'barrows_bar', quantity: 2 }], level: 80, experience: 1400, quantity: 1 },
  { id: 'primal_crossbow', name: 'Primal Crossbow', materials: [{ item: 'primal_bar', quantity: 2 }], level: 90, experience: 1800, quantity: 1 }
];

const smeltingRecipes = [
  { id: 'bronze_bar', name: 'Bronze Bar', materials: [{ item: 'copper_ore', quantity: 1 }, { item: 'tin_ore', quantity: 1 }], level: 1, experience: 30, quantity: 1 },
  { id: 'iron_bar', name: 'Iron Bar', materials: [{ item: 'iron_ore', quantity: 1 }, { item: 'coal', quantity: 1 }], level: 15, experience: 70, quantity: 1 },
  { id: 'steel_bar', name: 'Steel Bar', materials: [{ item: 'iron_ore', quantity: 1 }, { item: 'coal', quantity: 2 }], level: 20, experience: 90, quantity: 1 },
  { id: 'mithril_bar', name: 'Mithril Bar', materials: [{ item: 'mithril_ore', quantity: 1 }, { item: 'coal', quantity: 2 }], level: 30, experience: 150, quantity: 1 },
  { id: 'adamant_bar', name: 'Adamant Bar', materials: [{ item: 'adamant_ore', quantity: 1 }, { item: 'coal', quantity: 3 }], level: 40, experience: 250, quantity: 1 },
  { id: 'rune_bar', name: 'Rune Bar', materials: [{ item: 'rune_ore', quantity: 1 }, { item: 'coal', quantity: 4 }], level: 50, experience: 400, quantity: 1 },
  { id: 'dragon_bar', name: 'Dragon Bar', materials: [{ item: 'dragon_ore', quantity: 1 }, { item: 'coal', quantity: 5 }], level: 60, experience: 600, quantity: 1 },
  { id: 'barrows_bar', name: 'Barrows Bar', materials: [{ item: 'barrows_ore', quantity: 1 }, { item: 'coal', quantity: 6 }], level: 70, experience: 850, quantity: 1 },
  { id: 'third_age_bar', name: 'Third Age Bar', materials: [{ item: 'third_age_ore', quantity: 1 }, { item: 'coal', quantity: 7 }], level: 80, experience: 1200, quantity: 1 },
  { id: 'primal_bar', name: 'Primal Bar', materials: [{ item: 'primal_ore', quantity: 1 }, { item: 'coal', quantity: 8 }], level: 90, experience: 1600, quantity: 1 }
];

const fletchingRecipes = [
  // Arrow Shafts
  { id: 'arrow_shaft', name: 'Arrow Shaft', materials: [{ item: 'normal_logs', quantity: 1 }], level: 1, experience: 15, quantity: 15 },
  { id: 'oak_arrow_shaft', name: 'Oak Arrow Shaft', materials: [{ item: 'oak_logs', quantity: 1 }], level: 15, experience: 25, quantity: 30 },
  
  // Shortbows
  { id: 'shortbow', name: 'Shortbow', materials: [{ item: 'normal_logs', quantity: 2 }], level: 5, experience: 50, quantity: 1 },
  { id: 'oak_shortbow', name: 'Oak Shortbow', materials: [{ item: 'oak_logs', quantity: 2 }], level: 20, experience: 75, quantity: 1 },
  { id: 'willow_shortbow', name: 'Willow Shortbow', materials: [{ item: 'willow_logs', quantity: 2 }], level: 35, experience: 125, quantity: 1 },
  { id: 'maple_shortbow', name: 'Maple Shortbow', materials: [{ item: 'maple_logs', quantity: 2 }], level: 45, experience: 175, quantity: 1 },
  { id: 'yew_shortbow', name: 'Yew Shortbow', materials: [{ item: 'yew_logs', quantity: 2 }], level: 60, experience: 250, quantity: 1 },
  { id: 'magic_shortbow', name: 'Magic Shortbow', materials: [{ item: 'magic_logs', quantity: 2 }], level: 75, experience: 350, quantity: 1 },
  { id: 'elder_shortbow', name: 'Elder Shortbow', materials: [{ item: 'elder_logs', quantity: 2 }], level: 90, experience: 500, quantity: 1 },
  
  // Longbows
  { id: 'longbow', name: 'Longbow', materials: [{ item: 'normal_logs', quantity: 3 }], level: 10, experience: 75, quantity: 1 },
  { id: 'oak_longbow', name: 'Oak Longbow', materials: [{ item: 'oak_logs', quantity: 3 }], level: 25, experience: 113, quantity: 1 },
  { id: 'willow_longbow', name: 'Willow Longbow', materials: [{ item: 'willow_logs', quantity: 3 }], level: 40, experience: 188, quantity: 1 },
  { id: 'maple_longbow', name: 'Maple Longbow', materials: [{ item: 'maple_logs', quantity: 3 }], level: 50, experience: 263, quantity: 1 },
  { id: 'yew_longbow', name: 'Yew Longbow', materials: [{ item: 'yew_logs', quantity: 3 }], level: 65, experience: 375, quantity: 1 },
  { id: 'magic_longbow', name: 'Magic Longbow', materials: [{ item: 'magic_logs', quantity: 3 }], level: 80, experience: 525, quantity: 1 },
  { id: 'elder_longbow', name: 'Elder Longbow', materials: [{ item: 'elder_logs', quantity: 3 }], level: 95, experience: 750, quantity: 1 }
];

const craftingRecipes = [
  // Arrows
  { id: 'bronze_arrow', name: 'Bronze Arrow', materials: [{ item: 'arrow_shaft', quantity: 1 }, { item: 'bronze_arrow_head', quantity: 1 }], level: 1, experience: 20, quantity: 1 },
  { id: 'iron_arrow', name: 'Iron Arrow', materials: [{ item: 'oak_arrow_shaft', quantity: 1 }, { item: 'iron_arrow_head', quantity: 1 }], level: 15, experience: 35, quantity: 1 },
  { id: 'mithril_arrow', name: 'Mithril Arrow', materials: [{ item: 'oak_arrow_shaft', quantity: 1 }, { item: 'mithril_arrow_head', quantity: 1 }], level: 30, experience: 60, quantity: 1 },
  
  // Staffs
  { id: 'basic_staff', name: 'Basic Staff', materials: [{ item: 'normal_logs', quantity: 3 }, { item: 'bronze_arrow_head', quantity: 1 }], level: 10, experience: 55, quantity: 1 },
  { id: 'oak_staff', name: 'Oak Staff', materials: [{ item: 'oak_logs', quantity: 3 }, { item: 'iron_arrow_head', quantity: 1 }], level: 25, experience: 85, quantity: 1 },
  
  // Leather Armor - Basic Leather
  { id: 'leather_coif', name: 'Leather Coif', materials: [{ item: 'leather', quantity: 1 }], level: 1, experience: 25, quantity: 1 },
  { id: 'leather_body', name: 'Leather Body', materials: [{ item: 'leather', quantity: 3 }], level: 1, experience: 75, quantity: 1 },
  { id: 'leather_chaps', name: 'Leather Chaps', materials: [{ item: 'leather', quantity: 2 }], level: 1, experience: 50, quantity: 1 },
  { id: 'leather_vambraces', name: 'Leather Vambraces', materials: [{ item: 'leather', quantity: 1 }], level: 1, experience: 25, quantity: 1 },
  { id: 'leather_boots', name: 'Leather Boots', materials: [{ item: 'leather', quantity: 1 }], level: 1, experience: 25, quantity: 1 },
  
  // Hard Leather Armor
  { id: 'hard_leather_coif', name: 'Hard Leather Coif', materials: [{ item: 'hard_leather', quantity: 1 }], level: 10, experience: 50, quantity: 1 },
  { id: 'hard_leather_body', name: 'Hard Leather Body', materials: [{ item: 'hard_leather', quantity: 3 }], level: 10, experience: 150, quantity: 1 },
  { id: 'hard_leather_chaps', name: 'Hard Leather Chaps', materials: [{ item: 'hard_leather', quantity: 2 }], level: 10, experience: 100, quantity: 1 },
  { id: 'hard_leather_vambraces', name: 'Hard Leather Vambraces', materials: [{ item: 'hard_leather', quantity: 1 }], level: 10, experience: 50, quantity: 1 },
  { id: 'hard_leather_boots', name: 'Hard Leather Boots', materials: [{ item: 'hard_leather', quantity: 1 }], level: 10, experience: 50, quantity: 1 },
  
  // Studded Leather Armor
  { id: 'studded_coif', name: 'Studded Coif', materials: [{ item: 'studded_leather', quantity: 1 }], level: 20, experience: 100, quantity: 1 },
  { id: 'studded_body', name: 'Studded Body', materials: [{ item: 'studded_leather', quantity: 3 }], level: 20, experience: 300, quantity: 1 },
  { id: 'studded_chaps', name: 'Studded Chaps', materials: [{ item: 'studded_leather', quantity: 2 }], level: 20, experience: 200, quantity: 1 },
  { id: 'studded_vambraces', name: 'Studded Vambraces', materials: [{ item: 'studded_leather', quantity: 1 }], level: 20, experience: 100, quantity: 1 },
  { id: 'studded_boots', name: 'Studded Boots', materials: [{ item: 'studded_leather', quantity: 1 }], level: 20, experience: 100, quantity: 1 },
  
  // Green Dragonhide Armor
  { id: 'green_dhide_coif', name: 'Green D\'hide Coif', materials: [{ item: 'green_dhide', quantity: 1 }], level: 30, experience: 150, quantity: 1 },
  { id: 'green_dhide_body', name: 'Green D\'hide Body', materials: [{ item: 'green_dhide', quantity: 3 }], level: 30, experience: 450, quantity: 1 },
  { id: 'green_dhide_chaps', name: 'Green D\'hide Chaps', materials: [{ item: 'green_dhide', quantity: 2 }], level: 30, experience: 300, quantity: 1 },
  { id: 'green_dhide_vambraces', name: 'Green D\'hide Vambraces', materials: [{ item: 'green_dhide', quantity: 1 }], level: 30, experience: 150, quantity: 1 },
  { id: 'green_dhide_boots', name: 'Green D\'hide Boots', materials: [{ item: 'green_dhide', quantity: 1 }], level: 30, experience: 150, quantity: 1 },
  
  // Blue Dragonhide Armor
  { id: 'blue_dhide_coif', name: 'Blue D\'hide Coif', materials: [{ item: 'blue_dhide', quantity: 1 }], level: 40, experience: 200, quantity: 1 },
  { id: 'blue_dhide_body', name: 'Blue D\'hide Body', materials: [{ item: 'blue_dhide', quantity: 3 }], level: 40, experience: 600, quantity: 1 },
  { id: 'blue_dhide_chaps', name: 'Blue D\'hide Chaps', materials: [{ item: 'blue_dhide', quantity: 2 }], level: 40, experience: 400, quantity: 1 },
  { id: 'blue_dhide_vambraces', name: 'Blue D\'hide Vambraces', materials: [{ item: 'blue_dhide', quantity: 1 }], level: 40, experience: 200, quantity: 1 },
  { id: 'blue_dhide_boots', name: 'Blue D\'hide Boots', materials: [{ item: 'blue_dhide', quantity: 1 }], level: 40, experience: 200, quantity: 1 },
  
  // Red Dragonhide Armor
  { id: 'red_dhide_coif', name: 'Red D\'hide Coif', materials: [{ item: 'red_dhide', quantity: 1 }], level: 50, experience: 250, quantity: 1 },
  { id: 'red_dhide_body', name: 'Red D\'hide Body', materials: [{ item: 'red_dhide', quantity: 3 }], level: 50, experience: 750, quantity: 1 },
  { id: 'red_dhide_chaps', name: 'Red D\'hide Chaps', materials: [{ item: 'red_dhide', quantity: 2 }], level: 50, experience: 500, quantity: 1 },
  { id: 'red_dhide_vambraces', name: 'Red D\'hide Vambraces', materials: [{ item: 'red_dhide', quantity: 1 }], level: 50, experience: 250, quantity: 1 },
  { id: 'red_dhide_boots', name: 'Red D\'hide Boots', materials: [{ item: 'red_dhide', quantity: 1 }], level: 50, experience: 250, quantity: 1 },
  
  // Black Dragonhide Armor
  { id: 'black_dhide_coif', name: 'Black D\'hide Coif', materials: [{ item: 'black_dhide', quantity: 1 }], level: 60, experience: 300, quantity: 1 },
  { id: 'black_dhide_body', name: 'Black D\'hide Body', materials: [{ item: 'black_dhide', quantity: 3 }], level: 60, experience: 900, quantity: 1 },
  { id: 'black_dhide_chaps', name: 'Black D\'hide Chaps', materials: [{ item: 'black_dhide', quantity: 2 }], level: 60, experience: 600, quantity: 1 },
  { id: 'black_dhide_vambraces', name: 'Black D\'hide Vambraces', materials: [{ item: 'black_dhide', quantity: 1 }], level: 60, experience: 300, quantity: 1 },
  { id: 'black_dhide_boots', name: 'Black D\'hide Boots', materials: [{ item: 'black_dhide', quantity: 1 }], level: 60, experience: 300, quantity: 1 },
  
  // Ancient Dragonhide Armor
  { id: 'ancient_dhide_coif', name: 'Ancient D\'hide Coif', materials: [{ item: 'ancient_dhide', quantity: 1 }], level: 70, experience: 350, quantity: 1 },
  { id: 'ancient_dhide_body', name: 'Ancient D\'hide Body', materials: [{ item: 'ancient_dhide', quantity: 3 }], level: 70, experience: 1050, quantity: 1 },
  { id: 'ancient_dhide_chaps', name: 'Ancient D\'hide Chaps', materials: [{ item: 'ancient_dhide', quantity: 2 }], level: 70, experience: 700, quantity: 1 },
  { id: 'ancient_dhide_vambraces', name: 'Ancient D\'hide Vambraces', materials: [{ item: 'ancient_dhide', quantity: 1 }], level: 70, experience: 350, quantity: 1 },
  { id: 'ancient_dhide_boots', name: 'Ancient D\'hide Boots', materials: [{ item: 'ancient_dhide', quantity: 1 }], level: 70, experience: 350, quantity: 1 },
  
  // Barrows Leather Armor
  { id: 'barrows_leather_coif', name: 'Barrows Leather Coif', materials: [{ item: 'barrows_leather', quantity: 1 }], level: 80, experience: 400, quantity: 1 },
  { id: 'barrows_leather_body', name: 'Barrows Leather Body', materials: [{ item: 'barrows_leather', quantity: 3 }], level: 80, experience: 1200, quantity: 1 },
  { id: 'barrows_leather_chaps', name: 'Barrows Leather Chaps', materials: [{ item: 'barrows_leather', quantity: 2 }], level: 80, experience: 800, quantity: 1 },
  { id: 'barrows_leather_vambraces', name: 'Barrows Leather Vambraces', materials: [{ item: 'barrows_leather', quantity: 1 }], level: 80, experience: 400, quantity: 1 },
  { id: 'barrows_leather_boots', name: 'Barrows Leather Boots', materials: [{ item: 'barrows_leather', quantity: 1 }], level: 80, experience: 400, quantity: 1 },
  
  // Primal Leather Armor
  { id: 'primal_leather_coif', name: 'Primal Leather Coif', materials: [{ item: 'primal_leather', quantity: 1 }], level: 90, experience: 500, quantity: 1 },
  { id: 'primal_leather_body', name: 'Primal Leather Body', materials: [{ item: 'primal_leather', quantity: 3 }], level: 90, experience: 1500, quantity: 1 },
  { id: 'primal_leather_chaps', name: 'Primal Leather Chaps', materials: [{ item: 'primal_leather', quantity: 2 }], level: 90, experience: 1000, quantity: 1 },
  { id: 'primal_leather_vambraces', name: 'Primal Leather Vambraces', materials: [{ item: 'primal_leather', quantity: 1 }], level: 90, experience: 500, quantity: 1 },
  { id: 'primal_leather_boots', name: 'Primal Leather Boots', materials: [{ item: 'primal_leather', quantity: 1 }], level: 90, experience: 500, quantity: 1 }
];

const cookingRecipes = [
  { raw: 'shrimp', cooked: 'cooked_shrimp', level: 1, experience: 30 },
  { raw: 'trout', cooked: 'cooked_trout', level: 15, experience: 70 },
  { raw: 'salmon', cooked: 'cooked_salmon', level: 25, experience: 90 },
  { raw: 'tuna', cooked: 'cooked_tuna', level: 35, experience: 110 },
  { raw: 'lobster', cooked: 'cooked_lobster', level: 40, experience: 130 },
  { raw: 'shark', cooked: 'cooked_shark', level: 50, experience: 150 },
  { raw: 'manta_ray', cooked: 'cooked_manta_ray', level: 60, experience: 180 },
  { raw: 'dark_crab', cooked: 'cooked_dark_crab', level: 70, experience: 220 },
  { raw: 'anglerfish', cooked: 'cooked_anglerfish', level: 80, experience: 270 }
];

export const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('List detailed information about the game')
  .addStringOption(option =>
    option.setName('category')
      .setDescription('What information to display')
      .setRequired(true)
      .addChoices(
        { name: 'All Areas & Their Content', value: 'areas' },
        { name: 'All Monsters by Area', value: 'monsters' },
        { name: 'Combat Styles & Requirements', value: 'combat' },
        { name: 'All Resources by Area', value: 'resources' },
        { name: 'Smithing Recipes (Smelting)', value: 'smelting' },
        { name: 'Smithing Recipes (Items)', value: 'smithing' },
        { name: 'Fletching Recipes', value: 'fletching' },
        { name: 'Crafting Recipes', value: 'crafting' },
        { name: 'Cooking Recipes', value: 'cooking' },
        { name: 'Runecrafting Guide', value: 'runecrafting' },
        { name: 'Magic Spells & Combat', value: 'magic' },
        { name: 'All Items by Type', value: 'items' }
      )
  );

function createPaginationButtons(currentPage: number, totalPages: number, category: string): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  
  if (currentPage > 0) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`list_${category}_${currentPage - 1}`)
        .setLabel('Previous')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('⬅️')
    );
  }
  
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`list_${category}_info`)
      .setLabel(`Page ${currentPage + 1}/${totalPages}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
  
  if (currentPage < totalPages - 1) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`list_${category}_${currentPage + 1}`)
        .setLabel('Next')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('➡️')
    );
  }
  
  return row;
}

export async function execute(interaction: any) {
  const category = interaction.options.getString('category');
  const page = 0; // Start with first page

  try {
    const result = await createEmbedWithPagination(category, page);
    
    if (!result) {
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Error')
        .setDescription('Invalid category selected.');
      await interaction.reply({ embeds: [embed] });
      return;
    }

    const components = result.totalPages > 1 ? [createPaginationButtons(page, result.totalPages, category)] : [];
    await interaction.reply({ embeds: [result.embed], components });
  } catch (error) {
    console.error('Error in list command:', error);
    await interaction.reply({
      content: 'An error occurred while fetching the information. Please try again.',
      ephemeral: true
    });
  }
}

export async function handleButton(interaction: any) {
  const customId = interaction.customId;
  const parts = customId.split('_');
  
  if (parts.length >= 3 && parts[0] === 'list') {
    const category = parts[1];
    const page = parseInt(parts[2]);
    
    if (isNaN(page)) return;
    
    try {
      const result = await createEmbedWithPagination(category, page);
      
      if (!result) {
        await interaction.reply({
          content: 'Invalid category!',
          ephemeral: true
        });
        return;
      }

      const components = result.totalPages > 1 ? [createPaginationButtons(page, result.totalPages, category)] : [];
      await interaction.update({ embeds: [result.embed], components });
    } catch (error) {
      console.error('Error handling list pagination:', error);
      await interaction.reply({
        content: 'An error occurred while updating the list.',
        ephemeral: true
      });
    }
  }
}

async function createEmbedWithPagination(category: string, page: number): Promise<{embed: EmbedBuilder, totalPages: number} | null> {
  switch (category) {
    case 'areas':
      return { embed: await createAreasEmbed(), totalPages: 1 };
    case 'monsters':
      return { embed: await createMonstersEmbed(), totalPages: 1 };
    case 'combat':
      return { embed: createCombatEmbed(), totalPages: 1 };
    case 'resources':
      return { embed: await createResourcesEmbed(), totalPages: 1 };
    case 'smelting':
      return await createSmeltingEmbedPaginated(page);
    case 'smithing':
      return await createSmithingEmbedPaginated(page);
    case 'fletching':
      return await createFletchingEmbedPaginated(page);
    case 'crafting':
      return await createCraftingEmbedPaginated(page);
    case 'cooking':
      return await createCookingEmbedPaginated(page);
    case 'runecrafting':
      return { embed: createRunecraftingEmbed(), totalPages: 1 };
    case 'magic':
      return { embed: createMagicEmbed(), totalPages: 1 };
    case 'items':
      return { embed: await createItemsEmbed(), totalPages: 1 };
    default:
      return null;
  }
}

async function createAreasEmbed(): Promise<EmbedBuilder> {
  const areas = await Area.find({}).sort({ requiredLevel: 1 });
  
  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('🗺️ All Areas Overview')
    .setDescription('Complete list of all areas and their requirements');

  for (const area of areas) {
    const monstersText = area.monsters.map(m => `${m.name} (Lv${m.level})`).join(', ') || 'None';
    const resourcesText = area.resources.map(r => `${r.name} (${r.skill} Lv${r.levelRequired})`).join(', ') || 'None';
    
    embed.addFields({
      name: `${area.name} (Level ${area.requiredLevel}+)`,
      value: `**Description:** ${area.description}\n**Monsters:** ${monstersText}\n**Resources:** ${resourcesText}`,
      inline: false
    });
  }

  return embed;
}

async function createMonstersEmbed(): Promise<EmbedBuilder> {
  const areas = await Area.find({}).sort({ requiredLevel: 1 });
  
  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle('⚔️ All Monsters by Area')
    .setDescription('Complete monster database with stats and drops');

  for (const area of areas) {
    if (area.monsters.length > 0) {
      const monstersText = area.monsters.map(monster => {
        const drops = monster.dropTable.map(drop => `${drop.itemId} (${Math.round(drop.chance * 100)}%)`).join(', ');
        return `**${monster.name}** - Lv${monster.level} | HP:${monster.hp} | ATK:${monster.attack} | DEF:${monster.defense} | XP:${monster.experience}\nDrops: ${drops}`;
      }).join('\n\n');

      embed.addFields({
        name: `${area.name} (Level ${area.requiredLevel}+)`,
        value: monstersText,
        inline: false
      });
    }
  }

  return embed;
}

async function createResourcesEmbed(): Promise<EmbedBuilder> {
  const areas = await Area.find({}).sort({ requiredLevel: 1 });
  
  const embed = new EmbedBuilder()
    .setColor(0x8B4513)
    .setTitle('🔨 All Resources by Area')
    .setDescription('Complete resource database with requirements');

  for (const area of areas) {
    if (area.resources.length > 0) {
      const skillGroups: { [key: string]: any[] } = {};
      
      area.resources.forEach(resource => {
        if (!skillGroups[resource.skill]) {
          skillGroups[resource.skill] = [];
        }
        skillGroups[resource.skill]?.push(resource);
      });

      let resourcesText = '';
      Object.keys(skillGroups).forEach(skill => {
        const skillResources = skillGroups[skill]?.map(r => 
          `${r.name} (Lv${r.levelRequired}, ${r.experience}XP)`
        ).join(', ');
        resourcesText += `**${skill.charAt(0).toUpperCase() + skill.slice(1)}:** ${skillResources}\n`;
      });

      embed.addFields({
        name: `${area.name} (Level ${area.requiredLevel}+)`,
        value: resourcesText,
        inline: false
      });
    }
  }

  return embed;
}

async function createSmeltingEmbedPaginated(page: number): Promise<{embed: EmbedBuilder, totalPages: number}> {
  const totalPages = Math.ceil(smeltingRecipes.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, smeltingRecipes.length);
  const recipesOnPage = smeltingRecipes.slice(startIndex, endIndex);
  
  const embed = new EmbedBuilder()
    .setColor(0xFF4500)
    .setTitle('🔥 Smelting Recipes')
    .setDescription(`All available smelting recipes (Page ${page + 1}/${totalPages})`);

  recipesOnPage.forEach((recipe, index) => {
    const materials = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(' + ');
    
    if (index > 0) {
      embed.addFields({ name: '\u200b', value: '\u200b', inline: false });
    }
    
    embed.addFields({
      name: `${recipe.name} (Level ${recipe.level})`,
      value: `**Materials:** ${materials}\n**Experience:** ${recipe.experience} XP\n**Quantity:** ${recipe.quantity}`,
      inline: true
    });
  });

  return { embed, totalPages };
}

async function createSmithingEmbedPaginated(page: number): Promise<{embed: EmbedBuilder, totalPages: number}> {
  const totalPages = Math.ceil(smithingRecipes.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, smithingRecipes.length);
  const recipesOnPage = smithingRecipes.slice(startIndex, endIndex);
  
  const embed = new EmbedBuilder()
    .setColor(0x708090)
    .setTitle('⚒️ Smithing Recipes')
    .setDescription(`All available smithing recipes (Page ${page + 1}/${totalPages})`);

  recipesOnPage.forEach((recipe, index) => {
    const materials = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(' + ');
    
    if (index > 0) {
      embed.addFields({ name: '\u200b', value: '\u200b', inline: false });
    }
    
    embed.addFields({
      name: `${recipe.name} (Level ${recipe.level})`,
      value: `**Materials:** ${materials}\n**Experience:** ${recipe.experience} XP\n**Quantity:** ${recipe.quantity}`,
      inline: true
    });
  });

  return { embed, totalPages };
}

async function createFletchingEmbedPaginated(page: number): Promise<{embed: EmbedBuilder, totalPages: number}> {
  const totalPages = Math.ceil(fletchingRecipes.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, fletchingRecipes.length);
  const recipesOnPage = fletchingRecipes.slice(startIndex, endIndex);
  
  const embed = new EmbedBuilder()
    .setColor(0x8B4513)
    .setTitle('🏹 Fletching Recipes')
    .setDescription(`All available fletching recipes (Page ${page + 1}/${totalPages})`);

  recipesOnPage.forEach((recipe, index) => {
    const materials = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(' + ');
    
    if (index > 0) {
      embed.addFields({ name: '\u200b', value: '\u200b', inline: false });
    }
    
    embed.addFields({
      name: `${recipe.name} (Level ${recipe.level})`,
      value: `**Materials:** ${materials}\n**Experience:** ${recipe.experience} XP\n**Quantity:** ${recipe.quantity}`,
      inline: true
    });
  });

  return { embed, totalPages };
}

async function createCraftingEmbedPaginated(page: number): Promise<{embed: EmbedBuilder, totalPages: number}> {
  const totalPages = Math.ceil(craftingRecipes.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, craftingRecipes.length);
  const recipesOnPage = craftingRecipes.slice(startIndex, endIndex);
  
  const embed = new EmbedBuilder()
    .setColor(0xFF6347)
    .setTitle('🔨 Crafting Recipes')
    .setDescription(`All available crafting recipes (Page ${page + 1}/${totalPages})`);

  recipesOnPage.forEach((recipe, index) => {
    const materials = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(' + ');
    
    if (index > 0) {
      embed.addFields({ name: '\u200b', value: '\u200b', inline: false });
    }
    
    embed.addFields({
      name: `${recipe.name} (Level ${recipe.level})`,
      value: `**Materials:** ${materials}\n**Experience:** ${recipe.experience} XP\n**Quantity:** ${recipe.quantity}`,
      inline: true
    });
  });

  return { embed, totalPages };
}

async function createCookingEmbedPaginated(page: number): Promise<{embed: EmbedBuilder, totalPages: number}> {
  const totalPages = Math.ceil(cookingRecipes.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, cookingRecipes.length);
  const recipesOnPage = cookingRecipes.slice(startIndex, endIndex);
  
  const embed = new EmbedBuilder()
    .setColor(0xFF8C00)
    .setTitle('🍳 Cooking Recipes')
    .setDescription(`All available cooking recipes (Page ${page + 1}/${totalPages})`);

  recipesOnPage.forEach(recipe => {
    embed.addFields({
      name: `${recipe.cooked.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} (Level ${recipe.level})`,
      value: `**Raw Material:** ${recipe.raw.replace('_', ' ')}\n**Experience:** ${recipe.experience} XP`,
      inline: true
    });
  });

  return { embed, totalPages };
}

async function createItemsEmbed(): Promise<EmbedBuilder> {
  const items = await Item.find({}).sort({ type: 1, levelRequired: 1 });
  
  const embed = new EmbedBuilder()
    .setColor(0x9932CC)
    .setTitle('📦 All Items by Type')
    .setDescription('Complete item database organized by type');

  const itemsByType: { [key: string]: any[] } = {};
  
  items.forEach(item => {
    if (!itemsByType[item.type]) {
      itemsByType[item.type] = [];
    }
    itemsByType[item.type]?.push(item);
  });

  Object.keys(itemsByType).forEach(type => {
    const typeItems = itemsByType[type];
    if (!typeItems) return;
    
    const itemsText = typeItems.map(item => {
      let text = `**${item.name}** (Lv${item.levelRequired})`;
      if (item.stats && Object.keys(item.stats).some(key => item.stats[key] > 0)) {
        const statText = Object.entries(item.stats)
          .filter(([_, value]) => typeof value === 'number' && value > 0)
          .map(([stat, value]) => `${stat}:+${value as number}`)
          .join(', ');
        text += ` - ${statText}`;
      }
      if (item.healAmount > 0) {
        text += ` - Heals ${item.healAmount}`;
      }
      return text;
    }).join('\n');

    embed.addFields({
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
      value: itemsText,
      inline: false
    });
  });

  return embed;
}

function createRunecraftingEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0x9932CC)
    .setTitle('🔮 Runecrafting Guide')
    .setDescription('Complete guide to the Runecrafting skill');

  embed.addFields(
    {
      name: 'Getting Started',
      value: '• Mine **Rune Essence** at Lumbridge (Level 1 Mining)\n' +
             '• Obtain **Talismans** from monster drops\n' +
             '• Use `/runecraft` command to craft runes\n' +
             '• Each talisman allows crafting of specific rune types',
      inline: false
    },
    {
      name: 'Lumbridge Runes (Levels 1-2)',
      value: '**Air Rune** (Lv1) - Air Talisman + 1 Essence = 1 Rune (5 XP)\n' +
             '**Earth Rune** (Lv1) - Earth Talisman + 1 Essence = 1 Rune (5 XP)\n' +
             '**Mind Rune** (Lv2) - Mind Talisman + 1 Essence = 1 Rune (6 XP)',
      inline: false
    },
    {
      name: 'Varrock Runes (Levels 5-20)',
      value: '**Water Rune** (Lv5) - Water Talisman + 1 Essence = 1 Rune (6 XP)\n' +
             '**Fire Rune** (Lv9) - Fire Talisman + 1 Essence = 1 Rune (7 XP)\n' +
             '**Body Rune** (Lv20) - Body Talisman + 1 Essence = 1 Rune (8 XP)',
      inline: false
    },
    {
      name: 'Falador Runes (Levels 27-35)',
      value: '**Cosmic Rune** (Lv27) - Cosmic Talisman + 1 Essence = 1 Rune (10 XP)\n' +
             '**Chaos Rune** (Lv35) - Chaos Talisman + 1 Essence = 1 Rune (12 XP)',
      inline: false
    },
    {
      name: 'Other Area Runes (Levels 44-90)',
      value: '**Nature Rune** (Lv44) - Catherby - Nature Talisman + 1 Essence = 1 Rune (15 XP)\n' +
             '**Law Rune** (Lv54) - Ardougne - Law Talisman + 1 Essence = 1 Rune (18 XP)\n' +
             '**Death Rune** (Lv65) - Dragon Isle - Death Talisman + 1 Essence = 1 Rune (22 XP)\n' +
             '**Blood Rune** (Lv77) - Barrows Crypts - Blood Talisman + 2 Essence = 1 Rune (30 XP)\n' +
             '**Soul Rune** (Lv90) - Primal Realm - Soul Talisman + 3 Essence = 1 Rune (40 XP)',
      inline: false
    },
    {
      name: 'Talisman Sources',
      value: '• **Monster Drops** - All monsters have chance to drop talismans\n' +
             '• **Drop Rates** - Vary by monster level and area\n' +
             '• **Stackable** - Talismans stack in inventory\n' +
             '• **Reusable** - Talismans are not consumed when crafting',
      inline: false
    },
    {
      name: 'Tips & Strategy',
      value: '• Start with Air/Earth/Mind Runes in Lumbridge for early XP\n' +
             '• Travel to different areas to unlock new rune types\n' +
             '• Collect multiple talismans for efficient crafting\n' +
             '• Stock up on Rune Essence before crafting sessions\n' +
             '• Higher level runes give more XP but require more essence\n' +
             '• Runes are consumed when casting combat spells\n' +
             '• Area travel is now freely accessible - no combat requirements',
      inline: false
    }
  );

  return embed;
}

function createMagicEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0x8A2BE2)
    .setTitle('✨ Magic Spells & Combat')
    .setDescription('Complete guide to Magic combat and spells');

  embed.addFields(
    {
      name: 'Magic Combat Basics',
      value: '• Equip a **Magic Weapon** (staff)\n' +
             '• Set combat style to **Magic** with `/style magic`\n' +
             '• Use `/fight` then click **Cast Spell** button\n' +
             '• Spells consume runes from your inventory\n' +
             '• Magic attacks train Magic skill',
      inline: false
    },
    {
      name: 'Elemental Combat Spells',
      value: '**Wind Strike** (Lv1) - 1 Air + 1 Mind = 2-8 damage\n' +
             '**Earth Strike** (Lv5) - 1 Earth + 1 Mind = 3-9 damage\n' +
             '**Water Strike** (Lv10) - 1 Water + 1 Mind = 4-10 damage\n' +
             '**Fire Strike** (Lv15) - 1 Fire + 1 Mind = 5-11 damage\n' +
             '**Wind Bolt** (Lv20) - 2 Air + 1 Chaos = 6-12 damage\n' +
             '**Earth Bolt** (Lv25) - 2 Earth + 1 Chaos = 7-13 damage\n' +
             '**Water Bolt** (Lv30) - 2 Water + 1 Chaos = 8-14 damage\n' +
             '**Fire Bolt** (Lv35) - 2 Fire + 1 Chaos = 9-15 damage',
      inline: false
    },
    {
      name: 'Advanced Combat Spells',
      value: '**Wind Blast** (Lv40) - 3 Air + 1 Death = 10-16 damage\n' +
             '**Earth Blast** (Lv45) - 3 Earth + 1 Death = 11-17 damage\n' +
             '**Water Blast** (Lv50) - 3 Water + 1 Death = 12-18 damage\n' +
             '**Fire Blast** (Lv55) - 3 Fire + 1 Death = 13-19 damage\n' +
             '**Wind Wave** (Lv60) - 5 Air + 1 Blood = 14-20 damage\n' +
             '**Earth Wave** (Lv65) - 5 Earth + 1 Blood = 15-21 damage\n' +
             '**Water Wave** (Lv70) - 5 Water + 1 Blood = 16-22 damage\n' +
             '**Fire Wave** (Lv75) - 5 Fire + 1 Blood = 17-23 damage',
      inline: false
    },
    {
      name: 'Master Spells',
      value: '**Wind Surge** (Lv80) - 7 Air + 1 Soul = 18-24 damage\n' +
             '**Earth Surge** (Lv85) - 7 Earth + 1 Soul = 19-25 damage\n' +
             '**Water Surge** (Lv90) - 7 Water + 1 Soul = 20-26 damage\n' +
             '**Fire Surge** (Lv95) - 7 Fire + 1 Soul = 21-27 damage',
      inline: false
    },
    {
      name: 'Elemental Weaknesses',
      value: '🔥 **Fire** vs Water weak monsters: +10% accuracy & damage\n' +
             '💧 **Water** vs Fire weak monsters: +10% accuracy & damage\n' +
             '🌍 **Earth** vs Air weak monsters: +10% accuracy & damage\n' +
             '💨 **Air** vs Earth weak monsters: +10% accuracy & damage\n' +
             '*Check monster info during combat for weaknesses*',
      inline: false
    },
    {
      name: 'Magic Weapons & Requirements',
      value: '• **Basic Staff** (Lv10) - Crafted with 3 Normal Logs\n' +
             '• **Oak Staff** (Lv25) - Crafted with 3 Oak Logs\n' +
             '• **Higher tier staves** available through smithing\n' +
             '• Magic weapons provide magic accuracy bonus\n' +
             '• Use `/equip weapon [staff_name]` to equip',
      inline: false
    }
  );

  return embed;
}

function createCombatEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle('⚔️ Combat System Overview')
    .setDescription('Combat mechanics, styles, and requirements');

  embed.addFields(
    {
      name: 'Combat Basics',
      value: 'Combat is turn-based with 4 actions: Attack, Defend, Eat Food, Run Away\n' +
             'Combat style determines which skill gains experience\n' +
             'Equipment affects combat effectiveness',
      inline: false
    },
    {
      name: 'Melee Combat Styles',
      value: '**Attack Style** - Trains Attack skill (accuracy focused)\n' +
             '**Strength Style** - Trains Strength skill (damage focused)\n' +
             '**Defense Style** - Trains Defense skill (defensive focused)\n' +
             '*Requires: Melee weapon equipped*',
      inline: true
    },
    {
      name: 'Ranged Combat Style',
      value: '**Range Style** - Trains Range skill\n' +
             '**Defense Style** - Trains Defense skill\n' +
             '*Requires: Ranged weapon + arrows equipped*',
      inline: true
    },
    {
      name: 'Magic Combat Style',
      value: '**Magic Style** - Trains Magic skill\n' +
             '**Defense Style** - Trains Defense skill\n' +
             '*Requires: Magic weapon equipped*',
      inline: true
    },
    {
      name: 'Combat Actions',
      value: '**Attack** - Deal damage to monster\n' +
             '**Defend** - Reduce incoming damage by 50%\n' +
             '**Eat Food** - Restore HP with food items\n' +
             '**Run Away** - 80% chance to escape combat',
      inline: false
    },
    {
      name: 'Combat Requirements',
      value: '• Must have weapon equipped for optimal combat\n' +
             '• Ranged combat requires arrows in ammunition slot\n' +
             '• Food items can be eaten to restore HP\n' +
             '• Combat style can be changed with `/style` command\n' +
             '• Use `/fight` to start combat with monsters',
      inline: false
    },
    {
      name: 'Experience & Rewards',
      value: '• Experience gained based on damage dealt and monster level\n' +
             '• Monsters drop loot according to their drop table\n' +
             '• Defeated players respawn with full HP\n' +
             '• Combat style determines which skill levels up',
      inline: false
    }
  );

  return embed;
}