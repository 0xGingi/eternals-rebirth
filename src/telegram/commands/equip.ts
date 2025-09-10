import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Item } from '../../models/Item';
import { calculateLevelFromExperience } from '../../utils/experienceUtils';
import { getArgString } from '../utils/args';

export async function equipCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const query = getArgString(ctx).toLowerCase();
  if (!query) return ctx.reply('Usage: /equip <item name or id>');

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  const item = await Item.findOne({ $or: [{ id: query }, { name: { $regex: new RegExp(query, 'i') } }] });
  if (!item) return ctx.reply('Item not found.');

  const invItem = player.inventory.find(i => i.itemId === item.id);
  if (!invItem) return ctx.reply('You do not have this item in your inventory.');

  if (!(item.type === 'weapon' || item.type === 'tool' || item.type === 'armor' || item.subType === 'ammunition'))
    return ctx.reply('This item cannot be equipped.');

  const requiredSkill = item.type === 'weapon'
    ? (item.subType === 'melee' ? 'attack' : item.subType === 'ranged' ? 'range' : item.subType === 'magic' ? 'magic' : 'range')
    : item.type === 'armor' ? 'defense'
    : (item.subType === 'pickaxe' ? 'mining' : item.subType === 'axe' ? 'woodcutting' : 'fishing');

  const level = calculateLevelFromExperience((player.skills as any)[requiredSkill]?.experience || 0);
  if (level < item.levelRequired) return ctx.reply(`You need level ${item.levelRequired} ${requiredSkill} to equip this.`);

  if (item.subType === 'ammunition') {
    // stack into ammunition slot
    if (player.equipment.ammunition.itemId && player.equipment.ammunition.itemId !== item.id) {
      const existing = player.inventory.find(i => i.itemId === player.equipment.ammunition.itemId);
      if (existing) existing.quantity += player.equipment.ammunition.quantity; else player.inventory.push({ itemId: player.equipment.ammunition.itemId!, quantity: player.equipment.ammunition.quantity });
    }
    if (player.equipment.ammunition.itemId === item.id) {
      player.equipment.ammunition.quantity += invItem.quantity;
    } else {
      player.equipment.ammunition.itemId = item.id;
      player.equipment.ammunition.quantity = invItem.quantity;
    }
    // remove from inventory
    player.inventory = player.inventory.filter(i => i.itemId !== item.id);
  } else if (item.type === 'armor') {
    let previous: string | null = null;
    switch (item.subType) {
      case 'helmet': previous = player.equipment.helmet; player.equipment.helmet = item.id; break;
      case 'chest': previous = player.equipment.chest; player.equipment.chest = item.id; break;
      case 'legs': previous = player.equipment.legs; player.equipment.legs = item.id; break;
      case 'gloves': previous = player.equipment.gloves; player.equipment.gloves = item.id; break;
      case 'boots': previous = player.equipment.boots; player.equipment.boots = item.id; break;
      case 'shield': previous = player.equipment.shield; player.equipment.shield = item.id; break;
      default: return ctx.reply('This armor piece cannot be equipped.');
    }
    if (previous) {
      const inv = player.inventory.find(i => i.itemId === previous);
      if (inv) inv.quantity += 1; else player.inventory.push({ itemId: previous, quantity: 1 });
    }
    if (invItem.quantity > 1) invItem.quantity -= 1; else player.inventory = player.inventory.filter(i => i.itemId !== item.id);
  } else {
    // weapon or tool into weapon slot
    const previous = player.equipment.weapon;
    if (previous) {
      const inv = player.inventory.find(i => i.itemId === previous);
      if (inv) inv.quantity += 1; else player.inventory.push({ itemId: previous, quantity: 1 });
    }
    player.equipment.weapon = item.id;
    if (invItem.quantity > 1) invItem.quantity -= 1; else player.inventory = player.inventory.filter(i => i.itemId !== item.id);
    if (item.type === 'weapon') {
      if (item.subType === 'melee') {
        if (['attack','strength','defense'].includes(player.combatStats.attackStyle)) player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as any;
        player.combatStats.attackStyle = player.combatStats.lastMeleeStyle || 'attack';
      } else if (item.subType === 'ranged') {
        if (['attack','strength','defense'].includes(player.combatStats.attackStyle)) player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as any;
        player.combatStats.attackStyle = 'range';
      } else if (item.subType === 'magic') {
        if (['attack','strength','defense'].includes(player.combatStats.attackStyle)) player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as any;
        player.combatStats.attackStyle = 'magic';
      }
    }
  }

  await player.save();
  return ctx.reply(`Equipped ${item.name}.`);
}

