'use client'

import { SimpleAuthLayout } from '@/components/layout/SimpleAuthLayout'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SimpleAuthLayout title="Settings">
      {children}
    </SimpleAuthLayout>
  )
}