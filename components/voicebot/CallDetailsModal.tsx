'use client'

import { useState } from 'react'
import { XMarkIcon, PlayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import type { Message } from '@/types/voicebot'

interface CallDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  callId: string
}

const mockConversation: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: 'Hello! Welcome to NPCL customer service. How can I help you today?',
    timestamp: '2025-07-16 09:30:15',
    language: 'DITM'
  },
  {
    id: '2',
    type: 'user',
    content: 'My ticket number is 982374',
    timestamp: '2025-07-16 09:30:25',
    recognized: true
  },
  {
    id: '3',
    type: 'bot',
    content: 'Thank you for providing your ticket number. Let me check the status for you.',
    timestamp: '2025-07-16 09:30:35',
    language: 'Speech'
  },
  {
    id: '4',
    type: 'user',
    content: 'There is a power outage in my area since morning',
    timestamp: '2025-07-16 09:30:45',
    recognized: true
  },
  {
    id: '5',
    type: 'bot',
    content: 'I understand you are experiencing a power outage. I will create a new ticket for this issue and connect you with our technical team.',
    timestamp: '2025-07-16 09:31:00',
    language: 'DITM'
  }
]

export function CallDetailsModal({ isOpen, onClose, callId: _callId }: CallDetailsModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <h2 className="text-xl font-semibold text-gray-900">Voice Bot Conversation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Audio Player */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center hover:bg-indigo-100"
              >
                <PlayIcon className="h-5 w-5 text-indigo-600" />
              </button>
              
              {/* Waveform visualization */}
              <div className="flex-1 h-10 bg-gray-100 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center px-4">
                  <div className="w-full h-1 bg-indigo-600 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <span className="text-sm text-gray-600">3:00</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {/* Call Started Marker */}
            <div className="text-center">
              <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                Call Started
              </div>
            </div>

            {mockConversation.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    message.type === 'bot' ? 'bg-indigo-600' : 'bg-indigo-200'
                  }`}>
                    {message.type === 'bot' ? 'B' : 'U'}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="flex-1">
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'bot' 
                        ? 'bg-gray-100 rounded-bl-sm' 
                        : 'bg-indigo-50 rounded-br-sm'
                    }`}>
                      <p className="text-sm text-gray-900">{message.content}</p>
                      {message.language && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded">
                          {message.language}
                        </span>
                      )}
                      {message.recognized && (
                        <span className="inline-block mt-1 ml-1 w-5 h-5 bg-yellow-100 text-yellow-600 text-xs rounded-full flex items-center justify-center">
                          U
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-3">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Call Ended Marker */}
            <div className="text-center border-t border-dashed border-gray-300 pt-4">
              <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                Call Ended
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}