'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { KeyInformationPanel } from '@/components/voicebot/KeyInformationPanel'
import { CallDetailsModal } from '@/components/voicebot/CallDetailsModal'

export default function CallDetailsPage() {
  const params = useParams()
  const callId = params.id as string
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Call Details</h1>
        <p className="text-gray-600 mt-1">Call ID: {callId}</p>
      </div>

      {/* Key Information Panel */}
      <KeyInformationPanel 
        callId={callId}
        onViewConversation={() => setIsModalOpen(true)}
      />

      {/* Call Details Modal */}
      <CallDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        callId={callId}
      />
    </div>
  )
}