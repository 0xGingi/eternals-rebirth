import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience } from './experienceUtils';

export interface CombatStats {
  attack: number;
  defense: number;
  accuracy: number;
  maxHit: number;
}

export async function calculateCombatStats(player: any): Promise<CombatStats> {
  let baseStats = {
    attack: 0,
    defense: 0,
    accuracy: 0,
    maxHit: 0
  };

  const attackLevel = calculateLevelFromExperience(player.skills.attack?.experience || 0);
  const strengthLevel = calculateLevelFromExperience(player.skills.strength?.experience || 0);
  const defenseLevel = calculateLevelFromExperience(player.skills.defense?.experience || 0);

  baseStats.attack = attackLevel;
  baseStats.defense = defenseLevel;
  baseStats.accuracy = attackLevel * 2 + 10;
  baseStats.maxHit = strengthLevel + 3;

  if (player.equipment.weapon) {
    const weapon = await Item.findOne({ id: player.equipment.weapon });
    if (weapon) {
      baseStats.attack += weapon.stats.attack || 0;
      baseStats.accuracy += weapon.stats.accuracy || 0;
      baseStats.maxHit += weapon.stats.damage || 0;
    }
  }

  return baseStats;
}

export function calculateDamage(attackerStats: CombatStats, defenderDefense: number): number {
  const accuracy = Math.max(10, attackerStats.accuracy - (defenderDefense * 2));
  const hitChance = Math.min(0.95, Math.max(0.25, accuracy / 100));
  
  if (Math.random() > hitChance) {
    return 0;
  }
  
  const maxDamage = Math.max(1, attackerStats.maxHit - Math.floor(defenderDefense / 2));
  return Math.floor(Math.random() * maxDamage) + 1;
}

export function calculateExperienceGained(damage: number, monsterLevel: number): { attack: number, strength: number, defense: number } {
  const baseExp = damage * 4;
  const levelBonus = monsterLevel * 2;
  
  return {
    attack: baseExp + levelBonus,
    strength: baseExp + levelBonus,
    defense: Math.floor((baseExp + levelBonus) / 3)
  };
}

export function generateLoot(dropTable: any[]): { itemId: string, quantity: number }[] {
  const loot: { itemId: string, quantity: number }[] = [];
  
  for (const drop of dropTable) {
    if (Math.random() < drop.chance) {
      loot.push({
        itemId: drop.itemId,
        quantity: drop.quantity
      });
    }
  }
  
  return loot;
}