import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

const craftingRecipes = [
  // Staff crafting
  {
    id: 'basic_staff',
    name: 'Basic Staff',
    materials: [
      { item: 'normal_logs', quantity: 3 },
    ],
    level: 10,
    experience: 55,
    quantity: 1
  },
  {
    id: 'oak_staff',
    name: 'Oak Staff',
    materials: [
      { item: 'oak_logs', quantity: 3 },
    ],
    level: 25,
    experience: 85,
    quantity: 1
  }
];

export const data = new SlashCommandBuilder()
  .setName('craft')
  .setDescription('Craft arrows, bows, and staffs from materials')
  .addStringOption(option =>
    option.setName('item')
      .setDescription('The item to craft')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many to craft (default: 1)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(100)
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

    const availableItems = [];
    for (const recipe of craftingRecipes) {
      const hasAllMaterials = recipe.materials.every(material => {
        const invItem = player.inventory.find(item => item.itemId === material.item);
        return invItem && invItem.quantity >= material.quantity;
      });

      if (hasAllMaterials) {
        const materialsText = recipe.materials.map(m => `${m.quantity}x ${m.item.replace('_', ' ')}`).join(', ');
        const name = `${recipe.name} (${materialsText}) - ${recipe.experience} XP`;
        if (name.toLowerCase().includes(focusedValue.toLowerCase())) {
          availableItems.push({
            name: name,
            value: recipe.id
          });
        }
      }
    }

    await interaction.respond(availableItems.slice(0, 25));
  } catch (error) {
    console.error('Error in craft autocomplete:', error);
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
        content: 'You cannot craft while in combat!',
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

    const recipe = craftingRecipes.find(r => 
      r.name.toLowerCase().includes(itemName!) || 
      r.id.toLowerCase().includes(itemName!)
    );
    
    if (!recipe) {
      await interaction.reply({
        content: 'That item cannot be crafted!',
        ephemeral: true
      });
      return;
    }

    const craftingLevel = calculateLevelFromExperience(player.skills?.crafting?.experience || 0);
    
    if (craftingLevel < recipe.level) {
      await interaction.reply({
        content: `You need crafting level ${recipe.level} to craft this item!`,
        ephemeral: true
      });
      return;
    }

    // Calculate maximum possible crafts based on available materials
    let maxCrafts = requestedQuantity;
    for (const material of recipe.materials) {
      const inventoryItem = player.inventory.find(item => item.itemId === material.item);
      if (!inventoryItem) {
        await interaction.reply({
          content: `You need ${material.quantity}x ${material.item.replace('_', ' ')} to craft this item!`,
          ephemeral: true
        });
        return;
      }
      const possibleCrafts = Math.floor(inventoryItem.quantity / material.quantity);
      maxCrafts = Math.min(maxCrafts, possibleCrafts);
    }

    if (maxCrafts === 0) {
      await interaction.reply({
        content: `You don't have enough materials to craft this item!`,
        ephemeral: true
      });
      return;
    }

    // Remove materials from inventory
    for (const material of recipe.materials) {
      const inventoryItem = player.inventory.find(item => item.itemId === material.item);
      if (inventoryItem) {
        inventoryItem.quantity -= material.quantity * maxCrafts;
        if (inventoryItem.quantity <= 0) {
          const filteredInventory = player.inventory.filter(item => item.itemId !== material.item);
          player.inventory.splice(0, player.inventory.length, ...filteredInventory);
        }
      }
    }

    // Add experience
    const totalExperience = recipe.experience * maxCrafts;
    const expResult = addExperience(player.skills?.crafting?.experience || 0, totalExperience);
    if (player.skills?.crafting) {
      player.skills.crafting.experience = expResult.newExp;
    }

    // Add crafted items to inventory
    const totalItemsCreated = recipe.quantity * maxCrafts;
    const createdItem = player.inventory.find(item => item.itemId === recipe.id);
    if (createdItem) {
      createdItem.quantity += totalItemsCreated;
    } else {
      player.inventory.push({ itemId: recipe.id, quantity: totalItemsCreated });
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0xFF6347)
      .setTitle('🔨 Crafting Success!')
      .setDescription(`You successfully crafted **${recipe.name}**!`)
      .addFields(
        { name: 'Experience Gained', value: `${totalExperience} Crafting XP`, inline: true },
        { name: 'Items Created', value: `${recipe.name} x${totalItemsCreated}`, inline: true },
        { name: 'Materials Used', value: recipe.materials.map(m => `${m.item.replace('_', ' ')} x${m.quantity * maxCrafts}`).join('\n'), inline: true }
      );

    if (maxCrafts < requestedQuantity) {
      embed.addFields({ name: 'Note', value: `Only crafted ${maxCrafts} out of ${requestedQuantity} requested (insufficient materials)`, inline: false });
    }

    if (expResult.leveledUp) {
      embed.addFields({ name: 'Level Up!', value: `Crafting level is now ${expResult.newLevel}!`, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error crafting:', error);
    await interaction.reply({
      content: 'An error occurred while crafting. Please try again.',
      ephemeral: true
    });
  }
}