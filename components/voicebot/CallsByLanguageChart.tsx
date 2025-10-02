'use client'

import { LanguageChartData } from '@/hooks/use-dashboard-data'

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
  // Use provided data or fallback to maintain panel structure
  let languageData = data && data.length > 0 ? data : fallbackData
  
  // If using real data, add color properties
  if (data && data.length > 0) {
    languageData = data.map(item => ({
      ...item,
      ...getLanguageColors(item.language)
    }))
  }

  // Calculate the maximum value for bar width scaling
  const maxCalls = Math.max(...languageData.map(item => item.calls))

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Calls by Language</h3>
        {loading && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        )}
      </div>
      
      <div className="space-y-2 overflow-y-auto flex-1">
        {languageData.map((item, index) => {
          // Calculate bar width as percentage of max value
          const barWidth = maxCalls > 0 ? (item.calls / maxCalls) * 100 : 0
          
          return (
            <div 
              key={index}
              className="relative overflow-hidden rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              {/* Background bar with width based on call count */}
              <div 
                className={`absolute inset-0 ${item.bgColor} transition-all duration-300`}
                style={{ width: `${barWidth}%` }}
              />
              
              {/* Content overlay */}
              <div className="relative flex items-center justify-between p-2 bg-gray-50 bg-opacity-20">
                <span className={`text-sm font-medium ${item.textColor} relative z-10`}>
                  {item.language}
                </span>
                <span className={`text-sm font-bold ${item.textColor} relative z-10`}>
                  {item.calls}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}