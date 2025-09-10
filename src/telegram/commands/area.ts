import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Area } from '../../models/Area';
import { getArgs } from '../utils/args';

export async function areaCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  const area = await Area.findOne({ id: player.currentArea });
  if (!area) return ctx.reply('Current area not found.');

  const args = getArgs(ctx);
  const section = (args[0] || '').toLowerCase();
  // filter mode: /area filter <term> [page]
  if (section === 'filter') {
    const term = (args[1] || '').toLowerCase();
    const page = Math.max(1, parseInt(args[2] || '1', 10) || 1);
    if (!term) return ctx.reply('Usage: /area filter <text> [page]');
    const pageSize = 10;
    const monsters = (area.monsters || []).filter(m => m.name.toLowerCase().includes(term));
    const resources = (area.resources || []).filter(r => r.name.toLowerCase().includes(term));
    const mon = paginate(monsters.map(m => `• ${m.name} (Lvl ${m.level}) HP:${m.hp} Atk:${m.attack} Def:${m.defense} XP:${m.experience}`), page, pageSize);
    const res = paginate(resources.map(r => `• ${r.name} (${capitalize(r.skill)}) Lvl:${r.levelRequired} XP:${r.experience} Tool:${r.toolRequired}`), page, pageSize);
    const lines = [
      `Area: ${area.name}`,
      area.description,
      '',
      `Monsters matching '${term}' (page ${mon.page}/${mon.total}):`,
      ...(mon.items.length ? mon.items : ['(none)']),
      '',
      `Resources matching '${term}' (page ${res.page}/${res.total}):`,
      ...(res.items.length ? res.items : ['(none)'])
    ];
    return ctx.reply(lines.join('\n'));
  }
  const page = Math.max(1, parseInt(args[1] || '1', 10) || 1);
  const pageSize = 10;

  const monsters = area.monsters || [];
  const resources = area.resources || [];

  const monstersText = paginate(monsters.map(m => `• ${m.name} (Lvl ${m.level}) HP:${m.hp} Atk:${m.attack} Def:${m.defense} XP:${m.experience}`), page, pageSize);
  const resourcesText = paginate(resources.map(r => `• ${r.name} (${capitalize(r.skill)}) Lvl:${r.levelRequired} XP:${r.experience} Tool:${r.toolRequired}`), page, pageSize);

  const showMonsters = section === '' || section.startsWith('mon');
  const showResources = section === '' || section.startsWith('res');

  const lines = [
    `Area: ${area.name}`,
    area.description,
  ];
  if (showMonsters) {
    lines.push('', `Monsters (page ${monstersText.page}/${monstersText.total}):`);
    lines.push(...monstersText.items);
  }
  if (showResources) {
    lines.push('', `Resources (page ${resourcesText.page}/${resourcesText.total}):`);
    lines.push(...resourcesText.items);
  }
  return ctx.reply(lines.join('\n'));
}

function capitalize(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function paginate(list: string[], page: number, pageSize: number): { items: string[]; page: number; total: number } {
  const total = Math.max(1, Math.ceil((list.length || 0) / pageSize));
  const p = Math.min(Math.max(1, page), total);
  const start = (p - 1) * pageSize;
  const end = Math.min(start + pageSize, list.length);
  return { items: list.slice(start, end), page: p, total };
}
