/**
 * Reports Data API Route
 * Provides dynamic data for reports page from CSV files
 */

import { NextResponse } from 'next/server'
import { getCallRecords, getDateRange } from '@/lib/data/csv-reader'

export async function GET(request: Request) {
  try {
    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const language = searchParams.get('language')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get all call records
    let callRecords = getCallRecords()

    // Apply date filtering if provided
    if (dateRange && startDate && endDate) {
      callRecords = callRecords.filter(record => {
        const recordDate = new Date(record.received_datetime)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return recordDate >= start && recordDate <= end
      })
    }

    // Apply language filtering if provided
    if (language && language !== 'all') {
      callRecords = callRecords.filter(record => 
        record.language.toLowerCase() === language.toLowerCase()
      )
    }

    // Apply status filtering if provided
    if (status && status !== 'all') {
      callRecords = callRecords.filter(record => 
        record.status.toLowerCase() === status.toLowerCase()
      )
    }

    // Calculate pagination
    const totalRecords = callRecords.length
    const totalPages = Math.ceil(totalRecords / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRecords = callRecords.slice(startIndex, endIndex)

    // Transform data for frontend
    const transformedRecords = paginatedRecords.map(record => ({
      id: record.call_id,
      cli: record.cli,
      receivedDateTime: record.received_datetime,
      language: record.language,
      queryType: record.query_type,
      status: record.status,
      ticketsIdentified: record.tickets_identified,
      transferredToIVR: record.transferred_to_ivr,
      voiceFile: record.voice_duration, // Using duration as voice file indicator
      durationSeconds: record.duration_seconds
    }))

    // Get unique values for filters
    const allRecords = getCallRecords()
    const uniqueLanguages = [...new Set(allRecords.map(r => r.language))].sort()
    const uniqueStatuses = [...new Set(allRecords.map(r => r.status))].sort()

    // Get date range for display
    const displayDateRange = startDate && endDate ? 
      `${new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` :
      getDateRange()

    return NextResponse.json({
      success: true,
      data: {
        records: transformedRecords,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        },
        filters: {
          languages: uniqueLanguages,
          statuses: uniqueStatuses
        },
        dateRange: displayDateRange,
        appliedFilters: {
          dateRange,
          startDate,
          endDate,
          language,
          status
        }
      }
    })

  } catch (error) {
    console.error('Error fetching reports data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports data' },
      { status: 500 }
    )
  }
}