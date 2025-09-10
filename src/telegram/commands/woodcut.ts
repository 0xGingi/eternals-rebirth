import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Area } from '../../models/Area';
import { calculateLevelFromExperience, addExperience } from '../../utils/experienceUtils';
import { canToolAccessResource } from '../../utils/toolUtils';
import { getArgs } from '../utils/args';

export async function woodcutCommand(ctx: Context) {
  await skillingCommand(ctx, 'woodcutting', 'axe');
}

async function skillingCommand(ctx: Context, skill: 'woodcutting', toolType: 'axe') {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const resourceArg = (args[0] || '').toLowerCase();
  const quantity = Math.max(1, Math.min(100, parseInt(args[1] || '1', 10) || 1));

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot woodcut while in combat.');
  if (player.isSkilling) {
    const remaining = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You are already ${player.currentSkill}. Wait ${remaining} seconds.`);
  }

  const area = await Area.findOne({ id: player.currentArea });
  if (!area) return ctx.reply('Your current area is invalid.');

  const resources = area.resources.filter(r => r.skill === skill);
  if (!resources.length) return ctx.reply('No trees to cut in this area.');

  const level = calculateLevelFromExperience(player.skills?.[skill]?.experience || 0);
  let resource = null as any;
  if (resourceArg) {
    resource = resources.find(r => r.id === resourceArg || r.name.toLowerCase().includes(resourceArg));
    if (!resource) return ctx.reply('That tree is not available here.');
  } else {
    const available = resources.filter(r => level >= r.levelRequired);
    resource = available[available.length - 1] || null;
    if (!resource) return ctx.reply('Your woodcutting level is too low for trees here.');
  }

  if (level < resource.levelRequired) return ctx.reply(`You need woodcutting level ${resource.levelRequired} to cut ${resource.name}.`);

  const equippedTool = player.equipment.weapon;
  if (!equippedTool || !canToolAccessResource(equippedTool, resource.toolRequired, toolType)) {
    return ctx.reply(`You need a proper ${toolType} equipped (e.g., ${resource.toolRequired} or better). Equip with /equip <tool>.`);
  }

  if (quantity === 1) {
    const totalExp = resource.experience;
    const expRes = addExperience(player.skills?.[skill]?.experience || 0, totalExp);
    if (player.skills?.[skill]) (player.skills as any)[skill].experience = expRes.newExp;
    const inv = player.inventory.find(i => i.itemId === resource.id);
    if (inv) inv.quantity += 1; else player.inventory.push({ itemId: resource.id, quantity: 1 });
    await player.save();
    const msg = expRes.leveledUp ? ` Level up! ${cap(skill)} is now ${expRes.newLevel}.` : '';
    return ctx.reply(`Cut 1x ${resource.name}. +${totalExp} ${cap(skill)} XP.${msg}`);
  }

  const minTime = quantity * 1000;
  const maxTime = quantity * 3000;
  const totalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  player.isSkilling = true;
  player.currentSkill = skill as any;
  player.skillingEndTime = new Date(Date.now() + totalTime);
  await player.save();
  await ctx.reply(`Cutting ${quantity}x ${resource.name}... (${Math.floor(totalTime/1000)}s)`);

  setTimeout(async () => {
    try {
      const p = await Player.findOne({ userId });
      if (!p) return;
      const totalExp = resource.experience * quantity;
      const expRes = addExperience(p.skills?.[skill]?.experience || 0, totalExp);
      if (p.skills?.[skill]) (p.skills as any)[skill].experience = expRes.newExp;
      const inv = p.inventory.find(i => i.itemId === resource.id);
      if (inv) inv.quantity += quantity; else p.inventory.push({ itemId: resource.id, quantity });
      p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null;
      await p.save();
      const msg = expRes.leveledUp ? ` Level up! ${cap(skill)} is now ${expRes.newLevel}.` : '';
      await ctx.reply(`Woodcutting complete: ${quantity}x ${resource.name}. +${totalExp} ${cap(skill)} XP.${msg}`);
    } catch (err) {
      console.error('Error completing woodcutting:', err);
      const p = await Player.findOne({ userId });
      if (p) { p.isSkilling = false; (p as any).currentSkill = null; (p as any).skillingEndTime = null; await p.save(); }
      await ctx.reply('An error occurred while completing woodcutting.');
    }
  }, totalTime);
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

