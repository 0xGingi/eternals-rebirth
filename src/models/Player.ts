import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  level: { type: Number, default: 1, min: 1, max: 99 },
  experience: { type: Number, default: 0 }
});

const inventoryItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  quantity: { type: Number, default: 1 }
});

const ammunitionSchema = new mongoose.Schema({
  itemId: { type: String, default: null },
  quantity: { type: Number, default: 0 }
});

const equipmentSchema = new mongoose.Schema({
  helmet: { type: String, default: null },
  chest: { type: String, default: null },
  legs: { type: String, default: null },
  boots: { type: String, default: null },
  gloves: { type: String, default: null },
  weapon: { type: String, default: null },
  shield: { type: String, default: null },
  ammunition: { type: ammunitionSchema, default: () => ({}) },
  ring: { type: String, default: null },
  necklace: { type: String, default: null }
});

const combatStatsSchema = new mongoose.Schema({
  currentHp: { type: Number, default: 100 },
  maxHp: { type: Number, default: 100 },
  attackStyle: { type: String, enum: ['attack', 'strength', 'defense', 'magic', 'range'], default: 'attack' },
  lastMeleeStyle: { type: String, enum: ['attack', 'strength', 'defense'], default: 'attack' }
});

const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  currentArea: { type: String, default: 'lumbridge' },
  skills: {
    attack: { type: skillSchema, default: () => ({}) },
    strength: { type: skillSchema, default: () => ({}) },
    defense: { type: skillSchema, default: () => ({}) },
    magic: { type: skillSchema, default: () => ({}) },
    range: { type: skillSchema, default: () => ({}) },
    fishing: { type: skillSchema, default: () => ({}) },
    cooking: { type: skillSchema, default: () => ({}) },
    mining: { type: skillSchema, default: () => ({}) },
    smithing: { type: skillSchema, default: () => ({}) },
    woodcutting: { type: skillSchema, default: () => ({}) },
    fletching: { type: skillSchema, default: () => ({}) },
    crafting: { type: skillSchema, default: () => ({}) },
    runecrafting: { type: skillSchema, default: () => ({}) }
  },
  inventory: [inventoryItemSchema],
  equipment: { type: equipmentSchema, default: () => ({}) },
  combatStats: { type: combatStatsSchema, default: () => ({}) },
  inCombat: { type: Boolean, default: false },
  currentMonster: { type: String, default: null },
  currentMonsterHp: { type: Number, default: null },
  isSkilling: { type: Boolean, default: false },
  currentSkill: { type: String, default: null },
  skillingEndTime: { type: Date, default: null }
}, {
  timestamps: true
});

// Daily reward tracking
playerSchema.add({
  dailyClaimAt: { type: Date, default: null }
});

export const Player = mongoose.model('Player', playerSchema);
