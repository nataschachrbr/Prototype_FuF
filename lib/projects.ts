export type ProjectStatus = 'new' | 'pipeline' | 'assessment' | 'closed_won'

export interface Project {
  id: string
  name: string
  value: string
  status: ProjectStatus
  companyName: string
  // Optional: primary contact this project is most closely related to
  primaryContactId?: string
  // Label for the deal stage shown in list UIs (e.g. "Schedule meeting", "Assessment")
  stageLabel: string
  lastActivity: string
}

// Centralised mocked projects so company and people views stay in sync.
// This is intentionally limited to the 5 deals that exist in the pipeline UI,
// so only those companies show related deals.
const allProjects: Project[] = [
  // Qualification stage (Kontaktrecherche)
  {
    id: '1',
    name: 'Liverpool Regeneration Project',
    value: '£6.7M',
    status: 'assessment', // treated visually like pipeline
    companyName: 'Morgan Sindall Group',
    primaryContactId: '3', // Thomas Harrison
    stageLabel: 'Qualification',
    lastActivity: '31 Jan 2025, 13:12',
  },
  {
    id: '2',
    name: 'North East Housing Development',
    value: '£4.4M',
    status: 'assessment',
    companyName: 'Bellway plc',
    primaryContactId: '12', // Lucy Anderson
    stageLabel: 'Qualification',
    lastActivity: 'Site visit completed yesterday',
  },

  // Outreach stage (Terminvereinbarung)
  {
    id: '3',
    name: 'HS2 Rail Infrastructure Package',
    value: '£4.2M',
    status: 'pipeline',
    companyName: 'Balfour Beatty',
    primaryContactId: '1', // James Robertson
    stageLabel: 'Outreach',
    lastActivity: '31 Jan 2025, 13:12',
  },
  {
    id: '4',
    name: 'M25 Highways Upgrade',
    value: '£8.1M',
    status: 'pipeline',
    companyName: 'Kier Group',
    primaryContactId: '2', // Sarah Mitchell
    stageLabel: 'Outreach',
    lastActivity: '31 Jan 2025, 13:12',
  },
  {
    id: '5',
    name: 'Healthcare Facilities Programme',
    value: '£2.9M',
    status: 'pipeline',
    companyName: 'Galliford Try',
    primaryContactId: '4', // Emily Davies
    stageLabel: 'Outreach',
    lastActivity: '31 Jan 2025, 13:12',
  },
]

export function getProjectsForCompany(companyName: string): Project[] {
  return allProjects.filter((p) => p.companyName === companyName)
}

export function getProjectsForContact(contactId: string): Project[] {
  return allProjects.filter((p) => p.primaryContactId === contactId)
}


