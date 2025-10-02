#!/bin/bash

echo "🚀 Setting up ClearCut Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and fill in your API keys"
    exit 1
fi

# Build MCP server images
echo "📦 Building MCP server images..."
docker-compose --profile build build

# Start services
echo "🐳 Starting services..."
docker-compose up -d mongodb qdrant

echo "⏳ Waiting for databases to be ready..."
sleep 10

# Start MCP Gateway and Backend
docker-compose up -d mcp-gateway backend

echo "✅ Setup complete!"
echo "🔗 Backend API: http://localhost:3000"
echo "🔗 Health Check: http://localhost:3000/health"
echo "📊 MongoDB: localhost:27017"
echo "🔍 Qdrant: localhost:6333"