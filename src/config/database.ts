import mongoose from 'mongoose';
import { Player } from '../models/Player';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27020/eternals-rebirth');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const resetSkillingStatus = async () => {
  try {
    console.log('Checking for players with active skilling or combat status...');
    const activePlayersCount = await Player.countDocuments({ $or: [{ isSkilling: true }, { inCombat: true }] });
    console.log(`Found ${activePlayersCount} players with active status`);
    
    const result = await Player.updateMany(
      { $or: [{ isSkilling: true }, { inCombat: true }] },
      {
        $set: {
          isSkilling: false,
          currentSkill: null,
          skillingEndTime: null,
          inCombat: false,
          currentMonster: null,
          currentMonsterHp: null
        }
      }
    );
    console.log(`Reset activity status for ${result.modifiedCount} players`);
  } catch (error) {
    console.error('Error resetting activity status:', error);
  }
};