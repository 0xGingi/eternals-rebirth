import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Item } from '../../models/Item';
import { addExperience, calculateLevelFromExperience } from '../../utils/experienceUtils';
import { getArgs } from '../utils/args';

type Piece = 'coif' | 'body' | 'chaps' | 'vambraces' | 'boots';

const PIECE_COST: Record<Piece, number> = {
  coif: 1,
  body: 3,
  chaps: 2,
  vambraces: 1,
  boots: 1,
};

// Map crafted item id prefix to required material id
const MATERIAL_BY_PREFIX: Record<string, string> = {
  // basic leather tiers
  leather: 'leather',
  hard_leather: 'hard_leather',
  studded: 'studded_leather',
  // dragonhide tiers
  green_dhide: 'green_dhide',
  blue_dhide: 'blue_dhide',
  red_dhide: 'red_dhide',
  black_dhide: 'black_dhide',
  ancient_dhide: 'ancient_dhide',
  // higher tiers
  barrows_leather: 'barrows_leather',
  primal_leather: 'primal_leather',
};

function parseTarget(itemId: string): { prefix: string; piece: Piece } | null {
  for (const prefix of Object.keys(MATERIAL_BY_PREFIX)) {
    if (itemId.startsWith(prefix + '_')) {
      const rest = itemId.slice(prefix.length + 1);
      if (['coif','body','chaps','vambraces','boots'].includes(rest)) {
        return { prefix, piece: rest as Piece };
      }
    }
  }
  return null;
}

export async function leatherCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const targetId = (args[0] || '').toLowerCase();
  const qtyReq = Math.max(1, Math.min(100, parseInt(args[1] || '1', 10) || 1));

  if (!targetId) {
    return ctx.reply('Usage: /leather <item_id> [quantity]\nExamples: /leather leather_body 2, /leather green_dhide_vambraces 1');
  }

  const parsed = parseTarget(targetId);
  if (!parsed) return ctx.reply('Invalid item id. Use a leather/dhide item id like leather_coif, hard_leather_body, green_dhide_chaps, etc.');

  const item = await Item.findOne({ id: targetId });
  if (!item) return ctx.reply('Item not found.');

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot craft leather while in combat.');
  if (player.isSkilling) {
    const rem = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${rem} seconds.`);
  }

  // Level requirement comes from the item definition
  const level = calculateLevelFromExperience(player.skills?.crafting?.experience || 0);
  const reqLevel = Math.max(1, item.levelRequired || 1);
  if (level < reqLevel) return ctx.reply(`You need Crafting level ${reqLevel} to craft ${item.name}.`);

  // Materials
  const materialId = MATERIAL_BY_PREFIX[parsed.prefix];
  const perItem = PIECE_COST[parsed.piece];
  const matInv = player.inventory.find(i => i.itemId === materialId);
  if (!matInv || matInv.quantity < perItem) return ctx.reply(`Not enough materials. Requires ${materialId} x${perItem} per ${item.name}.`);

  const maxMake = Math.floor(matInv.quantity / perItem);
  const crafts = Math.min(qtyReq, maxMake);
  if (crafts <= 0) return ctx.reply('Not enough materials.');

  // Single craft immediate
  if (crafts === 1) {
    matInv.quantity -= perItem;
    if (matInv.quantity <= 0) player.inventory = player.inventory.filter(i => i.itemId !== materialId);
    const out = player.inventory.find(i => i.itemId === targetId);
    if (out) out.quantity += 1; else player.inventory.push({ itemId: targetId, quantity: 1 });
    const xp = perItem * 10; // simple XP model for leather
    const res = addExperience(player.skills?.crafting?.experience || 0, xp);
    if (player.skills?.crafting) player.skills.crafting.experience = res.newExp;
    await player.save();
    return ctx.reply(`Crafted 1x ${item.name}. +${xp} Crafting XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
  }

  // Batch crafting
  const perUnitMs = 450;
  const totalTime = perUnitMs * crafts;
  player.isSkilling = true;
  player.currentSkill = 'crafting' as any;
  player.skillingEndTime = new Date(Date.now() + totalTime);
  await player.save();
  await ctx.reply(`Crafting ${crafts}x ${item.name}... (~${Math.ceil(totalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      const mats = p.inventory.find(i => i.itemId === materialId);
      const canCraft = Math.min(crafts, Math.floor((mats?.quantity || 0) / perItem));
      if (mats) {
        mats.quantity -= canCraft * perItem;
        if (mats.quantity <= 0) p.inventory = p.inventory.filter(i => i.itemId !== materialId);
      }
      if (canCraft > 0) {
        const out = p.inventory.find(i => i.itemId === targetId);
        if (out) out.quantity += canCraft; else p.inventory.push({ itemId: targetId, quantity: canCraft });
        const xp = perItem * 10 * canCraft;
        const res = addExperience(p.skills?.crafting?.experience || 0, xp);
        if (p.skills?.crafting) p.skills.crafting.experience = res.newExp;
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null;
        await p.save();
        await ctx.reply(`Crafting complete: ${canCraft}x ${item.name}. +${xp} Crafting XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
      } else {
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save();
        await ctx.reply('Not enough materials to complete leather crafting.');
      }
    } catch (err) {
      console.error('Error completing leather crafting:', err);
      const p = await Player.findOne({ userId });
      if (p) { p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save(); }
      await ctx.reply('An error occurred while completing leather crafting.');
    }
  }, totalTime);
}

