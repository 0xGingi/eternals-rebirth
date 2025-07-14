import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

export const data = new SlashCommandBuilder()
  .setName('eat')
  .setDescription('Eat food to restore health')
  .addStringOption(option =>
    option.setName('food')
      .setDescription('The food item to eat')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function autocomplete(interaction: any) {
  const focusedValue = interaction.options.getFocused();
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    if (!player) {
      await interaction.respond([]);
      return;
    }

    // Get edible items from inventory
    const edibleItems = [];
    for (const invItem of player.inventory) {
      const item = await Item.findOne({ id: invItem.itemId });
      if (item && item.edible) {
        const name = `${item.name} (x${invItem.quantity}) - Heals ${item.healAmount}`;
        if (name.toLowerCase().includes(focusedValue.toLowerCase())) {
          edibleItems.push({
            name: name,
            value: item.id
          });
        }
      }
    }

    // Limit to 25 choices (Discord limit)
    const choices = edibleItems.slice(0, 25);
    await interaction.respond(choices);
  } catch (error) {
    console.error('Error in eat autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const foodName = interaction.options.getString('food')?.toLowerCase();

  try {
    const player = await Player.findOne({ userId });
    
    if (!player) {
      await interaction.reply({
        content: 'You need to register first! Use `/register` to create your character.',
        ephemeral: true
      });
      return;
    }

    if (player.combatStats.currentHp >= player.combatStats.maxHp) {
      await interaction.reply({
        content: 'You are already at full health!',
        ephemeral: true
      });
      return;
    }

    const foodItem = player.inventory.find(item => {
      return item.itemId.toLowerCase().includes(foodName!) || 
             item.itemId.replace('_', ' ').toLowerCase().includes(foodName!);
    });

    if (!foodItem) {
      await interaction.reply({
        content: 'You don\'t have that food item in your inventory!',
        ephemeral: true
      });
      return;
    }

    const item = await Item.findOne({ id: foodItem.itemId });
    
    if (!item || !item.edible) {
      await interaction.reply({
        content: 'That item cannot be eaten!',
        ephemeral: true
      });
      return;
    }

    const healAmount = Math.min(item.healAmount, player.combatStats.maxHp - player.combatStats.currentHp);
    player.combatStats.currentHp += healAmount;

    foodItem.quantity -= 1;
    if (foodItem.quantity <= 0) {
      const filteredInventory = player.inventory.filter(item => item.itemId !== foodItem.itemId);
      player.inventory.splice(0, player.inventory.length, ...filteredInventory);
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('🍞 Food Consumed!')
      .setDescription(`You ate **${item.name}** and restored ${healAmount} health!`)
      .addFields(
        { name: 'Health', value: `${player.combatStats.currentHp}/${player.combatStats.maxHp}`, inline: true },
        { name: 'Remaining', value: `${foodItem.quantity > 0 ? foodItem.quantity : 0}x ${item.name}`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error eating food:', error);
    await interaction.reply({
      content: 'An error occurred while eating. Please try again.',
      ephemeral: true
    });
  }
}