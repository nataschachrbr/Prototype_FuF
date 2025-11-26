export type ProjectStatus = 'new' | 'pipeline' | 'closed_won'

export interface Project {
  id: string
  name: string
  value: string
  status: ProjectStatus
  companyName: string
  // Optional: primary contact this project is most closely related to
  primaryContactId?: string
  lastActivity: string
}

// Centralised mocked projects so company and people views stay in sync
const allProjects: Project[] = [
  // Balfour Beatty
  {
    id: 'bb-health-upgrade',
    name: 'Balfour Beatty Healthcare Facilities Upgrade',
    value: '£2.8M',
    status: 'new',
    companyName: 'Balfour Beatty',
    primaryContactId: '1', // James Robertson
    lastActivity: 'Intro call completed 3 days ago',
  },
  {
    id: 'bb-city-redev',
    name: 'Balfour Beatty City Centre Redevelopment',
    value: '£5.2M',
    status: 'pipeline',
    companyName: 'Balfour Beatty',
    primaryContactId: '17', // Alexander Scott
    lastActivity: 'Technical scope shared last week',
  },
  {
    id: 'bb-resi-phase1',
    name: 'Balfour Beatty Residential Scheme Phase 1',
    value: '£12.4M',
    status: 'closed_won',
    companyName: 'Balfour Beatty',
    lastActivity: 'Contract signed 2 months ago',
  },

  // Example projects for other companies (not yet tied to specific contacts)
  {
    id: 'kier-m25-upgrade',
    name: 'Kier Group M25 Highways Upgrade',
    value: '£8.1M',
    status: 'pipeline',
    companyName: 'Kier Group',
    lastActivity: 'Commercial terms under review',
  },
  {
    id: 'morgan-liverpool-regen',
    name: 'Morgan Sindall Liverpool Regeneration',
    value: '£6.7M',
    status: 'new',
    companyName: 'Morgan Sindall Group',
    lastActivity: 'Initial proposal sent',
  },
]

export function getProjectsForCompany(companyName: string): Project[] {
  return allProjects.filter((p) => p.companyName === companyName)
}

export function getProjectsForContact(contactId: string): Project[] {
  return allProjects.filter((p) => p.primaryContactId === contactId)
}


