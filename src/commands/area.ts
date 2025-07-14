import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';

export const data = new SlashCommandBuilder()
  .setName('area')
  .setDescription('View information about your current area');

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

    const area = await Area.findOne({ id: player.currentArea });
    
    if (!area) {
      await interaction.reply({
        content: 'Error: Current area not found!',
        ephemeral: true
      });
      return;
    }

    const monstersText = area.monsters.map(monster => 
      `**${monster.name}** (Level ${monster.level})\n` +
      `HP: ${monster.hp} | Attack: ${monster.attack} | Defense: ${monster.defense}\n` +
      `Experience: ${monster.experience} XP\n`
    ).join('\n');

    const resourcesText = area.resources.map(resource => 
      `**${resource.name}** (${resource.skill.charAt(0).toUpperCase() + resource.skill.slice(1)})\n` +
      `Level Required: ${resource.levelRequired} | Experience: ${resource.experience} XP\n` +
      `Tool Required: ${resource.toolRequired}\n`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`${area.name}`)
      .setDescription(area.description)
      .addFields(
        { name: 'Monsters', value: monstersText || 'None', inline: false },
        { name: 'Resources', value: resourcesText || 'None', inline: false }
      )
      .setFooter({ text: `Required Level: ${area.requiredLevel}` });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error getting area info:', error);
    await interaction.reply({
      content: 'An error occurred while getting area information. Please try again.',
      ephemeral: true
    });
  }
}