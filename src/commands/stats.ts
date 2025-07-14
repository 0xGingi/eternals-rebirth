import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { calculateLevelFromExperience } from '../utils/experienceUtils';

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View your character stats');

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

    const skillsText = Object.entries(player.skills || {}).map(([skillName, skillData]: [string, any]) => {
      const level = calculateLevelFromExperience(skillData?.experience || 0);
      return `${skillName.charAt(0).toUpperCase() + skillName.slice(1)}: ${level} (${skillData?.experience || 0} XP)`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`${player.username}'s Stats`)
      .addFields(
        { name: 'Current Area', value: player.currentArea, inline: true },
        { name: 'Health', value: `${player.combatStats.currentHp}/${player.combatStats.maxHp}`, inline: true },
        { name: 'Combat Style', value: player.combatStats.attackStyle, inline: true },
        { name: 'Skills', value: skillsText, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    await interaction.reply({
      content: 'An error occurred while fetching your stats. Please try again.',
      ephemeral: true
    });
  }
}