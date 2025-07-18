import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';
import { canToolAccessResource } from '../utils/toolUtils';

export const data = new SlashCommandBuilder()
  .setName('woodcut')
  .setDescription('Cut trees in your current area')
  .addStringOption(option =>
    option.setName('tree')
      .setDescription('The tree to cut (leave empty for first available)')
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many logs to cut (default: 1)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(100)
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
  const quantity = interaction.options.getInteger('quantity') || 1;

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

    if (player.isSkilling) {
      const timeRemaining = player.skillingEndTime ? Math.ceil((player.skillingEndTime.getTime() - Date.now()) / 1000) : 0;
      await interaction.reply({
        content: `You are already ${player.currentSkill}! Please wait ${timeRemaining} seconds.`,
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

    const equippedTool = player.equipment.weapon && 
      await Item.findOne({ id: player.equipment.weapon, subType: 'axe' });
    
    if (!equippedTool) {
      await interaction.reply({
        content: 'You need an axe equipped to cut trees!',
        ephemeral: true
      });
      return;
    }

    // Check if the equipped tool can access this resource
    if (!canToolAccessResource(player.equipment.weapon, resource.toolRequired, 'axe')) {
      await interaction.reply({
        content: `You need at least a ${resource.toolRequired.replace('_', ' ')} to cut ${resource.name}!`,
        ephemeral: true
      });
      return;
    }

    if (quantity === 1) {
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
    } else {
      const minTime = quantity * 5000;
      const maxTime = quantity * 15000;
      const totalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

      player.isSkilling = true;
      player.currentSkill = 'woodcutting';
      player.skillingEndTime = new Date(Date.now() + totalTime);
      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x228B22)
        .setTitle('Woodcutting in Progress...')
        .setDescription(`You begin cutting **${quantity}x ${resource.name}**...`)
        .addFields(
          { name: 'Expected Time', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true },
          { name: 'Target', value: `${resource.name.replace(' Tree', ' Logs')} x${quantity}`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        try {
          const updatedPlayer = await Player.findOne({ userId });
          if (!updatedPlayer) return;

          const totalExperience = resource.experience * quantity;
          const expResult = addExperience(updatedPlayer.skills?.woodcutting?.experience || 0, totalExperience);
          if (updatedPlayer.skills?.woodcutting) {
            updatedPlayer.skills.woodcutting.experience = expResult.newExp;
          }

          const existingItem = updatedPlayer.inventory.find(item => item.itemId === resource.id);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            updatedPlayer.inventory.push({ itemId: resource.id, quantity });
          }

          updatedPlayer.isSkilling = false;
          updatedPlayer.currentSkill = null as any;
          updatedPlayer.skillingEndTime = null as any;
          await updatedPlayer.save();

          const completedEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Woodcutting Complete!')
            .setDescription(`You successfully cut **${quantity}x ${resource.name}**!`)
            .addFields(
              { name: 'Experience Gained', value: `${totalExperience} Woodcutting XP`, inline: true },
              { name: 'Items Obtained', value: `${resource.name.replace(' Tree', ' Logs')} x${quantity}`, inline: true },
              { name: 'Time Taken', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true }
            );

          if (expResult.leveledUp) {
            completedEmbed.addFields({ name: 'Level Up!', value: `Woodcutting level is now ${expResult.newLevel}!`, inline: false });
          }

          try {
            await interaction.followUp({ embeds: [completedEmbed] });
          } catch (followUpError) {
            console.error('Error sending follow-up message:', followUpError);
            await interaction.channel?.send({ embeds: [completedEmbed] });
          }
        } catch (error) {
          console.error('Error completing woodcutting:', error);
          const errorPlayer = await Player.findOne({ userId });
          if (errorPlayer) {
            errorPlayer.isSkilling = false;
            errorPlayer.currentSkill = null as any;
            errorPlayer.skillingEndTime = null as any;
            await errorPlayer.save();
          }
          
          try {
            await interaction.editReply({
              content: 'An error occurred while completing woodcutting. Please try again.',
            });
          } catch (editError: any) {
            if (editError.code === 50027) {
              console.log('Woodcutting failed and interaction expired');
            } else {
              console.error('Error editing reply:', editError);
            }
          }
        }
      }, totalTime);
    }
  } catch (error) {
    console.error('Error woodcutting:', error);
    await interaction.reply({
      content: 'An error occurred while woodcutting. Please try again.',
      ephemeral: true
    });
  }
}