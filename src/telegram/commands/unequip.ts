import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Item } from '../../models/Item';
import { getArgs } from '../utils/args';

export async function unequipCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const [slot] = getArgs(ctx);
  if (!slot) return ctx.reply('Usage: /unequip <helmet|chest|legs|boots|gloves|weapon|shield|ammunition|ring|necklace>');

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot unequip items while in combat.');

  if (slot === 'ammunition') {
    const ammo = player.equipment.ammunition;
    if (!ammo.itemId || ammo.quantity <= 0) return ctx.reply(`Nothing equipped in ${slot}.`);
    const item = await Item.findOne({ id: ammo.itemId });
    const inv = player.inventory.find(i => i.itemId === ammo.itemId);
    if (inv) inv.quantity += ammo.quantity; else player.inventory.push({ itemId: ammo.itemId, quantity: ammo.quantity });
    player.equipment.ammunition.itemId = null as any;
    player.equipment.ammunition.quantity = 0;
    await player.save();
    return ctx.reply(`Unequipped ${item?.name ?? ammo.itemId} (${ammo.quantity}).`);
  }

  const equippedId = (player.equipment as any)[slot];
  if (!equippedId) return ctx.reply(`Nothing equipped in ${slot}.`);
  const item = await Item.findOne({ id: equippedId });
  (player.equipment as any)[slot] = null;
  const inv = player.inventory.find(i => i.itemId === equippedId);
  if (inv) inv.quantity += 1; else player.inventory.push({ itemId: equippedId, quantity: 1 });
  await player.save();
  return ctx.reply(`Unequipped ${item?.name ?? equippedId}.`);
}

