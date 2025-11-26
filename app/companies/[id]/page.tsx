'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import {
  Building2,
  MapPin,
  Users,
  Tag,
  ArrowLeft,
  Briefcase,
  Star,
  Mail,
  Phone,
  MoreVertical,
} from 'lucide-react'
import { peopleData } from '@/lib/people'
import { companiesData } from '@/components/CompanyList'
import { getProjectsForCompany, Project } from '@/lib/projects'

export default function CompanyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const company = companiesData.find((c) => c.id === id)
  const [favoriteContactIds, setFavoriteContactIds] = useState<Set<string>>(new Set())
  const [contactNotes, setContactNotes] = useState<Record<string, string>>({})

  const CONTACT_NOTES_STORAGE_KEY = 'contactNotes'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('favoriteContacts')
    if (stored) {
      try {
        const parsed: string[] = JSON.parse(stored)
        setFavoriteContactIds(new Set(parsed))
      } catch {
        setFavoriteContactIds(new Set())
      }
    }
  }, [])

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
    setContactNotes((prev) => {
      const next = { ...prev, [personId]: value }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(CONTACT_NOTES_STORAGE_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  const toggleFavoriteContact = (personId: string) => {
    setFavoriteContactIds((prev) => {
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

  if (!company) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-gray-900">Company not found</p>
              <button
                onClick={() => router.push('/companies')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back to companies</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const projects = getProjectsForCompany(company.name)

  const projectsWithContacts = projects.map((project) => ({
    project,
    contact: project.primaryContactId
      ? peopleData.find((p) => p.id === project.primaryContactId)
      : undefined,
  }))

  const relatedContacts = peopleData.filter((p) => p.company === company.name)

  const stageChipClass = (status: Project['status']) => {
    if (status === 'closed_won') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    if (status === 'assessment') return 'bg-gray-50 text-gray-700 border border-gray-200'
    if (status === 'pipeline') return 'bg-amber-50 text-amber-700 border border-amber-200'
    return 'bg-sky-50 text-sky-700 border border-sky-200'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-auto px-8 py-6">
          <button
            onClick={() => router.push('/companies')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to companies</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-sm text-gray-500">Company overview</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Location</div>
                    <div className="text-sm font-medium text-gray-900">{company.location}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Employees</div>
                    <div className="text-sm font-medium text-gray-900">
                      {company.employees.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Segment</div>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {company.segment}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-xs uppercase tracking-wide text-gray-500">Keywords</span>
                  <div className="flex flex-wrap gap-2">
                    {company.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="deals" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span>Deals &amp; opportunities</span>
                </h2>
                <span className="text-xs text-gray-500">
                  Showing {projectsWithContacts.length} deals
                </span>
              </div>

              {projectsWithContacts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No deals yet for this company. Create a new deal from the pipeline view to see it
                  here.
                </p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Opportunity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Stage
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Last activity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Key contact
                        </th>
                        <th className="w-10 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {projectsWithContacts.map(({ project, contact }) => (
                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {company.name
                                  .split(' ')
                                  .slice(0, 2)
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {project.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {company.location} · {project.value}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={
                                'inline-flex px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ' +
                                stageChipClass(project.status)
                              }
                            >
                              {project.stageLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-gray-600">{project.lastActivity}</div>
                          </td>
                          <td className="px-4 py-3">
                            {contact ? (
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-semibold text-indigo-700 flex-shrink-0">
                                  {contact.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {contact.name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {contact.jobTitle}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">No contact linked</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Contacts at this company
                  </h2>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg border border-indigo-100"
                  >
                    View all people
                  </button>
                </div>

                {relatedContacts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No contacts found for this company yet. Add people in the People tab to see them
                    here.
                  </p>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Contact
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Opportunity
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Stage
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Last activity
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {relatedContacts.map((person) => {
                          const linkedProject: Project | undefined =
                            projects.find((p) => p.id === person.dealId) ||
                            projects.find((p) => p.primaryContactId === person.id)

                          return (
                            <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-semibold text-indigo-700 flex-shrink-0">
                                    {person.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {person.name}
                                    </div>
                                    <div className="text-xs text-gray-500">{person.jobTitle}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                {linkedProject ? (
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {linkedProject.name}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">No deal linked</span>
                                )}
                              </td>
                              <td className="px-3 py-3">
                                {linkedProject ? (
                                  <span
                                    className={
                                      'inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ' +
                                      stageChipClass(linkedProject.status)
                                    }
                                  >
                                    {linkedProject.stageLabel}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-3 py-3">
                                <div className="text-xs text-gray-600">
                                  {linkedProject ? linkedProject.lastActivity : '—'}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-right">
                                <div className="flex items-center justify-end space-x-2 text-indigo-600">
                                  <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-50"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-50"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleFavoriteContact(person.id)}
                                    className={
                                      'w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-50 ' +
                                      (favoriteContactIds.has(person.id)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300 hover:text-yellow-400')
                                    }
                                    aria-label={
                                      favoriteContactIds.has(person.id)
                                        ? 'Unfavorite key contact'
                                        : 'Favorite as key contact'
                                    }
                                  >
                                    <Star
                                      className={
                                        'w-4 h-4 ' +
                                        (favoriteContactIds.has(person.id)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : '')
                                      }
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick contact notes</h3>
                {relatedContacts.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    Start by adding contacts to this company to capture notes.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {relatedContacts.map((person) => (
                      <div key={person.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 truncate">
                            {person.name}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={contactNotes[person.id] ?? ''}
                          onChange={(e) => handleNoteChange(person.id, e.target.value)}
                          placeholder="Add note..."
                          className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

