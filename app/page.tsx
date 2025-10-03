/**
 * Home Page Component
 * Landing page with login options and demo credentials for the NPCL VoiceBot Call Management System.
 */

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NPCL Power Management Dashboard - Real-time Energy Monitoring',
  description: 'NPCL Power Management Dashboard provides comprehensive real-time monitoring, analytics, and control of power generation and distribution systems. Advanced energy management for optimal grid performance.',
  keywords: ['NPCL', 'power management', 'energy monitoring', 'dashboard', 'power generation', 'grid management', 'electricity', 'renewable energy', 'power analytics', 'energy efficiency'],
  openGraph: {
    title: 'NPCL Power Management Dashboard - Real-time Energy Monitoring',
    description: 'Comprehensive power management dashboard for real-time energy monitoring and grid optimization',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            NPCL VoiceBot
          </h1>
          <p className="text-gray-600 mb-8">
            Call Management Dashboard
          </p>
          
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full btn-primary block text-center"
            >
              Login to Dashboard
            </Link>
            
            <Link
              href="/auth/register"
              className="w-full btn-outline block text-center"
            >
              Register Account
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Demo Credentials:</p>
            <p>Admin: admin@npcl.com / admin123</p>
            <p>Operator: operator@npcl.com / operator123</p>
          </div>
        </div>
      </div>
    </div>
  )
}