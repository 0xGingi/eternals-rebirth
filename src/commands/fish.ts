import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

export const data = new SlashCommandBuilder()
  .setName('fish')
  .setDescription('Fish in your current area')
  .addStringOption(option =>
    option.setName('fish')
      .setDescription('The fish to catch (leave empty for first available)')
      .setRequired(false)
  );

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const fishName = interaction.options.getString('fish');

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
        content: 'You cannot fish while in combat!',
        ephemeral: true
      });
      return;
    }

    const area = await Area.findOne({ id: player.currentArea });
    
    if (!area) {
      await interaction.reply({
        content: 'Area not found!',
        ephemeral: true
      });
      return;
    }

    const fishingResources = area.resources.filter(r => r.skill === 'fishing');
    
    if (fishingResources.length === 0) {
      await interaction.reply({
        content: 'There are no fishing spots in this area!',
        ephemeral: true
      });
      return;
    }

    let resource;
    if (fishName) {
      resource = fishingResources.find(r => r.name.toLowerCase().includes(fishName.toLowerCase()));
      if (!resource) {
        await interaction.reply({
          content: 'That fish is not available in this area!',
          ephemeral: true
        });
        return;
      }
    } else {
      resource = fishingResources[0];
    }

    if (!resource) {
      await interaction.reply({
        content: 'No fishing resource available!',
        ephemeral: true
      });
      return;
    }

    const fishingLevel = calculateLevelFromExperience(player.skills?.fishing?.experience || 0);
    
    if (fishingLevel < resource.levelRequired) {
      await interaction.reply({
        content: `You need fishing level ${resource.levelRequired} to catch ${resource.name}!`,
        ephemeral: true
      });
      return;
    }

    const hasRod = player.equipment.weapon && 
      await Item.findOne({ id: player.equipment.weapon, subType: 'rod' });
    
    if (!hasRod) {
      await interaction.reply({
        content: 'You need a fishing rod equipped to fish!',
        ephemeral: true
      });
      return;
    }

    const expResult = addExperience(player.skills?.fishing?.experience || 0, resource.experience);
    if (player.skills?.fishing) {
      player.skills.fishing.experience = expResult.newExp;
    }

    const existingItem = player.inventory.find(item => item.itemId === resource.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      player.inventory.push({ itemId: resource.id, quantity: 1 });
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Fishing Success!')
      .setDescription(`You successfully caught **${resource.name}**!`)
      .addFields(
        { name: 'Experience Gained', value: `${resource.experience} Fishing XP`, inline: true },
        { name: 'Item Obtained', value: `${resource.name} x1`, inline: true }
      );

    if (expResult.leveledUp) {
      embed.addFields({ name: 'Level Up!', value: `Fishing level is now ${expResult.newLevel}!`, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fishing:', error);
    await interaction.reply({
      content: 'An error occurred while fishing. Please try again.',
      ephemeral: true
    });
  }
}