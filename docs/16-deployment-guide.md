# Deployment Guide

This guide provides comprehensive instructions for deploying the NPCL Dashboard to various production environments.

## 🎯 Deployment Overview

The NPCL Dashboard can be deployed using several methods:

1. **Vercel** (Recommended) - Serverless deployment with automatic scaling
2. **Docker** - Containerized deployment for any cloud provider
3. **Traditional VPS** - Manual deployment on virtual private servers
4. **Cloud Platforms** - AWS, Google Cloud, Azure deployment

## 🚀 Vercel Deployment (Recommended)

Vercel provides the easiest deployment experience with automatic builds, global CDN, and serverless functions.

### Prerequisites
- GitHub/GitLab/Bitbucket repository
- Vercel account
- PostgreSQL database (external)
- Redis instance (optional)

### Step-by-Step Deployment

#### 1. Prepare Your Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

#### 2. Connect to Vercel
1. Visit [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the NPCL Dashboard repository

#### 3. Configure Environment Variables
In the Vercel dashboard, add these environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
NEXTAUTH_SECRET="your-super-secret-jwt-key-make-it-long-and-random"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional: Redis
REDIS_URL="redis://user:password@host:6379"

# Optional: Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Feature flags
ENABLE_REGISTRATION="false"
ENABLE_EMAIL_NOTIFICATIONS="true"
```

#### 4. Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

#### 5. Deploy
1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete
3. Visit your deployed application

### Custom Domain Setup
```bash
# Add custom domain in Vercel dashboard
1. Go to Project Settings > Domains
2. Add your domain (e.g., dashboard.npcl.com)
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning
```

### Vercel Configuration File
Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 🐳 Docker Deployment

Docker provides consistent deployment across different environments.

### Prerequisites
- Docker and Docker Compose installed
- PostgreSQL database
- Redis instance (optional)

### Production Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose for Production
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/npcl_dashboard
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=npcl_dashboard
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Deployment Commands
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale application
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Update deployment
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Cloud Platform Deployment

### AWS Deployment

#### Using AWS ECS
```yaml
# ecs-task-definition.json
{
  "family": "npcl-dashboard",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "npcl-dashboard",
      "image": "your-account.dkr.ecr.region.amazonaws.com/npcl-dashboard:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:database-url"
        },
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:nextauth-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/npcl-dashboard",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### AWS RDS Setup
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier npcl-dashboard-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name default
```

### Google Cloud Platform

#### Using Cloud Run
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/npcl-dashboard', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/npcl-dashboard']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'npcl-dashboard'
      - '--image'
      - 'gcr.io/$PROJECT_ID/npcl-dashboard'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

#### Deploy to Cloud Run
```bash
# Build and deploy
gcloud builds submit --config cloudbuild.yaml

# Set environment variables
gcloud run services update npcl-dashboard \
  --set-env-vars DATABASE_URL="postgresql://..." \
  --set-env-vars NEXTAUTH_SECRET="..." \
  --region us-central1
```

### Azure Deployment

#### Using Azure Container Instances
```yaml
# azure-container-instance.yaml
apiVersion: 2019-12-01
location: eastus
name: npcl-dashboard
properties:
  containers:
  - name: npcl-dashboard
    properties:
      image: your-registry.azurecr.io/npcl-dashboard:latest
      ports:
      - port: 3000
        protocol: TCP
      environmentVariables:
      - name: NODE_ENV
        value: production
      - name: DATABASE_URL
        secureValue: postgresql://...
      - name: NEXTAUTH_SECRET
        secureValue: your-secret
      resources:
        requests:
          cpu: 1
          memoryInGB: 2
  osType: Linux
  ipAddress:
    type: Public
    ports:
    - protocol: tcp
      port: 3000
tags: {}
type: Microsoft.ContainerInstance/containerGroups
```

## 🖥️ Traditional VPS Deployment

### Prerequisites
- Ubuntu 20.04+ or CentOS 8+ server
- Node.js 18+ installed
- PostgreSQL installed
- Nginx installed
- SSL certificate

### Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2 for process management
sudo npm install -g pm2
```

### Application Deployment
```bash
# Clone repository
git clone https://github.com/your-org/npcl-dashboard.git
cd npcl-dashboard

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with production values

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'npcl-dashboard',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/npcl-dashboard',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/npcl-dashboard-error.log',
      out_file: '/var/log/pm2/npcl-dashboard-out.log',
      log_file: '/var/log/pm2/npcl-dashboard.log',
      time: true
    }
  ]
}
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/npcl-dashboard
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

## 🔧 Database Setup

### PostgreSQL Production Setup
```sql
-- Create production database
CREATE DATABASE npcl_dashboard_prod;

-- Create dedicated user
CREATE USER npcl_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE npcl_dashboard_prod TO npcl_user;

-- Connect to database
\c npcl_dashboard_prod

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO npcl_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO npcl_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO npcl_user;
```

### Database Migration
```bash
# Run migrations in production
npx prisma migrate deploy

# Seed production data (if needed)
npx prisma db seed
```

## 🔒 Security Configuration

### SSL/TLS Setup
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (if external access needed)
sudo ufw status
```

### Environment Security
```bash
# Secure environment file
sudo chown root:root .env
sudo chmod 600 .env

# Secure application directory
sudo chown -R www-data:www-data /path/to/npcl-dashboard
sudo chmod -R 755 /path/to/npcl-dashboard
```

## 📊 Monitoring and Logging

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs npcl-dashboard

# Application metrics
pm2 install pm2-server-monit
```

### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Log rotation
sudo nano /etc/logrotate.d/npcl-dashboard
```

### Health Checks
```bash
# Create health check script
#!/bin/bash
# health-check.sh
curl -f http://localhost:3000/api/health || exit 1
```

## 🔄 CI/CD Pipeline

### GitHub Actions Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/npcl-dashboard
          git pull origin main
          npm install
          npm run build
          pm2 restart npcl-dashboard
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Check connection string
echo $DATABASE_URL
```

#### SSL Certificate Issues
```bash
# Renew SSL certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

#### Performance Issues
```bash
# Monitor application
pm2 monit

# Check system resources
htop
df -h
free -m
```

### Rollback Procedures
```bash
# Rollback with PM2
pm2 stop npcl-dashboard
git checkout previous-commit
npm install
npm run build
pm2 start npcl-dashboard

# Database rollback (if needed)
npx prisma migrate reset
```

---

This deployment guide provides comprehensive instructions for deploying the NPCL Dashboard to production environments with proper security, monitoring, and maintenance procedures.