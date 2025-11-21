'use client'

import { Sidebar } from '@/components/Sidebar'
import { ContactCard } from '@/components/ContactCard'
import { ActionTabs } from '@/components/ActionTabs'
import { ChevronLeft, ChevronDown, Edit2, MoreVertical, Building2, Calendar, DollarSign, User, Tag, Clock, FileText, Link as LinkIcon, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

// Mock deal data - in a real app this would come from an API
const mockDealData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Comprehensive renovation of institute buildings',
    subtitle: 'Universität Ulm - Festpunkt 025',
    company: 'Vermögen und Bau Baden-Württemberg, Amt Ulm',
    value: '€250,000',
    stage: 'Kontaktrecherche',
    status: 'healthy',
    owner: 'Sarah Mueller',
    createdDate: 'Oct 15, 2024',
    lastActivity: '2 hours ago',
    closeDate: 'Dec 31, 2024',
    probability: 35,
    tags: ['Public Sector', 'Large Project', 'Architecture'],
    description: 'A major refurbishment project is planned for the institute buildings at Albert-Einstein-Allee 11 in Ulm, known as "Universität Ulm - Sanierung von Institutsgebäuden - Festpunkt 025." The project involves comprehensive renovation work on multiple institute buildings to modernize facilities and improve energy efficiency.',
    architect: 'DEGLE.DEGLE Architekten',
  },
  '2': {
    id: '2',
    title: 'Office Building Modernization',
    subtitle: 'Tech Campus Berlin',
    company: 'Tech Corp GmbH',
    value: '€180,000',
    stage: 'Kontaktrecherche',
    status: 'healthy',
    owner: 'Michael Schmidt',
    createdDate: 'Nov 1, 2024',
    lastActivity: '1 day ago',
    closeDate: 'Feb 28, 2025',
    probability: 20,
    tags: ['Technology', 'Commercial'],
    description: 'Modern office building renovation project in Berlin Tech Campus. Focus on creating collaborative spaces and implementing sustainable building practices.',
    architect: 'Modern Design Studio',
  },
}

export default function DealDetailPage() {
  const params = useParams()
  const dealId = params.id as string
  const deal = mockDealData[dealId] || mockDealData['1'] // Fallback to deal 1 if not found
  const [sourcesExpanded, setSourcesExpanded] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'healthy': return 'bg-green-100 text-green-700 border-green-200'
      case 'slow-moving': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'paused': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/pipelines"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Pipeline</span>
            </Link>
            
            <div className="h-4 w-px bg-gray-300"></div>
            
            <button className="flex items-center space-x-2 text-gray-900">
              <span className="text-sm font-medium">Revenue Engineering</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Main Content Area with Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {/* Deal Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              {deal.title} &quot;{deal.subtitle}&quot; by {deal.architect}
            </h1>
            
            {/* Project Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Project Overview</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View all
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {deal.description}
              </p>
            </div>
            
            {/* Contacts Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Contacts</h2>
                <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium">Find or create</span>
                </button>
              </div>
              
              <ContactCard />
              
              {/* Action Tabs */}
              <ActionTabs />
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto p-6 space-y-6">
            {/* Stage Selector */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <button className="w-full flex items-center justify-between text-left">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Stage | {deal.stage}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Deal Owner */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deal Owner</span>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Change
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-pink-700">NC</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Natascha Christ</p>
                  <p className="text-xs text-gray-500">(you)</p>
                </div>
              </div>
            </div>
            
            {/* Project Scores */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button className="w-full flex items-center justify-between p-4 text-left">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Project Scores</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <div className="px-4 pb-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-orange-700">50% MEDIUM FIT</span>
                  <span className="text-2xl font-bold text-gray-900">1</span>
                </div>
              </div>
            </div>
            
            {/* Stage Objectives */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Stage Objectives</span>
                  <span className="text-sm text-gray-500">0/3</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Next Steps */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Next Steps</span>
                  <span className="text-sm text-gray-500">0</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Sources */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button 
                onClick={() => setSourcesExpanded(!sourcesExpanded)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Sources</span>
                  <span className="text-sm text-gray-500">5</span>
                </div>
                {sourcesExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {sourcesExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">Export MR_2025-11-07-10-57-50.xls...</p>
                      <p className="text-xs text-gray-500 mt-0.5">Added 21 Nov 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">degle-degle.de/schulen-und-...</p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <p className="text-xs text-gray-500">From 1 Jun 2024</p>
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">AI</span>
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-medium rounded">BETA</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

