#!/bin/bash

# Quick Setup Script for Image Optimizer
# Run: bash setup.sh

set -e

echo "╔════════════════════════════════════════╗"
echo "║  Image Optimizer Quick Setup           ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p temp-uploads
mkdir -p public/images/gallery
mkdir -p scripts
mkdir -p components

echo "✅ Directories created"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "⚠️  Warning: package.json not found"
    echo "   Run: npm init -y"
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║         Setup Complete! 🎉             ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Add images to optimize:"
echo "   cp ~/Downloads/*.jpg temp-uploads/"
echo ""
echo "2. Run optimization:"
echo "   npm run images:optimize"
echo ""
echo "3. Check results:"
echo "   npm run images:stats"
echo ""
echo "4. Commit optimized images:"
echo "   git add public/images/"
echo "   git commit -m 'Add optimized gallery images'"
echo ""
echo "📖 Read README.md for complete documentation"
echo ""
