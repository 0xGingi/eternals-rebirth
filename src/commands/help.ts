import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('View all available commands');

export async function execute(interaction: any) {
  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('Eternals Rebirth - Commands')
    .setDescription('Here are all the available commands:')
    .addFields(
      { name: 'Basic Commands', value: '`/register` - Register your character\n`/stats` - View your stats\n`/help` - Show this help menu', inline: false },
      { name: 'World Commands', value: '`/travel <destination>` - Travel to different areas\n`/area` - View current area monsters & resources', inline: false },
      { name: 'Inventory Commands', value: '`/inventory` - View your inventory\n`/equipment` - View equipped items\n`/equip <item>` - Equip weapons/tools\n`/unequip <slot>` - Unequip from equipment slot\n`/eat <food>` - Eat food to restore health', inline: false },
      { name: 'Combat Commands', value: '`/fight` - Start combat with monsters\n`/style <combat_style>` - Change combat style\n*In combat, use buttons to:*\n• Attack - Deal damage to monster\n• Defend - Reduce incoming damage\n• Eat Food - Heal during combat\n• Run Away - Attempt to escape', inline: false },
      { name: 'Skilling Commands', value: '`/mine [ore]` - Mine ores (requires pickaxe)\n`/fish [fish]` - Catch fish (requires fishing rod)\n`/woodcut [tree]` - Cut trees (requires axe)\n`/smith <smelt/smith> <item>` - Smelt ores or smith items\n`/fletch <item>` - Fletch logs into arrow shafts and bows\n`/craft <item>` - Craft arrows, bows, and staffs\n`/cook <item>` - Cook raw fish into food', inline: false }
    )
    .setFooter({ text: 'Eternals Rebirth - Discord MMORPG' });

  await interaction.reply({ embeds: [embed] });
}