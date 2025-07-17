import { calculateLevelFromExperience } from './experienceUtils';

export const combatSpells = {
  wind_strike: {
    name: 'Wind Strike',
    levelRequired: 1,
    baseDamage: 2,
    maxDamage: 8,
    experience: 5.5,
    runes: { air_rune: 1, mind_rune: 1 },
    description: 'A basic wind spell'
  },
  water_strike: {
    name: 'Water Strike',
    levelRequired: 5,
    baseDamage: 4,
    maxDamage: 10,
    experience: 7.5,
    runes: { water_rune: 1, air_rune: 1, mind_rune: 1 },
    description: 'A basic water spell'
  },
  earth_strike: {
    name: 'Earth Strike',
    levelRequired: 9,
    baseDamage: 6,
    maxDamage: 12,
    experience: 9.5,
    runes: { earth_rune: 2, air_rune: 1, mind_rune: 1 },
    description: 'A basic earth spell'
  },
  fire_strike: {
    name: 'Fire Strike',
    levelRequired: 13,
    baseDamage: 8,
    maxDamage: 16,
    experience: 11.5,
    runes: { fire_rune: 3, air_rune: 2, mind_rune: 1 },
    description: 'A basic fire spell'
  },
  wind_bolt: {
    name: 'Wind Bolt',
    levelRequired: 17,
    baseDamage: 9,
    maxDamage: 18,
    experience: 13.5,
    runes: { air_rune: 2, chaos_rune: 1 },
    description: 'An improved wind spell'
  },
  water_bolt: {
    name: 'Water Bolt',
    levelRequired: 23,
    baseDamage: 10,
    maxDamage: 20,
    experience: 16.5,
    runes: { water_rune: 2, air_rune: 2, chaos_rune: 1 },
    description: 'An improved water spell'
  },
  earth_bolt: {
    name: 'Earth Bolt',
    levelRequired: 29,
    baseDamage: 11,
    maxDamage: 22,
    experience: 19.5,
    runes: { earth_rune: 3, air_rune: 2, chaos_rune: 1 },
    description: 'An improved earth spell'
  },
  fire_bolt: {
    name: 'Fire Bolt',
    levelRequired: 35,
    baseDamage: 12,
    maxDamage: 24,
    experience: 22.5,
    runes: { fire_rune: 4, air_rune: 3, chaos_rune: 1 },
    description: 'An improved fire spell'
  },
  wind_blast: {
    name: 'Wind Blast',
    levelRequired: 41,
    baseDamage: 13,
    maxDamage: 26,
    experience: 25.5,
    runes: { air_rune: 3, death_rune: 1 },
    description: 'A powerful wind spell'
  },
  water_blast: {
    name: 'Water Blast',
    levelRequired: 47,
    baseDamage: 14,
    maxDamage: 28,
    experience: 28.5,
    runes: { water_rune: 3, air_rune: 3, death_rune: 1 },
    description: 'A powerful water spell'
  },
  earth_blast: {
    name: 'Earth Blast',
    levelRequired: 53,
    baseDamage: 15,
    maxDamage: 30,
    experience: 31.5,
    runes: { earth_rune: 4, air_rune: 3, death_rune: 1 },
    description: 'A powerful earth spell'
  },
  fire_blast: {
    name: 'Fire Blast',
    levelRequired: 59,
    baseDamage: 16,
    maxDamage: 32,
    experience: 34.5,
    runes: { fire_rune: 5, air_rune: 4, death_rune: 1 },
    description: 'A powerful fire spell'
  },
  wind_wave: {
    name: 'Wind Wave',
    levelRequired: 62,
    baseDamage: 17,
    maxDamage: 34,
    experience: 36,
    runes: { air_rune: 5, blood_rune: 1 },
    description: 'An advanced wind spell'
  },
  water_wave: {
    name: 'Water Wave',
    levelRequired: 65,
    baseDamage: 18,
    maxDamage: 36,
    experience: 37.5,
    runes: { water_rune: 7, air_rune: 5, blood_rune: 1 },
    description: 'An advanced water spell'
  },
  earth_wave: {
    name: 'Earth Wave',
    levelRequired: 70,
    baseDamage: 19,
    maxDamage: 38,
    experience: 40,
    runes: { earth_rune: 7, air_rune: 5, blood_rune: 1 },
    description: 'An advanced earth spell'
  },
  fire_wave: {
    name: 'Fire Wave',
    levelRequired: 75,
    baseDamage: 20,
    maxDamage: 40,
    experience: 42.5,
    runes: { fire_rune: 7, air_rune: 5, blood_rune: 1 },
    description: 'An advanced fire spell'
  },
  wind_surge: {
    name: 'Wind Surge',
    levelRequired: 81,
    baseDamage: 21,
    maxDamage: 42,
    experience: 44,
    runes: { air_rune: 7, soul_rune: 1 },
    description: 'The ultimate wind spell'
  },
  water_surge: {
    name: 'Water Surge',
    levelRequired: 85,
    baseDamage: 22,
    maxDamage: 44,
    experience: 46,
    runes: { water_rune: 10, air_rune: 7, soul_rune: 1 },
    description: 'The ultimate water spell'
  },
  earth_surge: {
    name: 'Earth Surge',
    levelRequired: 90,
    baseDamage: 23,
    maxDamage: 46,
    experience: 48,
    runes: { earth_rune: 10, air_rune: 7, soul_rune: 1 },
    description: 'The ultimate earth spell'
  },
  fire_surge: {
    name: 'Fire Surge',
    levelRequired: 95,
    baseDamage: 24,
    maxDamage: 48,
    experience: 50,
    runes: { fire_rune: 10, air_rune: 7, soul_rune: 1 },
    description: 'The ultimate fire spell'
  }
};

