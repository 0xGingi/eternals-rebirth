import dotenv from 'dotenv';
import { Telegraf, Context } from 'telegraf';
import { connectDatabase } from '../config/database';
import { initializeAreas } from '../data/areas';
import { initializeItems } from '../data/items';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience } from '../utils/experienceUtils';
import { getArgs } from './utils/args';
import { taskScheduler } from '../utils/scheduler';
import { areaCommand } from './commands/area';
import { travelCommand } from './commands/travel';
import { equipmentCommand } from './commands/equipment';
import { equipCommand } from './commands/equip';
import { unequipCommand } from './commands/unequip';
import { gatherCommand } from './commands/gather';
import { mineCommand } from './commands/mine';
import { fishCommand } from './commands/fish';
import { woodcutCommand } from './commands/woodcut';
import { styleCommand } from './commands/style';
import { fightCommand, attackCommand, defendCommand, runCommand, eatCommand } from './commands/fight';
import { cookCommand } from './commands/cook';
import { runecraftCommand } from './commands/runecraft';
import { smithCommand } from './commands/smith';
import { fletchCommand } from './commands/fletch';
import { craftCommand } from './commands/craft';
import { geCommand } from './commands/grandexchange';
import { spellsCommand, castCommand } from './commands/spell';
import { leatherCommand } from './commands/leather';
import { dailyCommand } from './commands/daily';
import { guideCommand } from './commands/guide';

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error('Missing TELEGRAM_TOKEN in environment');
  process.exit(1);
}

function userIdFromCtx(ctx: Context): string {
  const id = ctx.from?.id;
  return String(id ?? '');
}

async function ensureDbInitialized() {
  await connectDatabase();
  await initializeAreas();
  await initializeItems();
}

function usernameFromCtx(ctx: Context): string {
  const u = ctx.from;
  if (!u) return 'Unknown';
  return u.username || [u.first_name, u.last_name].filter(Boolean).join(' ').trim() || 'Unknown';
}

async function handleRegister(ctx: Context) {
  const userId = userIdFromCtx(ctx);
  if (!userId) return ctx.reply('Could not determine your user id.');

  const existing = await Player.findOne({ userId });
  if (existing) {
    return ctx.reply('You are already registered. Use /stats to view your character.');
  }

  const username = usernameFromCtx(ctx);
  const baseInventory = [
    { itemId: 'bronze_pickaxe', quantity: 1 },
    { itemId: 'bronze_axe', quantity: 1 },
    { itemId: 'fishing_rod', quantity: 1 },
    { itemId: 'bread', quantity: 5 },
    { itemId: 'coins', quantity: 100 }
  ];
  await Player.create({ userId, username, inventory: baseInventory });
  return ctx.reply(`Welcome, ${username}! You received starter tools: Pickaxe, Axe, Fishing Rod, plus 5x Bread and 100 coins.\nTip: Check /help for commands.`);
}

async function handleStats(ctx: Context) {
  const userId = userIdFromCtx(ctx);
  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  const s = player.skills;
  const lines = [
    `Area: ${player.currentArea}`,
    '',
    `Combat:`,
    `- Attack: ${calculateLevelFromExperience(s.attack.experience)}`,
    `- Strength: ${calculateLevelFromExperience(s.strength.experience)}`,
    `- Defense: ${calculateLevelFromExperience(s.defense.experience)}`,
    `- Magic: ${calculateLevelFromExperience(s.magic.experience)}`,
    `- Range: ${calculateLevelFromExperience(s.range.experience)}`,
    '',
    `Skills:`,
    `- Woodcutting: ${calculateLevelFromExperience(s.woodcutting.experience)}`,
    `- Mining: ${calculateLevelFromExperience(s.mining.experience)}`,
    `- Smithing: ${calculateLevelFromExperience(s.smithing.experience)}`,
    `- Fishing: ${calculateLevelFromExperience(s.fishing.experience)}`,
    `- Cooking: ${calculateLevelFromExperience(s.cooking.experience)}`,
    `- Fletching: ${calculateLevelFromExperience(s.fletching.experience)}`,
    `- Crafting: ${calculateLevelFromExperience(s.crafting.experience)}`,
    `- Runecrafting: ${calculateLevelFromExperience(s.runecrafting.experience)}`,
  ];
  return ctx.reply(lines.join('\n'));
}

