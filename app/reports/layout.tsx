'use client'

import { SimpleAuthLayout } from '@/components/layout/SimpleAuthLayout'

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SimpleAuthLayout title="Reports">
      {children}
    </SimpleAuthLayout>
  )
}