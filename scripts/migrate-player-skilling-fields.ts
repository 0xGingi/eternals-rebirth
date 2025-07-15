import mongoose from 'mongoose';
import { config } from 'dotenv';
import { Player } from '../src/models/Player';

// Load environment variables
config();

async function migratePlayerSkillingFields() {
  try {
    console.log('Starting migration for player skilling fields...');
    
    // Connect to MongoDB using .env
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all players without the new skilling fields
    const playersToUpdate = await Player.find({
      $or: [
        { isSkilling: { $exists: false } },
        { currentSkill: { $exists: false } },
        { skillingEndTime: { $exists: false } }
      ]
    });

    console.log(`Found ${playersToUpdate.length} players to update`);

    // Update each player with the new fields
    for (const player of playersToUpdate) {
      await Player.updateOne(
        { _id: player._id },
        {
          $set: {
            isSkilling: false,
            currentSkill: null,
            skillingEndTime: null
          }
        }
      );
      console.log(`Updated player: ${player.username} (${player.userId})`);
    }

    console.log('Migration completed successfully!');
    
    // Verify the migration
    const updatedCount = await Player.countDocuments({
      isSkilling: { $exists: true },
      currentSkill: { $exists: true },
      skillingEndTime: { $exists: true }
    });
    
    console.log(`Verification: ${updatedCount} players now have all skilling fields`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migratePlayerSkillingFields();