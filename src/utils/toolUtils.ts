// Tool tier validation utility
export const toolTiers = {
  // Pickaxe tiers
  pickaxe: [
    'bronze_pickaxe',
    'iron_pickaxe', 
    'mithril_pickaxe',
    'adamant_pickaxe',
    'rune_pickaxe',
    'dragon_pickaxe',
    'barrows_pickaxe',
    'third_age_pickaxe',
    'primal_pickaxe'
  ],
  
  // Axe tiers
  axe: [
    'bronze_axe',
    'iron_axe',
    'mithril_axe', 
    'adamant_axe',
    'rune_axe',
    'dragon_axe',
    'barrows_axe',
    'third_age_axe',
    'primal_axe'
  ],
  
  // Fishing rod tiers
  rod: [
    'fishing_rod',
    'iron_fishing_rod',
    'mithril_fishing_rod',
    'adamant_fishing_rod', 
    'rune_fishing_rod',
    'dragon_fishing_rod',
    'barrows_fishing_rod',
    'third_age_fishing_rod',
    'primal_fishing_rod'
  ]
};

export function getToolTier(toolId: string, toolType: string): number {
  const tiers = toolTiers[toolType as keyof typeof toolTiers];
  if (!tiers) return -1;
  
  const index = tiers.indexOf(toolId);
  return index === -1 ? -1 : index;
}

export function getRequiredToolTier(requiredToolId: string, toolType: string): number {
  return getToolTier(requiredToolId, toolType);
}

export function canToolAccessResource(playerToolId: string, requiredToolId: string, toolType: string): boolean {
  const playerTier = getToolTier(playerToolId, toolType);
  const requiredTier = getRequiredToolTier(requiredToolId, toolType);
  
  // Player tool tier must be >= required tier
  return playerTier >= requiredTier;
}