import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

export const data = new SlashCommandBuilder()
  .setName('style')
  .setDescription('Change your combat style to train different skills')
  .addStringOption(option =>
    option.setName('combat_style')
      .setDescription('The combat style to use')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function autocomplete(interaction: any) {
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    if (!player) {
      await interaction.respond([]);
      return;
    }

    let availableStyles: { name: string; value: string }[] = [];

    if (player.equipment.weapon) {
      const weapon = await Item.findOne({ id: player.equipment.weapon });
      if (weapon) {
        if (weapon.subType === 'melee') {
          availableStyles = [
            { name: 'Attack - Trains Attack skill', value: 'attack' },
            { name: 'Strength - Trains Strength skill', value: 'strength' },
            { name: 'Defense - Trains Defense skill', value: 'defense' }
          ];
        } else if (weapon.subType === 'magic') {
          availableStyles = [
            { name: 'Magic - Trains Magic skill', value: 'magic' },
            { name: 'Defense - Trains Defense skill', value: 'defense' }
          ];
        } else if (weapon.subType === 'ranged') {
          availableStyles = [
            { name: 'Range - Trains Range skill', value: 'range' },
            { name: 'Defense - Trains Defense skill', value: 'defense' }
          ];
        }
      }
    }

    if (availableStyles.length === 0) {
      availableStyles = [
        { name: 'Defense - Trains Defense skill (unarmed)', value: 'defense' }
      ];
    }

    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filteredStyles = availableStyles.filter(style => 
      style.name.toLowerCase().includes(focusedValue)
    );

    await interaction.respond(filteredStyles);
  } catch (error) {
    console.error('Error in style autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const newStyle = interaction.options.getString('combat_style');

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
        content: 'You cannot change combat style while in combat!',
        ephemeral: true
      });
      return;
    }

    // Validate combat style based on equipped weapon
    let validStyles = ['defense']; // Defense is always available
    let weaponType = 'unarmed';

    if (player.equipment.weapon) {
      const weapon = await Item.findOne({ id: player.equipment.weapon });
      if (weapon) {
        weaponType = weapon.subType;
        if (weapon.subType === 'melee') {
          validStyles = ['attack', 'strength', 'defense'];
        } else if (weapon.subType === 'magic') {
          validStyles = ['magic', 'defense'];
        } else if (weapon.subType === 'ranged') {
          validStyles = ['range', 'defense'];
        }
      }
    }

    if (!validStyles.includes(newStyle!)) {
      const validStyleText = validStyles.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
      await interaction.reply({
        content: `Invalid combat style for your current weapon! Valid styles: ${validStyleText}`,
        ephemeral: true
      });
      return;
    }

    // Update combat style
    const oldStyle = player.combatStats.attackStyle;
    
    // Save last melee style when switching between melee styles
    if (['attack', 'strength', 'defense'].includes(oldStyle) && ['attack', 'strength', 'defense'].includes(newStyle!)) {
      player.combatStats.lastMeleeStyle = newStyle!;
    }
    
    player.combatStats.attackStyle = newStyle!;
    await player.save();

    // Get weapon info for display
    let weaponInfo = 'Unarmed';
    if (player.equipment.weapon) {
      const weapon = await Item.findOne({ id: player.equipment.weapon });
      if (weapon) {
        weaponInfo = `${weapon.name} (${weapon.subType})`;
      }
    }

    // Create style description
    let styleDescription = '';
    switch (newStyle) {
      case 'attack':
        styleDescription = 'Focuses on hitting accurately and training Attack skill';
        break;
      case 'strength':
        styleDescription = 'Focuses on dealing maximum damage and training Strength skill';
        break;
      case 'defense':
        styleDescription = 'Focuses on defensive combat and training Defense skill';
        break;
      case 'magic':
        styleDescription = 'Focuses on magical combat and training Magic skill';
        break;
      case 'range':
        styleDescription = 'Focuses on ranged combat and training Range skill';
        break;
    }

    const embed = new EmbedBuilder()
      .setColor(0x9932CC)
      .setTitle('⚔️ Combat Style Changed!')
      .setDescription(`Your combat style has been updated`)
      .addFields(
        { name: 'Previous Style', value: oldStyle.charAt(0).toUpperCase() + oldStyle.slice(1), inline: true },
        { name: 'New Style', value: newStyle!.charAt(0).toUpperCase() + newStyle!.slice(1), inline: true },
        { name: 'Weapon', value: weaponInfo, inline: true },
        { name: 'Effect', value: styleDescription, inline: false },
        { name: 'Note', value: 'Experience gained in combat will now go to this skill', inline: false }
      );

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error changing combat style:', error);
    await interaction.reply({
      content: 'An error occurred while changing combat style. Please try again.',
      ephemeral: true
    });
  }
}