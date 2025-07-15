import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

export const data = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('View your inventory');

export async function execute(interaction: any) {
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    
    if (!player) {
      await interaction.reply({
        content: 'You need to register first! Use `/register` to create your character.',
        ephemeral: true
      });
      return;
    }

    if (!player.inventory || player.inventory.length === 0) {
      await interaction.reply({
        content: 'Your inventory is empty!',
        ephemeral: true
      });
      return;
    }

    const itemsWithDetails = await Promise.all(
      player.inventory.map(async (invItem) => {
        const item = await Item.findOne({ id: invItem.itemId });
        return {
          ...invItem,
          itemDetails: item || null
        };
      })
    );

    const categorizedItems = {
      weapons: [] as string[],
      armor: [] as string[],
      tools: [] as string[],
      food: [] as string[],
      resources: [] as string[],
      other: [] as string[]
    };

    for (const invItem of itemsWithDetails) {
      const item = invItem.itemDetails;
      const displayText = item ? `${item.name} x${invItem.quantity}` : `Unknown Item (${invItem.itemId}) x${invItem.quantity}`;
      
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
      .setDescription(`Total Items: ${player.inventory.length} | Total Unique Items: ${itemsWithDetails.length}`);

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

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    await interaction.reply({
      content: 'An error occurred while fetching your inventory. Please try again.',
      ephemeral: true
    });
  }
}