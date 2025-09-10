import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { getArgs } from '../utils/args';

const VALID = ['attack','strength','defense','range','magic'] as const;

export async function styleCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const [style] = getArgs(ctx);
  if (!style || !VALID.includes(style as any)) return ctx.reply('Usage: /style <attack|strength|defense|range|magic>');

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  if (['attack','strength','defense'].includes(style)) {
    if (['attack','strength','defense'].includes(player.combatStats.attackStyle)) {
      player.combatStats.lastMeleeStyle = style as any;
    }
    player.combatStats.attackStyle = style as any;
  } else if (style === 'range') {
    if (['attack','strength','defense'].includes(player.combatStats.attackStyle)) player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as any;
    player.combatStats.attackStyle = 'range';
  } else if (style === 'magic') {
    if (['attack','strength','defense'].includes(player.combatStats.attackStyle)) player.combatStats.lastMeleeStyle = player.combatStats.attackStyle as any;
    player.combatStats.attackStyle = 'magic';
  }

  await player.save();
  return ctx.reply(`Combat style set to ${style}.`);
}

