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
    description: 'Converts items to coins at 50% value',
    type: 'utility'
  },
  high_alch: {
    name: 'High Level Alchemy',
    levelRequired: 55,
    experience: 65,
    valuePercent: 1.0,
    description: 'Converts items to coins at 100% value',
    type: 'utility'
  }
};

const combatSpells = {
  wind_strike: {
    name: 'Wind Strike',
    levelRequired: 1,
    baseDamage: 2,
    maxDamage: 8,
    experience: 5.5,
    runes: { air_rune: 1, mind_rune: 1 },
    description: 'A basic wind spell'
  },
  water_strike: {
    name: 'Water Strike',
    levelRequired: 5,
    baseDamage: 4,
    maxDamage: 10,
    experience: 7.5,
    runes: { water_rune: 1, air_rune: 1, mind_rune: 1 },
    description: 'A basic water spell'
  },
  earth_strike: {
    name: 'Earth Strike',
    levelRequired: 9,
    baseDamage: 6,
    maxDamage: 12,
    experience: 9.5,
    runes: { earth_rune: 2, air_rune: 1, mind_rune: 1 },
    description: 'A basic earth spell'
  },
  fire_strike: {
    name: 'Fire Strike',
    levelRequired: 13,
    baseDamage: 8,
    maxDamage: 16,
    experience: 11.5,
    runes: { fire_rune: 3, air_rune: 2, mind_rune: 1 },
    description: 'A basic fire spell'
  },
  wind_bolt: {
    name: 'Wind Bolt',
    levelRequired: 17,
    baseDamage: 9,
    maxDamage: 18,
    experience: 13.5,
    runes: { air_rune: 2, chaos_rune: 1 },
    description: 'An improved wind spell'
  },
  water_bolt: {
    name: 'Water Bolt',
    levelRequired: 23,
    baseDamage: 10,
    maxDamage: 20,
    experience: 16.5,
    runes: { water_rune: 2, air_rune: 2, chaos_rune: 1 },
    description: 'An improved water spell'
  },
  earth_bolt: {
    name: 'Earth Bolt',
    levelRequired: 29,
    baseDamage: 11,
    maxDamage: 22,
    experience: 19.5,
    runes: { earth_rune: 3, air_rune: 2, chaos_rune: 1 },
    description: 'An improved earth spell'
  },
  fire_bolt: {
    name: 'Fire Bolt',
    levelRequired: 35,
    baseDamage: 12,
    maxDamage: 24,
    experience: 22.5,
    runes: { fire_rune: 4, air_rune: 3, chaos_rune: 1 },
    description: 'An improved fire spell'
  },
  wind_blast: {
    name: 'Wind Blast',
    levelRequired: 41,
    baseDamage: 13,
    maxDamage: 26,
    experience: 25.5,
    runes: { air_rune: 3, death_rune: 1 },
    description: 'A powerful wind spell'
  },
  water_blast: {
    name: 'Water Blast',
    levelRequired: 47,
    baseDamage: 14,
    maxDamage: 28,
    experience: 28.5,
    runes: { water_rune: 3, air_rune: 3, death_rune: 1 },
    description: 'A powerful water spell'
  },
  earth_blast: {
    name: 'Earth Blast',
    levelRequired: 53,
    baseDamage: 15,
    maxDamage: 30,
    experience: 31.5,
    runes: { earth_rune: 4, air_rune: 3, death_rune: 1 },
    description: 'A powerful earth spell'
  },
  fire_blast: {
    name: 'Fire Blast',
    levelRequired: 59,
    baseDamage: 16,
    maxDamage: 32,
    experience: 34.5,
    runes: { fire_rune: 5, air_rune: 4, death_rune: 1 },
    description: 'A powerful fire spell'
  },
  wind_wave: {
    name: 'Wind Wave',
    levelRequired: 62,
    baseDamage: 17,
    maxDamage: 34,
    experience: 36,
    runes: { air_rune: 5, blood_rune: 1 },
    description: 'An advanced wind spell'
  },
  water_wave: {
    name: 'Water Wave',
    levelRequired: 65,
    baseDamage: 18,
    maxDamage: 36,
    experience: 37.5,
    runes: { water_rune: 7, air_rune: 5, blood_rune: 1 },
    description: 'An advanced water spell'
  },
  earth_wave: {
    name: 'Earth Wave',
    levelRequired: 70,
    baseDamage: 19,
    maxDamage: 38,
    experience: 40,
    runes: { earth_rune: 7, air_rune: 5, blood_rune: 1 },
    description: 'An advanced earth spell'
  },
  fire_wave: {
    name: 'Fire Wave',
    levelRequired: 75,
    baseDamage: 20,
    maxDamage: 40,
    experience: 42.5,
    runes: { fire_rune: 7, air_rune: 5, blood_rune: 1 },
    description: 'An advanced fire spell'
  },
  wind_surge: {
    name: 'Wind Surge',
    levelRequired: 81,
    baseDamage: 21,
    maxDamage: 42,
    experience: 44,
    runes: { air_rune: 7, soul_rune: 1 },
    description: 'The ultimate wind spell'
  },
  water_surge: {
    name: 'Water Surge',
    levelRequired: 85,
    baseDamage: 22,
    maxDamage: 44,
    experience: 46,
    runes: { water_rune: 10, air_rune: 7, soul_rune: 1 },
    description: 'The ultimate water spell'
  },
  earth_surge: {
    name: 'Earth Surge',
    levelRequired: 90,
    baseDamage: 23,
    maxDamage: 46,
    experience: 48,
    runes: { earth_rune: 10, air_rune: 7, soul_rune: 1 },
    description: 'The ultimate earth spell'
  },
  fire_surge: {
    name: 'Fire Surge',
    levelRequired: 95,
    baseDamage: 24,
    maxDamage: 48,
    experience: 50,
    runes: { fire_rune: 10, air_rune: 7, soul_rune: 1 },
    description: 'The ultimate fire spell'
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