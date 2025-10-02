/**
 * Reports Data Hook
 * Custom hook to fetch and manage reports data
 */

'use client'

import { useState, useEffect } from 'react'

export interface ReportRecord {
  id: string
  cli: string
  receivedDateTime: string
  language: string
  queryType: string
  status: string
  ticketsIdentified: number
  transferredToIVR: string
  voiceFile: string
  durationSeconds: number
}

export interface ReportsPagination {
  currentPage: number
  totalPages: number
  totalRecords: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ReportsFilters {
  languages: string[]
  statuses: string[]
}

export interface ReportsData {
  records: ReportRecord[]
  pagination: ReportsPagination
  filters: ReportsFilters
  dateRange: string
  appliedFilters: {
    dateRange?: string
    startDate?: string
    endDate?: string
    language?: string
    status?: string
  }
}

interface UseReportsDataReturn {
  data: ReportsData | null
  loading: boolean
  error: string | null
  refetch: (params?: ReportsParams) => void
}

export interface ReportsParams {
  dateRange?: string
  startDate?: string
  endDate?: string
  language?: string
  status?: string
  page?: number
  limit?: number
}

export function useReportsData(): UseReportsDataReturn {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (params: ReportsParams = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      // Build URL with query parameters
      const searchParams = new URLSearchParams()
      if (params.dateRange) searchParams.append('dateRange', params.dateRange)
      if (params.startDate) searchParams.append('startDate', params.startDate)
      if (params.endDate) searchParams.append('endDate', params.endDate)
      if (params.language) searchParams.append('language', params.language)
      if (params.status) searchParams.append('status', params.status)
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      
      const url = `/api/reports/data${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch reports data: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch reports data')
      }

      setData(result.data)
    } catch (err) {
      console.error('Error fetching reports data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = (params: ReportsParams = {}) => {
    fetchData(params)
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Fallback data for when API fails or during loading
export const fallbackReportsData: ReportsData = {
  records: [
    {
      id: '1',
      cli: '+91-9876543210',
      receivedDateTime: '2025-01-15 09:30:15',
      language: 'Hindi',
      queryType: 'Power outage complaint',
      status: 'Docket generated',
      ticketsIdentified: 2,
      transferredToIVR: '2025-01-15 09:35:20',
      voiceFile: '2:45',
      durationSeconds: 165
    },
    {
      id: '2',
      cli: '+91-9876543211',
      receivedDateTime: '2025-01-15 10:15:30',
      language: 'English',
      queryType: 'Billing inquiry',
      status: 'Under Review',
      ticketsIdentified: 1,
      transferredToIVR: '2025-01-15 10:20:45',
      voiceFile: '3:12',
      durationSeconds: 192
    },
    {
      id: '3',
      cli: '+91-9876543212',
      receivedDateTime: '2025-01-15 11:45:10',
      language: 'Bengali',
      queryType: 'Connection request',
      status: 'Missing',
      ticketsIdentified: 0,
      transferredToIVR: '2025-01-15 11:50:25',
      voiceFile: '1:30',
      durationSeconds: 90
    }
  ],
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalRecords: 45,
    limit: 10,
    hasNextPage: true,
    hasPreviousPage: false
  },
  filters: {
    languages: ['Hindi', 'English', 'Bengali', 'Telugu', 'Tamil', 'Marathi', 'Malayalam', 'Kannada'],
    statuses: ['Docket generated', 'Under Review', 'Missing', 'Aborted', 'Resolved', 'Reopened']
  },
  dateRange: '1 Jan, 2025 - 30 Sep, 2025',
  appliedFilters: {}
}