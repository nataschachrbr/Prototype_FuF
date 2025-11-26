'use client'

import { Sidebar } from '@/components/Sidebar'
import { ContactCard } from '@/components/ContactCard'
import { ActivityFeed, ActivityEvent } from '@/components/ActivityFeed'
import { ChevronLeft, ChevronDown, Edit2, MoreVertical, Building2, Calendar, DollarSign, User, Tag, Clock, FileText, Link as LinkIcon, ChevronUp, Send, Phone, Zap } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

// Types for sequence recommendation
interface ContactInfo {
  role: string // e.g., 'architect', 'tga-planner', 'general-contractor', 'subcontractor'
  name: string
}

interface ProjectInfo {
  phase: string // e.g., 'design-phase', 'detail-planning', 'tender-phase', 'execution'
  productType: string // e.g., 'facade', 'interior', 'windows', 'doors'
}

// Smart sequence recommendation based on role, phase, and product type
function getRecommendedSequence(contact: ContactInfo, project: ProjectInfo): {
  name: string
  reason: string
  overview: string[]
} {
  const { role, name } = contact
  const { phase, productType } = project
  
  // Logic for sequence selection based on role + phase + product combinations
  
  // Architect in early design phase for facade
  if (role === 'architect' && phase === 'design-phase' && productType === 'facade') {
    return {
      name: 'Architect Early Spec - Facade Systems',
      reason: 'This project targets architects in early design phase. This sequence introduces façade systems at the optimal specification moment, increasing adoption likelihood.',
      overview: [
        '5 touchpoints over 3 weeks',
        'Focus on technical specifications and design integration',
        'Automated follow-ups with personalization'
      ]
    }
  }
  
  // TGA Planner in detail planning for HVAC integration
  if (role === 'tga-planner' && phase === 'detail-planning') {
    return {
      name: 'Technical Specification Focus',
      reason: 'TGA planners in detail planning need precise technical specifications. This sequence emphasizes product compatibility and system integration.',
      overview: [
        '4 touchpoints over 2 weeks',
        'Technical documentation and CAD files included',
        'Focus on building physics and energy efficiency'
      ]
    }
  }
  
  // General contractor in tender phase
  if (role === 'general-contractor' && phase === 'tender-phase') {
    return {
      name: 'Procurement Outreach',
      reason: 'General contractors in tender phase focus on cost, delivery, and execution certainty. This sequence provides pricing, references, and project support.',
      overview: [
        '3 touchpoints over 10 days',
        'Pricing transparency and delivery guarantees',
        'Reference projects and execution support'
      ]
    }
  }
  
  // Subcontractor in execution phase
  if (role === 'subcontractor' && phase === 'execution') {
    return {
      name: 'Partnership Outreach',
      reason: 'Subcontractors in execution need fast delivery, installation support, and technical backup. This sequence emphasizes reliability and service.',
      overview: [
        '3 touchpoints over 1 week',
        'Fast-track delivery options highlighted',
        'Installation training and on-site support offered'
      ]
    }
  }
  
  // Default for major projects
  return {
    name: 'Major Projects Outreach',
    reason: 'This is a comprehensive sequence suitable for complex projects with multiple stakeholders. It covers specification, design integration, and execution support.',
    overview: [
      '6 touchpoints over 4 weeks',
      'Multi-phase engagement strategy',
      'Tailored content for different project stages'
    ]
  }
}

