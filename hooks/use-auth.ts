/**
 * Authentication Hook
 * Custom hook for authentication state management
 */

'use client'

import { useSession } from 'next-auth/react'

export interface User {
  id: string
  name?: string | null
  email?: string | null
  role?: string
}

export function useAuth() {
  const { data: session, status } = useSession()

  const user: User | null = session?.user ? {
    id: session.user.id || '',
    name: session.user.name,
    email: session.user.email,
    role: session.user.role || 'viewer'
  } : null

  const logout = async () => {
    // This would typically call signOut from next-auth
    // For now, we'll just redirect to login
    window.location.href = '/auth/login'
  }

  return {
    user,
    loading: status === 'loading',
    authenticated: status === 'authenticated',
    logout
  }
}