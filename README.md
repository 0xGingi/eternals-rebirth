# Eternals Rebirth - Discord MMORPG Bot

A Discord MMORPG bot, the successor to Eternals Online, Inspired by runescape

## Features

### Core Systems
- **Player Registration & Stats** - Create characters and track progression with visual progress bars
- **Experience System** - Level skills from 1-99 like RuneScape with XP requirements
- **Turn-based Combat** - Fight monsters with interactive Discord buttons and magic spells
- **Area Travel** - Explore 8 different zones with unique content and level requirements
- **Inventory Management** - Full inventory system with pagination support
- **Equipment System** - Equip weapons, armor, and tools in dedicated slots
- **Magic System** - Cast combat spells and utility spells with rune consumption
- **Runecrafting System** - Craft runes from essence using talismans for magic combat

### Combat System
- Interactive button-based combat (Attack, Cast Spell, Defend, Eat Food, Run Away)
- Combat style switching to train different skills (Attack/Strength/Defense/Range/Magic)
- Magic combat with 20+ elemental spells (Wind/Earth/Water/Fire variants)
- Elemental weakness system - monsters weak to specific elements take +10% damage
- Experience rewards based on damage dealt and combat style
- Monster loot drops with percentage-based drop tables including talismans
- Health and combat state management

### Skills (1-99 Progression)
- **Attack** - Melee combat effectiveness and weapon requirements
- **Strength** - Melee damage bonus and equipment requirements
- **Defense** - Damage reduction and armor requirements
- **Magic** - Magical combat with staffs, spell casting, and rune consumption
- **Range** - Ranged combat with bows and arrows
- **Runecrafting** - Craft runes from essence using talismans (13 rune types, levels 1-90)
- **Fishing** - Catch fish for cooking (7 fish types across different areas)
- **Cooking** - Cook raw fish into healing food with burn chances
- **Mining** - Mine ores and rune essence for smithing/runecrafting (8 resource types)
- **Smithing** - Smelt ores into bars and create weapons/armor/tools
- **Woodcutting** - Cut trees to obtain logs (7 tree types with level requirements)
- **Fletching** - Create arrow shafts and bows from logs
- **Crafting** - Combine materials to make arrows, bows, staffs, and leather armor

### Areas
- **Lumbridge** - Starting area (Level 1+) - Basic monsters with fire/earth/water weaknesses, copper/tin ore, rune essence, shrimp, normal trees
- **Varrock** - Mid-level area (Level 10+) - Stronger monsters with air/fire weaknesses, iron ore, trout, oak trees  
- **Falador** - High-level area (Level 25+) - Tough monsters with water weakness, coal/mithril ore, salmon, willow trees
- **Catherby** - Fishing hub (Level 15+) - Water-based monsters with earth weakness, fishing spots, maple trees
- **Ardougne** - Crafting center (Level 20+) - Varied monsters with different weaknesses, crafting materials, yew trees
- **Dragon Isle** - Dragon territory (Level 40+) - Dragon enemies with water weakness, adamantite ore, tuna, magic trees
- **Barrows Crypts** - Undead realm (Level 50+) - Undead monsters with fire/water/air weaknesses, runite ore, lobster, magic trees
- **Primal Realm** - Endgame area (Level 60+) - Primal monsters with earth/fire/water weaknesses, primal ore, shark, elder trees

### Items & Equipment
- **Weapons** - Swords (melee), Bows (ranged), Staffs (magic) in Bronze/Iron/Mithril/Adamantite/Runite/Primal tiers
- **Armor** - Helmets, Chestplates, Leggings, Boots, Shields in all metal tiers plus Leather armor
- **Tools** - Pickaxes (mining), Fishing Rods (fishing), Axes (woodcutting) in all metal tiers
- **Ammunition** - Arrows in all metal tiers, crafted from arrow heads and shafts
- **Food** - Bread, Cooked Fish (Shrimp to Shark), healing various HP amounts
- **Runes** - 13 rune types for magic combat (Air, Earth, Water, Fire, Mind, Body, Cosmic, Chaos, Nature, Law, Death, Blood, Soul)
- **Talismans** - 13 reusable talismans for runecrafting, obtained from monster drops
- **Resources** - 8 resource types (7 ores + rune essence), 7 fish types, 7 log types with level requirements
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
- Use interactive buttons during combat (Attack, Cast Spell, Defend, Eat, Run)
- Magic combat: Equip magic weapon, set style to magic, use "Cast Spell" button to select spells

### Skilling Commands
- `/mine [ore] [quantity]` - Mine ores and rune essence in your current area (requires pickaxe)
- `/fish [fish] [quantity]` - Catch fish in your current area (requires fishing rod)
- `/woodcut [tree] [quantity]` - Cut trees in your current area (requires axe)
- `/smith <smelt/smith> <item> [quantity]` - Smelt ores into bars OR smith bars into weapons/armor/tools
- `/fletch <item> [quantity]` - Create arrow shafts and bows from logs
- `/craft <item> [quantity]` - Craft arrows, bows, staffs, and leather armor from materials
- `/cook <item> [quantity]` - Cook raw fish into edible food
- `/runecraft <rune> [quantity]` - Craft runes from essence using talismans (13 rune types, levels 1-90)

### Magic Commands
- `/spell <spell_name>` - Cast utility magic spells:
  - `low_alch` - Convert items to 50% coin value (Level 1 Magic)
  - `high_alch` - Convert items to 100% coin value (Level 55 Magic)

### Magic Combat System
- **20+ Combat Spells**: Wind/Earth/Water/Fire Strike/Bolt/Blast/Wave/Surge (Levels 1-95)
- **Elemental Weaknesses**: Monsters weak to specific elements take +10% accuracy and damage
- **Rune Consumption**: Combat spells consume runes from inventory automatically
- **Magic Weapons Required**: Equip staff and set combat style to magic to cast combat spells
- **Spell Selection**: During combat, use "Cast Spell" button to choose from available spells

### Runecrafting System  
- **Rune Essence**: Mine at Lumbridge (Level 1 Mining requirement)
- **Talismans**: Obtained from monster drops across all areas
- **13 Rune Types**: Air, Earth, Water, Fire, Mind, Body, Cosmic, Chaos, Nature, Law, Death, Blood, Soul
- **Progressive Difficulty**: Higher level runes require more essence but give more XP
- **Talisman Reuse**: Talismans are not consumed when crafting runes