import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Area } from '../../models/Area';
import { Item } from '../../models/Item';
import { getArgs, getArgString } from '../utils/args';
import { getAvailableSpells, canCastSpell, consumeRunes, calculateSpellDamage, getSpellExperience, calculateSpellAccuracy } from '../../utils/spellUtils';
import { calculateCombatStats } from '../../utils/combatUtils';
import { addExperience, calculateLevelFromExperience } from '../../utils/experienceUtils';
import { calculateExperienceGained } from '../../utils/combatUtils';

export async function spellsCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  // paging
  const text = (ctx.message as any)?.text || '';
  const parts = text.trim().split(/\s+/);
  const page = Math.max(1, parseInt(parts[1] || '1', 10) || 1);
  const spells = getAvailableSpells(player);
  if (!spells.length) return ctx.reply('You do not have any spells available.');
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(spells.length / pageSize));
  const p = Math.min(page, totalPages);
  const start = (p - 1) * pageSize;
  const end = Math.min(start + pageSize, spells.length);

  const lines = spells.slice(start, end).map(s => {
    const runesList = Object.entries(s.runes).map(([r, a]) => `${a}x ${r.replace('_',' ')}`).join(', ');
    return `- ${s.name} (${s.id}) • Lvl ${s.levelRequired} • Dmg ${s.maxDamage} • XP ${s.experience} • Runes: ${runesList}`;
  });
  return ctx.reply([`Your available spells (page ${p}/${totalPages}):`, ...lines, 'Cast with: /cast <spell_id>'].join('\n'));
}

export async function castCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const spellArg = getArgString(ctx).toLowerCase();
  if (!spellArg) return ctx.reply('Usage: /cast <spell_id_or_name>. Use /spells to list.');

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (!player.inCombat || !player.currentMonster) return ctx.reply('You must be in combat to cast a spell. Use /fight first.');
  if (player.combatStats.attackStyle !== 'magic') return ctx.reply('Switch to magic style first with /style magic.');

  // Require a magic weapon equipped
  if (!player.equipment.weapon) return ctx.reply('You need a magic weapon equipped to cast combat spells.');
  const weapon = await Item.findOne({ id: player.equipment.weapon });
  if (!weapon || weapon.subType !== 'magic') return ctx.reply('You need a magic weapon equipped to cast combat spells.');

  // Resolve spell id/name
  const available = getAvailableSpells(player);
  const spell = available.find(s => s.id === spellArg || s.name.toLowerCase().includes(spellArg));
  if (!spell) return ctx.reply('Spell not found or not available. Use /spells to see options.');

  const check = canCastSpell(player as any, spell.id);
  if (!check.canCast) return ctx.reply(`Cannot cast: ${check.reason}`);

  const area = await Area.findOne({ id: player.currentArea });
  const monster = area?.monsters.find(m => m.id === player.currentMonster);
  if (!monster) {
    player.inCombat = false; player.currentMonster = null as any; player.currentMonsterHp = null as any; await player.save();
    return ctx.reply('The monster is gone.');
  }

  // Accuracy roll using computed stats
  const stats = await calculateCombatStats(player as any);
  const magicLevel = stats.magic;
  const acc = calculateSpellAccuracy(spell.id, magicLevel, monster.elementalWeakness);
  if (Math.random() * 100 > acc) {
    // consume runes on cast even if miss
    consumeRunes(player as any, spell.id);
    await player.save();
    return ctx.reply(`${spell.name} missed.`);
  }

  // Damage + rune consumption
  const magicBonus = stats.magicBonus || 0;
  const dmgInfo = calculateSpellDamage(spell.id, magicLevel, magicBonus, monster.elementalWeakness);
  const damage = Math.max(0, Math.min(dmgInfo.damage, player.currentMonsterHp || monster.hp));
  consumeRunes(player as any, spell.id);

  // Apply damage and XP
  const newHp = Math.max(0, (player.currentMonsterHp || monster.hp) - damage);
  player.currentMonsterHp = newHp;

  // Award XP: base per spell + damage-based Magic XP
  const baseXp = getSpellExperience(spell.id);
  let magicExpTotal = baseXp;
  if (damage > 0) {
    const dmgGains = calculateExperienceGained(damage, monster.level, 'magic');
    magicExpTotal += (dmgGains.magic || 0);
  }
  const baseRes = addExperience(player.skills?.magic?.experience || 0, magicExpTotal);
  if (player.skills?.magic) player.skills.magic.experience = baseRes.newExp;

  await player.save();

  let lines: string[] = [];
  if (damage > 0) {
    lines.push(`You cast ${spell.name} and hit ${damage} damage${dmgInfo.isEffective ? ' (effective!)' : ''}.`);
  } else {
    lines.push(`You cast ${spell.name} but dealt no damage.`);
  }

  if (newHp <= 0) {
    // Monster defeated: loot and end combat
    player.inCombat = false; player.currentMonster = null as any; player.currentMonsterHp = null as any;
    await player.save();
    lines.push(`You defeated ${monster.name}!`);
    return ctx.reply(lines.join('\n'));
  }

  // HP summary after your cast
  lines.push(`HP — You: ${player.combatStats.currentHp}/${player.combatStats.maxHp} • ${monster.name}: ${newHp}/${monster.hp}`);

  // Monster retaliates after spell
  // Simple retaliation: reuse defend logic? Here do a basic retaliation similar to attack flow.
  // Minimal: monster counterattacks with reduced chance to speed up loop.
  if (Math.random() < 0.8) {
    const monsterHit = Math.max(0, Math.floor(monster.attack / 3) - Math.floor((player.combatStats.defense || 0) / 5));
    const finalHit = monsterHit > 0 ? Math.floor(Math.random() * monsterHit) + 1 : 0;
    player.combatStats.currentHp = Math.max(0, player.combatStats.currentHp - finalHit);
    await player.save();
    lines.push(finalHit > 0 ? `${monster.name} hits ${finalHit}.` : `${monster.name} missed.`);
    if (player.combatStats.currentHp <= 0) {
      player.inCombat = false; player.currentMonster = null as any; player.currentMonsterHp = null as any; player.combatStats.currentHp = player.combatStats.maxHp; await player.save();
      lines.push('You were defeated and have been restored to full HP.');
    }
  }

  return ctx.reply(lines.join('\n'));
}
