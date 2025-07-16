# Eternals Rebirth - Discord MMORPG Bot

A Discord MMORPG bot, the successor to Eternals Online, Inspired by runescape

## Features

### Core Systems
- **Player Registration & Stats** - Create characters and track progression with visual progress bars
- **Experience System** - Level skills from 1-99 like RuneScape with XP requirements
- **Turn-based Combat** - Fight monsters with interactive Discord buttons
- **Area Travel** - Explore 8 different zones with unique content and level requirements
- **Inventory Management** - Full inventory system with pagination support
- **Equipment System** - Equip weapons, armor, and tools in dedicated slots
- **Magic System** - Cast spells including alchemy for item conversion

### Combat System
- Interactive button-based combat (Attack, Defend, Eat Food, Run Away)
- Combat style switching to train different skills
- Experience rewards based on damage dealt and combat style
- Monster loot drops with percentage-based drop tables
- Health and combat state management

### Skills (1-99 Progression)
- **Attack** - Melee combat effectiveness and weapon requirements
- **Strength** - Melee damage bonus and equipment requirements
- **Defense** - Damage reduction and armor requirements
- **Magic** - Magical combat with staffs and spell casting
- **Range** - Ranged combat with bows and arrows
- **Fishing** - Catch fish for cooking (7 fish types across different areas)
- **Cooking** - Cook raw fish into healing food with burn chances
- **Mining** - Mine ores for smithing (7 ore types with level requirements)
- **Smithing** - Smelt ores into bars and create weapons/armor/tools
- **Woodcutting** - Cut trees to obtain logs (7 tree types with level requirements)
- **Fletching** - Create arrow shafts and bows from logs
- **Crafting** - Combine materials to make arrows, bows, staffs, and leather armor

### Areas
- **Lumbridge** - Starting area (Level 1+) - Basic monsters, copper/tin ore, shrimp, normal trees
- **Varrock** - Mid-level area (Level 10+) - Stronger monsters, iron ore, trout, oak trees  
- **Falador** - High-level area (Level 25+) - Tough monsters, coal/mithril ore, salmon, willow trees
- **Catherby** - Fishing hub (Level 15+) - Water-based monsters, fishing spots, maple trees
- **Ardougne** - Crafting center (Level 20+) - Varied monsters, crafting materials, yew trees
- **Dragon Isle** - Dragon territory (Level 40+) - Dragon enemies, adamantite ore, tuna, magic trees
- **Barrows Crypts** - Undead realm (Level 50+) - Undead monsters, runite ore, lobster, magic trees
- **Primal Realm** - Endgame area (Level 60+) - Primal monsters, primal ore, shark, elder trees

### Items & Equipment
- **Weapons** - Swords (melee), Bows (ranged), Staffs (magic) in Bronze/Iron/Mithril/Adamantite/Runite/Primal tiers
- **Armor** - Helmets, Chestplates, Leggings, Boots, Shields in all metal tiers plus Leather armor
- **Tools** - Pickaxes (mining), Fishing Rods (fishing), Axes (woodcutting) in all metal tiers
- **Ammunition** - Arrows in all metal tiers, crafted from arrow heads and shafts
- **Food** - Bread, Cooked Fish (Shrimp to Shark), healing various HP amounts
- **Resources** - 7 ore types, 7 fish types, 7 log types with level requirements
- **Materials** - Bars, Arrow Components, Crafting Materials in 6 metal tiers (Bronze to Primal)

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
- `/register` - Register your character to start playing
- `/stats` - View your character stats, levels, and progress bars
- `/help` - Interactive help menu with categories for all commands
- `/list <category>` - View detailed game information with pagination (areas, monsters, recipes, items, etc.)

### World & Navigation Commands
- `/travel <destination>` - Travel to different areas (8 areas available)
- `/area` - View current area information, including monsters and resources

### Inventory & Equipment Commands
- `/inventory [page]` - View your inventory with pagination (20 items per page)
- `/equipment` - View your equipped items in all slots
- `/equip <item>` - Equip weapons, tools, or armor from your inventory
- `/unequip <slot>` - Unequip items from specific equipment slots
- `/eat <food>` - Eat food to restore health

### Combat Commands
- `/fight [monster]` - Start combat with monsters (random or specific)
- `/style <combat_style>` - Change combat style (attack/strength/defense/range/magic)
- Use interactive buttons during combat (Attack, Defend, Eat, Run)

### Skilling Commands
- `/mine [ore] [quantity]` - Mine ores in your current area (requires pickaxe)
- `/fish [fish] [quantity]` - Catch fish in your current area (requires fishing rod)
- `/woodcut [tree] [quantity]` - Cut trees in your current area (requires axe)
- `/smith <smelt/smith> <item> [quantity]` - Smelt ores into bars OR smith bars into weapons/armor/tools
- `/fletch <item> [quantity]` - Create arrow shafts and bows from logs
- `/craft <item> [quantity]` - Craft arrows, bows, staffs, and leather armor from materials
- `/cook <item> [quantity]` - Cook raw fish into edible food

### Magic Commands
- `/spell <spell_name>` - Cast magic spells:
  - `low_alch` - Convert items to 50% coin value (Level 1 Magic)
  - `high_alch` - Convert items to 100% coin value (Level 55 Magic)