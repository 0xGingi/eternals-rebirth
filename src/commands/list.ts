import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Area } from '../models/Area';
import { Item } from '../models/Item';

const smithingRecipes = [
  // Weapons
  { id: 'bronze_sword', name: 'Bronze Sword', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 50, quantity: 1 },
  { id: 'iron_sword', name: 'Iron Sword', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 100, quantity: 1 },
  { id: 'mithril_sword', name: 'Mithril Sword', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 200, quantity: 1 },
  // Tools
  { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 40, quantity: 1 },
  { id: 'iron_pickaxe', name: 'Iron Pickaxe', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 80, quantity: 1 },
  { id: 'mithril_pickaxe', name: 'Mithril Pickaxe', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 150, quantity: 1 },
  { id: 'bronze_axe', name: 'Bronze Axe', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 40, quantity: 1 },
  { id: 'iron_axe', name: 'Iron Axe', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 80, quantity: 1 },
  { id: 'mithril_axe', name: 'Mithril Axe', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 150, quantity: 1 },
  // Arrow heads
  { id: 'bronze_arrow_head', name: 'Bronze Arrow Head', materials: [{ item: 'bronze_bar', quantity: 1 }], level: 1, experience: 25, quantity: 15 },
  { id: 'iron_arrow_head', name: 'Iron Arrow Head', materials: [{ item: 'iron_bar', quantity: 1 }], level: 15, experience: 50, quantity: 15 },
  { id: 'mithril_arrow_head', name: 'Mithril Arrow Head', materials: [{ item: 'mithril_bar', quantity: 1 }], level: 30, experience: 100, quantity: 15 }
];

const smeltingRecipes = [
  { id: 'bronze_bar', name: 'Bronze Bar', materials: [{ item: 'copper_ore', quantity: 1 }, { item: 'tin_ore', quantity: 1 }], level: 1, experience: 30, quantity: 1 },
  { id: 'iron_bar', name: 'Iron Bar', materials: [{ item: 'iron_ore', quantity: 1 }, { item: 'coal', quantity: 1 }], level: 15, experience: 70, quantity: 1 },
  { id: 'mithril_bar', name: 'Mithril Bar', materials: [{ item: 'mithril_ore', quantity: 1 }, { item: 'coal', quantity: 2 }], level: 30, experience: 150, quantity: 1 }
];

const fletchingRecipes = [
  { id: 'arrow_shaft', name: 'Arrow Shaft', materials: [{ item: 'normal_logs', quantity: 1 }], level: 1, experience: 15, quantity: 15 },
  { id: 'oak_arrow_shaft', name: 'Oak Arrow Shaft', materials: [{ item: 'oak_logs', quantity: 1 }], level: 15, experience: 25, quantity: 30 },
  { id: 'shortbow', name: 'Shortbow', materials: [{ item: 'normal_logs', quantity: 2 }], level: 5, experience: 50, quantity: 1 },
  { id: 'oak_shortbow', name: 'Oak Shortbow', materials: [{ item: 'oak_logs', quantity: 2 }], level: 20, experience: 75, quantity: 1 },
  { id: 'willow_shortbow', name: 'Willow Shortbow', materials: [{ item: 'willow_logs', quantity: 2 }], level: 35, experience: 125, quantity: 1 }
];

const craftingRecipes = [
  { id: 'bronze_arrow', name: 'Bronze Arrow', materials: [{ item: 'arrow_shaft', quantity: 1 }, { item: 'bronze_arrow_head', quantity: 1 }], level: 1, experience: 20, quantity: 1 },
  { id: 'iron_arrow', name: 'Iron Arrow', materials: [{ item: 'oak_arrow_shaft', quantity: 1 }, { item: 'iron_arrow_head', quantity: 1 }], level: 15, experience: 35, quantity: 1 },
  { id: 'mithril_arrow', name: 'Mithril Arrow', materials: [{ item: 'oak_arrow_shaft', quantity: 1 }, { item: 'mithril_arrow_head', quantity: 1 }], level: 30, experience: 60, quantity: 1 },
  { id: 'basic_staff', name: 'Basic Staff', materials: [{ item: 'normal_logs', quantity: 3 }, { item: 'bronze_arrow_head', quantity: 1 }], level: 10, experience: 55, quantity: 1 },
  { id: 'oak_staff', name: 'Oak Staff', materials: [{ item: 'oak_logs', quantity: 3 }, { item: 'iron_arrow_head', quantity: 1 }], level: 25, experience: 85, quantity: 1 }
];

