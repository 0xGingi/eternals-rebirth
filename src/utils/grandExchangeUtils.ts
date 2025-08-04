import { GrandExchangeOffer, GrandExchangeTransaction, GrandExchangePriceHistory } from '../models/GrandExchange';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

export interface OfferResult {
  success: boolean;
  message: string;
  offer?: any;
  matchedOffers?: any[];
}

export async function createBuyOffer(playerId: string, itemId: string, quantity: number, pricePerItem: number): Promise<OfferResult> {
  try {
    const player = await Player.findOne({ userId: playerId });
    if (!player) {
      return { success: false, message: 'Player not found!' };
    }

    const item = await Item.findOne({ id: itemId });
    if (!item) {
      return { success: false, message: 'Item not found!' };
    }

    const totalPrice = quantity * pricePerItem;
    
    const coinsInInventory = player.inventory.find(invItem => invItem.itemId === 'coins')?.quantity || 0;
    if (coinsInInventory < totalPrice) {
      return { success: false, message: `Not enough coins! You need ${totalPrice} coins but only have ${coinsInInventory}.` };
    }

    const newOffer = new GrandExchangeOffer({
      playerId: playerId,
      playerName: player.username,
      itemId: itemId,
      itemName: item.name,
      type: 'buy',
      quantity: quantity,
      pricePerItem: pricePerItem,
      totalPrice: totalPrice,
      quantityRemaining: quantity
    });

    const coinsIndex = player.inventory.findIndex(invItem => invItem.itemId === 'coins');
    if (coinsIndex !== -1) {
      player.inventory[coinsIndex].quantity -= totalPrice;
      if (player.inventory[coinsIndex].quantity <= 0) {
        player.inventory.splice(coinsIndex, 1);
      }
    }

    await player.save();
    const savedOffer = await newOffer.save();

    const matchedOffers = await matchBuyOffer(savedOffer);

    return {
      success: true,
      message: `Buy offer created for ${quantity}x ${item.name} at ${pricePerItem} coins each.`,
      offer: savedOffer,
      matchedOffers
    };
  } catch (error) {
    console.error('Error creating buy offer:', error);
    return { success: false, message: 'An error occurred while creating the buy offer.' };
  }
}

export async function createSellOffer(playerId: string, itemId: string, quantity: number, pricePerItem: number): Promise<OfferResult> {
  try {
    const player = await Player.findOne({ userId: playerId });
    if (!player) {
      return { success: false, message: 'Player not found!' };
    }

    const item = await Item.findOne({ id: itemId });
    if (!item) {
      return { success: false, message: 'Item not found!' };
    }

    const itemInInventory = player.inventory.find(invItem => invItem.itemId === itemId);
    if (!itemInInventory || itemInInventory.quantity < quantity) {
      return { success: false, message: `Not enough ${item.name}! You need ${quantity} but only have ${itemInInventory?.quantity || 0}.` };
    }

    const newOffer = new GrandExchangeOffer({
      playerId: playerId,
      playerName: player.username,
      itemId: itemId,
      itemName: item.name,
      type: 'sell',
      quantity: quantity,
      pricePerItem: pricePerItem,
      totalPrice: quantity * pricePerItem,
      quantityRemaining: quantity
    });

    const itemIndex = player.inventory.findIndex(invItem => invItem.itemId === itemId);
    if (itemIndex !== -1) {
      player.inventory[itemIndex].quantity -= quantity;
      if (player.inventory[itemIndex].quantity <= 0) {
        player.inventory.splice(itemIndex, 1);
      }
    }

    await player.save();
    const savedOffer = await newOffer.save();

    const matchedOffers = await matchSellOffer(savedOffer);

    return {
      success: true,
      message: `Sell offer created for ${quantity}x ${item.name} at ${pricePerItem} coins each.`,
      offer: savedOffer,
      matchedOffers
    };
  } catch (error) {
    console.error('Error creating sell offer:', error);
    return { success: false, message: 'An error occurred while creating the sell offer.' };
  }
}

