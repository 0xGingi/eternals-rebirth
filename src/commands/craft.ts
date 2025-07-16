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
  },

  // Bow crafting
  {
    id: 'shortbow',
    name: 'Shortbow',
    materials: [
      { item: 'normal_logs', quantity: 2 },
    ],
    level: 5,
    experience: 30,
    quantity: 1
  },
  {
    id: 'longbow',
    name: 'Longbow',
    materials: [
      { item: 'normal_logs', quantity: 3 },
    ],
    level: 10,
    experience: 45,
    quantity: 1
  },
  {
    id: 'oak_shortbow',
    name: 'Oak Shortbow',
    materials: [
      { item: 'oak_logs', quantity: 2 },
    ],
    level: 20,
    experience: 60,
    quantity: 1
  },
  {
    id: 'oak_longbow',
    name: 'Oak Longbow',
    materials: [
      { item: 'oak_logs', quantity: 3 },
    ],
    level: 25,
    experience: 90,
    quantity: 1
  },
  {
    id: 'willow_shortbow',
    name: 'Willow Shortbow',
    materials: [
      { item: 'willow_logs', quantity: 2 },
    ],
    level: 35,
    experience: 100,
    quantity: 1
  },
  {
    id: 'willow_longbow',
    name: 'Willow Longbow',
    materials: [
      { item: 'willow_logs', quantity: 3 },
    ],
    level: 40,
    experience: 150,
    quantity: 1
  },
  {
    id: 'maple_shortbow',
    name: 'Maple Shortbow',
    materials: [
      { item: 'maple_logs', quantity: 2 },
    ],
    level: 50,
    experience: 150,
    quantity: 1
  },
  {
    id: 'maple_longbow',
    name: 'Maple Longbow',
    materials: [
      { item: 'maple_logs', quantity: 3 },
    ],
    level: 55,
    experience: 225,
    quantity: 1
  },
  {
    id: 'yew_shortbow',
    name: 'Yew Shortbow',
    materials: [
      { item: 'yew_logs', quantity: 2 },
    ],
    level: 65,
    experience: 200,
    quantity: 1
  },
  {
    id: 'yew_longbow',
    name: 'Yew Longbow',
    materials: [
      { item: 'yew_logs', quantity: 3 },
    ],
    level: 70,
    experience: 300,
    quantity: 1
  },
  {
    id: 'magic_shortbow',
    name: 'Magic Shortbow',
    materials: [
      { item: 'magic_logs', quantity: 2 },
    ],
    level: 80,
    experience: 250,
    quantity: 1
  },
  {
    id: 'magic_longbow',
    name: 'Magic Longbow',
    materials: [
      { item: 'magic_logs', quantity: 3 },
    ],
    level: 85,
    experience: 375,
    quantity: 1
  },
  {
    id: 'elder_shortbow',
    name: 'Elder Shortbow',
    materials: [
      { item: 'elder_logs', quantity: 2 },
    ],
    level: 95,
    experience: 300,
    quantity: 1
  },
  {
    id: 'elder_longbow',
    name: 'Elder Longbow',
    materials: [
      { item: 'elder_logs', quantity: 3 },
    ],
    level: 99,
    experience: 450,
    quantity: 1
  },

  // Leather armor crafting
  {
    id: 'leather_coif',
    name: 'Leather Coif',
    materials: [
      { item: 'leather', quantity: 2 },
    ],
    level: 5,
    experience: 25,
    quantity: 1
  },
  {
    id: 'leather_body',
    name: 'Leather Body',
    materials: [
      { item: 'leather', quantity: 4 },
    ],
    level: 10,
    experience: 50,
    quantity: 1
  },
  {
    id: 'leather_chaps',
    name: 'Leather Chaps',
    materials: [
      { item: 'leather', quantity: 3 },
    ],
    level: 8,
    experience: 35,
    quantity: 1
  },
  {
    id: 'leather_vambraces',
    name: 'Leather Vambraces',
    materials: [
      { item: 'leather', quantity: 1 },
    ],
    level: 3,
    experience: 15,
    quantity: 1
  },
  {
    id: 'leather_boots',
    name: 'Leather Boots',
    materials: [
      { item: 'leather', quantity: 1 },
    ],
    level: 3,
    experience: 15,
    quantity: 1
  },

  // Hard leather armor
  {
    id: 'hard_leather_coif',
    name: 'Hard Leather Coif',
    materials: [
      { item: 'hard_leather', quantity: 2 },
    ],
    level: 15,
    experience: 50,
    quantity: 1
  },
  {
    id: 'hard_leather_body',
    name: 'Hard Leather Body',
    materials: [
      { item: 'hard_leather', quantity: 4 },
    ],
    level: 20,
    experience: 100,
    quantity: 1
  },
  {
    id: 'hard_leather_chaps',
    name: 'Hard Leather Chaps',
    materials: [
      { item: 'hard_leather', quantity: 3 },
    ],
    level: 18,
    experience: 70,
    quantity: 1
  },
  {
    id: 'hard_leather_vambraces',
    name: 'Hard Leather Vambraces',
    materials: [
      { item: 'hard_leather', quantity: 1 },
    ],
    level: 13,
    experience: 30,
    quantity: 1
  },
  {
    id: 'hard_leather_boots',
    name: 'Hard Leather Boots',
    materials: [
      { item: 'hard_leather', quantity: 1 },
    ],
    level: 13,
    experience: 30,
    quantity: 1
  },

  // Studded leather armor
  {
    id: 'studded_coif',
    name: 'Studded Coif',
    materials: [
      { item: 'studded_leather', quantity: 2 },
    ],
    level: 25,
    experience: 75,
    quantity: 1
  },
  {
    id: 'studded_body',
    name: 'Studded Body',
    materials: [
      { item: 'studded_leather', quantity: 4 },
    ],
    level: 30,
    experience: 150,
    quantity: 1
  },
  {
    id: 'studded_chaps',
    name: 'Studded Chaps',
    materials: [
      { item: 'studded_leather', quantity: 3 },
    ],
    level: 28,
    experience: 105,
    quantity: 1
  },
  {
    id: 'studded_vambraces',
    name: 'Studded Vambraces',
    materials: [
      { item: 'studded_leather', quantity: 1 },
    ],
    level: 23,
    experience: 45,
    quantity: 1
  },
  {
    id: 'studded_boots',
    name: 'Studded Boots',
    materials: [
      { item: 'studded_leather', quantity: 1 },
    ],
    level: 23,
    experience: 45,
    quantity: 1
  },

  // Green dragonhide armor
  {
    id: 'green_dhide_coif',
    name: 'Green D\'hide Coif',
    materials: [
      { item: 'green_dhide', quantity: 2 },
    ],
    level: 35,
    experience: 100,
    quantity: 1
  },
  {
    id: 'green_dhide_body',
    name: 'Green D\'hide Body',
    materials: [
      { item: 'green_dhide', quantity: 4 },
    ],
    level: 40,
    experience: 200,
    quantity: 1
  },
  {
    id: 'green_dhide_chaps',
    name: 'Green D\'hide Chaps',
    materials: [
      { item: 'green_dhide', quantity: 3 },
    ],
    level: 38,
    experience: 140,
    quantity: 1
  },
  {
    id: 'green_dhide_vambraces',
    name: 'Green D\'hide Vambraces',
    materials: [
      { item: 'green_dhide', quantity: 1 },
    ],
    level: 33,
    experience: 60,
    quantity: 1
  },
  {
    id: 'green_dhide_boots',
    name: 'Green D\'hide Boots',
    materials: [
      { item: 'green_dhide', quantity: 1 },
    ],
    level: 33,
    experience: 60,
    quantity: 1
  },

  // Blue dragonhide armor
  {
    id: 'blue_dhide_coif',
    name: 'Blue D\'hide Coif',
    materials: [
      { item: 'blue_dhide', quantity: 2 },
    ],
    level: 45,
    experience: 150,
    quantity: 1
  },
  {
    id: 'blue_dhide_body',
    name: 'Blue D\'hide Body',
    materials: [
      { item: 'blue_dhide', quantity: 4 },
    ],
    level: 50,
    experience: 300,
    quantity: 1
  },
  {
    id: 'blue_dhide_chaps',
    name: 'Blue D\'hide Chaps',
    materials: [
      { item: 'blue_dhide', quantity: 3 },
    ],
    level: 48,
    experience: 210,
    quantity: 1
  },
  {
    id: 'blue_dhide_vambraces',
    name: 'Blue D\'hide Vambraces',
    materials: [
      { item: 'blue_dhide', quantity: 1 },
    ],
    level: 43,
    experience: 90,
    quantity: 1
  },
  {
    id: 'blue_dhide_boots',
    name: 'Blue D\'hide Boots',
    materials: [
      { item: 'blue_dhide', quantity: 1 },
    ],
    level: 43,
    experience: 90,
    quantity: 1
  },

  // Red dragonhide armor
  {
    id: 'red_dhide_coif',
    name: 'Red D\'hide Coif',
    materials: [
      { item: 'red_dhide', quantity: 2 },
    ],
    level: 55,
    experience: 200,
    quantity: 1
  },
  {
    id: 'red_dhide_body',
    name: 'Red D\'hide Body',
    materials: [
      { item: 'red_dhide', quantity: 4 },
    ],
    level: 60,
    experience: 400,
    quantity: 1
  },
  {
    id: 'red_dhide_chaps',
    name: 'Red D\'hide Chaps',
    materials: [
      { item: 'red_dhide', quantity: 3 },
    ],
    level: 58,
    experience: 280,
    quantity: 1
  },
  {
    id: 'red_dhide_vambraces',
    name: 'Red D\'hide Vambraces',
    materials: [
      { item: 'red_dhide', quantity: 1 },
    ],
    level: 53,
    experience: 120,
    quantity: 1
  },
  {
    id: 'red_dhide_boots',
    name: 'Red D\'hide Boots',
    materials: [
      { item: 'red_dhide', quantity: 1 },
    ],
    level: 53,
    experience: 120,
    quantity: 1
  },

  // Black dragonhide armor
  {
    id: 'black_dhide_coif',
    name: 'Black D\'hide Coif',
    materials: [
      { item: 'black_dhide', quantity: 2 },
    ],
    level: 65,
    experience: 250,
    quantity: 1
  },
  {
    id: 'black_dhide_body',
    name: 'Black D\'hide Body',
    materials: [
      { item: 'black_dhide', quantity: 4 },
    ],
    level: 70,
    experience: 500,
    quantity: 1
  },
  {
    id: 'black_dhide_chaps',
    name: 'Black D\'hide Chaps',
    materials: [
      { item: 'black_dhide', quantity: 3 },
    ],
    level: 68,
    experience: 350,
    quantity: 1
  },
  {
    id: 'black_dhide_vambraces',
    name: 'Black D\'hide Vambraces',
    materials: [
      { item: 'black_dhide', quantity: 1 },
    ],
    level: 63,
    experience: 150,
    quantity: 1
  },
  {
    id: 'black_dhide_boots',
    name: 'Black D\'hide Boots',
    materials: [
      { item: 'black_dhide', quantity: 1 },
    ],
    level: 63,
    experience: 150,
    quantity: 1
  },

  // Ancient dragonhide armor
  {
    id: 'ancient_dhide_coif',
    name: 'Ancient D\'hide Coif',
    materials: [
      { item: 'ancient_dhide', quantity: 2 },
    ],
    level: 75,
    experience: 300,
    quantity: 1
  },
  {
    id: 'ancient_dhide_body',
    name: 'Ancient D\'hide Body',
    materials: [
      { item: 'ancient_dhide', quantity: 4 },
    ],
    level: 80,
    experience: 600,
    quantity: 1
  },
  {
    id: 'ancient_dhide_chaps',
    name: 'Ancient D\'hide Chaps',
    materials: [
      { item: 'ancient_dhide', quantity: 3 },
    ],
    level: 78,
    experience: 420,
    quantity: 1
  },
  {
    id: 'ancient_dhide_vambraces',
    name: 'Ancient D\'hide Vambraces',
    materials: [
      { item: 'ancient_dhide', quantity: 1 },
    ],
    level: 73,
    experience: 180,
    quantity: 1
  },
  {
    id: 'ancient_dhide_boots',
    name: 'Ancient D\'hide Boots',
    materials: [
      { item: 'ancient_dhide', quantity: 1 },
    ],
    level: 73,
    experience: 180,
    quantity: 1
  },

  // Barrows leather armor
  {
    id: 'barrows_leather_coif',
    name: 'Barrows Leather Coif',
    materials: [
      { item: 'barrows_leather', quantity: 2 },
    ],
    level: 85,
    experience: 400,
    quantity: 1
  },
  {
    id: 'barrows_leather_body',
    name: 'Barrows Leather Body',
    materials: [
      { item: 'barrows_leather', quantity: 4 },
    ],
    level: 90,
    experience: 800,
    quantity: 1
  },
  {
    id: 'barrows_leather_chaps',
    name: 'Barrows Leather Chaps',
    materials: [
      { item: 'barrows_leather', quantity: 3 },
    ],
    level: 88,
    experience: 560,
    quantity: 1
  },
  {
    id: 'barrows_leather_vambraces',
    name: 'Barrows Leather Vambraces',
    materials: [
      { item: 'barrows_leather', quantity: 1 },
    ],
    level: 83,
    experience: 240,
    quantity: 1
  },
  {
    id: 'barrows_leather_boots',
    name: 'Barrows Leather Boots',
    materials: [
      { item: 'barrows_leather', quantity: 1 },
    ],
    level: 83,
    experience: 240,
    quantity: 1
  },

  // Primal leather armor
  {
    id: 'primal_leather_coif',
    name: 'Primal Leather Coif',
    materials: [
      { item: 'primal_leather', quantity: 2 },
    ],
    level: 95,
    experience: 500,
    quantity: 1
  },
  {
    id: 'primal_leather_body',
    name: 'Primal Leather Body',
    materials: [
      { item: 'primal_leather', quantity: 4 },
    ],
    level: 99,
    experience: 1000,
    quantity: 1
  },
  {
    id: 'primal_leather_chaps',
    name: 'Primal Leather Chaps',
    materials: [
      { item: 'primal_leather', quantity: 3 },
    ],
    level: 98,
    experience: 700,
    quantity: 1
  },
  {
    id: 'primal_leather_vambraces',
    name: 'Primal Leather Vambraces',
    materials: [
      { item: 'primal_leather', quantity: 1 },
    ],
    level: 93,
    experience: 300,
    quantity: 1
  },
  {
    id: 'primal_leather_boots',
    name: 'Primal Leather Boots',
    materials: [
      { item: 'primal_leather', quantity: 1 },
    ],
    level: 93,
    experience: 300,
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