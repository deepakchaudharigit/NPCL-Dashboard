'use client'

import { 
  PhoneIcon, 
  ClockIcon, 
  GlobeAltIcon, 
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { MetricsCard } from '@/components/voicebot/MetricsCard'
import { CallsByLanguageChart } from '@/components/voicebot/CallsByLanguageChart'
import { CallsByStatusPanel } from '@/components/voicebot/CallsByStatusPanel'
import { DateRangeSelector } from '@/components/ui/DateRangeSelector'
import { useDashboardData, fallbackDashboardData } from '@/hooks/use-dashboard-data'
import { DateRangeOption, getDateRangeDisplayText, calculateDateRange } from '@/lib/utils/date-ranges'
import { useState, useEffect } from 'react'

// Icon mapping for metrics cards
const iconMap = {
  phone: PhoneIcon,
  clock: ClockIcon,
  globe: GlobeAltIcon,
  document: DocumentTextIcon
}

export default function DashboardPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>('this-month')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const { data, loading, error, refetch } = useDashboardData()
  
  // Use real data if available, otherwise fallback
  const dashboardData = data || fallbackDashboardData
  
  // Get display text for the selected date range
  const dateRangeDisplayText = selectedDateRange === 'custom' && customStartDate && customEndDate
    ? `${new Date(customStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(customEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : getDateRangeDisplayText(selectedDateRange, dashboardData.dateRange)
  
  // Handle date range change
  const handleDateRangeChange = (range: DateRangeOption, customStart?: string, customEnd?: string) => {
    setSelectedDateRange(range)
    
    if (range === 'custom' && customStart && customEnd) {
      // For custom with specific dates
      setCustomStartDate(customStart)
      setCustomEndDate(customEnd)
      refetch(range, customStart, customEnd)
    } else if (range !== 'custom') {
      // For predefined ranges
      const dateRange = calculateDateRange(range)
      const startDate = dateRange.startDate.toISOString().split('T')[0]
      const endDate = dateRange.endDate.toISOString().split('T')[0]
      
      refetch(range, startDate, endDate)
    }
    // If custom is selected but no dates provided, do nothing (wait for date picker)
  }

  // Initialize with this month data on component mount
  useEffect(() => {
    const dateRange = calculateDateRange('this-month')
    const startDate = dateRange.startDate.toISOString().split('T')[0]
    const endDate = dateRange.endDate.toISOString().split('T')[0]
    refetch('this-month', startDate, endDate)
  }, [])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
          {loading && (
            <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
          )}
        </div>
        
        {/* Date Range Selector */}
        <DateRangeSelector
          selectedRange={selectedDateRange}
          onRangeChange={handleDateRangeChange}
          displayText={dateRangeDisplayText}
          loading={loading}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 flex-shrink-0">
          <div className="text-red-600 text-sm">
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => {
              if (selectedDateRange === 'custom' && customStartDate && customEndDate) {
                refetch(selectedDateRange, customStartDate, customEndDate)
              } else if (selectedDateRange !== 'custom') {
                const dateRange = calculateDateRange(selectedDateRange)
                const startDate = dateRange.startDate.toISOString().split('T')[0]
                const endDate = dateRange.endDate.toISOString().split('T')[0]
                refetch(selectedDateRange, startDate, endDate)
              } else {
                refetch()
              }
            }}
            className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric Cards Row - Enhanced with consistent spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 flex-shrink-0">
        {dashboardData.metricsCards.map((card, index) => {
          const IconComponent = iconMap[card.icon as keyof typeof iconMap] || PhoneIcon
          
          return (
            <MetricsCard
              key={index}
              title={card.title}
              value={card.value}
              growth={card.growth}
              icon={<IconComponent className="w-6 h-6" />}
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
              isNegative={card.isNegative}
            />
          )
        })}
      </div>

      {/* Charts Section - Enhanced with proper spacing and responsive behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full flex-1 min-h-0 mb-2">
        <div className="w-full h-full">
          <CallsByLanguageChart data={dashboardData.languageChartData} loading={loading} />
        </div>
        <div className="w-full h-full">
          <CallsByStatusPanel data={dashboardData.statusPanelData} loading={loading} />
        </div>
      </div>

    </div>
  )
}