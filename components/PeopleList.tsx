'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  ChevronDown,
  Mail,
  Phone,
  User,
  Building2,
  ChevronRight,
  ChevronDown as ChevronDownIcon,
  Briefcase,
  Star,
} from 'lucide-react'
import { companiesData } from './CompanyList'
import { getProjectsForContact, Project } from '@/lib/projects'
import { peopleData, Person } from '@/lib/people'
import { AIResearchSession, loadAIContacts, loadSessions } from '@/lib/aiResearch'
import { Sequence, getAllSequences } from '@/lib/sequences'

export function PeopleList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('')
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [selectedOwner, setSelectedOwner] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedSegment, setSelectedSegment] = useState<string>('')
  const [selectedSequenceStatus, setSelectedSequenceStatus] = useState<string>('')
  const [showJobTitleDropdown, setShowJobTitleDropdown] = useState(false)
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showSegmentDropdown, setShowSegmentDropdown] = useState(false)
  const [showSequenceStatusDropdown, setShowSequenceStatusDropdown] = useState(false)
  const [expandedContactIds, setExpandedContactIds] = useState<Set<string>>(new Set())
  const [favoriteContactIds, setFavoriteContactIds] = useState<Set<string>>(new Set())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [contactNotes, setContactNotes] = useState<Record<string, string>>({})
  const [aiContacts, setAiContacts] = useState<Person[]>([])
  const [sessions, setSessions] = useState<AIResearchSession[]>([])
  const [activeView, setActiveView] = useState<string>('all')
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>('')

  const CONTACT_NOTES_STORAGE_KEY = 'contactNotes'

  // UK Construction Industry Contacts + AI researched contacts
  const people: Person[] = [...peopleData, ...aiContacts]

  // Load favorite contacts from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const load = () => {
      const stored = window.localStorage.getItem('favoriteContacts')
      if (stored) {
        try {
          const parsed: string[] = JSON.parse(stored)
          setFavoriteContactIds(new Set(parsed))
        } catch {
          // ignore
        }
      } else {
        setFavoriteContactIds(new Set())
      }
    }
    load()

    // Keep in sync with changes from other pages/tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'favoriteContacts') {
        load()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Load AI research context on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    setAiContacts(loadAIContacts())
    setSessions(loadSessions())
  }, [])

  // Load sequences for enrollment dropdown
  useEffect(() => {
    setSequences(getAllSequences())
  }, [])

  // Load contact notes from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(CONTACT_NOTES_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, string>
        setContactNotes(parsed)
      } catch {
        setContactNotes({})
      }
    } else {
      setContactNotes({})
    }
  }, [])

  const handleNoteChange = (personId: string, value: string) => {
    setContactNotes(prev => {
      const next = { ...prev, [personId]: value }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(CONTACT_NOTES_STORAGE_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  // Extract unique values for filters
  const jobTitles = Array.from(new Set(people.map(p => p.jobTitle)))
  const companies = Array.from(new Set(people.map(p => p.company)))
  const owners = Array.from(new Set(people.map(p => p.owner)))
  const locations = Array.from(new Set(people.map(p => p.location)))
  const segments = Array.from(new Set(people.map(p => p.segment)))
  const sequenceStatuses = ['active', 'completed', 'paused', 'not_enrolled'] as const

  // Filter people based on search and filters
  const filteredPeople = people.filter(person => {
    const matchesSearch = searchQuery === '' || 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesJobTitle = selectedJobTitle === '' || person.jobTitle === selectedJobTitle
    const matchesCompany = selectedCompany === '' || person.company === selectedCompany
    const matchesOwner = selectedOwner === '' || person.owner === selectedOwner
    const matchesLocation = selectedLocation === '' || person.location === selectedLocation
    const matchesSegment = selectedSegment === '' || person.segment === selectedSegment
    const seqStatus =
      person.sequenceEnrollment?.status ?? 'not_enrolled'
    const matchesSequenceStatus =
      selectedSequenceStatus === '' || selectedSequenceStatus === seqStatus
    const matchesFavorite = !showFavoritesOnly || favoriteContactIds.has(person.id)

    const matchesResearchView =
      activeView === 'all'
        ? true
        : sessions
            .find((s) => s.id === activeView)
            ?.contactIds.includes(person.id) ?? false

    return (
      matchesSearch &&
      matchesJobTitle &&
      matchesCompany &&
      matchesOwner &&
      matchesLocation &&
      matchesSegment &&
      matchesSequenceStatus &&
      matchesFavorite &&
      matchesResearchView
    )
  })

  const clearFilters = () => {
    setSelectedJobTitle('')
    setSelectedCompany('')
    setSelectedOwner('')
    setSelectedLocation('')
    setSelectedSegment('')
    setSelectedSequenceStatus('')
    setShowFavoritesOnly(false)
    setSearchQuery('')
  }

  const hasActiveFilters =
    selectedJobTitle ||
    selectedCompany ||
    selectedOwner ||
    selectedLocation ||
    selectedSegment ||
    selectedSequenceStatus ||
    showFavoritesOnly ||
    searchQuery

  const toggleExpanded = (personId: string) => {
    setExpandedContactIds(prev => {
      const next = new Set(prev)
      if (next.has(personId)) {
        next.delete(personId)
      } else {
        next.add(personId)
      }
      return next
    })
  }

  const toggleFavoriteContact = (personId: string) => {
    setFavoriteContactIds(prev => {
      const next = new Set(prev)
      if (next.has(personId)) {
        next.delete(personId)
      } else {
        next.add(personId)
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('favoriteContacts', JSON.stringify(Array.from(next)))
      }
      return next
    })
  }

  const handleAddActiveListToSequence = () => {
    if (activeView === 'all' || !selectedSequenceId) return
    const session = sessions.find((s) => s.id === activeView)
    const sequence = sequences.find((s) => s.id === selectedSequenceId)
    if (!session || !sequence) return

    const idsToEnroll = new Set(session.contactIds)

    setAiContacts((prev) =>
      prev.map((person) => {
        if (!idsToEnroll.has(person.id)) return person
        return {
          ...person,
          sequenceEnrollment: {
            sequenceName: sequence.name,
            currentStep: 'Cold outreach – initial email sent',
            stepNumber: 1,
            totalSteps: 5,
            status: 'active',
          },
        }
      }),
    )
  }

  const openDealForProject = (project: Project) => {
    const basePath = project.id === '1' || project.id === '2' ? '/pipelines/deals' : '/pipelines/deals-stages'
    router.push(`${basePath}/${project.id}`)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">People</h1>
            <div className="mt-2 inline-flex items-center space-x-2 text-xs text-gray-500">
              <span>View:</span>
              <button
                type="button"
                onClick={() => setActiveView('all')}
                className={`px-2 py-1 rounded-full border text-[11px] font-medium ${
                  activeView === 'all'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Master list
              </button>
              {sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setActiveView(session.id)}
                  className={`px-2 py-1 rounded-full border text-[11px] font-medium max-w-[220px] truncate ${
                    activeView === session.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  title={session.name}
                >
                  Buyer personas – {session.name}
                </button>
              ))}
            </div>
            {activeView !== 'all' && filteredPeople.length > 0 && (
              <div className="mt-2 flex items-center space-x-2 text-xs">
                <span className="text-gray-500">Enroll this list into a sequence:</span>
                <select
                  value={selectedSequenceId}
                  onChange={(e) => setSelectedSequenceId(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Choose sequence…</option>
                  {sequences.map((seq) => (
                    <option key={seq.id} value={seq.id}>
                      {seq.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddActiveListToSequence}
                  disabled={!selectedSequenceId}
                  className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                >
                  Add to sequence
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Import
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              + Add Person
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Filters:</span>

          {/* Favorites Filter */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
              showFavoritesOnly
                ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                showFavoritesOnly ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
            <span>Key contacts</span>
          </button>
          
          {/* Job Title Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowJobTitleDropdown(!showJobTitleDropdown)
                setShowCompanyDropdown(false)
                setShowLocationDropdown(false)
                setShowSegmentDropdown(false)
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                selectedJobTitle ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{selectedJobTitle || 'Job Title'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showJobTitleDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedJobTitle('')
                    setShowJobTitleDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  All Job Titles
                </button>
                {jobTitles.map(title => (
                  <button
                    key={title}
                    onClick={() => {
                      setSelectedJobTitle(title)
                      setShowJobTitleDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Company Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCompanyDropdown(!showCompanyDropdown)
                setShowJobTitleDropdown(false)
                setShowOwnerDropdown(false)
                setShowLocationDropdown(false)
                setShowSegmentDropdown(false)
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                selectedCompany ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{selectedCompany || 'Company'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showCompanyDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCompany('')
                    setShowCompanyDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  All Companies
                </button>
                {companies.map(company => (
                  <button
                    key={company}
                    onClick={() => {
                      setSelectedCompany(company)
                      setShowCompanyDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {company}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Owner Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowOwnerDropdown(!showOwnerDropdown)
                setShowJobTitleDropdown(false)
                setShowCompanyDropdown(false)
                setShowLocationDropdown(false)
                setShowSegmentDropdown(false)
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                selectedOwner ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{selectedOwner || 'Owner'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showOwnerDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedOwner('')
                    setShowOwnerDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  All Owners
                </button>
                {owners.map((owner) => (
                  <button
                    key={owner}
                    onClick={() => {
                      setSelectedOwner(owner)
                      setShowOwnerDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {owner}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown)
                setShowJobTitleDropdown(false)
                setShowCompanyDropdown(false)
                setShowSegmentDropdown(false)
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                selectedLocation ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{selectedLocation || 'Location'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedLocation('')
                    setShowLocationDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  All Locations
                </button>
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location)
                      setShowLocationDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Segment Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSegmentDropdown(!showSegmentDropdown)
                setShowJobTitleDropdown(false)
                setShowCompanyDropdown(false)
                setShowLocationDropdown(false)
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                selectedSegment ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{selectedSegment || 'Segment'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showSegmentDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedSegment('')
                    setShowSegmentDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  All Segments
                </button>
                {segments.map(segment => (
                  <button
                    key={segment}
                    onClick={() => {
                      setSelectedSegment(segment)
                      setShowSegmentDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {segment}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sequence Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowJobTitleDropdown(false)
                setShowCompanyDropdown(false)
                setShowOwnerDropdown(false)
                setShowLocationDropdown(false)
                setShowSegmentDropdown(false)
                setShowSequenceStatusDropdown(!showSequenceStatusDropdown)
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                selectedSequenceStatus ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>
                {selectedSequenceStatus === ''
                  ? 'Sequence status'
                  : selectedSequenceStatus === 'not_enrolled'
                  ? 'Not in sequence'
                  : `Sequence: ${selectedSequenceStatus}`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showSequenceStatusDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedSequenceStatus('')
                    setShowSequenceStatusDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  All sequence statuses
                </button>
                {sequenceStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedSequenceStatus(status)
                      setShowSequenceStatusDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {status === 'not_enrolled' ? 'Not in sequence' : status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredPeople.length}</span> of <span className="font-semibold">{people.length}</span> people
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 py-3 px-4"></th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sequence</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map((person) => {
              const isExpanded = expandedContactIds.has(person.id)
              const projects: Project[] = getProjectsForContact(person.id)
              const hasProjects = projects.length > 0

              return (
                <React.Fragment key={person.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => toggleFavoriteContact(person.id)}
                        className="p-1 rounded-full hover:bg-yellow-50"
                        aria-label={
                          favoriteContactIds.has(person.id)
                            ? 'Unfavorite key contact'
                            : 'Favorite as key contact'
                        }
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favoriteContactIds.has(person.id)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-indigo-600">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{person.name}</div>
                          <div className="text-xs text-gray-500">{person.location}</div>
                          {hasProjects && (
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => toggleExpanded(person.id)}
                                className="inline-flex items-center space-x-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                              >
                                <span>{projects.length} related deals</span>
                                {isExpanded ? (
                                  <ChevronDownIcon className="w-3 h-3" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{person.jobTitle}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      const company = companiesData.find(c => c.name === person.company)
                      if (company) {
                        router.push(`/companies/${company.id}`)
                      }
                    }}
                    className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{person.company}</span>
                  </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{person.owner}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                  {person.sequenceEnrollment ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{person.sequenceEnrollment.sequenceName}</span>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          person.sequenceEnrollment.status === 'active' ? 'bg-green-100 text-green-700' :
                          person.sequenceEnrollment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {person.sequenceEnrollment.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">{person.sequenceEnrollment.currentStep}</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${(person.sequenceEnrollment.stepNumber / person.sequenceEnrollment.totalSteps) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {person.sequenceEnrollment.stepNumber}/{person.sequenceEnrollment.totalSteps}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Not enrolled</span>
                  )}
                    </td>
                    <td className="py-4 px-4">
                  <a href={`tel:${person.phone}`} className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:text-indigo-600">
                    <Phone className="w-4 h-4" />
                    <span>{person.phone}</span>
                  </a>
                </td>
                <td className="py-4 px-4">
                  <a href={`mailto:${person.email}`} className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:text-indigo-600">
                    <Mail className="w-4 h-4" />
                    <span>{person.email}</span>
                  </a>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 align-middle">
                      <div className="flex items-center h-full">
                        <input
                          type="text"
                          value={contactNotes[person.id] ?? ''}
                          onChange={(e) => handleNoteChange(person.id, e.target.value)}
                          placeholder="Add note..."
                          className="w-full rounded-md px-0 py-0 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-transparent bg-transparent placeholder:text-gray-400"
                        />
                      </div>
                    </td>
                  </tr>
                  {isExpanded && projects.length > 0 && (
                    <tr className="bg-gray-50/60">
                      <td colSpan={9} className="py-3 px-4">
                        <div className="border border-gray-200 rounded-lg bg-white p-3">
                          <div className="flex items-center space-x-2 mb-3">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              Related deals for {person.company}
                            </span>
                          </div>
                          <div className="overflow-hidden rounded-md border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    Deal
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    Status
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    Last activity
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-100">
                                {projects.map((project) => (
                                  <tr key={project.id}>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                      <button
                                        type="button"
                                        onClick={() => openDealForProject(project)}
                                        className="w-full text-left"
                                      >
                                        <div className="font-medium text-indigo-700 hover:underline truncate">
                                          {project.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">{project.value}</div>
                                      </button>
                                    </td>
                                    <td className="px-3 py-2 text-sm">
                                      <span
                                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                          project.status === 'new'
                                            ? 'bg-sky-100 text-sky-700'
                                            : project.status === 'pipeline'
                                            ? 'bg-amber-100 text-amber-700'
                                            : project.status === 'assessment'
                                            ? 'bg-gray-100 text-gray-700'
                                            : 'bg-emerald-100 text-emerald-700'
                                        }`}
                                      >
                                        {project.status === 'closed_won'
                                          ? 'closed won'
                                          : project.status === 'assessment'
                                          ? 'assessment'
                                          : project.status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-xs text-gray-600">
                                      {project.lastActivity}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>

        {filteredPeople.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No people found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  )
}

