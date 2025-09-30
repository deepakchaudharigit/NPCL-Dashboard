# Repository Guidelines

## Project Structure & Module Organization

The codebase follows Next.js App Router structure with clear separation of concerns:
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components organized by feature (auth, ui, pwa, mobile)
- `lib/` - Utility libraries including authentication, database, validation, and caching
- `prisma/` - Database schema, migrations, and seed files
- `__tests__/` - Comprehensive test suite mirroring source structure
- `middleware/` - Custom middleware for route protection and RBAC

## Build, Test, and Development Commands

```bash
# Start development server on port 4000
npm run dev

# Build for production with type checking and linting
npm run build

# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed with sample data

# Docker development environment
npm run docker:dev    # Start full stack with PostgreSQL and Redis
```

## Coding Style & Naming Conventions

- **Indentation**: 2 spaces, no tabs
- **File naming**: kebab-case for files, PascalCase for React components
- **Function/variable naming**: camelCase with descriptive names
- **Linting**: ESLint with Next.js configuration, TypeScript strict mode enabled
- **Styling**: Tailwind CSS with custom design system in `tailwind.config.js`

## Testing Guidelines

- **Framework**: Jest with React Testing Library and ts-jest
- **Test files**: `*.test.ts` or `*.test.tsx` in `__tests__/` directory
- **Running tests**: `npm run test` for all tests, `npm run test:watch` for development
- **Coverage**: Minimum coverage tracked for critical authentication and API routes

## Commit & Pull Request Guidelines

- **Commit format**: Descriptive messages following conventional commits pattern
- **PR process**: All changes require testing and type checking to pass
- **Branch naming**: Feature branches with descriptive names
- **Code review**: Focus on security, performance, and maintainability

---

# Repository Tour

## 🎯 What This Repository Does

NPCL Dashboard is a comprehensive Power Management Dashboard for NPCL built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

**Key responsibilities:**
- Real-time power monitoring and analytics with dashboard statistics
- User authentication and role-based access control (Admin, Operator, Viewer)
- Audit logging and system activity tracking
- Report generation and voicebot call management
- Mobile-optimized PWA with responsive design

---

## 🏗️ Architecture Overview

### System Context
```
[Users] → [NPCL Dashboard] → [PostgreSQL Database]
            ↓                      ↓
    [Redis Cache] ← → [Email Service (SMTP)]
            ↓
    [Audit Logs & Analytics]
```

### Key Components
- **Authentication System** - NextAuth.js with JWT strategy, role-based access control, and session management
- **Dashboard Analytics** - Real-time statistics, performance monitoring, and data visualization with Recharts
- **API Layer** - Next.js API routes with Prisma ORM for database operations and Redis caching
- **PWA Features** - Mobile-optimized interface, offline capabilities, and app-like experience
- **Audit System** - Comprehensive logging of user activities and system events

### Data Flow
1. User authenticates via NextAuth.js with credentials provider
2. Middleware validates JWT tokens and enforces role-based access control
3. API routes process requests with Prisma ORM and Redis caching
4. Dashboard components fetch and display real-time statistics and analytics
5. All user activities are logged to audit trail for compliance and monitoring

---

## 📁 Project Structure [Partial Directory Tree]

```
npcl-dashboard/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── dashboard/     # Dashboard statistics API
│   │   ├── analytics/     # Analytics and monitoring
│   │   └── reports/       # Report generation
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout with PWA features
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── ui/                # Reusable UI components
│   ├── mobile/            # Mobile-optimized components
│   ├── pwa/               # PWA-specific components
│   └── layout/            # Layout components
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── nextauth.ts        # NextAuth.js configuration
│   ├── prisma.ts          # Prisma client
│   ├── validations.ts     # Zod validation schemas
│   ├── cache/             # Redis caching utilities
│   └── monitoring/        # Performance monitoring
├── prisma/                # Database schema and migrations
├── middleware.ts          # Route protection and RBAC
├── types/                 # TypeScript type definitions
└── config/                # Configuration files
```

### Key Files to Know

