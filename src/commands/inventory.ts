import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

const ITEMS_PER_PAGE = 20;

export const data = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('View your inventory')
  .addStringOption(option =>
    option.setName('category')
      .setDescription('Filter by item category')
      .setRequired(false)
      .addChoices(
        { name: 'All', value: 'all' },
        { name: 'Weapons', value: 'weapons' },
        { name: 'Armor', value: 'armor' },
        { name: 'Tools', value: 'tools' },
        { name: 'Food', value: 'food' },
        { name: 'Resources', value: 'resources' },
        { name: 'Other', value: 'other' }
      )
  );

function createInventoryPaginationButtons(currentPage: number, totalPages: number, category: string = 'all'): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  
  if (currentPage > 0) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`inventory_${currentPage - 1}_${category}`)
        .setLabel('Previous')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('⬅️')
    );
  }
  
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`inventory_info`)
      .setLabel(`Page ${currentPage + 1}/${totalPages}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
  
  if (currentPage < totalPages - 1) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`inventory_${currentPage + 1}_${category}`)
        .setLabel('Next')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('➡️')
    );
  }
  
  return row;
}

function createCategoryButtons(currentCategory: string = 'all'): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  
  const categories = [
    { name: 'All', value: 'all', emoji: '📦' },
    { name: 'Weapons', value: 'weapons', emoji: '⚔️' },
    { name: 'Armor', value: 'armor', emoji: '🛡️' },
    { name: 'Tools', value: 'tools', emoji: '🔨' },
    { name: 'Food', value: 'food', emoji: '🍖' }
  ];
  
  for (const cat of categories) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`inventory_cat_${cat.value}`)
        .setLabel(cat.name)
        .setEmoji(cat.emoji)
        .setStyle(currentCategory === cat.value ? ButtonStyle.Primary : ButtonStyle.Secondary)
    );
  }
  
  return row;
}

function createCategoryButtons2(currentCategory: string = 'all'): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  
  const categories = [
    { name: 'Resources', value: 'resources', emoji: '⛏️' },
    { name: 'Other', value: 'other', emoji: '❓' }
  ];
  
  for (const cat of categories) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`inventory_cat_${cat.value}`)
        .setLabel(cat.name)
        .setEmoji(cat.emoji)
        .setStyle(currentCategory === cat.value ? ButtonStyle.Primary : ButtonStyle.Secondary)
    );
  }
  
  return row;
}

export async function execute(interaction: any) {
  const page = 0;
  const category = interaction.options.getString('category') || 'all';
  await handleInventoryDisplay(interaction, page, false, category);
}

export async function handleButton(interaction: any) {
  const customId = interaction.customId;
  const parts = customId.split('_');
  
  if (parts.length >= 2 && parts[0] === 'inventory') {
    if (parts[1] === 'cat') {
      const category = parts[2] || 'all';
      await handleInventoryDisplay(interaction, 0, true, category);
    } else {
      const page = parseInt(parts[1]);
      const category = parts[2] || 'all';
      
      if (isNaN(page)) return;
      
      await handleInventoryDisplay(interaction, page, true, category);
    }
  }
}

async function handleInventoryDisplay(interaction: any, page: number, isUpdate: boolean, category: string = 'all') {
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    
    if (!player) {
      const replyMethod = isUpdate ? 'followUp' : 'reply';
      await interaction[replyMethod]({
        content: 'You need to register first! Use `/register` to create your character.',
        ephemeral: true
      });
      return;
    }

    if (!player.inventory || player.inventory.length === 0) {
      const replyMethod = isUpdate ? 'followUp' : 'reply';
      await interaction[replyMethod]({
        content: 'Your inventory is empty!',
        ephemeral: true
      });
      return;
    }

    const itemsWithDetails = await Promise.all(
      player.inventory.map(async (invItem) => {
        const item = await Item.findOne({ id: invItem.itemId });
        return {
          itemId: invItem.itemId,
          quantity: invItem.quantity,
          itemDetails: item || null
        };
      })
    );

    // First categorize all items
    const allCategorizedItems = {
      weapons: [] as any[],
      armor: [] as any[],
      tools: [] as any[],
      food: [] as any[],
      resources: [] as any[],
      other: [] as any[]
    };

    for (const invItem of itemsWithDetails) {
      const item = invItem.itemDetails;
      const quantity = invItem.quantity || 0;
      const displayText = item ? `${item.name} x${quantity}` : `Unknown Item (${invItem.itemId}) x${quantity}`;
      const itemData = { displayText, ...invItem };
      
      if (!item) {
        allCategorizedItems.other.push(itemData);
        continue;
      }

      switch (item.type) {
        case 'weapon':
          allCategorizedItems.weapons.push(itemData);
          break;
        case 'armor':
          allCategorizedItems.armor.push(itemData);
          break;
        case 'tool':
          allCategorizedItems.tools.push(itemData);
          break;
        case 'food':
          allCategorizedItems.food.push(itemData);
          break;
        case 'resource':
          allCategorizedItems.resources.push(itemData);
          break;
        default:
          allCategorizedItems.other.push(itemData);
      }
    }

    // Filter by category if not 'all'
    let filteredItems = [];
    if (category === 'all') {
      filteredItems = [...allCategorizedItems.weapons, ...allCategorizedItems.armor, ...allCategorizedItems.tools, ...allCategorizedItems.food, ...allCategorizedItems.resources, ...allCategorizedItems.other];
    } else {
      filteredItems = allCategorizedItems[category as keyof typeof allCategorizedItems] || [];
    }

    // Calculate pagination for filtered items
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length);
    const itemsOnPage = filteredItems.slice(startIndex, endIndex);

    // Create display categories for current page
    const categorizedItems = {
      weapons: [] as string[],
      armor: [] as string[],
      tools: [] as string[],
      food: [] as string[],
      resources: [] as string[],
      other: [] as string[]
    };

    if (category === 'all') {
      // Show all categories but only items on current page
      for (const itemData of itemsOnPage) {
        const item = itemData.itemDetails;
        const displayText = itemData.displayText;
        
        if (!item) {
          categorizedItems.other.push(displayText);
          continue;
        }

        switch (item.type) {
          case 'weapon':
            categorizedItems.weapons.push(displayText);
            break;
          case 'armor':
            categorizedItems.armor.push(displayText);
            break;
          case 'tool':
            categorizedItems.tools.push(displayText);
            break;
          case 'food':
            categorizedItems.food.push(displayText);
            break;
          case 'resource':
            categorizedItems.resources.push(displayText);
            break;
          default:
            categorizedItems.other.push(displayText);
        }
      }
    } else {
      // Show only selected category
      for (const itemData of itemsOnPage) {
        categorizedItems[category as keyof typeof categorizedItems].push(itemData.displayText);
      }
    }

    const categoryName = category === 'all' ? 'All Items' : category.charAt(0).toUpperCase() + category.slice(1);
    const embed = new EmbedBuilder()
      .setColor(0x8B4513)
      .setTitle(`${player.username}'s Inventory - ${categoryName}`)
      .setDescription(`Total Items: ${player.inventory.length} | Showing: ${filteredItems.length} items${totalPages > 1 ? ` (Page ${page + 1}/${totalPages})` : ''}`);

    if (categorizedItems.weapons.length > 0) {
      embed.addFields({
        name: 'Weapons',
        value: categorizedItems.weapons.join('\n'),
        inline: false
      });
    }

    if (categorizedItems.armor.length > 0) {
      embed.addFields({
        name: 'Armor',
        value: categorizedItems.armor.join('\n'),
        inline: false
      });
    }

    if (categorizedItems.tools.length > 0) {
      embed.addFields({
        name: 'Tools',
        value: categorizedItems.tools.join('\n'),
        inline: false
      });
    }

    if (categorizedItems.food.length > 0) {
      embed.addFields({
        name: 'Food',
        value: categorizedItems.food.join('\n'),
        inline: false
      });
    }

    if (categorizedItems.resources.length > 0) {
      embed.addFields({
        name: 'Resources',
        value: categorizedItems.resources.join('\n'),
        inline: false
      });
    }

    if (categorizedItems.other.length > 0) {
      embed.addFields({
        name: 'Other',
        value: categorizedItems.other.join('\n'),
        inline: false
      });
    }

    const components = [];
    components.push(createCategoryButtons(category));
    components.push(createCategoryButtons2(category));
    if (totalPages > 1) {
      components.push(createInventoryPaginationButtons(page, totalPages, category));
    }
    
    if (isUpdate) {
      await interaction.update({ embeds: [embed], components });
    } else {
      await interaction.reply({ embeds: [embed], components });
    }
  } catch (error) {
    console.error('Error fetching inventory:', error);
    const replyMethod = isUpdate ? 'followUp' : 'reply';
    await interaction[replyMethod]({
      content: 'An error occurred while fetching your inventory. Please try again.',
      ephemeral: true
    });
  }
}