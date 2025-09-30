'use client'

const statusData = [
  { status: 'Docket generated', count: 4, bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { status: 'Transferred to Agent', count: 2, bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { status: 'Docket follow-up', count: 4, bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { status: 'Transformer down', count: 1, bgColor: 'bg-red-100', textColor: 'text-red-800' },
  { status: 'Load shedding', count: 6, bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  { status: 'Abandoned', count: 9, bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  { status: 'Closed', count: 3, bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { status: 'Pending review', count: 5, bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
]

export function CallsByStatusPanel() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Calls by Status</h3>
      
      <div className="space-y-2 overflow-y-auto flex-1">
        {statusData.map((item, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg ${item.bgColor}`}
          >
            <span className={`text-sm font-medium ${item.textColor}`}>
              {item.status}
            </span>
            <span className={`text-sm font-bold ${item.textColor}`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}