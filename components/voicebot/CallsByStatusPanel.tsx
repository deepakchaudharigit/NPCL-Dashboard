'use client'

import { StatusPanelData } from '@/hooks/use-dashboard-data'
import { ChartSkeleton } from '@/components/ui/ChartSkeleton'

// Fallback data to maintain panel structure - now with colors for visual enhancement
const fallbackStatusData = [
  { status: 'Docket generated', count: 4 },
  { status: 'Transferred to Agent', count: 2 },
  { status: 'Docket follow-up', count: 4 },
  { status: 'Missing', count: 1 },
  { status: 'Aborted', count: 6 },
  { status: 'Resolved', count: 9 },
  { status: 'Reopened', count: 3 },
  { status: 'Under Review', count: 5 },
]

// Status to color mapping function for visual enhancement
function getStatusColors(status: string): { bgColor: string; textColor: string } {
  const colorMap: { [key: string]: { bgColor: string; textColor: string } } = {
    'Docket generated': { bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    'Transferred to Agent': { bgColor: 'bg-green-100', textColor: 'text-green-800' },
    'Docket follow-up': { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    'Missing': { bgColor: 'bg-red-100', textColor: 'text-red-800' },
    'Aborted': { bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
    'Resolved': { bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
    'Reopened': { bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    'Under Review': { bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    'Pending': { bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
    'Completed': { bgColor: 'bg-teal-100', textColor: 'text-teal-800' },
    'In Progress': { bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
    'Cancelled': { bgColor: 'bg-rose-100', textColor: 'text-rose-800' },
  }
  return colorMap[status] || { bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
}

interface CallsByStatusPanelProps {
  data?: StatusPanelData[]
  loading?: boolean
}

export function CallsByStatusPanel({ data, loading = false }: CallsByStatusPanelProps) {
  // Show loading skeleton while data is being fetched
  if (loading && (!data || data.length === 0)) {
    return <ChartSkeleton title="Calls by Status" rows={8} />
  }

  // Use provided data or fallback to maintain panel structure
  let statusData = data && data.length > 0 ? data : fallbackStatusData
  
  // Add color properties for visual enhancement
  statusData = statusData.map(item => ({
    ...item,
    ...getStatusColors(item.status)
  }))

  // Sort statuses by count in descending order
  statusData = [...statusData].sort((a, b) => b.count - a.count)

  // Calculate the maximum value for bar width scaling and total for percentages
  const maxCount = Math.max(...statusData.map(item => item.count))
  const totalCount = statusData.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900">Calls by Status</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Total: {totalCount}</span>
          {loading && (
            <div className="w-3 h-3 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 overflow-hidden flex-1">
        {statusData.map((item, index) => {
          // Calculate bar width with minimum 15% for readability
          const rawBarWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0
          const barWidth = Math.max(rawBarWidth, 15)
          const percentage = totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : '0'
          
          return (
            <div 
              key={`${item.status}-${index}`}
              className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">
                {item.status}: {item.count} calls ({percentage}%)
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
              </div>
              
              {/* Background container */}
              <div className="relative bg-gray-50 rounded h-8 flex items-center">
                {/* Animated bar with correct proportional width */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 ${item.bgColor} rounded transition-all duration-700 ease-out`}
                  style={{ 
                    width: `${barWidth}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
                
                {/* Content overlay with proper spacing */}
                <div className="relative flex items-center justify-between w-full px-3 z-10">
                  <span className={`text-sm font-medium ${item.textColor} transition-colors duration-200 truncate max-w-[55%]`}>
                    {item.status}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-sm font-bold ${item.textColor} transition-colors duration-200`}>
                      {item.count}
                    </span>
                    <span className={`text-xs ${item.textColor} opacity-75 group-hover:opacity-100 transition-opacity duration-200`}>
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Data validation indicator */}
      <div className="mt-2 text-xs text-gray-400 text-center flex-shrink-0">
        {statusData.length} statuses • {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}