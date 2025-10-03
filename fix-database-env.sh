#!/bin/bash

# Fix Database Environment Script
# This script helps fix common database environment issues

echo "🔧 Fixing Database Environment Configuration..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ DATABASE_URL not found in .env"
    echo "Adding default SQLite configuration..."
    echo 'DATABASE_URL="file:dev.db"' >> .env
    echo "✅ Added DATABASE_URL to .env"
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🔄 Pushing database schema..."
npx prisma db push

echo "✅ Database environment configuration fixed!"
echo ""
echo "Next steps:"
echo "1. Update .env with your actual database credentials if needed"
echo "2. Run 'npm run db:seed' to populate with sample data"
echo "3. Run 'npm run dev' to start the development server"