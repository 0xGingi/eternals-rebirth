export function calculateLevelFromExperience(experience: number): number {
  let level = 1;
  let totalExp = 0;
  
  while (level < 99) {
    const expForNextLevel = Math.floor(level + 300 * Math.pow(2, level / 7));
    if (totalExp + expForNextLevel > experience) {
      break;
    }
    totalExp += expForNextLevel;
    level++;
  }
  
  return level;
}

export function calculateExperienceForLevel(level: number): number {
  let totalExp = 0;
  
  for (let i = 1; i < level; i++) {
    totalExp += Math.floor(i + 300 * Math.pow(2, i / 7));
  }
  
  return totalExp;
}

export function addExperience(currentExp: number, expToAdd: number): { newExp: number, newLevel: number, leveledUp: boolean } {
  const oldLevel = calculateLevelFromExperience(currentExp);
  const newExp = currentExp + expToAdd;
  const newLevel = calculateLevelFromExperience(newExp);
  
  return {
    newExp,
    newLevel,
    leveledUp: newLevel > oldLevel
  };
}