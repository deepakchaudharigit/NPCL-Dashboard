/**
 * Settings Data API Route
 * Provides dynamic data for settings page from CSV files
 */

import { NextResponse } from 'next/server'
import { getUsers, getSystemSettings, getSettingsByCategory } from '@/lib/data/csv-reader'

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section') || 'all'

    let responseData: any = {}

    if (section === 'all' || section === 'users') {
      // Get users data
      const users = getUsers()
      
      // Transform users data for frontend
      const transformedUsers = users.map(user => ({
        id: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        phone: user.phone,
        department: user.department,
        permissions: user.permissions.split(',').map(p => p.trim())
      }))

      // Calculate user statistics
      const userStats = {
        total: users.length,
        active: users.filter(u => u.status === 'Active').length,
        inactive: users.filter(u => u.status === 'Inactive').length,
        byRole: {
          Admin: users.filter(u => u.role === 'Admin').length,
          Operator: users.filter(u => u.role === 'Operator').length,
          Viewer: users.filter(u => u.role === 'Viewer').length
        },
        byDepartment: users.reduce((acc: any, user) => {
          acc[user.department] = (acc[user.department] || 0) + 1
          return acc
        }, {})
      }

      responseData.users = {
        data: transformedUsers,
        stats: userStats
      }
    }

    if (section === 'all' || section === 'system') {
      // Get system settings grouped by category
      const settingsByCategory = getSettingsByCategory()
      
      // Transform settings for frontend
      const transformedSettings: any = {}
      
      Object.keys(settingsByCategory).forEach(category => {
        transformedSettings[category] = settingsByCategory[category].map(setting => ({
          key: setting.setting_key,
          value: setting.setting_value,
          description: setting.description,
          dataType: setting.data_type,
          updatedAt: setting.updated_at,
          updatedBy: setting.updated_by
        }))
      })

      responseData.settings = {
        categories: transformedSettings,
        categoryList: Object.keys(settingsByCategory)
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('Error fetching settings data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'update_setting') {
      // In a real implementation, this would update the CSV file
      // For now, we'll just return success
      console.log('Update setting:', data)
      
      return NextResponse.json({
        success: true,
        message: 'Setting updated successfully'
      })
    }

    if (type === 'update_user') {
      // In a real implementation, this would update the users CSV file
      console.log('Update user:', data)
      
      return NextResponse.json({
        success: true,
        message: 'User updated successfully'
      })
    }

    if (type === 'create_user') {
      // In a real implementation, this would add to the users CSV file
      console.log('Create user:', data)
      
      return NextResponse.json({
        success: true,
        message: 'User created successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}