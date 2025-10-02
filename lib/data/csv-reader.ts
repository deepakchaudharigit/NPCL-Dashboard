/**
 * CSV Data Reader Utilities
 * Functions to read and parse CSV data from the database directory
 */

import fs from 'fs'
import path from 'path'

// Types for our data structures
export interface DailyMetric {
  date: string
  total_calls: number
  avg_duration_seconds: number
  unique_languages: number
  docket_count: number
  calls_growth_percent: number
  duration_growth_percent: number
  language_growth_percent: number
  docket_growth_percent: number
}

export interface LanguageStatistic {
  date: string
  language: string
  call_count: number
  percentage: number
}

export interface StatusStatistic {
  date: string
  status: string
  count: number
}

export interface CallRecord {
  call_id: string
  cli: string
  received_datetime: string
  language: string
  query_type: string
  status: string
  tickets_identified: number
  transferred_to_ivr: string
  voice_duration: string
  duration_seconds: number
}

export interface User {
  user_id: string
  username: string
  email: string
  full_name: string
  role: string
  status: string
  created_at: string
  last_login: string
  phone: string
  department: string
  permissions: string
}

export interface SystemSetting {
  setting_key: string
  setting_value: string
  category: string
  description: string
  data_type: string
  updated_at: string
  updated_by: string
}

/**
 * Parse CSV content into array of objects
 */
function parseCSV<T>(csvContent: string): T[] {
  const lines = csvContent.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const data: T[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}
    
    headers.forEach((header, index) => {
      const value = values[index] || ''
      
      // Try to convert to number if it looks like a number
      if (!isNaN(Number(value)) && value !== '') {
        row[header] = Number(value)
      } else {
        row[header] = value
      }
    })
    
    data.push(row as T)
  }
  
  return data
}

/**
 * Read and parse daily metrics CSV
 */
export function getDailyMetrics(): DailyMetric[] {
  try {
    const csvPath = path.join(process.cwd(), 'database', 'daily_metrics.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    return parseCSV<DailyMetric>(csvContent)
  } catch (error) {
    console.error('Error reading daily metrics:', error)
    return []
  }
}

/**
 * Read and parse language statistics CSV
 */
export function getLanguageStatistics(): LanguageStatistic[] {
  try {
    const csvPath = path.join(process.cwd(), 'database', 'language_statistics.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    return parseCSV<LanguageStatistic>(csvContent)
  } catch (error) {
    console.error('Error reading language statistics:', error)
    return []
  }
}

/**
 * Read and parse status statistics CSV
 */
export function getStatusStatistics(): StatusStatistic[] {
  try {
    const csvPath = path.join(process.cwd(), 'database', 'status_statistics.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    return parseCSV<StatusStatistic>(csvContent)
  } catch (error) {
    console.error('Error reading status statistics:', error)
    return []
  }
}

/**
 * Read and parse call records CSV
 */
export function getCallRecords(): CallRecord[] {
  try {
    const csvPath = path.join(process.cwd(), 'database', 'call_records.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    return parseCSV<CallRecord>(csvContent)
  } catch (error) {
    console.error('Error reading call records:', error)
    return []
  }
}

/**
 * Get the latest daily metrics (most recent date)
 */
export function getLatestDailyMetrics(): DailyMetric | null {
  const metrics = getDailyMetrics()
  if (metrics.length === 0) return null
  
  // Sort by date descending and return the first (latest)
  return metrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}

/**
 * Get language statistics for the latest date
 */
export function getLatestLanguageStatistics(): LanguageStatistic[] {
  const stats = getLanguageStatistics()
  if (stats.length === 0) return []
  
  // Get the latest date
  const latestDate = stats.reduce((latest, stat) => {
    return new Date(stat.date) > new Date(latest) ? stat.date : latest
  }, stats[0].date)
  
  // Return stats for the latest date
  return stats.filter(stat => stat.date === latestDate)
}

/**
 * Get status statistics for the latest date
 */
export function getLatestStatusStatistics(): StatusStatistic[] {
  const stats = getStatusStatistics()
  if (stats.length === 0) return []
  
  // Get the latest date
  const latestDate = stats.reduce((latest, stat) => {
    return new Date(stat.date) > new Date(latest) ? stat.date : latest
  }, stats[0].date)
  
  // Return stats for the latest date
  return stats.filter(stat => stat.date === latestDate)
}

/**
 * Format duration from seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Format growth percentage with proper sign
 */
export function formatGrowthPercentage(percentage: number): string {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage}% from yesterday`
}

/**
 * Read and parse users CSV
 */
export function getUsers(): User[] {
  try {
    const csvPath = path.join(process.cwd(), 'database', 'users.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    return parseCSV<User>(csvContent)
  } catch (error) {
    console.error('Error reading users:', error)
    return []
  }
}

/**
 * Read and parse system settings CSV
 */
export function getSystemSettings(): SystemSetting[] {
  try {
    const csvPath = path.join(process.cwd(), 'database', 'system_settings.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    return parseCSV<SystemSetting>(csvContent)
  } catch (error) {
    console.error('Error reading system settings:', error)
    return []
  }
}

/**
 * Get settings grouped by category
 */
export function getSettingsByCategory(): { [category: string]: SystemSetting[] } {
  const settings = getSystemSettings()
  const grouped: { [category: string]: SystemSetting[] } = {}
  
  settings.forEach(setting => {
    if (!grouped[setting.category]) {
      grouped[setting.category] = []
    }
    grouped[setting.category].push(setting)
  })
  
  return grouped
}

/**
 * Get a specific setting by key
 */
export function getSettingByKey(key: string): SystemSetting | null {
  const settings = getSystemSettings()
  return settings.find(setting => setting.setting_key === key) || null
}

/**
 * Get date range for display (e.g., "16 Jan, 2025 - 16 Feb, 2025")
 */
export function getDateRange(): string {
  const metrics = getDailyMetrics()
  if (metrics.length === 0) return 'No data available'
  
  const dates = metrics.map(m => new Date(m.date)).sort((a, b) => a.getTime() - b.getTime())
  const startDate = dates[0]
  const endDate = dates[dates.length - 1]
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}