export type ProjectStatus = 'new' | 'pipeline' | 'assessment' | 'closed_won'

export interface Project {
  id: string
  name: string
  value: string
  // Balfour Beatty's role in the project (e.g. "Main contractor")
  role: string
  // Construction project phase (e.g. "Execution", "Design", "Early planning")
  phase: string
  status: ProjectStatus
  companyName: string
  // Optional: primary contact this project is most closely related to
  primaryContactId?: string
  // Label for the deal stage shown in list UIs (e.g. "Schedule meeting", "Assessment")
  stageLabel: string
  lastActivity: string
}

// Centralised mocked projects so company and people views stay in sync.
// This started with the 5 deals used in the pipeline UI and has been
// extended with a few extra records (e.g. Arup) to support relationship views.
const allProjects: Project[] = [
  // Qualification stage (Kontaktrecherche)
  {
    id: '1',
    name: 'Liverpool Regeneration Project',
    value: '£6.7M',
    role: 'Regeneration partner',
    phase: 'Early planning',
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
    role: 'Housing contractor',
    phase: 'Design',
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
    value: '£2.5B',
    role: 'Main contractor',
    phase: 'Execution',
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
    role: 'Highway contractor',
    phase: 'Execution',
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
    role: 'Construction partner',
    phase: 'Early planning',
    status: 'pipeline',
    companyName: 'Galliford Try',
    primaryContactId: '4', // Emily Davies
    stageLabel: 'Outreach',
    lastActivity: '31 Jan 2025, 13:12',
  },

  // Additional mocked projects for partner network examples
  {
    id: '6',
    name: 'Crossrail – rail and station works',
    value: '£1.2B',
    role: 'Engineering and design consultant',
    phase: 'Execution',
    status: 'assessment',
    companyName: 'Arup',
    stageLabel: 'Qualification',
    lastActivity: 'Design review held last week',
  },
  {
    id: '7',
    name: 'Major UK station redevelopments',
    value: '£450M',
    role: 'Lead engineering partner',
    phase: 'Design',
    status: 'pipeline',
    companyName: 'Arup',
    stageLabel: 'Outreach',
    lastActivity: 'Shortlist for new station package created',
  },
]

export function getProjectsForCompany(companyName: string): Project[] {
  return allProjects.filter((p) => p.companyName === companyName)
}

export function getProjectsForContact(contactId: string): Project[] {
  return allProjects.filter((p) => p.primaryContactId === contactId)
}


