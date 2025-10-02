'use client'

import { useState, useRef, useEffect } from 'react'
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface CustomDatePickerProps {
  isOpen: boolean
  onClose: () => void
  onApply: (startDate: string, endDate: string) => void
  initialStartDate?: string
  initialEndDate?: string
}

export function CustomDatePicker({ 
  isOpen, 
  onClose, 
  onApply, 
  initialStartDate, 
  initialEndDate 
}: CustomDatePickerProps) {
  const [startDate, setStartDate] = useState(initialStartDate || '')
  const [endDate, setEndDate] = useState(initialEndDate || '')
  const [error, setError] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  // Validate date range
  const validateDates = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return false
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    
    // Set today to end of day for comparison
    today.setHours(23, 59, 59, 999)

    if (start > end) {
      setError('Start date must be before end date')
      return false
    }

    if (start > today) {
      setError('Start date cannot be in the future')
      return false
    }

    if (end > today) {
      setError('End date cannot be in the future')
      return false
    }

    // Check if dates are within available data range (2025-01-01 to 2025-09-30)
    const minDate = new Date('2025-01-01')
    const maxDate = new Date('2025-09-30')

    if (start < minDate || end > maxDate) {
      setError('Dates must be between Jan 1, 2025 and Sep 30, 2025')
      return false
    }

    setError('')
    return true
  }

  const handleApply = () => {
    if (validateDates()) {
      onApply(startDate, endDate)
      onClose()
    }
  }

  const handleCancel = () => {
    setStartDate(initialStartDate || '')
    setEndDate(initialEndDate || '')
    setSelectedPreset(null)
    setError('')
    onClose()
  }

  // Quick preset buttons
  const handlePreset = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days + 1)
    
    // Ensure dates are within available range
    const minDate = new Date('2025-01-01')
    const maxDate = new Date('2025-09-30')
    
    const finalStart = start < minDate ? minDate : start
    const finalEnd = end > maxDate ? maxDate : end
    
    setStartDate(finalStart.toISOString().split('T')[0])
    setEndDate(finalEnd.toISOString().split('T')[0])
    setSelectedPreset(days)
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Custom Date Range</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Date Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setSelectedPreset(null)
                }}
                min="2025-01-01"
                max="2025-09-30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setSelectedPreset(null)
                }}
                min="2025-01-01"
                max="2025-09-30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handlePreset(7)}
              className={`px-3 py-2 text-xs border rounded-md transition-colors ${
                selectedPreset === 7
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Last 7 days
            </button>
            <button
              onClick={() => handlePreset(30)}
              className={`px-3 py-2 text-xs border rounded-md transition-colors ${
                selectedPreset === 30
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Last 30 days
            </button>
            <button
              onClick={() => handlePreset(90)}
              className={`px-3 py-2 text-xs border rounded-md transition-colors ${
                selectedPreset === 90
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Last 90 days
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Data Range Info */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-600">
            <strong>Available data:</strong> Jan 1, 2025 - Sep 30, 2025
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}