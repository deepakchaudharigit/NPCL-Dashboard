import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Simple test credentials
    const testCredentials = {
      'admin@npcl.com': 'admin123',
      'operator@npcl.com': 'operator123',
      'viewer@npcl.com': 'viewer123'
    }
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      }, { status: 400 })
    }
    
    // Check test credentials
    if (testCredentials[email as keyof typeof testCredentials] === password) {
      const role = email.includes('admin') ? 'ADMIN' : 
                   email.includes('operator') ? 'OPERATOR' : 'VIEWER'
      
      return NextResponse.json({
        success: true,
        message: 'Simple login test successful',
        user: {
          email,
          role,
          name: email.split('@')[0].replace('.', ' ').toUpperCase()
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid credentials'
    }, { status: 401 })
  } catch (error) {
    console.error('Simple login test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Simple login test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}