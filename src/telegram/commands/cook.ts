import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Item } from '../../models/Item';
import { calculateLevelFromExperience, addExperience } from '../../utils/experienceUtils';
import { getArgs, getArgString } from '../utils/args';

type CookDef = {
  rawId: string;
  cookedId: string;
  name: string;
  level: number;
  xp: number;
};

export const COOKS: CookDef[] = [
  { rawId: 'shrimp',       cookedId: 'cooked_shrimp',       name: 'Shrimp',       level: 1,  xp: 10 },
  { rawId: 'trout',        cookedId: 'cooked_trout',        name: 'Trout',        level: 15, xp: 25 },
  { rawId: 'salmon',       cookedId: 'cooked_salmon',       name: 'Salmon',       level: 25, xp: 35 },
  { rawId: 'tuna',         cookedId: 'cooked_tuna',         name: 'Tuna',         level: 35, xp: 45 },
  { rawId: 'lobster',      cookedId: 'cooked_lobster',      name: 'Lobster',      level: 40, xp: 55 },
  { rawId: 'shark',        cookedId: 'cooked_shark',        name: 'Shark',        level: 50, xp: 75 },
  { rawId: 'manta_ray',    cookedId: 'cooked_manta_ray',    name: 'Manta Ray',    level: 60, xp: 90 },
  { rawId: 'dark_crab',    cookedId: 'cooked_dark_crab',    name: 'Dark Crab',    level: 70, xp: 110 },
  { rawId: 'anglerfish',   cookedId: 'cooked_anglerfish',   name: 'Anglerfish',   level: 80, xp: 130 },
];

export async function cookCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const query = (args[0] || '').toLowerCase();
  const quantityReq = Math.max(1, Math.min(100, parseInt(args[1] || '1', 10) || 1));

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot cook while in combat.');
  if (player.isSkilling) {
    const remaining = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${remaining} seconds.`);
  }

  // Determine target cook
  let def: CookDef | undefined;
  if (query) {
    def = COOKS.find(c => c.rawId === query || c.name.toLowerCase().includes(query));
    if (!def) return ctx.reply('That item cannot be cooked.');
  } else {
    // pick best the player can cook and has in inventory
    const cookingLevel = calculateLevelFromExperience(player.skills?.cooking?.experience || 0);
    const invIds = new Set(player.inventory.map(i => i.itemId));
    const candidates = COOKS.filter(c => invIds.has(c.rawId) && cookingLevel >= c.level);
    def = candidates[candidates.length - 1];
    if (!def) return ctx.reply('You have nothing you can cook. Use /fish first or specify an item: /cook shrimp 10');
  }

  const cookingLevel = calculateLevelFromExperience(player.skills?.cooking?.experience || 0);
  if (cookingLevel < def.level) return ctx.reply(`You need Cooking level ${def.level} to cook ${def.name}.`);

  const invRaw = player.inventory.find(i => i.itemId === def!.rawId);
  if (!invRaw || invRaw.quantity <= 0) return ctx.reply(`You don't have any ${def.name} to cook.`);

  const toCook = Math.min(invRaw.quantity, quantityReq);

  // If just one, resolve immediately
  if (toCook === 1) {
    const cooked = performCookRoll(cookingLevel, def.level) ? 1 : 0;
    invRaw.quantity -= 1;
    if (invRaw.quantity <= 0) player.inventory = player.inventory.filter(i => i.itemId !== def!.rawId);
    if (cooked) {
      const invCooked = player.inventory.find(i => i.itemId === def!.cookedId);
      if (invCooked) invCooked.quantity += 1; else player.inventory.push({ itemId: def!.cookedId, quantity: 1 });
      const res = addExperience(player.skills?.cooking?.experience || 0, def!.xp);
      if (player.skills?.cooking) player.skills.cooking.experience = res.newExp;
      await player.save();
      return ctx.reply(`Cooked 1x ${def!.name}. +${def!.xp} Cooking XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
    } else {
      await player.save();
      return ctx.reply(`You accidentally burnt the ${def!.name}.`);
    }
  }

  // Timed batch for >1
  const perUnitMs = 700; // quick cadence
  const totalTime = perUnitMs * toCook;
  player.isSkilling = true;
  player.currentSkill = 'cooking' as any;
  player.skillingEndTime = new Date(Date.now() + totalTime);
  await player.save();
  await ctx.reply(`Cooking ${toCook}x ${def.name}... (~${Math.ceil(totalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      const level = calculateLevelFromExperience(p.skills?.cooking?.experience || 0);
      const invRaw2 = p.inventory.find(i => i.itemId === def!.rawId);
      const maxCook = Math.min(invRaw2?.quantity || 0, toCook);
      let cookedCount = 0;
      let xpTotal = 0;
      for (let i = 0; i < maxCook; i++) {
        if (performCookRoll(level, def!.level)) {
          cookedCount++;
          xpTotal += def!.xp;
        }
      }
      if (invRaw2) {
        invRaw2.quantity -= maxCook;
        if (invRaw2.quantity <= 0) p.inventory = p.inventory.filter(i => i.itemId !== def!.rawId);
      }
      if (cookedCount > 0) {
        const invCooked2 = p.inventory.find(i => i.itemId === def!.cookedId);
        if (invCooked2) invCooked2.quantity += cookedCount; else p.inventory.push({ itemId: def!.cookedId, quantity: cookedCount });
        const res = addExperience(p.skills?.cooking?.experience || 0, xpTotal);
        if (p.skills?.cooking) p.skills.cooking.experience = res.newExp;
        await p.save();
        const burnt = maxCook - cookedCount;
        await ctx.reply(`Cooking complete: ${cookedCount}/${maxCook} ${def!.name} cooked. Burnt: ${burnt}. +${xpTotal} Cooking XP`);
      } else {
        await p.save();
        await ctx.reply(`All ${maxCook} ${def!.name} were burnt.`);
      }
    } catch (err) {
      console.error('Error completing cooking:', err);
      const p = await Player.findOne({ userId });
      if (p) { p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save(); }
      await ctx.reply('An error occurred while completing cooking.');
    }
  }, totalTime);
}

// Simple burn model: the further above level, lower burn chance
function performCookRoll(playerLevel: number, required: number): boolean {
  const over = Math.max(0, playerLevel - required);
  const successBase = 0.4 + Math.min(0.5, over * 0.02); // 40% base, +2% per level over, capped +50%
  const success = Math.min(0.95, successBase);
  return Math.random() < success;
}
