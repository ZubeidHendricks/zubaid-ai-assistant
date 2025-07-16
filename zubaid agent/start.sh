#!/bin/bash

echo "🚀 Starting ZUBAID AI Workflow System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Run setup script
echo "⚙️ Running setup..."
npm run setup

# Set environment variables for this session
export PORT=3001
export NODE_ENV=development

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Starting server on http://localhost:3001"
echo ""
echo "📊 Available interfaces:"
echo "- Main: http://localhost:3001"
echo "- Dashboard: http://localhost:3001/dashboard"
echo "- Human Review: http://localhost:3001/human-review"
echo "- CoE Review: http://localhost:3001/coe-review"
echo "- AI Agents: http://localhost:3001/agents"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start