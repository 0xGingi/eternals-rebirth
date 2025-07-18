import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { connectDatabase, resetSkillingStatus } from './config/database';
import { registerCommands } from './utils/commandRegistry';
import { initializeAreas } from './data/areas';
import { initializeItems } from './data/items';
import { handleCombatAction } from './utils/combatHandler';

dotenv.config();

export interface Command {
  data: any;
  execute: (interaction: any) => Promise<void>;
}

export class Bot {
  public client: Client;
  public commands: Collection<string, Command>;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
      ],
    });

    this.commands = new Collection();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.once('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isChatInputCommand()) {
        const command = this.commands.get(interaction.commandName);

        if (!command) {
          console.error(`No command matching ${interaction.commandName} was found.`);
          return;
        }

        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
              content: 'There was an error while executing this command!',
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: 'There was an error while executing this command!',
              ephemeral: true,
            });
          }
        }
      } else if (interaction.isAutocomplete()) {
        const command = this.commands.get(interaction.commandName);
        if (!command) return;

        try {
          if ('autocomplete' in command) {
            await (command as any).autocomplete(interaction);
          }
        } catch (error) {
          console.error('Error handling autocomplete:', error);
        }
      } else if (interaction.isButton()) {
        if (interaction.customId.startsWith('combat_')) {
          const action = interaction.customId.replace('combat_', '');
          await handleCombatAction(interaction, action);
        } else if (interaction.customId.startsWith('help_')) {
          const helpCommand = this.commands.get('help');
          if (helpCommand && 'handleButton' in helpCommand) {
            await (helpCommand as any).handleButton(interaction);
          }
        } else if (interaction.customId.startsWith('list_')) {
          const listCommand = this.commands.get('list');
          if (listCommand && 'handleButton' in listCommand) {
            await (listCommand as any).handleButton(interaction);
          }
        } else if (interaction.customId.startsWith('inventory_')) {
          const inventoryCommand = this.commands.get('inventory');
          if (inventoryCommand && 'handleButton' in inventoryCommand) {
            await (inventoryCommand as any).handleButton(interaction);
          }
        }
      } else if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'combat_spell_select') {
          const selectedSpell = interaction.values[0];
          if (selectedSpell === 'back_to_combat') {
            await handleCombatAction(interaction, 'back_to_combat');
          } else {
            await handleCombatAction(interaction, `cast_${selectedSpell}`);
          }
        }
      }
    });
  }

  public async start() {
    await connectDatabase();
    await resetSkillingStatus();
    await initializeAreas();
    await initializeItems();
    await registerCommands(this);
    await this.client.login(process.env.DISCORD_TOKEN);
  }
}

const bot = new Bot();
bot.start();