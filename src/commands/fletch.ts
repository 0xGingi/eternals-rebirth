import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

const fletchingRecipes = [
  {
    id: 'arrow_shaft',
    name: 'Arrow Shaft',
    materials: [{ item: 'normal_logs', quantity: 1 }],
    level: 1,
    experience: 15,
    quantity: 15
  },
  {
    id: 'oak_arrow_shaft',
    name: 'Oak Arrow Shaft',
    materials: [{ item: 'oak_logs', quantity: 1 }],
    level: 15,
    experience: 25,
    quantity: 30
  },
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
    id: 'shortbow',
    name: 'Shortbow',
    materials: [{ item: 'normal_logs', quantity: 2 }],
    level: 5,
    experience: 50,
    quantity: 1
  },
  {
    id: 'oak_shortbow',
    name: 'Oak Shortbow',
    materials: [{ item: 'oak_logs', quantity: 2 }],
    level: 20,
    experience: 75,
    quantity: 1
  },
  {
    id: 'willow_shortbow',
    name: 'Willow Shortbow',
    materials: [{ item: 'willow_logs', quantity: 2 }],
    level: 35,
    experience: 125,
    quantity: 1
  }
];

export const data = new SlashCommandBuilder()
  .setName('fletch')
  .setDescription('Fletch logs into arrow shafts and bows')
  .addStringOption(option =>
    option.setName('item')
      .setDescription('The item to fletch')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many to fletch (default: 1)')
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
    for (const recipe of fletchingRecipes) {
      const hasAllMaterials = recipe.materials.every(material => {
        const invItem = player.inventory.find(item => item.itemId === material.item);
        return invItem && invItem.quantity >= material.quantity;
      });

      if (hasAllMaterials) {
        const materialsText = recipe.materials.map(m => `${m.quantity}x ${m.item}`).join(', ');
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
    console.error('Error in fletch autocomplete:', error);
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
        content: 'You cannot fletch while in combat!',
        ephemeral: true
      });
      return;
    }

    const recipe = fletchingRecipes.find(r => 
      r.name.toLowerCase().includes(itemName!) || 
      r.id.toLowerCase().includes(itemName!)
    );
    
    if (!recipe) {
      await interaction.reply({
        content: 'That item cannot be fletched!',
        ephemeral: true
      });
      return;
    }

    const fletchingLevel = calculateLevelFromExperience(player.skills?.fletching?.experience || 0);
    
    if (fletchingLevel < recipe.level) {
      await interaction.reply({
        content: `You need fletching level ${recipe.level} to fletch this item!`,
        ephemeral: true
      });
      return;
    }

    // Calculate maximum possible fletches based on available materials
    let maxFletches = requestedQuantity;
    for (const material of recipe.materials) {
      const inventoryItem = player.inventory.find(item => item.itemId === material.item);
      if (!inventoryItem) {
        await interaction.reply({
          content: `You need ${material.quantity}x ${material.item} to fletch this item!`,
          ephemeral: true
        });
        return;
      }
      const possibleFletches = Math.floor(inventoryItem.quantity / material.quantity);
      maxFletches = Math.min(maxFletches, possibleFletches);
    }

    if (maxFletches === 0) {
      await interaction.reply({
        content: `You don't have enough materials to fletch this item!`,
        ephemeral: true
      });
      return;
    }

    for (const material of recipe.materials) {
      const inventoryItem = player.inventory.find(item => item.itemId === material.item);
      if (inventoryItem) {
        inventoryItem.quantity -= material.quantity * maxFletches;
        if (inventoryItem.quantity <= 0) {
          const filteredInventory = player.inventory.filter(item => item.itemId !== material.item);
          player.inventory.splice(0, player.inventory.length, ...filteredInventory);
        }
      }
    }

    const totalExperience = recipe.experience * maxFletches;
    const expResult = addExperience(player.skills?.fletching?.experience || 0, totalExperience);
    if (player.skills?.fletching) {
      player.skills.fletching.experience = expResult.newExp;
    }

    const totalItemsCreated = recipe.quantity * maxFletches;
    const createdItem = player.inventory.find(item => item.itemId === recipe.id);
    if (createdItem) {
      createdItem.quantity += totalItemsCreated;
    } else {
      player.inventory.push({ itemId: recipe.id, quantity: totalItemsCreated });
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x8B4513)
      .setTitle('🏹 Fletching Success!')
      .setDescription(`You successfully fletched **${recipe.name}**!`)
      .addFields(
        { name: 'Experience Gained', value: `${totalExperience} Fletching XP`, inline: true },
        { name: 'Items Created', value: `${recipe.name} x${totalItemsCreated}`, inline: true },
        { name: 'Materials Used', value: recipe.materials.map(m => `${m.item} x${m.quantity * maxFletches}`).join('\n'), inline: true }
      );

    if (maxFletches < requestedQuantity) {
      embed.addFields({ name: 'Note', value: `Only fletched ${maxFletches} out of ${requestedQuantity} requested (insufficient materials)`, inline: false });
    }

    if (expResult.leveledUp) {
      embed.addFields({ name: 'Level Up!', value: `Fletching level is now ${expResult.newLevel}!`, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fletching:', error);
    await interaction.reply({
      content: 'An error occurred while fletching. Please try again.',
      ephemeral: true
    });
  }
}