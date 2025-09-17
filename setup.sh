#!/bin/bash

set -e

echo "🚀 Setting up stampme..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install Node.js and npm first."
    exit 1
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Install globally
echo "🌍 Installing globally..."
npm install -g .

# Install ngrok globally
echo "🌐 Installing ngrok..."
npm install -g ngrok

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) is not installed. Please install it and run 'gh auth login' to authenticate."
    echo "   Install instructions: https://cli.github.com/"
else
    echo "✅ GitHub CLI is installed"
    if ! gh auth status &> /dev/null; then
        echo "⚠️  GitHub CLI is not authenticated. Please run 'gh auth login' to authenticate."
    else
        echo "✅ GitHub CLI is authenticated"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. If needed, authenticate with GitHub: gh auth login"
echo "2. Start the server: stampme server [port]"
echo "3. In another terminal, expose with ngrok: ngrok http [port]"