const cookingRecipes = [
  { raw: 'shrimp', cooked: 'cooked_shrimp', level: 1, experience: 30 },
  { raw: 'trout', cooked: 'cooked_trout', level: 15, experience: 70 },
  { raw: 'salmon', cooked: 'cooked_salmon', level: 25, experience: 90 }
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
        { name: 'All Resources by Area', value: 'resources' },
        { name: 'Smithing Recipes (Smelting)', value: 'smelting' },
        { name: 'Smithing Recipes (Items)', value: 'smithing' },
        { name: 'Fletching Recipes', value: 'fletching' },
        { name: 'Crafting Recipes', value: 'crafting' },
        { name: 'Cooking Recipes', value: 'cooking' },
        { name: 'All Items by Type', value: 'items' }
      )
  );

export async function execute(interaction: any) {
  const category = interaction.options.getString('category');

  try {
    let embed;

    switch (category) {
      case 'areas':
        embed = await createAreasEmbed();
        break;
      case 'monsters':
        embed = await createMonstersEmbed();
        break;
      case 'resources':
        embed = await createResourcesEmbed();
        break;
      case 'smelting':
        embed = createSmeltingEmbed();
        break;
      case 'smithing':
        embed = createSmithingEmbed();
        break;
      case 'fletching':
        embed = createFletchingEmbed();
        break;
      case 'crafting':
        embed = createCraftingEmbed();
        break;
      case 'cooking':
        embed = createCookingEmbed();
        break;
      case 'items':
        embed = await createItemsEmbed();
        break;
      default:
        embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('Error')
          .setDescription('Invalid category selected.');
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error in list command:', error);
    await interaction.reply({
      content: 'An error occurred while fetching the information. Please try again.',
      ephemeral: true
    });
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

function createSmeltingEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0xFF4500)
    .setTitle('🔥 Smelting Recipes')
    .setDescription('All available smelting recipes');

  smeltingRecipes.forEach(recipe => {
    const materials = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(' + ');
    embed.addFields({
      name: `${recipe.name} (Level ${recipe.level})`,
      value: `**Materials:** ${materials}\n**Experience:** ${recipe.experience} XP\n**Quantity:** ${recipe.quantity}`,
      inline: true
    });
  });

  return embed;
}

function createSmithingEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0x708090)
    .setTitle('⚒️ Smithing Recipes')
    .setDescription('All available smithing recipes');

  smithingRecipes.forEach(recipe => {
    const materials = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(' + ');
    embed.addFields({
      name: `${recipe.name} (Level ${recipe.level})`,
      value: `**Materials:** ${materials}\n**Experience:** ${recipe.experience} XP\n**Quantity:** ${recipe.quantity}`,
      inline: true
    });
  });

  return embed;
}

function createFletchingEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0x8B4513)
    .setTitle('🏹 Fletching Recipes')
    .setDescription('All available fletching recipes');

  fletchingRecipes.forEach(recipe => {
    const materials = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(' + ');
    embed.addFields({
      name: `${recipe.name} (Level ${recipe.level})`,
      value: `**Materials:** ${materials}\n**Experience:** ${recipe.experience} XP\n**Quantity:** ${recipe.quantity}`,
      inline: true
    });
  });

  return embed;
}

function createCraftingEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0xFF6347)
    .setTitle('🔨 Crafting Recipes')
    .setDescription('All available crafting recipes');

  craftingRecipes.forEach(recipe => {
    const materials = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(' + ');
    embed.addFields({
      name: `${recipe.name} (Level ${recipe.level})`,
      value: `**Materials:** ${materials}\n**Experience:** ${recipe.experience} XP\n**Quantity:** ${recipe.quantity}`,
      inline: true
    });
  });

  return embed;
}

function createCookingEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0xFF8C00)
    .setTitle('🍳 Cooking Recipes')
    .setDescription('All available cooking recipes');

  cookingRecipes.forEach(recipe => {
    embed.addFields({
      name: `${recipe.cooked.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} (Level ${recipe.level})`,
      value: `**Raw Material:** ${recipe.raw.replace('_', ' ')}\n**Experience:** ${recipe.experience} XP`,
      inline: true
    });
  });

  return embed;
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