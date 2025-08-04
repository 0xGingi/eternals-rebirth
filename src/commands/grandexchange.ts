import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createBuyOffer, createSellOffer, cancelOffer, getPlayerOffers, getItemPriceData } from '../utils/grandExchangeUtils';
import { GrandExchangeOffer } from '../models/GrandExchange';
import { Item } from '../models/Item';
import { Player } from '../models/Player';

export const data = new SlashCommandBuilder()
  .setName('ge')
  .setDescription('Access the Grand Exchange')
  .addSubcommand(subcommand =>
    subcommand
      .setName('buy')
      .setDescription('Place a buy offer on the Grand Exchange')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('The item to buy')
          .setRequired(true)
          .setAutocomplete(true))
      .addIntegerOption(option =>
        option.setName('quantity')
          .setDescription('Quantity to buy')
          .setRequired(true)
          .setMinValue(1))
      .addIntegerOption(option =>
        option.setName('price')
          .setDescription('Price per item in coins')
          .setRequired(true)
          .setMinValue(1)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('sell')
      .setDescription('Place a sell offer on the Grand Exchange')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('The item to sell')
          .setRequired(true)
          .setAutocomplete(true))
      .addIntegerOption(option =>
        option.setName('quantity')
          .setDescription('Quantity to sell')
          .setRequired(true)
          .setMinValue(1))
      .addIntegerOption(option =>
        option.setName('price')
          .setDescription('Price per item in coins')
          .setRequired(true)
          .setMinValue(1)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('offers')
      .setDescription('View your active Grand Exchange offers'))
  .addSubcommand(subcommand =>
    subcommand
      .setName('cancel')
      .setDescription('Cancel an active offer')
      .addStringOption(option =>
        option.setName('offer_id')
          .setDescription('The ID of the offer to cancel')
          .setRequired(true)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('price')
      .setDescription('Check current market price for an item')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('The item to check')
          .setRequired(true)
          .setAutocomplete(true)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('search')
      .setDescription('Search active Grand Exchange listings')
      .addStringOption(option =>
        option.setName('query')
          .setDescription('Search term for items (leave empty to see all listings)')
          .setRequired(false))
      .addIntegerOption(option =>
        option.setName('page')
          .setDescription('Page number to view')
          .setRequired(false)
          .setMinValue(1)));

export async function execute(interaction: any) {
  const subcommand = interaction.options.getSubcommand();
  const playerId = interaction.user.id;

  const player = await Player.findOne({ userId: playerId });
  if (!player) {
    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('❌ Not Registered')
      .setDescription('You need to register first! Use `/register` to create your character.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  try {
    switch (subcommand) {
      case 'buy':
        await handleBuyOffer(interaction, playerId);
        break;
      case 'sell':
        await handleSellOffer(interaction, playerId);
        break;
      case 'offers':
        await handleViewOffers(interaction, playerId);
        break;
      case 'cancel':
        await handleCancelOffer(interaction, playerId);
        break;
      case 'price':
        await handlePriceCheck(interaction);
        break;
      case 'search':
        await handleItemSearch(interaction);
        break;
    }
  } catch (error) {
    console.error('Error in Grand Exchange command:', error);
    await interaction.reply({
      content: 'An error occurred while processing your Grand Exchange request.',
      ephemeral: true
    });
  }
}

async function handleBuyOffer(interaction: any, playerId: string) {
  const itemId = interaction.options.getString('item');
  const quantity = interaction.options.getInteger('quantity');
  const price = interaction.options.getInteger('price');

  const result = await createBuyOffer(playerId, itemId, quantity, price);

  const embed = new EmbedBuilder()
    .setColor(result.success ? 0x00FF00 : 0xFF0000)
    .setTitle(result.success ? '✅ Buy Offer Created' : '❌ Buy Offer Failed')
    .setDescription(result.message);

  if (result.success && result.matchedOffers && result.matchedOffers.length > 0) {
    const matchText = result.matchedOffers.map(match => 
      `• ${match.quantity}x at ${match.pricePerItem} coins each`
    ).join('\n');
    embed.addFields({
      name: '🔄 Instant Matches Found',
      value: matchText,
      inline: false
    });
  }

  await interaction.reply({ embeds: [embed] });
}

async function handleSellOffer(interaction: any, playerId: string) {
  const itemId = interaction.options.getString('item');
  const quantity = interaction.options.getInteger('quantity');
  const price = interaction.options.getInteger('price');

  const result = await createSellOffer(playerId, itemId, quantity, price);

  const embed = new EmbedBuilder()
    .setColor(result.success ? 0x00FF00 : 0xFF0000)
    .setTitle(result.success ? '✅ Sell Offer Created' : '❌ Sell Offer Failed')
    .setDescription(result.message);

  if (result.success && result.matchedOffers && result.matchedOffers.length > 0) {
    const matchText = result.matchedOffers.map(match => 
      `• ${match.quantity}x at ${match.pricePerItem} coins each`
    ).join('\n');
    embed.addFields({
      name: '🔄 Instant Matches Found',
      value: matchText,
      inline: false
    });
  }

  await interaction.reply({ embeds: [embed] });
}

async function handleViewOffers(interaction: any, playerId: string) {
  const offers = await getPlayerOffers(playerId);

  if (offers.length === 0) {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('📋 Your Grand Exchange Offers')
      .setDescription('You have no active or recent offers.');
    await interaction.reply({ embeds: [embed] });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('📋 Your Grand Exchange Offers')
    .setDescription('Your recent Grand Exchange activity:');

  const activeOffers = offers.filter(offer => offer.status === 'active');
  const completedOffers = offers.filter(offer => offer.status === 'completed').slice(0, 5);
  const cancelledOffers = offers.filter(offer => offer.status === 'cancelled').slice(0, 3);

  if (activeOffers.length > 0) {
    const activeText = activeOffers.map(offer => {
      const progress = offer.quantity - offer.quantityRemaining;
      const progressText = progress > 0 ? ` (${progress}/${offer.quantity} filled)` : '';
      return `**${offer.type.toUpperCase()}** ${offer.itemName}\n` +
             `${offer.quantityRemaining}x at ${offer.pricePerItem} coins each${progressText}\n` +
             `ID: \`${offer._id}\``;
    }).join('\n\n');
    
    embed.addFields({
      name: '🟢 Active Offers',
      value: activeText,
      inline: false
    });
  }

  if (completedOffers.length > 0) {
    const completedText = completedOffers.map(offer => 
      `**${offer.type.toUpperCase()}** ${offer.quantity}x ${offer.itemName} at ${offer.pricePerItem} coins each`
    ).join('\n');
    
    embed.addFields({
      name: '✅ Recently Completed',
      value: completedText,
      inline: false
    });
  }

  if (cancelledOffers.length > 0) {
    const cancelledText = cancelledOffers.map(offer => 
      `**${offer.type.toUpperCase()}** ${offer.quantity}x ${offer.itemName} at ${offer.pricePerItem} coins each`
    ).join('\n');
    
    embed.addFields({
      name: '❌ Recently Cancelled',
      value: cancelledText,
      inline: false
    });
  }

  await interaction.reply({ embeds: [embed] });
}

async function handleCancelOffer(interaction: any, playerId: string) {
  const offerId = interaction.options.getString('offer_id');
  
  const result = await cancelOffer(playerId, offerId);

  const embed = new EmbedBuilder()
    .setColor(result.success ? 0x00FF00 : 0xFF0000)
    .setTitle(result.success ? '✅ Offer Cancelled' : '❌ Cancellation Failed')
    .setDescription(result.message);

  await interaction.reply({ embeds: [embed] });
}

async function handlePriceCheck(interaction: any) {
  const itemId = interaction.options.getString('item');
  
  const item = await Item.findOne({ id: itemId });
  if (!item) {
    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('❌ Item Not Found')
      .setDescription('The specified item could not be found.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  const priceData = await getItemPriceData(itemId);
  
  const embed = new EmbedBuilder()
    .setColor(0x9932CC)
    .setTitle(`💰 ${item.name} - Market Data`)
    .setDescription(`Current market information for ${item.name}`);

  if (priceData.averagePrice > 0) {
    embed.addFields({
      name: '📊 Recent Average Price',
      value: `${priceData.averagePrice} coins`,
      inline: true
    });
  }

  if (priceData.highestBuyOffer > 0) {
    embed.addFields({
      name: '💚 Highest Buy Offer',
      value: `${priceData.highestBuyOffer} coins`,
      inline: true
    });
  }

  if (priceData.lowestSellOffer > 0) {
    embed.addFields({
      name: '💰 Lowest Sell Offer',
      value: `${priceData.lowestSellOffer} coins`,
      inline: true
    });
  }

  if (priceData.recentTransactions.length > 0) {
    const transactionText = priceData.recentTransactions.slice(0, 5).map((t: any) => 
      `${t.quantity}x at ${t.pricePerItem} coins each`
    ).join('\n');
    
    embed.addFields({
      name: '📈 Recent Transactions',
      value: transactionText,
      inline: false
    });
  }

  if (priceData.averagePrice === 0 && priceData.highestBuyOffer === 0 && priceData.lowestSellOffer === 0) {
    embed.setDescription(`No market data available for ${item.name}. Be the first to create an offer!`);
  }

  await interaction.reply({ embeds: [embed] });
}

async function handleItemSearch(interaction: any) {
  const query = interaction.options.getString('query');
  const page = interaction.options.getInteger('page') || 1;
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  let searchFilter: any = { status: 'active' };
  
  if (query && query.trim() !== '') {
    const items = await Item.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { id: { $regex: query, $options: 'i' } }
      ]
    });
    
    const itemIds = items.map(item => item.id);
    searchFilter.itemId = { $in: itemIds };
  }

  const [offers, totalOffers] = await Promise.all([
    GrandExchangeOffer.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage),
    GrandExchangeOffer.countDocuments(searchFilter)
  ]);

  const totalPages = Math.ceil(totalOffers / itemsPerPage);

  if (offers.length === 0) {
    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('🔍 No Active Listings Found')
      .setDescription(query ? `No active listings found for "${query}"` : 'No active listings found');
    await interaction.reply({ embeds: [embed] });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('🔍 Active Grand Exchange Listings')
    .setDescription(query ? `Search results for "${query}" (Page ${page}/${totalPages})` : `All active listings (Page ${page}/${totalPages})`);

  const buyOffers = offers.filter(offer => offer.type === 'buy');
  const sellOffers = offers.filter(offer => offer.type === 'sell');

  if (buyOffers.length > 0) {
    const buyText = buyOffers.map(offer => {
      const progress = offer.quantity - offer.quantityRemaining;
      const progressText = progress > 0 ? ` (${progress}/${offer.quantity} filled)` : '';
      return `**${offer.itemName}** - ${offer.quantityRemaining}x at ${offer.pricePerItem} coins each${progressText}\nPlayer: ${offer.playerName}`;
    }).join('\n\n');
    
    embed.addFields({
      name: '💚 Buy Orders',
      value: buyText,
      inline: false
    });
  }

  if (sellOffers.length > 0) {
    const sellText = sellOffers.map(offer => {
      const progress = offer.quantity - offer.quantityRemaining;
      const progressText = progress > 0 ? ` (${progress}/${offer.quantity} filled)` : '';
      return `**${offer.itemName}** - ${offer.quantityRemaining}x at ${offer.pricePerItem} coins each${progressText}\nPlayer: ${offer.playerName}`;
    }).join('\n\n');
    
    embed.addFields({
      name: '💰 Sell Orders',
      value: sellText,
      inline: false
    });
  }

  embed.setFooter({ text: `Page ${page} of ${totalPages} • Total listings: ${totalOffers}` });

  const components = [];
  if (totalPages > 1) {
    components.push(createSearchPaginationButtons(page, totalPages, query || ''));
  }

  await interaction.reply({ embeds: [embed], components });
}

function createSearchPaginationButtons(currentPage: number, totalPages: number, query: string): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();
  
  if (currentPage > 1) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`ge_search_${currentPage - 1}_${encodeURIComponent(query)}`)
        .setLabel('Previous')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('⬅️')
    );
  }
  
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`ge_search_info`)
      .setLabel(`Page ${currentPage}/${totalPages}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
  
  if (currentPage < totalPages) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`ge_search_${currentPage + 1}_${encodeURIComponent(query)}`)
        .setLabel('Next')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('➡️')
    );
  }
  
  return row;
}

export async function handleButton(interaction: any) {
  const customId = interaction.customId;
  
  if (customId.startsWith('ge_search_') && !customId.endsWith('_info')) {
    const parts = customId.split('_');
    if (parts.length >= 3) {
      const page = parseInt(parts[2]);
      const query = parts.length > 3 ? decodeURIComponent(parts.slice(3).join('_')) : '';
      
      if (!isNaN(page)) {
        await handleSearchPagination(interaction, query, page);
      }
    }
  }
}

async function handleSearchPagination(interaction: any, query: string, page: number) {
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  let searchFilter: any = { status: 'active' };
  
  if (query && query.trim() !== '') {
    const items = await Item.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { id: { $regex: query, $options: 'i' } }
      ]
    });
    
    const itemIds = items.map(item => item.id);
    searchFilter.itemId = { $in: itemIds };
  }

  const [offers, totalOffers] = await Promise.all([
    GrandExchangeOffer.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage),
    GrandExchangeOffer.countDocuments(searchFilter)
  ]);

  const totalPages = Math.ceil(totalOffers / itemsPerPage);

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('🔍 Active Grand Exchange Listings')
    .setDescription(query ? `Search results for "${query}" (Page ${page}/${totalPages})` : `All active listings (Page ${page}/${totalPages})`);

  const buyOffers = offers.filter(offer => offer.type === 'buy');
  const sellOffers = offers.filter(offer => offer.type === 'sell');

  if (buyOffers.length > 0) {
    const buyText = buyOffers.map(offer => {
      const progress = offer.quantity - offer.quantityRemaining;
      const progressText = progress > 0 ? ` (${progress}/${offer.quantity} filled)` : '';
      return `**${offer.itemName}** - ${offer.quantityRemaining}x at ${offer.pricePerItem} coins each${progressText}\nPlayer: ${offer.playerName}`;
    }).join('\n\n');
    
    embed.addFields({
      name: '💚 Buy Orders',
      value: buyText,
      inline: false
    });
  }

  if (sellOffers.length > 0) {
    const sellText = sellOffers.map(offer => {
      const progress = offer.quantity - offer.quantityRemaining;
      const progressText = progress > 0 ? ` (${progress}/${offer.quantity} filled)` : '';
      return `**${offer.itemName}** - ${offer.quantityRemaining}x at ${offer.pricePerItem} coins each${progressText}\nPlayer: ${offer.playerName}`;
    }).join('\n\n');
    
    embed.addFields({
      name: '💰 Sell Orders',
      value: sellText,
      inline: false
    });
  }

  embed.setFooter({ text: `Page ${page} of ${totalPages} • Total listings: ${totalOffers}` });

  const components = [];
  if (totalPages > 1) {
    components.push(createSearchPaginationButtons(page, totalPages, query));
  }

  await interaction.update({ embeds: [embed], components });
}

export async function handleAutocomplete(interaction: any) {
  const focusedOption = interaction.options.getFocused(true);
  
  if (focusedOption.name === 'item') {
    const query = focusedOption.value.toLowerCase();
    
    let items;
    if (query.length === 0) {
      items = await Item.find({}).limit(25);
    } else {
      items = await Item.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { id: { $regex: query, $options: 'i' } }
        ]
      }).limit(25);
    }

    const choices = items.map(item => ({
      name: `${item.name} (${item.type})`,
      value: item.id
    }));

    await interaction.respond(choices);
  }
}

export { handleAutocomplete as autocomplete };