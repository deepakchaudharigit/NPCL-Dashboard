/**
 * Test CSV Reading API Route
 * Simple endpoint to test CSV reading functionality
 */

import { NextResponse } from 'next/server'
import { testCSVReader } from '@/lib/data/test-csv-reader'
import { 
  getLatestDailyMetrics,
  getLatestLanguageStatistics,
  getLatestStatusStatistics
} from '@/lib/data/csv-reader'

export async function GET() {
  try {
    // Run the test
    const testResult = testCSVReader()
    
    if (!testResult) {
      return NextResponse.json(
        { error: 'CSV test failed' },
        { status: 500 }
      )
    }

    // Get sample data
    const latestMetrics = getLatestDailyMetrics()
    const languageStats = getLatestLanguageStatistics()
    const statusStats = getLatestStatusStatistics()

    return NextResponse.json({
      success: true,
      message: 'CSV reading test passed',
      data: {
        latestMetrics,
        languageStatsCount: languageStats.length,
        statusStatsCount: statusStats.length,
        sampleLanguageStats: languageStats.slice(0, 3),
        sampleStatusStats: statusStats.slice(0, 3)
      }
    })

  } catch (error) {
    console.error('CSV test error:', error)
    return NextResponse.json(
      { error: 'CSV test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}