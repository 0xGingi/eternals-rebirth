import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

const clothMaterials = [
  { id: 'cloth', name: 'Cloth', level: 1, experience: 1 },
  { id: 'soft_cloth', name: 'Soft Cloth', level: 10, experience: 1 },
  { id: 'fine_cloth', name: 'Fine Cloth', level: 20, experience: 1 },
  { id: 'silk_cloth', name: 'Silk Cloth', level: 30, experience: 2 },
  { id: 'mystic_cloth', name: 'Mystic Cloth', level: 40, experience: 2 },
  { id: 'enchanted_cloth', name: 'Enchanted Cloth', level: 50, experience: 2 },
  { id: 'lunar_cloth', name: 'Lunar Cloth', level: 60, experience: 2 },
  { id: 'infinity_cloth', name: 'Infinity Cloth', level: 70, experience: 2 },
  { id: 'ancestral_cloth', name: 'Ancestral Cloth', level: 80, experience: 2 },
  { id: 'ethereal_cloth', name: 'Ethereal Cloth', level: 90, experience: 2 }
];

export const data = new SlashCommandBuilder()
  .setName('gather')
  .setDescription('Gather cloth materials for crafting magic robes')
  .addStringOption(option =>
    option.setName('material')
      .setDescription('The cloth material to gather')
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many to gather (default: 1)')
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

    const craftingLevel = calculateLevelFromExperience(player.skills?.crafting?.experience || 0);
    
    const availableMaterials = clothMaterials
      .filter(material => craftingLevel >= material.level)
      .filter(material => material.name.toLowerCase().includes(focusedValue.toLowerCase()))
      .map(material => ({
        name: `${material.name} (Level ${material.level}) - ${material.experience} XP`,
        value: material.id
      }));

    await interaction.respond(availableMaterials.slice(0, 25));
  } catch (error) {
    console.error('Error in gather autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const materialName = interaction.options.getString('material');
  const requestedQuantity = interaction.options.getInteger('quantity') || 1;

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
        content: 'You cannot gather while in combat!',
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

    const craftingLevel = calculateLevelFromExperience(player.skills?.crafting?.experience || 0);

    let material;
    if (materialName) {
      material = clothMaterials.find(m => 
        m.name.toLowerCase().includes(materialName.toLowerCase()) || 
        m.id.toLowerCase().includes(materialName.toLowerCase())
      );
      
      if (!material) {
        await interaction.reply({
          content: 'That material cannot be gathered!',
          ephemeral: true
        });
        return;
      }

      if (craftingLevel < material.level) {
        await interaction.reply({
          content: `You need crafting level ${material.level} to gather ${material.name}!`,
          ephemeral: true
        });
        return;
      }
    } else {
      const availableMaterials = clothMaterials.filter(m => craftingLevel >= m.level);
      material = availableMaterials[availableMaterials.length - 1];
      
      if (!material) {
        await interaction.reply({
          content: 'You need at least crafting level 1 to gather cloth materials!',
          ephemeral: true
        });
        return;
      }
    }

    if (requestedQuantity === 1) {
      const totalExperience = material.experience * requestedQuantity;
      const expResult = addExperience(player.skills?.crafting?.experience || 0, totalExperience);
      if (player.skills?.crafting) {
        player.skills.crafting.experience = expResult.newExp;
      }

      const existingItem = player.inventory.find(item => item.itemId === material.id);
      if (existingItem) {
        existingItem.quantity += requestedQuantity;
      } else {
        player.inventory.push({ itemId: material.id, quantity: requestedQuantity });
      }

      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x32CD32)
        .setTitle('Gathering Success!')
        .setDescription(`You successfully gathered **${material.name}**!`)
        .addFields(
          { name: 'Experience Gained', value: `${totalExperience} Crafting XP`, inline: true },
          { name: 'Materials Gathered', value: `${material.name} x${requestedQuantity}`, inline: true }
        );

      if (expResult.leveledUp) {
        embed.addFields({ name: 'Level Up!', value: `Crafting level is now ${expResult.newLevel}!`, inline: false });
      }

      await interaction.reply({ embeds: [embed] });
    } else {
      const minTime = requestedQuantity * 1000;
      const maxTime = requestedQuantity * 3000;
      const totalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

      player.isSkilling = true;
      player.currentSkill = 'gathering';
      player.skillingEndTime = new Date(Date.now() + totalTime);
      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x32CD32)
        .setTitle('Gathering in Progress...')
        .setDescription(`You begin gathering **${requestedQuantity}x ${material.name}**...`)
        .addFields(
          { name: 'Expected Time', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true },
          { name: 'Target', value: `${material.name} x${requestedQuantity}`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        try {
          const updatedPlayer = await Player.findOne({ userId });
          if (!updatedPlayer) return;

          const totalExperience = material.experience * requestedQuantity;
          const expResult = addExperience(updatedPlayer.skills?.crafting?.experience || 0, totalExperience);
          if (updatedPlayer.skills?.crafting) {
            updatedPlayer.skills.crafting.experience = expResult.newExp;
          }

          const existingItem = updatedPlayer.inventory.find(item => item.itemId === material.id);
          if (existingItem) {
            existingItem.quantity += requestedQuantity;
          } else {
            updatedPlayer.inventory.push({ itemId: material.id, quantity: requestedQuantity });
          }

          updatedPlayer.isSkilling = false;
          updatedPlayer.currentSkill = null as any;
          updatedPlayer.skillingEndTime = null as any;
          await updatedPlayer.save();

          const completedEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Gathering Complete!')
            .setDescription(`You successfully gathered **${requestedQuantity}x ${material.name}**!`)
            .addFields(
              { name: 'Experience Gained', value: `${totalExperience} Crafting XP`, inline: true },
              { name: 'Materials Gathered', value: `${material.name} x${requestedQuantity}`, inline: true },
              { name: 'Time Taken', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true }
            );

          if (expResult.leveledUp) {
            completedEmbed.addFields({ name: 'Level Up!', value: `Crafting level is now ${expResult.newLevel}!`, inline: false });
          }

          try {
            await interaction.followUp({ embeds: [completedEmbed] });
          } catch (followUpError) {
            console.error('Error sending follow-up message:', followUpError);
            await interaction.channel?.send({ embeds: [completedEmbed] });
          }
        } catch (error) {
          console.error('Error completing gathering:', error);
          const errorPlayer = await Player.findOne({ userId });
          if (errorPlayer) {
            errorPlayer.isSkilling = false;
            errorPlayer.currentSkill = null as any;
            errorPlayer.skillingEndTime = null as any;
            await errorPlayer.save();
          }
          
          try {
            await interaction.editReply({
              content: 'An error occurred while completing gathering. Please try again.',
            });
          } catch (editError: any) {
            if (editError.code === 50027) {
              console.log('Gathering failed and interaction expired');
            } else {
              console.error('Error editing reply:', editError);
            }
          }
        }
      }, totalTime);
    }
  } catch (error) {
    console.error('Error gathering:', error);
    await interaction.reply({
      content: 'An error occurred while gathering. Please try again.',
      ephemeral: true
    });
  }
}