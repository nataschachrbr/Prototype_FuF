'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ChevronDown, Grid3x3, List, Plus, Search } from 'lucide-react'
import Link from 'next/link'

interface Deal {
  id: string
  title: string
  company: string
  status: 'critical' | 'healthy' | 'slow-moving' | 'paused'
  stage: 'kontaktrecherche' | 'terminvereinbarung'
  value?: string
  progress?: number
}

// Shared dummy deals that line up with the companies/contacts you see
// on the People and Companies pages (UK construction ecosystem).
// 2 in Qualification, 4 in Outreach.
const mockDeals: Deal[] = [
  // Qualification (Kontaktrecherche)
  {
    id: '1',
    title: 'Liverpool Regeneration Project',
    company: 'Morgan Sindall Group',
    status: 'healthy',
    stage: 'kontaktrecherche',
    value: '£6.7M',
    progress: 35,
  },
  {
    id: '2',
    title: 'North East Housing Development',
    company: 'Bellway plc',
    status: 'slow-moving',
    stage: 'kontaktrecherche',
    value: '£4.4M',
    progress: 18,
  },

  // Outreach (Terminvereinbarung)
  {
    id: '3',
    title: 'HS2 Rail Infrastructure Package',
    company: 'Balfour Beatty',
    status: 'healthy',
    stage: 'terminvereinbarung',
    value: '£4.2M',
    progress: 55,
  },
  {
    id: '4',
    title: 'M25 Highways Upgrade',
    company: 'Kier Group',
    status: 'slow-moving',
    stage: 'terminvereinbarung',
    value: '£8.1M',
    progress: 42,
  },
  {
    id: '5',
    title: 'Healthcare Facilities Programme',
    company: 'Galliford Try',
    status: 'slow-moving',
    stage: 'terminvereinbarung',
    value: '£2.9M',
    progress: 48,
  },
  {
    id: '6',
    title: 'Universität Ulm – Sanierung Institutsgebäude',
    company: 'DEGLE.DEGLE Architekten',
    status: 'healthy',
    stage: 'terminvereinbarung',
    value: '€3.1M',
    progress: 30,
  },
]

