import { Player } from '../src/models/Player';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eternals-rebirth';

async function giveFemursToPlayer() {
  try {
    await mongoose.connect(MONGODB_URI);

    const userId = '705234454419079230';
    const itemToAdd = {
      itemId: 'lost_femurs_of_phantasmic_isles',
      quantity: 1
    };

    const player = await Player.findOne({ userId });
    if (!player) {
      console.log('Player not found!');
      process.exit(1);
    }

    const existingItem = player.inventory.find(item => item.itemId === itemToAdd.itemId);
    if (existingItem) {
      console.log('Player already has the Lost Femurs!');
      process.exit(1);
    }

    player.inventory.push(itemToAdd);
    await player.save();
    
    console.log(`Successfully given Lost Femurs of Phantasmic Isles to player!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

giveFemursToPlayer();