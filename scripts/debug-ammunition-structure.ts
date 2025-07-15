import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eternals-rebirth';

async function debugAmmunitionStructure() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const players = await mongoose.connection.db!.collection('players').find({}).toArray();
    console.log(`Found ${players.length} players`);

    for (const player of players) {
      console.log(`\n=== Player: ${player.username} ===`);
      console.log('Equipment:', JSON.stringify(player.equipment, null, 2));
      console.log('Combat Stats:', JSON.stringify(player.combatStats, null, 2));
      
      // Check ammunition structure specifically
      if (player.equipment && player.equipment.ammunition) {
        console.log('Ammunition type:', typeof player.equipment.ammunition);
        console.log('Ammunition value:', player.equipment.ammunition);
        console.log('Has itemId?', player.equipment.ammunition.hasOwnProperty?.('itemId'));
        console.log('Has quantity?', player.equipment.ammunition.hasOwnProperty?.('quantity'));
      } else {
        console.log('No ammunition found');
      }
    }

  } catch (error) {
    console.error('Debug failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the debug script
debugAmmunitionStructure()
  .then(() => {
    console.log('Debug script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Debug script failed:', error);
    process.exit(1);
  });