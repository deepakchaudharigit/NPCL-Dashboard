# Troubleshooting Guide

This guide provides solutions to common issues encountered while developing, deploying, or using the NPCL Dashboard.

## 🚨 Common Issues

### Installation and Setup Issues

#### Node.js Version Conflicts
**Problem**: Application fails to start due to Node.js version mismatch
```bash
Error: The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check current Node.js version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Verify version
node --version  # Should be 18.x.x or higher
```

#### Package Installation Failures
**Problem**: npm install fails with dependency conflicts
```bash
npm ERR! peer dep missing
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, use legacy peer deps
npm install --legacy-peer-deps
```

#### Environment Variable Issues
**Problem**: Application fails to start due to missing environment variables
```bash
Error: NEXTAUTH_SECRET environment variable is not set
```

**Solution**:
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with required values
nano .env

# Verify environment variables are loaded
npm run validate:env
```

### Database Issues

#### Database Connection Failures
**Problem**: Cannot connect to database
```bash
Error: P1001: Can't reach database server
```

**Solutions**:
```bash
# Check database status (PostgreSQL)
sudo systemctl status postgresql

# Start database if stopped
sudo systemctl start postgresql

# Test connection manually
psql -h localhost -U postgres -d npcl_dashboard

# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:password@host:port/database
```

#### Prisma Client Issues
**Problem**: Prisma client not generated or outdated
```bash
Error: @prisma/client did not initialize yet
```

**Solutions**:
```bash
# Generate Prisma client
npx prisma generate

# If schema changed, push changes
npx prisma db push

# Reset database (development only)
npx prisma migrate reset

# Check Prisma status
npx prisma status
```

#### Migration Failures
**Problem**: Database migrations fail
```bash
Error: Migration failed to apply cleanly to the shadow database
```

**Solutions**:
```bash
# Reset migrations (development only)
npx prisma migrate reset

# Apply migrations manually
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Create new migration
npx prisma migrate dev --name fix_migration_issue
```

### Authentication Issues

#### NextAuth.js Session Problems
**Problem**: User sessions not persisting
```bash
Session is null after successful login
```

**Solutions**:
```bash
# Check NEXTAUTH_URL matches your domain
echo $NEXTAUTH_URL
# Should match your application URL exactly

# Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET
# Should be a long, random string

# Clear browser cookies and try again
# Check browser developer tools for cookie issues

# Enable NextAuth.js debug mode
NEXTAUTH_DEBUG=true npm run dev
```

#### JWT Token Issues
**Problem**: JWT tokens invalid or expired
```bash
Error: Invalid token signature
```

**Solutions**:
```bash
# Check JWT secret consistency
echo $NEXTAUTH_SECRET

# Clear all sessions
# In browser: Clear cookies for your domain

# Restart application
npm run dev

# Check token in debug endpoint (development only)
curl http://localhost:4000/api/debug/tokens
```

#### Role-based Access Control Issues
**Problem**: Users can access restricted routes
```bash
User with VIEWER role accessing admin routes
```

**Solutions**:
```bash
# Check middleware configuration
cat middleware.ts

# Verify user role in database
npx prisma studio
# Check users table for correct roles

# Clear user sessions and re-login
# Check RoleGuard component implementation
```

### Development Server Issues

#### Port Already in Use
**Problem**: Development server cannot start
```bash
Error: listen EADDRINUSE: address already in use :::4000
```

**Solutions**:
```bash
# Find process using port 4000
lsof -ti:4000

# Kill the process
kill -9 $(lsof -ti:4000)

# Or use different port
npm run dev -- -p 3001

# Check what's running on port
netstat -tulpn | grep :4000
```

#### Hot Reload Not Working
**Problem**: Changes not reflected in browser
```bash
Files changing but browser not updating
```

**Solutions**:
```bash
# Restart development server
npm run dev

# Clear Next.js cache
rm -rf .next

# Check file watcher limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Disable browser cache in developer tools
# F12 > Network tab > Disable cache
```

#### TypeScript Errors
**Problem**: TypeScript compilation errors
```bash
Type 'string' is not assignable to type 'UserRole'
```

**Solutions**:
```bash
# Run type checking
npm run typecheck

