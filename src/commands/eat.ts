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
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many to eat (default: 1)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(50)
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
  const requestedQuantity = interaction.options.getInteger('quantity') || 1;

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

    const actualQuantity = Math.min(requestedQuantity, foodItem.quantity);
    let totalHealAmount = 0;
    let itemsEaten = 0;

    for (let i = 0; i < actualQuantity; i++) {
      if (player.combatStats.currentHp >= player.combatStats.maxHp) {
        break;
      }
      
      const healAmount = Math.min(item.healAmount, player.combatStats.maxHp - player.combatStats.currentHp);
      player.combatStats.currentHp += healAmount;
      totalHealAmount += healAmount;
      itemsEaten++;
      
      foodItem.quantity -= 1;
      if (foodItem.quantity <= 0) {
        const filteredInventory = player.inventory.filter(item => item.itemId !== foodItem.itemId);
        player.inventory.splice(0, player.inventory.length, ...filteredInventory);
        break;
      }
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('🍞 Food Consumed!')
      .setDescription(`You ate **${itemsEaten}x ${item.name}** and restored ${totalHealAmount} health!`)
      .addFields(
        { name: 'Health', value: `${player.combatStats.currentHp}/${player.combatStats.maxHp}`, inline: true },
        { name: 'Remaining', value: `${foodItem.quantity > 0 ? foodItem.quantity : 0}x ${item.name}`, inline: true }
      );

    if (itemsEaten < requestedQuantity) {
      if (player.combatStats.currentHp >= player.combatStats.maxHp) {
        embed.addFields({ name: 'Note', value: `Stopped at full health after eating ${itemsEaten} item(s)`, inline: false });
      } else {
        embed.addFields({ name: 'Note', value: `Only ate ${itemsEaten} out of ${requestedQuantity} requested (ran out of food)`, inline: false });
      }
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error eating food:', error);
    await interaction.reply({
      content: 'An error occurred while eating. Please try again.',
      ephemeral: true
    });
  }
}