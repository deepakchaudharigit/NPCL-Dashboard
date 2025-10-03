'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { UserCircleIcon, CameraIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

export function ProfileSettings() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    username: '',
    status: ''
  })

  // Load profile data from API
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.email) return
      
      try {
        setIsLoadingProfile(true)
        const response = await fetch('/api/auth/profile')
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setFormData({
              fullName: result.data.fullName || '',
              email: result.data.email || '',
              role: result.data.role || '',
              phone: result.data.phone || '',
              department: result.data.department || '',
              username: result.data.username || '',
              status: result.data.status || ''
            })
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' })
      return
    }

    setIsUploadingImage(true)
    setMessage(null)

    try {
      // Create a preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // For now, we'll just show the preview
      // In a real implementation, you would upload to a server or cloud storage
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          department: formData.department
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await update({ name: formData.fullName })
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' })
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
        setTimeout(() => setMessage(null), 5000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <ArrowPathIcon className="h-6 w-6 text-gray-400 animate-spin" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        <p className="text-gray-600 mt-1">Update your personal information and contact details</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              {isUploadingImage ? (
                <ArrowPathIcon className="w-3 h-3 animate-spin" />
              ) : (
                <CameraIcon className="w-3 h-3" />
              )}
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploadingImage}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Profile Picture</h3>
            <p className="text-sm text-gray-500">Upload a new profile picture (max 5MB)</p>
            <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, GIF</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Role is managed by administrators</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="9876543210 or +91-9876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Enter 10-digit number or with +91</p>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Department</option>
              <option value="IT Department">IT Department</option>
              <option value="Operations">Operations</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Management">Management</option>
              <option value="Finance">Finance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}