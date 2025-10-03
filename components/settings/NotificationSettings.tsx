'use client'

import { useState } from 'react'
import { BellIcon, DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

interface NotificationPreferences {
  email: {
    systemAlerts: boolean
    reportGeneration: boolean
    maintenanceUpdates: boolean
    securityAlerts: boolean
    weeklyDigest: boolean
  }
  push: {
    systemAlerts: boolean
    criticalAlerts: boolean
    maintenanceReminders: boolean
    reportReady: boolean
  }
  sms: {
    criticalAlerts: boolean
    systemDown: boolean
    securityBreaches: boolean
  }
}

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      systemAlerts: true,
      reportGeneration: true,
      maintenanceUpdates: false,
      securityAlerts: true,
      weeklyDigest: true
    },
    push: {
      systemAlerts: true,
      criticalAlerts: true,
      maintenanceReminders: false,
      reportReady: true
    },
    sms: {
      criticalAlerts: true,
      systemDown: true,
      securityBreaches: true
    }
  })

  const handleToggle = (category: keyof NotificationPreferences, setting: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !(prev[category] as any)[setting]
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Notification preferences updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notification preferences' })
    } finally {
      setIsLoading(false)
    }
  }

  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    label, 
    description 
  }: { 
    checked: boolean
    onChange: () => void
    label: string
    description?: string 
  }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
        <p className="text-gray-600 mt-1">Choose how you want to be notified about important updates</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Email Notifications */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <EnvelopeIcon className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
          </div>
          <div className="space-y-1">
            <ToggleSwitch
              checked={preferences.email.systemAlerts}
              onChange={() => handleToggle('email', 'systemAlerts')}
              label="System Alerts"
              description="Get notified about system status changes and alerts"
            />
            <ToggleSwitch
              checked={preferences.email.reportGeneration}
              onChange={() => handleToggle('email', 'reportGeneration')}
              label="Report Generation"
              description="Receive notifications when reports are generated"
            />
            <ToggleSwitch
              checked={preferences.email.maintenanceUpdates}
              onChange={() => handleToggle('email', 'maintenanceUpdates')}
              label="Maintenance Updates"
              description="Get updates about scheduled maintenance activities"
            />
            <ToggleSwitch
              checked={preferences.email.securityAlerts}
              onChange={() => handleToggle('email', 'securityAlerts')}
              label="Security Alerts"
              description="Important security notifications and alerts"
            />
            <ToggleSwitch
              checked={preferences.email.weeklyDigest}
              onChange={() => handleToggle('email', 'weeklyDigest')}
              label="Weekly Digest"
              description="Weekly summary of system activities and reports"
            />
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
          </div>
          <div className="space-y-1">
            <ToggleSwitch
              checked={preferences.push.systemAlerts}
              onChange={() => handleToggle('push', 'systemAlerts')}
              label="System Alerts"
              description="Real-time system status notifications"
            />
            <ToggleSwitch
              checked={preferences.push.criticalAlerts}
              onChange={() => handleToggle('push', 'criticalAlerts')}
              label="Critical Alerts"
              description="Immediate notifications for critical issues"
            />
            <ToggleSwitch
              checked={preferences.push.maintenanceReminders}
              onChange={() => handleToggle('push', 'maintenanceReminders')}
              label="Maintenance Reminders"
              description="Reminders for upcoming maintenance tasks"
            />
            <ToggleSwitch
              checked={preferences.push.reportReady}
              onChange={() => handleToggle('push', 'reportReady')}
              label="Report Ready"
              description="Notifications when reports are ready for download"
            />
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <DevicePhoneMobileIcon className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
          </div>
          <div className="space-y-1">
            <ToggleSwitch
              checked={preferences.sms.criticalAlerts}
              onChange={() => handleToggle('sms', 'criticalAlerts')}
              label="Critical Alerts"
              description="SMS for critical system alerts only"
            />
            <ToggleSwitch
              checked={preferences.sms.systemDown}
              onChange={() => handleToggle('sms', 'systemDown')}
              label="System Down"
              description="Immediate SMS when system goes down"
            />
            <ToggleSwitch
              checked={preferences.sms.securityBreaches}
              onChange={() => handleToggle('sms', 'securityBreaches')}
              label="Security Breaches"
              description="SMS alerts for security incidents"
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Quiet Hours</h3>
          <p className="text-sm text-blue-700 mb-4">
            Set quiet hours to reduce non-critical notifications during specific times.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">Start Time</label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">End Time</label>
              <input
                type="time"
                defaultValue="08:00"
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  )
}