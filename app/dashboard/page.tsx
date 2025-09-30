'use client'

import { useState } from 'react'
import { 
  PhoneIcon, 
  ClockIcon, 
  GlobeAltIcon, 
  DocumentTextIcon,
  ChevronDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { MetricsCard } from '@/components/voicebot/MetricsCard'
import { CallsByLanguageChart } from '@/components/voicebot/CallsByLanguageChart'
import { CallsByStatusPanel } from '@/components/voicebot/CallsByStatusPanel'

export default function DashboardPage() {
  const [dateRange] = useState('16 Jan, 2025 - 16 Feb, 2025')

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
        
        {/* Date Range Picker */}
        <div className="relative">
          <button className="w-full md:w-60 h-10 bg-white border border-gray-200 rounded-lg px-4 flex items-center justify-between text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer">
            <span>{dateRange}</span>
            <CalendarIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 flex-shrink-0">
        <MetricsCard
          title="Total Calls"
          value="18"
          growth="+12% from yesterday"
          icon={<PhoneIcon className="w-6 h-6" />}
          iconBgColor="#EEF2FF"
          iconColor="#6366F1"
        />
        
        <MetricsCard
          title="Avg Duration"
          value="2:35"
          growth="+5% from yesterday"
          icon={<ClockIcon className="w-6 h-6" />}
          iconBgColor="#F5F3FF"
          iconColor="#8B5CF6"
        />
        
        <MetricsCard
          title="Language"
          value="6"
          growth="+12% from yesterday"
          icon={<GlobeAltIcon className="w-6 h-6" />}
          iconBgColor="#FDF2F8"
          iconColor="#EC4899"
        />
        
        <MetricsCard
          title="Docket Count"
          value="56"
          growth="-35% from yesterday"
          icon={<DocumentTextIcon className="w-6 h-6" />}
          iconBgColor="#FFFBEB"
          iconColor="#F59E0B"
          isNegative={true}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full flex-1 min-h-0">
        <CallsByLanguageChart />
        <CallsByStatusPanel />
      </div>
    </div>
  )
}