export function getAvailableSpells(player: any) {
  const magicLevel = calculateLevelFromExperience(player.skills?.magic?.experience || 0);
  
  return Object.entries(combatSpells)
    .filter(([_, spell]) => magicLevel >= spell.levelRequired)
    .map(([id, spell]) => ({ id, ...spell }));
}

export function canCastSpell(player: any, spellId: string) {
  const spell = combatSpells[spellId as keyof typeof combatSpells];
  if (!spell) return { canCast: false, reason: 'Spell not found' };
  
  const magicLevel = calculateLevelFromExperience(player.skills?.magic?.experience || 0);
  if (magicLevel < spell.levelRequired) {
    return { canCast: false, reason: `Requires Magic level ${spell.levelRequired}` };
  }
  
  // Check if player has required runes
  for (const [runeType, amount] of Object.entries(spell.runes)) {
    const runeInInventory = player.inventory.find((item: any) => item.itemId === runeType);
    if (!runeInInventory || runeInInventory.quantity < amount) {
      return { 
        canCast: false, 
        reason: `Requires ${amount}x ${runeType.replace('_', ' ')} (have ${runeInInventory?.quantity || 0})` 
      };
    }
  }
  
  return { canCast: true, reason: '' };
}

export function consumeRunes(player: any, spellId: string) {
  const spell = combatSpells[spellId as keyof typeof combatSpells];
  if (!spell) return false;
  
  // Consume runes from inventory
  for (const [runeType, amount] of Object.entries(spell.runes)) {
    const runeInInventory = player.inventory.find((item: any) => item.itemId === runeType);
    if (runeInInventory) {
      runeInInventory.quantity -= amount;
      if (runeInInventory.quantity <= 0) {
        player.inventory = player.inventory.filter((item: any) => item.itemId !== runeType);
      }
    }
  }
  
  return true;
}

export function calculateSpellDamage(spellId: string, magicLevel: number, magicBonus: number = 0, targetWeakness?: string) {
  const spell = combatSpells[spellId as keyof typeof combatSpells];
  if (!spell) return { damage: 0, isEffective: false };
  
  // Base damage calculation with magic level and equipment bonus
  const levelBonus = Math.floor(magicLevel * 0.1);
  const equipmentBonus = Math.floor(magicBonus * 0.05);
  const baseDamage = spell.baseDamage + levelBonus + equipmentBonus;
  
  // Check for elemental effectiveness
  const spellElement = getSpellElement(spellId);
  const isEffective = targetWeakness === spellElement;
  
  // Apply elemental bonus (+10% damage if effective)
  const elementalMultiplier = isEffective ? 1.1 : 1.0;
  
  // Random damage between base and max
  const maxPossible = Math.min(spell.maxDamage + levelBonus + equipmentBonus, spell.maxDamage * 1.5);
  const baseFinalDamage = Math.floor(Math.random() * (maxPossible - baseDamage + 1)) + baseDamage;
  const finalDamage = Math.floor(baseFinalDamage * elementalMultiplier);
  
  return { damage: finalDamage, isEffective };
}

export function getSpellElement(spellId: string): string {
  if (spellId.includes('wind')) return 'air';
  if (spellId.includes('water')) return 'water';
  if (spellId.includes('earth')) return 'earth';
  if (spellId.includes('fire')) return 'fire';
  return 'none';
}

export function calculateSpellAccuracy(spellId: string, magicLevel: number, targetWeakness?: string): number {
  const spellElement = getSpellElement(spellId);
  const isEffective = targetWeakness === spellElement;
  
  // Base accuracy from magic level
  const baseAccuracy = Math.min(90, 50 + magicLevel);
  
  // Apply elemental bonus (+10% accuracy if effective)
  const elementalBonus = isEffective ? 10 : 0;
  
  return Math.min(95, baseAccuracy + elementalBonus);
}

export function getSpellExperience(spellId: string) {
  const spell = combatSpells[spellId as keyof typeof combatSpells];
  return spell?.experience || 0;
}