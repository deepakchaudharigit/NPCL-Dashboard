/**
 * Home Page Component
 * Landing page with login options and demo credentials for the NPCL VoiceBot Call Management System.
 */

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NPCL VoiceBot Dashboard - Call Management System',
  description: 'Welcome to NPCL VoiceBot Dashboard - A comprehensive call management system for VoiceBot interactions, analytics, and customer service operations.',
  keywords: ['NPCL', 'voicebot', 'call management', 'dashboard', 'customer service', 'analytics', 'voice recognition'],
  openGraph: {
    title: 'NPCL VoiceBot Dashboard - Call Management System',
    description: 'Comprehensive VoiceBot call management system for customer service analytics',
    type: 'website',
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