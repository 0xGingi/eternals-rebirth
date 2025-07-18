import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { Item } from '../models/Item';
import { calculateCombatStats, calculateDamage, calculateExperienceGained, generateLoot } from './combatUtils';
import { addExperience } from './experienceUtils';
import { getAvailableSpells, canCastSpell, consumeRunes, calculateSpellDamage, getSpellExperience, calculateSpellAccuracy } from './spellUtils';

export async function handleCombatAction(interaction: any, action: string) {
  const userId = interaction.user.id;

  try {
    const player = await Player.findOne({ userId });
    
    if (!player || !player.inCombat || !player.currentMonster) {
      await interaction.reply({
        content: 'You are not in combat!',
        ephemeral: true
      });
      return;
    }

    const area = await Area.findOne({ id: player.currentArea });
    const monster = area?.monsters.find(m => m.id === player.currentMonster);
    
    if (!monster) {
      await interaction.reply({
        content: 'Monster not found!',
        ephemeral: true
      });
      return;
    }

    let playerAction = '';
    let monsterCurrentHp = player.currentMonsterHp || monster.hp;
    let playerDamage = 0;
    let monsterDamage = 0;
    let combatEnded = false;
    let playerWon = false;

    switch (action) {
      case 'attack':
        if (player.combatStats.attackStyle === 'magic') {
          await interaction.reply({
            content: 'You cannot use basic attacks in magic mode! Use spells instead.',
            ephemeral: true
          });
          return;
        }
        
        if (player.combatStats.attackStyle === 'range') {
          if (!player.equipment.ammunition.itemId || player.equipment.ammunition.quantity <= 0) {
            playerAction = 'You cannot attack without arrows! You need to equip arrows or change your combat style.';
            break;
          }
        }
        
        const playerStats = await calculateCombatStats(player);
        playerDamage = calculateDamage(playerStats, monster.defense);
        monsterCurrentHp -= playerDamage;
        playerAction = playerDamage > 0 ? `You hit for ${playerDamage} damage!` : 'You missed!';
        
        if (player.combatStats.attackStyle === 'range' && player.equipment.ammunition.itemId) {
          if (player.equipment.ammunition.quantity > 0) {
            player.equipment.ammunition.quantity -= 1;
            if (player.equipment.ammunition.quantity <= 0) {
              player.equipment.ammunition.itemId = null as any;
              player.equipment.ammunition.quantity = 0;
              playerAction += ' (Last arrow used!)';
            } else {
              playerAction += ` (${player.equipment.ammunition.quantity} arrows remaining)`;
            }
          }
        }
        break;

      case 'defend':
        playerAction = 'You defend, reducing incoming damage by 50%!';
        break;

      case 'eat':
        const food = player.inventory.find(item => item.itemId === 'bread' || item.itemId === 'cooked_shrimp' || item.itemId === 'cooked_trout');
        if (!food) {
          await interaction.reply({
            content: 'You have no food to eat!',
            ephemeral: true
          });
          return;
        }
        
        const foodItem = await Item.findOne({ id: food.itemId });
        if (foodItem) {
          const healAmount = Math.min(foodItem.healAmount, player.combatStats.maxHp - player.combatStats.currentHp);
          player.combatStats.currentHp += healAmount;
          food.quantity -= 1;
          if (food.quantity <= 0) {
            const filteredInventory = player.inventory.filter(item => item.itemId !== food.itemId);
            player.inventory.splice(0, player.inventory.length, ...filteredInventory);
          }
          playerAction = `You ate ${foodItem.name} and healed ${healAmount} HP!`;
        }
        break;

      case 'run':
        if (Math.random() < 0.8) {
          player.inCombat = false;
          player.currentMonster = null as any;
          player.currentMonsterHp = null as any;
          await player.save();
          
          const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Escaped!')
            .setDescription('You successfully ran away from combat!');
          
          await interaction.update({ embeds: [embed], components: [] });
          return;
        } else {
          playerAction = 'You failed to run away!';
        }
        break;

      case 'spell':
        if (player.combatStats.attackStyle !== 'magic') {
          await interaction.reply({
            content: 'You need to be in magic combat mode to cast spells! Use /style magic first.',
            ephemeral: true
          });
          return;
        }

        const equippedMagicWeapon = player.equipment.weapon && 
          await Item.findOne({ id: player.equipment.weapon, subType: 'magic' });
        
        if (!equippedMagicWeapon) {
          await interaction.reply({
            content: 'You need a magic weapon equipped to cast combat spells!',
            ephemeral: true
          });
          return;
        }

        const availableSpells = getAvailableSpells(player);
        const castableSpells = availableSpells.filter(spell => canCastSpell(player, spell.id).canCast);
        
        if (castableSpells.length === 0) {
          await interaction.reply({
            content: 'You don\'t have the runes to cast any spells! You need to craft or obtain runes first.',
            ephemeral: true
          });
          return;
        }

        const spellOptions = castableSpells.slice(0, 9).map(spell => {
          const runesList = Object.entries(spell.runes).map(([rune, amount]) => `${amount}x ${rune.replace('_', ' ')}`).join(', ');
          return new StringSelectMenuOptionBuilder()
            .setLabel(spell.name)
            .setDescription(`Level ${spell.levelRequired} - ${spell.maxDamage} max damage - Runes: ${runesList}`)
            .setValue(spell.id);
        });

        spellOptions.push(
          new StringSelectMenuOptionBuilder()
            .setLabel('Back to Combat')
            .setDescription('Return to main combat options')
            .setValue('back_to_combat')
        );

        const spellSelect = new StringSelectMenuBuilder()
          .setCustomId('combat_spell_select')
          .setPlaceholder('Choose a spell to cast')
          .addOptions(spellOptions);

        const spellRow = new ActionRowBuilder().addComponents(spellSelect);

        await interaction.update({
          embeds: [new EmbedBuilder()
            .setColor(0x9932CC)
            .setTitle('Choose a Spell')
            .setDescription('Select which spell to cast in combat:')],
          components: [spellRow]
        });
        return;

      case 'back_to_combat':
        break;

      default:
        if (action.startsWith('cast_')) {
          const spellId = action.replace('cast_', '');
          const spellCheck = canCastSpell(player, spellId);
          
          if (!spellCheck.canCast) {
            const embed = new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle('Cannot Cast Spell')
              .setDescription(spellCheck.reason)
              .addFields(
                { name: 'Options', value: '• Try another spell\n• Defend\n• Eat Food\n• Run Away', inline: false }
              );

            const buttons = [];

            // Add spell button to try other spells
            const availableSpells = getAvailableSpells(player);
            const castableSpells = availableSpells.filter(spell => canCastSpell(player, spell.id).canCast);
            const hasUsableSpells = castableSpells.length > 0;
            
            if (hasUsableSpells) {
              buttons.push(new ButtonBuilder()
                .setCustomId('combat_spell')
                .setLabel('Try Another Spell')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔮'));
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

            const row = new ActionRowBuilder().addComponents(buttons);
            await interaction.update({ embeds: [embed], components: [row] });
            return;
          }

          const playerStats = await calculateCombatStats(player);
          const spellAccuracy = calculateSpellAccuracy(spellId, playerStats.magic, monster.elementalWeakness || undefined);
          const hitRoll = Math.random() * 100;
          
          if (hitRoll <= spellAccuracy) {
            const spellResult = calculateSpellDamage(spellId, playerStats.magic, playerStats.magicBonus || 0, monster.elementalWeakness || undefined);
            playerDamage = spellResult.damage;
            monsterCurrentHp -= playerDamage;
            
            consumeRunes(player, spellId);
            
            const spellExp = getSpellExperience(spellId);
            if (player.skills?.magic) {
              const expResult = addExperience(player.skills.magic.experience, spellExp);
              player.skills.magic.experience = expResult.newExp;
            }

            let effectivenessText = '';
            if (spellResult.isEffective) {
              effectivenessText = ' **It\'s super effective!**';
            }

            playerAction = `You cast a spell dealing ${playerDamage} magic damage!${effectivenessText}`;
          } else {
            playerAction = 'Your spell missed!';
          }
        }
        break;
    }

    if (monsterCurrentHp <= 0) {
      combatEnded = true;
      playerWon = true;
    } else if (action !== 'eat') {
      const monsterAttack = { attack: monster.attack, defense: 0, accuracy: monster.attack + 5, maxHit: monster.attack, magic: 0, magicBonus: 0 };
      monsterDamage = calculateDamage(monsterAttack, await calculateCombatStats(player).then(s => s.defense));
      
      if (action === 'defend') {
        monsterDamage = Math.floor(monsterDamage * 0.5);
      }
      
      player.combatStats.currentHp -= monsterDamage;
      
      if (player.combatStats.currentHp <= 0) {
        combatEnded = true;
        playerWon = false;
      }
    }

    let resultText = playerAction;
    if (monsterDamage > 0) {
      resultText += `\n${monster.name} attacks for ${monsterDamage} damage!`;
    } else if (action !== 'eat' && action !== 'run') {
      resultText += `\n${monster.name} missed their attack!`;
    }

    if (combatEnded) {
      player.inCombat = false;
      player.currentMonster = null as any;
      player.currentMonsterHp = null as any;
      
      if (playerWon) {
        const combatStyle = player.combatStats.attackStyle || 'attack';
        const expGained = calculateExperienceGained(playerDamage, monster.level, combatStyle);
        
        let expResult;
        let skillName = '';
        let mainExpAmount = 0;
        
        if (expGained.attack && player.skills?.attack) {
          expResult = addExperience(player.skills.attack.experience, expGained.attack);
          player.skills.attack.experience = expResult.newExp;
          skillName = 'Attack';
          mainExpAmount = expGained.attack;
        } else if (expGained.strength && player.skills?.strength) {
          expResult = addExperience(player.skills.strength.experience, expGained.strength);
          player.skills.strength.experience = expResult.newExp;
          skillName = 'Strength';
          mainExpAmount = expGained.strength;
        } else if (expGained.defense && player.skills?.defense) {
          expResult = addExperience(player.skills.defense.experience, expGained.defense);
          player.skills.defense.experience = expResult.newExp;
          skillName = 'Defense';
          mainExpAmount = expGained.defense;
        } else if (expGained.magic && player.skills?.magic) {
          expResult = addExperience(player.skills.magic.experience, expGained.magic);
          player.skills.magic.experience = expResult.newExp;
          skillName = 'Magic';
          mainExpAmount = expGained.magic;
        } else if (expGained.range && player.skills?.range) {
          expResult = addExperience(player.skills.range.experience, expGained.range);
          player.skills.range.experience = expResult.newExp;
          skillName = 'Range';
          mainExpAmount = expGained.range;
        }
        
        
        const loot = generateLoot(monster.dropTable);
        for (const drop of loot) {
          const existingItem = player.inventory.find(item => item.itemId === drop.itemId);
          if (existingItem) {
            existingItem.quantity += drop.quantity;
          } else {
            player.inventory.push(drop);
          }
        }
        
        let experienceText = '';
        if (expResult && mainExpAmount > 0) {
          experienceText = `${skillName}: +${mainExpAmount}`;
          if (expResult.leveledUp) {
            experienceText += `\n🎉 ${skillName} leveled up to ${expResult.newLevel}!`;
          }
        } else {
          experienceText = 'No experience gained';
        }

        const embed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setTitle('Victory!')
          .setDescription(`You defeated the ${monster.name}!`)
          .addFields(
            { name: 'Loot', value: loot.length > 0 ? loot.map(l => `${l.itemId} x${l.quantity}`).join('\n') : 'No loot', inline: true },
            { name: 'Experience', value: experienceText, inline: true },
            { name: 'Combat Style', value: skillName || combatStyle, inline: true }
          );
        
        await player.save();
        await interaction.update({ embeds: [embed], components: [] });
      } else {
        player.combatStats.currentHp = player.combatStats.maxHp;
        await player.save();
        
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('Defeat!')
          .setDescription('You have been defeated! You respawn with full health.');
        
        await interaction.update({ embeds: [embed], components: [] });
      }
    } else {
      player.currentMonsterHp = monsterCurrentHp;
      await player.save();
      
      let monsterInfo = `${monster.name}\nLevel: ${monster.level}\nHP: ${monsterCurrentHp}/${monster.hp}`;
      if (monster.elementalWeakness) {
        const weaknessEmoji = {
          'fire': '🔥',
          'water': '💧', 
          'earth': '🌍',
          'air': '💨'
        };
        monsterInfo += `\nWeak to: ${weaknessEmoji[monster.elementalWeakness] || '⚡'} ${monster.elementalWeakness}`;
      }

      const embed = new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle('Combat Continues!')
        .setDescription(resultText)
        .addFields(
          { name: 'Monster', value: monsterInfo, inline: true },
          { name: 'Your Stats', value: `HP: ${player.combatStats.currentHp}/${player.combatStats.maxHp}\nAttack Style: ${player.combatStats.attackStyle}`, inline: true }
        );

      const buttons = [];

      // Add spell button if player is using magic and has a magic weapon
      if (player.combatStats.attackStyle === 'magic') {
        const hasMagicWeapon = player.equipment.weapon && 
          await Item.findOne({ id: player.equipment.weapon, subType: 'magic' });
        
        if (hasMagicWeapon) {
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

      await interaction.update({ embeds: [embed], components: [row] });
    }
  } catch (error) {
    console.error('Error handling combat action:', error);
    await interaction.reply({
      content: 'An error occurred during combat. Please try again.',
      ephemeral: true
    });
  }
}