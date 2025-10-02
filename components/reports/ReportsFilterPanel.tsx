'use client'

import { useState, useRef, useEffect } from 'react'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { DateRangeSelector } from '@/components/ui/DateRangeSelector'
import { DateRangeOption, calculateDateRange } from '@/lib/utils/date-ranges'

interface ReportsFilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: ReportsFilters) => void
  availableLanguages: string[]
  availableStatuses: string[]
  currentFilters?: ReportsFilters
}

export interface ReportsFilters {
  dateRange?: DateRangeOption
  startDate?: string
  endDate?: string
  language?: string
  status?: string
}

export function ReportsFilterPanel({ 
  isOpen, 
  onClose, 
  onApply, 
  availableLanguages = [],
  availableStatuses = [],
  currentFilters = {}
}: ReportsFilterPanelProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>(
    currentFilters.dateRange || 'this-month'
  )
  const [customStartDate, setCustomStartDate] = useState(currentFilters.startDate || '')
  const [customEndDate, setCustomEndDate] = useState(currentFilters.endDate || '')
  const [selectedLanguage, setSelectedLanguage] = useState(currentFilters.language || 'all')
  const [selectedStatus, setSelectedStatus] = useState(currentFilters.status || 'all')
  
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleDateRangeChange = (range: DateRangeOption, customStart?: string, customEnd?: string) => {
    setSelectedDateRange(range)
    
    if (range === 'custom' && customStart && customEnd) {
      setCustomStartDate(customStart)
      setCustomEndDate(customEnd)
    } else if (range !== 'custom') {
      const dateRange = calculateDateRange(range)
      setCustomStartDate(dateRange.startDate.toISOString().split('T')[0])
      setCustomEndDate(dateRange.endDate.toISOString().split('T')[0])
    }
  }

  const handleApply = () => {
    const filters: ReportsFilters = {
      dateRange: selectedDateRange,
      startDate: customStartDate,
      endDate: customEndDate,
      language: selectedLanguage === 'all' ? undefined : selectedLanguage,
      status: selectedStatus === 'all' ? undefined : selectedStatus
    }
    
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setSelectedDateRange('this-month')
    setSelectedLanguage('all')
    setSelectedStatus('all')
    
    const dateRange = calculateDateRange('this-month')
    setCustomStartDate(dateRange.startDate.toISOString().split('T')[0])
    setCustomEndDate(dateRange.endDate.toISOString().split('T')[0])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={panelRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Reports</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Date Range
          </label>
          <DateRangeSelector
            selectedRange={selectedDateRange}
            onRangeChange={handleDateRangeChange}
            displayText={`${customStartDate} - ${customEndDate}`}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
        </div>

        {/* Language Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Languages</option>
            {availableLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}