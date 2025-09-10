# Eternals Rebirth - Telegram MMORPG Bot

A Telegram MMORPG bot, the successor to Eternals Online, inspired by RuneScape.

## Features

### Core Systems
- **Player Registration & Stats** - Create characters and track progression with visual progress bars
- **Experience System** - Level skills from 1-99 like RuneScape with XP requirements
- **Turn-based Combat** - Fight monsters (Telegram UI)
- **Area Travel** - Explore 8 different zones with unique content and level requirements
- **Inventory Management** - Full inventory system with pagination support
- **Equipment System** - Equip weapons, armor, and tools in dedicated slots
- **Magic System** - Cast combat spells and utility spells with rune consumption
- **Runecrafting System** - Craft runes from essence using talismans for magic combat
- **Grand Exchange** - Buy and Sell items from other players

### Combat System
- Turn-based combat (Telegram UI)
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
- **Crafting** - Combine materials to make arrows, bows, staffs, leather armor, and magic robes

### Areas
- **Lumbridge** - Starting area (Air/Earth/Mind runes) - Basic monsters with fire/earth/water weaknesses, copper/tin ore, rune essence, shrimp, normal trees
- **Varrock** - Mid-level area (Water/Fire/Body runes) - Stronger monsters with air/fire weaknesses, iron ore, trout, oak trees  
- **Falador** - High-level area (Cosmic/Chaos runes) - Tough monsters with water weakness, coal/mithril ore, salmon, willow trees
- **Catherby** - Fishing hub (Nature runes) - Water-based monsters with earth weakness, fishing spots, maple trees
- **Ardougne** - Crafting center (Law runes) - Varied monsters with different weaknesses, crafting materials, yew trees
- **Dragon Isle** - Dragon territory (Death runes) - Dragon enemies with water weakness, adamantite ore, tuna, magic trees
- **Barrows Crypts** - Undead realm (Blood runes) - Undead monsters with fire/water/air weaknesses, runite ore, lobster, magic trees
- **Primal Realm** - Endgame area (Soul runes) - Primal monsters with earth/fire/water weaknesses, primal ore, shark, elder trees


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
- **Cloth Materials** - 10 cloth types (Cloth to Ethereal Cloth) for crafting magic robes
- **Magic Robes** - 10 tiers of magic armor sets (Wizard to Ethereal) providing magic bonuses

## Quick Start with Docker (Telegram)

### Prerequisites
- Docker and Docker Compose installed
- Telegram bot token from BotFather

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
   Edit `.env` (or `.env.docker`) with your credentials:
   ```env
   TELEGRAM_TOKEN=your_bot_token_here
   MONGO_ROOT_PASSWORD=your_secure_password_here
   ```

4. **Start Services**
   ```bash
docker-compose up -d
```

## Run Locally

```bash
bun install
TELEGRAM_TOKEN=your_token_here bun run src/telegram/bot.ts
```

## Commands (Telegram)

### Basic Commands
- `/register` - Register your character to start playing
- `/stats` - View your character stats
- `/inventory` - View your inventory
- `/inventory search <query> [page]` - Search inventory
- `/inventory sort <name|qty> [asc|desc] [page]` - Sort inventory
- `/help` - List available commands
- `/guide <topic> [page]` - Skill guides (areas, mining, fishing, woodcutting, cooking, smith, fletch, crafting, runecraft)
- `/daily` - Daily rewards (+100 coins, +5 bread; restores missing basic tools)

### World & Navigation Commands
- `/travel <destination>` - Travel to different areas (8 areas available)
- `/area [monsters|resources] [page]` - View current area information, with paging
- `/area filter <text> [page]` - Filter monsters/resources by name

### Inventory & Equipment Commands
- `/inventory` - View your inventory
- `/inventory search <query> [page]` - Search inventory
- `/equipment` - View your equipped items in all slots
- `/equip <item>` - Equip weapons, tools, or armor from your inventory
- `/unequip <slot>` - Unequip items from specific equipment slots
- `/eat <food>` - Eat food to restore health

### Combat Commands
- `/fight [monster]` - Start combat with monsters
- `/style <combat_style>` - Change combat style (attack/strength/defense/range/magic)
- `/attack` `/defend` `/eat <food>` `/run` - Combat actions

- `/mine [ore] [quantity]` - Mine ores and rune essence
- `/fish [fish] [quantity]` - Catch fish
- `/woodcut [tree] [quantity]` - Cut trees
- `/smith smelt <bar_id> [quantity]` - Smelt bars from ores/coal
- `/smith make <item_id> [quantity]` - Forge metal weapons/armor/tools from bars
- `/fletch <item> [quantity]` - Make arrow shafts and bows
- `/gather [material] [quantity]` - Gather cloth materials for crafting magic robes
- `/craft <item> [quantity]` - Craft magic robes from cloth
- `/leather <item_id> [quantity]` - Craft leather and dragonhide gear
- `/cook <item> [quantity]` - Cook raw fish into food
- `/runecraft <rune> [quantity]` - Craft runes from essence using talismans (area-gated)

### Economy Commands
- `/ge buy <item> <qty> <price_each>` - Create buy offer
- `/ge sell <item> <qty> <price_each>` - Create sell offer
- `/ge offers [page]` - View your offers
- `/ge offers <active|completed|cancelled> [page]` - Filter offers by status
- `/ge my <item> [active|completed|cancelled] [page]` - View your offers for an item
- `/ge cancel <offer_id>` - Cancel an active offer
- `/ge price <item>` - View average/high/low prices
- `/ge search <query> [page]` - Find item IDs by name

### Magic Commands
- `/spells [page]` - List available combat spells
- `/cast <spell_id_or_name>` - Cast a combat spell during /fight (requires magic style and magic weapon)

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
- **Area-Specific Crafting**: Each rune type can only be crafted in specific areas
- **Progressive Difficulty**: Higher level runes require more essence but give more XP
- **Talisman Reuse**: Talismans are not consumed when crafting runes
- **Area Distribution**: Lumbridge (Air/Earth/Mind), Varrock (Water/Fire/Body), Falador (Cosmic/Chaos), etc.

### Gathering & Magic Robes System
- **Cloth Gathering**: Use `/gather` command to collect cloth materials (no tools required)
- **10 Cloth Tiers**: Cloth, Soft Cloth, Fine Cloth, Silk Cloth, Mystic Cloth, Enchanted Cloth, Lunar Cloth, Infinity Cloth, Ancestral Cloth, Ethereal Cloth
- **Crafting Experience**: Gathering gives 1-2 Crafting XP per material collected
- **Magic Robe Sets**: Complete 5-piece armor sets (Hat, Top, Bottom, Gloves, Boots) for each tier
- **Magic Bonuses**: Robes provide Magic accuracy and damage bonuses, essential for spell casting
- **Progressive Tiers**: T1-90 magic armor matching other equipment progression (Wizard to Ethereal)
- **Crafting Requirements**: Higher tier robes require higher Crafting levels (1-95)
- **RuneScape Inspired**: Names and progression similar to RuneScape magic armor system
