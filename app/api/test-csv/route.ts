import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const csvPath = path.join(process.cwd(), 'database', 'users.csv')
    
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({
        success: false,
        message: 'CSV file not found'
      }, { status: 404 })
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    const lines = csvContent.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',')
    const dataRows = lines.slice(1)
    
    return NextResponse.json({
      success: true,
      message: 'CSV test successful',
      data: {
        file: 'users.csv',
        headers,
        rowCount: dataRows.length,
        sampleData: dataRows.slice(0, 3).map(row => {
          const values = row.split(',')
          const obj: Record<string, string> = {}
          headers.forEach((header, index) => {
            obj[header] = values[index] || ''
          })
          return obj
        })
      }
    })
  } catch (error) {
    console.error('CSV test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'CSV test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}