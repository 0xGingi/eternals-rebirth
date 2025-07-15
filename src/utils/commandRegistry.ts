import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Bot } from '../bot';

export async function registerCommands(bot: Bot) {
  const commands = [];
  const commandsPath = join(__dirname, '../commands');
  
  try {
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      const command = await import(filePath);
      
      if ('data' in command && 'execute' in command) {
        bot.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands },
    );

    console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}