// Mock deal data - in a real app this would come from an API
const mockDealData: Record<string, any> = {
  // Deal 1 – Liverpool Regeneration Project (Morgan Sindall Group / Thomas Harrison)
  '1': {
    id: '1',
    title: 'Liverpool Regeneration Project',
    subtitle: 'City centre mixed-use regeneration',
    company: 'Morgan Sindall Group',
    value: '£6,700,000',
    stage: 'Qualification',
    status: 'healthy',
    owner: 'Emma Thompson',
    createdDate: 'Jan 15, 2025',
    lastActivity: '2 hours ago',
    closeDate: 'Oct 31, 2025',
    probability: 35,
    tags: ['Urban regeneration', 'Major contractor', 'Mixed-use'],
    description:
      'Large-scale regeneration of central Liverpool including commercial, residential, and public realm works. Early-stage discussions around envelope performance, phasing, and logistics are underway.',
    architect: 'To be confirmed',
    // Contact and project info for sequence recommendation
    contact: {
      role: 'head-of-procurement',
      name: 'Thomas Harrison',
      company: 'Morgan Sindall Group',
    },
    project: {
      phase: 'design-phase',
      productType: 'facade',
    },
  },

  // Deal 2 – North East Housing Development (Bellway plc / Lucy Anderson)
  '2': {
    id: '2',
    title: 'North East Housing Development',
    subtitle: 'Regional residential scheme',
    company: 'Bellway plc',
    value: '£4,400,000',
    stage: 'Qualification',
    status: 'slow-moving',
    owner: 'David Clarke',
    createdDate: 'Jan 22, 2025',
    lastActivity: '3 days ago',
    closeDate: 'Dec 15, 2025',
    probability: 20,
    tags: ['Residential', 'Housebuilder', 'Specification'],
    description:
      'New-build housing development in the North East region. Site strategy is confirmed, but technical specification and supplier selection are still open.',
    architect: 'Not yet known',
    architectUnknown: true,
    // Contact and project info for sequence recommendation
    contact: {
      role: 'technical-director',
      name: 'Lucy Anderson',
      company: 'Bellway plc',
    },
    project: {
      phase: 'design-phase',
      productType: 'facade',
    },
  },
}

