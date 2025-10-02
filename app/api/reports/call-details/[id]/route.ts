/**
 * Call Details API Route
 * Provides detailed information for a specific call record
 */

import { NextResponse } from 'next/server'
import { getCallRecords } from '@/lib/data/csv-reader'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: callId } = await params

    // Get all call records
    const callRecords = getCallRecords()
    
    // Find the specific call record
    const callRecord = callRecords.find(record => record.call_id === callId)
    
    if (!callRecord) {
      return NextResponse.json(
        { error: 'Call record not found' },
        { status: 404 }
      )
    }

    // Transform and enhance the call record with additional details
    const enhancedCallDetails = {
      id: callRecord.call_id,
      cli: callRecord.cli,
      receivedDateTime: callRecord.received_datetime,
      language: callRecord.language,
      queryType: callRecord.query_type,
      status: callRecord.status,
      ticketsIdentified: callRecord.tickets_identified,
      transferredToIVR: callRecord.transferred_to_ivr,
      voiceFile: callRecord.voice_duration,
      durationSeconds: callRecord.duration_seconds,
      
      // Enhanced details (in a real system, these would come from additional data sources)
      customerName: generateCustomerName(callRecord.cli),
      customerAddress: generateCustomerAddress(callRecord.cli),
      complaintCategory: categorizeQuery(callRecord.query_type),
      priority: determinePriority(callRecord.query_type, callRecord.status),
      assignedAgent: generateAgentId(callRecord.call_id),
      resolution: generateResolution(callRecord.query_type, callRecord.status),
      
      // Generate call transcript based on query type and language
      callTranscript: generateCallTranscript(callRecord),
      
      // Generate call notes based on the call progression
      callNotes: generateCallNotes(callRecord),
      
      // Generate related tickets
      relatedTickets: generateRelatedTickets(callRecord)
    }

    return NextResponse.json({
      success: true,
      data: enhancedCallDetails
    })

  } catch (error) {
    console.error('Error fetching call details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch call details' },
      { status: 500 }
    )
  }
}

// Helper functions to generate realistic data
function generateCustomerName(cli: string): string {
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sunita Devi', 'Ravi Patel',
    'Meera Gupta', 'Suresh Yadav', 'Kavita Joshi', 'Manoj Verma', 'Pooja Agarwal'
  ]
  const hash = cli.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  return names[hash % names.length]
}

function generateCustomerAddress(cli: string): string {
  const areas = [
    'Sector 15, Noida, UP', 'Connaught Place, Delhi', 'Bandra West, Mumbai, MH',
    'Koramangala, Bangalore, KA', 'Anna Nagar, Chennai, TN', 'Salt Lake, Kolkata, WB',
    'Civil Lines, Jaipur, RJ', 'Model Town, Ludhiana, PB', 'Gomti Nagar, Lucknow, UP',
    'Satellite, Ahmedabad, GJ'
  ]
  const hash = cli.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const houseNo = (hash % 999) + 1
  const area = areas[hash % areas.length]
  return `House No. ${houseNo}, ${area} - ${201301 + (hash % 100)}`
}

function categorizeQuery(queryType: string): string {
  if (queryType.toLowerCase().includes('power') || queryType.toLowerCase().includes('outage')) {
    return 'Power Supply'
  } else if (queryType.toLowerCase().includes('bill') || queryType.toLowerCase().includes('payment')) {
    return 'Billing'
  } else if (queryType.toLowerCase().includes('connection') || queryType.toLowerCase().includes('new')) {
    return 'New Connection'
  } else if (queryType.toLowerCase().includes('transformer') || queryType.toLowerCase().includes('equipment')) {
    return 'Equipment'
  } else {
    return 'General Inquiry'
  }
}

function determinePriority(queryType: string, status: string): string {
  if (queryType.toLowerCase().includes('outage') || queryType.toLowerCase().includes('emergency')) {
    return 'High'
  } else if (status === 'Missing' || status === 'Aborted') {
    return 'High'
  } else if (queryType.toLowerCase().includes('bill') || queryType.toLowerCase().includes('connection')) {
    return 'Medium'
  } else {
    return 'Low'
  }
}

function generateAgentId(callId: string): string {
  const hash = callId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  return `Agent_${String(hash % 999 + 1).padStart(3, '0')}`
}

