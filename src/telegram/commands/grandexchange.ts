import { Context } from 'telegraf';
import { Item } from '../../models/Item';
import { getArgs } from '../utils/args';
import { createBuyOffer, createSellOffer, cancelOffer, getPlayerOffers, getItemPriceData } from '../../utils/grandExchangeUtils';

export async function geCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const args = getArgs(ctx);
  const sub = (args[0] || '').toLowerCase();

  switch (sub) {
    case 'buy':
      return handleBuy(ctx, userId, args.slice(1));
    case 'sell':
      return handleSell(ctx, userId, args.slice(1));
    case 'offers':
      return handleOffers(ctx, userId, args.slice(1));
    case 'my':
      return handleMyItem(ctx, userId, args.slice(1));
    case 'cancel':
      return handleCancel(ctx, userId, args.slice(1));
    case 'price':
      return handlePrice(ctx, args.slice(1));
    case 'search':
      return handleSearch(ctx, args.slice(1));
    case 'help':
      return handleHelp(ctx);
    default:
      return ctx.reply([
        'Usage:',
        '/ge buy <item_id|name> <qty> <price_each>',
        '/ge sell <item_id|name> <qty> <price_each>',
        '/ge offers',
        '/ge cancel <offer_id>',
        '/ge price <item_id|name>',
        '/ge search <query>',
        '/ge help'
      ].join('\n'));
  }
}

async function resolveItemId(input: string): Promise<string | null> {
  if (!input) return null;
  const exact = await Item.findOne({ id: input });
  if (exact) return exact.id;
  const fuzzy = await Item.findOne({ name: { $regex: new RegExp(input, 'i') } });
  return fuzzy ? fuzzy.id : null;
}

async function handleBuy(ctx: Context, userId: string, args: string[]) {
  const [rawItem, rawQty, rawPrice] = args;
  if (!rawItem || !rawQty || !rawPrice) return ctx.reply('Usage: /ge buy <item> <qty> <price_each>');
  const itemId = await resolveItemId(rawItem);
  if (!itemId) return ctx.reply('Item not found.');
  const quantity = Math.max(1, parseInt(rawQty, 10) || 0);
  const priceEach = Math.max(1, parseInt(rawPrice, 10) || 0);
  const res = await createBuyOffer(userId, itemId, quantity, priceEach);
  return ctx.reply(res.message);
}

async function handleSell(ctx: Context, userId: string, args: string[]) {
  const [rawItem, rawQty, rawPrice] = args;
  if (!rawItem || !rawQty || !rawPrice) return ctx.reply('Usage: /ge sell <item> <qty> <price_each>');
  const itemId = await resolveItemId(rawItem);
  if (!itemId) return ctx.reply('Item not found.');
  const quantity = Math.max(1, parseInt(rawQty, 10) || 0);
  const priceEach = Math.max(1, parseInt(rawPrice, 10) || 0);
  const res = await createSellOffer(userId, itemId, quantity, priceEach);
  return ctx.reply(res.message);
}

async function handleOffers(ctx: Context, userId: string, args: string[]) {
  const maybeStatus = (args[0] || '').toLowerCase();
  const statusFilter = ['active','completed','cancelled'].includes(maybeStatus) ? maybeStatus : '';
  const page = Math.max(1, parseInt(args[statusFilter ? 1 : 0] || '1', 10) || 1);
  const pageSize = 10;
  let offers = await getPlayerOffers(userId);
  if (statusFilter) offers = offers.filter((o: any) => o.status === statusFilter);
  if (!offers.length) return ctx.reply('You have no GE offers.');
  const totalPages = Math.max(1, Math.ceil(offers.length / pageSize));
  const p = Math.min(page, totalPages);
  const start = (p - 1) * pageSize;
  const end = Math.min(start + pageSize, offers.length);
  const pageOffers = offers.slice(start, end);
  const itemIds = Array.from(new Set(pageOffers.map((o: any) => o.itemId)));
  const items = await Item.find({ id: { $in: itemIds } });
  const nameById = new Map(items.map(i => [i.id, i.name] as const));
  const lines = pageOffers.map((o: any) => {
    const statusEmoji = o.status === 'active' ? '🟢' : o.status === 'completed' ? '✅' : '⛔';
    const created = (o as any).createdAt ? new Date((o as any).createdAt).toISOString() : '';
    const name = nameById.get(o.itemId) ?? o.itemId;
    return `• ${o._id} ${statusEmoji}\n  ${o.type.toUpperCase()} ${o.quantity}x ${name} @ ${o.pricePerItem} each\n  Remaining: ${o.quantityRemaining} • Status: ${o.status}${created ? ` • Created: ${created}` : ''}`;
  });
  return ctx.reply([`Your offers (page ${p}/${totalPages}):`, ...lines].join('\n'));
}

