import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience } from '../utils/experienceUtils';

export const data = new SlashCommandBuilder()
  .setName('equip')
  .setDescription('Equip an item from your inventory')
  .addStringOption(option =>
    option.setName('item')
      .setDescription('The item to equip')
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

    // Get equipable items from inventory
    const equipableItems = [];
    for (const invItem of player.inventory) {
      const item = await Item.findOne({ id: invItem.itemId });
      if (item && (item.type === 'weapon' || item.type === 'tool')) {
        const name = `${item.name} (x${invItem.quantity})`;
        if (name.toLowerCase().includes(focusedValue.toLowerCase())) {
          equipableItems.push({
            name: name,
            value: item.id
          });
        }
      }
    }

    // Limit to 25 choices (Discord limit)
    const choices = equipableItems.slice(0, 25);
    await interaction.respond(choices);
  } catch (error) {
    console.error('Error in equip autocomplete:', error);
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

    const item = await Item.findOne({ 
      $or: [
        { name: { $regex: new RegExp(itemName!, 'i') } },
        { id: itemName }
      ]
    });

    if (!item) {
      await interaction.reply({
        content: 'Item not found!',
        ephemeral: true
      });
      return;
    }

    const inventoryItem = player.inventory.find(invItem => invItem.itemId === item.id);
    
    if (!inventoryItem) {
      await interaction.reply({
        content: 'You don\'t have this item in your inventory!',
        ephemeral: true
      });
      return;
    }

    if (item.type !== 'weapon' && item.type !== 'tool') {
      await interaction.reply({
        content: 'This item cannot be equipped!',
        ephemeral: true
      });
      return;
    }

    const requiredSkill = item.type === 'weapon' ? 
      (item.subType === 'melee' ? 'attack' : item.subType === 'ranged' ? 'range' : item.subType === 'magic' ? 'magic' : 'range') :
      (item.subType === 'pickaxe' ? 'mining' : item.subType === 'axe' ? 'woodcutting' : 'fishing');

    const playerLevel = calculateLevelFromExperience(player.skills?.[requiredSkill]?.experience || 0);
    
    if (playerLevel < item.levelRequired) {
      await interaction.reply({
        content: `You need level ${item.levelRequired} ${requiredSkill} to equip this item!`,
        ephemeral: true
      });
      return;
    }

    if (item.subType === 'ammunition') {
      // Handle ammunition equipping
      if (player.equipment.ammunition.itemId && player.equipment.ammunition.itemId !== item.id) {
        // Different ammunition type - move current to inventory
        const existingInvItem = player.inventory.find(invItem => invItem.itemId === player.equipment.ammunition.itemId);
        if (existingInvItem) {
          existingInvItem.quantity += player.equipment.ammunition.quantity;
        } else {
          player.inventory.push({ itemId: player.equipment.ammunition.itemId!, quantity: player.equipment.ammunition.quantity });
        }
      }
      
      // Add new ammunition to equipped slot
      if (player.equipment.ammunition.itemId === item.id) {
        // Same ammunition type - add to existing
        player.equipment.ammunition.quantity += inventoryItem.quantity;
      } else {
        // Different or no ammunition - replace
        player.equipment.ammunition.itemId = item.id;
        player.equipment.ammunition.quantity = inventoryItem.quantity;
      }
      
      // Remove from inventory
      const filteredInventory = player.inventory.filter(invItem => invItem.itemId !== item.id);
      player.inventory.splice(0, player.inventory.length, ...filteredInventory);
    } else {
      // Handle regular equipment
      const previousItem = player.equipment.weapon;
      
      if (previousItem) {
        const existingInvItem = player.inventory.find(invItem => invItem.itemId === previousItem);
        if (existingInvItem) {
          existingInvItem.quantity += 1;
        } else {
          player.inventory.push({ itemId: previousItem, quantity: 1 });
        }
      }
      
      player.equipment.weapon = item.id;
      
      // Auto-change combat style when equipping a weapon
      if (item.type === 'weapon') {
        if (item.subType === 'melee') {
          // Save current melee style as last used if currently on a melee style
          if (['attack', 'strength', 'defense'].includes(player.combatStats.attackStyle)) {
            player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as 'attack' | 'strength' | 'defense';
          }
          // Set to last used melee style
          player.combatStats.attackStyle = player.combatStats.lastMeleeStyle || 'attack';
        } else if (item.subType === 'ranged') {
          // Save current melee style before switching to ranged
          if (['attack', 'strength', 'defense'].includes(player.combatStats.attackStyle)) {
            player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as 'attack' | 'strength' | 'defense';
          }
          player.combatStats.attackStyle = 'range';
        } else if (item.subType === 'magic') {
          // Save current melee style before switching to magic
          if (['attack', 'strength', 'defense'].includes(player.combatStats.attackStyle)) {
            player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as 'attack' | 'strength' | 'defense';
          }
          player.combatStats.attackStyle = 'magic';
        }
      }
      
      // Remove from inventory
      if (inventoryItem.quantity > 1) {
        inventoryItem.quantity -= 1;
      } else {
        const filteredInventory = player.inventory.filter(invItem => invItem.itemId !== item.id);
        player.inventory.splice(0, player.inventory.length, ...filteredInventory);
      }
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('Item Equipped!')
      .setDescription(`You equipped **${item.name}**${item.subType === 'ammunition' ? ` (${player.equipment.ammunition.quantity} total)` : ''}`)
      .addFields(
        { name: 'Stats', value: Object.entries(item.stats).filter(([_, value]) => typeof value === 'number' && value > 0).map(([stat, value]) => `${stat.charAt(0).toUpperCase() + stat.slice(1)}: +${value}`).join('\n') || 'No stat bonuses', inline: true },
        { name: 'Required Level', value: `${item.levelRequired} ${requiredSkill}`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error equipping item:', error);
    await interaction.reply({
      content: 'An error occurred while equipping the item. Please try again.',
      ephemeral: true
    });
  }
}