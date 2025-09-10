import { Context } from 'telegraf';
import { Player } from '../../models/Player';

const DAY_MS = 24 * 60 * 60 * 1000;

function ensureItem(player: any, itemId: string, qty: number = 1) {
  const inv = player.inventory.find((i: any) => i.itemId === itemId);
  if (inv) {
    inv.quantity += qty;
  } else {
    player.inventory.push({ itemId, quantity: qty });
  }
}

function hasTool(player: any, toolId: string): boolean {
  if (player.equipment?.weapon === toolId) return true;
  return !!player.inventory.find((i: any) => i.itemId === toolId && i.quantity > 0);
}

export async function dailyCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  const now = Date.now();
  const last = (player as any).dailyClaimAt as Date | null;
  if (last && (now - new Date(last).getTime()) < DAY_MS) {
    const remainingMs = DAY_MS - (now - new Date(last).getTime());
    const hours = Math.ceil(remainingMs / 3600000);
    return ctx.reply(`Daily already claimed. Try again in ~${hours}h.`);
  }

  const toEnsure = ['bronze_pickaxe', 'bronze_axe', 'fishing_rod'];
  const restored: string[] = [];
  for (const t of toEnsure) {
    if (!hasTool(player, t)) {
      ensureItem(player, t, 1);
      restored.push(t);
    }
  }

  ensureItem(player, 'coins', 100);
  ensureItem(player, 'bread', 5);

  (player as any).dailyClaimAt = new Date(now);
  await player.save();

  const lines = ['Daily reward claimed: +100 coins, +5 bread.'];
  if (restored.length) lines.push(`Restored tools: ${restored.join(', ')}`);
  return ctx.reply(lines.join('\n'));
}

