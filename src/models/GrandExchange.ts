import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  playerName: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerItem: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  quantityRemaining: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 days
}, {
  timestamps: true
});

const transactionSchema = new mongoose.Schema({
  buyerOfferId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandExchangeOffer', required: true },
  sellerOfferId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandExchangeOffer', required: true },
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  sellerName: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerItem: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
}, {
  timestamps: true
});

const priceHistorySchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

offerSchema.index({ itemId: 1, type: 1, status: 1 });
offerSchema.index({ playerId: 1, status: 1 });
offerSchema.index({ expiresAt: 1 });

transactionSchema.index({ itemId: 1 });
transactionSchema.index({ buyerId: 1 });
transactionSchema.index({ sellerId: 1 });
transactionSchema.index({ createdAt: -1 });

priceHistorySchema.index({ itemId: 1, timestamp: -1 });

export const GrandExchangeOffer = mongoose.model('GrandExchangeOffer', offerSchema);
export const GrandExchangeTransaction = mongoose.model('GrandExchangeTransaction', transactionSchema);
export const GrandExchangePriceHistory = mongoose.model('GrandExchangePriceHistory', priceHistorySchema);