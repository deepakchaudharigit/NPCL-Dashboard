/**
 * Call Details Hook
 * Custom hook to fetch detailed information for a specific call
 */

'use client'

import { useState, useEffect } from 'react'

export interface CallDetails {
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
  customerName: string
  customerAddress: string
  complaintCategory: string
  priority: string
  assignedAgent: string
  resolution: string
  callTranscript: string
  callNotes: CallNote[]
  relatedTickets: RelatedTicket[]
}

export interface CallNote {
  timestamp: string
  note: string
  addedBy: string
}

export interface RelatedTicket {
  ticketId: string
  type: string
  status: string
  createdAt: string
}

interface UseCallDetailsReturn {
  data: CallDetails | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCallDetails(callId: string | null): UseCallDetailsReturn {
  const [data, setData] = useState<CallDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!callId) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/reports/call-details/${callId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch call details: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch call details')
      }

      setData(result.data)
    } catch (err) {
      console.error('Error fetching call details:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (callId) {
      fetchData()
    } else {
      setData(null)
      setError(null)
    }
  }, [callId])

  const refetch = () => {
    fetchData()
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}