export default function DealDetailPage() {
  const params = useParams()
  const dealId = params.id as string
  const deal = mockDealData[dealId] || mockDealData['1'] // Fallback to deal 1 if not found
  const [sourcesExpanded, setSourcesExpanded] = useState(true)
  const [readinessExpanded, setReadinessExpanded] = useState(false)
  const [nextStepsExpanded, setNextStepsExpanded] = useState(false)
  
  // Mock readiness state - would come from API in real app
  // Deal 2 starts as not ready (architect unknown), Deal 1 starts ready
  const [isReady, setIsReady] = useState(dealId === '2' ? false : true)
  const [hasActiveSequence, setHasActiveSequence] = useState(false)
  const [readinessScore, setReadinessScore] = useState(dealId === '2' ? 35 : 62)
  const [architectKnown, setArchitectKnown] = useState(dealId !== '2')
  
  // Activity feed state - in-memory array of events
  // Different initial events based on deal ID
  const getInitialEvents = (): ActivityEvent[] => {
    if (dealId === '2') {
      return [
        {
          id: '1',
          type: 'project_event',
          title: 'Project identified via Building Radar',
          description: 'New office campus development detected through building radar monitoring. Project is in very early design phase, potentially in conceptual planning.',
          timestamp: new Date('2024-11-18T10:15:00'),
          user: 'System',
        },
        {
          id: '2',
          type: 'project_event',
          title: 'Building owner and investor identified',
          description: 'Meridian Properties Group (building owner) and Pinnacle Capital Partners (investor) identified as primary stakeholders. Architect has not been appointed yet.',
          timestamp: new Date('2024-11-18T10:20:00'),
          user: 'System',
        },
        {
          id: '3',
          type: 'manual_comment',
          title: 'Comment added',
          description: 'Project is very early stage. Architect has not been appointed yet. For a facade company, outreach only makes sense once the architect is known, as they are the key decision-maker for product specifications.',
          timestamp: new Date('2024-11-19T14:25:00'),
          user: 'Natascha Christ',
        },
      ]
    }
    
    // Default events for deal 1
    return [
      {
        id: '1',
        type: 'project_event',
        title: 'Project created',
        description: 'Deal created from tender monitoring system. Initial project phase identified as design phase.',
        timestamp: new Date('2024-11-20T14:30:00'),
        user: 'System',
      },
      {
        id: '2',
        type: 'project_event',
        title: 'Contact identified',
        description: 'Primary contact Joachim Hofmann (Head of Structural Engineering) identified from project documentation.',
        timestamp: new Date('2024-11-20T14:35:00'),
        user: 'System',
      },
      {
        id: '3',
        type: 'manual_comment',
        title: 'Comment added',
        description: 'Die Fertigstellung der Multifunktionsarena in Würzburg ist für das Jahr 2028 geplant. Der Stadtrat hat im Juni 2025 den Bedingungen zum Kauf des Grundstücks zugestimmt, sodass der Baubeginn voraussichtlich Anfang 2026 erfolgen kann.',
        timestamp: new Date('2024-11-22T15:34:00'),
        user: 'Max Hentschel',
      },
      {
        id: '4',
        type: 'project_event',
        title: 'Architect firm identified',
        description: 'Architecture firm DEGLE.DEGLE Architekten confirmed as project architect. Known for sustainable building design.',
        timestamp: new Date('2024-11-23T09:15:00'),
        user: 'System',
      },
    ]
  }
  
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(getInitialEvents())
  
  // Function to add a new event to the activity feed
  const addActivityEvent = (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newEvent: ActivityEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    }
    setActivityEvents(prev => [newEvent, ...prev])
  }
  
  // Get recommended sequence based on contact role, project phase, and product type
  const recommendedSequence = getRecommendedSequence(
    deal.contact || { role: 'architect', name: 'Contact' },
    deal.project || { phase: 'design-phase', productType: 'facade' }
  )
  
  // Handler for starting sequence
  const handleStartSequence = () => {
    console.log(`Starting sequence: ${recommendedSequence.name}`)
    setHasActiveSequence(true)
    
    // Add sequence event to activity feed
    addActivityEvent({
      type: 'sequence_event',
      title: 'Sequence started',
      description: `${deal.contact?.name || 'Contact'} enrolled in sequence: "${recommendedSequence.name}"`,
      user: 'Natascha Christ',
    })
    
    // Simulate first email being sent after 2 seconds
    setTimeout(() => {
      addActivityEvent({
        type: 'email_event',
        title: 'Email sent',
        description: `Outreach email sent to ${deal.contact?.name || 'Contact'}`,
        emailPreview: 'Dear Joachim, I hope this message finds you well. I wanted to reach out regarding façade system options for your upcoming project at Universität Ulm...',
        user: 'System',
      })
    }, 2000)
    
    // In a real app, this would call an API to enroll the contact in the sequence
  }
  
  // Handler for adding manual comments
  const handleAddComment = (comment: string) => {
    addActivityEvent({
      type: 'manual_comment',
      title: 'Comment added',
      description: comment,
      user: 'Natascha Christ',
    })
  }
  
  // Mock function to simulate architect becoming known (for Deal 2)
  const simulateArchitectKnown = () => {
    if (dealId === '2' && !architectKnown) {
      // Update state immediately for architect
      setArchitectKnown(true)
      
      // Update deal data with architect information
      deal.architect = 'Sterling Design Group'
      deal.architectUnknown = false
      deal.contact = {
        role: 'architect',
        name: 'Michael Stevens'
      }
      
      // First event: Architect firm identified
      addActivityEvent({
        type: 'project_event',
        title: 'Architect firm appointed',
        description: 'Architecture firm "Sterling Design Group" has been appointed as project architect. Firm specializes in modern commercial office buildings and sustainable design.',
        user: 'System',
      })
      
      // Second event: Architect contact identified
      setTimeout(() => {
        addActivityEvent({
          type: 'project_event',
          title: 'Architect contact identified',
          description: 'Primary architect contact identified: Michael Stevens (Lead Architect). Contact information verified and added to CRM.',
          user: 'System',
        })
        
        // Third event: Project becomes ready
        setTimeout(() => {
          setIsReady(true)
          setReadinessScore(82)
          addActivityEvent({
            type: 'project_event',
            title: 'Project became Ready for Outreach',
            description: 'Outreach Readiness Score increased to 82%. Key stakeholder (architect) identified. Project is now ready for targeted outreach.',
            user: 'System',
          })
        }, 1500)
      }, 1000)
    } else if (!isReady && dealId !== '2') {
      // For other deals, use generic readiness change
      setIsReady(true)
      setReadinessScore(78)
      addActivityEvent({
        type: 'project_event',
        title: 'Project became Ready for Outreach',
        description: 'Outreach Readiness Score increased to 78%. Key stakeholder (architect) identified and project phase progression detected. Project is now ready for outreach.',
        user: 'System',
      })
    }
  }
  
  // Mock function to simulate phase change
  const simulatePhaseChange = (newPhase: string) => {
    addActivityEvent({
      type: 'project_event',
      title: 'Project phase changed',
      description: `Project phase updated to ${newPhase}. Timeline and stakeholder priorities adjusted accordingly.`,
      user: 'System',
    })
  }
  
  // Mock function to simulate stakeholder addition
  const simulateStakeholderAdded = (stakeholderName: string, role: string) => {
    addActivityEvent({
      type: 'project_event',
      title: 'New stakeholder added',
      description: `${stakeholderName} (${role}) added to project team. Contact information verified.`,
      user: 'Natascha Christ',
    })
  }
  
  // Mock function to simulate tender update
  const simulateTenderUpdate = () => {
    addActivityEvent({
      type: 'project_event',
      title: 'Tender information updated',
      description: 'New tender documentation released. Submission deadline: December 15, 2024. Budget confirmed at €250,000.',
      user: 'System',
    })
  }
  
  // Mock function to simulate email reply
  const simulateEmailReply = () => {
    const contactName = deal.contact?.name || 'Contact'
    const emailContent = dealId === '2' 
      ? 'Thank you for reaching out. We are currently in the early planning phase and evaluating various façade systems for the Westside Business District project. Your products look interesting. Could we schedule a call next week to discuss specifications?'
      : 'Thank you for reaching out. We are indeed in the early design phase and would be interested in learning more about your façade systems. Could we schedule a call next week?'
    
    addActivityEvent({
      type: 'email_event',
      title: 'Email reply received',
      description: `Reply received from ${contactName}`,
      emailPreview: emailContent,
      user: 'System',
    })
  }
  
  // Mock function to simulate sequence step completion
  const simulateSequenceStepComplete = (stepNumber: number, stepName: string) => {
    addActivityEvent({
      type: 'sequence_event',
      title: `Sequence step ${stepNumber} completed`,
      description: `Step "${stepName}" completed successfully for ${deal.contact?.name || 'Contact'}.`,
      user: 'System',
    })
  }

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
              {deal.title} {deal.subtitle && `"${deal.subtitle}"`}
              {dealId === '2' ? (
                architectKnown ? (
                  <span> by {deal.architect}</span>
                ) : (
                  <span className="text-gray-500"> · Architect not yet appointed</span>
                )
              ) : (
                <span> by {deal.architect}</span>
              )}
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
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Contacts</h2>
                <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium">Find or create</span>
                </button>
              </div>
              
              {dealId === '2' && architectKnown ? (
                /* Show architect contact for Deal 2 after architect becomes known */
                <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-semibold text-indigo-700">MS</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Michael Stevens</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded border border-green-200">
                          NEW
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Lead Architect · Principal</p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">Sterling Design Group</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href="mailto:m.stevens@sterlingdesign.com" className="text-indigo-600 hover:text-indigo-700">
                            m.stevens@sterlingdesign.com
                          </a>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a href="tel:+4989765432" className="text-indigo-600 hover:text-indigo-700">
                            +49 89 765432
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : dealId !== '2' ? (
                <ContactCard />
              ) : null}
            </div>
            
            {/* Companies Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Companies</h2>
              </div>
              
              {dealId === '2' ? (
                /* Deal 2: Show Building Owner and Investor */
                <div className="space-y-4">
                  {/* Building Owner Company */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-blue-600">MP</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">Meridian Properties Group</h3>
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Building Owner · No contacts</p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 text-sm text-gray-700">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span>Real Estate Development</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-700">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span>Building Owner</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Investor Company */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-green-600">PC</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">Pinnacle Capital Partners</h3>
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Investor · No contacts</p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 text-sm text-gray-700">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span>Investment & Finance</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-700">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span>Investor</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Architect Company - shown when architect becomes known */}
                  {architectKnown && (
                    <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-semibold text-indigo-600">SD</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">Sterling Design Group</h3>
                            <FileText className="w-4 h-4 text-gray-400" />
                            <Zap className="w-4 h-4 text-purple-500" />
                          </div>
                          <p className="text-sm text-indigo-600 mb-4">Architecture · 1 contact</p>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm text-gray-700">
                              <Building2 className="w-4 h-4 text-gray-500" />
                              <span>Architecture & Design</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-700">
                              <Tag className="w-4 h-4 text-gray-500" />
                              <span>Architect</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-3">
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Default company card for other deals */
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    {/* Company Avatar */}
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-red-600">P</span>
                    </div>
                    
                    {/* Company Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{deal.company}</h3>
                        <FileText className="w-4 h-4 text-gray-400" />
                        <Zap className="w-4 h-4 text-purple-500" />
                      </div>
                      
                      <p className="text-sm text-red-600 mb-4">1 contact(s)</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span>Public Administration</span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">vermoegenundbau-bw.de</span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a href="tel:0731/50-28900" className="text-indigo-600 hover:text-indigo-700">0731/50-28900</a>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>Public Sector</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                        <User className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Activity Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <ActivityFeed 
                events={activityEvents}
                onAddComment={handleAddComment}
              />
            </div>
            
            {/* Deal Information Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Deal Information</h2>
              
              <div className="space-y-6">
                {/* Deal Name */}
                <div className="flex items-start space-x-4">
                  <FileText className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deal name</label>
                    <input 
                      type="text"
                      value={deal.title}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-900"
                    />
                  </div>
                </div>
                
                {/* Deal Owner */}
                <div className="flex items-start space-x-4">
                  <User className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deal owner</label>
                    <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-pink-700">NC</span>
                        </div>
                        <span className="text-sm text-gray-900">Natascha Christ</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Estimated Deal Value */}
                <div className="flex items-start space-x-4">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated deal value</label>
                    <input 
                      type="text"
                      value={deal.value}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-900"
                    />
                  </div>
                </div>
                
                {/* Deal Notes */}
                <div className="flex items-start space-x-4">
                  <FileText className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deal notes</label>
                    <textarea 
                      value={deal.description}
                      readOnly
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-900 leading-relaxed resize-none"
                    />
                  </div>
                </div>
                
                {/* Meeting Date */}
                <div className="flex items-start space-x-4">
                  <Calendar className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Termin mit Entscheider</label>
                    <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-400">Termin mit Entscheider...</span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
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
            
            {/* Project Outreach Readiness */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Project Outreach Readiness
              </h3>
              
              {/* Readiness Score */}
              <div className="mb-3">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{readinessScore}%</span>
                  <span className="text-sm font-medium text-gray-500">Readiness Score</span>
                </div>
              </div>
              
              {/* Status Label */}
              <div className="mb-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold ${
                  isReady 
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {isReady ? 'Ready for Outreach' : 'Not Ready'}
                </span>
              </div>
              
              {/* Explanation */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isReady 
                    ? 'Project phase and stakeholder alignment indicates optimal timing for outreach. All key criteria met.'
                    : dealId === '2' && !architectKnown
                    ? 'The architect has not been appointed yet. For a facade company, the architect is the key decision-maker for product specifications. Outreach should wait until the architect is known.'
                    : 'The project is still in early concept phase; architects are not specifying facade systems yet.'
                  }
                </p>
              </div>
              
              {/* Demo Button - simulate readiness change */}
              {!isReady && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={simulateArchitectKnown}
                    className="w-full px-3 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded border border-indigo-200 transition-colors"
                  >
                    {dealId === '2' 
                      ? '🔄 Simulate: Architect becomes known'
                      : '🔄 Simulate: Project becomes ready'
                    }
                  </button>
                </div>
              )}
              
              {/* Readiness Breakdown */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setReadinessExpanded(!readinessExpanded)}
                  className="w-full flex items-center justify-between mb-4 text-left hover:opacity-70 transition-opacity"
                >
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Readiness Breakdown
                  </h4>
                  {readinessExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                
                {readinessExpanded && (
                  <>
                    <div className="space-y-4">
                      {/* Project Phase Fit */}
                      <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Project Phase Fit</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                        dealId === '2' && !architectKnown
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {dealId === '2' && !architectKnown ? 'Low' : 'Medium'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {dealId === '2' && !architectKnown
                        ? 'Project is in very early design phase. Architect appointment is pending.'
                        : 'Project is in early design; product specification has not started yet.'}
                    </p>
                  </div>
                  
                  {/* Stakeholder Role Match */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Stakeholder Role Match</span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                        Low
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {dealId === '2' && !architectKnown
                        ? 'Architect not yet appointed. For facade products, architect is the key decision-maker and must be known before outreach.'
                        : 'Current contact is a structural engineer; architect not identified yet.'}
                    </p>
                  </div>
                  
                  {/* Product Timing Fit */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Product Timing Fit</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                        dealId === '2' && !architectKnown
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {dealId === '2' && !architectKnown ? 'Medium' : 'High'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {dealId === '2' && !architectKnown
                        ? 'Façade systems are decided early in design, but timing depends on architect appointment.'
                        : 'Façade systems are typically decided in early design; timing is favorable.'}
                    </p>
                  </div>
                  
                  {/* Manufacturer Profile Fit */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Manufacturer Profile Fit</span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        High
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Premium façade manufacturer—early specification increases win likelihood.
                    </p>
                  </div>
                  
                  {/* Recent Project Events */}
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Recent Project Events</span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        Neutral
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      No recent tender updates or phase changes detected.
                    </p>
                  </div>
                </div>
                
                    {/* Summary Line */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 italic text-center">
                        These factors combine into the {readinessScore}% Outreach Readiness Score.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Next Steps - Dynamic based on readiness */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setNextStepsExpanded(!nextStepsExpanded)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Next Steps</span>
                </div>
                {nextStepsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {/* Always visible summary */}
              <div className="px-4 pb-4">
                {!isReady ? (
                  /* NOT READY STATE - Summary */
                  <p className="text-sm text-gray-600">
                    There are no next steps right now.
                  </p>
                ) : !hasActiveSequence ? (
                  /* READY & NO ACTIVE SEQUENCE STATE - Summary */
                  <div className="space-y-3">
                    <button 
                      onClick={handleStartSequence}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Add contact to sequence & start outreach</span>
                    </button>
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                      <p className="text-sm text-indigo-900">
                        <span className="font-semibold">Recommended sequence:</span>
                      </p>
                      <p className="text-sm text-indigo-700 mt-1">
                        {recommendedSequence.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* ACTIVE SEQUENCE STATE - Summary */
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <Send className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-semibold text-green-900">
                          Sequence Active
                        </p>
                      </div>
                      <p className="text-sm text-green-700">
                        {deal.contact?.name || 'Contact'} enrolled in {recommendedSequence.name}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Expandable Details */}
                {nextStepsExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {!isReady ? (
                      /* NOT READY STATE - Details */
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {dealId === '2' 
                            ? 'The project is not ready for outreach yet because the architect has not been appointed. You will be automatically notified when the architect is identified.'
                            : 'The project is not ready for outreach yet. You will be automatically notified when the Outreach Readiness Score indicates it\'s time to engage.'
                          }
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1">
                            What we&apos;re monitoring:
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {dealId === '2' ? (
                              <>
                                <li>• Architect appointment and identification</li>
                                <li>• Architect contact information</li>
                                <li>• Project phase progression</li>
                              </>
                            ) : (
                              <>
                                <li>• Project phase progression</li>
                                <li>• Key stakeholder identification</li>
                                <li>• Specification timeline signals</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    ) : !hasActiveSequence ? (
                      /* READY & NO ACTIVE SEQUENCE STATE - Details */
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Why this sequence?
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {recommendedSequence.reason}
                          </p>
                        </div>
                        
                        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                          <p className="text-xs font-semibold text-indigo-900 mb-2">
                            Sequence Overview:
                          </p>
                          <ul className="text-xs text-indigo-800 space-y-1">
                            {recommendedSequence.overview.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1">
                            Auto-selected based on:
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Role: {deal.contact?.role?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}</li>
                            <li>• Phase: {deal.project?.phase?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}</li>
                            <li>• Product: {deal.project?.productType?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      /* ACTIVE SEQUENCE STATE - Details */
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Sequence Details:
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {recommendedSequence.overview.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          The sequence is now active. Monitor progress in the Activity section below.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Demo Controls - Event Simulators */}
            {hasActiveSequence && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                  🎮 Demo: Simulate Events
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={simulateEmailReply}
                    className="w-full px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded border border-blue-200 transition-colors text-left"
                  >
                    📧 Positive email reply received
                  </button>
                  <button
                    onClick={() => {
                      addActivityEvent({
                        type: 'email_event',
                        title: 'Email bounced',
                        description: `Email could not be delivered to ${deal.contact?.name || 'contact'}. Email address may be invalid.`,
                        user: 'System',
                      })
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-red-200 transition-colors text-left"
                  >
                    ⚠️ Email bounced
                  </button>
                  <button
                    onClick={() => simulateSequenceStepComplete(2, 'Follow-up Email Sent')}
                    className="w-full px-3 py-2 text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded border border-purple-200 transition-colors text-left"
                  >
                    ⚡ Sequence step completed
                  </button>
                  <button
                    onClick={() => {
                      addActivityEvent({
                        type: 'sequence_event',
                        title: 'Meeting booked',
                        description: `Meeting successfully scheduled with ${deal.contact?.name || 'Contact'} for December 5, 2024 at 14:00.`,
                        user: 'System',
                      })
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded border border-green-200 transition-colors text-left"
                  >
                    📅 Meeting booked
                  </button>
                  <button
                    onClick={() => simulatePhaseChange('Detail Planning Phase')}
                    className="w-full px-3 py-2 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded border border-orange-200 transition-colors text-left"
                  >
                    🏗️ Project phase changed
                  </button>
                  <button
                    onClick={() => simulateStakeholderAdded('Jennifer Martinez', 'MEP Engineer')}
                    className="w-full px-3 py-2 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded border border-orange-200 transition-colors text-left"
                  >
                    👤 New stakeholder added
                  </button>
                  <button
                    onClick={() => {
                      addActivityEvent({
                        type: 'manual_comment',
                        title: 'Comment added',
                        description: `Call with ${deal.contact?.name || 'the architect'} was very positive. They showed strong interest in our façade systems and requested additional technical details about our sustainable solutions.`,
                        user: 'Natascha Christ',
                      })
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded border border-teal-200 transition-colors text-left"
                  >
                    💬 Add manual note
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-3 italic">
                  These buttons add events to the Activity timeline for demo purposes.
                </p>
              </div>
            )}
            
            {/* Sources */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button 
                onClick={() => setSourcesExpanded(!sourcesExpanded)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Sources</span>
                  <span className="text-sm text-gray-500">{dealId === '2' ? '3' : '5'}</span>
                </div>
                {sourcesExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {sourcesExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {dealId === '2' ? (
                    /* Sources for Deal 2 - Building Radar */
                    <>
                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <Zap className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">Building Radar Alert</p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <p className="text-xs text-gray-500">Detected 18 Nov 2024</p>
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-medium rounded">AUTO</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">meridianproperties.com/projec...</p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <p className="text-xs text-gray-500">From 15 Nov 2024</p>
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">AI</span>
                          </div>
                        </div>
                      </div>
                      
                      {architectKnown && (
                        <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-indigo-200 bg-indigo-50">
                          <LinkIcon className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">sterlingdesign.com/team</p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <p className="text-xs text-gray-500">From 24 Nov 2024</p>
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded">NEW</span>
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">AI</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Default sources for Deal 1 */
                    <>
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
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