async function matchBuyOffer(buyOffer: any): Promise<any[]> {
  const sellOffers = await GrandExchangeOffer.find({
    itemId: buyOffer.itemId,
    type: 'sell',
    status: 'active',
    pricePerItem: { $lte: buyOffer.pricePerItem }
  }).sort({ pricePerItem: 1, createdAt: 1 });

  const matches = [];
  let remainingQuantity = buyOffer.quantityRemaining;

  for (const sellOffer of sellOffers) {
    if (remainingQuantity === 0) break;

    const quantityToTrade = Math.min(remainingQuantity, sellOffer.quantityRemaining);
    const tradePrice = sellOffer.pricePerItem;

    const transaction = await executeTransaction(buyOffer, sellOffer, quantityToTrade, tradePrice);
    if (transaction) {
      matches.push(transaction);
      remainingQuantity -= quantityToTrade;
    }
  }

  buyOffer.quantityRemaining = remainingQuantity;
  if (remainingQuantity === 0) {
    buyOffer.status = 'completed';
  }
  await buyOffer.save();

  return matches;
}

async function matchSellOffer(sellOffer: any): Promise<any[]> {
  const buyOffers = await GrandExchangeOffer.find({
    itemId: sellOffer.itemId,
    type: 'buy',
    status: 'active',
    pricePerItem: { $gte: sellOffer.pricePerItem }
  }).sort({ pricePerItem: -1, createdAt: 1 });

  const matches = [];
  let remainingQuantity = sellOffer.quantityRemaining;

  for (const buyOffer of buyOffers) {
    if (remainingQuantity === 0) break;

    const quantityToTrade = Math.min(remainingQuantity, buyOffer.quantityRemaining);
    const tradePrice = buyOffer.pricePerItem;

    const transaction = await executeTransaction(buyOffer, sellOffer, quantityToTrade, tradePrice);
    if (transaction) {
      matches.push(transaction);
      remainingQuantity -= quantityToTrade;
    }
  }

  sellOffer.quantityRemaining = remainingQuantity;
  if (remainingQuantity === 0) {
    sellOffer.status = 'completed';
  }
  await sellOffer.save();

  return matches;
}

async function executeTransaction(buyOffer: any, sellOffer: any, quantity: number, price: number): Promise<any> {
  try {
    const buyer = await Player.findOne({ userId: buyOffer.playerId });
    const seller = await Player.findOne({ userId: sellOffer.playerId });

    if (!buyer || !seller) {
      console.error('Buyer or seller not found during transaction');
      return null;
    }

    const buyerItemIndex = buyer.inventory.findIndex(item => item.itemId === buyOffer.itemId);
    if (buyerItemIndex === -1) {
      buyer.inventory.push({ itemId: buyOffer.itemId, quantity: quantity });
    } else {
      buyer.inventory[buyerItemIndex].quantity += quantity;
    }

    const sellerCoinsIndex = seller.inventory.findIndex(item => item.itemId === 'coins');
    const totalCoins = quantity * price;
    if (sellerCoinsIndex === -1) {
      seller.inventory.push({ itemId: 'coins', quantity: totalCoins });
    } else {
      seller.inventory[sellerCoinsIndex].quantity += totalCoins;
    }

    const priceDifference = (buyOffer.pricePerItem - price) * quantity;
    if (priceDifference > 0) {
      const buyerCoinsIndex = buyer.inventory.findIndex(item => item.itemId === 'coins');
      if (buyerCoinsIndex === -1) {
        buyer.inventory.push({ itemId: 'coins', quantity: priceDifference });
      } else {
        buyer.inventory[buyerCoinsIndex].quantity += priceDifference;
      }
    }

    buyOffer.quantityRemaining -= quantity;
    sellOffer.quantityRemaining -= quantity;

    if (buyOffer.quantityRemaining === 0) {
      buyOffer.status = 'completed';
    }
    if (sellOffer.quantityRemaining === 0) {
      sellOffer.status = 'completed';
    }

    await Promise.all([
      buyer.save(),
      seller.save(),
      buyOffer.save(),
      sellOffer.save()
    ]);

    const transaction = new GrandExchangeTransaction({
      buyerOfferId: buyOffer._id,
      sellerOfferId: sellOffer._id,
      buyerId: buyOffer.playerId,
      sellerId: sellOffer.playerId,
      buyerName: buyOffer.playerName,
      sellerName: sellOffer.playerName,
      itemId: buyOffer.itemId,
      itemName: buyOffer.itemName,
      quantity: quantity,
      pricePerItem: price,
      totalPrice: quantity * price
    });

    const savedTransaction = await transaction.save();

    const priceHistory = new GrandExchangePriceHistory({
      itemId: buyOffer.itemId,
      itemName: buyOffer.itemName,
      price: price,
      quantity: quantity
    });
    await priceHistory.save();

    return savedTransaction;
  } catch (error) {
    console.error('Error executing transaction:', error);
    return null;
  }
}

