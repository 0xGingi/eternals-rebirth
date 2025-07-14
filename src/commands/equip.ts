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

    const equipSlot = item.subType === 'ammunition' ? 'ammunition' : 'weapon';
    const previousItem = player.equipment[equipSlot];

    if (previousItem) {
      const existingInvItem = player.inventory.find(invItem => invItem.itemId === previousItem);
      if (existingInvItem) {
        existingInvItem.quantity += 1;
      } else {
        player.inventory.push({ itemId: previousItem, quantity: 1 });
      }
    }

    player.equipment[equipSlot] = item.id;
    
    if (inventoryItem.quantity > 1) {
      inventoryItem.quantity -= 1;
    } else {
      const filteredInventory = player.inventory.filter(invItem => invItem.itemId !== item.id);
      player.inventory.splice(0, player.inventory.length, ...filteredInventory);
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('Item Equipped!')
      .setDescription(`You equipped **${item.name}**`)
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