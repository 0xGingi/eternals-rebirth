import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { addExperience, calculateLevelFromExperience } from '../../utils/experienceUtils';
import { getArgs } from '../utils/args';

type SmeltDef = {
  barId: string;
  name: string;
  level: number;
  xp: number;
  inputs: { itemId: string; qty: number }[];
};

export const SMELTS: SmeltDef[] = [
  { barId: 'bronze_bar',  name: 'Bronze Bar',  level: 1,  xp: 10,  inputs: [{ itemId: 'copper_ore', qty: 1 }, { itemId: 'tin_ore', qty: 1 }] },
  { barId: 'iron_bar',    name: 'Iron Bar',    level: 15, xp: 20,  inputs: [{ itemId: 'iron_ore', qty: 1 }] },
  { barId: 'steel_bar',   name: 'Steel Bar',   level: 30, xp: 35,  inputs: [{ itemId: 'iron_ore', qty: 1 }, { itemId: 'coal', qty: 2 }] },
  { barId: 'mithril_bar', name: 'Mithril Bar', level: 50, xp: 50,  inputs: [{ itemId: 'mithril_ore', qty: 1 }, { itemId: 'coal', qty: 4 }] },
  { barId: 'gold_bar',    name: 'Gold Bar',    level: 40, xp: 45,  inputs: [{ itemId: 'gold_ore', qty: 1 }] },
  { barId: 'adamant_bar', name: 'Adamant Bar', level: 70, xp: 70,  inputs: [{ itemId: 'adamant_ore', qty: 1 }, { itemId: 'coal', qty: 6 }] },
  { barId: 'rune_bar',    name: 'Rune Bar',    level: 85, xp: 90,  inputs: [{ itemId: 'rune_ore', qty: 1 }, { itemId: 'coal', qty: 8 }] },
  { barId: 'dragon_bar',  name: 'Dragon Bar',  level: 90, xp: 110, inputs: [{ itemId: 'dragon_ore', qty: 1 }, { itemId: 'coal', qty: 10 }] },
  { barId: 'barrows_bar', name: 'Barrows Bar', level: 92, xp: 125, inputs: [{ itemId: 'barrows_ore', qty: 1 }, { itemId: 'coal', qty: 12 }] },
  { barId: 'third_age_bar', name: 'Third Age Bar', level: 94, xp: 140, inputs: [{ itemId: 'third_age_ore', qty: 1 }, { itemId: 'coal', qty: 14 }] },
  { barId: 'primal_bar', name: 'Primal Bar', level: 96, xp: 160, inputs: [{ itemId: 'primal_ore', qty: 1 }, { itemId: 'coal', qty: 16 }] },
];

export async function smithCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const sub = (args[0] || '').toLowerCase();
  if (sub === 'smelt') {
    return handleSmelt(ctx, userId, args.slice(1));
  } else if (sub === 'make') {
    return handleMake(ctx, userId, args.slice(1));
  } else {
    return ctx.reply('Usage:\n- /smith smelt <bar_id> [quantity]\n- /smith make <item_id> [quantity]');
  }
}

