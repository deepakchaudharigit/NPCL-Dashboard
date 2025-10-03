# Installation Guide

This guide will walk you through setting up the NPCL Dashboard on your local development environment.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Database**: PostgreSQL 12+ (or SQLite for development)
- **Redis**: Optional, for caching (recommended for production)

### Development Tools (Recommended)
- **VS Code**: With TypeScript and Prisma extensions
- **Docker**: For containerized development
- **Postman**: For API testing

## 🚀 Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/npcl-dashboard.git
cd npcl-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:4000`

## 🔧 Detailed Installation

### Step 1: System Preparation

#### Install Node.js
```bash
# Using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

#### Verify Installation
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### Step 2: Database Setup

#### Option A: PostgreSQL (Production)

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # Windows - Download from https://www.postgresql.org/download/
   ```

2. **Create Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE npcl_dashboard;
   CREATE USER npcl_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE npcl_dashboard TO npcl_user;
   \q
   ```

3. **Update Environment Variables**
   ```env
   DATABASE_URL="postgresql://npcl_user:your_password@localhost:5432/npcl_dashboard"
   ```

#### Option B: SQLite (Development)

SQLite is configured by default for development. No additional setup required.

```env
DATABASE_URL="file:./dev.db"
```

### Step 3: Redis Setup (Optional but Recommended)

#### Install Redis
```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS with Homebrew
brew install redis
brew services start redis

# Windows - Use Docker or WSL
```

#### Configure Redis
```env
REDIS_URL="redis://localhost:6379"
```

### Step 4: Environment Configuration

Create and configure your `.env` file:

```env
# Database
DATABASE_URL="postgresql://npcl_user:password@localhost:5432/npcl_dashboard"

# Authentication
NEXTAUTH_SECRET="your-super-secret-jwt-key-make-it-long-and-random"
NEXTAUTH_URL="http://localhost:4000"

# Optional: Redis for caching
REDIS_URL="redis://localhost:6379"

# Optional: Email configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Optional: Feature flags
ENABLE_REGISTRATION="true"
ENABLE_EMAIL_NOTIFICATIONS="false"

# Optional: Performance settings
DASHBOARD_REFRESH_INTERVAL="30000"
ALERTS_REFRESH_INTERVAL="10000"
```

### Step 5: Database Migration and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Apply database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### Step 6: Verify Installation

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm run test

# Start development server
npm run dev
```

## 🐳 Docker Installation

### Prerequisites
- Docker Desktop installed
- Docker Compose available

### Quick Docker Setup

```bash
# Clone repository
git clone https://github.com/your-organization/npcl-dashboard.git
cd npcl-dashboard

# Start with Docker Compose
npm run docker:dev
```

This will start:
- NPCL Dashboard application on port 4000
- PostgreSQL database on port 5432
- Redis cache on port 6379

### Docker Environment Variables

Create `.env.docker` file:

```env
# Database (Docker)
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/npcl-auth-db"

# Authentication
NEXTAUTH_SECRET="your-super-secret-jwt-key-make-it-long-and-random"
NEXTAUTH_URL="http://localhost:4000"

# Redis (Docker)
REDIS_URL="redis://redis:6379"

# PostgreSQL (Docker)
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="npcl-auth-db"
```

### Docker Commands

```bash
# Start development environment
npm run docker:dev

# Start in detached mode
npm run docker:dev:detached

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Reset and restart
npm run docker:fix:restart
```

## 🔍 Verification Steps

### 1. Application Access
- Navigate to `http://localhost:4000`
- You should see the NPCL Dashboard login page

### 2. Default User Accounts
After seeding, you can log in with:

| Role     | Email             | Password    |
|----------|-------------------|-------------|
| Admin    | admin@npcl.com    | admin123    |
| Operator | operator@npcl.com | operator123 |
| Viewer   | viewer@npcl.com   | viewer123   |

### 3. Database Connection
```bash
# Check database connection
npm run db:studio
```

### 4. API Endpoints
Test API endpoints:
- `GET http://localhost:4000/api/health` - Health check
- `POST http://localhost:4000/api/auth/test-connection` - Database test

## 🛠️ Development Tools Setup

### VS Code Extensions
Install these recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

### VS Code Settings
Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port
npm run dev -- -p 3000
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check database exists
psql -U postgres -l
```

#### Prisma Issues
```bash
# Reset Prisma
npx prisma migrate reset

# Regenerate client
npx prisma generate

# Push schema
npx prisma db push
```

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Environment Issues

#### Missing Environment Variables
```bash
# Validate environment
npm run validate:env
```

#### Permission Issues
```bash
# Fix Prisma permissions
npm run prisma:fix
```

### Docker Issues

#### Docker Build Fails
```bash
# Clean Docker
npm run docker:clean

# Rebuild
npm run docker:dev
```

#### Database Connection in Docker
```bash
# Check container logs
docker-compose logs postgres

# Connect to database
npm run docker:shell:db
```

## 📚 Next Steps

After successful installation:

1. **Read the [Quick Start Guide](./03-quick-start.md)** for basic usage
2. **Review [Development Guide](./08-development-guide.md)** for development workflow
3. **Check [API Documentation](./06-api-documentation.md)** for API details
4. **Explore [Component Library](./09-component-library.md)** for UI components

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](./25-troubleshooting.md)
2. Review [FAQ](./26-faq.md)
3. Create an issue in the GitHub repository
4. Contact the development team

---

You're now ready to start developing with the NPCL Dashboard!