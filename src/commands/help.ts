import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('View all available commands');

const helpCategories = {
  basic: {
    name: 'Basic Commands',
    description: 'Essential commands to get started',
    commands: [
      '`/register` - Register your character',
      '`/stats` - View your stats and levels',
      '`/help` - Show this help menu',
      '`/list <category>` - View detailed game information'
    ]
  },
  world: {
    name: 'World Commands',
    description: 'Commands for exploring the world',
    commands: [
      '`/travel <destination>` - Travel to different areas',
      '`/area` - View current area monsters & resources'
    ]
  },
  inventory: {
    name: 'Inventory Commands',
    description: 'Manage your items and equipment',
    commands: [
      '`/inventory` - View your inventory',
      '`/equipment` - View equipped items',
      '`/equip <item>` - Equip weapons/tools',
      '`/unequip <slot>` - Unequip from equipment slot',
      '`/eat <food> [quantity]` - Eat food to restore health'
    ]
  },
  combat: {
    name: 'Combat Commands',
    description: 'Fight monsters and manage combat',
    commands: [
      '`/fight` - Start combat with monsters',
      '`/style <combat_style>` - Change combat style',
      '',
      '**In combat, use buttons to:**',
      '• Attack - Deal damage to monster',
      '• Defend - Reduce incoming damage',
      '• Eat Food - Heal during combat',
      '• Run Away - Attempt to escape'
    ]
  },
  skilling: {
    name: 'Skilling Commands',
    description: 'Gather resources and craft items',
    commands: [
      '`/mine [ore] [quantity]` - Mine ores (requires pickaxe)',
      '`/fish [fish] [quantity]` - Catch fish (requires fishing rod)',
      '`/woodcut [tree] [quantity]` - Cut trees (requires axe)',
      '`/smith <smelt/smith> <item> [quantity]` - Smelt ores or smith items',
      '`/fletch <item> [quantity]` - Fletch logs into arrow shafts and bows',
      '`/craft <item> [quantity]` - Craft arrows, bows, and staffs',
      '`/cook <item> [quantity]` - Cook raw fish into food'
    ]
  },
  information: {
    name: 'Information Commands',
    description: 'Get detailed information about the game',
    commands: [
      '`/list areas` - All areas and their content',
      '`/list monsters` - All monsters by area',
      '`/list resources` - All resources by area',
      '`/list smelting` - Smelting recipes',
      '`/list smithing` - Smithing recipes',
      '`/list fletching` - Fletching recipes',
      '`/list crafting` - Crafting recipes',
      '`/list cooking` - Cooking recipes',
      '`/list items` - All items by type'
    ]
  }
};

function createMainMenuEmbed() {
  return new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('Eternals Rebirth - Help Menu')
    .setDescription('Choose a category to view commands:')
    .addFields(
      { name: '⚙️ Basic', value: helpCategories.basic.description, inline: true },
      { name: '🗺️ World', value: helpCategories.world.description, inline: true },
      { name: '🎒 Inventory', value: helpCategories.inventory.description, inline: true },
      { name: '⚔️ Combat', value: helpCategories.combat.description, inline: true },
      { name: '🔨 Skilling', value: helpCategories.skilling.description, inline: true },
      { name: '📚 Information', value: helpCategories.information.description, inline: true }
    )
    .setFooter({ text: 'Click a button below to view commands in that category' });
}

function createCategoryEmbed(category: string) {
  const categoryData = helpCategories[category as keyof typeof helpCategories];
  
  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`${categoryData.name}`)
    .setDescription(categoryData.description)
    .addFields({
      name: 'Commands',
      value: categoryData.commands.join('\n'),
      inline: false
    })
    .setFooter({ text: 'Click "Back to Menu" to return to the main help menu' });
}

function createMainMenuButtons() {
  const row1 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('help_basic')
        .setLabel('Basic')
        .setEmoji('⚙️')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('help_world')
        .setLabel('World')
        .setEmoji('🗺️')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('help_inventory')
        .setLabel('Inventory')
        .setEmoji('🎒')
        .setStyle(ButtonStyle.Primary)
    );

  const row2 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('help_combat')
        .setLabel('Combat')
        .setEmoji('⚔️')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('help_skilling')
        .setLabel('Skilling')
        .setEmoji('🔨')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('help_information')
        .setLabel('Information')
        .setEmoji('📚')
        .setStyle(ButtonStyle.Primary)
    );

  return [row1, row2];
}

function createBackButton() {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('help_back')
        .setLabel('Back to Menu')
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Secondary)
    );
}

export async function execute(interaction: any) {
  const embed = createMainMenuEmbed();
  const buttons = createMainMenuButtons();

  await interaction.reply({ 
    embeds: [embed], 
    components: buttons 
  });
}

export async function handleButton(interaction: any) {
  const customId = interaction.customId;
  
  if (customId === 'help_back') {
    const embed = createMainMenuEmbed();
    const buttons = createMainMenuButtons();
    
    await interaction.update({ 
      embeds: [embed], 
      components: buttons 
    });
  } else if (customId.startsWith('help_')) {
    const category = customId.replace('help_', '');
    const embed = createCategoryEmbed(category);
    const backButton = createBackButton();
    
    await interaction.update({ 
      embeds: [embed], 
      components: [backButton] 
    });
  }
}