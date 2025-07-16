import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';
import { defaultItems } from '../data/items';

const spells = {
  low_alch: {
    name: 'Low Level Alchemy',
    levelRequired: 1,
    experience: 31,
    valuePercent: 0.5,
    description: 'Converts items to coins at 50% value'
  },
  high_alch: {
    name: 'High Level Alchemy',
    levelRequired: 55,
    experience: 65,
    valuePercent: 1.0,
    description: 'Converts items to coins at 100% value'
  }
};

export const data = new SlashCommandBuilder()
  .setName('spell')
  .setDescription('Cast magic spells')
  .addSubcommand(subcommand =>
    subcommand
      .setName('low_alch')
      .setDescription('Cast Low Level Alchemy (Level 1) - Converts items to 50% value in coins')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('The item to alchemize')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addIntegerOption(option =>
        option.setName('quantity')
          .setDescription('How many items to alchemize (default: 1)')
          .setRequired(false)
          .setMinValue(1)
          .setMaxValue(10000)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('high_alch')
      .setDescription('Cast High Level Alchemy (Level 55) - Converts items to 100% value in coins')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('The item to alchemize')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addIntegerOption(option =>
        option.setName('quantity')
          .setDescription('How many items to alchemize (default: 1)')
          .setRequired(false)
          .setMinValue(1)
          .setMaxValue(10000)
      )
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

    // Get items from player inventory that can be alchemized
    const availableItems = [];
    for (const invItem of player.inventory) {
      if (invItem.quantity > 0) {
        const itemData = defaultItems.find(item => item.id === invItem.itemId);
        if (itemData && itemData.value && itemData.value > 0) {
          const name = `${itemData.name} (${invItem.quantity}x) - ${itemData.value} coins each`;
          if (name.toLowerCase().includes(focusedValue.toLowerCase())) {
            availableItems.push({
              name: name,
              value: invItem.itemId
            });
          }
        }
      }
    }

    await interaction.respond(availableItems.slice(0, 25));
  } catch (error) {
    console.error('Error in spell autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const subcommand = interaction.options.getSubcommand();
  const itemId = interaction.options.getString('item');
  const quantity = interaction.options.getInteger('quantity') || 1;

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
        content: 'You cannot cast spells while in combat!',
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

    const spell = spells[subcommand as keyof typeof spells];
    if (!spell) {
      await interaction.reply({
        content: 'Invalid spell!',
        ephemeral: true
      });
      return;
    }

    const magicLevel = calculateLevelFromExperience(player.skills?.magic?.experience || 0);
    
    if (magicLevel < spell.levelRequired) {
      await interaction.reply({
        content: `You need magic level ${spell.levelRequired} to cast ${spell.name}!`,
        ephemeral: true
      });
      return;
    }

    // Check if player has a magic weapon equipped
    const hasMagicWeapon = player.equipment.weapon && 
      await Item.findOne({ id: player.equipment.weapon, subType: 'magic' });
    
    if (!hasMagicWeapon) {
      await interaction.reply({
        content: 'You need a magic weapon equipped to cast spells!',
        ephemeral: true
      });
      return;
    }

    // Find the item in player's inventory
    const inventoryItem = player.inventory.find(item => item.itemId === itemId);
    if (!inventoryItem) {
      await interaction.reply({
        content: 'You don\'t have that item in your inventory!',
        ephemeral: true
      });
      return;
    }

    // Get item data
    const itemData = defaultItems.find(item => item.id === itemId);
    if (!itemData) {
      await interaction.reply({
        content: 'Item not found!',
        ephemeral: true
      });
      return;
    }

    if (!itemData.value || itemData.value <= 0) {
      await interaction.reply({
        content: 'This item cannot be alchemized!',
        ephemeral: true
      });
      return;
    }

    // Check if player has enough items
    const maxQuantity = Math.min(quantity, inventoryItem.quantity);
    if (maxQuantity === 0) {
      await interaction.reply({
        content: 'You don\'t have enough of that item!',
        ephemeral: true
      });
      return;
    }

    // Calculate coins to give
    const coinsPerItem = Math.floor(itemData.value * spell.valuePercent);
    const totalCoins = coinsPerItem * maxQuantity;
    const totalExperience = spell.experience * maxQuantity;

    // Remove items from inventory
    inventoryItem.quantity -= maxQuantity;
    if (inventoryItem.quantity <= 0) {
      const filteredInventory = player.inventory.filter(item => item.itemId !== itemId);
      player.inventory.splice(0, player.inventory.length, ...filteredInventory);
    }

    // Add coins to inventory
    const existingCoins = player.inventory.find(item => item.itemId === 'coins');
    if (existingCoins) {
      existingCoins.quantity += totalCoins;
    } else {
      player.inventory.push({ itemId: 'coins', quantity: totalCoins });
    }

    // Add experience
    const expResult = addExperience(player.skills?.magic?.experience || 0, totalExperience);
    if (player.skills?.magic) {
      player.skills.magic.experience = expResult.newExp;
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x9400D3)
      .setTitle('🔮 Spell Cast Successfully!')
      .setDescription(`You cast **${spell.name}** on ${maxQuantity}x ${itemData.name}!`)
      .addFields(
        { name: 'Items Alchemized', value: `${itemData.name} x${maxQuantity}`, inline: true },
        { name: 'Coins Gained', value: `${totalCoins} coins`, inline: true },
        { name: 'Experience Gained', value: `${totalExperience} Magic XP`, inline: true },
        { name: 'Conversion Rate', value: `${Math.round(spell.valuePercent * 100)}% of item value`, inline: true }
      );

    if (maxQuantity < quantity) {
      embed.addFields({ name: 'Note', value: `Only alchemized ${maxQuantity} out of ${quantity} requested (insufficient items)`, inline: false });
    }

    if (expResult.leveledUp) {
      embed.addFields({ name: 'Level Up!', value: `Magic level is now ${expResult.newLevel}!`, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error casting spell:', error);
    await interaction.reply({
      content: 'An error occurred while casting the spell. Please try again.',
      ephemeral: true
    });
  }
}