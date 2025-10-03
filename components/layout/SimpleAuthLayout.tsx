'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/voicebot/Sidebar'

interface SimpleAuthLayoutProps {
  children: React.ReactNode
  title?: string
}

export function SimpleAuthLayout({ 
  children, 
  title
}: SimpleAuthLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/login')
      return
    }
  }, [session, status, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        {/* Sidebar */}
        <div className="w-60 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main className="flex-1 px-6 py-3 overflow-hidden">
            <div className="h-full overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout - Simple version */}
      <div className="md:hidden h-full flex flex-col">
        <div className="p-4 flex-1 overflow-hidden">
          <h1 className="text-xl font-bold mb-4">{title}</h1>
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}