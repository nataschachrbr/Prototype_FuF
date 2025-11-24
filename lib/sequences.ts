export interface Sequence {
  id: string
  name: string
  status: 'active' | 'draft' | 'paused'
  enrolledCount: number
}

// This would typically come from an API, but for now it's a shared data source
export const defaultSequences: Sequence[] = [
  { id: '1', name: 'Major Projects Outreach', status: 'active', enrolledCount: 2 },
  { id: '2', name: 'Standard Outreach', status: 'active', enrolledCount: 1 },
  { id: '3', name: 'Procurement Outreach', status: 'active', enrolledCount: 1 },
  { id: '4', name: 'Healthcare Sector Focus', status: 'active', enrolledCount: 1 },
  { id: '5', name: 'Energy & Water Focus', status: 'active', enrolledCount: 1 },
  { id: '6', name: 'Facilities Management Focus', status: 'active', enrolledCount: 1 },
  { id: '7', name: 'Housing Development Outreach', status: 'active', enrolledCount: 1 },
  { id: '8', name: 'Partnership Outreach', status: 'active', enrolledCount: 1 },
  { id: '9', name: 'Technical Specification Focus', status: 'active', enrolledCount: 1 },
  { id: '10', name: 'Urban Development Outreach', status: 'active', enrolledCount: 1 },
  { id: '11', name: 'Supply Chain Outreach', status: 'active', enrolledCount: 1 },
  { id: '12', name: 'Distribution Network Focus', status: 'active', enrolledCount: 1 },
  { id: '13', name: 'Fit-Out Specialists', status: 'active', enrolledCount: 1 },
]

// Helper function to get all sequences
export function getAllSequences(): Sequence[] {
  // In a real app, this would fetch from an API
  // For now, return the default sequences
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sequences')
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return defaultSequences
}

// Helper function to save sequences
export function saveSequences(sequences: Sequence[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sequences', JSON.stringify(sequences))
  }
}

