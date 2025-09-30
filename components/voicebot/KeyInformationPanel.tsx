'use client'

import type { CallDetails } from '@/types/voicebot'

const mockCallDetails: CallDetails = {
  id: '1',
  name: 'Rajesh Kumar',
  address: '123 Main Street, Mumbai Central, Mumbai - 400001',
  dateTime: '2025-07-16 09:30:15',
  language: 'Hindi',
  duration: '3:00',
  area: 'Mumbai Central',
  tickets: [
    { ticketNumber: '#560193', queryType: 'Technical Support', status: 'Ticket generated' },
    { ticketNumber: '#560193', queryType: 'Billing Inquiry', status: 'Resolved' },
    { ticketNumber: '#560194', queryType: 'Product Feedback', status: 'Missing' },
    { ticketNumber: '#560195', queryType: 'General Inquiry', status: 'Reopened' }
  ],
  previousCalls: [
    {
      date: '2025-07-15 14:20:10',
      description: 'Follow-up on previous power outage complaint',
      status: 'Docket generated',
      duration: '3:00'
    }
  ],
  conversation: []
}

const getTicketStatusBadge = (status: string) => {
  const styles = {
    'Ticket generated': 'bg-green-100 text-green-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Missing': 'bg-red-100 text-red-800',
    'Reopened': 'bg-blue-100 text-blue-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

interface KeyInformationPanelProps {
  callId: string
  onViewConversation?: () => void
}

export function KeyInformationPanel({ callId: _callId, onViewConversation }: KeyInformationPanelProps) {
  const callDetails = mockCallDetails // In real app, fetch by callId

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
      {/* Key Information Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">{callDetails.name}</h3>
          <p className="text-sm text-gray-600">{callDetails.address}</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Date & Time:</span>
            <span className="text-sm text-gray-900">{callDetails.dateTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Language:</span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-600">
              {callDetails.language}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Duration:</span>
            <span className="text-sm text-gray-900">{callDetails.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Home/Area:</span>
            <span className="text-sm text-gray-900">{callDetails.area}</span>
          </div>
        </div>
      </div>

      {/* Tickets Identified Section */}
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-4">Tickets identified</h4>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket number
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Query type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {callDetails.tickets.map((ticket, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900">{ticket.ticketNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{ticket.queryType}</td>
                  <td className="px-4 py-3">{getTicketStatusBadge(ticket.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voice Recording Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-gray-900">Voice Recording</h4>
          <button
            onClick={onViewConversation}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View conversation
          </button>
        </div>
        
        {/* Audio Player */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center hover:bg-indigo-100">
              <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Waveform */}
            <div className="flex-1 h-15 bg-white rounded relative overflow-hidden">
              <div className="absolute inset-0 flex items-center px-4">
                <div className="w-full h-1 bg-indigo-600 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            
            <span className="text-sm text-gray-600">{callDetails.duration}</span>
          </div>
        </div>
      </div>

      {/* Previous Calls History */}
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-4">Previous Calls History</h4>
        <div className="space-y-3">
          {callDetails.previousCalls.map((call, index) => (
            <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">{call.date}</p>
                <p className="text-sm text-gray-600 mt-1">{call.description}</p>
                <p className="text-xs text-gray-500 mt-1">{call.duration}</p>
              </div>
              <div className="ml-4">
                {getTicketStatusBadge(call.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}