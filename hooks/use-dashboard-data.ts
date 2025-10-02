/**
 * Dashboard Data Hook
 * Custom hook to fetch and manage dashboard data
 */

'use client'

import { useState, useEffect } from 'react'

export interface MetricCard {
  title: string
  value: string
  growth: string
  isNegative: boolean
  icon: string
  iconBgColor: string
  iconColor: string
}

export interface LanguageChartData {
  language: string
  calls: number
  color?: string
  bgColor?: string
  textColor?: string
}

export interface StatusPanelData {
  status: string
  count: number
  bgColor?: string
  textColor?: string
}

export interface DashboardData {
  metricsCards: MetricCard[]
  languageChartData: LanguageChartData[]
  statusPanelData: StatusPanelData[]
  dateRange: string
  lastUpdated: string
}

interface UseDashboardDataReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: (dateRange?: string, startDate?: string, endDate?: string) => void
}

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (dateRange?: string, startDate?: string, endDate?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Build URL with query parameters
      const params = new URLSearchParams()
      if (dateRange) params.append('dateRange', dateRange)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const url = `/api/dashboard/data${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control to ensure fresh data
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data')
      }

      setData(result.data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = (dateRange?: string, startDate?: string, endDate?: string) => {
    fetchData(dateRange, startDate, endDate)
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Fallback data for when API fails or during loading
export const fallbackDashboardData: DashboardData = {
  metricsCards: [
    {
      title: 'Total Calls',
      value: '34',
      growth: '+12% from yesterday',
      isNegative: false,
      icon: 'phone',
      iconBgColor: '#EEF2FF',
      iconColor: '#6366F1'
    },
    {
      title: 'Avg Duration',
      value: '2:35',
      growth: '+5% from yesterday',
      isNegative: false,
      icon: 'clock',
      iconBgColor: '#F5F3FF',
      iconColor: '#8B5CF6'
    },
    {
      title: 'Languages',
      value: '6',
      growth: '+12% from yesterday',
      isNegative: false,
      icon: 'globe',
      iconBgColor: '#FDF2F8',
      iconColor: '#EC4899'
    },
    {
      title: 'Active Dockets',
      value: '13',
      growth: '-35% from yesterday',
      isNegative: true,
      icon: 'document',
      iconBgColor: '#FFFBEB',
      iconColor: '#F59E0B'
    }
  ],
  languageChartData: [
    { language: 'Hindi', calls: 4, bgColor: 'bg-cyan-100', textColor: 'text-cyan-800' },
    { language: 'Bengali', calls: 3, bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    { language: 'Telugu', calls: 2, bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
    { language: 'Marathi', calls: 3, bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { language: 'Tamil', calls: 2, bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    { language: 'Urdu', calls: 4, bgColor: 'bg-rose-100', textColor: 'text-rose-800' },
    { language: 'Malayalam', calls: 5, bgColor: 'bg-teal-100', textColor: 'text-teal-800' },
    { language: 'Kannada', calls: 2, bgColor: 'bg-amber-100', textColor: 'text-amber-800' }
  ],
  statusPanelData: [
    { status: 'Docket generated', count: 4 },
    { status: 'Transferred to Agent', count: 2 },
    { status: 'Docket follow-up', count: 4 },
    { status: 'Missing', count: 1 },
    { status: 'Aborted', count: 6 },
    { status: 'Resolved', count: 9 },
    { status: 'Reopened', count: 3 },
    { status: 'Under Review', count: 5 }
  ],
  dateRange: '1 Jan, 2025 - 30 Sep, 2025',
  lastUpdated: new Date().toISOString()
}