async function handleInventory(ctx: Context) {
  const userId = userIdFromCtx(ctx);
  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  const args = getArgs(ctx);
  const sub = (args[0] || '').toLowerCase();
  if (sub === 'search') {
    const query = (args[1] || '').toLowerCase();
    const page = Math.max(1, parseInt(args[2] || '1', 10) || 1);
    if (!query) return ctx.reply('Usage: /inventory search <query> [page]');
    const ids = player.inventory.map(i => i.itemId);
    const items = await Item.find({ id: { $in: ids } });
    const filtered = player.inventory.filter(inv => {
      const it = items.find(d => d.id === inv.itemId);
      return inv.itemId.toLowerCase().includes(query) || (it?.name.toLowerCase().includes(query) || false);
    });
    if (!filtered.length) return ctx.reply('No matching items.');
    const pageSize = 20;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const p = Math.min(page, totalPages);
    const start = (p - 1) * pageSize;
    const end = Math.min(start + pageSize, filtered.length);
    const pageItems = filtered.slice(start, end);
    const names = new Map(items.map(i => [i.id, i.name] as const));
    const lines = [`Inventory search '${query}' (page ${p}/${totalPages}):`, ...pageItems.map(i => `- ${names.get(i.itemId) ?? i.itemId} x${i.quantity}`)];
    return ctx.reply(lines.join('\n'));
  } else if (sub === 'sort') {
    const key = (args[1] || 'name').toLowerCase();
    const dir = (args[2] || 'asc').toLowerCase();
    const page = Math.max(1, parseInt(args[3] || '1', 10) || 1);
    const pageSize = 20;
    if (!['name','qty','quantity'].includes(key)) {
      return ctx.reply('Usage: /inventory sort <name|qty> [asc|desc] [page]');
    }
    const ids = player.inventory.map(i => i.itemId);
    const items = await Item.find({ id: { $in: ids } });
    const nameById = new Map(items.map(i => [i.id, i.name.toLowerCase()] as const));
    const sorted = [...player.inventory].sort((a, b) => {
      let cmp = 0;
      if (key === 'name') {
        const an = nameById.get(a.itemId) ?? a.itemId;
        const bn = nameById.get(b.itemId) ?? b.itemId;
        cmp = an.localeCompare(bn);
      } else {
        cmp = (a.quantity || 0) - (b.quantity || 0);
      }
      return dir === 'desc' ? -cmp : cmp;
    });
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const p = Math.min(page, totalPages);
    const start = (p - 1) * pageSize;
    const end = Math.min(start + pageSize, sorted.length);
    const pageItems = sorted.slice(start, end);
    const nameDisplay = new Map(items.map(i => [i.id, i.name] as const));
    const lines = [`Inventory sort ${key}/${dir} (page ${p}/${totalPages}):`, ...pageItems.map(i => `- ${nameDisplay.get(i.itemId) ?? i.itemId} x${i.quantity}`)];
    return ctx.reply(lines.join('\n'));
  } else {
    const page = Math.max(1, parseInt(args[0] || '1', 10) || 1);
    const pageSize = 20;
    const total = player.inventory.length;
    if (!total) return ctx.reply('Your inventory is empty.');
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(page, totalPages);
    const start = (current - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    const slice = player.inventory.slice(start, end);
    const ids = slice.map(i => i.itemId);
    const items = await Item.find({ id: { $in: ids } });
    const nameById = new Map(items.map(i => [i.id, i.name] as const));
    const lines = [`Inventory (page ${current}/${totalPages}):`, ...slice.map(i => `- ${nameById.get(i.itemId) ?? i.itemId} x${i.quantity}`)];
    return ctx.reply(lines.join('\n'));
  }
}

async function main() {
  await ensureDbInitialized();
  taskScheduler.start();

  const bot = new Telegraf(token);

  bot.start(async (ctx) => {
    await ctx.reply('Eternals Rebirth (Telegram) — type /register to begin.');
  });

  bot.command('register', handleRegister);
  bot.command('stats', handleStats);
  bot.command('inventory', handleInventory);
  bot.command('area', areaCommand);
  bot.command('travel', travelCommand);
  bot.command('equipment', equipmentCommand);
  bot.command('equip', equipCommand);
  bot.command('unequip', unequipCommand);
  bot.command('gather', gatherCommand);
  bot.command('mine', mineCommand);
  bot.command('fish', fishCommand);
  bot.command('woodcut', woodcutCommand);
  bot.command('cook', cookCommand);
  bot.command('runecraft', runecraftCommand);
  bot.command('smith', smithCommand);
  bot.command('fletch', fletchCommand);
  bot.command('craft', craftCommand);
  bot.command('ge', geCommand);
  bot.command('guide', guideCommand);
  bot.command('style', styleCommand);
  bot.command('spells', spellsCommand);
  bot.command('cast', castCommand);
  bot.command('fight', fightCommand);
  bot.command('leather', leatherCommand);
  bot.command('daily', dailyCommand);
  bot.command('attack', attackCommand);
  bot.command('defend', defendCommand);
  bot.command('run', runCommand);
  bot.command('eat', eatCommand);

  bot.command('help', async (ctx) => {
    await ctx.reply([
      'Available commands:',
      '/register — Create your character',
      '/stats — View your skills',
      '/inventory — View your inventory',
      '/area — Info about current area',
      '/travel <area_id> — Travel to area',
      '/equipment — View equipped items',
      '/equip <item> — Equip an item',
      '/unequip <slot> — Unequip from slot',
      '/gather [material] [quantity] — Gather cloth',
      '/mine [ore] [qty] — Mine in area',
      '/fish [fish] [qty] — Fish in area',
      '/woodcut [tree] [qty] — Cut trees',
      '/cook <item> [qty] — Cook food',
      '/runecraft <rune> [qty] — Craft runes (area-gated)',
      '/smith smelt <bar> [qty] — Smelt bars',
      '/smith make <item> [qty] — Forge items',
      '/fletch <item> [qty] — Shafts & bows',
      '/craft <item> [qty] — Magic robes',
      '/leather <item> [qty] — Leather & d\'hide',
      '/ge <subcmd> — Economy (buy/sell/offers/cancel/price/search)',
      '/guide <topic> [page] — Skill guides (areas, mining, fishing, woodcutting, cooking, smith, fletch, crafting, runecraft)',
      '/style <style> — Set combat style',
      '/fight [monster] — Start combat',
      '/spells — List spells',
      '/cast <spell> — Cast spell',
      '/attack|/defend|/eat|/run — Combat actions',
    ].join('\n'));
  });

  await bot.launch();
  console.log('Telegram bot is up.');

  // Graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().catch((err) => {
  console.error('Failed to start Telegram bot:', err);
  process.exit(1);
});
