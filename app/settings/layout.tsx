'use client'

import { Sidebar } from '@/components/voicebot/Sidebar'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="ml-0 md:ml-60 h-screen p-4 md:p-6 bg-gray-50 w-full overflow-y-auto">
        {children}
      </main>
    </div>
  )
}