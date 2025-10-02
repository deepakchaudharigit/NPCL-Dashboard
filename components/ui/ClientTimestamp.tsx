/**
 * Client Timestamp Component
 * Prevents hydration mismatch by rendering timestamp only on client
 */

'use client'

import { useState, useEffect } from 'react'

interface ClientTimestampProps {
  timestamp: string
  className?: string
}

export function ClientTimestamp({ timestamp, className = '' }: ClientTimestampProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything on server to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={className}>
        Last updated: Loading...
      </div>
    )
  }

  // Format date consistently on client
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Use a consistent format that works across all locales
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  return (
    <div className={className}>
      Last updated: {formatDate(timestamp)}
    </div>
  )
}