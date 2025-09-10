import { Context } from 'telegraf';
import { Player } from '../../models/Player';
import { Area } from '../../models/Area';
import { Item } from '../../models/Item';
import { calculateCombatStats, calculateDamage, calculateExperienceGained, generateLoot, checkRangedCombatRequirements } from '../../utils/combatUtils';
import { addExperience } from '../../utils/experienceUtils';
import { getArgString } from '../utils/args';

export async function fightCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const query = getArgString(ctx).toLowerCase();

  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');
  if (player.inCombat) return ctx.reply('You are already in combat. Use /attack, /defend, /eat, or /run.');

  const area = await Area.findOne({ id: player.currentArea });
  if (!area) return ctx.reply('Your current area is invalid.');
  const monsters = area.monsters || [];
  if (!monsters.length) return ctx.reply('There are no monsters here.');

  let monster = null as any;
  if (query) {
    monster = monsters.find((m: any) => m.id === query || m.name.toLowerCase().includes(query));
    if (!monster) return ctx.reply('Monster not found in this area.');
  } else {
    monster = monsters[Math.floor(Math.random() * monsters.length)];
  }

  player.inCombat = true;
  player.currentMonster = monster.id;
  player.currentMonsterHp = monster.hp;
  await player.save();

  const msg = [
    `You engage ${monster.name} (Lvl ${monster.level}).`,
    `Your style: ${player.combatStats.attackStyle}.`,
    'Commands: /attack, /defend, /eat <food>, /run'
  ].join('\n');
  return ctx.reply(msg);
}

export async function attackCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');

  const player = await Player.findOne({ userId });
  if (!player || !player.inCombat || !player.currentMonster) return ctx.reply('You are not in combat. Use /fight to start.');
  const area = await Area.findOne({ id: player.currentArea });
  const monster = area?.monsters.find(m => m.id === player.currentMonster);
  if (!monster) {
    player.inCombat = false; player.currentMonster = null as any; player.currentMonsterHp = null as any; await player.save();
    return ctx.reply('The monster is gone.');
  }

  if (player.combatStats.attackStyle === 'magic') {
    return ctx.reply('You cannot use basic attacks in magic mode. Use /style to switch or implement spells later.');
  }

  // Ranged requirements
  const rangedReq = await checkRangedCombatRequirements(player as any);
  if (!rangedReq.valid) return ctx.reply(rangedReq.message!);

  const playerStats = await calculateCombatStats(player as any);
  let monsterHp = player.currentMonsterHp || monster.hp;

  // Player hits monster
  const playerHit = calculateDamage(playerStats, monster.defense);
  monsterHp -= playerHit;

  // Consume arrow for ranged
  if (player.combatStats.attackStyle === 'range' && player.equipment.ammunition.itemId) {
    if (player.equipment.ammunition.quantity > 0) {
      player.equipment.ammunition.quantity -= 1;
      if (player.equipment.ammunition.quantity <= 0) {
        player.equipment.ammunition.itemId = null as any;
        player.equipment.ammunition.quantity = 0;
      }
    }
  }

  // Award XP for player's hit
  if (playerHit > 0) {
    const gains = calculateExperienceGained(playerHit, monster.level, player.combatStats.attackStyle);
    for (const key of Object.keys(gains)) {
      const exp = (gains as any)[key];
      const res = addExperience((player.skills as any)[key]?.experience || 0, exp);
      (player.skills as any)[key].experience = res.newExp;
    }
  }

  let lines = [] as string[];
  lines.push(playerHit > 0 ? `You hit ${playerHit} damage.` : 'You missed.');

  if (monsterHp <= 0) {
    // Player wins
    player.inCombat = false;
    player.currentMonster = null as any;
    player.currentMonsterHp = null as any;

    // Generate loot
    const loot = generateLoot(monster.dropTable || []);
    for (const drop of loot) {
      const inv = player.inventory.find(i => i.itemId === drop.itemId);
      if (inv) inv.quantity += drop.quantity; else player.inventory.push({ itemId: drop.itemId, quantity: drop.quantity });
    }
    await player.save();

    const lootDesc = loot.length
      ? (await Promise.all(loot.map(async l => {
          const it = await Item.findOne({ id: l.itemId });
          return `- ${it?.name ?? l.itemId} x${l.quantity}`;
        }))).join('\n')
      : 'No drops';
    lines.push(`You defeated ${monster.name}!`);
    lines.push('Loot:');
    lines.push(lootDesc);
    return ctx.reply(lines.join('\n'));
  }

  // Monster retaliates
  player.currentMonsterHp = monsterHp;
  const monsterHit = monsterAttack(monster.attack, playerStats.defense);
  player.combatStats.currentHp = Math.max(0, player.combatStats.currentHp - monsterHit);
  lines.push(monsterHit > 0 ? `${monster.name} hits ${monsterHit}.` : `${monster.name} missed.`);

  // HP summary
  const enemyHp = Math.max(0, monsterHp);
  lines.push(`HP — You: ${player.combatStats.currentHp}/${player.combatStats.maxHp} • ${monster.name}: ${enemyHp}/${monster.hp}`);

  // Check player death
  if (player.combatStats.currentHp <= 0) {
    player.inCombat = false;
    player.currentMonster = null as any;
    player.currentMonsterHp = null as any;
    player.combatStats.currentHp = player.combatStats.maxHp; // respawn at full HP
    await player.save();
    lines.push('You were defeated and have been restored to full HP.');
    return ctx.reply(lines.join('\n'));
  }

  await player.save();
  return ctx.reply(lines.join('\n'));
}