async function handleSmelt(ctx: Context, userId: string, args: string[]) {
  const barArg = (args[0] || '').toLowerCase();
  const qtyReq = Math.max(1, Math.min(100, parseInt(args[1] || '1', 10) || 1));

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot smith while in combat.');
  if (player.isSkilling) {
    const rem = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${rem} seconds.`);
  }

  const def = SMELTS.find(s => s.barId === barArg || s.name.toLowerCase().includes(barArg));
  if (!def) return ctx.reply('Unknown bar. Try: bronze_bar, iron_bar, steel_bar, mithril_bar, gold_bar, adamant_bar, rune_bar, dragon_bar, barrows_bar, third_age_bar, primal_bar');

  const level = calculateLevelFromExperience(player.skills?.smithing?.experience || 0);
  if (level < def.level) return ctx.reply(`You need Smithing level ${def.level} to smelt ${def.name}.`);

  // Determine max craftable based on inventory
  function maxMakeFromInventory(): number {
    let max = Infinity;
    for (const inp of def.inputs) {
      const inv = player.inventory.find(i => i.itemId === inp.itemId);
      const have = inv?.quantity || 0;
      max = Math.min(max, Math.floor(have / inp.qty));
    }
    return isFinite(max) ? max : 0;
  }

  const canMake = maxMakeFromInventory();
  if (canMake <= 0) {
    const need = def.inputs.map(i => `${i.itemId} x${i.qty}`).join(', ');
    return ctx.reply(`Not enough resources. Required per bar: ${need}`);
  }
  const craftQty = Math.min(qtyReq, canMake);

  if (craftQty === 1) {
    // consume inputs
    for (const inp of def.inputs) {
      const inv = player.inventory.find(i => i.itemId === inp.itemId)!;
      inv.quantity -= inp.qty;
    }
    // cleanup zeroes
    player.inventory = player.inventory.filter(i => i.quantity > 0);
    // add bar
    const out = player.inventory.find(i => i.itemId === def.barId);
    if (out) out.quantity += 1; else player.inventory.push({ itemId: def.barId, quantity: 1 });
    const res = addExperience(player.skills?.smithing?.experience || 0, def.xp);
    if (player.skills?.smithing) player.skills.smithing.experience = res.newExp;
    await player.save();
    return ctx.reply(`Smelted 1x ${def.name}. +${def.xp} Smithing XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
  }

  // Batch smelting
  const perUnitMs = 600;
  const totalTime = perUnitMs * craftQty;
  player.isSkilling = true;
  player.currentSkill = 'smithing' as any;
  player.skillingEndTime = new Date(Date.now() + totalTime);
  await player.save();
  await ctx.reply(`Smelting ${craftQty}x ${def.name}... (~${Math.ceil(totalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      // recompute maximum in case inventory changed
      let max = Infinity;
      for (const inp of def.inputs) {
        const inv = p.inventory.find(i => i.itemId === inp.itemId);
        const have = inv?.quantity || 0;
        max = Math.min(max, Math.floor(have / inp.qty));
      }
      const make = Math.min(craftQty, isFinite(max) ? max : 0);
      if (make <= 0) {
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save();
        return await ctx.reply('Not enough resources to smelt.');
      }
      // consume
      for (const inp of def.inputs) {
        const inv = p.inventory.find(i => i.itemId === inp.itemId);
        if (inv) inv.quantity -= inp.qty * make;
      }
      p.inventory = p.inventory.filter(i => i.quantity > 0);
      // produce
      const out = p.inventory.find(i => i.itemId === def.barId);
      if (out) out.quantity += make; else p.inventory.push({ itemId: def.barId, quantity: make });
      const totalXp = def.xp * make;
      const res = addExperience(p.skills?.smithing?.experience || 0, totalXp);
      if (p.skills?.smithing) p.skills.smithing.experience = res.newExp;
      p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null;
      await p.save();
      await ctx.reply(`Smelting complete: ${make}x ${def.name}. +${totalXp} Smithing XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
    } catch (err) {
      console.error('Error completing smithing:', err);
      const p = await Player.findOne({ userId });
      if (p) { p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save(); }
      await ctx.reply('An error occurred while completing smithing.');
    }
  }, totalTime);
}

