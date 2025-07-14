import mongoose from 'mongoose';

const itemStatsSchema = new mongoose.Schema({
  attack: { type: Number, default: 0 },
  strength: { type: Number, default: 0 },
  defense: { type: Number, default: 0 },
  magic: { type: Number, default: 0 },
  range: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  damage: { type: Number, default: 0 }
});

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['weapon', 'armor', 'tool', 'food', 'resource', 'other'], 
    required: true 
  },
  subType: { 
    type: String, 
    enum: ['melee', 'ranged', 'magic', 'ammunition', 'helmet', 'chest', 'legs', 'boots', 'gloves', 'shield', 'ring', 'necklace', 'pickaxe', 'rod', 'axe', 'raw', 'cooked', 'ore', 'bar', 'wood', 'component', 'fish', 'misc'],
    required: true 
  },
  levelRequired: { type: Number, default: 1 },
  stats: { type: itemStatsSchema, default: () => ({}) },
  stackable: { type: Boolean, default: false },
  edible: { type: Boolean, default: false },
  healAmount: { type: Number, default: 0 },
  value: { type: Number, default: 0 }
});

export const Item = mongoose.model('Item', itemSchema);