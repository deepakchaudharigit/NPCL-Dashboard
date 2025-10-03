/**
 * Profile Management API Route
 * Handles user profile updates
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getUsers } from '@/lib/data/csv-reader'
import fs from 'fs'
import path from 'path'

// Helper function to write users back to CSV
function writeUsersToCSV(users: any[]) {
  try {
    const csvPath = path.join(process.cwd(), 'database', 'users.csv')
    
    // Create CSV header
    const headers = [
      'user_id', 'username', 'email', 'full_name', 'role', 'status',
      'created_at', 'last_login', 'phone', 'department', 'permissions'
    ]
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.user_id,
        user.username,
        user.email,
        user.full_name,
        user.role,
        user.status,
        user.created_at,
        user.last_login,
        user.phone,
        user.department,
        `"${user.permissions}"` // Wrap permissions in quotes to handle commas
      ].join(','))
    ].join('\n')
    
    fs.writeFileSync(csvPath, csvContent, 'utf-8')
    return true
  } catch (error) {
    console.error('Error writing users CSV:', error)
    return false
  }
}

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user data from CSV
    const users = getUsers()
    const user = users.find(u => u.email === session.user.email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Transform user data for frontend
    const profileData = {
      id: user.user_id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      department: user.department,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      permissions: user.permissions.split(',').map(p => p.trim())
    }

    return NextResponse.json({
      success: true,
      data: profileData
    })

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { fullName, phone, department } = body

    // Validation
    if (!fullName?.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    if (phone?.trim()) {
      // Validate phone format if provided (allow various formats)
      const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/
      if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
        return NextResponse.json(
          { error: 'Please enter a valid Indian phone number' },
          { status: 400 }
        )
      }
    }

    if (!department?.trim()) {
      return NextResponse.json(
        { error: 'Department is required' },
        { status: 400 }
      )
    }

    // Get users and find current user
    const users = getUsers()
    const userIndex = users.findIndex(u => u.email === session.user.email)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user data
    const updatedUser = {
      ...users[userIndex],
      full_name: fullName.trim(),
      phone: phone?.trim() || '',
      department: department.trim(),
      last_login: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    users[userIndex] = updatedUser
    
    // Save to CSV
    if (writeUsersToCSV(users)) {
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to save profile data' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, currentPassword, newPassword } = body

    if (action === 'change-password') {
      // For now, we'll just return success since we don't have password hashing in CSV
      // In a real implementation, you would verify the current password and hash the new one
      
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Current password and new password are required' },
          { status: 400 }
        )
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long' },
          { status: 400 }
        )
      }

      // Update last login time
      const users = getUsers()
      const userIndex = users.findIndex(u => u.email === session.user.email)
      
      if (userIndex !== -1) {
        users[userIndex].last_login = new Date().toISOString().replace('T', ' ').substring(0, 19)
        writeUsersToCSV(users)
      }

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error processing profile action:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}