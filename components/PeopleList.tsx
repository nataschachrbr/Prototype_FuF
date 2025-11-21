'use client'

import { useState } from 'react'
import { Search, ChevronDown, ExternalLink, Mail, Phone, User } from 'lucide-react'

interface Person {
  id: string
  name: string
  jobTitle: string
  company: string
  owner: string
  dealName: string
  dealId: string
  phone: string
  email: string
  location: string
  segment: string
  sequenceEnrollment?: {
    sequenceName: string
    currentStep: string
    stepNumber: number
    totalSteps: number
    status: 'active' | 'completed' | 'paused'
  }
}

export function PeopleList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('')
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedSegment, setSelectedSegment] = useState<string>('')
  const [showJobTitleDropdown, setShowJobTitleDropdown] = useState(false)
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showSegmentDropdown, setShowSegmentDropdown] = useState(false)

  // UK Construction Industry Contacts
  const people: Person[] = [
    {
      id: '1',
      name: 'James Robertson',
      jobTitle: 'Head of Infrastructure Projects',
      company: 'Balfour Beatty',
      owner: 'Emma Thompson',
      dealName: 'HS2 Rail Infrastructure Package',
      dealId: 'deal-001',
      phone: '+44 20 7216 6800',
      email: 'james.robertson@balfourbeatty.com',
      location: 'London, UK',
      segment: 'Major contractor',
      sequenceEnrollment: {
        sequenceName: 'Major Projects Outreach',
        currentStep: 'Initial meeting scheduled',
        stepNumber: 2,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '2',
      name: 'Sarah Mitchell',
      jobTitle: 'Commercial Director',
      company: 'Kier Group',
      owner: 'David Clarke',
      dealName: 'M25 Highways Upgrade',
      dealId: 'deal-002',
      phone: '+44 1923 423 840',
      email: 'sarah.mitchell@kier.co.uk',
      location: 'Hertfordshire, UK',
      segment: 'Major contractor',
      sequenceEnrollment: {
        sequenceName: 'Standard Outreach',
        currentStep: 'Email sent - waiting for response',
        stepNumber: 2,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '3',
      name: 'Thomas Harrison',
      jobTitle: 'Head of Procurement',
      company: 'Morgan Sindall Group',
      owner: 'Emma Thompson',
      dealName: 'Liverpool Regeneration Project',
      dealId: 'deal-003',
      phone: '+44 20 7307 9200',
      email: 'thomas.harrison@morgansindall.com',
      location: 'London, UK',
      segment: 'Major contractor',
      sequenceEnrollment: {
        sequenceName: 'Procurement Outreach',
        currentStep: 'Follow-up call completed',
        stepNumber: 3,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '4',
      name: 'Emily Davies',
      jobTitle: 'Project Director - Buildings',
      company: 'Galliford Try',
      owner: 'David Clarke',
      dealName: 'Healthcare Facilities Programme',
      dealId: 'deal-004',
      phone: '+44 1895 855 001',
      email: 'emily.davies@gallifordtry.co.uk',
      location: 'Uxbridge, UK',
      segment: 'Major contractor',
      sequenceEnrollment: {
        sequenceName: 'Healthcare Sector Focus',
        currentStep: 'Proposal submitted',
        stepNumber: 4,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '5',
      name: 'Michael O\'Connor',
      jobTitle: 'Energy Sector Lead',
      company: 'Costain Group',
      owner: 'Emma Thompson',
      dealName: 'Thames Water Infrastructure',
      dealId: 'deal-005',
      phone: '+44 20 7940 8400',
      email: 'michael.oconnor@costain.com',
      location: 'London, UK',
      segment: 'Major contractor',
      sequenceEnrollment: {
        sequenceName: 'Energy & Water Focus',
        currentStep: 'Contract negotiation',
        stepNumber: 5,
        totalSteps: 5,
        status: 'completed'
      }
    },
    {
      id: '6',
      name: 'Sophie Turner',
      jobTitle: 'Director of Strategic Projects',
      company: 'Laing O\'Rourke',
      owner: 'David Clarke',
      dealName: 'London Gateway Port Expansion',
      dealId: 'deal-006',
      phone: '+44 1322 296 200',
      email: 'sophie.turner@laingorourke.com',
      location: 'Dartford, UK',
      segment: 'Major contractor',
      sequenceEnrollment: {
        sequenceName: 'Major Projects Outreach',
        currentStep: 'Initial contact made',
        stepNumber: 1,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '7',
      name: 'Andrew Phillips',
      jobTitle: 'Sustainability & Green Building Lead',
      company: 'Skanska UK',
      owner: 'Emma Thompson',
      dealName: 'Net Zero Office Development',
      dealId: 'deal-007',
      phone: '+44 1923 423 000',
      email: 'andrew.phillips@skanska.co.uk',
      location: 'Hertfordshire, UK',
      segment: 'Major contractor'
    },
    {
      id: '8',
      name: 'Rachel Williams',
      jobTitle: 'Head of Facilities Management',
      company: 'BAM UK & Ireland',
      owner: 'David Clarke',
      dealName: 'University Campus FM Contract',
      dealId: 'deal-008',
      phone: '+44 1442 238 300',
      email: 'rachel.williams@bam.com',
      location: 'Hemel Hempstead, UK',
      segment: 'Major contractor',
      sequenceEnrollment: {
        sequenceName: 'Facilities Management Focus',
        currentStep: 'Site visit arranged',
        stepNumber: 3,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '9',
      name: 'Oliver Bennett',
      jobTitle: 'Land Director',
      company: 'Barratt Redrow',
      owner: 'Emma Thompson',
      dealName: 'Cambridge New Town Development',
      dealId: 'deal-009',
      phone: '+44 1530 278 278',
      email: 'oliver.bennett@barrattredrow.co.uk',
      location: 'Coalville, UK',
      segment: 'Housebuilder',
      sequenceEnrollment: {
        sequenceName: 'Housing Development Outreach',
        currentStep: 'Planning approval support',
        stepNumber: 4,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '10',
      name: 'Charlotte Brown',
      jobTitle: 'Partnerships Director',
      company: 'Persimmon plc',
      owner: 'David Clarke',
      dealName: 'Affordable Housing Partnership',
      dealId: 'deal-010',
      phone: '+44 1904 642 199',
      email: 'charlotte.brown@persimmonhomes.com',
      location: 'York, UK',
      segment: 'Housebuilder',
      sequenceEnrollment: {
        sequenceName: 'Partnership Outreach',
        currentStep: 'Partnership agreement drafted',
        stepNumber: 4,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '11',
      name: 'Daniel Wright',
      jobTitle: 'Regional Managing Director',
      company: 'Taylor Wimpey',
      owner: 'Emma Thompson',
      dealName: 'Thames Valley Residential Scheme',
      dealId: 'deal-011',
      phone: '+44 1494 885 555',
      email: 'daniel.wright@taylorwimpey.com',
      location: 'High Wycombe, UK',
      segment: 'Housebuilder'
    },
    {
      id: '12',
      name: 'Lucy Anderson',
      jobTitle: 'Technical Director',
      company: 'Bellway plc',
      owner: 'David Clarke',
      dealName: 'North East Housing Development',
      dealId: 'deal-012',
      phone: '+44 191 217 0717',
      email: 'lucy.anderson@bellway.co.uk',
      location: 'Newcastle upon Tyne, UK',
      segment: 'Housebuilder',
      sequenceEnrollment: {
        sequenceName: 'Technical Specification Focus',
        currentStep: 'Technical review meeting',
        stepNumber: 2,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '13',
      name: 'Henry Clarke',
      jobTitle: 'Development Director',
      company: 'Berkeley Group Holdings',
      owner: 'Emma Thompson',
      dealName: 'Canary Wharf Mixed-Use Tower',
      dealId: 'deal-013',
      phone: '+44 1932 868 555',
      email: 'henry.clarke@berkeleygroup.co.uk',
      location: 'Cobham, UK',
      segment: 'Housebuilder',
      sequenceEnrollment: {
        sequenceName: 'Urban Development Outreach',
        currentStep: 'Design consultation phase',
        stepNumber: 3,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '14',
      name: 'Rebecca Thompson',
      jobTitle: 'Head of Affordable Housing',
      company: 'Vistry Group',
      owner: 'David Clarke',
      dealName: 'Social Housing Initiative',
      dealId: 'deal-014',
      phone: '+44 1923 896 555',
      email: 'rebecca.thompson@vistrygroup.co.uk',
      location: 'Watford, UK',
      segment: 'Housebuilder'
    },
    {
      id: '15',
      name: 'George Patterson',
      jobTitle: 'National Account Manager',
      company: 'Travis Perkins plc',
      owner: 'Emma Thompson',
      dealName: 'National Supply Partnership',
      dealId: 'deal-015',
      phone: '+44 1604 683 100',
      email: 'george.patterson@travisperkins.co.uk',
      location: 'Northampton, UK',
      segment: 'Merchant / distributor',
      sequenceEnrollment: {
        sequenceName: 'Supply Chain Outreach',
        currentStep: 'Pricing proposal submitted',
        stepNumber: 4,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '16',
      name: 'Victoria Hughes',
      jobTitle: 'Branch Network Director',
      company: 'Jewson (Stark Group)',
      owner: 'David Clarke',
      dealName: 'Regional Distribution Agreement',
      dealId: 'deal-016',
      phone: '+44 1473 237 500',
      email: 'victoria.hughes@jewson.co.uk',
      location: 'Ipswich, UK',
      segment: 'Merchant / distributor',
      sequenceEnrollment: {
        sequenceName: 'Distribution Network Focus',
        currentStep: 'Initial meeting completed',
        stepNumber: 2,
        totalSteps: 5,
        status: 'active'
      }
    },
    {
      id: '17',
      name: 'Alexander Scott',
      jobTitle: 'Chief Engineer - Rail',
      company: 'Balfour Beatty',
      owner: 'Emma Thompson',
      dealName: 'Crossrail 2 Feasibility',
      dealId: 'deal-017',
      phone: '+44 20 7216 6820',
      email: 'alexander.scott@balfourbeatty.com',
      location: 'London, UK',
      segment: 'Major contractor'
    },
    {
      id: '18',
      name: 'Grace Robinson',
      jobTitle: 'Operations Director',
      company: 'Morgan Sindall Group',
      owner: 'David Clarke',
      dealName: 'Birmingham City Centre Fit-Out',
      dealId: 'deal-018',
      phone: '+44 20 7307 9250',
      email: 'grace.robinson@morgansindall.com',
      location: 'London, UK',
      segment: 'Major contractor',
      sequenceEnrollment: {
        sequenceName: 'Fit-Out Specialists',
        currentStep: 'Detailed quotation phase',
        stepNumber: 3,
        totalSteps: 5,
        status: 'active'
      }
    }
  ]

  // Extract unique values for filters
  const jobTitles = Array.from(new Set(people.map(p => p.jobTitle)))
  const companies = Array.from(new Set(people.map(p => p.company)))
  const locations = Array.from(new Set(people.map(p => p.location)))
  const segments = Array.from(new Set(people.map(p => p.segment)))

  // Filter people based on search and filters
  const filteredPeople = people.filter(person => {
    const matchesSearch = searchQuery === '' || 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesJobTitle = selectedJobTitle === '' || person.jobTitle === selectedJobTitle
    const matchesCompany = selectedCompany === '' || person.company === selectedCompany
    const matchesLocation = selectedLocation === '' || person.location === selectedLocation
    const matchesSegment = selectedSegment === '' || person.segment === selectedSegment

    return matchesSearch && matchesJobTitle && matchesCompany && matchesLocation && matchesSegment
  })

  const clearFilters = () => {
    setSelectedJobTitle('')
    setSelectedCompany('')
    setSelectedLocation('')
    setSelectedSegment('')
    setSearchQuery('')
  }

  const hasActiveFilters = selectedJobTitle || selectedCompany || selectedLocation || selectedSegment || searchQuery

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">People</h1>
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
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Related Deal</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sequence</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map((person) => (
              <tr key={person.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">{person.jobTitle}</td>
                <td className="py-4 px-4 text-sm text-gray-700">{person.company}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{person.owner}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <a
                    href={person.dealId.startsWith('/') ? person.dealId : `/deals/${person.dealId}`}
                    className="inline-flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <span>{person.dealName}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
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
              </tr>
            ))}
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

