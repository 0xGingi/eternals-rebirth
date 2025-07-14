import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

const craftingRecipes = [
  // Arrow crafting
  {
    id: 'bronze_arrow',
    name: 'Bronze Arrow',
    materials: [
      { item: 'arrow_shaft', quantity: 1 },
      { item: 'bronze_arrow_head', quantity: 1 }
    ],
    level: 1,
    experience: 20,
    quantity: 1
  },
  {
    id: 'iron_arrow',
    name: 'Iron Arrow',
    materials: [
      { item: 'oak_arrow_shaft', quantity: 1 },
      { item: 'iron_arrow_head', quantity: 1 }
    ],
    level: 15,
    experience: 35,
    quantity: 1
  },
  {
    id: 'mithril_arrow',
    name: 'Mithril Arrow',
    materials: [
      { item: 'oak_arrow_shaft', quantity: 1 },
      { item: 'mithril_arrow_head', quantity: 1 }
    ],
    level: 30,
    experience: 60,
    quantity: 1
  },
  // Bow crafting (alternative to fletching)
  {
    id: 'shortbow',
    name: 'Shortbow',
    materials: [
      { item: 'normal_logs', quantity: 2 },
      { item: 'arrow_shaft', quantity: 3 }
    ],
    level: 5,
    experience: 45,
    quantity: 1
  },
  {
    id: 'oak_shortbow',
    name: 'Oak Shortbow',
    materials: [
      { item: 'oak_logs', quantity: 2 },
      { item: 'oak_arrow_shaft', quantity: 3 }
    ],
    level: 20,
    experience: 70,
    quantity: 1
  },
  // Staff crafting
  {
    id: 'basic_staff',
    name: 'Basic Staff',
    materials: [
      { item: 'normal_logs', quantity: 3 },
      { item: 'bronze_arrow_head', quantity: 1 } // bronze tip for the staff
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
      { item: 'iron_arrow_head', quantity: 1 } // iron tip for the staff
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

    // Check materials
    for (const material of recipe.materials) {
      const inventoryItem = player.inventory.find(item => item.itemId === material.item);
      if (!inventoryItem || inventoryItem.quantity < material.quantity) {
        await interaction.reply({
          content: `You need ${material.quantity}x ${material.item.replace('_', ' ')} to craft this item!`,
          ephemeral: true
        });
        return;
      }
    }

    // Remove materials from inventory
    for (const material of recipe.materials) {
      const inventoryItem = player.inventory.find(item => item.itemId === material.item);
      if (inventoryItem) {
        inventoryItem.quantity -= material.quantity;
        if (inventoryItem.quantity <= 0) {
          const filteredInventory = player.inventory.filter(item => item.itemId !== material.item);
          player.inventory.splice(0, player.inventory.length, ...filteredInventory);
        }
      }
    }

    // Add experience
    const expResult = addExperience(player.skills?.crafting?.experience || 0, recipe.experience);
    if (player.skills?.crafting) {
      player.skills.crafting.experience = expResult.newExp;
    }

    // Add crafted item to inventory
    const createdItem = player.inventory.find(item => item.itemId === recipe.id);
    if (createdItem) {
      createdItem.quantity += recipe.quantity;
    } else {
      player.inventory.push({ itemId: recipe.id, quantity: recipe.quantity });
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0xFF6347)
      .setTitle('🔨 Crafting Success!')
      .setDescription(`You successfully crafted **${recipe.name}**!`)
      .addFields(
        { name: 'Experience Gained', value: `${recipe.experience} Crafting XP`, inline: true },
        { name: 'Item Created', value: `${recipe.name} x${recipe.quantity}`, inline: true },
        { name: 'Materials Used', value: recipe.materials.map(m => `${m.item.replace('_', ' ')} x${m.quantity}`).join('\n'), inline: true }
      );

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