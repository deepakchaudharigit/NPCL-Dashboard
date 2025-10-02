'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { LanguageChartData } from '@/hooks/use-dashboard-data'

// Fallback data to maintain chart structure
const fallbackData = [
  { language: 'Hindi', calls: 4, color: '#0891b2' },
  { language: 'Bengali', calls: 3, color: '#ea580c' },
  { language: 'Telugu', calls: 2, color: '#059669' },
  { language: 'Marathi', calls: 3, color: '#2563eb' },
  { language: 'Tamil', calls: 2, color: '#7c3aed' },
  { language: 'Urdu', calls: 4, color: '#e11d48' },
  { language: 'Malayalam', calls: 5, color: '#0d9488' },
  { language: 'Kannada', calls: 2, color: '#d97706' },
]

// Language to color mapping function for bar chart
function getLanguageBarColor(language: string): string {
  const colorMap: { [key: string]: string } = {
    'Hindi': '#0891b2',      // cyan-600
    'Bengali': '#ea580c',    // orange-600
    'Telugu': '#059669',     // emerald-600
    'Marathi': '#2563eb',    // blue-600
    'Tamil': '#7c3aed',      // purple-600
    'Urdu': '#e11d48',       // rose-600
    'Malayalam': '#0d9488',  // teal-600
    'Kannada': '#d97706',    // amber-600
    'English': '#4f46e5',    // indigo-600
    'Gujarati': '#ca8a04',   // yellow-600
  }
  return colorMap[language] || '#6b7280' // gray-500
}

interface CallsByLanguageBarChartProps {
  data?: LanguageChartData[]
  loading?: boolean
}

export function CallsByLanguageBarChart({ data, loading = false }: CallsByLanguageBarChartProps) {
  // Use provided data or fallback to maintain chart structure
  let chartData = data && data.length > 0 ? data : fallbackData
  
  // If using real data, add color properties for bars
  if (data && data.length > 0) {
    chartData = data.map(item => ({
      ...item,
      color: getLanguageBarColor(item.language)
    }))
  }

  // Calculate the maximum value for proper axis scaling
  const maxValue = Math.max(...chartData.map(item => item.calls))
  const axisMax = Math.max(maxValue + 1, 5) // Ensure minimum range and add padding

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-indigo-600">{`${payload[0].value}`}</span> calls
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Calls by Language</h3>
        {loading && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        )}
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false}
              domain={[0, axisMax]}
              allowDecimals={false}
              tickCount={Math.min(axisMax + 1, 6)}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              type="category" 
              dataKey="language" 
              axisLine={false} 
              tickLine={false}
              width={55}
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="calls" 
              radius={[0, 4, 4, 0]}
              fill="#6366F1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {chartData.slice(0, 4).map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.language}</span>
          </div>
        ))}
        {chartData.length > 4 && (
          <span className="text-gray-400">+{chartData.length - 4} more</span>
        )}
      </div>
    </div>
  )
}