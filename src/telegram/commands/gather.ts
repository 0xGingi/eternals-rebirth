import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { calculateLevelFromExperience, addExperience } from '../../utils/experienceUtils';
import { getArgs } from '../utils/args';

const clothMaterials = [
  { id: 'cloth', name: 'Cloth', level: 1, experience: 1 },
  { id: 'soft_cloth', name: 'Soft Cloth', level: 10, experience: 1 },
  { id: 'fine_cloth', name: 'Fine Cloth', level: 20, experience: 1 },
  { id: 'silk_cloth', name: 'Silk Cloth', level: 30, experience: 2 },
  { id: 'mystic_cloth', name: 'Mystic Cloth', level: 40, experience: 2 },
  { id: 'enchanted_cloth', name: 'Enchanted Cloth', level: 50, experience: 2 },
  { id: 'lunar_cloth', name: 'Lunar Cloth', level: 60, experience: 2 },
  { id: 'infinity_cloth', name: 'Infinity Cloth', level: 70, experience: 2 },
  { id: 'ancestral_cloth', name: 'Ancestral Cloth', level: 80, experience: 2 },
  { id: 'ethereal_cloth', name: 'Ethereal Cloth', level: 90, experience: 2 }
];

export async function gatherCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const materialArg = (args[0] || '').toLowerCase();
  const quantity = Math.max(1, Math.min(100, parseInt(args[1] || '1', 10) || 1));

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot gather while in combat.');
  if (player.isSkilling) {
    const remaining = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${remaining} seconds.`);
  }

  const craftingLevel = calculateLevelFromExperience(player.skills?.crafting?.experience || 0);

  let material = null as null | typeof clothMaterials[number];
  if (materialArg) {
    material = clothMaterials.find(m => m.id === materialArg || m.name.toLowerCase().includes(materialArg));
    if (!material) return ctx.reply('That material cannot be gathered.');
    if (craftingLevel < material.level) return ctx.reply(`You need crafting level ${material.level} to gather ${material.name}.`);
  } else {
    const available = clothMaterials.filter(m => craftingLevel >= m.level);
    material = available[available.length - 1] || null;
    if (!material) return ctx.reply('You need at least crafting level 1 to gather cloth materials.');
  }

  if (quantity === 1) {
    const totalExp = material.experience;
    const expRes = addExperience(player.skills?.crafting?.experience || 0, totalExp);
    if (player.skills?.crafting) player.skills.crafting.experience = expRes.newExp;
    const inv = player.inventory.find(i => i.itemId === material.id);
    if (inv) inv.quantity += 1; else player.inventory.push({ itemId: material.id, quantity: 1 });
    await player.save();
    const msg = expRes.leveledUp ? ` Level up! Crafting is now ${expRes.newLevel}.` : '';
    return ctx.reply(`Gathered 1x ${material.name}. +${totalExp} Crafting XP.${msg}`);
  }

  const minTime = quantity * 1000;
  const maxTime = quantity * 3000;
  const totalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  player.isSkilling = true;
  player.currentSkill = 'gathering' as any;
  player.skillingEndTime = new Date(Date.now() + totalTime);
  await player.save();
  await ctx.reply(`Gathering ${quantity}x ${material.name}... (${Math.floor(totalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      const totalExp = material!.experience * quantity;
      const expRes = addExperience(p.skills?.crafting?.experience || 0, totalExp);
      if (p.skills?.crafting) p.skills.crafting.experience = expRes.newExp;
      const inv = p.inventory.find(i => i.itemId === material!.id);
      if (inv) inv.quantity += quantity; else p.inventory.push({ itemId: material!.id, quantity });
      p.isSkilling = false;
      (p as any).currentSkill = null;
      (p as any).skillingEndTime = null;
      await p.save();
      const msg = expRes.leveledUp ? ` Level up! Crafting is now ${expRes.newLevel}.` : '';
      await ctx.reply(`Gathering complete: ${quantity}x ${material!.name}. +${totalExp} Crafting XP.${msg}`);
    } catch (err) {
      console.error('Error completing gather:', err);
      const p = await Player.findOne({ userId });
      if (p) {
        p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save();
      }
      await ctx.reply('An error occurred while completing gathering.');
    }
  }, totalTime);
}

