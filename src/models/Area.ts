import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  skill: { type: String, required: true },
  levelRequired: { type: Number, required: true },
  experience: { type: Number, required: true },
  toolRequired: { type: String, required: true }
});

const monsterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, required: true },
  hp: { type: Number, required: true },
  attack: { type: Number, required: true },
  defense: { type: Number, required: true },
  experience: { type: Number, required: true },
  elementalWeakness: { type: String, enum: ['fire', 'water', 'earth', 'air'], required: false },
  dropTable: [{
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true },
    chance: { type: Number, required: true }
  }]
});

const areaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  monsters: [monsterSchema],
  resources: [resourceSchema],
  requiredLevel: { type: Number, default: 1 }
});

export const Area = mongoose.model('Area', areaSchema);