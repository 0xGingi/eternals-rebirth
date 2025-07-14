# Discord Bot Setup Guide

This guide will help you create and configure your Discord bot for Eternals Rebirth.

## Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Enter name: "Eternals Rebirth" (or your preferred name)
4. Click "Create"

## Step 2: Create Bot User

1. In your application, go to the "Bot" section
2. Click "Add Bot" or "Create Bot User"
3. **Copy the Bot Token** - you'll need this for your `.env` file

## Step 3: Configure Bot Permissions

### Required Intents (Bot Tab):
- ✅ **Guilds** - Required for slash commands
- ❌ **Guild Messages** - Not needed (we only use slash commands)
- ❌ **Message Content** - Not needed
- ❌ **Guild Members** - Not needed
- ❌ **Guild Presences** - Not needed

### Bot Permissions:
In the "Bot" section, make sure these permissions are enabled:
- ✅ **Send Messages**
- ✅ **Use Slash Commands**
- ✅ **Embed Links**
- ✅ **Read Message History**

## Step 4: Get Application ID

1. Go to the "General Information" section
2. **Copy the Application ID** - this is your `CLIENT_ID`

## Step 5: Invite Bot to Server

### Option A: Use OAuth2 URL Generator
1. Go to "OAuth2" → "URL Generator"
2. Select Scopes:
   - ✅ **bot**
   - ✅ **applications.commands**
3. Select Bot Permissions:
   - ✅ **Send Messages**
   - ✅ **Use Slash Commands**
   - ✅ **Embed Links**
   - ✅ **Read Message History**
4. Copy the generated URL and open it in browser
5. Select your server and authorize

### Option B: Use Direct Invite Link
Replace `YOUR_CLIENT_ID` with your actual Application ID:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=414464658432&scope=bot%20applications.commands
```

## Step 6: Get Guild ID (Optional - for faster command registration)

1. Enable Developer Mode in Discord:
   - User Settings → Advanced → Developer Mode ✅
2. Right-click on your server name
3. Click "Copy Server ID"
4. This is your `GUILD_ID`

## Step 7: Configure Environment

Create your `.env` file with:

```env
DISCORD_TOKEN=your_bot_token_from_step_2
CLIENT_ID=your_application_id_from_step_4
GUILD_ID=your_guild_id_from_step_6
MONGO_ROOT_PASSWORD=your_secure_password
```

## Troubleshooting

### "Used disallowed intents" Error
- Make sure only "Guilds" intent is enabled in Discord Developer Portal
- Disable "Message Content Intent" and "Server Members Intent" if enabled

### Commands not appearing
- Check that `CLIENT_ID` is correct (Application ID, not Bot ID)
- Check that `GUILD_ID` is correct (right-click server → Copy Server ID)
- Make sure bot has "Use Slash Commands" permission

### Bot offline
- Check that `DISCORD_TOKEN` is correct and not expired
- Make sure bot is invited to the server with correct permissions

### "Missing Permissions" Error
- Re-invite bot with proper permissions using the OAuth2 URL
- Make sure bot role is above other roles it needs to interact with

## Security Notes

- **Never share your bot token** - treat it like a password
- Regenerate token if accidentally exposed
- Use environment variables, never hardcode credentials
- Consider using different bots for development and production

## Testing

Once configured, you should see:
1. Bot appears online in your Discord server
2. Slash commands available when typing `/`
3. Bot responds to `/help` command

If everything works, your Eternals Rebirth bot is ready to use! 🎮