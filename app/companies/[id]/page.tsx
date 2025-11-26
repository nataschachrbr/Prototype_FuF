'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { Building2, MapPin, Users, Tag, ArrowLeft, Briefcase, Star } from 'lucide-react'
import { peopleData } from '@/lib/people'
import { companiesData } from '@/components/CompanyList'
import { getProjectsForCompany } from '@/lib/projects'

export default function CompanyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const company = companiesData.find((c) => c.id === id)
  const [favoriteContactIds, setFavoriteContactIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('favoriteContacts')
    if (stored) {
      try {
        const parsed: string[] = JSON.parse(stored)
        setFavoriteContactIds(new Set(parsed))
      } catch {
        // ignore
      }
    }
  }, [])

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
                Back to companies
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const projects = getProjectsForCompany(company.name)
  const newProjects = projects.filter((p) => p.status === 'new')
  const pipelineProjects = projects.filter((p) => p.status === 'pipeline')
  const closedWonProjects = projects.filter((p) => p.status === 'closed_won')

  const relatedContacts = peopleData.filter((p) => p.company === company.name)

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
            Back to companies
          </button>

          {/* Company header */}
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

          {/* Layout grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left column: company info + projects */}
            <div className="xl:col-span-2 space-y-6">
              {/* Company information */}
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

              {/* Projects section */}
              <div id="deals" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span>Projects</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      New
                    </h3>
                    <div className="space-y-2">
                      {newProjects.map((project) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-3 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{project.value}</div>
                        </div>
                      ))}
                      {newProjects.length === 0 && (
                        <p className="text-xs text-gray-400">No new projects</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      In pipeline
                    </h3>
                    <div className="space-y-2">
                      {pipelineProjects.map((project) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-3 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{project.value}</div>
                        </div>
                      ))}
                      {pipelineProjects.length === 0 && (
                        <p className="text-xs text-gray-400">No projects in pipeline</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Closed won
                    </h3>
                    <div className="space-y-2">
                      {closedWonProjects.map((project) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-3 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{project.value}</div>
                        </div>
                      ))}
                      {closedWonProjects.length === 0 && (
                        <p className="text-xs text-gray-400">No closed-won projects</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: related contacts */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Related contacts</h2>

                {relatedContacts.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No contacts found for this company yet. Add people in the People tab to see
                    them here.
                  </p>
                )}

                <div className="space-y-4 max-h-[480px] overflow-auto pr-1">
                  {relatedContacts.map((person) => (
                    <div
                      key={person.id}
                      className="border border-gray-200 rounded-lg p-3 flex items-start space-x-3 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                    >
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-indigo-600">
                          {person.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {person.name}
                              </div>
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
                                  className={`w-3.5 h-3.5 ${
                                    favoriteContactIds.has(person.id)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {person.jobTitle} • {person.location}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="text-xs text-gray-500 truncate">
                            Owner: <span className="font-medium text-gray-700">{person.owner}</span>
                          </div>
                          {person.dealName && (
                            <div className="text-xs text-gray-500 truncate">
                              Deal: <span className="font-medium text-gray-700">{person.dealName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


