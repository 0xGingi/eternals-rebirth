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

    const equipableItems = [];
    for (const invItem of player.inventory) {
      const item = await Item.findOne({ id: invItem.itemId });
      if (item && (item.type === 'weapon' || item.type === 'tool' || item.type === 'armor')) {
        const name = `${item.name} (x${invItem.quantity})`;
        if (name.toLowerCase().includes(focusedValue.toLowerCase())) {
          equipableItems.push({
            name: name,
            value: item.id
          });
        }
      }
    }

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

    if (item.type !== 'weapon' && item.type !== 'tool' && item.type !== 'armor') {
      await interaction.reply({
        content: 'This item cannot be equipped!',
        ephemeral: true
      });
      return;
    }

    const requiredSkill = item.type === 'weapon' ? 
      (item.subType === 'melee' ? 'attack' : item.subType === 'ranged' ? 'range' : item.subType === 'magic' ? 'magic' : 'range') :
      item.type === 'armor' ? 'defense' :
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
      if (player.equipment.ammunition.itemId && player.equipment.ammunition.itemId !== item.id) {
        const existingInvItem = player.inventory.find(invItem => invItem.itemId === player.equipment.ammunition.itemId);
        if (existingInvItem) {
          existingInvItem.quantity += player.equipment.ammunition.quantity;
        } else {
          player.inventory.push({ itemId: player.equipment.ammunition.itemId!, quantity: player.equipment.ammunition.quantity });
        }
      }
      
      if (player.equipment.ammunition.itemId === item.id) {
        player.equipment.ammunition.quantity += inventoryItem.quantity;
      } else {
        player.equipment.ammunition.itemId = item.id;
        player.equipment.ammunition.quantity = inventoryItem.quantity;
      }
      
      const filteredInventory = player.inventory.filter(invItem => invItem.itemId !== item.id);
      player.inventory.splice(0, player.inventory.length, ...filteredInventory);
    } else if (item.type === 'armor') {
      let previousItem: string = '';
      
      switch (item.subType) {
        case 'helmet':
          previousItem = player.equipment.helmet;
          player.equipment.helmet = item.id;
          break;
        case 'chest':
          previousItem = player.equipment.chest;
          player.equipment.chest = item.id;
          break;
        case 'legs':
          previousItem = player.equipment.legs;
          player.equipment.legs = item.id;
          break;
        case 'gloves':
          previousItem = player.equipment.gloves;
          player.equipment.gloves = item.id;
          break;
        case 'boots':
          previousItem = player.equipment.boots;
          player.equipment.boots = item.id;
          break;
        case 'shield':
          previousItem = player.equipment.shield;
          player.equipment.shield = item.id;
          break;
        default:
          await interaction.reply({
            content: 'This armor piece cannot be equipped!',
            ephemeral: true
          });
          return;
      }
      
      if (previousItem) {
        const existingInvItem = player.inventory.find(invItem => invItem.itemId === previousItem);
        if (existingInvItem) {
          existingInvItem.quantity += 1;
        } else {
          player.inventory.push({ itemId: previousItem, quantity: 1 });
        }
      }
      
      if (inventoryItem.quantity > 1) {
        inventoryItem.quantity -= 1;
      } else {
        const filteredInventory = player.inventory.filter(invItem => invItem.itemId !== item.id);
        player.inventory.splice(0, player.inventory.length, ...filteredInventory);
      }
    } else if (item.type === 'weapon' || item.type === 'tool') {
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

      // Combat style handling - only apply for weapons, not tools
      if (item.type === 'weapon') {
        if (item.subType === 'melee') {
          if (['attack', 'strength', 'defense'].includes(player.combatStats.attackStyle)) {
            player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as 'attack' | 'strength' | 'defense';
          }
          player.combatStats.attackStyle = player.combatStats.lastMeleeStyle || 'attack';
        } else if (item.subType === 'ranged') {
          if (['attack', 'strength', 'defense'].includes(player.combatStats.attackStyle)) {
            player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as 'attack' | 'strength' | 'defense';
          }
          player.combatStats.attackStyle = 'range';
        } else if (item.subType === 'magic') {
          if (['attack', 'strength', 'defense'].includes(player.combatStats.attackStyle)) {
            player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as 'attack' | 'strength' | 'defense';
          }
          player.combatStats.attackStyle = 'magic';
        }
      }
      
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
        { name: 'Stats', value: Object.entries((item.stats as any).toObject()).filter(([key, value]) => key !== '_id' && typeof value === 'number' && value > 0).map(([stat, value]) => `${stat.charAt(0).toUpperCase() + stat.slice(1)}: +${value}`).join('\n') || 'No stat bonuses', inline: true },
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