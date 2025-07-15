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
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many fish to catch (default: 1)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(200)
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

    const fishingResources = area.resources.filter(r => r.skill === 'fishing');
    const availableFish = fishingResources
      .filter(resource => {
        const name = `${resource.name} (Level ${resource.levelRequired})`;
        return name.toLowerCase().includes(focusedValue.toLowerCase());
      })
      .map(resource => ({
        name: `${resource.name} (Level ${resource.levelRequired}) - ${resource.experience} XP`,
        value: resource.id
      }));

    await interaction.respond(availableFish.slice(0, 25));
  } catch (error) {
    console.error('Error in fish autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const fishName = interaction.options.getString('fish');
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
        content: 'You cannot fish while in combat!',
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
      resource = fishingResources.find(r => 
        r.name.toLowerCase().includes(fishName.toLowerCase()) || 
        r.id.toLowerCase() === fishName.toLowerCase()
      );
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

    if (quantity === 1) {
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
    } else {
      const minTime = quantity * 1000;
      const maxTime = quantity * 5000;
      const totalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

      player.isSkilling = true;
      player.currentSkill = 'fishing';
      player.skillingEndTime = new Date(Date.now() + totalTime);
      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Fishing in Progress...')
        .setDescription(`You begin fishing for **${quantity}x ${resource.name}**...`)
        .addFields(
          { name: 'Expected Time', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true },
          { name: 'Target', value: `${resource.name} x${quantity}`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        try {
          const updatedPlayer = await Player.findOne({ userId });
          if (!updatedPlayer) return;

          const totalExperience = resource.experience * quantity;
          const expResult = addExperience(updatedPlayer.skills?.fishing?.experience || 0, totalExperience);
          if (updatedPlayer.skills?.fishing) {
            updatedPlayer.skills.fishing.experience = expResult.newExp;
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
            .setTitle('Fishing Complete!')
            .setDescription(`You successfully caught **${quantity}x ${resource.name}**!`)
            .addFields(
              { name: 'Experience Gained', value: `${totalExperience} Fishing XP`, inline: true },
              { name: 'Items Obtained', value: `${resource.name} x${quantity}`, inline: true },
              { name: 'Time Taken', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true }
            );

          if (expResult.leveledUp) {
            completedEmbed.addFields({ name: 'Level Up!', value: `Fishing level is now ${expResult.newLevel}!`, inline: false });
          }

          await interaction.editReply({ embeds: [completedEmbed] });
        } catch (error) {
          console.error('Error completing fishing:', error);
          const errorPlayer = await Player.findOne({ userId });
          if (errorPlayer) {
            errorPlayer.isSkilling = false;
            errorPlayer.currentSkill = null as any;
            errorPlayer.skillingEndTime = null as any;
            await errorPlayer.save();
          }
          await interaction.editReply({
            content: 'An error occurred while completing fishing. Please try again.',
          });
        }
      }, totalTime);
    }
  } catch (error) {
    console.error('Error fishing:', error);
    await interaction.reply({
      content: 'An error occurred while fishing. Please try again.',
      ephemeral: true
    });
  }
}