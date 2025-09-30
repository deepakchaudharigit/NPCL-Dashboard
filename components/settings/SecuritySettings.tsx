'use client'

import { useState } from 'react'
import { 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon, 
  ClockIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('24')

  // Mock active sessions data
  const activeSessions = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Mumbai, India',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: '3',
      device: 'Firefox on MacOS',
      location: 'Delhi, India',
      lastActive: '2 days ago',
      current: false
    }
  ]

  const handleTwoFactorToggle = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTwoFactorEnabled(!twoFactorEnabled)
      setMessage({ 
        type: 'success', 
        text: `Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!` 
      })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update two-factor authentication' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSessionTimeoutChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeout = e.target.value
    setSessionTimeout(newTimeout)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessage({ type: 'success', text: 'Session timeout updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update session timeout' })
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessage({ type: 'success', text: 'Session terminated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to terminate session' })
    }
  }

  const handleTerminateAllSessions = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'All other sessions terminated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to terminate sessions' })
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account security and privacy settings</p>
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

      <div className="space-y-8">
        {/* Two-Factor Authentication */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add an extra layer of security to your account by requiring a verification code in addition to your password.
                </p>
                {twoFactorEnabled && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Two-factor authentication is enabled. You'll need your authenticator app to sign in.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleTwoFactorToggle}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                twoFactorEnabled
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } disabled:opacity-50`}
            >
              {isLoading ? 'Processing...' : twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <ClockIcon className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Session Management</h3>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout
            </label>
            <select
              value={sessionTimeout}
              onChange={handleSessionTimeoutChange}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">1 hour</option>
              <option value="8">8 hours</option>
              <option value="24">24 hours</option>
              <option value="168">1 week</option>
              <option value="720">30 days</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              You'll be automatically logged out after this period of inactivity.
            </p>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ComputerDesktopIcon className="h-6 w-6 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
            </div>
            <button
              onClick={handleTerminateAllSessions}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Terminate All Others
            </button>
          </div>
          
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{session.device}</span>
                        {session.current && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.location} • Last active {session.lastActive}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => handleTerminateSession(session.id)}
                      className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Terminate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-yellow-900">Security Recommendations</h3>
              <ul className="text-sm text-yellow-800 mt-2 space-y-2">
                <li>• Use a strong, unique password for your account</li>
                <li>• Enable two-factor authentication for enhanced security</li>
                <li>• Regularly review your active sessions</li>
                <li>• Keep your contact information up to date</li>
                <li>• Report any suspicious activity immediately</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Activity Logging</h4>
                <p className="text-sm text-gray-500">Log your account activity for security purposes</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Login Notifications</h4>
                <p className="text-sm text-gray-500">Get notified of new login attempts</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}