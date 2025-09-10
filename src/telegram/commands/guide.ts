import { Context } from 'telegraf';
import { Area } from '../../models/Area';
import { COOKS } from './cook';
import { SMELTS } from './smith';
import { FLETCHES } from './fletch';
import { RUNES } from './runecraft';
import { getRobeRecipes } from './craft';

type Topic = 'areas' | 'mining' | 'fishing' | 'woodcutting' | 'cooking' | 'smith' | 'fletch' | 'crafting' | 'runecraft';

function paginate<T>(arr: T[], page: number, size: number) {
  const total = Math.max(1, Math.ceil((arr.length || 0) / size));
  const p = Math.min(Math.max(1, page), total);
  const start = (p - 1) * size;
  const end = Math.min(start + size, arr.length);
  return { items: arr.slice(start, end), page: p, total };
}

export async function guideCommand(ctx: Context) {
  const text = ((ctx.message as any)?.text || '').trim();
  const parts = text.split(/\s+/);
  const topic = (parts[1] || '').toLowerCase() as Topic;
  const page = Math.max(1, parseInt(parts[2] || '1', 10) || 1);

  if (!topic || !['areas','mining','fishing','woodcutting','cooking','smith','fletch','crafting','runecraft'].includes(topic)) {
    return ctx.reply([
      'Usage: /guide <topic> [page]',
      'Topics:',
      '- areas: All areas overview',
      '- mining|fishing|woodcutting: Resource nodes + areas',
      '- cooking: Cookable foods',
      '- smith: Smeltable bars',
      '- fletch: Arrow shafts & bows',
      '- crafting: Magic robes from cloth',
      '- runecraft: Runes & altar areas'
    ].join('\n'));
  }

  if (topic === 'areas') {
    const areas = await Area.find({}).sort({ requiredLevel: 1, name: 1 });
    const list = areas.map(a => `• ${a.name} (id: ${a.id}) — Req Lvl: ${a.requiredLevel} — Monsters: ${a.monsters.length} — Resources: ${a.resources.length}`);
    const pg = paginate(list, page, 10);
    return ctx.reply([`Areas (page ${pg.page}/${pg.total}):`, ...pg.items].join('\n'));
  }

  if (['mining','fishing','woodcutting'].includes(topic)) {
    const areas = await Area.find({});
    const map = new Map<string, { name: string; level: number; exp: number; tool: string; areas: string[] }>();
    for (const a of areas) {
      for (const r of a.resources) {
        if (r.skill !== topic) continue;
        if (!map.has(r.id)) {
          map.set(r.id, { name: r.name, level: r.levelRequired, exp: r.experience, tool: r.toolRequired, areas: [a.name] });
        } else {
          map.get(r.id)!.areas.push(a.name);
        }
      }
    }
    const entries = Array.from(map.values()).sort((a,b) => a.level - b.level || a.name.localeCompare(b.name));
    const list = entries.map(e => `• ${e.name} — Lvl ${e.level}, XP ${e.exp}, Tool: ${e.tool} — Areas: ${e.areas.join(', ')}`);
    const pg = paginate(list, page, 12);
    return ctx.reply([`${capitalize(topic)} resources (page ${pg.page}/${pg.total}):`, ...pg.items].join('\n'));
  }

  if (topic === 'cooking') {
    const list = COOKS.map(c => `• ${c.name} — Lvl ${c.level}, XP ${c.xp}`);
    const pg = paginate(list, page, 14);
    return ctx.reply([`Cooking guide (page ${pg.page}/${pg.total}):`, ...pg.items].join('\n'));
  }

  if (topic === 'smith') {
    const list = SMELTS.map(s => `• ${s.name} — Lvl ${s.level}, XP ${s.xp} — Inputs: ${s.inputs.map(i => `${i.itemId} x${i.qty}`).join(', ')}`);
    const pg = paginate(list, page, 12);
    return ctx.reply([`Smithing (smelt) guide (page ${pg.page}/${pg.total}):`, ...pg.items].join('\n'));
  }

  if (topic === 'fletch') {
    const list = FLETCHES.map(f => `• ${f.name} — Lvl ${f.level}, XP ${f.xp} — Input: ${f.inId} x${f.inQty} → ${f.outQty}x`);
    const pg = paginate(list, page, 12);
    return ctx.reply([`Fletching guide (page ${pg.page}/${pg.total}):`, ...pg.items].join('\n'));
  }

  if (topic === 'crafting') {
    const recipes = getRobeRecipes();
    const list = recipes.map(r => `• ${r.outName} — Lvl ${r.level}, XP ${r.xp} — Input: ${r.inId} x${r.inQty}`);
    const pg = paginate(list, page, 12);
    return ctx.reply([`Crafting (robes) guide (page ${pg.page}/${pg.total}):`, ...pg.items].join('\n'));
  }

  if (topic === 'runecraft') {
    const list = RUNES.map(r => `• ${r.name} — Lvl ${r.level}, XP ${r.xp}, Essence: ${r.essencePer} — Areas: ${r.areas.join(', ')}`);
    const pg = paginate(list, page, 12);
    return ctx.reply([`Runecrafting guide (page ${pg.page}/${pg.total}):`, ...pg.items].join('\n'));
  }
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

