# Authentication & Authorization

This document provides comprehensive information about the authentication and authorization system implemented in the NPCL Dashboard.

## 🔐 Authentication Overview

The NPCL Dashboard uses a robust authentication system built on **NextAuth.js** with the following features:

- **JWT-based Authentication**: Stateless token-based authentication
- **Role-based Access Control (RBAC)**: Three-tier permission system
- **Session Management**: Secure session handling with automatic expiration
- **Password Security**: bcrypt hashing with salt rounds
- **Audit Logging**: Complete authentication activity tracking

## 🏗️ Authentication Architecture

```mermaid
graph TD
    A[User Login] --> B[NextAuth.js Provider]
    B --> C[Credentials Validation]
    C --> D[Database User Lookup]
    D --> E[Password Verification]
    E --> F[JWT Token Generation]
    F --> G[Session Cookie Set]
    G --> H[Middleware Validation]
    H --> I[Route Access Control]
    I --> J[API Authorization]
```

## 🔑 Authentication Flow

### 1. User Registration
```typescript
// Registration process
1. User submits registration form
2. Input validation with Zod schemas
3. Email uniqueness check
4. Password hashing with bcrypt
5. User creation in database
6. Audit log entry
7. Success response
```

### 2. User Login
```typescript
// Login process
1. User submits credentials
2. NextAuth.js credentials provider
3. Database user lookup
4. Password verification
5. JWT token generation
6. Session cookie creation
7. Redirect to dashboard
8. Audit log entry
```

### 3. Session Validation
```typescript
// Session validation
1. Request intercepted by middleware
2. JWT token extraction from cookie
3. Token signature verification
4. Token expiration check
5. User role extraction
6. Route authorization check
7. Request forwarding or rejection
```

## 🛡️ Security Implementation

### Password Security
```typescript
// Password hashing configuration
import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12) // 12 salt rounds
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
```

### Password Policy
```typescript
// Password validation rules
const passwordValidator = (password: string): boolean => {
  return (
    password.length >= 8 &&                    // Minimum 8 characters
    /[A-Z]/.test(password) &&                 // At least one uppercase
    /[a-z]/.test(password) &&                 // At least one lowercase
    /\d/.test(password) &&                    // At least one number
    /[!@#$%^&*(),.?":{}|<>]/.test(password)   // At least one special char
  )
}
```

### JWT Configuration
```typescript
// NextAuth.js JWT configuration
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  cookies: {
    sessionToken: {
      name: `${isProduction ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        maxAge: 24 * 60 * 60, // 24 hours
      },
    },
  },
}
```

## 👥 Role-Based Access Control

### User Roles
```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER'
}
```

### Permission Matrix

| Feature | Admin | Operator | Viewer |
|---------|-------|----------|--------|
| **Dashboard** |
| View Dashboard | ✅ | ✅ | ✅ |
| Export Data | ✅ | ✅ | ❌ |
| **User Management** |
| View Users | ✅ | ❌ | ❌ |
| Create Users | ✅ | ❌ | ❌ |
| Edit Users | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| **Reports** |
| View Reports | ✅ | ✅ | ✅ |
| Generate Reports | ✅ | ✅ | ❌ |
| Export Reports | ✅ | ✅ | ❌ |
| **VoiceBot Calls** |
| View Calls | ✅ | ✅ | ✅ |
| Manage Calls | ✅ | ✅ | ❌ |
| Export Call Data | ✅ | ✅ | ❌ |
| **Settings** |
| View Settings | ✅ | ✅ | ✅ |
| Modify Settings | ✅ | ❌ | ❌ |
| System Config | ✅ | ❌ | ❌ |

### Role Implementation

#### Middleware-level Authorization
```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl
    const userRole = token.role as UserRole

    // Admin-only routes
    const adminRoutes = ['/admin', '/api/auth/users', '/settings/users']
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    
    if (isAdminRoute && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', req.url))
    }

    // Operator+ routes
    const operatorRoutes = ['/reports/generate', '/api/reports/export']
    const isOperatorRoute = operatorRoutes.some(route => pathname.startsWith(route))
    
    if (isOperatorRoute && userRole === UserRole.VIEWER) {
      return NextResponse.redirect(new URL('/dashboard?error=insufficient-permissions', req.url))
    }

    return NextResponse.next()
  }
)
```

#### Component-level Authorization
```typescript
// RoleGuard component
interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { data: session } = useSession()
  
  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return fallback || <div>Access denied</div>
  }
  
  return <>{children}</>
}

// Usage
<RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.OPERATOR]}>
  <ExportButton />
</RoleGuard>
```

#### API-level Authorization
```typescript
// API route protection
export const withAuth = (handler: AuthenticatedHandler) => {
  return async (req: NextRequest, ...args: any[]) => {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return handler(req, session.user, ...args)
  }
}

