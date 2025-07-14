import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

export const data = new SlashCommandBuilder()
  .setName('woodcut')
  .setDescription('Cut trees in your current area')
  .addStringOption(option =>
    option.setName('tree')
      .setDescription('The tree to cut (leave empty for first available)')
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function autocomplete(interaction: any) {
  const focusedValue = interaction.options.getFocused();
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    if (!player) {
      await interaction.respond([]);
      return;
    }

    const area = await Area.findOne({ id: player.currentArea });
    if (!area) {
      await interaction.respond([]);
      return;
    }

    const woodcuttingResources = area.resources.filter(r => r.skill === 'woodcutting');
    const availableTrees = woodcuttingResources
      .filter(resource => {
        const name = `${resource.name} (Level ${resource.levelRequired})`;
        return name.toLowerCase().includes(focusedValue.toLowerCase());
      })
      .map(resource => ({
        name: `${resource.name} (Level ${resource.levelRequired}) - ${resource.experience} XP`,
        value: resource.id
      }));

    await interaction.respond(availableTrees.slice(0, 25));
  } catch (error) {
    console.error('Error in woodcut autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const treeName = interaction.options.getString('tree');

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
        content: 'You cannot cut trees while in combat!',
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

    const woodcuttingResources = area.resources.filter(r => r.skill === 'woodcutting');
    
    if (woodcuttingResources.length === 0) {
      await interaction.reply({
        content: 'There are no trees in this area!',
        ephemeral: true
      });
      return;
    }

    let resource;
    if (treeName) {
      resource = woodcuttingResources.find(r => r.name.toLowerCase().includes(treeName.toLowerCase()) || r.id === treeName);
      if (!resource) {
        await interaction.reply({
          content: 'That tree is not available in this area!',
          ephemeral: true
        });
        return;
      }
    } else {
      resource = woodcuttingResources[0];
    }

    if (!resource) {
      await interaction.reply({
        content: 'No woodcutting resource available!',
        ephemeral: true
      });
      return;
    }

    const woodcuttingLevel = calculateLevelFromExperience(player.skills?.woodcutting?.experience || 0);
    
    if (woodcuttingLevel < resource.levelRequired) {
      await interaction.reply({
        content: `You need woodcutting level ${resource.levelRequired} to cut ${resource.name}!`,
        ephemeral: true
      });
      return;
    }

    const hasAxe = player.equipment.weapon && 
      await Item.findOne({ id: player.equipment.weapon, subType: 'axe' });
    
    if (!hasAxe) {
      await interaction.reply({
        content: 'You need an axe equipped to cut trees!',
        ephemeral: true
      });
      return;
    }

    const expResult = addExperience(player.skills?.woodcutting?.experience || 0, resource.experience);
    if (player.skills?.woodcutting) {
      player.skills.woodcutting.experience = expResult.newExp;
    }

    const existingItem = player.inventory.find(item => item.itemId === resource.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      player.inventory.push({ itemId: resource.id, quantity: 1 });
    }

    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0x228B22)
      .setTitle('🌳 Woodcutting Success!')
      .setDescription(`You successfully cut **${resource.name}**!`)
      .addFields(
        { name: 'Experience Gained', value: `${resource.experience} Woodcutting XP`, inline: true },
        { name: 'Item Obtained', value: `${resource.name.replace(' Tree', ' Logs')} x1`, inline: true }
      );

    if (expResult.leveledUp) {
      embed.addFields({ name: 'Level Up!', value: `Woodcutting level is now ${expResult.newLevel}!`, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error woodcutting:', error);
    await interaction.reply({
      content: 'An error occurred while woodcutting. Please try again.',
      ephemeral: true
    });
  }
}