import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Area } from '../../models/Area';
import { getArgs } from '../utils/args';

export async function travelCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const args = getArgs(ctx);
  const destination = (args[0] || '').toLowerCase();
  if (!destination) {
    return ctx.reply('Usage: /travel <lumbridge|varrock|falador|catherby|ardougne|dragon_isle|barrows_crypts|primal_realm>');
  }

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You cannot travel while in combat.');

  if (player.isSkilling) {
    const remaining = player.skillingEndTime ? Math.max(0, Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000)) : 0;
    return ctx.reply(`You cannot travel while ${player.currentSkill}. Wait ${remaining} seconds.`);
  }

  const area = await Area.findOne({ id: destination });
  if (!area) return ctx.reply('Invalid destination.');
  if (player.currentArea === destination) return ctx.reply(`You are already in ${area.name}.`);

  player.currentArea = destination;
  await player.save();

  const monsters = area.monsters.map(m => `• ${m.name} (Lvl ${m.level})`).join('\n') || 'None';
  const resources = area.resources.map(r => `• ${r.name} (${r.skill} Lvl ${r.levelRequired})`).join('\n') || 'None';

  const lines = [
    `Welcome to ${area.name}!`,
    area.description,
    '',
    'Monsters:',
    monsters,
    '',
    'Resources:',
    resources,
    '',
    'Try: /fight, /mine, /fish, /area'
  ];
  return ctx.reply(lines.join('\n'));
}