// Make items from bars
async function handleMake(ctx: Context, userId: string, args: string[]) {
  const itemId = (args[0] || '').toLowerCase();
  const qtyReq = Math.max(1, Math.min(50, parseInt(args[1] || '1', 10) || 1));

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot smith while in combat.');
  if (player.isSkilling) {
    const rem = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${rem} seconds.`);
  }

  // Determine bar type from item id prefix
  const prefix = (itemId.match(/^(bronze|iron|steel|mithril|adamant|rune|dragon|barrows|third_age|primal)/) || [])[0];
  if (!prefix) return ctx.reply('Unsupported item id for smithing. Use a metal item id like bronze_sword or iron_helmet.');
  const barId = `${prefix}_bar`;

  // Determine bar cost based on subType
  function barCostFor(subType: string): number {
    switch (subType) {
      case 'helmet': return 2;
      case 'chest': return 5;
      case 'legs': return 4;
      case 'boots': return 1;
      case 'gloves': return 1;
      case 'shield': return 3;
      case 'pickaxe': return 3;
      case 'axe': return 2;
      default: return 2; // weapons and others
    }
  }

  // Load the item to confirm type/level
  const { Item } = await import('../../models/Item');
  const item = await Item.findOne({ id: itemId });
  if (!item) return ctx.reply('Item not found.');

  const allowed = (item.type === 'weapon' && item.subType === 'melee')
    || (item.type === 'armor' && ['helmet','chest','legs','boots','gloves','shield'].includes(item.subType))
    || (item.type === 'tool' && ['pickaxe','axe'].includes(item.subType));
  if (!allowed) return ctx.reply('That item cannot be smithed.');

  const level = calculateLevelFromExperience(player.skills?.smithing?.experience || 0);
  const reqLevel = Math.max(1, item.levelRequired || 1);
  if (level < reqLevel) return ctx.reply(`You need Smithing level ${reqLevel} to make ${item.name}.`);

  const barsNeededEach = barCostFor(item.subType);
  const barsInv = player.inventory.find(i => i.itemId === barId);
  if (!barsInv || barsInv.quantity < barsNeededEach) return ctx.reply(`Not enough bars. Requires ${barId} x${barsNeededEach} per ${item.name}.`);

  const maxMake = Math.floor(barsInv.quantity / barsNeededEach);
  const crafts = Math.min(qtyReq, maxMake);
  if (crafts <= 0) return ctx.reply('Not enough bars.');

  // single craft immediate
  if (crafts === 1) {
    barsInv.quantity -= barsNeededEach;
    if (barsInv.quantity <= 0) player.inventory = player.inventory.filter(i => i.itemId !== barId);
    const out = player.inventory.find(i => i.itemId === itemId);
    if (out) out.quantity += 1; else player.inventory.push({ itemId: itemId, quantity: 1 });
    const xp = 25 * barsNeededEach;
    const res = addExperience(player.skills?.smithing?.experience || 0, xp);
    if (player.skills?.smithing) player.skills.smithing.experience = res.newExp;
    await player.save();
    return ctx.reply(`Forged 1x ${item.name}. +${xp} Smithing XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
  }

  // batch craft
  const perUnitMs = 800;
  const totalTime = perUnitMs * crafts;
  player.isSkilling = true;
  player.currentSkill = 'smithing' as any;
  player.skillingEndTime = new Date(Date.now() + totalTime);
  await player.save();
  await ctx.reply(`Forging ${crafts}x ${item.name}... (~${Math.ceil(totalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      const bars = p.inventory.find(i => i.itemId === barId);
      const canMake = Math.min(crafts, Math.floor((bars?.quantity || 0) / barsNeededEach));
      if (bars) {
        bars.quantity -= canMake * barsNeededEach;
        if (bars.quantity <= 0) p.inventory = p.inventory.filter(i => i.itemId !== barId);
      }
      if (canMake > 0) {
        const out = p.inventory.find(i => i.itemId === itemId);
        if (out) out.quantity += canMake; else p.inventory.push({ itemId: itemId, quantity: canMake });
        const xp = 25 * barsNeededEach * canMake;
        const res = addExperience(p.skills?.smithing?.experience || 0, xp);
        if (p.skills?.smithing) p.skills.smithing.experience = res.newExp;
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null;
        await p.save();
        await ctx.reply(`Forging complete: ${canMake}x ${item.name}. +${xp} Smithing XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
      } else {
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save();
        await ctx.reply('Not enough bars to complete forging.');
      }
    } catch (err) {
      console.error('Error completing smithing (make):', err);
      const p = await Player.findOne({ userId });
      if (p) { p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save(); }
      await ctx.reply('An error occurred while completing forging.');
    }
  }, totalTime);
}