export default function PipelinesPage() {
  const [selectedPipeline, setSelectedPipeline] = useState('Revenue Engineering')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const stages = [
    {
      id: 'kontaktrecherche',
      name: 'Qualification',
      deals: mockDeals.filter((d) => d.stage === 'kontaktrecherche'),
    },
    {
      id: 'terminvereinbarung',
      name: 'Outreach',
      deals: mockDeals.filter((d) => d.stage === 'terminvereinbarung'),
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-200 border-red-300'
      case 'healthy': return 'bg-indigo-200 border-indigo-300'
      case 'slow-moving': return 'bg-yellow-200 border-yellow-300'
      case 'paused': return 'bg-purple-200 border-purple-300'
      default: return 'bg-gray-200 border-gray-300'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'healthy': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'slow-moving': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'paused': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const statusCounts = {
    overdue: mockDeals.filter((d) => d.progress && d.progress < 20).length,
    slowMoving: mockDeals.filter((d) => d.status === 'slow-moving').length,
    readyToReactivate: mockDeals.filter((d) => d.status === 'paused').length,
    noNextStep: mockDeals.filter((d) => !d.progress || d.progress === 0).length,
  }

  const stageStats = stages.map(stage => {
    const deals = stage.deals
    const inStage = deals.length
    const progressed = deals.filter(d => d.progress && d.progress > 50).length
    const disqualified = deals.filter(d => d.status === 'critical' && d.progress && d.progress < 10).length
    
    return {
      ...stage,
      inStage,
      progressed,
      disqualified,
      goalProgress: deals.length > 0 ? Math.round((progressed / deals.length) * 100) : 0,
    }
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-lg font-semibold text-gray-900">Pipelines</span>
              </div>
              
              <div className="h-4 w-px bg-gray-300"></div>
              
              <button className="flex items-center space-x-2 text-gray-900 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
                <span className="text-sm font-medium">{selectedPipeline}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Quick link to the Deal Stage Outreach digest email prototype */}
              <Link
                href="/pipelines/deals-stages"
                className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 border border-indigo-200 text-xs font-medium text-indigo-700 rounded-lg bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-colors"
              >
                <span>Open Deal Stage Outreach digest</span>
              </Link>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search your deal"
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                />
              </div>
              
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid3x3 className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Deal</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Status Pills */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-3">
            <button className="px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors flex items-center space-x-2">
              <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{statusCounts.overdue}</span>
              <span>Next step overdue</span>
            </button>
            
            <button className="px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium hover:bg-yellow-200 transition-colors flex items-center space-x-2">
              <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{statusCounts.slowMoving}</span>
              <span>Slow moving</span>
            </button>
            
            {statusCounts.readyToReactivate > 0 && (
              <button className="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium hover:bg-purple-200 transition-colors flex items-center space-x-2">
                <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{statusCounts.readyToReactivate}</span>
                <span>Ready to reactivate</span>
              </button>
            )}
            
            {statusCounts.noNextStep > 0 && (
              <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <span className="bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{statusCounts.noNextStep}</span>
                <span>Has no next step</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Pipeline Stages */}
              <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-50">
          <div className="flex h-full p-6 space-x-6 min-w-max">
            {stageStats.map((stage) => (
              <div key={stage.id} className="flex flex-col w-96 bg-white rounded-lg border border-gray-200 overflow-visible">
                {/* Stage Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 className="text-base font-semibold text-gray-900">{stage.name}</h2>
                  </div>
                  
                  {/* Goal Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">1 Goal</span>
                      <span className="font-medium text-gray-900">{stage.inStage > 0 ? `${stage.goalProgress}%` : '0%'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(stage.goalProgress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">In Stage</div>
                        <div className="font-semibold text-gray-900">{stage.inStage}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Progressed</div>
                        <div className="font-semibold text-gray-900">{stage.progressed}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Disqualified</div>
                        <div className="font-semibold text-gray-900">{stage.disqualified}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Deal Tiles */}
                <div className="flex-1 overflow-y-auto overflow-x-visible p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {stage.deals.map((deal) => {
                      const href =
                        stage.id === 'kontaktrecherche'
                          ? `/pipelines/deals/${deal.id}`
                          : `/pipelines/deals-stages/${deal.id}`

                      return (
                        <div key={deal.id} className="group static">
                          <Link
                            href={href}
                            className={`block w-12 h-12 rounded border-2 ${getStatusColor(
                              deal.status,
                            )} transition-all cursor-pointer`}
                          >
                          {/* Default state - just small colored tile */}
                          <div className="w-full h-full flex items-center justify-center">
                            {deal.progress !== undefined && deal.progress < 10 && (
                              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          </Link>
                        
                          {/* Hover state - large detailed card - positioned fixed to escape overflow */}
                          <div className="fixed left-auto w-80 bg-white rounded-lg border-2 border-gray-300 shadow-2xl p-5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-[100] mt-2">
                          <div className="space-y-4">
                            {/* Title and Status */}
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-base font-bold text-gray-900 flex-1 pr-2">
                                  {deal.title}
                                </h3>
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(deal.status)} flex-shrink-0`}>
                                  {deal.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{deal.company}</p>
                            </div>
                            
                            {/* User info */}
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-semibold text-pink-700">NC</span>
                              </div>
                              <span className="text-sm text-gray-700">Natascha Christ (you)</span>
                            </div>
                            
                            {/* Value and Progress */}
                            {deal.value && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600">Deal Value</span>
                                  <span className="text-lg font-bold text-gray-900">{deal.value}</span>
                                </div>
                                {deal.progress !== undefined && (
                                  <>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                      <div 
                                        className="bg-indigo-600 h-2 rounded-full transition-all" 
                                        style={{ width: `${deal.progress}%` }}
                                      ></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Progress</span>
                                      <span className="text-xs font-semibold text-gray-700">{deal.progress}%</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                            
                            {/* Stage Info */}
                            <div className="pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Current Stage</span>
                                <span className="font-semibold text-gray-900">{stage.name}</span>
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 border-2 border-red-300 rounded"></div>
              <span className="text-gray-600">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-200 border-2 border-indigo-300 rounded"></div>
              <span className="text-gray-600">Healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-300 rounded"></div>
              <span className="text-gray-600">Slow moving</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-200 border-2 border-purple-300 rounded"></div>
              <span className="text-gray-600">Paused</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

