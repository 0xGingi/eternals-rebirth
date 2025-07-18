import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { calculateLevelFromExperience } from './experienceUtils';

export interface CombatStats {
  attack: number;
  defense: number;
  accuracy: number;
  maxHit: number;
  magic: number;
  magicBonus: number;
}

export async function calculateCombatStats(player: any): Promise<CombatStats> {
  let baseStats = {
    attack: 0,
    defense: 0,
    accuracy: 0,
    maxHit: 0,
    magic: 0,
    magicBonus: 0
  };

  const attackLevel = calculateLevelFromExperience(player.skills.attack?.experience || 0);
  const strengthLevel = calculateLevelFromExperience(player.skills.strength?.experience || 0);
  const defenseLevel = calculateLevelFromExperience(player.skills.defense?.experience || 0);
  const rangeLevel = calculateLevelFromExperience(player.skills.range?.experience || 0);
  const magicLevel = calculateLevelFromExperience(player.skills.magic?.experience || 0);

  // Base stats depend on combat style
  const combatStyle = player.combatStats.attackStyle;
  
  if (combatStyle === 'range') {
    // Range increases both range accuracy and damage
    baseStats.attack = rangeLevel;
    baseStats.accuracy = rangeLevel * 2 + 10;  // Range skill affects accuracy
    baseStats.maxHit = rangeLevel + 3;         // Range skill affects damage
  } else if (combatStyle === 'magic') {
    // Magic increases both magic accuracy and damage
    baseStats.attack = magicLevel;
    baseStats.magic = magicLevel;
    baseStats.accuracy = magicLevel * 2 + 10;  // Magic skill affects accuracy
    baseStats.maxHit = magicLevel + 3;         // Magic skill affects damage
  } else {
    // Melee combat: Attack affects accuracy, Strength affects damage
    baseStats.attack = attackLevel;
    baseStats.accuracy = attackLevel * 2 + 10; // Attack skill affects melee accuracy
    baseStats.maxHit = strengthLevel + 3;      // Strength skill affects melee damage
  }
  
  // Defense skill affects defense for all combat styles
  baseStats.defense = defenseLevel;
  
  // Set magic level for all combat styles (used by spell calculations)
  baseStats.magic = magicLevel;

  // Apply weapon bonuses based on combat style
  if (player.equipment.weapon) {
    const weapon = await Item.findOne({ id: player.equipment.weapon });
    if (weapon) {
      // Apply appropriate weapon stat bonuses based on combat style
      if (combatStyle === 'range') {
        // Range weapons: range stat affects both damage and accuracy
        baseStats.accuracy += weapon.stats.range || 0;
        baseStats.maxHit += weapon.stats.range || 0;
      } else if (combatStyle === 'magic') {
        // Magic weapons: magic stat affects both damage and accuracy
        baseStats.accuracy += weapon.stats.magic || 0;
        baseStats.maxHit += weapon.stats.magic || 0;
        baseStats.magicBonus += weapon.stats.magic || 0;
      } else {
        // Melee weapons: attack stat affects accuracy, strength stat affects damage
        baseStats.accuracy += weapon.stats.attack || 0;
        baseStats.maxHit += weapon.stats.strength || 0;
      }
      
      // Apply direct accuracy and damage bonuses (these are separate from skill bonuses)
      baseStats.accuracy += weapon.stats.accuracy || 0;
      baseStats.maxHit += weapon.stats.damage || 0;
      
      // Defense always applies to defense stat
      baseStats.defense += weapon.stats.defense || 0;
    }
  }

  // Apply ammunition bonuses for ranged weapons
  if (player.equipment.ammunition.itemId && combatStyle === 'range') {
    const ammunition = await Item.findOne({ id: player.equipment.ammunition.itemId });
    if (ammunition) {
      baseStats.maxHit += ammunition.stats.damage || 0;
    }
  }

  // Apply armor defense bonuses
  const armorSlots = ['helmet', 'chest', 'legs', 'boots', 'gloves', 'shield'];
  for (const slot of armorSlots) {
    if (player.equipment[slot]) {
      const armor = await Item.findOne({ id: player.equipment[slot] });
      if (armor) {
        baseStats.defense += armor.stats.defense || 0;
        
        // Apply style-specific bonuses from armor
        if (combatStyle === 'range') {
          // Range armor: range stat affects both damage and accuracy
          baseStats.accuracy += armor.stats.range || 0;
          baseStats.maxHit += armor.stats.range || 0;
        } else if (combatStyle === 'magic') {
          // Magic armor: magic stat affects both damage and accuracy
          baseStats.accuracy += armor.stats.magic || 0;
          baseStats.maxHit += armor.stats.magic || 0;
          baseStats.magicBonus += armor.stats.magic || 0;
        } else {
          // Melee armor: attack stat affects accuracy, strength stat affects damage
          baseStats.accuracy += armor.stats.attack || 0;
          baseStats.maxHit += armor.stats.strength || 0;
        }
        
        // Apply direct accuracy and damage bonuses (these are separate from skill bonuses)
        baseStats.accuracy += armor.stats.accuracy || 0;
        baseStats.maxHit += armor.stats.damage || 0;
      }
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

export function calculateExperienceGained(damage: number, monsterLevel: number, combatStyle: string): { attack?: number, strength?: number, defense?: number, range?: number, magic?: number } {
  const baseExp = damage * 4;
  const levelBonus = monsterLevel * 2;
  const totalExp = baseExp + levelBonus;
  
  const exp: any = {};
  
  switch (combatStyle) {
    case 'attack':
      exp.attack = totalExp;
      break;
    case 'strength':
      exp.strength = totalExp;
      break;
    case 'defense':
      exp.defense = totalExp;
      break;
    case 'range':
      exp.range = totalExp;
      break;
    case 'magic':
      exp.magic = totalExp;
      break;
    default:
      exp.attack = totalExp;
      break;
  }
  
  return exp;
}

export async function checkRangedCombatRequirements(player: any): Promise<{ valid: boolean, message?: string }> {
  if (player.combatStats.attackStyle === 'range') {
    // Check if player has a ranged weapon equipped
    if (!player.equipment.weapon) {
      return { valid: false, message: 'You need a ranged weapon equipped for ranged combat!' };
    }
    
    const weapon = await Item.findOne({ id: player.equipment.weapon });
    if (!weapon || weapon.subType !== 'ranged') {
      return { valid: false, message: 'You need a ranged weapon equipped for ranged combat!' };
    }
    
    // Check if player has ammunition equipped
    if (!player.equipment.ammunition.itemId || player.equipment.ammunition.quantity <= 0) {
      return { valid: false, message: 'You need arrows equipped for ranged combat!' };
    }
    
    const ammunition = await Item.findOne({ id: player.equipment.ammunition.itemId });
    if (!ammunition || ammunition.subType !== 'ammunition') {
      return { valid: false, message: 'You need arrows equipped for ranged combat!' };
    }
  }
  
  return { valid: true };
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