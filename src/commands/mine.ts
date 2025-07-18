import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';
import { canToolAccessResource } from '../utils/toolUtils';

export const data = new SlashCommandBuilder()
  .setName('mine')
  .setDescription('Mine ores in your current area')
  .addStringOption(option =>
    option.setName('ore')
      .setDescription('The ore to mine (leave empty for first available)')
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many ores to mine (default: 1)')
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

    const miningResources = area.resources.filter(r => r.skill === 'mining');
    const availableOres = miningResources
      .filter(resource => {
        const name = `${resource.name} (Level ${resource.levelRequired})`;
        return name.toLowerCase().includes(focusedValue.toLowerCase());
      })
      .map(resource => ({
        name: `${resource.name} (Level ${resource.levelRequired}) - ${resource.experience} XP`,
        value: resource.id
      }));

    await interaction.respond(availableOres.slice(0, 25));
  } catch (error) {
    console.error('Error in mine autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const oreName = interaction.options.getString('ore');
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
        content: 'You cannot mine while in combat!',
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

    const miningResources = area.resources.filter(r => r.skill === 'mining');
    
    if (miningResources.length === 0) {
      await interaction.reply({
        content: 'There are no mining resources in this area!',
        ephemeral: true
      });
      return;
    }

    let resource;
    if (oreName) {
      resource = miningResources.find(r => 
        r.name.toLowerCase().includes(oreName.toLowerCase()) || 
        r.id.toLowerCase() === oreName.toLowerCase()
      );
      if (!resource) {
        await interaction.reply({
          content: 'That ore is not available in this area!',
          ephemeral: true
        });
        return;
      }
    } else {
      resource = miningResources[0];
    }

    if (!resource) {
      await interaction.reply({
        content: 'No mining resource available!',
        ephemeral: true
      });
      return;
    }

    const miningLevel = calculateLevelFromExperience(player.skills?.mining?.experience || 0);
    
    if (miningLevel < resource.levelRequired) {
      await interaction.reply({
        content: `You need mining level ${resource.levelRequired} to mine ${resource.name}!`,
        ephemeral: true
      });
      return;
    }

    const equippedTool = player.equipment.weapon && 
      await Item.findOne({ id: player.equipment.weapon, subType: 'pickaxe' });
    
    if (!equippedTool) {
      await interaction.reply({
        content: 'You need a pickaxe equipped to mine!',
        ephemeral: true
      });
      return;
    }

    // Check if the equipped tool can access this resource
    if (!canToolAccessResource(player.equipment.weapon, resource.toolRequired, 'pickaxe')) {
      await interaction.reply({
        content: `You need at least a ${resource.toolRequired.replace('_', ' ')} to mine ${resource.name}!`,
        ephemeral: true
      });
      return;
    }

    if (quantity === 1) {
      const expResult = addExperience(player.skills?.mining?.experience || 0, resource.experience);
      if (player.skills?.mining) {
        player.skills.mining.experience = expResult.newExp;
      }

      const existingItem = player.inventory.find(item => item.itemId === resource.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        player.inventory.push({ itemId: resource.id, quantity: 1 });
      }

      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x8B4513)
        .setTitle('⛏️ Mining Success!')
        .setDescription(`You successfully mined **${resource.name}**!`)
        .addFields(
          { name: 'Experience Gained', value: `${resource.experience} Mining XP`, inline: true },
          { name: 'Item Obtained', value: `${resource.name} x1`, inline: true }
        );

      if (expResult.leveledUp) {
        embed.addFields({ name: 'Level Up!', value: `Mining level is now ${expResult.newLevel}!`, inline: false });
      }

      await interaction.reply({ embeds: [embed] });
    } else {
      const minTime = quantity * 5000;
      const maxTime = quantity * 15000;
      const totalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

      player.isSkilling = true;
      player.currentSkill = 'mining';
      player.skillingEndTime = new Date(Date.now() + totalTime);
      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x8B4513)
        .setTitle('⛏️ Mining in Progress...')
        .setDescription(`You begin mining for **${quantity}x ${resource.name}**...`)
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
          const expResult = addExperience(updatedPlayer.skills?.mining?.experience || 0, totalExperience);
          if (updatedPlayer.skills?.mining) {
            updatedPlayer.skills.mining.experience = expResult.newExp;
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
            .setTitle('⛏️ Mining Complete!')
            .setDescription(`You successfully mined **${quantity}x ${resource.name}**!`)
            .addFields(
              { name: 'Experience Gained', value: `${totalExperience} Mining XP`, inline: true },
              { name: 'Items Obtained', value: `${resource.name} x${quantity}`, inline: true },
              { name: 'Time Taken', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true }
            );

          if (expResult.leveledUp) {
            completedEmbed.addFields({ name: 'Level Up!', value: `Mining level is now ${expResult.newLevel}!`, inline: false });
          }

          try {
            await interaction.followUp({ embeds: [completedEmbed] });
          } catch (followUpError) {
            console.error('Error sending follow-up message:', followUpError);
            await interaction.channel?.send({ embeds: [completedEmbed] });
          }
        } catch (error) {
          console.error('Error completing mining:', error);
          const errorPlayer = await Player.findOne({ userId });
          if (errorPlayer) {
            errorPlayer.isSkilling = false;
            errorPlayer.currentSkill = null as any;
            errorPlayer.skillingEndTime = null as any;
            await errorPlayer.save();
          }
          
          try {
            await interaction.editReply({
              content: 'An error occurred while completing mining. Please try again.',
            });
          } catch (editError: any) {
            if (editError.code === 50027) {
              console.log('Mining failed and interaction expired');
            } else {
              console.error('Error editing reply:', editError);
            }
          }
        }
      }, totalTime);
    }
  } catch (error) {
    console.error('Error mining:', error);
    await interaction.reply({
      content: 'An error occurred while mining. Please try again.',
      ephemeral: true
    });
  }
}