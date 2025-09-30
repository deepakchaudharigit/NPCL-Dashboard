'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const data = [
  { language: 'Hindi', calls: 4, color: '#22D3EE' },
  { language: 'Bengali', calls: 3, color: '#FB923C' },
  { language: 'Telugu', calls: 7, color: '#34D399' },
  { language: 'Marathi', calls: 4, color: '#60A5FA' },
  { language: 'Tamil', calls: 1, color: '#C084FC' },
  { language: 'Urdu', calls: 6, color: '#F87171' },
]

export function CallsByLanguageChart() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Calls by Language</h3>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis 
              type="category" 
              dataKey="language" 
              axisLine={false} 
              tickLine={false}
              width={60}
            />
            <Bar 
              dataKey="calls" 
              radius={[0, 6, 6, 0]}
              fill="#6366F1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}