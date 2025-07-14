import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

export const data = new SlashCommandBuilder()
  .setName('equipment')
  .setDescription('View your equipped items');

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

    const equipmentSlots = ['helmet', 'chest', 'legs', 'boots', 'gloves', 'weapon', 'shield', 'ammunition', 'ring', 'necklace'];
    const equipmentText = await Promise.all(
      equipmentSlots.map(async (slot) => {
        const itemId = player.equipment[slot as keyof typeof player.equipment];
        if (itemId) {
          const item = await Item.findOne({ id: itemId });
          return `${slot.charAt(0).toUpperCase() + slot.slice(1)}: ${item ? item.name : 'Unknown Item'}`;
        }
        return `${slot.charAt(0).toUpperCase() + slot.slice(1)}: Empty`;
      })
    );

    const embed = new EmbedBuilder()
      .setColor(0x8B4513)
      .setTitle(`⚔️ ${player.username}'s Equipment`)
      .setDescription(equipmentText.join('\n'))
      .setFooter({ text: 'Use /equip <item> to equip items' });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    await interaction.reply({
      content: 'An error occurred while fetching your equipment. Please try again.',
      ephemeral: true
    });
  }
}