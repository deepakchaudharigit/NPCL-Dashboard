'use client'

import { useState } from 'react'
import { 
  CogIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { SystemSetting } from '@/hooks/use-settings-data'

interface DynamicSystemSettingsProps {
  settings: { [category: string]: SystemSetting[] }
  categoryList: string[]
  loading?: boolean
  onRefresh: () => void
}

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: any } = {
    'General': CogIcon,
    'Appearance': PencilIcon,
    'Security': ExclamationTriangleIcon,
    'Notifications': CheckIcon,
    'System': CogIcon
  }
  return icons[category] || CogIcon
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'General': 'bg-blue-50 text-blue-700 border-blue-200',
    'Appearance': 'bg-purple-50 text-purple-700 border-purple-200',
    'Security': 'bg-red-50 text-red-700 border-red-200',
    'Notifications': 'bg-green-50 text-green-700 border-green-200',
    'System': 'bg-gray-50 text-gray-700 border-gray-200'
  }
  return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const formatSettingValue = (value: string, dataType: string) => {
  switch (dataType) {
    case 'boolean':
      return value === 'true' ? 'Enabled' : 'Disabled'
    case 'number':
      return value
    default:
      return value
  }
}

const getSettingInput = (setting: SystemSetting, value: string, onChange: (value: string) => void) => {
  switch (setting.dataType) {
    case 'boolean':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
        </select>
      )
    case 'number':
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      )
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      )
  }
}

export function DynamicSystemSettings({ settings, categoryList, loading, onRefresh }: DynamicSystemSettingsProps) {
  const [editingSettings, setEditingSettings] = useState<{ [key: string]: string }>({})
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'General': true // Expand General by default
  })

  const handleEditSetting = (setting: SystemSetting) => {
    setEditingSettings({
      ...editingSettings,
      [setting.key]: setting.value
    })
  }

  const handleSaveSetting = (setting: SystemSetting) => {
    const newValue = editingSettings[setting.key]
    if (newValue !== undefined) {
      // TODO: Implement actual save functionality
      console.log('Save setting:', setting.key, newValue)
      
      // Remove from editing state
      const newEditingSettings = { ...editingSettings }
      delete newEditingSettings[setting.key]
      setEditingSettings(newEditingSettings)
    }
  }

  const handleCancelEdit = (setting: SystemSetting) => {
    const newEditingSettings = { ...editingSettings }
    delete newEditingSettings[setting.key]
    setEditingSettings(newEditingSettings)
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    })
  }

  const isEditing = (settingKey: string) => {
    return editingSettings.hasOwnProperty(settingKey)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <ArrowPathIcon className="h-6 w-6 text-gray-400 animate-spin" />
          <span className="text-gray-600">Loading system settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
          <p className="text-sm text-gray-600 mt-1">Configure application and system preferences</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Settings Categories */}
      <div className="space-y-6">
        {categoryList.map((category) => {
          const categorySettings = settings[category] || []
          const IconComponent = getCategoryIcon(category)
          const isExpanded = expandedCategories[category]

          return (
            <div key={category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full px-6 py-4 flex items-center justify-between ${getCategoryColor(category)} border-b hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5" />
                  <div className="text-left">
                    <h3 className="font-medium">{category}</h3>
                    <p className="text-sm opacity-75">{categorySettings.length} settings</p>
                  </div>
                </div>
                <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Category Settings */}
              {isExpanded && (
                <div className="divide-y divide-gray-200">
                  {categorySettings.map((setting) => (
                    <div key={setting.key} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 mr-6">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {setting.dataType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                          
                          {isEditing(setting.key) ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                {getSettingInput(
                                  setting,
                                  editingSettings[setting.key],
                                  (value) => setEditingSettings({
                                    ...editingSettings,
                                    [setting.key]: value
                                  })
                                )}
                              </div>
                              <button
                                onClick={() => handleSaveSetting(setting)}
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                                title="Save"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleCancelEdit(setting)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                title="Cancel"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-900">
                                  {formatSettingValue(setting.value, setting.dataType)}
                                </span>
                                {setting.dataType === 'boolean' && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    setting.value === 'true' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {setting.value === 'true' ? 'ON' : 'OFF'}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleEditSetting(setting)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                                title="Edit Setting"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          
                          <div className="mt-3 text-xs text-gray-500">
                            Last updated: {new Date(setting.updatedAt).toLocaleString('en-GB')} by {setting.updatedBy}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Settings Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Settings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Object.values(settings).reduce((total, categorySettings) => total + categorySettings.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Settings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{categoryList.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Object.values(settings).reduce((total, categorySettings) => 
                total + categorySettings.filter(s => s.dataType === 'boolean' && s.value === 'true').length, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Enabled Features</div>
          </div>
        </div>
      </div>
    </div>
  )
}