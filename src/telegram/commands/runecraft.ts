import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Area } from '../../models/Area';
import { addExperience, calculateLevelFromExperience } from '../../utils/experienceUtils';
import { getArgs } from '../utils/args';

type RuneDef = {
  id: string;
  name: string;
  talismanId: string;
  level: number;
  xp: number;
  essencePer: number;
  areas: string[]; // allowed area ids
};

export const RUNES: RuneDef[] = [
  { id: 'air_rune',    name: 'Air Rune',    talismanId: 'air_talisman',    level: 1,  xp: 5,  essencePer: 1, areas: ['lumbridge'] },
  { id: 'mind_rune',   name: 'Mind Rune',   talismanId: 'mind_talisman',   level: 1,  xp: 5,  essencePer: 1, areas: ['lumbridge'] },
  { id: 'water_rune',  name: 'Water Rune',  talismanId: 'water_talisman',  level: 5,  xp: 6,  essencePer: 1, areas: ['varrock'] },
  { id: 'earth_rune',  name: 'Earth Rune',  talismanId: 'earth_talisman',  level: 9,  xp: 7,  essencePer: 1, areas: ['lumbridge'] },
  { id: 'fire_rune',   name: 'Fire Rune',   talismanId: 'fire_talisman',   level: 14, xp: 8,  essencePer: 1, areas: ['varrock'] },
  { id: 'body_rune',   name: 'Body Rune',   talismanId: 'body_talisman',   level: 20, xp: 9,  essencePer: 1, areas: ['varrock'] },
  { id: 'cosmic_rune', name: 'Cosmic Rune', talismanId: 'cosmic_talisman', level: 27, xp: 10, essencePer: 1, areas: ['falador'] },
  { id: 'chaos_rune',  name: 'Chaos Rune',  talismanId: 'chaos_talisman',  level: 35, xp: 11, essencePer: 1, areas: ['falador'] },
  { id: 'nature_rune', name: 'Nature Rune', talismanId: 'nature_talisman', level: 44, xp: 12, essencePer: 1, areas: ['catherby'] },
  { id: 'law_rune',    name: 'Law Rune',    talismanId: 'law_talisman',    level: 54, xp: 13, essencePer: 1, areas: ['ardougne'] },
  { id: 'death_rune',  name: 'Death Rune',  talismanId: 'death_talisman',  level: 65, xp: 14, essencePer: 1, areas: ['dragon_isle'] },
  { id: 'blood_rune',  name: 'Blood Rune',  talismanId: 'blood_talisman',  level: 77, xp: 16, essencePer: 1, areas: ['barrows_crypts'] },
  { id: 'soul_rune',   name: 'Soul Rune',   talismanId: 'soul_talisman',   level: 90, xp: 18, essencePer: 1, areas: ['primal_realm'] },
];

export async function runecraftCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const runeArg = (args[0] || '').toLowerCase();
  const requestedQty = Math.max(1, Math.min(500, parseInt(args[1] || '1', 10) || 1));

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot runecraft while in combat.');
  if (player.isSkilling) {
    const rem = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${rem} seconds.`);
  }

  if (!runeArg) {
    return ctx.reply('Usage: /runecraft <air|mind|water|earth|fire|body|cosmic|chaos|nature|law|death|blood|soul> [quantity]');
  }

  const def = RUNES.find(r => r.id === runeArg || r.name.toLowerCase().startsWith(runeArg));
  if (!def) return ctx.reply('That rune cannot be crafted.');

  // Area check
  const area = await Area.findOne({ id: player.currentArea });
  if (!area || !def.areas.includes(area.id)) {
    return ctx.reply(`You cannot craft ${def.name} here. Try an appropriate area (e.g., ${def.areas.join(', ')}).`);
  }

  // Level check
  const level = calculateLevelFromExperience(player.skills?.runecrafting?.experience || 0);
  if (level < def.level) return ctx.reply(`You need Runecrafting level ${def.level} to craft ${def.name}.`);

  // Talisman check (not consumed)
  const hasTalisman = player.inventory.some(i => i.itemId === def.talismanId);
  if (!hasTalisman) return ctx.reply(`You need a ${def.talismanId.replace('_', ' ')} in your inventory to craft ${def.name}.`);

  // Essence check
  const essenceInv = player.inventory.find(i => i.itemId === 'rune_essence');
  if (!essenceInv || essenceInv.quantity <= 0) return ctx.reply('You have no rune essence. Mine some essence first.');

  const maxByEssence = Math.floor(essenceInv.quantity / def.essencePer);
  const craftQty = Math.max(0, Math.min(requestedQty, maxByEssence));
  if (craftQty <= 0) return ctx.reply('Not enough essence for that amount.');

  if (craftQty === 1) {
    // immediate craft
    essenceInv.quantity -= def.essencePer;
    if (essenceInv.quantity <= 0) player.inventory = player.inventory.filter(i => i.itemId !== 'rune_essence');
    const invRune = player.inventory.find(i => i.itemId === def.id);
    if (invRune) invRune.quantity += 1; else player.inventory.push({ itemId: def.id, quantity: 1 });
    const res = addExperience(player.skills?.runecrafting?.experience || 0, def.xp);
    if (player.skills?.runecrafting) player.skills.runecrafting.experience = res.newExp;
    await player.save();
    return ctx.reply(`Crafted 1x ${def.name}. +${def.xp} Runecrafting XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
  }

  // Timed batch (faster cadence than gathering)
  const perUnitMin = 200, perUnitMax = 500;
  const totalTime = Math.floor(Math.random() * (perUnitMax - perUnitMin + 1)) + perUnitMin;
  const finalTime = totalTime * craftQty;
  player.isSkilling = true;
  player.currentSkill = 'runecrafting' as any;
  player.skillingEndTime = new Date(Date.now() + finalTime);
  await player.save();
  await ctx.reply(`Crafting ${craftQty}x ${def.name}... (~${Math.ceil(finalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      const essence = p.inventory.find(i => i.itemId === 'rune_essence');
      const canMake = Math.min(craftQty, Math.floor((essence?.quantity || 0) / def.essencePer));
      if (essence) {
        essence.quantity -= canMake * def.essencePer;
        if (essence.quantity <= 0) p.inventory = p.inventory.filter(i => i.itemId !== 'rune_essence');
      }
      if (canMake > 0) {
        const invRune2 = p.inventory.find(i => i.itemId === def.id);
        if (invRune2) invRune2.quantity += canMake; else p.inventory.push({ itemId: def.id, quantity: canMake });
        const totalXp = def.xp * canMake;
        const res = addExperience(p.skills?.runecrafting?.experience || 0, totalXp);
        if (p.skills?.runecrafting) p.skills.runecrafting.experience = res.newExp;
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null;
        await p.save();
        await ctx.reply(`Runecrafting complete: ${canMake}x ${def.name}. +${totalXp} Runecrafting XP${res.leveledUp ? ` (Level ${res.newLevel})` : ''}.`);
      } else {
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null;
        await p.save();
        await ctx.reply('Not enough essence to complete runecrafting.');
      }
    } catch (err) {
      console.error('Error completing runecrafting:', err);
      const p = await Player.findOne({ userId });
      if (p) { p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save(); }
      await ctx.reply('An error occurred while completing runecrafting.');
    }
  }, finalTime);
}
