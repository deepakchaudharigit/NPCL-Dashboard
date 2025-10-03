import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - NPCL Power Management',
  description: 'Secure authentication for NPCL power management dashboard. Login, register, and manage your account with role-based access control.',
  keywords: ['NPCL login', 'power management authentication', 'secure login', 'user authentication', 'dashboard access', 'account management'],
  openGraph: {
    title: 'NPCL Power Management Authentication',
    description: 'Secure authentication for power management dashboard with role-based access control',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}