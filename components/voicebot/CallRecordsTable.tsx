'use client'

import { useState } from 'react'
import { PlayIcon } from '@heroicons/react/24/outline'
import type { CallRecord } from '@/types/voicebot'

const mockData: CallRecord[] = [
  {
    id: '1',
    cli: '+91-9876543210',
    receivedDateTime: '2025-07-16 09:30:15',
    language: 'Hindi',
    queryType: 'Power outage complaint',
    status: 'Docket generated',
    ticketsIdentified: 2,
    transferredToIVR: '2025-07-16 09:35:20',
    voiceFile: 'audio1.mp3'
  },
  {
    id: '2',
    cli: '+91-9876543211',
    receivedDateTime: '2025-07-16 10:15:30',
    language: 'English',
    queryType: 'Billing inquiry',
    status: 'Docket under review',
    ticketsIdentified: 1,
    transferredToIVR: '2025-07-16 10:20:45',
    voiceFile: 'audio2.mp3'
  },
  {
    id: '3',
    cli: '+91-9876543212',
    receivedDateTime: '2025-07-16 11:45:10',
    language: 'Bengali',
    queryType: 'Connection request',
    status: 'Missing',
    ticketsIdentified: 0,
    transferredToIVR: '2025-07-16 11:50:25',
    voiceFile: 'audio3.mp3'
  },
  {
    id: '4',
    cli: '+91-9876543213',
    receivedDateTime: '2025-07-16 14:20:45',
    language: 'Telugu',
    queryType: 'Load shedding complaint',
    status: 'Aborted',
    ticketsIdentified: 0,
    transferredToIVR: '',
    voiceFile: 'audio4.mp3'
  },
  {
    id: '5',
    cli: '+91-9876543214',
    receivedDateTime: '2025-07-16 15:30:20',
    language: 'Tamil',
    queryType: 'Transformer issue',
    status: 'Docket generated',
    ticketsIdentified: 3,
    transferredToIVR: '2025-07-16 15:35:10',
    voiceFile: 'audio5.mp3'
  }
]

const getStatusBadge = (status: CallRecord['status']) => {
  const styles = {
    'Docket generated': 'bg-green-100 text-green-800',
    'Docket under review': 'bg-blue-100 text-blue-800',
    'Missing': 'bg-red-100 text-red-800',
    'Aborted': 'bg-red-100 text-red-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

const getLanguageBadge = (language: string) => {
  const colors = {
    'Hindi': 'bg-orange-100 text-orange-800',
    'English': 'bg-blue-100 text-blue-800',
    'Bengali': 'bg-green-100 text-green-800',
    'Telugu': 'bg-purple-100 text-purple-800',
    'Tamil': 'bg-pink-100 text-pink-800',
    'Marathi': 'bg-yellow-100 text-yellow-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[language as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {language}
    </span>
  )
}

interface CallRecordsTableProps {
  onCallClick?: (callId: string) => void
}

export function CallRecordsTable({ onCallClick }: CallRecordsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [data] = useState(mockData)
  
  const totalPages = 5 // Mock pagination

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
                Tickets identified
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-44">
                Transferred to IVR
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24">
                Voice File
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => onCallClick?.(record.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    {record.cli}
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {record.receivedDateTime}
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
                  {record.transferredToIVR || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <button className="text-indigo-600 hover:text-indigo-900 p-1">
                    <PlayIcon className="h-6 w-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}