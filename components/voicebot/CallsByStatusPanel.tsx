'use client'

import { StatusPanelData } from '@/hooks/use-dashboard-data'

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
  // Use provided data or fallback to maintain panel structure
  let statusData = data && data.length > 0 ? data : fallbackStatusData
  
  // Add color properties for visual enhancement
  statusData = statusData.map(item => ({
    ...item,
    ...getStatusColors(item.status)
  }))

  // Calculate the maximum value for bar width scaling (proportional to max calls)
  const maxCount = Math.max(...statusData.map(item => item.count))

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Calls by Status</h3>
        {loading && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        )}
      </div>
      
      <div className="space-y-2 overflow-y-auto flex-1">
        {statusData.map((item, index) => {
          // Calculate bar width as percentage of max value (graph visualization)
          const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0
          
          return (
            <div 
              key={index}
              className="relative overflow-hidden rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              {/* Background bar with width based on count (graph feature) */}
              <div 
                className={`absolute inset-0 ${item.bgColor} transition-all duration-300`}
                style={{ width: `${barWidth}%` }}
              />
              
              {/* Content overlay */}
              <div className="relative flex items-center justify-between p-2 bg-gray-50 bg-opacity-20">
                <span className={`text-sm font-medium ${item.textColor} relative z-10`}>
                  {item.status}
                </span>
                <span className={`text-sm font-bold ${item.textColor} relative z-10`}>
                  {item.count}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}