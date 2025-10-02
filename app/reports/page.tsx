'use client'

import { useState, useEffect } from 'react'
import { FunnelIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { DynamicCallRecordsTable } from '@/components/reports/DynamicCallRecordsTable'
import { ReportsFilterPanel, ReportsFilters } from '@/components/reports/ReportsFilterPanel'
import { CallDetailsModal } from '@/components/reports/CallDetailsModal'
import { useReportsData, fallbackReportsData } from '@/hooks/use-reports-data'
import { DateRangeOption, calculateDateRange } from '@/lib/utils/date-ranges'

export default function ReportsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)
  const [currentFilters, setCurrentFilters] = useState<ReportsFilters>({
    dateRange: 'this-month'
  })
  const { data, loading, error, refetch } = useReportsData()
  
  // Use real data if available, otherwise fallback
  const reportsData = data || fallbackReportsData

  // Initialize with current month data
  useEffect(() => {
    const dateRange = calculateDateRange('this-month')
    const startDate = dateRange.startDate.toISOString().split('T')[0]
    const endDate = dateRange.endDate.toISOString().split('T')[0]
    
    const initialFilters = {
      dateRange: 'this-month' as DateRangeOption,
      startDate,
      endDate
    }
    
    setCurrentFilters(initialFilters)
    refetch(initialFilters)
  }, [])

  const handleFilterApply = (newFilters: ReportsFilters) => {
    setCurrentFilters(newFilters)
    refetch({
      dateRange: newFilters.dateRange,
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      language: newFilters.language,
      status: newFilters.status,
      page: 1 // Reset to first page when applying filters
    })
  }

  const handlePageChange = (page: number) => {
    refetch({
      dateRange: currentFilters.dateRange,
      startDate: currentFilters.startDate,
      endDate: currentFilters.endDate,
      language: currentFilters.language,
      status: currentFilters.status,
      page
    })
  }

  const handleExport = () => {
    // Export functionality - could be enhanced to export filtered data
    const csvContent = generateCSVContent(reportsData.records)
    downloadCSV(csvContent, 'voicebot-reports.csv')
  }

  const generateCSVContent = (records: typeof reportsData.records) => {
    const headers = ['CLI', 'Received DateTime', 'Language', 'Query Type', 'Status', 'Tickets Identified', 'Transferred to IVR', 'Duration']
    const csvRows = [headers.join(',')]
    
    records.forEach(record => {
      const row = [
        record.cli,
        record.receivedDateTime,
        record.language,
        `"${record.queryType}"`, // Wrap in quotes to handle commas
        record.status,
        record.ticketsIdentified,
        record.transferredToIVR || '',
        record.voiceFile
      ]
      csvRows.push(row.join(','))
    })
    
    return csvRows.join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleCallClick = (callId: string) => {
    setSelectedCallId(callId)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (currentFilters.language) count++
    if (currentFilters.status) count++
    if (currentFilters.dateRange && currentFilters.dateRange !== 'this-month') count++
    return count
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Reports</h1>
          {loading && (
            <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors relative"
          >
            <FunnelIcon className="mr-2 h-4 w-4" />
            Filter
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          
          <button
            onClick={handleExport}
            disabled={loading || reportsData.records.length === 0}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 flex-shrink-0">
          <div className="text-red-600 text-sm">
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => refetch(currentFilters)}
            className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Sub-header */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">VoiceBot Call Records</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-800 w-fit">
          {reportsData.dateRange}
        </span>
        {reportsData.pagination && (
          <span className="text-sm text-gray-600">
            {reportsData.pagination.totalRecords} total records
          </span>
        )}
      </div>

      {/* Table Container */}
      <div className="flex-1 min-h-0">
        <DynamicCallRecordsTable 
          records={reportsData.records}
          pagination={reportsData.pagination}
          loading={loading}
          onCallClick={handleCallClick}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Filter Panel */}
      <ReportsFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        availableLanguages={reportsData.filters.languages}
        availableStatuses={reportsData.filters.statuses}
        currentFilters={currentFilters}
      />

      {/* Call Details Modal */}
      <CallDetailsModal
        isOpen={!!selectedCallId}
        onClose={() => setSelectedCallId(null)}
        callId={selectedCallId}
      />
    </div>
  )
}