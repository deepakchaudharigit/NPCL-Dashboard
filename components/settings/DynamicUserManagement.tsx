'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { SettingsUser, UserStats } from '@/hooks/use-settings-data'
import { UserFormModal } from './UserFormModal'
import { ConfirmationModal } from './ConfirmationModal'

interface DynamicUserManagementProps {
  users: SettingsUser[]
  stats?: UserStats
  loading?: boolean
  onRefresh: () => void
}

const getRoleBadge = (role: string) => {
  const styles: { [key: string]: string } = {
    'Admin': 'bg-red-100 text-red-800',
    'Operator': 'bg-blue-100 text-blue-800',
    'Viewer': 'bg-green-100 text-green-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
      {role}
    </span>
  )
}

const getStatusBadge = (status: string) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'Active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status === 'Active' ? (
        <CheckCircleIcon className="h-3 w-3" />
      ) : (
        <XCircleIcon className="h-3 w-3" />
      )}
      {status}
    </span>
  )
}

const formatDateTime = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr)
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateTimeStr
  }
}

export function DynamicUserManagement({ users, stats, loading, onRefresh }: DynamicUserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<SettingsUser | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [actionLoading, setActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Clear messages after 5 seconds
  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('')
      setErrorMessage('')
    }, 5000)
  }

  const handleViewUser = (user: SettingsUser) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleEditUser = (user: SettingsUser) => {
    setSelectedUser(user)
    setFormMode('edit')
    setIsFormModalOpen(true)
  }

  const handleDeleteUser = (user: SettingsUser) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setFormMode('create')
    setIsFormModalOpen(true)
  }

  const handleFormSubmit = async (userData: Partial<SettingsUser>) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/settings/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: formMode,
          userData
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage(result.message)
        onRefresh()
        clearMessages()
        return true
      } else {
        setErrorMessage(result.error || 'Failed to save user')
        clearMessages()
        return false
      }
    } catch (error) {
      setErrorMessage('Network error occurred')
      clearMessages()
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/settings/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          userData: { id: selectedUser.id }
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage(result.message)
        setIsDeleteModalOpen(false)
        onRefresh()
        clearMessages()
      } else {
        setErrorMessage(result.error || 'Failed to delete user')
        clearMessages()
      }
    } catch (error) {
      setErrorMessage('Network error occurred')
      clearMessages()
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <ArrowPathIcon className="h-6 w-6 text-gray-400 animate-spin" />
          <span className="text-gray-600">Loading user data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleCreateUser}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Active Users</p>
                <p className="text-2xl font-bold text-green-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-900">{stats.inactive}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Admins</p>
                <p className="text-2xl font-bold text-purple-900">{stats.byRole.Admin}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Operator">Operator</option>
            <option value="Viewer">Viewer</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Scroll hint */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <p className="text-xs text-gray-600 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Scroll horizontally for more columns
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m0 0H3" />
              </svg>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m0 0v18" />
              </svg>
              Scroll vertically for more rows
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m0 0V3" />
              </svg>
            </span>
          </p>
        </div>
        
        <div 
          className="table-scroll-container overflow-auto relative"
          style={{
            scrollbarWidth: 'auto',
            scrollbarColor: '#6366F1 #E5E7EB',
            maxWidth: '100%',
            maxHeight: '600px'
          }}
        >
          {/* Scroll indicators */}
          <div className="absolute top-2 right-2 z-20 flex gap-1 pointer-events-none opacity-75">
            <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium shadow-sm border border-indigo-200">
              ↔ H-Scroll
            </div>
            <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium shadow-sm border border-purple-200">
              ↕ V-Scroll
            </div>
          </div>
          
          <style jsx>{`
            .table-scroll-container {
              scrollbar-width: auto;
              scrollbar-color: #6366F1 #E5E7EB;
              scroll-behavior: smooth;
            }
            /* Enhanced Horizontal scrollbar styling */
            .table-scroll-container::-webkit-scrollbar:horizontal {
              height: 18px;
              background: #F9FAFB;
              border-radius: 10px;
            }
            /* Enhanced Vertical scrollbar styling */
            .table-scroll-container::-webkit-scrollbar:vertical {
              width: 18px;
              background: #F9FAFB;
              border-radius: 10px;
            }
            /* General scrollbar styling */
            .table-scroll-container::-webkit-scrollbar {
              background: #F9FAFB;
              border-radius: 8px;
            }
            .table-scroll-container::-webkit-scrollbar-track {
              background: linear-gradient(135deg, #F3F4F6, #E5E7EB);
              border-radius: 10px;
              margin: 6px;
              border: 2px solid #F9FAFB;
              box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .table-scroll-container::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899);
              border-radius: 10px;
              border: 3px solid #F9FAFB;
              box-shadow: 
                inset 0 1px 2px rgba(255, 255, 255, 0.3),
                0 2px 4px rgba(0, 0, 0, 0.1);
              transition: all 0.2s ease;
            }
            .table-scroll-container::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, #4F46E5, #7C3AED, #DB2777);
              box-shadow: 
                inset 0 1px 3px rgba(255, 255, 255, 0.4),
                0 3px 6px rgba(0, 0, 0, 0.15);
              transform: scale(1.05);
            }
            .table-scroll-container::-webkit-scrollbar-thumb:active {
              background: linear-gradient(135deg, #4338CA, #6D28D9, #BE185D);
              box-shadow: 
                inset 0 2px 4px rgba(0, 0, 0, 0.2),
                0 1px 2px rgba(0, 0, 0, 0.1);
            }
            .table-scroll-container::-webkit-scrollbar-corner {
              background: linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899);
              border-radius: 10px;
              border: 2px solid #F9FAFB;
            }
            /* Ensure the scrollbar is always visible and enhanced */
            .table-scroll-container::-webkit-scrollbar {
              -webkit-appearance: none;
            }
            /* Add subtle animation on scroll */
            .table-scroll-container {
              transition: box-shadow 0.2s ease;
            }
            .table-scroll-container:hover {
              box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.1);
            }
          `}</style>
          <div style={{ minHeight: '400px', maxHeight: '600px' }}>
            <table className="w-full divide-y divide-gray-200" style={{ minWidth: '1600px', tableLayout: 'fixed' }}>
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '350px', minWidth: '350px' }}>
                  User Information
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '140px', minWidth: '140px' }}>
                  Role
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '200px', minWidth: '200px' }}>
                  Department
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '140px', minWidth: '140px' }}>
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '180px', minWidth: '180px' }}>
                  Username
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '160px', minWidth: '160px' }}>
                  Phone Number
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '200px', minWidth: '200px' }}>
                  Last Login
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '180px', minWidth: '180px' }}>
                  Created Date
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px', minWidth: '150px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No users found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100" style={{ width: '350px', minWidth: '350px' }}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-700">
                              {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate" title={user.fullName}>{user.fullName}</div>
                          <div className="text-sm text-gray-500 truncate" title={user.email}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-100" style={{ width: '140px', minWidth: '140px' }}>
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100" style={{ width: '200px', minWidth: '200px' }}>
                      <div className="truncate" title={user.department}>{user.department}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-100" style={{ width: '140px', minWidth: '140px' }}>
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100" style={{ width: '180px', minWidth: '180px' }}>
                      <div className="truncate font-mono" title={user.username}>{user.username}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100" style={{ width: '160px', minWidth: '160px' }}>
                      <div className="truncate" title={user.phone}>{user.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-100" style={{ width: '200px', minWidth: '200px' }}>
                      <div className="truncate" title={formatDateTime(user.lastLogin)}>{formatDateTime(user.lastLogin)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-100" style={{ width: '180px', minWidth: '180px' }}>
                      <div className="truncate" title={formatDateTime(user.createdAt)}>{formatDateTime(user.createdAt)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" style={{ width: '150px', minWidth: '150px' }}>
                      <div className="flex items-center gap-1 justify-center">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-md hover:bg-indigo-50 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                          title="Edit User"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>
        
        {/* Scroll indicator at bottom */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Showing {filteredUsers.length} of {users.length} user{users.length !== 1 ? 's' : ''} • Use horizontal & vertical scroll to navigate
          </p>
        </div>
      </div>

      {/* User Details Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-sm text-gray-900">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <p className="text-sm text-gray-900">{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div>{getRoleBadge(selectedUser.role)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div>{getStatusBadge(selectedUser.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-sm text-gray-900">{selectedUser.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedUser.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map((permission, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEditUser(selectedUser)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        mode={formMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.fullName}? This action cannot be undone.`}
        confirmText="Delete User"
        type="danger"
        loading={actionLoading}
      />
    </div>
  )
}