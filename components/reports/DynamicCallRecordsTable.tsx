'use client'

import { PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { ReportRecord, ReportsPagination } from '@/hooks/use-reports-data'

const getStatusBadge = (status: string) => {
  const styles: { [key: string]: string } = {
    'Docket generated': 'bg-green-100 text-green-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'Missing': 'bg-red-100 text-red-800',
    'Aborted': 'bg-red-100 text-red-800',
    'Resolved': 'bg-emerald-100 text-emerald-800',
    'Reopened': 'bg-purple-100 text-purple-800',
    'Transferred to Agent': 'bg-yellow-100 text-yellow-800',
    'Docket follow-up': 'bg-orange-100 text-orange-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

const getLanguageBadge = (language: string) => {
  const colors: { [key: string]: string } = {
    'Hindi': 'bg-cyan-100 text-cyan-800',
    'English': 'bg-indigo-100 text-indigo-800',
    'Bengali': 'bg-orange-100 text-orange-800',
    'Telugu': 'bg-emerald-100 text-emerald-800',
    'Tamil': 'bg-purple-100 text-purple-800',
    'Marathi': 'bg-blue-100 text-blue-800',
    'Malayalam': 'bg-teal-100 text-teal-800',
    'Kannada': 'bg-amber-100 text-amber-800',
    'Urdu': 'bg-rose-100 text-rose-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[language] || 'bg-gray-100 text-gray-800'}`}>
      {language}
    </span>
  )
}

const formatDateTime = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr)
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return dateTimeStr
  }
}

const formatDuration = (durationStr: string) => {
  // If it's already formatted (like "2:45"), return as is
  if (durationStr.includes(':')) {
    return durationStr
  }
  
  // If it's seconds, convert to MM:SS format
  const seconds = parseInt(durationStr)
  if (!isNaN(seconds)) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  return durationStr
}

interface DynamicCallRecordsTableProps {
  records: ReportRecord[]
  pagination: ReportsPagination
  loading?: boolean
  onCallClick?: (callId: string) => void
  onPageChange?: (page: number) => void
}

export function DynamicCallRecordsTable({ 
  records, 
  pagination, 
  loading = false,
  onCallClick,
  onPageChange 
}: DynamicCallRecordsTableProps) {

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      onPageChange?.(page)
    }
  }

  const generatePageNumbers = () => {
    const pages = []
    const { currentPage, totalPages } = pagination
    
    // Always show first page
    pages.push(1)
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push('...')
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }
    
    return pages
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading reports...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Table Container with Horizontal Scroll */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-36">
                CLI
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-44">
                Received Date-Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-28">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">
                Query Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                Tickets Identified
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-44">
                Transferred to IVR
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No records found for the selected filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => onCallClick?.(record.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-900 font-medium transition-colors"
                    >
                      {record.cli}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(record.receivedDateTime)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getLanguageBadge(record.language)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="truncate max-w-48" title={record.queryType}>
                      {record.queryType}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    {record.ticketsIdentified}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.transferredToIVR ? formatDateTime(record.transferredToIVR) : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-600">
                        {formatDuration(record.voiceFile)}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-900 p-1 transition-colors">
                        <PlayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of{' '}
            {pagination.totalRecords} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                disabled={page === '...'}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  pagination.currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}