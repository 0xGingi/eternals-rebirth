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
      '`/style <combat_style>` - Change combat style (attack/strength/defense/range/magic)',
      '',
      '**In combat, use buttons to:**',
      '• Attack - Deal damage to monster',
      '• Cast Spell - Cast magic spells (magic style only)',
      '• Defend - Reduce incoming damage',
      '• Eat Food - Heal during combat',
      '• Run Away - Attempt to escape',
      '',
      '**Magic Combat:**',
      '• Equip magic weapon & set style to magic',
      '• Spells consume runes and deal elemental damage',
      '• Elemental weaknesses provide +10% accuracy & damage'
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
      '`/craft <item> [quantity]` - Craft arrows, leather armor, and other items',
      '`/cook <item> [quantity]` - Cook raw fish into food',
      '`/runecraft <rune> [quantity]` - Craft runes from essence (requires talismans)',
      '',
      '**Skilling Requirements:**',
      '• Mining requires pickaxe equipped',
      '• Fishing requires fishing rod equipped',
      '• Woodcutting requires axe equipped',
      '• Higher tier tools unlock better resources',
      '• Level requirements apply to all resources and tools'
    ]
  },
  spells: {
    name: 'Magic & Spells',
    description: 'Cast magic spells and use abilities',
    commands: [
      '**Combat Spells** (Used in combat with "Cast Spell" button):',
      '• Wind/Earth/Water/Fire Strike/Bolt/Blast/Wave/Surge',
      '• Requires runes & magic weapon equipped',
      '• Elemental damage with weakness bonuses',
      '• Levels 1-95, progressively stronger',
      '',
      '**Utility Spells:**',
      '`/spell low_alch <item> [quantity]` - Low Level Alchemy (Level 1)',
      '• Converts items to coins at 50% value',
      '• Requires magic weapon equipped, gives 31 Magic XP',
      '',
      '`/spell high_alch <item> [quantity]` - High Level Alchemy (Level 55)',
      '• Converts items to coins at 100% value',
      '• Requires magic weapon equipped, gives 65 Magic XP',
      '',
      '**Notes:**',
      '• Magic weapon must be equipped for all spells',
      '• Combat spells used via combat interface only',
      '• Use `/list magic` for complete spell guide'
    ]
  },
  information: {
    name: 'Information Commands',
    description: 'Get detailed information about the game',
    commands: [
      '`/list areas` - All areas and their content',
      '`/list monsters` - All monsters by area',
      '`/list combat` - Combat styles and requirements',
      '`/list resources` - All resources by area',
      '`/list smelting` - Smelting recipes',
      '`/list smithing` - Smithing recipes',
      '`/list fletching` - Fletching recipes',
      '`/list crafting` - Crafting recipes',
      '`/list cooking` - Cooking recipes',
      '`/list runecrafting` - Complete runecrafting guide',
      '`/list magic` - Magic spells and combat guide',
      '`/list items` - All items by type',
      '`/list equipment` - Equipment slots and requirements',
      '`/list skills` - Complete skill training guide'
    ]
  },
  mechanics: {
    name: 'Game Mechanics',
    description: 'Core gameplay systems and mechanics',
    commands: [
      '**Experience System:**',
      '• All skills level from 1-99 with exponential XP requirements',
      '• Level determines equipment and content accessibility',
      '• Higher level content provides more experience',
      '',
      '**Combat System:**',
      '• Turn-based combat with 4 actions available',
      '• Equipment provides accuracy, defense, and damage bonuses',
      '• Combat styles determine which skill gains experience',
      '• Magic combat requires runes and elemental weaknesses apply',
      '',
      '**Area System:**',
      '• Areas have level requirements for access',
      '• Each area contains unique monsters and resources',
      '• Travel between areas using `/travel` command',
      '• Higher level areas provide better rewards',
      '',
      '**Item System:**',
      '• Items have level requirements and type restrictions',
      '• Equipment slots: weapon, armor, ammunition, tools',
      '• Tools are required for skilling activities',
      '• Food items restore health during combat',
      '',
      '**Skill Training:**',
      '• Combat skills: Attack, Strength, Defense, Magic, Range',
      '• Gathering skills: Mining, Fishing, Woodcutting',
      '• Production skills: Smithing, Cooking, Fletching, Crafting, Runecrafting',
      '• Skills unlock better equipment and content progression'
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
      { name: '🔮 Spells', value: helpCategories.spells.description, inline: true },
      { name: '📚 Information', value: helpCategories.information.description, inline: true },
      { name: '🎯 Game Mechanics', value: helpCategories.mechanics.description, inline: true }
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
        .setCustomId('help_spells')
        .setLabel('Spells')
        .setEmoji('🔮')
        .setStyle(ButtonStyle.Primary)
    );

  const row3 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('help_information')
        .setLabel('Information')
        .setEmoji('📚')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('help_mechanics')
        .setLabel('Mechanics')
        .setEmoji('🎯')
        .setStyle(ButtonStyle.Primary)
    );

  return [row1, row2, row3];
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