export async function defendCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const player = await Player.findOne({ userId });
  if (!player || !player.inCombat || !player.currentMonster) return ctx.reply('You are not in combat.');

  const area = await Area.findOne({ id: player.currentArea });
  const monster = area?.monsters.find(m => m.id === player.currentMonster);
  if (!monster) { player.inCombat = false; player.currentMonster = null as any; player.currentMonsterHp = null as any; await player.save(); return ctx.reply('The monster is gone.'); }

  // Defend: reduce incoming damage by 50%
  const playerStats = await calculateCombatStats(player as any);
  const monsterHit = Math.floor(monsterAttack(monster.attack, playerStats.defense) / 2);
  player.combatStats.currentHp = Math.max(0, player.combatStats.currentHp - monsterHit);

  const lines = [monsterHit > 0 ? `You defend. Incoming damage reduced to ${monsterHit}.` : 'You defend. Monster missed.'];
  if (player.combatStats.currentHp <= 0) {
    player.inCombat = false; player.currentMonster = null as any; player.currentMonsterHp = null as any; player.combatStats.currentHp = player.combatStats.maxHp; await player.save();
    lines.push('You were defeated and have been restored to full HP.');
    return ctx.reply(lines.join('\n'));
  }
  await player.save();
  return ctx.reply(lines.join('\n'));
}

export async function runCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const player = await Player.findOne({ userId });
  if (!player || !player.inCombat) return ctx.reply('You are not in combat.');

  if (Math.random() < 0.8) {
    player.inCombat = false;
    player.currentMonster = null as any;
    player.currentMonsterHp = null as any;
    await player.save();
    return ctx.reply('You successfully ran away from combat.');
  } else {
    return ctx.reply('You failed to run away!');
  }
}

export async function eatCommand(ctx: Context) {
  const userId = String(ctx.from?.id ?? '');
  if (!userId) return ctx.reply('Could not determine your user id.');
  const query = getArgString(ctx).toLowerCase();
  const player = await Player.findOne({ userId });
  if (!player) return ctx.reply('You need to register first with /register.');

  // pick a food by id or name
  let targetInv = null as any;
  if (query) {
    // direct id match
    targetInv = player.inventory.find((inv) => inv.itemId.toLowerCase() === query);
    // fuzzy by name
    if (!targetInv) {
      const byName = await Item.findOne({ name: { $regex: new RegExp(query, 'i') }, edible: true });
      if (byName) {
        targetInv = player.inventory.find((inv) => inv.itemId === byName.id) || null;
      }
    }
  }
  if (!targetInv) {
    // fallback: any edible food in inventory
    for (const inv of player.inventory) {
      const item = await Item.findOne({ id: inv.itemId });
      if (item?.edible) { targetInv = inv; break; }
    }
  }
  if (!targetInv) return ctx.reply('You have no food to eat.');

  const foodItem = await Item.findOne({ id: targetInv.itemId });
  if (!foodItem?.edible) return ctx.reply('That is not edible.');

  const heal = Math.min(foodItem.healAmount, player.combatStats.maxHp - player.combatStats.currentHp);
  player.combatStats.currentHp += heal;
  targetInv.quantity -= 1;
  if (targetInv.quantity <= 0) {
    player.inventory = player.inventory.filter(i => i.itemId !== targetInv.itemId);
  }
  await player.save();
  const contextNote = player.inCombat ? ' in combat' : '';
  return ctx.reply(`You ate ${foodItem.name} and healed ${heal} HP${contextNote}.`);
}

function monsterAttack(monsterAttack: number, playerDefense: number): number {
  // Simple model: similar to player accuracy; randomized hit
  const accuracy = Math.max(10, monsterAttack * 2 - (playerDefense * 2));
  const hitChance = Math.min(0.95, Math.max(0.25, accuracy / 100));
  if (Math.random() > hitChance) return 0;
  const maxDamage = Math.max(1, monsterAttack - Math.floor(playerDefense / 3));
  return Math.floor(Math.random() * maxDamage) + 1;
}
