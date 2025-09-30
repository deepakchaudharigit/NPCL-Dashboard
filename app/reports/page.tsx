'use client'

import { useState } from 'react'
import { FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { CallRecordsTable } from '@/components/voicebot/CallRecordsTable'
import { FilterPanel } from '@/components/voicebot/FilterPanel'
import type { FilterState } from '@/types/voicebot'

export default function ReportsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    callResolutionStatus: [],
    language: [],
    cli: '',
    durationMax: 200
  })

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Apply filters to data
    console.log('Applying filters:', newFilters)
  }

  const handleExport = () => {
    // Export functionality
    console.log('Exporting data...')
  }

  const handleCallClick = (callId: string) => {
    window.location.href = `/reports/${callId}`
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Reports</h1>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors"
          >
            <FunnelIcon className="mr-2 h-4 w-4" />
            Filter
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm transition-colors"
          >
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Sub-header */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">VoiceBot Call Records</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-800 w-fit">
          16 Jan, 2025 - 16 Feb, 2025
        </span>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="flex-1 min-h-0">
        <CallRecordsTable onCallClick={handleCallClick} />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  )
}