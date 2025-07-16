import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

const ITEMS_PER_PAGE = 20;

export const data = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('View your inventory');

function createInventoryPaginationButtons(currentPage: number, totalPages: number): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  
  if (currentPage > 0) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`inventory_${currentPage - 1}`)
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
        .setCustomId(`inventory_${currentPage + 1}`)
        .setLabel('Next')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('➡️')
    );
  }
  
  return row;
}

export async function execute(interaction: any) {
  const page = 0; // Start with first page
  await handleInventoryDisplay(interaction, page, false);
}

export async function handleButton(interaction: any) {
  const customId = interaction.customId;
  const parts = customId.split('_');
  
  if (parts.length >= 2 && parts[0] === 'inventory') {
    const page = parseInt(parts[1]);
    
    if (isNaN(page)) return;
    
    await handleInventoryDisplay(interaction, page, true);
  }
}

async function handleInventoryDisplay(interaction: any, page: number, isUpdate: boolean) {
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

    // Calculate pagination
    const totalPages = Math.ceil(itemsWithDetails.length / ITEMS_PER_PAGE);
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, itemsWithDetails.length);
    const itemsOnPage = itemsWithDetails.slice(startIndex, endIndex);

    const categorizedItems = {
      weapons: [] as string[],
      armor: [] as string[],
      tools: [] as string[],
      food: [] as string[],
      resources: [] as string[],
      other: [] as string[]
    };

    for (const invItem of itemsOnPage) {
      const item = invItem.itemDetails;
      const quantity = invItem.quantity || 0;
      const displayText = item ? `${item.name} x${quantity}` : `Unknown Item (${invItem.itemId}) x${quantity}`;
      
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

    const embed = new EmbedBuilder()
      .setColor(0x8B4513)
      .setTitle(`${player.username}'s Inventory`)
      .setDescription(`Total Items: ${player.inventory.length} | Total Unique Items: ${itemsWithDetails.length}${totalPages > 1 ? ` (Page ${page + 1}/${totalPages})` : ''}`);

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

    const components = totalPages > 1 ? [createInventoryPaginationButtons(page, totalPages)] : [];
    
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