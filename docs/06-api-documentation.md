# API Documentation

This document provides comprehensive documentation for all API endpoints in the NPCL Dashboard application.

## 📋 API Overview

The NPCL Dashboard API is built using Next.js API Routes with the following characteristics:

- **RESTful Design**: Following REST principles
- **Type Safety**: TypeScript throughout
- **Authentication**: JWT-based with NextAuth.js
- **Validation**: Zod schema validation
- **Error Handling**: Consistent error responses
- **Caching**: Redis caching for performance

## 🔐 Authentication

### Base URL
```
Development: http://localhost:4000/api
Production: https://your-domain.com/api
```

### Authentication Methods

#### 1. Session-based (Web App)
```typescript
// Automatic session handling via NextAuth.js
// No additional headers required for web requests
```

#### 2. API Key (Future Implementation)
```typescript
// Headers for API access
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

## 🔑 Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```typescript
{
  name: string;        // Min 2 characters
  email: string;       // Valid email format
  password: string;    // Min 8 chars, uppercase, lowercase, number, special char
  role?: 'ADMIN' | 'OPERATOR' | 'VIEWER'; // Optional, defaults to VIEWER
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  errors?: ValidationError[];
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "OPERATOR"
  }'
```

### POST /api/auth/forgot-password
Request password reset email.

**Request Body:**
```typescript
{
  email: string; // Valid email address
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

### POST /api/auth/reset-password
Reset password with token.

**Request Body:**
```typescript
{
  token: string;           // Reset token from email
  newPassword: string;     // New password
  confirmNewPassword: string; // Password confirmation
}
```

### POST /api/auth/change-password
Change user password (authenticated).

**Request Body:**
```typescript
{
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
```

### GET /api/auth/profile
Get current user profile (authenticated).

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}
```

### PUT /api/auth/profile
Update user profile (authenticated).

**Request Body:**
```typescript
{
  name?: string;
  email?: string;
}
```

## 👥 User Management Endpoints

### GET /api/auth/users
Get all users (Admin only).

**Query Parameters:**
```typescript
{
  page?: number;     // Page number (default: 1)
  limit?: number;    // Items per page (default: 10)
  role?: string;     // Filter by role
  search?: string;   // Search by name or email
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
```

### GET /api/auth/users/[id]
Get specific user (Admin only).

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  };
}
```

### PUT /api/auth/users/[id]
Update user (Admin only).

**Request Body:**
```typescript
{
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'OPERATOR' | 'VIEWER';
}
```

### DELETE /api/auth/users/[id]
Delete user (Admin only).

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

## 📊 Dashboard Endpoints

### GET /api/dashboard/stats
Get dashboard statistics.

**Query Parameters:**
```typescript
{
  timeRange?: '1h' | '24h' | '7d' | '30d'; // Default: '24h'
  includeOffline?: boolean;                // Default: false
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    totalReports: number;
    recentAuditLogs: number;
    voicebotCallsCount: number;
    timeRange: string;
    recentActivity: AuditLog[];
    generatedAt: string;
    cached: boolean;
  };
}
```

**Example:**
```bash
curl -X GET "http://localhost:4000/api/dashboard/stats?timeRange=7d" \
  -H "Cookie: next-auth.session-token=<session-token>"
```

### GET /api/dashboard/data
Get dashboard chart data.

**Query Parameters:**
```typescript
{
  dateRange?: string;    // Predefined range or 'custom'
  startDate?: string;    // ISO date string (for custom range)
  endDate?: string;      // ISO date string (for custom range)
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    metricsCards: MetricCard[];
    languageChartData: ChartData[];
    statusPanelData: StatusData[];
    dateRange: string;
  };
}
```

## 📋 Reports Endpoints

### GET /api/reports/data
Get reports data with filtering.

**Query Parameters:**
```typescript
{
  page?: number;           // Page number
  limit?: number;          // Items per page
  dateRange?: string;      // Date range filter
  startDate?: string;      // Custom start date
  endDate?: string;        // Custom end date
  language?: string;       // Language filter
  status?: string;         // Status filter
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    records: CallRecord[];
    pagination: PaginationInfo;
    filters: {
      languages: string[];
      statuses: string[];
    };
    dateRange: string;
    appliedFilters: FilterState;
  };
}
```

### GET /api/reports/call-details/[id]
Get detailed call information.

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    name: string;
    address: string;
    dateTime: string;
    language: string;
    duration: string;
    area: string;
    tickets: Ticket[];
    previousCalls: PreviousCall[];
    conversation: Message[];
  };
}
```

### GET /api/reports/voicebot-calls
Get VoiceBot calls with advanced filtering.

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  language?: string;
  cli?: string;
  callResolutionStatus?: string;
  durationMin?: number;
  durationMax?: number;
  dateFrom?: string;
  dateTo?: string;
}
```

### GET /api/reports/voicebot-calls/exports
Export VoiceBot calls data.

**Query Parameters:**
```typescript
{
  format: 'csv' | 'excel';
  // ... same filters as voicebot-calls endpoint
}
```

**Response:**
- CSV: `text/csv` content type
- Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

### GET /api/reports/voicebot-calls/filters
Get available filter options.

**Response:**
```typescript
{
  success: boolean;
  data: {
    languages: string[];
    statuses: string[];
    dateRange: {
      min: string;
      max: string;
    };
  };
}
```

