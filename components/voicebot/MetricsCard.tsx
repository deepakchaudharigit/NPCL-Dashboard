'use client'

import { ReactNode } from 'react'

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
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 h-32 flex flex-col justify-between">
      {/* Icon Container */}
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
        style={{ backgroundColor: iconBgColor }}
      >
        <div 
          className="w-5 h-5"
          style={{ color: iconColor }}
        >
          {icon}
        </div>
      </div>
      
      {/* Value */}
      <div className="text-3xl font-bold text-gray-800 mb-1">
        {value}
      </div>
      
      {/* Label */}
      <div className="text-xs font-medium text-gray-600 mb-1">
        {title}
      </div>
      
      {/* Growth Indicator */}
      <div className={`text-xs font-medium flex items-center gap-1 ${
        isNegative ? 'text-red-500' : 'text-green-500'
      }`}>
        {growth}
      </div>
    </div>
  )
}