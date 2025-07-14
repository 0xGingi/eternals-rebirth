import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

const smithingRecipes = [
  { 
    id: 'bronze_sword',
    name: 'Bronze Sword',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 50,
    quantity: 1
  },
  { 
    id: 'iron_sword',
    name: 'Iron Sword',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 100,
    quantity: 1
  },
  { 
    id: 'mithril_sword',
    name: 'Mithril Sword',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 200,
    quantity: 1
  },
  { 
    id: 'bronze_pickaxe',
    name: 'Bronze Pickaxe',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 40,
    quantity: 1
  },
  { 
    id: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 80,
    quantity: 1
  },
  { 
    id: 'mithril_pickaxe',
    name: 'Mithril Pickaxe',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 150,
    quantity: 1
  },
  // Arrow heads
  { 
    id: 'bronze_arrow_head',
    name: 'Bronze Arrow Head',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 25,
    quantity: 15
  },
  { 
    id: 'iron_arrow_head',
    name: 'Iron Arrow Head',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 50,
    quantity: 15
  },
  { 
    id: 'mithril_arrow_head',
    name: 'Mithril Arrow Head',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 100,
    quantity: 15
  },
  // Axes
  { 
    id: 'bronze_axe',
    name: 'Bronze Axe',
    materials: [{ item: 'bronze_bar', quantity: 1 }],
    level: 1,
    experience: 40,
    quantity: 1
  },
  { 
    id: 'iron_axe',
    name: 'Iron Axe',
    materials: [{ item: 'iron_bar', quantity: 1 }],
    level: 15,
    experience: 80,
    quantity: 1
  },
  { 
    id: 'mithril_axe',
    name: 'Mithril Axe',
    materials: [{ item: 'mithril_bar', quantity: 1 }],
    level: 30,
    experience: 150,
    quantity: 1
  }
];

const smeltingRecipes = [
  {
    id: 'bronze_bar',
    name: 'Bronze Bar',
    materials: [{ item: 'copper_ore', quantity: 1 }, { item: 'tin_ore', quantity: 1 }],
    level: 1,
    experience: 30,
    quantity: 1
  },
  {
    id: 'iron_bar',
    name: 'Iron Bar', 
    materials: [{ item: 'iron_ore', quantity: 1 }, { item: 'coal', quantity: 1 }],
    level: 15,
    experience: 70,
    quantity: 1
  },
  {
    id: 'mithril_bar',
    name: 'Mithril Bar', 
    materials: [{ item: 'mithril_ore', quantity: 1 }, { item: 'coal', quantity: 2 }],
    level: 30,
    experience: 150,
    quantity: 1
  }
];

export const data = new SlashCommandBuilder()
  .setName('smith')
  .setDescription('Smith items or smelt ores')
  .addStringOption(option =>
    option.setName('action')
      .setDescription('What to do')
      .setRequired(true)
      .addChoices(
        { name: 'Smelt', value: 'smelt' },
        { name: 'Smith', value: 'smith' }
      )
  )
  .addStringOption(option =>
    option.setName('item')
      .setDescription('The item to create')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function autocomplete(interaction: any) {
  const focusedValue = interaction.options.getFocused();
  const focusedOption = interaction.options.getFocused(true);
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    if (!player) {
      await interaction.respond([]);
      return;
    }

    if (focusedOption.name === 'item') {
      const action = interaction.options.getString('action');
      if (!action) {
        // Provide helpful message when no action is selected
        await interaction.respond([
          { name: 'Please select an action (smelt/smith) first', value: 'no_action' }
        ]);
        return;
      }

      const availableItems = [];
      const recipes = action === 'smelt' ? smeltingRecipes : smithingRecipes;

      for (const recipe of recipes) {
        // Check if player has required materials
        const hasAllMaterials = recipe.materials.every(material => {
          const invItem = player.inventory.find(item => item.itemId === material.item);
          return invItem && invItem.quantity >= material.quantity;
        });

        if (hasAllMaterials) {
          const materialsText = recipe.materials.map(m => `${m.quantity}x ${m.item}`).join(', ');
          const name = `${recipe.name} (Requires: ${materialsText})`;
          if (name.toLowerCase().includes(focusedValue.toLowerCase())) {
            availableItems.push({
              name: name,
              value: recipe.id
            });
          }
        }
      }

      // Limit to 25 choices (Discord limit)
      const choices = availableItems.slice(0, 25);
      await interaction.respond(choices);
    }
  } catch (error) {
    console.error('Error in smith autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const action = interaction.options.getString('action');
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
        content: 'You cannot smith while in combat!',
        ephemeral: true
      });
      return;
    }

    const smithingLevel = calculateLevelFromExperience(player.skills?.smithing?.experience || 0);
    let recipe;
    
    if (action === 'smelt') {
      recipe = smeltingRecipes.find(r => 
        r.name.toLowerCase().includes(itemName!) || 
        r.id.toLowerCase().includes(itemName!)
      );
    } else {
      recipe = smithingRecipes.find(r => 
        r.name.toLowerCase().includes(itemName!) || 
        r.id.toLowerCase().includes(itemName!)
      );
    }
    
    if (!recipe) {
      await interaction.reply({
        content: `That item cannot be ${action}ed!`,
        ephemeral: true
      });
      return;
    }

    if (smithingLevel < recipe.level) {
      await interaction.reply({
        content: `You need smithing level ${recipe.level} to ${action} this item!`,
        ephemeral: true
      });
      return;
    }

    for (const material of recipe.materials) {
      const inventoryItem = player.inventory.find(item => item.itemId === material.item);
      if (!inventoryItem || inventoryItem.quantity < material.quantity) {
        await interaction.reply({
          content: `You need ${material.quantity}x ${material.item} to ${action} this item!`,
          ephemeral: true
        });
        return;
      }
    }

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

    const expResult = addExperience(player.skills?.smithing?.experience || 0, recipe.experience);
    if (player.skills?.smithing) {
      player.skills.smithing.experience = expResult.newExp;
    }

    const createdItem = player.inventory.find(item => item.itemId === recipe.id);
    const quantityToAdd = recipe.quantity || 1;
    if (createdItem) {
      createdItem.quantity += quantityToAdd;
    } else {
      player.inventory.push({ itemId: recipe.id, quantity: quantityToAdd });
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x808080)
      .setTitle(`${action === 'smelt' ? 'Smelting' : 'Smithing'} Success!`)
      .setDescription(`You successfully ${action}ed **${recipe.name}**!`)
      .addFields(
        { name: 'Experience Gained', value: `${recipe.experience} Smithing XP`, inline: true },
        { name: 'Item Created', value: `${recipe.name} x${quantityToAdd}`, inline: true },
        { name: 'Materials Used', value: recipe.materials.map(m => `${m.item} x${m.quantity}`).join('\n'), inline: true }
      );

    if (expResult.leveledUp) {
      embed.addFields({ name: 'Level Up!', value: `Smithing level is now ${expResult.newLevel}!`, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error smithing:', error);
    await interaction.reply({
      content: 'An error occurred while smithing. Please try again.',
      ephemeral: true
    });
  }
}