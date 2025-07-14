import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Player } from '../models/Player';

export const data = new SlashCommandBuilder()
  .setName('register')
  .setDescription('Register your character in Eternals Rebirth');

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const username = interaction.user.username;

  try {
    const existingPlayer = await Player.findOne({ userId });
    
    if (existingPlayer) {
      await interaction.reply({
        content: 'You are already registered! Use `/stats` to view your character.',
        ephemeral: true
      });
      return;
    }

    const newPlayer = new Player({
      userId,
      username,
      currentArea: 'lumbridge',
      inventory: [
        { itemId: 'bronze_sword', quantity: 1 },
        { itemId: 'bronze_pickaxe', quantity: 1 },
        { itemId: 'bronze_axe', quantity: 1 },
        { itemId: 'fishing_rod', quantity: 1 },
        { itemId: 'bread', quantity: 5 }
      ]
    });

    await newPlayer.save();

    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('Welcome to Eternals Rebirth!')
      .setDescription(`${username}, your adventure begins in Lumbridge!`)
      .addFields(
        { name: 'Starting Equipment', value: 'Bronze Sword\nBronze Pickaxe\nBronze Axe\nFishing Rod\n5x Bread', inline: true },
        { name: 'Current Area', value: 'Lumbridge', inline: true },
        { name: 'Skills', value: 'All skills start at level 1', inline: true }
      )
      .setFooter({ text: 'Use /help to see available commands' });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error registering player:', error);
    await interaction.reply({
      content: 'An error occurred while registering your character. Please try again.',
      ephemeral: true
    });
  }
}