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

  const isBalfourBeatty =
    company.id === '1' || company.name.toLowerCase().includes('balfour beatty')

  const openDealForProject = (project: Project) => {
    const basePath = project.id === '1' || project.id === '2' ? '/pipelines/deals' : '/pipelines/deals-stages'
    router.push(`${basePath}/${project.id}`)
  }

  const openCompanyByName = (name: string) => {
    const match = companiesData.find((c) => c.name === name)
    if (match) {
      router.push(`/companies/${match.id}`)
    }
  }

  const BalfourBeattyPartnerNetwork = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Partner network around Balfour Beatty</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-3xl">
            How Balfour Beatty typically sits at the centre of real UK &amp; European projects, with
            repeat partners grouped by their role in delivery. Use this to spot access points, early
            influencers, and where relationships cluster.
          </p>
        </div>
      </div>

      {/* Central node */}
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-800 text-xs font-semibold uppercase tracking-wide">
          Central contractor
        </div>
        <div className="mt-3 inline-flex items-center justify-center px-5 py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-sm">
          Balfour Beatty
        </div>
        <div className="mt-4 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Role-based partner bands */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Clients / asset owners / developers (short list) */}
        <div className="relative rounded-lg border border-gray-100 bg-gray-50/60 p-4">
          <div className="absolute -top-3 left-4 inline-flex items-center px-2 py-0.5 rounded-full bg-gray-900 text-gray-100 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
            Clients / Asset owners / Developers
          </div>
          <div className="mt-2 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => openCompanyByName('Transport for London')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Transport for London (TfL)
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Urban transport client / asset owner
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> frequent repeat client.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 cursor-pointer"
                  >
                    London Underground station upgrades
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 cursor-pointer"
                  >
                    Victoria &amp; Jubilee line works
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-dashed border-gray-200">
              <button
                type="button"
                onClick={() => openCompanyByName('Network Rail')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Network Rail
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> National rail infrastructure owner
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> frequent collaborator on UK rail.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 cursor-pointer"
                  >
                    Thameslink Programme &ndash; London Bridge area works
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 cursor-pointer"
                  >
                    UK rail renewals framework packages
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering consultants (short list) */}
        <div className="relative rounded-lg border border-gray-100 bg-gray-50/60 p-4">
          <div className="absolute -top-3 left-4 inline-flex items-center px-2 py-0.5 rounded-full bg-sky-900 text-sky-50 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
            Engineering consultants
          </div>
          <div className="mt-2 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => openCompanyByName('Mott MacDonald')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Mott MacDonald
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Multidisciplinary engineering consultant
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> regular design and advisory partner.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-800 hover:bg-sky-100 hover:border-sky-300 cursor-pointer"
                  >
                    A14 Cambridge&ndash;Huntingdon Improvement Scheme
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-800 hover:bg-sky-100 hover:border-sky-300 cursor-pointer"
                  >
                    UK highways and structures design frameworks
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-dashed border-gray-200">
              <button
                type="button"
                onClick={() => openCompanyByName('Arup')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Arup
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Engineering and design consultant
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> frequent collaborator on complex rail
                and stations.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-800 hover:bg-sky-100 hover:border-sky-300 cursor-pointer"
                  >
                    Crossrail &ndash; rail and station works
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-800 hover:bg-sky-100 hover:border-sky-300 cursor-pointer"
                  >
                    Major UK station redevelopments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural design partners (short list) */}
        <div className="relative rounded-lg border border-gray-100 bg-gray-50/60 p-4">
          <div className="absolute -top-3 left-4 inline-flex items-center px-2 py-0.5 rounded-full bg-purple-900 text-purple-50 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
            Architectural design partners
          </div>
          <div className="mt-2 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => openCompanyByName('Grimshaw Architects')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Grimshaw Architects
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Transport and infrastructure architect
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> go-to design partner on major
                stations.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-800 hover:bg-purple-100 hover:border-purple-300 cursor-pointer"
                  >
                    London Bridge Station redevelopment
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-800 hover:bg-purple-100 hover:border-purple-300 cursor-pointer"
                  >
                    Major UK rail hub upgrades
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-dashed border-gray-200">
              <button
                type="button"
                onClick={() => openCompanyByName('WilkinsonEyre')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                WilkinsonEyre
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Signature architectural practice
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> frequent collaborator on landmark
                regeneration.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-800 hover:bg-purple-100 hover:border-purple-300 cursor-pointer"
                  >
                    Battersea Power Station redevelopment
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-800 hover:bg-purple-100 hover:border-purple-300 cursor-pointer"
                  >
                    Major London regeneration schemes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project management / consultancy partners (short list) */}
        <div className="relative rounded-lg border border-gray-100 bg-gray-50/60 p-4">
          <div className="absolute -top-3 left-4 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-50 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
            Project management / Consultancy partners
          </div>
          <div className="mt-2 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => openCompanyByName('AECOM')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                AECOM
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Programme / project management and technical
                advisor
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> regular PM and design integrator.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer"
                  >
                    Crossrail &ndash; programme management
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer"
                  >
                    Major UK corridor upgrades
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-dashed border-gray-200">
              <button
                type="button"
                onClick={() => openCompanyByName('Turner & Townsend')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Turner &amp; Townsend
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Cost management and programme controls
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> common commercial / PMO partner.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer"
                  >
                    London 2012 Olympic Park legacy
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer"
                  >
                    UK regeneration and civic programmes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Co-contractors / joint venture partners (short list) */}
        <div className="relative rounded-lg border border-gray-100 bg-gray-50/60 p-4">
          <div className="absolute -top-3 left-4 inline-flex items-center px-2 py-0.5 rounded-full bg-amber-900 text-amber-50 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
            Co-contractors / Joint venture partners
          </div>
          <div className="mt-2 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => openCompanyByName('Costain Group')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Costain
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Tier-1 contractor, JV partner
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> common joint venture collaborator.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 hover:bg-amber-100 hover:border-amber-300 cursor-pointer"
                  >
                    A14 Cambridge&ndash;Huntingdon Improvement Scheme
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 hover:bg-amber-100 hover:border-amber-300 cursor-pointer"
                  >
                    Thames Tideway Tunnel sections
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-dashed border-gray-200">
              <button
                type="button"
                onClick={() => openCompanyByName('Skanska UK')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Skanska
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Tier-1 contractor, co-contractor
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> frequent collaborator on major
                corridors.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 hover:bg-amber-100 hover:border-amber-300 cursor-pointer"
                  >
                    M25 motorway widening and improvements
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 hover:bg-amber-100 hover:border-amber-300 cursor-pointer"
                  >
                    UK strategic road corridor upgrades
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specialist contractors (short list) */}
        <div className="relative rounded-lg border border-gray-100 bg-gray-50/60 p-4">
          <div className="absolute -top-3 left-4 inline-flex items-center px-2 py-0.5 rounded-full bg-rose-900 text-rose-50 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
            Specialist contractors
          </div>
          <div className="mt-2 space-y-3">
            <div>
              <button
                type="button"
                onClick={() => openCompanyByName('NG Bailey')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                NG Bailey
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> Building services / M&amp;E specialist
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> regular specialist subcontractor on
                complex buildings.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-800 hover:bg-rose-100 hover:border-rose-300 cursor-pointer"
                  >
                    UK hospital projects &ndash; M&amp;E fit-out
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-800 hover:bg-rose-100 hover:border-rose-300 cursor-pointer"
                  >
                    Rail station upgrades &ndash; building services
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-dashed border-gray-200">
              <button
                type="button"
                onClick={() => openCompanyByName('Balfour Beatty Kilpatrick')}
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
              >
                Balfour Beatty Kilpatrick
              </button>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Role:</span> In-group M&amp;E and fit-out specialist
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Relationship:</span> integrated specialist arm on
                technically demanding schemes.
              </p>
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Example projects:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-800 hover:bg-rose-100 hover:border-rose-300 cursor-pointer"
                  >
                    Hinkley Point C &ndash; building services
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-800 hover:bg-rose-100 hover:border-rose-300 cursor-pointer"
                  >
                    Major healthcare and defence fit-out projects
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
        This diagram is intentionally high-level: it highlights who typically clusters around Balfour
        Beatty on real schemes, not a complete list of every partner.
      </div>
    </div>
  )

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
            {isBalfourBeatty ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Company information</h2>
                  <div className="grid grid-cols-1 gap-4">
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

                {/* Balfour Beatty project profile (pie chart) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Project profile</h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Quick view of where Balfour Beatty most often shows up as contractor &mdash; for
                        fast qualification, not exact reporting.
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      Prototype
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Pie chart */}
                    <div className="relative">
                      <div
                        className="w-32 h-32 rounded-full shadow-inner border border-gray-100"
                        style={{
                          background:
                            'conic-gradient(#4f46e5 0 40%, #6366f1 40% 70%, #818cf8 70% 85%, #a5b4fc 85% 95%, #e0e7ff 95% 100%)',
                        }}
                      />
                      <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                            Project mix
                          </div>
                          <div className="text-xs text-gray-400">UK focus</div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                          <span className="text-xs text-gray-700">Rail &amp; Transport</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900">40%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <span className="text-xs text-gray-700">Highways &amp; Infrastructure</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900">30%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                          <span className="text-xs text-gray-700">Commercial &amp; Mixed-Use</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900">15%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-300" />
                          <span className="text-xs text-gray-700">Healthcare</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900">10%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-200" />
                          <span className="text-xs text-gray-700">Education</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}

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
                          Project
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Phase
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Value
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
                            <button
                              type="button"
                              onClick={() => openDealForProject(project)}
                              className="w-full text-left"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                  {company.name
                                    .split(' ')
                                    .slice(0, 2)
                                    .map((n) => n[0])
                                    .join('')}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-indigo-700 hover:underline">
                                    {project.name}
                                  </div>
                                  <div className="text-xs text-gray-500">{company.location}</div>
                                </div>
                              </div>
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{project.role}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{project.phase}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{project.value}</div>
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
                            Sequence
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
                                  <button
                                    type="button"
                                    onClick={() => openDealForProject(linkedProject)}
                                    className="text-sm font-medium text-indigo-700 hover:underline truncate"
                                  >
                                    {linkedProject.name}
                                  </button>
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
                                {person.sequenceEnrollment ? (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-gray-900 truncate max-w-[140px]">
                                        {person.sequenceEnrollment.sequenceName}
                                      </span>
                                      <span
                                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                                          person.sequenceEnrollment.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : person.sequenceEnrollment.status === 'completed'
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                      >
                                        {person.sequenceEnrollment.status}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-gray-500 truncate">
                                      {person.sequenceEnrollment.currentStep}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                        <div
                                          className="bg-indigo-600 h-1.5 rounded-full"
                                          style={{
                                            width: `${
                                              (person.sequenceEnrollment.stepNumber /
                                                person.sequenceEnrollment.totalSteps) *
                                              100
                                            }%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                        {person.sequenceEnrollment.stepNumber}/
                                        {person.sequenceEnrollment.totalSteps}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">Not in sequence</span>
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

              {isBalfourBeatty && <BalfourBeattyPartnerNetwork />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

