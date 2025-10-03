'use client'

import { SimpleAuthLayout } from '@/components/layout/SimpleAuthLayout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SimpleAuthLayout title="Dashboard">
      {children}
    </SimpleAuthLayout>
  )
}