export interface CallRecord {
  id: string
  cli: string
  receivedDateTime: string
  language: string
  queryType: string
  status: 'Docket generated' | 'Docket under review' | 'Missing' | 'Aborted'
  ticketsIdentified: number
  transferredToIVR: string
  voiceFile: string
}

export interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: string
  language?: string
  recognized?: boolean
}

export interface CallDetails {
  id: string
  name: string
  address: string
  dateTime: string
  language: string
  duration: string
  area: string
  tickets: Ticket[]
  previousCalls: PreviousCall[]
  conversation: Message[]
}

export interface Ticket {
  ticketNumber: string
  queryType: string
  status: 'Ticket generated' | 'Resolved' | 'Missing' | 'Reopened'
}

export interface PreviousCall {
  date: string
  description: string
  status: string
  duration: string
}

export interface FilterState {
  callResolutionStatus: string[]
  language: string[]
  cli: string
  durationMax: number
}