| File | Purpose | When You'd Touch It |
|------|---------|---------------------|
| `app/layout.tsx` | Root layout with PWA and SEO features | Adding global providers or meta tags |
| `lib/nextauth.ts` | NextAuth.js configuration | Modifying authentication logic |
| `prisma/schema.prisma` | Database schema definition | Adding new models or fields |
| `middleware.ts` | Route protection and RBAC | Changing access control rules |
| `lib/validations.ts` | Zod validation schemas | Adding new form validations |
| `app/api/dashboard/stats/route.ts` | Dashboard statistics API | Modifying dashboard metrics |
| `components/auth/RoleGuard.tsx` | Role-based component rendering | Adding permission checks |
| `package.json` | Dependencies and scripts | Adding new packages or commands |
| `docker-compose.yml` | Development environment setup | Changing dev environment |
| `tailwind.config.js` | Styling configuration | Customizing design system |

---

## 🔧 Technology Stack

### Core Technologies
- **Language:** TypeScript (5.3.3) - Type safety and better developer experience
- **Framework:** Next.js (15.4.0) - Full-stack React framework with App Router
- **Database:** PostgreSQL - Relational database for structured data
- **ORM:** Prisma (6.14.0) - Type-safe database client and migrations

### Key Libraries
- **NextAuth.js (4.24.5)** - Authentication with JWT sessions and role-based access
- **Tailwind CSS (3.3.6)** - Utility-first CSS framework for responsive design
- **Zod (3.22.4)** - TypeScript-first schema validation for forms and APIs
- **Recharts (2.8.0)** - Data visualization and charting library
- **Redis (ioredis 5.7.0)** - Caching layer for performance optimization
- **bcryptjs (2.4.3)** - Password hashing for secure authentication

### Development Tools
- **Jest (29.7.0)** - Testing framework with React Testing Library
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking and IntelliSense
- **Docker** - Containerization for development and deployment

---

## 🌐 External Dependencies

### Required Services
- **PostgreSQL Database** - Primary data storage for users, audit logs, and application data
- **Redis Cache** - Performance optimization for dashboard statistics and session storage
- **SMTP Email Service** - Password reset and notification emails (optional)

### Optional Integrations
- **Performance Monitoring** - Web vitals tracking and lighthouse auditing
- **SEO Optimization** - Structured data and meta tag management

### Environment Variables

```bash
# Required
DATABASE_URL=              # PostgreSQL connection string
NEXTAUTH_SECRET=           # JWT secret for NextAuth.js
NEXTAUTH_URL=              # Application URL for callbacks

# Optional
REDIS_URL=                 # Redis connection for caching
EMAIL_HOST=                # SMTP host for notifications
EMAIL_USER=                # SMTP username
EMAIL_PASS=                # SMTP password
```

---

## 🔄 Common Workflows

### User Authentication Flow
1. User submits credentials via LoginForm component
2. NextAuth.js validates credentials against Prisma database
3. JWT token is generated and stored in secure HTTP-only cookies
4. Middleware validates token on subsequent requests and enforces RBAC
5. User activities are logged to audit trail for compliance

**Code path:** `components/auth/LoginForm.tsx` → `lib/nextauth.ts` → `middleware.ts`

### Dashboard Statistics Workflow
1. Dashboard component requests statistics from API endpoint
2. API route checks Redis cache for existing data
3. If cache miss, queries PostgreSQL via Prisma for fresh data
4. Results are cached in Redis and returned to client
5. Dashboard renders statistics with loading states and error handling

**Code path:** `components/dashboard/DashboardStats.tsx` → `app/api/dashboard/stats/route.ts` → `lib/cache/`

---

## 📈 Performance & Scale

### Performance Considerations
- **Redis Caching:** Dashboard statistics cached with TTL for faster response times
- **Database Optimization:** Prisma queries with proper indexing and connection pooling
- **PWA Features:** Service worker for offline capabilities and app-like experience
- **Image Optimization:** Next.js Image component with lazy loading and WebP support

### Monitoring
- **Web Vitals:** Core Web Vitals tracking for performance metrics
- **Audit Logging:** Comprehensive activity tracking for security and compliance
- **Health Checks:** API endpoints for monitoring application status

---

## 🚨 Things to Be Careful About

### 🔒 Security Considerations
- **Authentication:** NextAuth.js with secure JWT tokens and HTTP-only cookies
- **Role-Based Access:** Middleware enforces permissions at route level
- **Password Security:** bcryptjs hashing with salt rounds for secure storage
- **Input Validation:** Zod schemas validate all user inputs and API parameters
- **Audit Trail:** All user activities logged for security monitoring

*Updated at: 2025-01-09 UTC*
*Last commit: a4a369a7ea2ae9ebe33048a29792e0ce05feb242*