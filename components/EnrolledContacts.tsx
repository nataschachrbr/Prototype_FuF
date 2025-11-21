'use client'

import { useState } from 'react'
import { ExternalLink, Building2, Search, MoreVertical, UserX } from 'lucide-react'

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
}

export function EnrolledContacts({ sequenceId }: EnrolledContactsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showMenu, setShowMenu] = useState<string | null>(null)

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Joachim Hofmann',
      company: 'Vermögen und Bau Baden-Württemberg',
      dealName: 'University Project',
      dealLink: '#',
      currentStep: 'Email sent - waiting for response',
      stepNumber: 2,
      totalSteps: 5,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Müller',
      company: 'Tech Solutions GmbH',
      dealName: 'Software Implementation',
      dealLink: '#',
      currentStep: 'Initial contact made',
      stepNumber: 1,
      totalSteps: 5,
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Schmidt',
      company: 'Innovation Labs',
      dealName: 'Consulting Services',
      dealLink: '#',
      currentStep: 'Follow-up scheduled',
      stepNumber: 3,
      totalSteps: 5,
      status: 'active'
    },
    {
      id: '4',
      name: 'Anna Weber',
      company: 'Digital Dynamics',
      dealName: 'Marketing Campaign',
      dealLink: '#',
      currentStep: 'Completed all steps',
      stepNumber: 5,
      totalSteps: 5,
      status: 'completed'
    },
  ]

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Enrolled Contacts</h3>
            <p className="text-xs text-gray-500 mt-1">{filteredContacts.length} contacts in this sequence</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            Add Contacts
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Step
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-indigo-600">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 line-clamp-1">{contact.company}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={contact.dealLink}
                    className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <span>{contact.dealName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">{contact.currentStep}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(contact.stepNumber, contact.totalSteps)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {contact.stepNumber}/{contact.totalSteps}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === contact.id ? null : contact.id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
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
      </div>
    </div>
  )
}

