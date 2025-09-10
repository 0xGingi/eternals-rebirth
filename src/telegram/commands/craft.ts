import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Item } from '../../models/Item';
import { addExperience, calculateLevelFromExperience } from '../../utils/experienceUtils';
import { getArgs, getArgString } from '../utils/args';

type RobePiece = 'hat' | 'robe_top' | 'robe_bottom' | 'gloves' | 'boots';

type RobeTier = {
  prefix: string;
  level: number;
  clothId: string;
};

const ROBE_TIERS: RobeTier[] = [
  { prefix: 'wizard',      level: 1,  clothId: 'cloth' },
  { prefix: 'apprentice',  level: 10, clothId: 'soft_cloth' },
  { prefix: 'adept',       level: 20, clothId: 'fine_cloth' },
  { prefix: 'mystic',      level: 30, clothId: 'silk_cloth' },
  { prefix: 'enchanted',   level: 40, clothId: 'mystic_cloth' },
  { prefix: 'battlemage',  level: 50, clothId: 'enchanted_cloth' },
  { prefix: 'lunar',       level: 60, clothId: 'lunar_cloth' },
  { prefix: 'infinity',    level: 70, clothId: 'infinity_cloth' },
  { prefix: 'ancestral',   level: 80, clothId: 'ancestral_cloth' },
  { prefix: 'ethereal',    level: 90, clothId: 'ethereal_cloth' },
];

const ROBE_PIECES: { piece: RobePiece; suffix: string; cloth: number }[] = [
  { piece: 'hat',        suffix: 'hat',           cloth: 2 },
  { piece: 'robe_top',   suffix: 'robe_top',      cloth: 4 },
  { piece: 'robe_bottom',suffix: 'robe_bottom',   cloth: 3 },
  { piece: 'gloves',     suffix: 'gloves',        cloth: 1 },
  { piece: 'boots',      suffix: 'boots',         cloth: 1 },
];

type Recipe = {
  outId: string;
  outName: string;
  level: number;
  xp: number;
  inId: string;
  inQty: number;
};

const ROBE_RECIPES: Recipe[] = [];

function buildRecipesOnce() {
  if (ROBE_RECIPES.length) return;
  for (const tier of ROBE_TIERS) {
    for (const p of ROBE_PIECES) {
      const outId = `${tier.prefix}_${p.suffix}`;
      const inQty = p.cloth;
      const xp = inQty * 5; // simple XP model
      ROBE_RECIPES.push({ outId, outName: pretty(outId), level: tier.level, xp, inId: tier.clothId, inQty });
    }
  }
}

export function getRobeRecipes(): Recipe[] {
  buildRecipesOnce();
  return [...ROBE_RECIPES];
}

export async function craftCommand(ctx: Context) {
  buildRecipesOnce();
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const targetArg = (args[0] || '').toLowerCase();
  const qtyReq = Math.max(1, Math.min(100, parseInt(args[1] || '1', 10) || 1));

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot craft while in combat.');
  if (player.isSkilling) {
    const rem = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${rem} seconds.`);
  }

  if (!targetArg) {
    return ctx.reply('Usage: /craft <item_id> [quantity]\nExamples: /craft wizard_robe_top 2, /craft mystic_hat 1');
  }

  // Find by id or fuzzy name
  const recipe = ROBE_RECIPES.find(r => r.outId === targetArg || r.outName.toLowerCase().includes(targetArg));
  if (!recipe) return ctx.reply('Unknown craftable item. Try wizard/apprentice/adept/mystic/... and hat/robe_top/robe_bottom/gloves/boots');

  const craftLevel = calculateLevelFromExperience(player.skills?.crafting?.experience || 0);
  if (craftLevel < recipe.level) return ctx.reply(`You need Crafting level ${recipe.level} to craft ${recipe.outName}.`);

  const inputInv = player.inventory.find(i => i.itemId === recipe.inId);
  if (!inputInv || inputInv.quantity < recipe.inQty) {
    return ctx.reply(`Not enough materials. Requires ${recipe.inId} x${recipe.inQty} per ${recipe.outName}.`);
  }

  const maxCrafts = Math.floor(inputInv.quantity / recipe.inQty);
  const crafts = Math.min(qtyReq, maxCrafts);
  if (crafts <= 0) return ctx.reply('Not enough materials.');

  if (crafts === 1) {
    inputInv.quantity -= recipe.inQty;
    if (inputInv.quantity <= 0) player.inventory = player.inventory.filter(i => i.itemId !== recipe.inId);
    const out = player.inventory.find(i => i.itemId === recipe.outId);
    if (out) out.quantity += 1; else player.inventory.push({ itemId: recipe.outId, quantity: 1 });
    const res = addExperience(player.skills?.crafting?.experience || 0, recipe.xp);
    if (player.skills?.crafting) player.skills.crafting.experience = res.newExp;
    await player.save();
    return ctx.reply(`Crafted 1x ${recipe.outName}. +${recipe.xp} Crafting XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
  }

  // Batch
  const perUnitMs = 500;
  const totalTime = perUnitMs * crafts;
  player.isSkilling = true;
  player.currentSkill = 'crafting' as any;
  player.skillingEndTime = new Date(Date.now() + totalTime);
  await player.save();
  await ctx.reply(`Crafting ${crafts}x ${recipe.outName}... (~${Math.ceil(totalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      const invIn = p.inventory.find(i => i.itemId === recipe.inId);
      const canCraft = Math.min(crafts, Math.floor((invIn?.quantity || 0) / recipe.inQty));
      if (invIn) {
        invIn.quantity -= canCraft * recipe.inQty;
        if (invIn.quantity <= 0) p.inventory = p.inventory.filter(i => i.itemId !== recipe.inId);
      }
      if (canCraft > 0) {
        const out = p.inventory.find(i => i.itemId === recipe.outId);
        if (out) out.quantity += canCraft; else p.inventory.push({ itemId: recipe.outId, quantity: canCraft });
        const xp = recipe.xp * canCraft;
        const res = addExperience(p.skills?.crafting?.experience || 0, xp);
        if (p.skills?.crafting) p.skills.crafting.experience = res.newExp;
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null;
        await p.save();
        await ctx.reply(`Crafting complete: ${canCraft}x ${recipe.outName}. +${xp} Crafting XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
      } else {
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save();
        await ctx.reply('Not enough materials to complete crafting.');
      }
    } catch (err) {
      console.error('Error completing crafting:', err);
      const p = await Player.findOne({ userId });
      if (p) { p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save(); }
      await ctx.reply('An error occurred while completing crafting.');
    }
  }, totalTime);
}

function pretty(id: string): string {
  return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
