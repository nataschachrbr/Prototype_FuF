import { Person } from './people'
import { Company } from '@/components/CompanyList'

export interface AIResearchSession {
  id: string
  name: string
  createdAt: string
  query: string
  companyIds: string[]
  contactIds: string[]
}

const SESSIONS_KEY = 'aiResearchSessions'
const AI_CONTACTS_KEY = 'aiResearchContacts'
const SEQUENCE_ENROLLMENTS_KEY = 'aiSequenceEnrollments'

export function loadSessions(): AIResearchSession[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as AIResearchSession[]
  } catch {
    return []
  }
}

export function saveSessions(sessions: AIResearchSession[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function deleteSession(id: string) {
  const sessions = loadSessions()
  const filtered = sessions.filter((s) => s.id !== id)
  saveSessions(filtered)
}

export function upsertSession(partial: Omit<AIResearchSession, 'id' | 'createdAt'> & { id?: string }): AIResearchSession {
  const existing = loadSessions()
  const now = new Date().toISOString()

  if (partial.id) {
    const idx = existing.findIndex((s) => s.id === partial.id)
    if (idx >= 0) {
      const updated: AIResearchSession = {
        ...existing[idx],
        ...partial,
      }
      const next = [...existing]
      next[idx] = updated
      saveSessions(next)
      return updated
    }
  }

  const id = partial.id ?? `ai-session-${Date.now()}`
  const created: AIResearchSession = {
    id,
    createdAt: now,
    name: partial.name,
    query: partial.query,
    companyIds: partial.companyIds ?? [],
    contactIds: partial.contactIds ?? [],
  }
  saveSessions([created, ...existing])
  return created
}

export function renameSession(id: string, name: string) {
  const sessions = loadSessions()
  const idx = sessions.findIndex((s) => s.id === id)
  if (idx === -1) return
  sessions[idx] = { ...sessions[idx], name }
  saveSessions(sessions)
}

export function attachCompaniesToSession(sessionId: string, companies: Company[]): AIResearchSession | null {
  const sessions = loadSessions()
  const idx = sessions.findIndex((s) => s.id === sessionId)
  if (idx === -1) return null
  const existingIds = new Set(sessions[idx].companyIds)
  for (const c of companies) {
    existingIds.add(c.id)
  }
  const updated: AIResearchSession = {
    ...sessions[idx],
    companyIds: Array.from(existingIds),
  }
  const next = [...sessions]
  next[idx] = updated
  saveSessions(next)
  return updated
}

export function attachContactsToSession(sessionId: string, contactIds: string[]): AIResearchSession | null {
  const sessions = loadSessions()
  const idx = sessions.findIndex((s) => s.id === sessionId)
  if (idx === -1) return null
  const existingIds = new Set(sessions[idx].contactIds)
  for (const id of contactIds) {
    existingIds.add(id)
  }
  const updated: AIResearchSession = {
    ...sessions[idx],
    contactIds: Array.from(existingIds),
  }
  const next = [...sessions]
  next[idx] = updated
  saveSessions(next)
  return updated
}

export function loadAIContacts(): Person[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(AI_CONTACTS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Person[]
  } catch {
    return []
  }
}

export function saveAIContacts(contacts: Person[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AI_CONTACTS_KEY, JSON.stringify(contacts))
}

export function addAIContacts(newContacts: Person[]): string[] {
  const existing = loadAIContacts()
  const existingIds = new Set(existing.map((c) => c.id))
  const toAdd: Person[] = []
  const addedIds: string[] = []

  for (const c of newContacts) {
    if (!existingIds.has(c.id)) {
      toAdd.push(c)
      addedIds.push(c.id)
    }
  }

  if (toAdd.length > 0) {
    saveAIContacts([...existing, ...toAdd])
  }

  return addedIds
}

export interface SequenceEnrollmentOverride {
  sequenceId: string
  sequenceName: string
  currentStep: string
  stepNumber: number
  totalSteps: number
  status: 'active' | 'completed' | 'paused'
}

export interface SequenceEnrollmentsStore {
  [personId: string]: SequenceEnrollmentOverride
}

export function loadSequenceEnrollments(): SequenceEnrollmentsStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(SEQUENCE_ENROLLMENTS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as SequenceEnrollmentsStore
  } catch {
    return {}
  }
}

export function saveSequenceEnrollments(store: SequenceEnrollmentsStore) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SEQUENCE_ENROLLMENTS_KEY, JSON.stringify(store))
}

export function enrollContactsInSequence(
  personIds: string[],
  sequence: { id: string; name: string }
): SequenceEnrollmentsStore {
  const current = loadSequenceEnrollments()
  const next: SequenceEnrollmentsStore = { ...current }

  for (const id of personIds) {
    next[id] = {
      sequenceId: sequence.id,
      sequenceName: sequence.name,
      currentStep: 'Cold outreach – initial email sent',
      stepNumber: 1,
      totalSteps: 5,
      status: 'active',
    }
  }

  saveSequenceEnrollments(next)
  return next
}

// For the Sequences page: dynamic contacts per sequence
export interface DynamicSequenceContact {
  id: string
  name: string
  company: string
  dealName: string
  dealLink: string
  currentStep: string
  stepNumber: number
  totalSteps: number
  status: 'active' | 'completed' | 'paused'
}

export function getDynamicContactsForSequence(
  sequenceId: string | null,
  allPeople: Person[]
): DynamicSequenceContact[] {
  if (!sequenceId) return []
  const enrollments = loadSequenceEnrollments()
  const contacts: DynamicSequenceContact[] = []

  for (const [personId, enrollment] of Object.entries(enrollments)) {
    if (enrollment.sequenceId !== sequenceId) continue
    const person = allPeople.find((p) => p.id === personId)
    if (!person) continue

    contacts.push({
      id: person.id,
      name: person.name,
      company: person.company,
      dealName: person.dealName,
      dealLink: '#',
      currentStep: enrollment.currentStep,
      stepNumber: enrollment.stepNumber,
      totalSteps: enrollment.totalSteps,
      status: enrollment.status,
    })
  }

  return contacts
}


