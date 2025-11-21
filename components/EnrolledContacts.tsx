'use client'

import { useState } from 'react'
import { ExternalLink, Building2, MoreVertical, UserX } from 'lucide-react'

interface Contact {
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

interface EnrolledContactsProps {
  sequenceId: string | null
  enrolledCount: number
}

// Store contacts per sequence
const sequenceContactsMap: { [key: string]: Contact[] } = {
  '1': [ // Major Projects Outreach
    {
      id: '1',
      name: 'James Robertson',
      company: 'Balfour Beatty',
      dealName: 'HS2 Rail Infrastructure Package',
      dealLink: '/deals/deal-001',
      currentStep: 'Initial meeting scheduled',
      stepNumber: 2,
      totalSteps: 5,
      status: 'active'
    },
    {
      id: '6',
      name: 'Sophie Turner',
      company: 'Laing O\'Rourke',
      dealName: 'London Gateway Port Expansion',
      dealLink: '/deals/deal-006',
      currentStep: 'Initial contact made',
      stepNumber: 1,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '2': [ // Standard Outreach
    {
      id: '2',
      name: 'Sarah Mitchell',
      company: 'Kier Group',
      dealName: 'M25 Highways Upgrade',
      dealLink: '/deals/deal-002',
      currentStep: 'Email sent - waiting for response',
      stepNumber: 2,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '3': [ // Procurement Outreach
    {
      id: '3',
      name: 'Thomas Harrison',
      company: 'Morgan Sindall Group',
      dealName: 'Liverpool Regeneration Project',
      dealLink: '/deals/deal-003',
      currentStep: 'Follow-up call completed',
      stepNumber: 3,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '4': [ // Healthcare Sector Focus
    {
      id: '4',
      name: 'Emily Davies',
      company: 'Galliford Try',
      dealName: 'Healthcare Facilities Programme',
      dealLink: '/deals/deal-004',
      currentStep: 'Proposal submitted',
      stepNumber: 4,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '5': [ // Energy & Water Focus
    {
      id: '5',
      name: 'Michael O\'Connor',
      company: 'Costain Group',
      dealName: 'Thames Water Infrastructure',
      dealLink: '/deals/deal-005',
      currentStep: 'Contract negotiation',
      stepNumber: 5,
      totalSteps: 5,
      status: 'completed'
    },
  ],
  '6': [ // Facilities Management Focus
    {
      id: '8',
      name: 'Rachel Williams',
      company: 'BAM UK & Ireland',
      dealName: 'University Campus FM Contract',
      dealLink: '/deals/deal-008',
      currentStep: 'Site visit arranged',
      stepNumber: 3,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '7': [ // Housing Development Outreach
    {
      id: '9',
      name: 'Oliver Bennett',
      company: 'Barratt Redrow',
      dealName: 'Cambridge New Town Development',
      dealLink: '/deals/deal-009',
      currentStep: 'Planning approval support',
      stepNumber: 4,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '8': [ // Partnership Outreach
    {
      id: '10',
      name: 'Charlotte Brown',
      company: 'Persimmon plc',
      dealName: 'Affordable Housing Partnership',
      dealLink: '/deals/deal-010',
      currentStep: 'Partnership agreement drafted',
      stepNumber: 4,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '9': [ // Technical Specification Focus
    {
      id: '12',
      name: 'Lucy Anderson',
      company: 'Bellway plc',
      dealName: 'North East Housing Development',
      dealLink: '/deals/deal-012',
      currentStep: 'Technical review meeting',
      stepNumber: 2,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '10': [ // Urban Development Outreach
    {
      id: '13',
      name: 'Henry Clarke',
      company: 'Berkeley Group Holdings',
      dealName: 'Canary Wharf Mixed-Use Tower',
      dealLink: '/deals/deal-013',
      currentStep: 'Design consultation phase',
      stepNumber: 3,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '11': [ // Supply Chain Outreach
    {
      id: '15',
      name: 'George Patterson',
      company: 'Travis Perkins plc',
      dealName: 'National Supply Partnership',
      dealLink: '/deals/deal-015',
      currentStep: 'Pricing proposal submitted',
      stepNumber: 4,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '12': [ // Distribution Network Focus
    {
      id: '16',
      name: 'Victoria Hughes',
      company: 'Jewson (Stark Group)',
      dealName: 'Regional Distribution Agreement',
      dealLink: '/deals/deal-016',
      currentStep: 'Initial meeting completed',
      stepNumber: 2,
      totalSteps: 5,
      status: 'active'
    },
  ],
  '13': [ // Fit-Out Specialists
    {
      id: '18',
      name: 'Grace Robinson',
      company: 'Morgan Sindall Group',
      dealName: 'Birmingham City Centre Fit-Out',
      dealLink: '/deals/deal-018',
      currentStep: 'Detailed quotation phase',
      stepNumber: 3,
      totalSteps: 5,
      status: 'active'
    },
  ]
}

export function EnrolledContacts({ sequenceId, enrolledCount }: EnrolledContactsProps) {
  const [showMenu, setShowMenu] = useState<string | null>(null)

  // Get contacts for current sequence
  const contacts = sequenceId && sequenceContactsMap[sequenceId] ? sequenceContactsMap[sequenceId] : []

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'paused':
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getProgressPercentage = (stepNumber: number, totalSteps: number) => {
    return (stepNumber / totalSteps) * 100
  }

  if (!sequenceId) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-sm text-gray-500">Select a sequence to view enrolled contacts</p>
      </div>
    )
  }

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Compact Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Enrolled Contacts</h3>
            <p className="text-xs text-gray-500">{contacts.length} contacts in this sequence</p>
          </div>
          <button className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
            Add Contacts
          </button>
        </div>
      </div>

      {/* Table or Empty State */}
      <div className="flex-1 overflow-auto">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No contacts enrolled yet</h3>
            <p className="text-xs text-gray-500 mb-4">Add contacts to this sequence to start engaging with them</p>
            <button className="px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              Add Contacts
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deal
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Step
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-indigo-600">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs font-medium text-gray-900">{contact.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700 line-clamp-1">{contact.company}</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <a
                    href={contact.dealLink}
                    className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    <span>{contact.dealName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="px-4 py-2">
                  <div className="text-xs text-gray-700">{contact.currentStep}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[80px]">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(contact.stepNumber, contact.totalSteps)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {contact.stepNumber}/{contact.totalSteps}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === contact.id ? null : contact.id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>
                    
                    {showMenu === contact.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                          <ExternalLink className="w-4 h-4" />
                          <span>View Contact</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                          <UserX className="w-4 h-4" />
                          <span>Remove from Sequence</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}

