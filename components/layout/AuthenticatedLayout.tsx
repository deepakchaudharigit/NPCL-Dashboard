'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/voicebot/Sidebar'
import { ResponsiveLayout } from './ResponsiveLayout'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
  title?: string
  className?: string
  description?: string
}

export function AuthenticatedLayout({ 
  children, 
  title,
  className = '',
  description
}: AuthenticatedLayoutProps) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-60">
          <main className={`p-6 ${className}`}>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <ResponsiveLayout
          title={title}
          sidebar={<Sidebar />}
          showMobileHeader={true}
          showMobileNav={true}
          className={className}
        >
          {children}
        </ResponsiveLayout>
      </div>
    </div>
  )
}