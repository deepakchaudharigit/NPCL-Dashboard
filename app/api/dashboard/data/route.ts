/**
 * Dashboard Data API Route
 * Provides dynamic data for dashboard components from CSV files
 */

import { NextResponse } from 'next/server'
import {
  getDailyMetrics,
  getLanguageStatistics,
  getStatusStatistics,
  getLatestDailyMetrics,
  getLatestLanguageStatistics,
  getLatestStatusStatistics,
  formatDuration,
  formatGrowthPercentage,
  getDateRange
} from '@/lib/data/csv-reader'

export async function GET(request: Request) {
  try {
    // Get URL parameters for date filtering
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let latestMetrics, languageStats, statusStats

    if (dateRange && startDate && endDate) {
      // Filter data based on date range
      const allMetrics = getDailyMetrics()
      const allLanguageStats = getLanguageStatistics()
      const allStatusStats = getStatusStatistics()

      // Filter data within the date range
      const filteredMetrics = allMetrics.filter(metric => {
        const metricDate = new Date(metric.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return metricDate >= start && metricDate <= end
      })

      const filteredLanguageStats = allLanguageStats.filter(stat => {
        const statDate = new Date(stat.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return statDate >= start && statDate <= end
      })

      const filteredStatusStats = allStatusStats.filter(stat => {
        const statDate = new Date(stat.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return statDate >= start && statDate <= end
      })

      // Calculate aggregated metrics for the filtered period
      if (filteredMetrics.length > 0) {
        const totalCalls = filteredMetrics.reduce((sum, m) => sum + m.total_calls, 0)
        const avgDuration = Math.round(filteredMetrics.reduce((sum, m) => sum + m.avg_duration_seconds, 0) / filteredMetrics.length)
        const uniqueLanguages = Math.max(...filteredMetrics.map(m => m.unique_languages))
        const totalDockets = filteredMetrics.reduce((sum, m) => sum + m.docket_count, 0)
        
        // Use the latest metrics for growth percentages
        const latestMetric = filteredMetrics[filteredMetrics.length - 1]
        
        latestMetrics = {
          ...latestMetric,
          total_calls: totalCalls,
          avg_duration_seconds: avgDuration,
          unique_languages: uniqueLanguages,
          docket_count: totalDockets
        }
      } else {
        latestMetrics = getLatestDailyMetrics()
      }

      // Aggregate language statistics for the period
      const languageAggregation: { [key: string]: number } = {}
      filteredLanguageStats.forEach(stat => {
        languageAggregation[stat.language] = (languageAggregation[stat.language] || 0) + stat.call_count
      })
      
      languageStats = Object.entries(languageAggregation).map(([language, call_count]) => ({
        date: endDate,
        language,
        call_count,
        percentage: 0 // Will be calculated later
      }))

      // Aggregate status statistics for the period
      const statusAggregation: { [key: string]: number } = {}
      filteredStatusStats.forEach(stat => {
        statusAggregation[stat.status] = (statusAggregation[stat.status] || 0) + stat.count
      })
      
      statusStats = Object.entries(statusAggregation).map(([status, count]) => ({
        date: endDate,
        status,
        count
      }))

    } else {
      // Use latest data (default behavior - when no date range specified)
      latestMetrics = getLatestDailyMetrics()
      languageStats = getLatestLanguageStatistics()
      statusStats = getLatestStatusStatistics()
    }
    
    if (!latestMetrics) {
      return NextResponse.json(
        { error: 'No metrics data available' },
        { status: 404 }
      )
    }

    // Calculate total calls from status statistics for consistency
    const totalCallsFromStatus = statusStats.reduce((sum, stat) => sum + stat.count, 0)
    
    // Calculate docket-related statuses for accurate docket count
    const docketStatuses = ['Docket generated', 'Docket follow-up', 'Under Review']
    const actualDocketCount = statusStats
      .filter(stat => docketStatuses.includes(stat.status))
      .reduce((sum, stat) => sum + stat.count, 0)

    // Prepare metrics cards data with corrected values
    const metricsCards = [
      {
        title: 'Total Calls',
        value: totalCallsFromStatus.toString(),
        growth: formatGrowthPercentage(latestMetrics.calls_growth_percent),
        isNegative: latestMetrics.calls_growth_percent < 0,
        icon: 'phone',
        iconBgColor: '#EEF2FF',
        iconColor: '#6366F1'
      },
      {
        title: 'Avg Duration',
        value: formatDuration(latestMetrics.avg_duration_seconds),
        growth: formatGrowthPercentage(latestMetrics.duration_growth_percent),
        isNegative: latestMetrics.duration_growth_percent < 0,
        icon: 'clock',
        iconBgColor: '#F5F3FF',
        iconColor: '#8B5CF6'
      },
      {
        title: 'Languages',
        value: latestMetrics.unique_languages.toString(),
        growth: formatGrowthPercentage(latestMetrics.language_growth_percent),
        isNegative: latestMetrics.language_growth_percent < 0,
        icon: 'globe',
        iconBgColor: '#FDF2F8',
        iconColor: '#EC4899'
      },
      {
        title: 'Active Dockets',
        value: actualDocketCount.toString(),
        growth: formatGrowthPercentage(latestMetrics.docket_growth_percent),
        isNegative: latestMetrics.docket_growth_percent < 0,
        icon: 'document',
        iconBgColor: '#FFFBEB',
        iconColor: '#F59E0B'
      }
    ]

    // Prepare language chart data with colors like status panel
    const languageChartData = languageStats.map(stat => ({
      language: stat.language,
      calls: stat.call_count,
      ...getLanguageColors(stat.language)
    }))

    // Prepare status panel data - plain styling without colors
    const statusPanelData = statusStats.map(stat => ({
      status: stat.status,
      count: stat.count
    }))

    // Get date range for display
    const displayDateRange = startDate && endDate ? 
      `${new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` :
      getDateRange()

    return NextResponse.json({
      success: true,
      data: {
        metricsCards,
        languageChartData,
        statusPanelData,
        dateRange: displayDateRange,
        lastUpdated: new Date().toISOString(),
        // Debug info for data consistency
        debug: {
          originalDocketCount: latestMetrics.docket_count,
          calculatedDocketCount: actualDocketCount,
          totalCallsFromMetrics: latestMetrics.total_calls,
          totalCallsFromStatus: totalCallsFromStatus,
          dateRangeFilter: dateRange,
          filteredPeriod: startDate && endDate ? `${startDate} to ${endDate}` : 'latest data only',
          languageStatsCount: languageStats.length,
          statusStatsCount: statusStats.length,
          isFiltered: !!(dateRange && startDate && endDate)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

/**
 * Get background and text colors for language panels (like status panel)
 */
function getLanguageColors(language: string): { bgColor: string; textColor: string } {
  const colorMap: { [key: string]: { bgColor: string; textColor: string } } = {
    'Hindi': { bgColor: 'bg-cyan-100', textColor: 'text-cyan-800' },
    'Bengali': { bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    'Telugu': { bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
    'Marathi': { bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    'Tamil': { bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    'Urdu': { bgColor: 'bg-rose-100', textColor: 'text-rose-800' },
    'Malayalam': { bgColor: 'bg-teal-100', textColor: 'text-teal-800' },
    'Kannada': { bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
    'English': { bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
    'Gujarati': { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' }
  }
  return colorMap[language] || { bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
}

// Removed status color functions - using plain styling now