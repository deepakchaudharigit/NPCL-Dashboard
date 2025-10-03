'use client'

import { ReactNode } from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface MetricsCardProps {
  title: string
  value: string | number
  growth: string
  icon: ReactNode
  iconBgColor: string
  iconColor: string
  isNegative?: boolean
}

export function MetricsCard({ 
  title, 
  value, 
  growth, 
  icon, 
  iconBgColor, 
  iconColor,
  isNegative = false 
}: MetricsCardProps) {
  // Extract percentage from growth string for better parsing
  const hasPercentage = growth.includes('%')
  const isPositive = !isNegative && (growth.includes('+') || (!growth.includes('-') && hasPercentage))
  const isNegativeGrowth = isNegative || growth.includes('-')
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-36 flex flex-col overflow-hidden group">
      {/* Icon and Main Content */}
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
          style={{ backgroundColor: iconBgColor }}
        >
          <div 
            className="w-5 h-5"
            style={{ color: iconColor }}
          >
            {icon}
          </div>
        </div>
        
        {/* Value and Title next to icon */}
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-bold text-gray-900 leading-none mb-1">
            {value}
          </div>
          <div className="text-sm font-medium text-gray-600 leading-tight truncate">
            {title}
          </div>
        </div>
        
        {/* Trend Icon */}
        {hasPercentage && (
          <div className={`p-1 rounded-full flex-shrink-0 ${
            isPositive ? 'bg-green-100' : isNegativeGrowth ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            {isPositive ? (
              <ArrowUpIcon className="w-3 h-3 text-green-600" />
            ) : isNegativeGrowth ? (
              <ArrowDownIcon className="w-3 h-3 text-red-600" />
            ) : (
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
            )}
          </div>
        )}
      </div>
      
      {/* Growth Indicator with Enhanced Styling */}
      <div className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded transition-all duration-300 flex-shrink-0 mt-auto ${
        isPositive 
          ? 'text-green-700 bg-green-50' 
          : isNegativeGrowth 
          ? 'text-red-700 bg-red-50'
          : 'text-gray-700 bg-gray-50'
      }`}>
        {/* Trend Arrow Icon */}
        {hasPercentage && (
          isPositive ? (
            <ArrowUpIcon className="w-2.5 h-2.5" />
          ) : isNegativeGrowth ? (
            <ArrowDownIcon className="w-2.5 h-2.5" />
          ) : null
        )}
        <span className="text-xs truncate">{growth}</span>
      </div>
    </div>
  )
}