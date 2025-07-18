import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

const RUNE_RECIPES = [
  // Lumbridge - Basic elemental runes
  { id: 'air_rune', name: 'Air Rune', levelRequired: 1, experience: 5, talisman: 'air_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'lumbridge' },
  { id: 'earth_rune', name: 'Earth Rune', levelRequired: 1, experience: 5, talisman: 'earth_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'lumbridge' },
  { id: 'mind_rune', name: 'Mind Rune', levelRequired: 2, experience: 6, talisman: 'mind_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'lumbridge' },
  
  // Varrock - Intermediate elemental runes
  { id: 'water_rune', name: 'Water Rune', levelRequired: 5, experience: 6, talisman: 'water_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'varrock' },
  { id: 'fire_rune', name: 'Fire Rune', levelRequired: 9, experience: 7, talisman: 'fire_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'varrock' },
  { id: 'body_rune', name: 'Body Rune', levelRequired: 20, experience: 8, talisman: 'body_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'varrock' },
  
  // Falador - Advanced runes  
  { id: 'cosmic_rune', name: 'Cosmic Rune', levelRequired: 27, experience: 10, talisman: 'cosmic_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'falador' },
  { id: 'chaos_rune', name: 'Chaos Rune', levelRequired: 35, experience: 12, talisman: 'chaos_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'falador' },
  
  // Catherby - Nature-based runes
  { id: 'nature_rune', name: 'Nature Rune', levelRequired: 44, experience: 15, talisman: 'nature_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'catherby' },
  
  // Ardougne - Law runes
  { id: 'law_rune', name: 'Law Rune', levelRequired: 54, experience: 18, talisman: 'law_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'ardougne' },
  
  // Dragon Isle - Death runes
  { id: 'death_rune', name: 'Death Rune', levelRequired: 65, experience: 22, talisman: 'death_talisman', essenceRequired: 1, runesPerEssence: 1, area: 'dragon_isle' },
  
  // Barrows Crypts - Blood runes
  { id: 'blood_rune', name: 'Blood Rune', levelRequired: 77, experience: 30, talisman: 'blood_talisman', essenceRequired: 2, runesPerEssence: 1, area: 'barrows_crypts' },
  
  // Primal Realm - Soul runes
  { id: 'soul_rune', name: 'Soul Rune', levelRequired: 90, experience: 40, talisman: 'soul_talisman', essenceRequired: 3, runesPerEssence: 1, area: 'primal_realm' }
];

export const data = new SlashCommandBuilder()
  .setName('runecraft')
  .setDescription('Craft runes using rune essence')
  .addStringOption(option =>
    option.setName('rune')
      .setDescription('The rune to craft')
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addIntegerOption(option =>
    option.setName('quantity')
      .setDescription('How many runes to craft (default: 1)')
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

    const runecraftingLevel = calculateLevelFromExperience(player.skills?.runecrafting?.experience || 0);
    
    const availableRunes = RUNE_RECIPES
      .filter(recipe => {
        const name = `${recipe.name} (Level ${recipe.levelRequired})`;
        return name.toLowerCase().includes(focusedValue.toLowerCase()) && 
               runecraftingLevel >= recipe.levelRequired &&
               recipe.area === player.currentArea;
      })
      .map(recipe => ({
        name: `${recipe.name} (Level ${recipe.levelRequired}) - ${recipe.experience} XP`,
        value: recipe.id
      }));

    await interaction.respond(availableRunes.slice(0, 25));
  } catch (error) {
    console.error('Error in runecraft autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const runeName = interaction.options.getString('rune');
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
        content: 'You cannot runecraft while in combat!',
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

    let recipe;
    if (runeName) {
      recipe = RUNE_RECIPES.find(r => 
        r.name.toLowerCase().includes(runeName.toLowerCase()) || 
        r.id.toLowerCase() === runeName.toLowerCase()
      );
      if (!recipe) {
        await interaction.reply({
          content: 'That rune recipe is not available!',
          ephemeral: true
        });
        return;
      }
    } else {
      const runecraftingLevel = calculateLevelFromExperience(player.skills?.runecrafting?.experience || 0);
      recipe = RUNE_RECIPES.filter(r => runecraftingLevel >= r.levelRequired && r.area === player.currentArea)[0];
    }

    // Check if recipe is available in current area
    if (recipe && recipe.area !== player.currentArea) {
      await interaction.reply({
        content: `You cannot craft ${recipe.name} in ${player.currentArea}. This rune can only be crafted in ${recipe.area}.`,
        ephemeral: true
      });
      return;
    }

    if (!recipe) {
      await interaction.reply({
        content: 'No rune recipes available at your level!',
        ephemeral: true
      });
      return;
    }

    const runecraftingLevel = calculateLevelFromExperience(player.skills?.runecrafting?.experience || 0);
    
    if (runecraftingLevel < recipe.levelRequired) {
      await interaction.reply({
        content: `You need runecrafting level ${recipe.levelRequired} to craft ${recipe.name}!`,
        ephemeral: true
      });
      return;
    }

    const hasTalisman = player.inventory.find(item => item.itemId === recipe.talisman);
    if (!hasTalisman) {
      await interaction.reply({
        content: `You need a ${recipe.talisman.replace('_', ' ')} to craft ${recipe.name}!`,
        ephemeral: true
      });
      return;
    }

    const essenceRequired = recipe.essenceRequired * quantity;
    const runeEssence = player.inventory.find(item => item.itemId === 'rune_essence');
    
    if (!runeEssence || runeEssence.quantity < essenceRequired) {
      await interaction.reply({
        content: `You need ${essenceRequired} rune essence to craft ${quantity}x ${recipe.name}! You have ${runeEssence?.quantity || 0}.`,
        ephemeral: true
      });
      return;
    }

    if (quantity === 1) {
      const expResult = addExperience(player.skills?.runecrafting?.experience || 0, recipe.experience);
      if (player.skills?.runecrafting) {
        player.skills.runecrafting.experience = expResult.newExp;
      }

      runeEssence.quantity -= recipe.essenceRequired;
      if (runeEssence.quantity <= 0) {
        player.inventory.splice(player.inventory.findIndex(item => item.itemId === 'rune_essence'), 1);
      }

      const runesCreated = recipe.runesPerEssence;
      const existingRune = player.inventory.find(item => item.itemId === recipe.id);
      if (existingRune) {
        existingRune.quantity += runesCreated;
      } else {
        player.inventory.push({ itemId: recipe.id, quantity: runesCreated });
      }

      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x9932CC)
        .setTitle('🔮 Runecrafting Success!')
        .setDescription(`You successfully crafted **${recipe.name}**!`)
        .addFields(
          { name: 'Experience Gained', value: `${recipe.experience} Runecrafting XP`, inline: true },
          { name: 'Runes Created', value: `${recipe.name} x${runesCreated}`, inline: true },
          { name: 'Essence Used', value: `Rune Essence x${recipe.essenceRequired}`, inline: true }
        );

      if (expResult.leveledUp) {
        embed.addFields({ name: 'Level Up!', value: `Runecrafting level is now ${expResult.newLevel}!`, inline: false });
      }

      await interaction.reply({ embeds: [embed] });
    } else {
      const minTime = quantity * 4000;
      const maxTime = quantity * 12000;
      const totalTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

      player.isSkilling = true;
      player.currentSkill = 'runecrafting';
      player.skillingEndTime = new Date(Date.now() + totalTime);
      await player.save();

      const embed = new EmbedBuilder()
        .setColor(0x9932CC)
        .setTitle('🔮 Runecrafting in Progress...')
        .setDescription(`You begin crafting **${quantity}x ${recipe.name}**...`)
        .addFields(
          { name: 'Expected Time', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true },
          { name: 'Target', value: `${recipe.name} x${quantity}`, inline: true },
          { name: 'Essence Required', value: `${essenceRequired}`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        try {
          const updatedPlayer = await Player.findOne({ userId });
          if (!updatedPlayer) return;

          const totalExperience = recipe.experience * quantity;
          const expResult = addExperience(updatedPlayer.skills?.runecrafting?.experience || 0, totalExperience);
          if (updatedPlayer.skills?.runecrafting) {
            updatedPlayer.skills.runecrafting.experience = expResult.newExp;
          }

          const updatedEssence = updatedPlayer.inventory.find(item => item.itemId === 'rune_essence');
          if (updatedEssence) {
            updatedEssence.quantity -= essenceRequired;
            if (updatedEssence.quantity <= 0) {
              updatedPlayer.inventory.splice(updatedPlayer.inventory.findIndex(item => item.itemId === 'rune_essence'), 1);
            }
          }

          const totalRunesCreated = recipe.runesPerEssence * quantity;
          const existingRune = updatedPlayer.inventory.find(item => item.itemId === recipe.id);
          if (existingRune) {
            existingRune.quantity += totalRunesCreated;
          } else {
            updatedPlayer.inventory.push({ itemId: recipe.id, quantity: totalRunesCreated });
          }

          updatedPlayer.isSkilling = false;
          updatedPlayer.currentSkill = null as any;
          updatedPlayer.skillingEndTime = null as any;
          await updatedPlayer.save();

          const completedEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🔮 Runecrafting Complete!')
            .setDescription(`You successfully crafted **${quantity}x ${recipe.name}**!`)
            .addFields(
              { name: 'Experience Gained', value: `${totalExperience} Runecrafting XP`, inline: true },
              { name: 'Runes Created', value: `${recipe.name} x${totalRunesCreated}`, inline: true },
              { name: 'Time Taken', value: `${Math.floor(totalTime / 1000)} seconds`, inline: true }
            );

          if (expResult.leveledUp) {
            completedEmbed.addFields({ name: 'Level Up!', value: `Runecrafting level is now ${expResult.newLevel}!`, inline: false });
          }

          try {
            await interaction.followUp({ embeds: [completedEmbed] });
          } catch (followUpError) {
            console.error('Error sending follow-up message:', followUpError);
            await interaction.channel?.send({ embeds: [completedEmbed] });
          }
        } catch (error) {
          console.error('Error completing runecrafting:', error);
          const errorPlayer = await Player.findOne({ userId });
          if (errorPlayer) {
            errorPlayer.isSkilling = false;
            errorPlayer.currentSkill = null as any;
            errorPlayer.skillingEndTime = null as any;
            await errorPlayer.save();
          }
          
          try {
            await interaction.editReply({
              content: 'An error occurred while completing runecrafting. Please try again.',
            });
          } catch (editError: any) {
            if (editError.code === 50027) {
              console.log('Runecrafting failed and interaction expired');
            } else {
              console.error('Error editing reply:', editError);
            }
          }
        }
      }, totalTime);
    }
  } catch (error) {
    console.error('Error runecrafting:', error);
    await interaction.reply({
      content: 'An error occurred while runecrafting. Please try again.',
      ephemeral: true
    });
  }
}