# Restart TypeScript server in VS Code
Ctrl+Shift+P > "TypeScript: Restart TS Server"

# Check tsconfig.json configuration
cat tsconfig.json

# Update type definitions
npm install @types/node @types/react --save-dev
```

### Build and Production Issues

#### Build Failures
**Problem**: Production build fails
```bash
Error: Build failed with errors
```

**Solutions**:
```bash
# Clear build cache
rm -rf .next

# Run type checking first
npm run typecheck

# Run linting
npm run lint

# Build with verbose output
npm run build -- --debug

# Check for memory issues
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Static Export Issues
**Problem**: Static export fails with dynamic routes
```bash
Error: Dynamic routes cannot be used with "output: export"
```

**Solutions**:
```bash
# Remove output: 'export' from next.config.js for dynamic routes
# Or implement generateStaticParams for dynamic routes

# Check next.config.js configuration
cat next.config.js

# Use standalone output for Docker
output: 'standalone'
```

#### Environment Variables in Production
**Problem**: Environment variables not available in production
```bash
process.env.DATABASE_URL is undefined
```

**Solutions**:
```bash
# Check environment variables are set
printenv | grep DATABASE_URL

# For Vercel: Set in dashboard
# For Docker: Check docker-compose.yml
# For VPS: Check .env file permissions

# Verify variables in build process
echo "DATABASE_URL=$DATABASE_URL" >> .env.local
```

### Performance Issues

#### Slow Page Load Times
**Problem**: Pages loading slowly
```bash
Initial page load takes > 5 seconds
```

**Solutions**:
```bash
# Analyze bundle size
npm run analyze:bundle

# Check for large dependencies
npx webpack-bundle-analyzer .next/static/chunks/*.js

# Optimize images
# Use Next.js Image component
# Convert to WebP format

# Enable compression in next.config.js
compress: true

# Check database query performance
# Add database indexes
# Optimize Prisma queries
```

#### Memory Leaks
**Problem**: Application memory usage increasing over time
```bash
Memory usage continuously growing
```

**Solutions**:
```bash
# Monitor memory usage
pm2 monit

# Check for memory leaks in code
# Remove event listeners properly
# Clear intervals and timeouts
# Use React.memo for expensive components

# Restart application periodically
pm2 restart npcl-dashboard

# Increase memory limit
NODE_OPTIONS="--max-old-space-size=2048" npm start
```

#### Database Performance Issues
**Problem**: Slow database queries
```bash
Queries taking > 1 second to execute
```

**Solutions**:
```bash
# Enable Prisma query logging
DEBUG=prisma:query npm run dev

# Add database indexes
# Check schema.prisma for missing indexes

# Optimize queries
# Use select to limit fields
# Implement pagination
# Use database-level aggregation

# Monitor database performance
# Check PostgreSQL slow query log
```

### Docker Issues

#### Docker Build Failures
**Problem**: Docker image build fails
```bash
Error: Docker build failed at step X
```

**Solutions**:
```bash
# Clear Docker cache
docker system prune -a

# Build with no cache
docker build --no-cache -t npcl-dashboard .

# Check Dockerfile syntax
docker build --dry-run .

# Build with verbose output
docker build --progress=plain -t npcl-dashboard .
```

#### Container Startup Issues
**Problem**: Container fails to start
```bash
Container exits immediately after start
```

**Solutions**:
```bash
# Check container logs
docker logs container-name

# Run container interactively
docker run -it npcl-dashboard sh

# Check environment variables
docker exec container-name printenv

# Verify port mapping
docker ps -a
```

#### Database Connection in Docker
**Problem**: Cannot connect to database from container
```bash
Error: getaddrinfo ENOTFOUND postgres
```

**Solutions**:
```bash
# Check docker-compose.yml network configuration
# Ensure services are in same network

# Use service names for internal communication
DATABASE_URL=postgresql://user:pass@postgres:5432/db

# Check container networking
docker network ls
docker network inspect bridge

# Test connectivity
docker exec app-container ping postgres-container
```

### API Issues

