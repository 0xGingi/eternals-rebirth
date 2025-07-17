import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { calculateLevelFromExperience } from '../utils/experienceUtils';

export const data = new SlashCommandBuilder()
  .setName('travel')
  .setDescription('Travel to a different area')
  .addStringOption(option =>
    option.setName('destination')
      .setDescription('The area you want to travel to')
      .setRequired(true)
      .addChoices(
        { name: 'Lumbridge', value: 'lumbridge' },
        { name: 'Varrock', value: 'varrock' },
        { name: 'Falador', value: 'falador' },
        { name: 'Catherby', value: 'catherby' },
        { name: 'Ardougne', value: 'ardougne' },
        { name: 'Dragon Isle', value: 'dragon_isle' },
        { name: 'Barrows Crypts', value: 'barrows_crypts' },
        { name: 'Primal Realm', value: 'primal_realm' }
      )
  );

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const destination = interaction.options.getString('destination');

  try {
    const player = await Player.findOne({ userId });
    
    if (!player) {
      await interaction.reply({
        content: 'You need to register first! Use `/register` to create your character.',
        ephemeral: true
      });
      return;
    }

    if (player.inCombat) {
      await interaction.reply({
        content: 'You cannot travel while in combat!',
        ephemeral: true
      });
      return;
    }

    if (player.isSkilling) {
      const timeRemaining = player.skillingEndTime ? Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000) : 0;
      await interaction.reply({
        content: `You cannot travel while ${player.currentSkill}! Please wait ${timeRemaining} seconds.`,
        ephemeral: true
      });
      return;
    }

    const area = await Area.findOne({ id: destination });
    
    if (!area) {
      await interaction.reply({
        content: 'Invalid destination!',
        ephemeral: true
      });
      return;
    }

    if (player.currentArea === destination) {
      await interaction.reply({
        content: `You are already in ${area.name}!`,
        ephemeral: true
      });
      return;
    }

    // No level requirements for travel - areas are now freely accessible

    player.currentArea = destination;
    await player.save();

    const monstersText = area.monsters.map(monster => `${monster.name} (Level ${monster.level})`).join('\n');
    const resourcesText = area.resources.map(resource => `${resource.name} (${resource.skill} - Level ${resource.levelRequired})`).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle(`Welcome to ${area.name}!`)
      .setDescription(area.description)
      .addFields(
        { name: 'Monsters', value: monstersText || 'None', inline: true },
        { name: 'Resources', value: resourcesText || 'None', inline: true },
        { name: 'Commands', value: '`/fight` - Fight monsters\n`/mine` - Mine resources\n`/fish` - Fish\n`/area` - Area info', inline: false }
      )
      .setFooter({ text: `Area Level: ${area.requiredLevel} (recommended)` });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error traveling:', error);
    await interaction.reply({
      content: 'An error occurred while traveling. Please try again.',
      ephemeral: true
    });
  }
}