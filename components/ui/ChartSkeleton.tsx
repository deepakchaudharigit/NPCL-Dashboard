'use client'

interface ChartSkeletonProps {
  title: string
  rows?: number
}

export function ChartSkeleton({ title, rows = 8 }: ChartSkeletonProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 h-full flex flex-col min-h-[400px] animate-pulse">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      
      <div className="space-y-2 overflow-y-auto flex-1 pr-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="relative bg-gray-50 rounded-lg h-12 flex items-center overflow-hidden">
            {/* Skeleton bar */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-gray-200 rounded-lg"
              style={{ 
                width: `${Math.random() * 60 + 20}%`,
                animationDelay: `${index * 100}ms`
              }}
            />
            
            {/* Skeleton content */}
            <div className="relative flex items-center justify-between w-full px-4 z-10">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-300 rounded w-6"></div>
                <div className="h-3 bg-gray-300 rounded w-12 hidden sm:block"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 h-3 bg-gray-200 rounded w-48 mx-auto"></div>
    </div>
  )
}