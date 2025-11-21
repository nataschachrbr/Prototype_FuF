'use client'

import { useState } from 'react'
import { Search, ChevronDown, Building2, Plus } from 'lucide-react'

interface Company {
  id: string
  name: string
  logo?: string
  employees: number
  segment: string
  keywords: string[]
  location: string
  website?: string
}

export function CompanyList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSegment, setSelectedSegment] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedEmployeeRange, setSelectedEmployeeRange] = useState<string>('')
  const [showSegmentDropdown, setShowSegmentDropdown] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showEmployeeRangeDropdown, setShowEmployeeRangeDropdown] = useState(false)

  // UK Construction Industry Companies
  const companies: Company[] = [
    {
      id: '1',
      name: 'Balfour Beatty',
      employees: 27300,
      segment: 'Major contractor',
      keywords: ['infrastructure', 'civil engineering', 'rail'],
      location: 'London, UK'
    },
    {
      id: '2',
      name: 'Kier Group',
      employees: 10000,
      segment: 'Major contractor',
      keywords: ['infrastructure', 'highways', 'building'],
      location: 'Hertfordshire, UK'
    },
    {
      id: '3',
      name: 'Morgan Sindall Group',
      employees: 8100,
      segment: 'Major contractor',
      keywords: ['construction', 'fit-out', 'regeneration'],
      location: 'London, UK'
    },
    {
      id: '4',
      name: 'Galliford Try',
      employees: 4100,
      segment: 'Major contractor',
      keywords: ['building', 'highways', 'environment'],
      location: 'Uxbridge, UK'
    },
    {
      id: '5',
      name: 'Costain Group',
      employees: 3100,
      segment: 'Major contractor',
      keywords: ['transportation', 'water', 'energy'],
      location: 'London, UK'
    },
    {
      id: '6',
      name: 'Laing O\'Rourke',
      employees: 10600,
      segment: 'Major contractor',
      keywords: ['large infrastructure', 'complex buildings', 'offsite'],
      location: 'Dartford, UK'
    },
    {
      id: '7',
      name: 'Skanska UK',
      employees: 3300,
      segment: 'Major contractor',
      keywords: ['infrastructure', 'commercial', 'green building'],
      location: 'Hertfordshire, UK'
    },
    {
      id: '8',
      name: 'BAM UK & Ireland',
      employees: 5100,
      segment: 'Major contractor',
      keywords: ['buildings', 'civil engineering', 'facilities management'],
      location: 'Hemel Hempstead, UK'
    },
    {
      id: '9',
      name: 'Barratt Redrow',
      employees: 6270,
      segment: 'Housebuilder',
      keywords: ['volume housebuilding', 'mixed-use', 'land development'],
      location: 'Coalville, UK'
    },
    {
      id: '10',
      name: 'Persimmon plc',
      employees: 4731,
      segment: 'Housebuilder',
      keywords: ['residential', 'private housing', 'partnerships'],
      location: 'York, UK'
    },
    {
      id: '11',
      name: 'Taylor Wimpey',
      employees: 4458,
      segment: 'Housebuilder',
      keywords: ['residential', 'masterplanned communities'],
      location: 'High Wycombe, UK'
    },
    {
      id: '12',
      name: 'Bellway plc',
      employees: 2659,
      segment: 'Housebuilder',
      keywords: ['housing developments', 'regional housebuilding'],
      location: 'Newcastle upon Tyne, UK'
    },
    {
      id: '13',
      name: 'Berkeley Group Holdings',
      employees: 2673,
      segment: 'Housebuilder',
      keywords: ['urban regeneration', 'high-density', 'mixed-use'],
      location: 'Cobham, UK'
    },
    {
      id: '14',
      name: 'Vistry Group',
      employees: 4587,
      segment: 'Housebuilder',
      keywords: ['housebuilding', 'partnerships', 'affordable housing'],
      location: 'Watford, UK'
    },
    {
      id: '15',
      name: 'Travis Perkins plc',
      employees: 17594,
      segment: 'Merchant / distributor',
      keywords: ['builders\' merchant', 'distribution', 'trade supply'],
      location: 'Northampton, UK'
    },
    {
      id: '16',
      name: 'Jewson (Stark Group)',
      employees: 3400,
      segment: 'Merchant / distributor',
      keywords: ['builders\' merchant', 'timber & materials', 'branch network'],
      location: 'Ipswich, UK'
    }
  ]

  // Extract unique values for filters
  const segments = Array.from(new Set(companies.map(c => c.segment)))
  const locations = Array.from(new Set(companies.map(c => c.location)))
  const employeeRanges = ['1-50', '51-200', '201-1000', '1001-5000', '5001-10000', '10000+']

  // Helper function to get employee range
  const getEmployeeRange = (count: number): string => {
    if (count <= 50) return '1-50'
    if (count <= 200) return '51-200'
    if (count <= 1000) return '201-1000'
    if (count <= 5000) return '1001-5000'
    if (count <= 10000) return '5001-10000'
    return '10000+'
  }

  // Filter companies based on search and filters
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchQuery === '' || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesSegment = selectedSegment === '' || company.segment === selectedSegment
    const matchesLocation = selectedLocation === '' || company.location === selectedLocation
    const matchesEmployeeRange = selectedEmployeeRange === '' || getEmployeeRange(company.employees) === selectedEmployeeRange

    return matchesSearch && matchesSegment && matchesLocation && matchesEmployeeRange
  })

  const clearFilters = () => {
    setSelectedSegment('')
    setSelectedLocation('')
    setSelectedEmployeeRange('')
    setSearchQuery('')
  }

  const hasActiveFilters = selectedSegment || selectedLocation || selectedEmployeeRange || searchQuery

  // Format employee count
  const formatEmployeeCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(2)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(3).replace(/\.?0+$/, '')}K`
    }
    return count.toLocaleString()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Import
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              + Add Company
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Filters:</span>
          
          {/* Segment Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSegmentDropdown(!showSegmentDropdown)
                setShowLocationDropdown(false)
                setShowEmployeeRangeDropdown(false)
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

          {/* Location Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown)
                setShowSegmentDropdown(false)
                setShowEmployeeRangeDropdown(false)
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

          {/* Employee Range Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowEmployeeRangeDropdown(!showEmployeeRangeDropdown)
                setShowSegmentDropdown(false)
                setShowLocationDropdown(false)
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                selectedEmployeeRange ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{selectedEmployeeRange || '# Employees'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showEmployeeRangeDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedEmployeeRange('')
                    setShowEmployeeRangeDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  All Sizes
                </button>
                {employeeRanges.map(range => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedEmployeeRange(range)
                      setShowEmployeeRangeDropdown(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {range} employees
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
          Showing <span className="font-semibold">{filteredCompanies.length}</span> of <span className="font-semibold">{companies.length}</span> companies
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Number of Employees</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Segment</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Keywords</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{company.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                  {formatEmployeeCount(company.employees)}
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {company.segment}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center flex-wrap gap-2">
                    {company.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        {keyword}
                      </span>
                    ))}
                    {company.keywords.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        +{company.keywords.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                  {company.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No companies found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  )
}

