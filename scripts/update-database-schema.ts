import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Area } from '../src/models/Area';
import { Player } from '../src/models/Player';
import { Item } from '../src/models/Item';

dotenv.config();

async function updateDatabaseSchema() {
  try {
    console.log('🔄 Starting database schema update...');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Update Players - Add runecrafting skill if missing
    console.log('\n📊 Updating Player schemas...');
    const players = await Player.find({});
    let playersUpdated = 0;

    for (const player of players) {
      let playerUpdated = false;

      // Add runecrafting skill if missing
      if (!player.skills?.runecrafting) {
        if (!player.skills) {
          player.skills = {} as any;
        }
        (player.skills as any).runecrafting = { level: 1, experience: 0 };
        playerUpdated = true;
        console.log(`Added runecrafting skill to player: ${player.username}`);
      }

      if (playerUpdated) {
        await player.save();
        playersUpdated++;
      }
    }

    console.log(`✅ Updated ${playersUpdated} players with runecrafting skill`);

    // Update Areas - Ensure monster elemental weaknesses are set
    console.log('\n⚔️  Updating Area/Monster schemas...');
    const areas = await Area.find({});
    let monstersUpdated = 0;

    const MONSTER_WEAKNESSES = {
      'rat': 'fire',
      'cow': 'earth', 
      'goblin': 'water',
      'guard': 'air',
      'skeleton': 'fire',
      'dwarf': 'water',
      'sea_troll': 'earth',
      'lobster_warrior': 'fire',
      'pirate_captain': 'air',
      'necromancer': 'earth',
      'shadow_warrior': 'fire',
      'lich_king': 'water',
      'red_dragon': 'water',
      'dragon_knight': 'earth',
      'ancient_dragon': 'air',
      'barrows_wight': 'fire',
      'barrows_brother': 'water',
      'barrows_king': 'air',
      'primal_elemental': 'earth',
      'primal_guardian': 'fire',
      'primal_god': 'water'
    };
    
    for (const area of areas) {
      let areaUpdated = false;
      
      for (const monster of area.monsters) {
        const weakness = MONSTER_WEAKNESSES[monster.id as keyof typeof MONSTER_WEAKNESSES];
        
        if (weakness && monster.elementalWeakness !== weakness) {
          console.log(`Setting ${monster.name} weakness to ${weakness}`);
          monster.elementalWeakness = weakness as 'fire' | 'water' | 'earth' | 'air';
          areaUpdated = true;
          monstersUpdated++;
        }
      }
      
      if (areaUpdated) {
        await area.save();
      }
    }

    console.log(`✅ Updated ${monstersUpdated} monsters with elemental weaknesses`);

    // Check Items - Ensure new items exist
    console.log('\n🎒 Checking Items collection...');
    const itemCount = await Item.countDocuments({});
    console.log(`Current item count: ${itemCount}`);

    // Check for rune essence
    const runeEssence = await Item.findOne({ id: 'rune_essence' });
    if (!runeEssence) {
      console.log('⚠️  Rune essence not found - run item initialization');
    } else {
      console.log('✅ Rune essence exists');
    }

    // Check for runes
    const airRune = await Item.findOne({ id: 'air_rune' });
    if (!airRune) {
      console.log('⚠️  Air rune not found - run item initialization');
    } else {
      console.log('✅ Runes exist');
    }

    // Check for talismans
    const airTalisman = await Item.findOne({ id: 'air_talisman' });
    if (!airTalisman) {
      console.log('⚠️  Air talisman not found - run item initialization');
    } else {
      console.log('✅ Talismans exist');
    }

    console.log('\n🎉 Database schema update completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`- Players updated: ${playersUpdated}`);
    console.log(`- Monsters updated: ${monstersUpdated}`);
    console.log(`- Total items in database: ${itemCount}`);

  } catch (error) {
    console.error('❌ Error updating database schema:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Check if running directly
if (require.main === module) {
  updateDatabaseSchema();
}

export { updateDatabaseSchema };