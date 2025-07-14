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

    const inventoryText = await Promise.all(
      player.inventory.map(async (invItem) => {
        const item = await Item.findOne({ id: invItem.itemId });
        if (item) {
          return `${item.name} x${invItem.quantity}`;
        }
        return `Unknown Item (${invItem.itemId}) x${invItem.quantity}`;
      })
    );

    const embed = new EmbedBuilder()
      .setColor(0x8B4513)
      .setTitle(`${player.username}'s Inventory`)
      .setDescription(inventoryText.join('\n'))
      .setFooter({ text: `Total Items: ${player.inventory.length}` });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    await interaction.reply({
      content: 'An error occurred while fetching your inventory. Please try again.',
      ephemeral: true
    });
  }
}