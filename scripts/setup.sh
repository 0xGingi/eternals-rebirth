#!/bin/bash

echo "Setting up Eternals Rebirth Telegram Bot..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.docker .env
    echo "Please edit .env file with your credentials:"
    echo "   - TELEGRAM_TOKEN=your_bot_token"
    echo "   - MONGO_ROOT_PASSWORD=your_secure_password"
    echo ""
    echo "Get your Telegram bot token from @BotFather in Telegram"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
fi

mkdir -p logs

echo " Building Docker containers..."
docker-compose build

echo "Starting services..."
docker-compose up -d

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to initialize..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "Services are running!"
    echo ""
    echo "Service Status:"
    docker-compose ps
    echo ""
    echo "To view logs:"
    echo "   docker-compose logs -f bot"
    echo "   docker-compose logs -f mongodb"
    echo ""
    echo "To stop services:"
    echo "   docker-compose down"
    echo ""
    echo "To restart services:"
    echo "   docker-compose restart"
else
    echo "Failed to start services. Check logs with:"
    echo "   docker-compose logs"
fi