## ⚙️ Settings Endpoints

### GET /api/settings/data
Get application settings.

**Response:**
```typescript
{
  success: boolean;
  data: {
    general: GeneralSettings;
    notifications: NotificationSettings;
    security: SecuritySettings;
  };
}
```

### PUT /api/settings/data
Update application settings (Admin only).

**Request Body:**
```typescript
{
  general?: GeneralSettings;
  notifications?: NotificationSettings;
  security?: SecuritySettings;
}
```

### GET /api/settings/users
Get user management settings (Admin only).

**Response:**
```typescript
{
  success: boolean;
  data: {
    registrationEnabled: boolean;
    defaultRole: string;
    passwordPolicy: PasswordPolicy;
  };
}
```

## 🔧 Utility Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```typescript
{
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  database: 'connected' | 'disconnected';
  cache: 'connected' | 'disconnected';
}
```

### GET /api/cache
Cache management (Admin only).

**Query Parameters:**
```typescript
{
  action: 'clear' | 'stats';
  pattern?: string; // Cache key pattern to clear
}
```

### POST /api/analytics/web-vitals
Submit web vitals data.

**Request Body:**
```typescript
{
  name: string;
  value: number;
  id: string;
  url: string;
  timestamp: number;
}
```

## 🐛 Debug Endpoints (Development Only)

### GET /api/debug/tokens
Debug JWT tokens.

### POST /api/auth/test-login
Test login credentials.

### GET /api/auth/test-session
Test session validation.

### GET /api/auth/test-connection
Test database connection.

## 📝 Response Formats

### Success Response
```typescript
{
  success: true;
  message: string;
  data?: any;
  meta?: {
    pagination?: PaginationInfo;
    filters?: FilterInfo;
    cached?: boolean;
  };
}
```

### Error Response
```typescript
{
  success: false;
  message: string;
  errors?: ValidationError[];
  code?: string;
}
```

### Validation Error
```typescript
{
  field: string;
  message: string;
  code: string;
}
```

## 🔒 Authorization Matrix

| Endpoint | Admin | Operator | Viewer |
|----------|-------|----------|--------|
| GET /api/auth/profile | ✅ | ✅ | ✅ |
| PUT /api/auth/profile | ✅ | ✅ | ✅ |
| GET /api/auth/users | ✅ | ❌ | ❌ |
| PUT /api/auth/users/[id] | ✅ | ❌ | ❌ |
| DELETE /api/auth/users/[id] | ✅ | ❌ | ❌ |
| GET /api/dashboard/stats | ✅ | ✅ | ✅ |
| GET /api/dashboard/data | ✅ | ✅ | ✅ |
| GET /api/reports/data | ✅ | ✅ | ✅ |
| GET /api/reports/voicebot-calls | ✅ | ✅ | ✅ |
| GET /api/reports/voicebot-calls/exports | ✅ | ✅ | ❌ |
| GET /api/settings/data | ✅ | ✅ | ✅ |
| PUT /api/settings/data | ✅ | ❌ | ❌ |
| GET /api/cache | ✅ | ❌ | ❌ |

## 🚀 Rate Limiting

### Default Limits
- **Authentication endpoints**: 5 requests per minute
- **Dashboard endpoints**: 60 requests per minute
- **Reports endpoints**: 30 requests per minute
- **General endpoints**: 100 requests per minute

### Rate Limit Headers
```typescript
{
  'X-RateLimit-Limit': '60',
  'X-RateLimit-Remaining': '59',
  'X-RateLimit-Reset': '1640995200'
}
```

## 📊 Caching

### Cache Headers
```typescript
{
  'Cache-Control': 'private, max-age=300',
  'ETag': '"abc123"',
  'X-Cache-Status': 'HIT' | 'MISS'
}
```

### Cache Keys
- Dashboard stats: `dashboard:stats:{timeRange}`
- User data: `user:{userId}`
- Reports data: `reports:{hash}`

## 🔍 Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_CREDENTIALS` | Invalid login credentials |
| `INSUFFICIENT_PERMISSIONS` | Insufficient permissions |
| `VALIDATION_ERROR` | Input validation failed |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMITED` | Rate limit exceeded |
| `SERVER_ERROR` | Internal server error |

## 📚 SDK Examples

### JavaScript/TypeScript
```typescript
// API client example
class NPCLApiClient {
  constructor(private baseUrl: string) {}
  
  async getDashboardStats(timeRange = '24h') {
    const response = await fetch(`${this.baseUrl}/dashboard/stats?timeRange=${timeRange}`, {
      credentials: 'include'
    });
    return response.json();
  }
  
  async getReports(filters: ReportFilters) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseUrl}/reports/data?${params}`, {
      credentials: 'include'
    });
    return response.json();
  }
}
```

### Python
```python
import requests

class NPCLApiClient:
    def __init__(self, base_url, session_token):
        self.base_url = base_url
        self.headers = {
            'Cookie': f'next-auth.session-token={session_token}'
        }
    
    def get_dashboard_stats(self, time_range='24h'):
        response = requests.get(
            f'{self.base_url}/dashboard/stats',
            params={'timeRange': time_range},
            headers=self.headers
        )
        return response.json()
```

---

This API documentation provides comprehensive information for integrating with the NPCL Dashboard API. For additional support, please refer to the troubleshooting guide or contact the development team.