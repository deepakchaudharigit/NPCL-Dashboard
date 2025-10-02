'use client'

import { useState, useRef, useEffect } from 'react'
import { XMarkIcon, PlayIcon, PhoneIcon, ClockIcon, LanguageIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { ReportRecord } from '@/hooks/use-reports-data'
import { useCallDetails, CallDetails } from '@/hooks/use-call-details'

interface CallDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  callId: string | null
}



const getStatusBadge = (status: string) => {
  const styles: { [key: string]: string } = {
    'Docket generated': 'bg-green-100 text-green-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'Missing': 'bg-red-100 text-red-800',
    'Aborted': 'bg-red-100 text-red-800',
    'Resolved': 'bg-emerald-100 text-emerald-800',
    'Reopened': 'bg-purple-100 text-purple-800',
    'In Progress': 'bg-yellow-100 text-yellow-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

const getPriorityBadge = (priority: string) => {
  const styles: { [key: string]: string } = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority] || 'bg-gray-100 text-gray-800'}`}>
      {priority}
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

export function CallDetailsModal({ isOpen, onClose, callId }: CallDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'notes' | 'tickets'>('overview')
  const modalRef = useRef<HTMLDivElement>(null)
  const { data: callDetails, loading, error } = useCallDetails(callId)

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

  // Handle escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PhoneIcon },
    { id: 'transcript', label: 'Transcript', icon: DocumentTextIcon },
    { id: 'notes', label: 'Notes', icon: ClockIcon },
    { id: 'tickets', label: 'Related Tickets', icon: LanguageIcon }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <PhoneIcon className="h-6 w-6 text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Call Details</h3>
              <p className="text-sm text-gray-600">
                {callDetails?.cli || callId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading call details...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading call details</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        ) : callDetails ? (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 flex-shrink-0">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && callDetails && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Call Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">CLI Number</label>
                          <p className="text-sm text-gray-900">{callDetails.cli}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Received Date & Time</label>
                          <p className="text-sm text-gray-900">{formatDateTime(callDetails.receivedDateTime)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Language</label>
                          <p className="text-sm text-gray-900">{callDetails.language}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Duration</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{callDetails.voiceFile}</span>
                            <button className="text-indigo-600 hover:text-indigo-900 p-1">
                              <PlayIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Customer Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Customer Name</label>
                          <p className="text-sm text-gray-900">{callDetails.customerName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Address</label>
                          <p className="text-sm text-gray-900">{callDetails.customerAddress}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Query Type</label>
                          <p className="text-sm text-gray-900">{callDetails.queryType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Category</label>
                          <p className="text-sm text-gray-900">{callDetails.complaintCategory}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Information */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Status & Resolution</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Current Status</label>
                          <div className="mt-1">
                            {getStatusBadge(callDetails.status)}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Priority</label>
                          <div className="mt-1">
                            {getPriorityBadge(callDetails.priority)}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Assigned Agent</label>
                          <p className="text-sm text-gray-900">{callDetails.assignedAgent}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tickets Identified</label>
                          <p className="text-sm text-gray-900">{callDetails.ticketsIdentified}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Resolution</label>
                        <p className="text-sm text-gray-900 mt-1">{callDetails.resolution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transcript' && callDetails && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Call Transcript</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {callDetails.callTranscript}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && callDetails && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Call Notes</h4>
                  <div className="space-y-3">
                    {callDetails.callNotes.map((note, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">{formatDateTime(note.timestamp)}</span>
                          <span className="text-xs text-indigo-600 font-medium">{note.addedBy}</span>
                        </div>
                        <p className="text-sm text-gray-700">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tickets' && callDetails && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Related Tickets</h4>
                  <div className="space-y-3">
                    {callDetails.relatedTickets.map((ticket, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{ticket.ticketId}</span>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{ticket.type}</span>
                          <span className="text-xs text-gray-500">{formatDateTime(ticket.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-gray-600">No call details available</p>
          </div>
        )}
      </div>
    </div>
  )
}