#### API Routes Not Working
**Problem**: API endpoints returning 404
```bash
GET /api/dashboard/stats - 404 Not Found
```

**Solutions**:
```bash
# Check file structure
ls -la app/api/dashboard/

# Verify route.ts file exists
cat app/api/dashboard/stats/route.ts

# Check export statements
# Must export GET, POST, etc. functions

# Restart development server
npm run dev

# Check Next.js routing
# Ensure proper App Router structure
```

#### CORS Issues
**Problem**: Cross-origin requests blocked
```bash
Access to fetch blocked by CORS policy
```

**Solutions**:
```bash
# Add CORS headers in API routes
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')

# Or use cors middleware
npm install cors
npm install @types/cors

# Configure in next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ]
}
```

#### Rate Limiting Issues
**Problem**: API requests being rate limited
```bash
Error: Too Many Requests (429)
```

**Solutions**:
```bash
# Check rate limiting configuration
cat lib/rate-limiting.ts

# Increase rate limits for development
# Implement user-specific rate limiting
# Add rate limit headers for debugging

# Clear rate limit cache
# Restart Redis if using Redis for rate limiting
```

### Deployment Issues

#### Vercel Deployment Failures
**Problem**: Vercel build fails
```bash
Build failed with exit code 1
```

**Solutions**:
```bash
# Check build logs in Vercel dashboard
# Verify environment variables are set
# Check function timeout limits

# Test build locally
npm run build

# Check vercel.json configuration
cat vercel.json

# Redeploy with verbose logging
vercel --debug
```

#### SSL Certificate Issues
**Problem**: SSL certificate not working
```bash
NET::ERR_CERT_AUTHORITY_INVALID
```

**Solutions**:
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Verify DNS configuration
dig your-domain.com

# Check Nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

#### PM2 Process Issues
**Problem**: PM2 processes crashing
```bash
Process stopped unexpectedly
```

**Solutions**:
```bash
# Check PM2 logs
pm2 logs npcl-dashboard

# Restart process
pm2 restart npcl-dashboard

# Check process status
pm2 status

# Monitor process
pm2 monit

# Check system resources
free -m
df -h
```

## 🔧 Debugging Tools

### Development Debugging
```bash
# Enable debug mode
DEBUG=* npm run dev

# Debug specific modules
DEBUG=prisma:* npm run dev
DEBUG=next:* npm run dev

# Node.js inspector
npm run dev:debug
# Then open chrome://inspect in Chrome
```

### Database Debugging
```bash
# Prisma Studio
npx prisma studio

# Database logs (PostgreSQL)
sudo tail -f /var/log/postgresql/postgresql-*.log

# Query performance
EXPLAIN ANALYZE SELECT * FROM users;
```

### Network Debugging
```bash
# Check network connectivity
ping google.com
curl -I https://your-domain.com

# Check DNS resolution
nslookup your-domain.com
dig your-domain.com

# Check port accessibility
telnet your-domain.com 443
nc -zv your-domain.com 443
```

### Performance Debugging
```bash
# Node.js profiling
node --prof app.js
node --prof-process isolate-*.log > processed.txt

# Memory usage
node --inspect --max-old-space-size=4096 app.js

# Bundle analysis
npm run analyze:bundle
```

## 📞 Getting Help

### Before Seeking Help
1. **Check this troubleshooting guide**
2. **Search existing GitHub issues**
3. **Check the FAQ section**
4. **Review relevant documentation**
5. **Try the suggested solutions**

### When Reporting Issues
Include the following information:

```markdown
## Environment
- Node.js version: 
- npm version: 
- Operating System: 
- Browser (if applicable): 

## Issue Description
Brief description of the problem

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
```
Paste any error messages here
```

## Additional Context
Any other relevant information
```

### Support Channels
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check all documentation first
- **Development Team**: Contact for urgent issues
- **Community**: Stack Overflow with `npcl-dashboard` tag

### Emergency Contacts
For production issues:
1. **Check system status** first
2. **Review monitoring alerts**
3. **Contact on-call engineer**
4. **Follow incident response procedures**

---

This troubleshooting guide covers the most common issues. If you encounter a problem not listed here, please contribute by adding it to help other developers.