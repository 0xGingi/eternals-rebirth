import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Item } from '../../models/Item';

export async function equipmentCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  const slots = ['helmet','chest','legs','boots','gloves','weapon','shield','ammunition','ring','necklace'] as const;
  const lines: string[] = [];
  for (const slot of slots) {
    if (slot === 'ammunition') {
      const { itemId, quantity } = player.equipment.ammunition || { itemId: null, quantity: 0 } as any;
      if (itemId && quantity > 0) {
        const i = await Item.findOne({ id: itemId });
        lines.push(`${cap(slot)}: ${i ? i.name : itemId} (${quantity})`);
      } else {
        lines.push(`${cap(slot)}: Empty`);
      }
    } else {
      const itemId = (player.equipment as any)[slot];
      if (itemId) {
        const i = await Item.findOne({ id: itemId });
        lines.push(`${cap(slot)}: ${i ? i.name : itemId}`);
      } else {
        lines.push(`${cap(slot)}: Empty`);
      }
    }
  }
  return ctx.reply([`Equipment for ${player.username}:`, ...lines].join('\n'));
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

