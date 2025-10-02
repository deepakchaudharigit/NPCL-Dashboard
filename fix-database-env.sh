#!/bin/bash

# Fix Database Environment Variable
# This script fixes the DATABASE_URL environment variable issue

echo "🔧 Fixing DATABASE_URL environment variable..."

# Check if DATABASE_URL is set in system environment
if [ ! -z "$DATABASE_URL" ]; then
    echo "⚠️  System DATABASE_URL found: $DATABASE_URL"
    echo "📝 This needs to be unset to use the .env file"
fi

# Export the correct DATABASE_URL for SQLite
export DATABASE_URL="file:dev.db"
echo "✅ Set DATABASE_URL to: $DATABASE_URL"

# Run the command passed as arguments
if [ $# -gt 0 ]; then
    echo "🚀 Running: $@"
    exec "$@"
else
    echo "💡 Usage: ./fix-database-env.sh [command]"
    echo "   Example: ./fix-database-env.sh npm run dev"
    echo "   Example: ./fix-database-env.sh npm run db:seed"
fi