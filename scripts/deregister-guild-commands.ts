import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!CLIENT_ID || !DISCORD_TOKEN) {
  console.error('Missing CLIENT_ID or DISCORD_TOKEN in environment variables');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

async function deregisterGuildCommands() {
  try {
    console.log('Fetching all guilds...');
    
    const guilds = await rest.get(Routes.userGuilds()) as any[];
    
    if (guilds.length === 0) {
      console.log('No guilds found. Bot is not in any guilds.');
      return;
    }

    console.log(`Found ${guilds.length} guild(s). Deregistering guild commands...`);

    let totalDeregistered = 0;

    for (const guild of guilds) {
      try {
        console.log(`Processing guild: ${guild.name} (${guild.id})`);
        
        const guildCommands = await rest.get(Routes.applicationGuildCommands(CLIENT_ID!, guild.id)) as any[];
        
        if (guildCommands.length === 0) {
          console.log(`  No guild commands found in ${guild.name}`);
          continue;
        }

        console.log(`  Found ${guildCommands.length} guild command(s) in ${guild.name}`);
        
        guildCommands.forEach((cmd: any) => {
          console.log(`    - ${cmd.name} (ID: ${cmd.id || 'unknown'})`);
        });

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, guild.id), { body: [] });
        
        console.log(`  Successfully deregistered ${guildCommands.length} command(s) from ${guild.name}`);
        totalDeregistered += guildCommands.length;
        
      } catch (error) {
        console.error(`  Error processing guild ${guild.name}:`, error);
      }
    }

    console.log(`\nDeregistration complete!`);
    console.log(`Total commands deregistered: ${totalDeregistered}`);
    
    console.log('\nChecking global commands (these remain active)...');
    const globalCommands = await rest.get(Routes.applicationCommands(CLIENT_ID!)) as any[];
    
    if (globalCommands.length === 0) {
      console.log('  No global commands found');
    } else {
      console.log(`  ${globalCommands.length} global command(s) remain active:`);
      globalCommands.forEach((cmd: any) => {
        console.log(`    - ${cmd.name} (ID: ${cmd.id || 'unknown'})`);
      });
    }

  } catch (error) {
    console.error('Error during deregistration:', error);
    process.exit(1);
  }
}

async function deregisterSpecificGuild(guildId: string) {
  try {
    console.log(`Processing specific guild: ${guildId}`);
    
    const guildCommands = await rest.get(Routes.applicationGuildCommands(CLIENT_ID!, guildId)) as any[];
    
    if (guildCommands.length === 0) {
      console.log(`No guild commands found in guild ${guildId}`);
      return;
    }

    console.log(`Found ${guildCommands?.length || 0} guild command(s):`);
    
    guildCommands.forEach((cmd: any) => {
      console.log(`  - ${cmd.name} (ID: ${cmd.id || 'unknown'})`);
    });

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, guildId), { body: [] });
    
    console.log(`Successfully deregistered ${guildCommands.length} command(s) from guild ${guildId}`);
    
  } catch (error) {
    console.error(`Error processing guild ${guildId}:`, error);
    process.exit(1);
  }
}

async function main() {
  console.log('Starting guild command deregistration...');
  console.log('This script will remove all guild-specific commands while keeping global commands intact.\n');
  
  if (GUILD_ID) {
    console.log(`Targeting specific guild: ${GUILD_ID}`);
    await deregisterSpecificGuild(GUILD_ID);
  } else {
    console.log('Targeting all guilds the bot is in');
    await deregisterGuildCommands();
  }
  
  console.log('\nProcess completed successfully!');
  console.log('Your global commands should now be working without duplicates.');
}

main().catch(console.error);