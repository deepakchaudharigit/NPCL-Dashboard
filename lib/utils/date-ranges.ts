/**
 * Date Range Utilities
 * Functions to calculate date ranges for dashboard filtering
 */

export type DateRangeOption = 
  | 'today'
  | 'yesterday' 
  | 'this-week'
  | 'last-week'
  | 'this-month'
  | 'last-month'
  | 'custom'

export interface DateRange {
  startDate: Date
  endDate: Date
  displayText: string
}

/**
 * Get start of week (Monday)
 */
function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

/**
 * Get end of week (Sunday)
 */
function getEndOfWeek(date: Date): Date {
  const startOfWeek = getStartOfWeek(date)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  return endOfWeek
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

/**
 * Calculate date range based on selected option
 */
export function calculateDateRange(option: DateRangeOption): DateRange {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  switch (option) {
    case 'today':
      return {
        startDate: today,
        endDate: today,
        displayText: formatDate(today)
      }

    case 'yesterday':
      return {
        startDate: yesterday,
        endDate: yesterday,
        displayText: formatDate(yesterday)
      }

    case 'this-week':
      const thisWeekStart = getStartOfWeek(today)
      const thisWeekEnd = getEndOfWeek(today)
      return {
        startDate: thisWeekStart,
        endDate: thisWeekEnd,
        displayText: `${formatDate(thisWeekStart)} - ${formatDate(thisWeekEnd)}`
      }

    case 'last-week':
      const lastWeekStart = getStartOfWeek(today)
      lastWeekStart.setDate(lastWeekStart.getDate() - 7)
      const lastWeekEnd = getEndOfWeek(lastWeekStart)
      return {
        startDate: lastWeekStart,
        endDate: lastWeekEnd,
        displayText: `${formatDate(lastWeekStart)} - ${formatDate(lastWeekEnd)}`
      }

    case 'this-month':
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      return {
        startDate: thisMonthStart,
        endDate: thisMonthEnd,
        displayText: `${formatDate(thisMonthStart)} - ${formatDate(thisMonthEnd)}`
      }

    case 'last-month':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
      return {
        startDate: lastMonthStart,
        endDate: lastMonthEnd,
        displayText: `${formatDate(lastMonthStart)} - ${formatDate(lastMonthEnd)}`
      }

    case 'custom':
    default:
      // For custom, we'll use the full data range from CSV
      // This will be overridden by the actual data range from the API
      const customStart = new Date('2025-01-01')
      const customEnd = new Date('2025-09-30')
      return {
        startDate: customStart,
        endDate: customEnd,
        displayText: `${formatDate(customStart)} - ${formatDate(customEnd)}`
      }
  }
}

/**
 * Get display text for date range option
 */
export function getDateRangeDisplayText(option: DateRangeOption, actualDataRange?: string): string {
  if (option === 'custom' && actualDataRange) {
    return actualDataRange
  }
  
  const range = calculateDateRange(option)
  return range.displayText
}

/**
 * Check if a date falls within a date range
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  const dateTime = date.getTime()
  const startTime = startDate.getTime()
  const endTime = endDate.getTime()
  
  return dateTime >= startTime && dateTime <= endTime
}

/**
 * Filter data by date range
 */
export function filterDataByDateRange<T extends { date: string }>(
  data: T[], 
  option: DateRangeOption
): T[] {
  if (option === 'custom') {
    // Return all data for custom range
    return data
  }

  const range = calculateDateRange(option)
  
  return data.filter(item => {
    const itemDate = new Date(item.date)
    return isDateInRange(itemDate, range.startDate, range.endDate)
  })
}