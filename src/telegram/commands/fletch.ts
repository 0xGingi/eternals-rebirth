import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { addExperience, calculateLevelFromExperience } from '../../utils/experienceUtils';
import { getArgs } from '../utils/args';

type FletchDef = {
  outId: string;
  name: string;
  level: number;
  xp: number;
  inId: string; // log or component id
  inQty: number; // per craft
  outQty: number; // per craft
};

export const FLETCHES: FletchDef[] = [
  // Shafts
  { outId: 'arrow_shaft', name: 'Arrow Shaft', level: 1, xp: 5, inId: 'normal_logs', inQty: 1, outQty: 15 },
  { outId: 'oak_arrow_shaft', name: 'Oak Arrow Shaft', level: 15, xp: 8, inId: 'oak_logs', inQty: 1, outQty: 20 },
  // Shortbows
  { outId: 'shortbow', name: 'Shortbow', level: 1, xp: 10, inId: 'normal_logs', inQty: 1, outQty: 1 },
  { outId: 'oak_shortbow', name: 'Oak Shortbow', level: 15, xp: 20, inId: 'oak_logs', inQty: 1, outQty: 1 },
  { outId: 'willow_shortbow', name: 'Willow Shortbow', level: 30, xp: 35, inId: 'willow_logs', inQty: 1, outQty: 1 },
  { outId: 'maple_shortbow', name: 'Maple Shortbow', level: 45, xp: 50, inId: 'maple_logs', inQty: 1, outQty: 1 },
  { outId: 'yew_shortbow', name: 'Yew Shortbow', level: 60, xp: 70, inId: 'yew_logs', inQty: 1, outQty: 1 },
  { outId: 'magic_shortbow', name: 'Magic Shortbow', level: 75, xp: 90, inId: 'magic_logs', inQty: 1, outQty: 1 },
  { outId: 'elder_shortbow', name: 'Elder Shortbow', level: 90, xp: 120, inId: 'elder_logs', inQty: 1, outQty: 1 },
  // Longbows
  { outId: 'longbow', name: 'Longbow', level: 5, xp: 12, inId: 'normal_logs', inQty: 1, outQty: 1 },
  { outId: 'oak_longbow', name: 'Oak Longbow', level: 20, xp: 24, inId: 'oak_logs', inQty: 1, outQty: 1 },
  { outId: 'willow_longbow', name: 'Willow Longbow', level: 35, xp: 40, inId: 'willow_logs', inQty: 1, outQty: 1 },
  { outId: 'maple_longbow', name: 'Maple Longbow', level: 50, xp: 60, inId: 'maple_logs', inQty: 1, outQty: 1 },
  { outId: 'yew_longbow', name: 'Yew Longbow', level: 65, xp: 80, inId: 'yew_logs', inQty: 1, outQty: 1 },
  { outId: 'magic_longbow', name: 'Magic Longbow', level: 80, xp: 100, inId: 'magic_logs', inQty: 1, outQty: 1 },
  { outId: 'elder_longbow', name: 'Elder Longbow', level: 95, xp: 140, inId: 'elder_logs', inQty: 1, outQty: 1 },
];

export async function fletchCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const targetArg = (args[0] || '').toLowerCase();
  const qtyReq = Math.max(1, Math.min(100, parseInt(args[1] || '1', 10) || 1));
  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot fletch while in combat.');
  if (player.isSkilling) {
    const rem = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${rem} seconds.`);
  }

  if (!targetArg) {
    return ctx.reply('Usage: /fletch <arrow_shaft|oak_arrow_shaft|shortbow|oak_shortbow|...|elder_longbow> [quantity]');
  }
  const def = FLETCHES.find(f => f.outId === targetArg || f.name.toLowerCase().includes(targetArg));
  if (!def) return ctx.reply('That item cannot be fletched.');

  const level = calculateLevelFromExperience(player.skills?.fletching?.experience || 0);
  if (level < def.level) return ctx.reply(`You need Fletching level ${def.level} to make ${def.name}.`);

  const inputInv = player.inventory.find(i => i.itemId === def.inId);
  if (!inputInv || inputInv.quantity < def.inQty) return ctx.reply(`Not enough materials. Requires ${def.inId} x${def.inQty} per craft.`);

  // Determine crafts possible
  const maxCrafts = Math.floor(inputInv.quantity / def.inQty);
  const crafts = Math.min(qtyReq, maxCrafts);
  if (crafts <= 0) return ctx.reply('Not enough materials.');

  if (crafts === 1) {
    inputInv.quantity -= def.inQty;
    if (inputInv.quantity <= 0) player.inventory = player.inventory.filter(i => i.itemId !== def.inId);
    const out = player.inventory.find(i => i.itemId === def.outId);
    const outQty = def.outQty;
    if (out) out.quantity += outQty; else player.inventory.push({ itemId: def.outId, quantity: outQty });
    const res = addExperience(player.skills?.fletching?.experience || 0, def.xp);
    if (player.skills?.fletching) player.skills.fletching.experience = res.newExp;
    await player.save();
    return ctx.reply(`Fletched ${outQty}x ${def.name}. +${def.xp} Fletching XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
  }

  // Batch
  const perUnitMs = 500;
  const totalTime = perUnitMs * crafts;
  player.isSkilling = true;
  player.currentSkill = 'fletching' as any;
  player.skillingEndTime = new Date(Date.now() + totalTime);
  await player.save();
  await ctx.reply(`Fletching ${crafts}x ${def.name}... (~${Math.ceil(totalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      const invIn = p.inventory.find(i => i.itemId === def.inId);
      const canCraft = Math.min(crafts, Math.floor((invIn?.quantity || 0) / def.inQty));
      if (invIn) {
        invIn.quantity -= canCraft * def.inQty;
        if (invIn.quantity <= 0) p.inventory = p.inventory.filter(i => i.itemId !== def.inId);
      }
      if (canCraft > 0) {
        const out = p.inventory.find(i => i.itemId === def.outId);
        const totalOut = canCraft * def.outQty;
        if (out) out.quantity += totalOut; else p.inventory.push({ itemId: def.outId, quantity: totalOut });
        const xp = def.xp * canCraft;
        const res = addExperience(p.skills?.fletching?.experience || 0, xp);
        if (p.skills?.fletching) p.skills.fletching.experience = res.newExp;
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null;
        await p.save();
        await ctx.reply(`Fletching complete: ${totalOut}x ${def.name}. +${xp} Fletching XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
      } else {
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save();
        await ctx.reply('Not enough materials to complete fletching.');
      }
    } catch (err) {
      console.error('Error completing fletching:', err);
      const p = await Player.findOne({ userId });
      if (p) { p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save(); }
      await ctx.reply('An error occurred while completing fletching.');
    }
  }, totalTime);
}
