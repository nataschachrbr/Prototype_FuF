'use client'

import { useState } from 'react'
import { X, Sparkles, MessageCircle, Send, Loader2 } from 'lucide-react'
import {
  AIResearchSession,
  upsertSession,
  attachCompaniesToSession,
  attachContactsToSession,
  addAIContacts,
} from '@/lib/aiResearch'
import { Company } from './CompanyList'
import { Person } from '@/lib/people'

interface AIResearchPanelProps {
  isOpen: boolean
  onClose: () => void
  onCompaniesDiscovered: (session: AIResearchSession, newCompanies: Company[]) => void
  onContactsDiscovered: (session: AIResearchSession, newContacts: Person[]) => void
}

type ChatRole = 'user' | 'assistant' | 'system'

interface ChatMessage {
  id: string
  role: ChatRole
  content: string
}

export function AIResearchPanel({
  isOpen,
  onClose,
  onCompaniesDiscovered,
  onContactsDiscovered,
}: AIResearchPanelProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Tell me what you sell and where you want to focus. I will propose target companies first, then key buyer personas inside those accounts.',
    },
  ])
  const [isThinking, setIsThinking] = useState(false)
  const [activeSession, setActiveSession] = useState<AIResearchSession | null>(null)

  if (!isOpen) return null

  const addMessage = (role: ChatRole, content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role,
        content,
      },
    ])
  }

  const simulateFaCadeCompanies = (query: string): { session: AIResearchSession; companies: Company[] } => {
    const baseCompanies: Company[] = [
      {
        id: `ai-co-${Date.now()}-1`,
        name: 'Ed. Züblin AG',
        employees: 14500,
        segment: 'General contractor',
        keywords: ['façade-heavy projects', 'high-rise', 'commercial'],
        location: 'Stuttgart, Germany',
      },
      {
        id: `ai-co-${Date.now()}-2`,
        name: 'Max Bögl',
        employees: 6000,
        segment: 'General contractor',
        keywords: ['complex envelopes', 'infrastructure', 'prefab façade'],
        location: 'Neumarkt, Germany',
      },
      {
        id: `ai-co-${Date.now()}-3`,
        name: 'Gebrüder Schneider Fensterfabrik GmbH & Co. KG',
        employees: 500,
        segment: 'Façade specialist',
        keywords: ['unitised façades', 'aluminium-glass', 'high-end envelopes'],
        location: 'Gotha, Germany',
      },
      {
        id: `ai-co-${Date.now()}-4`,
        name: 'Würth Fassadensysteme',
        employees: 800,
        segment: 'Façade specialist',
        keywords: ['ventilated façades', 'fixings', 'system supplier'],
        location: 'Künzelsau, Germany',
      },
      {
        id: `ai-co-${Date.now()}-5`,
        name: 'HPP Architekten',
        employees: 480,
        segment: 'Architect',
        keywords: ['façade design', 'high-rise', 'corporate HQ'],
        location: 'Düsseldorf, Germany',
      },
      {
        id: `ai-co-${Date.now()}-6`,
        name: 'gmp · Architekten von Gerkan, Marg und Partner',
        employees: 600,
        segment: 'Architect',
        keywords: ['stadia', 'transport hubs', 'complex façades'],
        location: 'Hamburg, Germany',
      },
    ]

    const defaultName = 'Façade key players – Top 13 cities in Germany'
    const session = upsertSession({
      name: defaultName,
      query,
      companyIds: baseCompanies.map((c) => c.id),
      contactIds: [],
    })

    return { session, companies: baseCompanies }
  }

  const simulateBuyerPersonas = (session: AIResearchSession): { updatedSession: AIResearchSession; contacts: Person[] } => {
    const timestamp = Date.now()
    const contacts: Person[] = [
      {
        id: `ai-person-${timestamp}-1`,
        name: 'Dr. Lukas Schneider',
        jobTitle: 'Head of Building Envelope',
        company: 'Ed. Züblin AG',
        owner: 'Construction Sales – DACH',
        dealName: 'Façade framework – Germany (discovery)',
        dealId: 'ai-deal-1',
        phone: '+49 711 7883 0',
        email: 'lukas.schneider@zueblin.de',
        location: 'Stuttgart, Germany',
        segment: 'General contractor',
      },
      {
        id: `ai-person-${timestamp}-2`,
        name: 'Anna Keller',
        jobTitle: 'Head of Procurement – Facades & Building Envelope',
        company: 'Max Bögl',
        owner: 'Construction Sales – DACH',
        dealName: 'Max Bögl façade systems – intro',
        dealId: 'ai-deal-2',
        phone: '+49 9181 909 0',
        email: 'anna.keller@max-boegl.de',
        location: 'Neumarkt, Germany',
        segment: 'General contractor',
      },
      {
        id: `ai-person-${timestamp}-3`,
        name: 'Prof. Markus Vogel',
        jobTitle: 'Technical Director Façades',
        company: 'Gebrüder Schneider Fensterfabrik GmbH & Co. KG',
        owner: 'Construction Sales – DACH',
        dealName: 'High-end façade partners – DACH',
        dealId: 'ai-deal-3',
        phone: '+49 3621 777 0',
        email: 'markus.vogel@schneider-fassaden.de',
        location: 'Gotha, Germany',
        segment: 'Façade specialist',
      },
      {
        id: `ai-person-${timestamp}-4`,
        name: 'Johanna Weiss',
        jobTitle: 'Senior Partner – Façade Design',
        company: 'HPP Architekten',
        owner: 'Specification – Architects',
        dealName: 'Specification partnership – façades',
        dealId: 'ai-deal-4',
        phone: '+49 211 9154 0',
        email: 'johanna.weiss@hpp.com',
        location: 'Düsseldorf, Germany',
        segment: 'Architect',
      },
    ]

    const addedIds = addAIContacts(contacts)
    const updatedSession = attachContactsToSession(session.id, addedIds) || session
    return { updatedSession, contacts }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isThinking) return

    addMessage('user', trimmed)
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      const lower = trimmed.toLowerCase()

      // Step 1: discover companies
      if (!activeSession && (lower.includes('façade') || lower.includes('facade'))) {
        const { session, companies } = simulateFaCadeCompanies(trimmed)
        setActiveSession(session)

        addMessage(
          'assistant',
          'I have identified key façade-relevant players in the largest German cities: major general contractors, façade specialists, and architects who frequently specify complex envelopes. I created a saved list you can reuse on the Companies page.',
        )
        onCompaniesDiscovered(session, companies)
      } else if (activeSession && (lower.includes('buyer') || lower.includes('personas') || lower.includes('contacts'))) {
        // Step 2: buyer personas inside those accounts
        const { updatedSession, contacts } = simulateBuyerPersonas(activeSession)
        setActiveSession(updatedSession)
        addMessage(
          'assistant',
          'I found buyer personas such as Heads of Procurement, Heads of Building Envelope and senior façade architects inside your target accounts. They are now saved as contacts and grouped in a dedicated AI research list on the People page.',
        )
        onContactsDiscovered(updatedSession, contacts)
      } else {
        addMessage(
          'assistant',
          'Got it. For this prototype I can:\n\n1) Propose façade-relevant companies in German cities.\n2) Then identify buyer personas inside those accounts.\n\nTry asking me for façade key players in the top 13 cities in Germany, or ask me to identify buyer personas inside the accounts I have already found.',
        )
      }

      setIsThinking(false)
    }, 900)
  }

  const handleSuggestion = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">AI Research Agent</h2>
              <p className="text-xs text-gray-500">
                Use AI to discover new accounts and buyer personas, then send them straight into sequences.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleSuggestion(
                  'In the 13 biggest cities in Germany, identify the key players that are relevant for me. I sell façade systems.',
                )
              }
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
            >
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Find façade key players in Germany
            </button>
            <button
              type="button"
              onClick={() =>
                handleSuggestion('Now identify relevant buyer personas within these accounts.')
              }
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
            >
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Find buyer personas in my segment
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-50 text-gray-900 border border-gray-200 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Researching construction players…</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-gray-200">
          <div className="flex items-end space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="Describe the segment and region you want to explore…"
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-indigo-600 text-white shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isThinking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="mt-1 text-[10px] text-gray-400">
            Prototype: companies and contacts are mocked but saved as reusable lists on Companies and
            People.
          </p>
        </form>
      </div>
    </div>
  )
}


