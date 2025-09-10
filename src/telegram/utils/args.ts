import type { Context } from 'telegraf';

export function getArgs(ctx: Context): string[] {
  const text = (ctx.message as any)?.text || (ctx.update as any)?.message?.text || '';
  // /command arg1 arg2 ...
  const parts = text.trim().split(/\s+/);
  return parts.slice(1);
}

export function getArgString(ctx: Context): string {
  return getArgs(ctx).join(' ');
}

