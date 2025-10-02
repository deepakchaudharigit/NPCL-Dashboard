# Database Authentication Fix

## 🚨 Problem Solved
The `CredentialsSignin` error was caused by a **database connection issue**, not an authentication problem.

## 🔍 Root Cause
1. **System Environment Variable**: A system-level `DATABASE_URL` was set to PostgreSQL
2. **Schema Mismatch**: Prisma schema was configured for SQLite
3. **User Data Missing**: Database wasn't seeded with admin user

## ✅ Solution Applied

### 1. Fixed Database Connection
```bash
# The system had this environment variable set:
DATABASE_URL=postgresql://postgres:password@localhost:5433/npcl_dashboard?schema=public

# But the schema expects SQLite:
DATABASE_URL="file:dev.db"
```

### 2. Seeded Database with Users
```bash
# Created admin user with credentials:
Email: admin@npcl.com
Password: admin123

# Also created:
- operator@npcl.com / operator123
- viewer@npcl.com / viewer123
```

### 3. Created Fix Script
A helper script `fix-database-env.sh` was created to handle the environment variable issue.

## 🚀 How to Run the Application

### Option 1: Using the Fix Script (Recommended)
```bash
./fix-database-env.sh npm run dev
```

### Option 2: Manual Environment Override
```bash
export DATABASE_URL="file:dev.db" && npm run dev
```

### Option 3: Permanent Fix (Optional)
Add this to your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
# Unset system DATABASE_URL for NPCL Dashboard
unset DATABASE_URL
```

## 🔐 Login Credentials

Now you can login with:

**Admin User:**
- Email: `admin@npcl.com`
- Password: `admin123`

**Operator User:**
- Email: `operator@npcl.com`
- Password: `operator123`

**Viewer User:**
- Email: `viewer@npcl.com`
- Password: `viewer123`

## 🛠️ Database Commands

### Seed Database (if needed)
```bash
./fix-database-env.sh npm run db:seed
```

### Push Schema Changes
```bash
./fix-database-env.sh npm run db:push
```

### Generate Prisma Client
```bash
./fix-database-env.sh npm run db:generate
```

### Open Database Studio
```bash
./fix-database-env.sh npm run db:studio
```

## 📁 Database Files

- **SQLite Database**: `dev.db` (in project root)
- **Prisma Schema**: `prisma/schema.prisma`
- **Seed Script**: `prisma/seed.ts`

## 🔄 What Was Fixed

1. ✅ **Database Connection**: Fixed SQLite URL format
2. ✅ **User Seeding**: Created admin, operator, and viewer users
3. ✅ **Environment Variables**: Resolved system vs local .env conflict
4. ✅ **Prisma Client**: Generated and synchronized
5. ✅ **Authentication**: Users can now login successfully

## 🎯 Next Steps

1. **Start the application**: `./fix-database-env.sh npm run dev`
2. **Visit**: http://localhost:4000
3. **Login**: Use admin@npcl.com / admin123
4. **Access Dashboard**: You should now see the dynamic dashboard with real data

## 🚨 Important Notes

- The system environment variable `DATABASE_URL` was overriding the `.env` file
- This is a common issue in development environments
- The fix script ensures the correct database connection is used
- All user passwords are hashed with bcrypt for security

## 🔧 Troubleshooting

If you still have issues:

1. **Check if server is running**: `lsof -i :4000`
2. **Kill existing process**: `kill -9 $(lsof -t -i:4000)`
3. **Clear Next.js cache**: `rm -rf .next`
4. **Restart with fix**: `./fix-database-env.sh npm run dev`

The authentication should now work perfectly! 🎉