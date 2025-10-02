/**
 * Users Management API Route
 * Handles CRUD operations for user management
 */

import { NextResponse } from 'next/server'
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

// Helper function to generate new user ID
function generateUserId(existingUsers: any[]): string {
  const maxId = existingUsers.reduce((max, user) => {
    const idNum = parseInt(user.user_id.replace('USR', ''))
    return idNum > max ? idNum : max
  }, 0)
  
  return `USR${String(maxId + 1).padStart(3, '0')}`
}

export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      data: transformedUsers
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, userData } = body

    const users = getUsers()

    if (action === 'create') {
      // Create new user
      const newUserId = generateUserId(users)
      const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      
      const newUser = {
        user_id: newUserId,
        username: userData.username,
        email: userData.email,
        full_name: userData.fullName,
        role: userData.role,
        status: userData.status || 'Active',
        created_at: currentDateTime,
        last_login: currentDateTime,
        phone: userData.phone,
        department: userData.department,
        permissions: userData.permissions.join(',')
      }

      // Check if username or email already exists
      const existingUser = users.find(u => 
        u.username === newUser.username || u.email === newUser.email
      )
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username or email already exists' },
          { status: 400 }
        )
      }

      users.push(newUser)
      
      if (writeUsersToCSV(users)) {
        return NextResponse.json({
          success: true,
          message: 'User created successfully',
          data: { id: newUserId }
        })
      } else {
        return NextResponse.json(
          { error: 'Failed to save user data' },
          { status: 500 }
        )
      }
    }

    if (action === 'update') {
      // Update existing user
      const userIndex = users.findIndex(u => u.user_id === userData.id)
      
      if (userIndex === -1) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Check if username or email already exists (excluding current user)
      const existingUser = users.find(u => 
        u.user_id !== userData.id && 
        (u.username === userData.username || u.email === userData.email)
      )
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username or email already exists' },
          { status: 400 }
        )
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        username: userData.username,
        email: userData.email,
        full_name: userData.fullName,
        role: userData.role,
        status: userData.status,
        phone: userData.phone,
        department: userData.department,
        permissions: userData.permissions.join(',')
      }
      
      if (writeUsersToCSV(users)) {
        return NextResponse.json({
          success: true,
          message: 'User updated successfully'
        })
      } else {
        return NextResponse.json(
          { error: 'Failed to save user data' },
          { status: 500 }
        )
      }
    }

    if (action === 'delete') {
      // Delete user
      const userIndex = users.findIndex(u => u.user_id === userData.id)
      
      if (userIndex === -1) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Don't allow deleting the last admin
      const adminUsers = users.filter(u => u.role === 'Admin')
      if (users[userIndex].role === 'Admin' && adminUsers.length === 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin user' },
          { status: 400 }
        )
      }

      users.splice(userIndex, 1)
      
      if (writeUsersToCSV(users)) {
        return NextResponse.json({
          success: true,
          message: 'User deleted successfully'
        })
      } else {
        return NextResponse.json(
          { error: 'Failed to save user data' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error managing users:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}