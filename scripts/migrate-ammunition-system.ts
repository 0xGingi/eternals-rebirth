import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eternals-rebirth';

interface OldPlayer {
  equipment: {
    ammunition: string | null;
    [key: string]: any;
  };
  combatStats: {
    lastMeleeStyle?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

async function migrateAmmunitionSystem() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Starting ammunition system migration...');

    const players = await mongoose.connection.db!.collection('players').find({}).toArray();
    console.log(`Found ${players.length} players to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const player of players as unknown as OldPlayer[]) {
      let needsUpdate = false;
      const updates: any = {};

      // Migrate ammunition from string to object structure
      if (player.equipment) {
        const ammunition = player.equipment.ammunition;
        
        if (typeof ammunition === 'string') {
          // Convert string ammunition to new object structure
          updates['equipment.ammunition'] = {
            itemId: ammunition,
            quantity: 1 // Default to 1 for existing ammunition
          };
          needsUpdate = true;
          console.log(`Migrating ammunition for player ${player.username}: ${ammunition} -> object`);
        } else if (ammunition === null || ammunition === undefined) {
          // Set empty ammunition object for null/undefined
          updates['equipment.ammunition'] = {
            itemId: null,
            quantity: 0
          };
          needsUpdate = true;
          console.log(`Setting empty ammunition object for player ${player.username}`);
        } else if (typeof ammunition === 'object' && ammunition !== null) {
          // Check if object has correct structure
          const ammoObj = ammunition as any;
          if (!ammoObj.hasOwnProperty('itemId') || !ammoObj.hasOwnProperty('quantity')) {
            updates['equipment.ammunition'] = {
              itemId: ammoObj.itemId || null,
              quantity: ammoObj.quantity || 0
            };
            needsUpdate = true;
            console.log(`Fixing ammunition structure for player ${player.username}`);
          }
        }
      }

      // Add lastMeleeStyle if it doesn't exist
      if (!player.combatStats || !player.combatStats.lastMeleeStyle) {
        updates['combatStats.lastMeleeStyle'] = 'attack'; // Default to attack style
        needsUpdate = true;
        console.log(`Adding lastMeleeStyle for player ${player.username}`);
      }

      // Apply updates if needed
      if (needsUpdate) {
        await mongoose.connection.db!.collection('players').updateOne(
          { _id: player._id },
          { $set: updates }
        );
        migratedCount++;
        console.log(`✓ Migrated player: ${player.username}`);
      } else {
        skippedCount++;
        console.log(`- Skipped player: ${player.username} (already up to date)`);
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Players migrated: ${migratedCount}`);
    console.log(`Players skipped: ${skippedCount}`);
    console.log(`Total players: ${players.length}`);

    console.log('\nVerifying migration...');
    
    // Verify the migration worked
    const updatedPlayers = await mongoose.connection.db!.collection('players').find({}).toArray();
    let verificationPassed = true;
    
    for (const player of updatedPlayers as any[]) {
      // Check ammunition structure
      if (!player.equipment?.ammunition || 
          typeof player.equipment.ammunition !== 'object' ||
          !player.equipment.ammunition.hasOwnProperty('itemId') ||
          !player.equipment.ammunition.hasOwnProperty('quantity')) {
        console.error(`❌ Verification failed for player ${player.username}: invalid ammunition structure`);
        verificationPassed = false;
      }
      
      // Check lastMeleeStyle
      if (!player.combatStats?.lastMeleeStyle) {
        console.error(`❌ Verification failed for player ${player.username}: missing lastMeleeStyle`);
        verificationPassed = false;
      }
    }

    if (verificationPassed) {
      console.log('✓ Migration verification passed!');
    } else {
      console.error('❌ Migration verification failed!');
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
if (require.main === module) {
  migrateAmmunitionSystem()
    .then(() => {
      console.log('Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateAmmunitionSystem };