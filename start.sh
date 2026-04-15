#!/bin/bash

echo "🎮 Starting Multiplayer Tic-Tac-Toe..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Build backend if not already built
if [ ! -d "backend/build" ]; then
  echo "📦 Building backend modules..."
  cd backend
  npm install
  npm run build
  cd ..
  echo "✅ Backend built successfully"
  echo ""
fi

# Start Docker services
echo "🐳 Starting Nakama server..."
cd docker
docker-compose up -d
echo "✅ Nakama server started"
echo ""

# Wait for Nakama to be ready
echo "⏳ Waiting for Nakama to be ready..."
sleep 10

# Check if Nakama is running
if docker-compose ps | grep -q "nakama.*Up"; then
  echo "✅ Nakama is running"
else
  echo "❌ Nakama failed to start. Check logs with: cd docker && docker-compose logs"
  exit 1
fi

cd ..

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
  echo "✅ Frontend dependencies installed"
  echo ""
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Access points:"
echo "   - Nakama Console: http://localhost:7351 (admin/password)"
echo "   - Nakama API: http://localhost:7350"
echo ""
echo "🚀 Starting frontend development server..."
echo "   - Frontend will be available at: http://localhost:3000"
echo ""
echo "To stop the servers:"
echo "   - Press Ctrl+C to stop frontend"
echo "   - Run: cd docker && docker-compose down"
echo ""

# Start frontend
cd frontend
npm run dev
