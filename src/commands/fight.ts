import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { Item } from '../models/Item';
import { checkRangedCombatRequirements } from '../utils/combatUtils';

export const data = new SlashCommandBuilder()
  .setName('fight')
  .setDescription('Start a fight with a monster')
  .addStringOption(option =>
    option.setName('monster')
      .setDescription('The monster to fight (leave empty for random)')
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

    const availableMonsters = area.monsters
      .filter(monster => {
        const name = `${monster.name} (Level ${monster.level})`;
        return name.toLowerCase().includes(focusedValue.toLowerCase());
      })
      .map(monster => ({
        name: `${monster.name} (Level ${monster.level}) - ${monster.experience} XP`,
        value: monster.name.toLowerCase()
      }));

    await interaction.respond(availableMonsters.slice(0, 25));
  } catch (error) {
    console.error('Error in fight autocomplete:', error);
    await interaction.respond([]);
  }
}

export async function execute(interaction: any) {
  const userId = interaction.user.id;
  const monsterName = interaction.options.getString('monster');

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
        content: 'You are already in combat!',
        ephemeral: true
      });
      return;
    }

    const area = await Area.findOne({ id: player.currentArea });
    
    if (!area || area.monsters.length === 0) {
      await interaction.reply({
        content: 'There are no monsters to fight in this area!',
        ephemeral: true
      });
      return;
    }

    let monster;
    if (monsterName) {
      monster = area.monsters.find(m => m.name.toLowerCase().includes(monsterName.toLowerCase()));
      if (!monster) {
        await interaction.reply({
          content: 'Monster not found in this area!',
          ephemeral: true
        });
        return;
      }
    } else {
      monster = area.monsters[Math.floor(Math.random() * area.monsters.length)];
    }

    if (!monster) {
      await interaction.reply({
        content: 'No monster selected!',
        ephemeral: true
      });
      return;
    }

    // Check ranged combat requirements
    const combatCheck = await checkRangedCombatRequirements(player);
    if (!combatCheck.valid) {
      await interaction.reply({
        content: combatCheck.message,
        ephemeral: true
      });
      return;
    }

    player.inCombat = true;
    player.currentMonster = monster.id;
    player.currentMonsterHp = monster.hp; // Initialize monster's current HP
    await player.save();

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('Combat Started!')
      .setDescription(`You encounter a **${monster.name}**!`)
      .addFields(
        { name: 'Monster', value: `${monster.name}\nLevel: ${monster.level}\nHP: ${monster.hp}/${monster.hp}`, inline: true },
        { name: 'Your Stats', value: `HP: ${player.combatStats.currentHp}/${player.combatStats.maxHp}\nAttack Style: ${player.combatStats.attackStyle}`, inline: true }
      )
      .setFooter({ text: 'Choose your action!' });

    const buttons = [];

    // Add spell button if player is using magic and has a magic weapon
    if (player.combatStats.attackStyle === 'magic') {
      const hasMagicWeapon = player.equipment.weapon && 
        await Item.findOne({ id: player.equipment.weapon, subType: 'magic' });
      
      if (hasMagicWeapon) {
        const { getAvailableSpells, canCastSpell } = await import('../utils/spellUtils');
        const availableSpells = getAvailableSpells(player);
        const castableSpells = availableSpells.filter(spell => canCastSpell(player, spell.id).canCast);
        const hasUsableSpells = castableSpells.length > 0;
        
        buttons.push(new ButtonBuilder()
          .setCustomId('combat_spell')
          .setLabel(hasUsableSpells ? 'Cast Spell' : 'Cast Spell (No Runes)')
          .setStyle(hasUsableSpells ? ButtonStyle.Primary : ButtonStyle.Secondary)
          .setEmoji(hasUsableSpells ? '🔮' : '❌'));
      }
    } else {
      // Add basic attack button for non-magic combat styles
      buttons.push(new ButtonBuilder()
        .setCustomId('combat_attack')
        .setLabel('Attack')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('⚔️'));
    }

    // Add common combat buttons
    buttons.push(
      new ButtonBuilder()
        .setCustomId('combat_defend')
        .setLabel('Defend')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🛡️'),
      new ButtonBuilder()
        .setCustomId('combat_eat')
        .setLabel('Eat Food')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🍞'),
      new ButtonBuilder()
        .setCustomId('combat_run')
        .setLabel('Run Away')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🏃')
    );

    const row = new ActionRowBuilder().addComponents(buttons.slice(0, 5));

    await interaction.reply({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error('Error starting fight:', error);
    await interaction.reply({
      content: 'An error occurred while starting the fight. Please try again.',
      ephemeral: true
    });
  }
}