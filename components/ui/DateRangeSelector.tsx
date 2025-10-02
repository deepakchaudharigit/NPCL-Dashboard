'use client'

import { useState, useRef, useEffect } from 'react'
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { CustomDatePicker } from './CustomDatePicker'

export type DateRangeOption = 
  | 'today'
  | 'yesterday' 
  | 'this-week'
  | 'last-week'
  | 'this-month'
  | 'last-month'
  | 'custom'

interface DateRangeOptionItem {
  value: DateRangeOption
  label: string
  description?: string
}

const dateRangeOptions: DateRangeOptionItem[] = [
  { value: 'today', label: 'Today', description: 'Current day' },
  { value: 'yesterday', label: 'Yesterday', description: 'Previous day' },
  { value: 'this-week', label: 'This Week', description: 'Current week' },
  { value: 'last-week', label: 'Last Week', description: 'Previous week' },
  { value: 'this-month', label: 'This Month', description: 'Current month' },
  { value: 'last-month', label: 'Last Month', description: 'Previous month' },
  { value: 'custom', label: 'Custom', description: 'Choose specific dates' },
]

interface DateRangeSelectorProps {
  selectedRange: DateRangeOption
  onRangeChange: (range: DateRangeOption, startDate?: string, endDate?: string) => void
  displayText: string
  loading?: boolean
  customStartDate?: string
  customEndDate?: string
}

export function DateRangeSelector({ 
  selectedRange, 
  onRangeChange, 
  displayText,
  loading = false,
  customStartDate,
  customEndDate
}: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOptionSelect = (option: DateRangeOptionItem) => {
    if (option.value === 'custom') {
      setIsOpen(false)
      setIsCustomPickerOpen(true)
    } else {
      onRangeChange(option.value)
      setIsOpen(false)
    }
  }

  const handleCustomDateApply = (startDate: string, endDate: string) => {
    onRangeChange('custom', startDate, endDate)
    setIsCustomPickerOpen(false)
  }

  const selectedOption = dateRangeOptions.find(opt => opt.value === selectedRange)

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="w-full md:w-60 h-10 bg-white border border-gray-200 rounded-lg px-4 flex items-center justify-between text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        title="Select date range"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <CalendarIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="flex flex-col items-start min-w-0">
            <span className="font-medium text-gray-900 truncate">
              {selectedOption?.label || 'Custom'}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {displayText}
            </span>
          </div>
        </div>
        <ChevronDownIcon 
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          {dateRangeOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                selectedRange === option.value 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-gray-700'
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Custom Date Picker Modal */}
      <CustomDatePicker
        isOpen={isCustomPickerOpen}
        onClose={() => setIsCustomPickerOpen(false)}
        onApply={handleCustomDateApply}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
      />
    </div>
  )
}