// Role-specific protection
export const withAdminAuth = (handler: AuthenticatedHandler) => {
  return withAuth(async (req, user, ...args) => {
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }
    
    return handler(req, user, ...args)
  })
}
```

## 🔄 Session Management

### Session Configuration
```typescript
// Session settings
{
  strategy: 'jwt',           // JWT-based sessions
  maxAge: 24 * 60 * 60,     // 24 hours
  updateAge: 24 * 60 * 60,  // Update session every 24 hours
}
```

### Session Data Structure
```typescript
interface Session {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  expires: string
}

interface JWT {
  id: string
  email: string
  name: string
  role: UserRole
  iat: number
  exp: number
}
```

### Session Hooks
```typescript
// useAuth hook
export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user || null,
    loading: status === 'loading',
    authenticated: status === 'authenticated',
    role: session?.user?.role || null,
  }
}

// Usage in components
const { user, loading, authenticated, role } = useAuth()

if (loading) return <LoadingSpinner />
if (!authenticated) return <LoginForm />
```

## 🔒 Password Management

### Password Reset Flow
```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant D as Database
    participant E as Email Service
    
    U->>A: Request Password Reset
    A->>D: Check User Exists
    D->>A: User Found
    A->>D: Create Reset Token
    A->>E: Send Reset Email
    E->>U: Reset Email
    U->>A: Submit New Password + Token
    A->>D: Validate Token
    A->>D: Update Password
    A->>U: Success Response
```

### Password Reset Implementation
```typescript
// Generate reset token
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// Hash reset token for storage
export const hashResetToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// Password reset API
export async function POST(req: NextRequest) {
  const { email } = await req.json()
  
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Return success even if user not found (security)
    return NextResponse.json({ success: true })
  }
  
  const resetToken = generateResetToken()
  const hashedToken = hashResetToken(resetToken)
  
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    }
  })
  
  await sendPasswordResetEmail(user.email, resetToken)
  
  return NextResponse.json({ success: true })
}
```

## 📊 Audit Logging

### Authentication Events
```typescript
// Audit log events
enum AuthAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET_REQUESTED = 'password_reset_requested',
  PASSWORD_RESET_COMPLETED = 'password_reset_completed',
  PASSWORD_CHANGED = 'password_changed',
  ACCOUNT_CREATED = 'account_created',
  ACCOUNT_DELETED = 'account_deleted',
}
```

### Audit Log Implementation
```typescript
// Create audit log entry
export async function createAuditLog({
  userId,
  action,
  resource,
  details,
  ipAddress,
  userAgent,
}: AuditLogData) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      resource: 'auth',
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    }
  })
}

// Usage in authentication
await createAuditLog({
  userId: user.id,
  action: 'login',
  resource: 'auth',
  details: { method: 'credentials', email: user.email },
  ipAddress: getClientIP(req),
  userAgent: req.headers.get('user-agent'),
})
```

## 🛡️ Security Best Practices

### Input Validation
```typescript
// Zod validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine(passwordValidator, 'Password does not meet requirements'),
})
```

### Rate Limiting
```typescript
// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts',
  standardHeaders: true,
  legacyHeaders: false,
})
```

### CSRF Protection
```typescript
// CSRF protection (built into NextAuth.js)
{
  cookies: {
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
  },
}
```

### Security Headers
```typescript
// Security headers in middleware
response.headers.set('X-Frame-Options', 'DENY')
response.headers.set('X-Content-Type-Options', 'nosniff')
response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
response.headers.set('X-DNS-Prefetch-Control', 'on')
```

## 🔧 Configuration

### Environment Variables
```env
# Authentication
NEXTAUTH_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:4000"

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/npcl"

# Email (for password reset)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### NextAuth.js Configuration
```typescript
// pages/api/auth/[...nextauth].ts
export default NextAuth(authOptions)

// Or in app/api/auth/[...nextauth]/route.ts
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

## 🧪 Testing Authentication

### Unit Tests
```typescript
// Authentication utility tests
describe('Password utilities', () => {
  test('should hash password correctly', async () => {
    const password = 'TestPassword123!'
    const hashed = await hashPassword(password)
    expect(hashed).not.toBe(password)
    expect(await verifyPassword(password, hashed)).toBe(true)
  })
})
```

### Integration Tests
```typescript
// API endpoint tests
describe('POST /api/auth/register', () => {
  test('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123!',
      })
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})
```

## 🚨 Troubleshooting

### Common Issues

#### JWT Secret Missing
```bash
Error: NEXTAUTH_SECRET environment variable is not set
```
**Solution**: Set `NEXTAUTH_SECRET` in your `.env` file

#### Session Not Persisting
```bash
Session is null after login
```
**Solution**: Check cookie settings and NEXTAUTH_URL configuration

#### Role-based Access Not Working
```bash
User can access restricted routes
```
**Solution**: Verify middleware configuration and role assignment

### Debug Mode
```env
# Enable NextAuth.js debug mode
NEXTAUTH_DEBUG=true
```

---

This authentication system provides robust security while maintaining usability and scalability for the NPCL Dashboard application.