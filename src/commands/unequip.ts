import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

export const data = new SlashCommandBuilder()
  .setName('unequip')
  .setDescription('Unequip an item from an equipment slot')
  .addStringOption(option =>
    option.setName('slot')
      .setDescription('The equipment slot to unequip')
      .setRequired(true)
      .addChoices(
        { name: 'Helmet', value: 'helmet' },
        { name: 'Chest', value: 'chest' },
        { name: 'Legs', value: 'legs' },
        { name: 'Boots', value: 'boots' },
        { name: 'Gloves', value: 'gloves' },
        { name: 'Weapon', value: 'weapon' },
        { name: 'Shield', value: 'shield' },
        { name: 'Ring', value: 'ring' },
        { name: 'Necklace', value: 'necklace' }
      )
  );

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const slot = interaction.options.getString('slot');

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
        content: 'You cannot unequip items while in combat!',
        ephemeral: true
      });
      return;
    }

    const equippedItemId = player.equipment[slot as keyof typeof player.equipment];
    
    if (!equippedItemId) {
      await interaction.reply({
        content: `You don't have anything equipped in the ${slot} slot!`,
        ephemeral: true
      });
      return;
    }

    const item = await Item.findOne({ id: equippedItemId });
    
    if (!item) {
      await interaction.reply({
        content: 'Error: Equipped item not found in database!',
        ephemeral: true
      });
      return;
    }

    // Remove from equipment slot
    player.equipment[slot as keyof typeof player.equipment] = null as any;

    // Add to inventory
    const existingItem = player.inventory.find(invItem => invItem.itemId === equippedItemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      player.inventory.push({ itemId: equippedItemId, quantity: 1 });
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0xFF6B00)
      .setTitle('⚔️ Item Unequipped!')
      .setDescription(`You unequipped **${item.name}** from your ${slot} slot`)
      .addFields(
        { name: 'Item', value: item.name, inline: true },
        { name: 'Slot', value: slot.charAt(0).toUpperCase() + slot.slice(1), inline: true },
        { name: 'Status', value: 'Added to inventory', inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error unequipping item:', error);
    await interaction.reply({
      content: 'An error occurred while unequipping the item. Please try again.',
      ephemeral: true
    });
  }
}