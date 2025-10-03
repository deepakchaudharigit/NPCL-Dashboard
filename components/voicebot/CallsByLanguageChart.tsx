'use client'

import { LanguageChartData } from '@/hooks/use-dashboard-data'
import { ChartSkeleton } from '@/components/ui/ChartSkeleton'

// Fallback data to maintain panel structure - now with background and text colors like status panel
const fallbackData = [
  { language: 'Hindi', calls: 4, bgColor: 'bg-cyan-100', textColor: 'text-cyan-800' },
  { language: 'Bengali', calls: 3, bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  { language: 'Telugu', calls: 2, bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
  { language: 'Marathi', calls: 3, bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { language: 'Tamil', calls: 2, bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
  { language: 'Urdu', calls: 4, bgColor: 'bg-rose-100', textColor: 'text-rose-800' },
  { language: 'Malayalam', calls: 5, bgColor: 'bg-teal-100', textColor: 'text-teal-800' },
  { language: 'Kannada', calls: 2, bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
]

// Language to color mapping function
function getLanguageColors(language: string): { bgColor: string; textColor: string } {
  const colorMap: { [key: string]: { bgColor: string; textColor: string } } = {
    'Hindi': { bgColor: 'bg-cyan-100', textColor: 'text-cyan-800' },
    'Bengali': { bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    'Telugu': { bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
    'Marathi': { bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    'Tamil': { bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    'Urdu': { bgColor: 'bg-rose-100', textColor: 'text-rose-800' },
    'Malayalam': { bgColor: 'bg-teal-100', textColor: 'text-teal-800' },
    'Kannada': { bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
    'English': { bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
    'Gujarati': { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  }
  return colorMap[language] || { bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
}

interface CallsByLanguageChartProps {
  data?: LanguageChartData[]
  loading?: boolean
}

export function CallsByLanguageChart({ data, loading = false }: CallsByLanguageChartProps) {
  // Show loading skeleton while data is being fetched
  if (loading && (!data || data.length === 0)) {
    return <ChartSkeleton title="Calls by Language" rows={8} />
  }

  // Use provided data or fallback to maintain panel structure
  let languageData = data && data.length > 0 ? data : fallbackData
  
  // If using real data, add color properties
  if (data && data.length > 0) {
    languageData = data.map(item => ({
      ...item,
      ...getLanguageColors(item.language)
    }))
  }

  // Sort languages by call count in descending order
  languageData = [...languageData].sort((a, b) => b.calls - a.calls)

  // Calculate the maximum value for bar width scaling and total for percentages
  const maxCalls = Math.max(...languageData.map(item => item.calls))
  const totalCalls = languageData.reduce((sum, item) => sum + item.calls, 0)

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900">Calls by Language</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Total: {totalCalls}</span>
          {loading && (
            <div className="w-3 h-3 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 overflow-hidden flex-1">
        {languageData.map((item, index) => {
          // Calculate bar width with minimum 15% for readability
          const rawBarWidth = maxCalls > 0 ? (item.calls / maxCalls) * 100 : 0
          const barWidth = Math.max(rawBarWidth, 15)
          const percentage = totalCalls > 0 ? ((item.calls / totalCalls) * 100).toFixed(1) : '0'
          
          return (
            <div 
              key={`${item.language}-${index}`}
              className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">
                {item.language}: {item.calls} calls ({percentage}%)
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
                  <span className={`text-sm font-medium ${item.textColor} transition-colors duration-200 truncate`}>
                    {item.language}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-sm font-bold ${item.textColor} transition-colors duration-200`}>
                      {item.calls}
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
        {languageData.length} languages • {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}