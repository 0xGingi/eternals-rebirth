import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { calculateLevelFromExperience, calculateExperienceForLevel } from '../utils/experienceUtils';

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View your character stats');

function calculateXpToNextLevel(currentExp: number): { xpToNext: number, nextLevelXp: number } {
  const currentLevel = calculateLevelFromExperience(currentExp);
  
  if (currentLevel >= 99) {
    return { xpToNext: 0, nextLevelXp: 0 };
  }
  
  const nextLevelXp = calculateExperienceForLevel(currentLevel + 1);
  const xpToNext = nextLevelXp - currentExp;
  
  return { xpToNext, nextLevelXp };
}

function createProgressBar(current: number, max: number, length: number = 10): string {
  const percentage = Math.min(current / max, 1);
  const filled = Math.floor(percentage * length);
  const empty = length - filled;
  
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    
    if (!player) {
      await interaction.reply({
        content: 'You need to register first! Use `/register` to create your character.',
        ephemeral: true
      });
      return;
    }

    const skillCategories = {
      combat: ['attack', 'strength', 'defense', 'magic', 'range'],
      gathering: ['mining', 'fishing', 'woodcutting'],
      artisan: ['smithing', 'fletching', 'crafting', 'cooking']
    };

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`${player.username}'s Stats`)
      .setDescription(`**Current Area:** ${player.currentArea}\n**Health:** ${player.combatStats.currentHp}/${player.combatStats.maxHp}\n**Combat Style:** ${player.combatStats.attackStyle}`);

    // Combat Skills
    const combatSkills = skillCategories.combat.map(skillName => {
      const skillData = (player.skills as any)?.[skillName];
      const experience = skillData?.experience || 0;
      const level = calculateLevelFromExperience(experience);
      const { xpToNext, nextLevelXp } = calculateXpToNextLevel(experience);
      const currentLevelXp = level > 1 ? calculateExperienceForLevel(level) : 0;
      const progressBar = level >= 99 ? '█'.repeat(10) : createProgressBar(experience - currentLevelXp, nextLevelXp - currentLevelXp);
      
      if (level >= 99) {
        return `**${skillName.charAt(0).toUpperCase() + skillName.slice(1)}**: ${level} (${experience.toLocaleString()} XP)\n${progressBar} MAX`;
      }
      
      return `**${skillName.charAt(0).toUpperCase() + skillName.slice(1)}**: ${level} (${experience.toLocaleString()} XP)\n${progressBar} ${xpToNext.toLocaleString()} XP to ${level + 1}`;
    }).join('\n\n');

    // Gathering Skills
    const gatheringSkills = skillCategories.gathering.map(skillName => {
      const skillData = (player.skills as any)?.[skillName];
      const experience = skillData?.experience || 0;
      const level = calculateLevelFromExperience(experience);
      const { xpToNext, nextLevelXp } = calculateXpToNextLevel(experience);
      const currentLevelXp = level > 1 ? calculateExperienceForLevel(level) : 0;
      const progressBar = level >= 99 ? '█'.repeat(10) : createProgressBar(experience - currentLevelXp, nextLevelXp - currentLevelXp);
      
      if (level >= 99) {
        return `**${skillName.charAt(0).toUpperCase() + skillName.slice(1)}**: ${level} (${experience.toLocaleString()} XP)\n${progressBar} MAX`;
      }
      
      return `**${skillName.charAt(0).toUpperCase() + skillName.slice(1)}**: ${level} (${experience.toLocaleString()} XP)\n${progressBar} ${xpToNext.toLocaleString()} XP to ${level + 1}`;
    }).join('\n\n');

    // Artisan Skills
    const artisanSkills = skillCategories.artisan.map(skillName => {
      const skillData = (player.skills as any)?.[skillName];
      const experience = skillData?.experience || 0;
      const level = calculateLevelFromExperience(experience);
      const { xpToNext, nextLevelXp } = calculateXpToNextLevel(experience);
      const currentLevelXp = level > 1 ? calculateExperienceForLevel(level) : 0;
      const progressBar = level >= 99 ? '█'.repeat(10) : createProgressBar(experience - currentLevelXp, nextLevelXp - currentLevelXp);
      
      if (level >= 99) {
        return `**${skillName.charAt(0).toUpperCase() + skillName.slice(1)}**: ${level} (${experience.toLocaleString()} XP)\n${progressBar} MAX`;
      }
      
      return `**${skillName.charAt(0).toUpperCase() + skillName.slice(1)}**: ${level} (${experience.toLocaleString()} XP)\n${progressBar} ${xpToNext.toLocaleString()} XP to ${level + 1}`;
    }).join('\n\n');

    embed.addFields(
      { name: 'Combat Skills', value: combatSkills || 'No combat skills yet', inline: false },
      { name: 'Gathering Skills', value: gatheringSkills || 'No gathering skills yet', inline: false },
      { name: 'Artisan Skills', value: artisanSkills || 'No artisan skills yet', inline: false }
    );

    // Calculate total level
    const totalLevel = Object.values(player.skills || {}).reduce((total, skillData: any) => {
      return total + calculateLevelFromExperience(skillData?.experience || 0);
    }, 0);

    embed.setFooter({ text: `Total Level: ${totalLevel} | Updated` });
    embed.setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    await interaction.reply({
      content: 'An error occurred while fetching your stats. Please try again.',
      ephemeral: true
    });
  }
}