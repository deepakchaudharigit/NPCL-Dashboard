/**
 * Settings Data Hook
 * Custom hook to fetch and manage settings data
 */

'use client'

import { useState, useEffect } from 'react'

export interface SettingsUser {
  id: string
  username: string
  email: string
  fullName: string
  role: string
  status: string
  createdAt: string
  lastLogin: string
  phone: string
  department: string
  permissions: string[]
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  byRole: {
    Admin: number
    Operator: number
    Viewer: number
  }
  byDepartment: { [key: string]: number }
}

export interface SystemSetting {
  key: string
  value: string
  description: string
  dataType: string
  updatedAt: string
  updatedBy: string
}

export interface SettingsData {
  users?: {
    data: SettingsUser[]
    stats: UserStats
  }
  settings?: {
    categories: { [category: string]: SystemSetting[] }
    categoryList: string[]
  }
}

interface UseSettingsDataReturn {
  data: SettingsData | null
  loading: boolean
  error: string | null
  refetch: (section?: string) => void
  updateSetting: (key: string, value: string) => Promise<boolean>
  updateUser: (userId: string, userData: Partial<SettingsUser>) => Promise<boolean>
  createUser: (userData: Omit<SettingsUser, 'id'>) => Promise<boolean>
}

export function useSettingsData(section: string = 'all'): UseSettingsDataReturn {
  const [data, setData] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (fetchSection: string = section) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (fetchSection !== 'all') {
        params.append('section', fetchSection)
      }
      
      const url = `/api/settings/data${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch settings data: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch settings data')
      }

      setData(result.data)
    } catch (err) {
      console.error('Error fetching settings data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/settings/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'update_setting',
          data: { key, value }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Refresh data after successful update
        await fetchData()
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error updating setting:', error)
      return false
    }
  }

  const updateUser = async (userId: string, userData: Partial<SettingsUser>): Promise<boolean> => {
    try {
      const response = await fetch('/api/settings/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'update_user',
          data: { userId, ...userData }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Refresh data after successful update
        await fetchData()
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error updating user:', error)
      return false
    }
  }

  const createUser = async (userData: Omit<SettingsUser, 'id'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/settings/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'create_user',
          data: userData
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Refresh data after successful creation
        await fetchData()
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error creating user:', error)
      return false
    }
  }

  useEffect(() => {
    fetchData()
  }, [section])

  const refetch = (fetchSection?: string) => {
    fetchData(fetchSection || section)
  }

  return {
    data,
    loading,
    error,
    refetch,
    updateSetting,
    updateUser,
    createUser
  }
}

// Fallback data for when API fails or during loading
export const fallbackSettingsData: SettingsData = {
  users: {
    data: [
      {
        id: 'USR001',
        username: 'admin',
        email: 'admin@npcl.com',
        fullName: 'Administrator',
        role: 'Admin',
        status: 'Active',
        createdAt: '2025-01-01 08:00:00',
        lastLogin: '2025-01-15 09:30:15',
        phone: '+91-9876543210',
        department: 'IT Department',
        permissions: ['dashboard', 'reports', 'settings', 'users']
      }
    ],
    stats: {
      total: 1,
      active: 1,
      inactive: 0,
      byRole: { Admin: 1, Operator: 0, Viewer: 0 },
      byDepartment: { 'IT Department': 1 }
    }
  },
  settings: {
    categories: {
      General: [
        {
          key: 'app_name',
          value: 'NPCL Dashboard',
          description: 'Application name displayed in header',
          dataType: 'string',
          updatedAt: '2025-01-15 10:00:00',
          updatedBy: 'admin'
        }
      ]
    },
    categoryList: ['General']
  }
}