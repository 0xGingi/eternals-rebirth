import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Area } from '../src/models/Area';

dotenv.config();

const MONSTER_WEAKNESSES = {
  // Lumbridge
  'rat': 'fire',
  'cow': 'earth', 
  'goblin': 'water',
  
  // Varrock
  'guard': 'air',
  'skeleton': 'fire',
  
  // Falador
  'dwarf': 'water',
  
  // Catherby
  'sea_troll': 'earth',
  
  // Dragon Isle
  'red_dragon': 'water',
  
  // Add more as needed
};

async function updateMonsterWeaknesses() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    console.log('Updating monster elemental weaknesses...');
    
    // Get all areas
    const areas = await Area.find({});
    let updatedCount = 0;
    
    for (const area of areas) {
      let areaUpdated = false;
      
      for (const monster of area.monsters) {
        const weakness = MONSTER_WEAKNESSES[monster.id as keyof typeof MONSTER_WEAKNESSES];
        
        if (weakness && monster.elementalWeakness !== weakness) {
          console.log(`Setting ${monster.name} (${monster.id}) weakness to ${weakness}`);
          monster.elementalWeakness = weakness as 'fire' | 'water' | 'earth' | 'air';
          areaUpdated = true;
          updatedCount++;
        }
      }
      
      if (areaUpdated) {
        await area.save();
        console.log(`Updated area: ${area.name}`);
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} monsters with elemental weaknesses`);
    
  } catch (error) {
    console.error('❌ Error updating monster weaknesses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update script
updateMonsterWeaknesses();