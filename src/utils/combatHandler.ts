import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Player } from '../models/Player';
import { Area } from '../models/Area';
import { Item } from '../models/Item';
import { calculateCombatStats, calculateDamage, calculateExperienceGained, generateLoot } from './combatUtils';
import { addExperience } from './experienceUtils';

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
    let monsterCurrentHp = monster.hp;
    let playerDamage = 0;
    let monsterDamage = 0;
    let combatEnded = false;
    let playerWon = false;

    switch (action) {
      case 'attack':
        const playerStats = await calculateCombatStats(player);
        playerDamage = calculateDamage(playerStats, monster.defense);
        monsterCurrentHp -= playerDamage;
        playerAction = playerDamage > 0 ? `You hit for ${playerDamage} damage!` : 'You missed!';
        
        // Consume ammunition for ranged attacks
        if (player.combatStats.attackStyle === 'range' && player.equipment.ammunition && playerDamage > 0) {
          const ammoItem = player.inventory.find(item => item.itemId === player.equipment.ammunition);
          if (ammoItem && ammoItem.quantity > 0) {
            ammoItem.quantity -= 1;
            if (ammoItem.quantity <= 0) {
              // Remove from inventory and unequip
              const filteredInventory = player.inventory.filter(item => item.itemId !== player.equipment.ammunition);
              player.inventory.splice(0, player.inventory.length, ...filteredInventory);
              player.equipment.ammunition = null as any;
              playerAction += ' (Last arrow used!)';
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
    }

    if (monsterCurrentHp <= 0) {
      combatEnded = true;
      playerWon = true;
    } else if (action !== 'eat') {
      const monsterAttack = { attack: monster.attack, defense: 0, accuracy: monster.attack + 5, maxHit: monster.attack };
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
      
      if (playerWon) {
        const combatStyle = player.combatStats.attackStyle || 'attack';
        const expGained = calculateExperienceGained(playerDamage, monster.level, combatStyle);
        
        // Give experience based on combat style
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
        
        // Always give a small amount of defense experience (unless already training defense)
        let defenseExpAmount = 0;
        if (player.skills?.defense && combatStyle !== 'defense') {
          defenseExpAmount = Math.floor(mainExpAmount / 3);
          const defenseResult = addExperience(player.skills.defense.experience, defenseExpAmount);
          player.skills.defense.experience = defenseResult.newExp;
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
          if (defenseExpAmount > 0) {
            experienceText += `\nDefense: +${defenseExpAmount}`;
          }
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
      await player.save();
      
      const embed = new EmbedBuilder()
        .setColor(0xFFFF00)
        .setTitle('Combat Continues!')
        .setDescription(resultText)
        .addFields(
          { name: 'Monster', value: `${monster.name}\nLevel: ${monster.level}\nHP: ${monsterCurrentHp}/${monster.hp}`, inline: true },
          { name: 'Your Stats', value: `HP: ${player.combatStats.currentHp}/${player.combatStats.maxHp}\nAttack Style: ${player.combatStats.attackStyle}`, inline: true }
        );

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('combat_attack')
            .setLabel('Attack')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('⚔️'),
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