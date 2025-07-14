#!/bin/bash

# Eternals Rebirth - Database Reset Script
# This script completely removes all MongoDB data and Docker volumes

echo "WARNING: This will completely delete ALL database data!"
echo "This action cannot be undone."
echo ""
read -p "Are you sure you want to continue? (type 'YES' to confirm): " confirmation

if [ "$confirmation" != "YES" ]; then
    echo "Operation cancelled."
    exit 1
fi

echo ""
echo "Stopping all containers..."
docker compose down

echo ""
echo "Removing Docker volumes..."
docker volume rm eternals-rebirth_mongodb_data 2>/dev/null || echo "Volume 'eternals-rebirth_mongodb_data' not found (already removed)"

echo ""
echo "Removing any orphaned containers..."
docker-compose down --remove-orphans

echo ""
echo "Listing remaining volumes (should be empty for this project)..."
docker volume ls | grep eternals-rebirth || echo "No eternals-rebirth volumes found"

echo ""
echo "Database reset complete!"
echo ""
echo "To start fresh:"
echo "1. Run: docker-compose up -d"
echo "2. The bot will automatically recreate the database structure"
echo "3. Use /register to create a new character"