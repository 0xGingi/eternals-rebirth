import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

const cookingRecipes = [
  { raw: 'shrimp', cooked: 'cooked_shrimp', level: 1, experience: 30 },
  { raw: 'trout', cooked: 'cooked_trout', level: 15, experience: 70 },
  { raw: 'salmon', cooked: 'cooked_salmon', level: 25, experience: 90 }
];

export const data = new SlashCommandBuilder()
  .setName('cook')
  .setDescription('Cook raw food items')
  .addStringOption(option =>
    option.setName('item')
      .setDescription('The raw food item to cook')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many to cook (default: 1)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(1000)
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

    // Get cookable items from inventory
    const cookableItems = [];
    for (const invItem of player.inventory) {
      const recipe = cookingRecipes.find(r => r.raw === invItem.itemId);
      if (recipe) {
        const item = await Item.findOne({ id: invItem.itemId });
        if (item) {
          const name = `${item.name} (x${invItem.quantity}) → ${recipe.cooked.replace('_', ' ')}`;
          if (name.toLowerCase().includes(focusedValue.toLowerCase())) {
            cookableItems.push({
              name: name,
              value: item.id
            });
          }
        }
      }
    }

    // Limit to 25 choices (Discord limit)
    const choices = cookableItems.slice(0, 25);
    await interaction.respond(choices);
  } catch (error) {
    console.error('Error in cook autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const itemName = interaction.options.getString('item')?.toLowerCase();
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

    if (player.inCombat) {
      await interaction.reply({
        content: 'You cannot cook while in combat!',
        ephemeral: true
      });
      return;
    }

    if (player.isSkilling) {
      const timeRemaining = player.skillingEndTime ? Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000) : 0;
      await interaction.reply({
        content: `You are already ${player.currentSkill}! Please wait ${timeRemaining} seconds.`,
        ephemeral: true
      });
      return;
    }

    const recipe = cookingRecipes.find(r => 
      r.raw.toLowerCase().includes(itemName!) || 
      r.cooked.toLowerCase().includes(itemName!)
    );
    
    if (!recipe) {
      await interaction.reply({
        content: 'That item cannot be cooked!',
        ephemeral: true
      });
      return;
    }

    const rawItem = player.inventory.find(item => item.itemId === recipe.raw);
    
    if (!rawItem) {
      await interaction.reply({
        content: `You don't have any ${recipe.raw} to cook!`,
        ephemeral: true
      });
      return;
    }

    const actualQuantity = Math.min(requestedQuantity, rawItem.quantity);
    
    if (actualQuantity === 0) {
      await interaction.reply({
        content: `You don't have any ${recipe.raw} to cook!`,
        ephemeral: true
      });
      return;
    }

    const cookingLevel = calculateLevelFromExperience(player.skills?.cooking?.experience || 0);
    
    if (cookingLevel < recipe.level) {
      await interaction.reply({
        content: `You need cooking level ${recipe.level} to cook this item!`,
        ephemeral: true
      });
      return;
    }

    const totalExperience = recipe.experience * actualQuantity;
    const expResult = addExperience(player.skills?.cooking?.experience || 0, totalExperience);
    if (player.skills?.cooking) {
      player.skills.cooking.experience = expResult.newExp;
    }

    rawItem.quantity -= actualQuantity;
    if (rawItem.quantity <= 0) {
      const filteredInventory = player.inventory.filter(item => item.itemId !== recipe.raw);
      player.inventory.splice(0, player.inventory.length, ...filteredInventory);
    }

    const cookedItem = player.inventory.find(item => item.itemId === recipe.cooked);
    if (cookedItem) {
      cookedItem.quantity += actualQuantity;
    } else {
      player.inventory.push({ itemId: recipe.cooked, quantity: actualQuantity });
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0xFF8C00)
      .setTitle('Cooking Success!')
      .setDescription(`You successfully cooked **${recipe.cooked.replace('_', ' ')}**!`)
      .addFields(
        { name: 'Experience Gained', value: `${totalExperience} Cooking XP`, inline: true },
        { name: 'Items Created', value: `${recipe.cooked.replace('_', ' ')} x${actualQuantity}`, inline: true }
      );

    if (actualQuantity < requestedQuantity) {
      embed.addFields({ name: 'Note', value: `Only cooked ${actualQuantity} out of ${requestedQuantity} requested (insufficient materials)`, inline: false });
    }

    if (expResult.leveledUp) {
      embed.addFields({ name: '🎉 Level Up!', value: `Cooking level is now ${expResult.newLevel}!`, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error cooking:', error);
    await interaction.reply({
      content: 'An error occurred while cooking. Please try again.',
      ephemeral: true
    });
  }
}