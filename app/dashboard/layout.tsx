'use client'

import { Sidebar } from '@/components/voicebot/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      {/* Fixed: Ensure proper spacing for sidebar on all screen sizes */}
      <main className="flex-1 ml-0 md:ml-60 h-screen p-4 md:p-6 bg-gray-50 overflow-y-auto min-w-0">
        <div className="max-w-full h-full">
          {children}
        </div>
      </main>
    </div>
  )
}