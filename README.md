# Eternals Rebirth - Discord MMORPG Bot

A Discord MMORPG bot, the successor to Eternals Online

## Features

### 🎮 Core Systems
- **Player Registration & Stats** - Create characters and track progression
- **Experience System** - Level skills from 1-99 like RuneScape
- **Turn-based Combat** - Fight monsters with interactive buttons
- **Area Travel** - Explore different zones with unique content

### ⚔️ Combat System
- Interactive button-based combat
- Attack, Defend, Eat Food, Run Away actions
- Experience rewards based on damage dealt
- Monster loot drops with percentage chances

### 🔨 Skills (1-99 Progression)
- **Attack** - Melee combat effectiveness
- **Strength** - Melee damage bonus
- **Defense** - Damage reduction
- **Magic** - Magical combat with staffs
- **Range** - Ranged combat with bows and arrows
- **Fishing** - Catch fish for cooking
- **Cooking** - Cook food for healing
- **Mining** - Mine ores for smithing
- **Smithing** - Smelt ores and create weapons/tools/arrow heads
- **Woodcutting** - Cut trees to obtain logs
- **Fletching** - Create arrow shafts and bows from logs
- **Crafting** - Combine materials to make arrows, bows, and staffs

### 🏞️ Areas
- **Lumbridge** - Starting area (Level 1+)
- **Varrock** - Mid-level area (Level 10+)
- **Falador** - High-level area (Level 25+)

### 🎒 Items & Equipment
- **Weapons** - Swords (melee), Bows (ranged), Staffs (magic), Arrows (ammunition)
- **Tools** - Pickaxes (mining), Fishing Rods (fishing), Axes (woodcutting)
- **Food** - Bread, Cooked Fish for healing
- **Resources** - Ores, Raw Fish, Logs, Arrow Components
- **Materials** - Bronze/Iron/Mithril in various tiers

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Discord Bot Token and Application ID (see [DISCORD_SETUP.md](DISCORD_SETUP.md))

### Setup Steps

1. **Clone and Navigate**
   ```bash
   git clone https://github.com/0xgingi/eternals-rebirth
   cd eternals-rebirth
   ```

2. **Run Setup Script**
   ```bash
   ./scripts/setup.sh
   ```

3. **Configure Environment**
   Edit `.env` file with your credentials:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_guild_id_here
   MONGO_ROOT_PASSWORD=your_secure_password_here
   ```

4. **Start Services**
   ```bash
   docker-compose up -d
   ```

## Commands

### Basic Commands
- `/register` - Register your character
- `/stats` - View your character stats
- `/help` - Show all available commands

### World Commands
- `/travel <destination>` - Travel to different areas
- `/area` - View current area info

### Inventory Commands
- `/inventory` - View your inventory
- `/equipment` - View equipped items
- `/equip <item>` - Equip weapons/tools
- `/eat <food>` - Eat food to restore health

### Combat Commands
- `/fight [monster]` - Start combat with monsters
- `/style <combat_style>` - Change combat style (attack/strength/defense/magic/range)
- Use interactive buttons during combat

### Skilling Commands
- `/mine [ore]` - Mine ores (requires pickaxe)
- `/fish [fish]` - Catch fish (requires fishing rod)
- `/woodcut [tree]` - Cut trees (requires axe)
- `/smith <smelt/smith> <item>` - Smelt ores or create weapons/tools/arrow heads
- `/fletch <item>` - Create arrow shafts and bows from logs
- `/craft <item>` - Craft arrows, bows, and staffs from materials
- `/cook <item>` - Cook raw fish into food