async function handleMyItem(ctx: Context, userId: string, args: string[]) {
  const [rawItem, statusArg, pageArg] = args;
  if (!rawItem) return ctx.reply('Usage: /ge my <item_id|name> [active|completed|cancelled] [page]');
  const itemId = await resolveItemId(rawItem);
  if (!itemId) return ctx.reply('Item not found.');
  const statusFilter = ['active','completed','cancelled'].includes((statusArg || '').toLowerCase()) ? (statusArg || '').toLowerCase() : '';
  const page = Math.max(1, parseInt(statusFilter ? (pageArg || '1') : (statusArg || '1'), 10) || 1);

  let offers = await getPlayerOffers(userId);
  offers = offers.filter((o: any) => o.itemId === itemId);
  if (statusFilter) offers = offers.filter((o: any) => o.status === statusFilter);
  if (!offers.length) return ctx.reply('You have no offers for that item.');

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(offers.length / pageSize));
  const p = Math.min(page, totalPages);
  const start = (p - 1) * pageSize;
  const end = Math.min(start + pageSize, offers.length);
  const pageOffers = offers.slice(start, end);
  const item = await Item.findOne({ id: itemId });
  const lines = pageOffers.map((o: any) => {
    const statusEmoji = o.status === 'active' ? '🟢' : o.status === 'completed' ? '✅' : '⛔';
    const created = (o as any).createdAt ? new Date((o as any).createdAt).toISOString() : '';
    return `• ${o._id} ${statusEmoji}\n  ${o.type.toUpperCase()} ${o.quantity}x ${item?.name ?? itemId} @ ${o.pricePerItem} each\n  Remaining: ${o.quantityRemaining} • Status: ${o.status}${created ? ` • Created: ${created}` : ''}`;
  });
  return ctx.reply([`Your offers for ${item?.name ?? itemId} (page ${p}/${totalPages}):`, ...lines].join('\n'));
}

async function handleCancel(ctx: Context, userId: string, args: string[]) {
  const [offerId] = args;
  if (!offerId) return ctx.reply('Usage: /ge cancel <offer_id>');
  const res = await cancelOffer(userId, offerId);
  return ctx.reply(res.message);
}

async function handlePrice(ctx: Context, args: string[]) {
  const [rawItem] = args;
  if (!rawItem) return ctx.reply('Usage: /ge price <item_id|name>');
  const itemId = await resolveItemId(rawItem);
  if (!itemId) return ctx.reply('Item not found.');
  const [itemDoc, data] = await Promise.all([
    Item.findOne({ id: itemId }),
    getItemPriceData(itemId)
  ]);
  if (!data) return ctx.reply('No price data available.');
  const lines = [
    `Item: ${itemDoc?.name ?? itemId} (${itemId})`,
    `Avg Price: ${data.averagePrice}`,
    `Highest Buy: ${data.highestBuyOffer}`,
    `Lowest Sell: ${data.lowestSellOffer}`,
  ];
  return ctx.reply(lines.join('\n'));
}

async function handleSearch(ctx: Context, args: string[]) {
  const q = (args[0] || '').trim();
  if (!q) return ctx.reply('Usage: /ge search <query> [page]');
  const page = Math.max(1, parseInt(args[1] || '1', 10) || 1);
  const pageSize = 20;
  const all = await Item.find({ name: { $regex: new RegExp(q, 'i') } }).sort({ name: 1 });
  if (!all.length) return ctx.reply('No items found.');
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  const p = Math.min(page, totalPages);
  const start = (p - 1) * pageSize;
  const end = Math.min(start + pageSize, all.length);
  const items = all.slice(start, end);
  const lines = items.map(i => `- ${i.name} (${i.id})`);
  return ctx.reply([`Results (page ${p}/${totalPages}):`, ...lines].join('\n'));
}

function handleHelp(ctx: Context) {
  return ctx.reply([
    'Grand Exchange Commands:',
    '/ge buy <item> <qty> <price_each> — Create buy offer',
    '/ge sell <item> <qty> <price_each> — Create sell offer',
    '/ge offers — View your offers',
    '/ge cancel <offer_id> — Cancel an active offer',
    '/ge price <item> — View average/high/low prices',
    '/ge search <query> — Find item IDs by name'
  ].join('\n'));
}
