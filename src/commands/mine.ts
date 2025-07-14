import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { Item } from '../models/Item';
import { calculateLevelFromExperience, addExperience } from '../utils/experienceUtils';

export const data = new SlashCommandBuilder()
  .setName('mine')
  .setDescription('Mine ores in your current area')
  .addStringOption(option =>
    option.setName('ore')
      .setDescription('The ore to mine (leave empty for first available)')
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

    const hasPickaxe = player.equipment.weapon && 
      await Item.findOne({ id: player.equipment.weapon, subType: 'pickaxe' });
    
    if (!hasPickaxe) {
      await interaction.reply({
        content: 'You need a pickaxe equipped to mine!',
        ephemeral: true
      });
      return;
    }

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
  } catch (error) {
    console.error('Error mining:', error);
    await interaction.reply({
      content: 'An error occurred while mining. Please try again.',
      ephemeral: true
    });
  }
}