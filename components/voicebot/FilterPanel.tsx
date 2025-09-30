'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { FilterState } from '@/types/voicebot'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterState) => void
}

export function FilterPanel({ isOpen, onClose, onApply }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    callResolutionStatus: [],
    language: [],
    cli: '',
    durationMax: 200
  })

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* Call Resolution Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Resolution Status
            </label>
            <select className="w-full h-11 px-3 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Select here</option>
              <option value="docket-generated">Docket generated</option>
              <option value="docket-review">Docket under review</option>
              <option value="missing">Missing</option>
              <option value="aborted">Aborted</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select className="w-full h-11 px-3 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Select here</option>
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
              <option value="bengali">Bengali</option>
              <option value="telugu">Telugu</option>
              <option value="tamil">Tamil</option>
              <option value="marathi">Marathi</option>
            </select>
          </div>

          {/* CLI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CLI
            </label>
            <input
              type="text"
              placeholder="Select here"
              value={filters.cli}
              onChange={(e) => setFilters({ ...filters, cli: e.target.value })}
              className="w-full h-11 px-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Duration (seconds)
              </label>
              <span className="text-sm text-gray-900">{filters.durationMax}s</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="600"
                value={filters.durationMax}
                onChange={(e) => setFilters({ ...filters, durationMax: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${(filters.durationMax / 600) * 100}%, #E5E7EB ${(filters.durationMax / 600) * 100}%, #E5E7EB 100%)`
                }}
              />
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #6366F1;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .slider::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #6366F1;
                  cursor: pointer;
                  border: none;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={handleApply}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-base font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  )
}