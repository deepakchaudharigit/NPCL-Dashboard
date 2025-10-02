/**
 * Test CSV Reader Functionality
 * Simple test to verify CSV reading works correctly
 */

import { 
  getDailyMetrics, 
  getLatestDailyMetrics,
  getLatestLanguageStatistics,
  getLatestStatusStatistics,
  formatDuration,
  formatGrowthPercentage,
  getDateRange
} from './csv-reader'

export function testCSVReader() {
  console.log('Testing CSV Reader...')
  
  try {
    // Test daily metrics
    const metrics = getDailyMetrics()
    console.log(`✅ Daily metrics loaded: ${metrics.length} records`)
    
    const latest = getLatestDailyMetrics()
    if (latest) {
      console.log(`✅ Latest metrics: ${latest.total_calls} calls on ${latest.date}`)
      console.log(`   Duration: ${formatDuration(latest.avg_duration_seconds)}`)
      console.log(`   Growth: ${formatGrowthPercentage(latest.calls_growth_percent)}`)
    }
    
    // Test language statistics
    const langStats = getLatestLanguageStatistics()
    console.log(`✅ Language stats loaded: ${langStats.length} languages`)
    
    // Test status statistics
    const statusStats = getLatestStatusStatistics()
    console.log(`✅ Status stats loaded: ${statusStats.length} statuses`)
    
    // Test date range
    const dateRange = getDateRange()
    console.log(`✅ Date range: ${dateRange}`)
    
    console.log('✅ All CSV tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ CSV test failed:', error)
    return false
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testCSVReader()
}