export async function cancelOffer(playerId: string, offerId: string): Promise<OfferResult> {
  try {
    const offer = await GrandExchangeOffer.findOne({ _id: offerId, playerId: playerId, status: 'active' });
    if (!offer) {
      return { success: false, message: 'Offer not found or already completed/cancelled.' };
    }

    const player = await Player.findOne({ userId: playerId });
    if (!player) {
      return { success: false, message: 'Player not found!' };
    }

    if (offer.type === 'buy') {
      const refundAmount = offer.quantityRemaining * offer.pricePerItem;
      const coinsIndex = player.inventory.findIndex(item => item.itemId === 'coins');
      if (coinsIndex === -1) {
        player.inventory.push({ itemId: 'coins', quantity: refundAmount });
      } else {
        player.inventory[coinsIndex].quantity += refundAmount;
      }
    } else {
      const itemIndex = player.inventory.findIndex(item => item.itemId === offer.itemId);
      if (itemIndex === -1) {
        player.inventory.push({ itemId: offer.itemId, quantity: offer.quantityRemaining });
      } else {
        player.inventory[itemIndex].quantity += offer.quantityRemaining;
      }
    }

    offer.status = 'cancelled';
    await Promise.all([offer.save(), player.save()]);

    return {
      success: true,
      message: `Offer cancelled. Items/coins have been returned to your inventory.`,
      offer
    };
  } catch (error) {
    console.error('Error cancelling offer:', error);
    return { success: false, message: 'An error occurred while cancelling the offer.' };
  }
}

export async function getPlayerOffers(playerId: string): Promise<any[]> {
  try {
    const offers = await GrandExchangeOffer.find({ playerId: playerId })
      .sort({ createdAt: -1 })
      .limit(20);
    return offers;
  } catch (error) {
    console.error('Error getting player offers:', error);
    return [];
  }
}

export async function getItemPriceData(itemId: string): Promise<any> {
  try {
    const [recentTransactions, currentBuyOffers, currentSellOffers] = await Promise.all([
      GrandExchangeTransaction.find({ itemId })
        .sort({ createdAt: -1 })
        .limit(10),
      GrandExchangeOffer.find({ itemId, type: 'buy', status: 'active' })
        .sort({ pricePerItem: -1 })
        .limit(5),
      GrandExchangeOffer.find({ itemId, type: 'sell', status: 'active' })
        .sort({ pricePerItem: 1 })
        .limit(5)
    ]);

    const averagePrice = recentTransactions.length > 0
      ? Math.round(recentTransactions.reduce((sum, t) => sum + t.pricePerItem, 0) / recentTransactions.length)
      : 0;

    const highestBuyOffer = currentBuyOffers.length > 0 ? currentBuyOffers[0].pricePerItem : 0;
    const lowestSellOffer = currentSellOffers.length > 0 ? currentSellOffers[0].pricePerItem : 0;

    return {
      itemId,
      averagePrice,
      highestBuyOffer,
      lowestSellOffer,
      recentTransactions,
      currentBuyOffers,
      currentSellOffers
    };
  } catch (error) {
    console.error('Error getting item price data:', error);
    return null;
  }
}

export async function cleanupExpiredOffers(): Promise<void> {
  try {
    const expiredOffers = await GrandExchangeOffer.find({
      status: 'active',
      expiresAt: { $lt: new Date() }
    });

    for (const offer of expiredOffers) {
      await cancelOffer(offer.playerId, offer._id.toString());
    }

    console.log(`Cleaned up ${expiredOffers.length} expired offers`);
  } catch (error) {
    console.error('Error cleaning up expired offers:', error);
  }
}