function generateResolution(queryType: string, status: string): string {
  if (status === 'Docket generated') {
    if (queryType.toLowerCase().includes('outage')) {
      return 'Docket created for power restoration team. Expected resolution within 4 hours.'
    } else if (queryType.toLowerCase().includes('bill')) {
      return 'Billing inquiry docket created. Customer will receive updated bill within 2 business days.'
    } else {
      return 'Service request docket created. Technical team will contact customer within 24 hours.'
    }
  } else if (status === 'Resolved') {
    return 'Issue has been successfully resolved. Customer confirmed satisfaction with the solution.'
  } else if (status === 'Under Review') {
    return 'Case is currently under review by technical team. Customer will be updated within 2 hours.'
  } else {
    return 'Case is being processed according to standard procedures.'
  }
}

function generateCallTranscript(callRecord: any): string {
  const customerName = generateCustomerName(callRecord.cli)
  const customerAddress = generateCustomerAddress(callRecord.cli)
  const agentId = generateAgentId(callRecord.call_id)
  const queryType = callRecord.query_type.toLowerCase()
  const language = callRecord.language
  const status = callRecord.status
  
  // Language-specific greetings
  const greetings = {
    'Hindi': { customer: 'Namaste', agent: 'Namaste' },
    'English': { customer: 'Hello', agent: 'Good morning' },
    'Bengali': { customer: 'Namaskar', agent: 'Namaskar' },
    'Telugu': { customer: 'Namaskaram', agent: 'Namaskaram' },
    'Tamil': { customer: 'Vanakkam', agent: 'Vanakkam' },
    'Marathi': { customer: 'Namaskar', agent: 'Namaskar' },
    'Gujarati': { customer: 'Namaste', agent: 'Namaste' },
    'Kannada': { customer: 'Namaskara', agent: 'Namaskara' },
    'Urdu': { customer: 'Assalam-o-Alaikum', agent: 'Wa-Alaikum-Assalam' }
  }
  
  const greeting = greetings[language as keyof typeof greetings] || greetings['English']
  
  if (queryType.includes('power') || queryType.includes('outage') || queryType.includes('load shedding')) {
    return `Customer: ${greeting.customer}, I am calling to report a power outage in my area.
Agent: ${greeting.agent}! I understand you're experiencing a power outage. Can you please provide your address?
Customer: Yes, I live at ${customerAddress}.
Agent: Thank you, ${customerName}. Let me check the status of power supply in your area.
Agent: I can confirm there is a maintenance activity in your sector. The power should be restored within 4 hours.
Customer: Okay, thank you for the information.
${status === 'Docket generated' ? `Agent: I'm creating a docket for your complaint. You will receive an SMS with the docket number shortly.` : `Agent: I've noted your complaint and our technical team will look into it.`}
Customer: Thank you for your help.
Agent: You're welcome! Is there anything else I can help you with today?
Customer: No, that's all. Thank you.
Agent: Have a great day!`
  } else if (queryType.includes('bill') || queryType.includes('payment')) {
    return `Customer: ${greeting.customer}, I have a question about my electricity bill.
Agent: ${greeting.agent}! I'd be happy to help you with your billing inquiry. What specific question do you have?
Customer: My bill seems higher than usual this month. Can you help me understand why?
Agent: Of course, ${customerName}. Let me check your consumption details for the past few months.
Agent: I can see there was increased usage in the last billing cycle. This could be due to seasonal changes or new appliances.
Customer: That makes sense. We did install a new air conditioner.
Agent: That would explain the increase. I'll send you a detailed usage breakdown via SMS.
Customer: That would be helpful, thank you.
${status === 'Resolved' ? `Agent: Your billing query has been resolved. Is there anything else I can assist you with?` : `Agent: I've created a ticket for further review of your billing details.`}
Customer: No, that covers everything. Thank you.
Agent: You're welcome! Have a great day!`
  } else if (queryType.includes('connection') || queryType.includes('new')) {
    return `Customer: ${greeting.customer}, I need help with a new electricity connection.
Agent: ${greeting.agent}! I'd be happy to help you with your connection request. Can you provide your address?
Customer: Yes, I need a connection at ${customerAddress}.
Agent: Thank you, ${customerName}. Let me check the requirements for a new connection in your area.
Agent: I can see that new connections are available in your sector. I'll guide you through the process.
Customer: That's great. What documents do I need?
Agent: You'll need identity proof, address proof, and property documents. I'll send you the complete list via SMS.
${status === 'Docket generated' ? `Agent: I've created a service request for your new connection. Our field team will contact you within 2 business days.` : `Agent: I've noted your request and will follow up with the connection process.`}
Customer: Thank you for the information.
Agent: You're welcome! Is there anything else I can help you with?
Customer: No, that's all for now.
Agent: Thank you for calling. Have a great day!`
  } else if (queryType.includes('transformer') || queryType.includes('technical')) {
    return `Customer: ${greeting.customer}, I want to report a transformer issue in my area.
Agent: ${greeting.agent}! I understand you're reporting a transformer issue. Can you describe the problem?
Customer: The transformer near ${customerAddress} is making unusual sounds and there are power fluctuations.
Agent: Thank you for reporting this, ${customerName}. This is a serious issue that needs immediate attention.
Agent: I'm escalating this to our technical team right away. They will inspect the transformer within 2 hours.
Customer: That's good to hear. Is it safe for now?
Agent: Please avoid going near the transformer and report any sparks or smoke immediately.
${status === 'Docket generated' ? `Agent: I've created a high-priority docket for this issue. You'll receive updates via SMS.` : `Agent: I've logged this as an urgent technical issue for immediate review.`}
Customer: Thank you for the quick response.
Agent: You're welcome! Safety is our priority. Is there anything else I can help you with?
Customer: No, that's all. Thank you.
Agent: Have a great day and stay safe!`
  } else {
    return `Customer: ${greeting.customer}, I need help with ${callRecord.query_type.toLowerCase()}.
Agent: ${greeting.agent}! I'm here to help you. Can you please provide more details about your query?
Customer: [Customer explains their specific concern about ${callRecord.query_type.toLowerCase()}]
Agent: I understand your concern, ${customerName}. Let me check the details and provide you with the best solution.
Agent: [Agent provides relevant information and assistance based on the query type]
Customer: Thank you for the help.
${status === 'Resolved' ? `Agent: I'm glad I could resolve your query. Is there anything else I can help you with?` : `Agent: I've noted your request and will ensure it's processed appropriately.`}
Customer: No, that's all for now.
Agent: Thank you for calling. Have a great day!`
  }
}

function generateCallNotes(callRecord: any): any[] {
  const baseTime = new Date(callRecord.received_datetime)
  const notes = []
  
  // Initial note
  notes.push({
    timestamp: new Date(baseTime.getTime() + 30000).toISOString(), // +30 seconds
    note: `Customer reported: ${callRecord.query_type}`,
    addedBy: 'System'
  })
  
  // Agent verification
  notes.push({
    timestamp: new Date(baseTime.getTime() + 90000).toISOString(), // +1.5 minutes
    note: 'Customer details verified and query categorized',
    addedBy: generateAgentId(callRecord.call_id)
  })
  
  // Status-specific notes
  if (callRecord.status === 'Docket generated') {
    notes.push({
      timestamp: new Date(baseTime.getTime() + 180000).toISOString(), // +3 minutes
      note: `Docket created - Expected resolution: ${determinePriority(callRecord.query_type, callRecord.status) === 'High' ? '4 hours' : '24 hours'}`,
      addedBy: generateAgentId(callRecord.call_id)
    })
  }
  
  // Transfer note if applicable
  if (callRecord.transferred_to_ivr) {
    notes.push({
      timestamp: callRecord.transferred_to_ivr,
      note: 'Call transferred to IVR for docket number confirmation',
      addedBy: 'System'
    })
  }
  
  return notes
}

function generateRelatedTickets(callRecord: any): any[] {
  const tickets = []
  const baseTime = new Date(callRecord.received_datetime)
  
  if (callRecord.tickets_identified > 0) {
    for (let i = 0; i < callRecord.tickets_identified; i++) {
      // Generate deterministic ticket ID based on call ID and index
      const hash = callRecord.call_id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)
      const ticketNumber = (hash + i * 1000) % 999999
      const ticketId = `TKT-2025-${String(ticketNumber).padStart(6, '0')}`
      
      tickets.push({
        ticketId,
        type: categorizeQuery(callRecord.query_type),
        status: i === 0 ? callRecord.status : 'Resolved',
        createdAt: new Date(baseTime.getTime() + (i * 60000)).toISOString() // +1 minute each
      })
    }
  }
  
  return tickets
}