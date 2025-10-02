/**
 * Loading Skeleton Component
 * Provides loading placeholders that maintain exact layout dimensions
 */

'use client'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'card' | 'text' | 'chart' | 'button'
  lines?: number
}

export function LoadingSkeleton({ 
  className = '', 
  variant = 'card',
  lines = 1 
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'
  
  switch (variant) {
    case 'card':
      return (
        <div className={`${baseClasses} h-32 w-full ${className}`} />
      )
    
    case 'text':
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }).map((_, i) => (
            <div 
              key={i}
              className={`${baseClasses} h-4 ${
                i === lines - 1 ? 'w-3/4' : 'w-full'
              }`} 
            />
          ))}
        </div>
      )
    
    case 'chart':
      return (
        <div className={`${baseClasses} h-64 w-full ${className}`} />
      )
    
    case 'button':
      return (
        <div className={`${baseClasses} h-10 w-24 ${className}`} />
      )
    
    default:
      return (
        <div className={`${baseClasses} ${className}`} />
      )
  }
}

// Specific skeleton components for dashboard elements
export function MetricsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-32">
      <div className="flex flex-col justify-between h-full">
        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
      <div className="flex-1 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}

export function StatusPanelSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
      <div className="space-y-2 flex-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-6" />
          </div>
        ))}
      </div>
    </div>
  )
}