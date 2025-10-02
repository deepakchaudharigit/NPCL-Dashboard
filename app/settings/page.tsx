'use client'

import { useState, useEffect } from 'react'
import { 
  UserIcon, 
  UsersIcon,
  KeyIcon, 
  BellIcon, 
  ShieldCheckIcon,
  CogIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { DynamicUserManagement } from '@/components/settings/DynamicUserManagement'
import { DynamicSystemSettings } from '@/components/settings/DynamicSystemSettings'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { PasswordSettings } from '@/components/settings/PasswordSettings'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { SecuritySettings } from '@/components/settings/SecuritySettings'
import { useSettingsData, fallbackSettingsData } from '@/hooks/use-settings-data'

type SettingsTab = 'users' | 'system' | 'profile' | 'password' | 'notifications' | 'security'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users')
  const { data, loading, error, refetch } = useSettingsData()
  
  // Use real data if available, otherwise fallback
  const settingsData = data || fallbackSettingsData

  const tabs = [
    {
      id: 'users' as SettingsTab,
      name: 'User Management',
      icon: UsersIcon,
      description: 'Manage users, roles, and permissions'
    },
    {
      id: 'system' as SettingsTab,
      name: 'System Settings',
      icon: CogIcon,
      description: 'Application and system configurations'
    },
    {
      id: 'profile' as SettingsTab,
      name: 'Profile',
      icon: UserIcon,
      description: 'Manage your personal information'
    },
    {
      id: 'password' as SettingsTab,
      name: 'Password',
      icon: KeyIcon,
      description: 'Change your password and security settings'
    },
    {
      id: 'notifications' as SettingsTab,
      name: 'Notifications',
      icon: BellIcon,
      description: 'Configure notification preferences'
    },
    {
      id: 'security' as SettingsTab,
      name: 'Security',
      icon: ShieldCheckIcon,
      description: 'Manage security and privacy settings'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <DynamicUserManagement 
            users={settingsData.users?.data || []}
            stats={settingsData.users?.stats}
            loading={loading}
            onRefresh={() => refetch('users')}
          />
        )
      case 'system':
        return (
          <DynamicSystemSettings 
            settings={settingsData.settings?.categories || {}}
            categoryList={settingsData.settings?.categoryList || []}
            loading={loading}
            onRefresh={() => refetch('system')}
          />
        )
      case 'profile':
        return <ProfileSettings />
      case 'password':
        return <PasswordSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'security':
        return <SecuritySettings />
      default:
        return (
          <DynamicUserManagement 
            users={settingsData.users?.data || []}
            stats={settingsData.users?.stats}
            loading={loading}
            onRefresh={() => refetch('users')}
          />
        )
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          {loading && (
            <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 flex-shrink-0">
          <div className="text-red-600 text-sm">
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => refetch()}
            className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Settings Content */}
      <div className="flex-1 min-h-0 flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 min-h-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}