# Development Guide

This guide provides comprehensive information for developers working on the NPCL Dashboard project, including setup, workflows, best practices, and contribution guidelines.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Git configured
- VS Code (recommended) with extensions
- Docker (optional, for containerized development)

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/your-org/npcl-dashboard.git
cd npcl-dashboard

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

## 🏗️ Project Structure

### Directory Overview
```
npcl-dashboard/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── reports/           # Reports pages
│   ├── settings/          # Settings pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── reports/           # Report components
│   ├── voicebot/          # VoiceBot components
│   ├── providers/         # Context providers
│   └── performance/       # Performance components
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── prisma.ts          # Prisma client
│   ├── validations.ts     # Zod schemas
│   ├── cache/             # Caching utilities
│   ├── monitoring/        # Performance monitoring
│   └── utils/             # General utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── config/                # Configuration files
├── prisma/                # Database schema and migrations
├── __tests__/             # Test files
├── middleware.ts          # Next.js middleware
└── public/                # Static assets
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Pages**: kebab-case (e.g., `user-settings/page.tsx`)
- **Utilities**: camelCase (e.g., `authUtils.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## 🔧 Development Workflow

### Branch Strategy
```bash
# Main branches
main          # Production-ready code
develop       # Development integration
staging       # Pre-production testing

# Feature branches
feature/auth-improvements
feature/dashboard-charts
feature/report-generation

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug-fix
```

### Development Process
1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Development**
   ```bash
   # Make changes
   npm run dev          # Start development server
   npm run typecheck    # Check TypeScript
   npm run lint         # Run ESLint
   npm run test         # Run tests
   ```

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add user authentication system"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

### Commit Message Convention
```bash
# Format: type(scope): description

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes
refactor: # Code refactoring
test:     # Adding or updating tests
chore:    # Maintenance tasks

# Examples:
feat(auth): add password reset functionality
fix(dashboard): resolve chart rendering issue
docs(api): update authentication documentation
test(auth): add unit tests for login validation
```

## 🧪 Testing Strategy

### Test Structure
```
__tests__/
├── api/                   # API route tests
│   ├── auth/             # Authentication API tests
│   └── dashboard/        # Dashboard API tests
├── components/           # Component tests
│   ├── auth/             # Auth component tests
│   └── ui/               # UI component tests
├── lib/                  # Utility function tests
├── hooks/                # Custom hook tests
├── integration/          # Integration tests
└── setup/                # Test setup files
```

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit         # Unit tests only
npm run test:api          # API tests only
npm run test:components   # Component tests only
npm run test:integration  # Integration tests only

# Run tests for changed files
npm run test:changed
```

### Writing Tests

#### Component Testing
```typescript
// components/auth/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  test('renders login form correctly', () => {
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('validates required fields', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />)
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})
```

#### API Testing
```typescript
// __tests__/api/auth/register.test.ts
import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/auth/register/route'

describe('/api/auth/register', () => {
  test('should register new user successfully', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123!',
      },
    })

    const response = await POST(req as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.email).toBe('test@example.com')
  })

  test('should reject invalid email', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'invalid-email',
        password: 'TestPassword123!',
      },
    })

    const response = await POST(req as any)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })
})
```

#### Hook Testing
```typescript
// __tests__/hooks/use-auth.test.ts
import { renderHook } from '@testing-library/react'
import { useAuth } from '@/hooks/use-auth'
import { SessionProvider } from 'next-auth/react'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={null}>{children}</SessionProvider>
)

describe('useAuth', () => {
  test('should return unauthenticated state initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.authenticated).toBe(false)
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
  })
})
```

## 🎨 Code Style & Standards

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"],
      "@/config/*": ["./config/*"]
    }
  }
}
```

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Code Formatting
```bash
# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Lint and fix
npm run lint:fix
```

### Component Guidelines

#### Component Structure
```typescript
// components/ui/Button.tsx
import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
            'bg-secondary-600 text-white hover:bg-secondary-700': variant === 'secondary',
            'border border-gray-300 bg-white hover:bg-gray-50': variant === 'outline',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading && <LoadingSpinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

#### Hook Guidelines
```typescript
// hooks/use-dashboard-data.ts
import { useState, useEffect, useCallback } from 'react'

interface DashboardData {
  stats: DashboardStats
  loading: boolean
  error: string | null
}

export function useDashboardData(timeRange: string = '24h'): DashboardData {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/dashboard/stats?timeRange=${timeRange}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { stats: data, loading, error, refetch: fetchData }
}
```

## 🔧 Development Tools

### VS Code Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-jest",
    "ms-playwright.playwright"
  ]
}
```

### VS Code Settings
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Debug Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4000"
    }
  ]
}
```

## 📊 Performance Monitoring

### Development Performance
```bash
# Bundle analysis
npm run analyze:bundle

# Performance testing
npm run perf:test

# Lighthouse audit
npm run audit:lighthouse

# Quick performance check
npm run perf:quick
```

### Performance Best Practices
1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Use Next.js Image component
3. **Lazy Loading**: Implement lazy loading for non-critical components
4. **Caching**: Implement proper caching strategies
5. **Bundle Size**: Monitor and optimize bundle sizes

## 🐛 Debugging

### Debug Scripts
```bash
# Debug with inspector
npm run dev:debug

# Debug API routes
npm run debug:api

# Debug Prisma queries
npm run debug:prisma

# Debug NextAuth.js
npm run debug:nextauth
```

### Common Debug Scenarios

#### Database Issues
```bash
# Check database connection
npm run db:studio

# Reset database
npm run db:reset

# View Prisma logs
DEBUG=prisma:* npm run dev
```

#### Authentication Issues
```bash
# Debug NextAuth.js
NEXTAUTH_DEBUG=true npm run dev

# Check JWT tokens
curl -X GET http://localhost:4000/api/debug/tokens
```

#### Performance Issues
```bash
# Profile bundle
npm run analyze:bundle

# Check performance metrics
npm run audit:performance
```

## 🚀 Build & Deployment

### Build Process
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Testing
npm run test:ci

# Build application
npm run build

# Start production server
npm run start
```

### Environment-specific Builds
```bash
# Development build
NODE_ENV=development npm run build

# Production build
NODE_ENV=production npm run build

# Staging build
NODE_ENV=staging npm run build
```

## 📚 Documentation

### Code Documentation
```typescript
/**
 * Authenticates user credentials and returns user data
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to user data or null
 * @throws {AuthenticationError} When credentials are invalid
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  // Implementation
}
```

### API Documentation
- Use JSDoc comments for functions
- Document all API endpoints
- Include request/response examples
- Maintain OpenAPI/Swagger specs

### Component Documentation
```typescript
/**
 * Button component with multiple variants and sizes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
}
```

## 🤝 Contributing

### Pull Request Process
1. **Fork the repository**
2. **Create feature branch** from `develop`
3. **Make changes** following coding standards
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Submit pull request** with clear description

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Code Review Guidelines
- **Functionality**: Does the code work as intended?
- **Readability**: Is the code easy to understand?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?
- **Testing**: Is the code adequately tested?

## 🔧 Troubleshooting

### Common Issues

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Check TypeScript configuration
npm run typecheck
```

#### Database Issues
```bash
# Reset Prisma
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

#### Build Issues
```bash
# Clean Next.js cache
rm -rf .next

# Clean build
npm run build
```

---

This development guide provides a comprehensive foundation for contributing to the NPCL Dashboard project. Follow these guidelines to ensure consistent, high-quality code and smooth collaboration.