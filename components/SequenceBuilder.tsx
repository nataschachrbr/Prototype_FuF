'use client'

import { useState, useEffect } from 'react'
import { Plus, Zap, Mail, Clock, Phone, CheckSquare, Linkedin, X, ChevronUp, ChevronDown, Sparkles, Eye } from 'lucide-react'

interface SequenceBuilderProps {
  sequenceId: string | null
  sequenceName: string
  onUpdateName: (newName: string) => void
}

type StepType = 
  | 'automatic_email' 
  | 'manual_email' 
  | 'phone_call' 
  | 'action_item'
  | 'linkedin_connection'
  | 'linkedin_message'
  | 'linkedin_view'
  | 'wait'

interface SequenceStep {
  id: string
  type: StepType
  title: string
  description: string
  content?: string
}

interface StepConfig {
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  borderColor: string
  iconBgColor: string
  badge?: string
  badgeColor?: string
}

// Store steps per sequence
const sequenceStepsMap: { [key: string]: SequenceStep[] } = {
  '2': [ // Standard Outreach
    {
      id: '1',
      type: 'wait',
      title: 'WAIT',
      description: 'Wait up to 30d',
      content: 'When Delivered'
    },
    {
      id: '2',
      type: 'automatic_email',
      title: 'AUTOMATIC EMAIL',
      description: 'Your Monthly Goals - Let\'s Get Started!',
      content: 'Monthly kick-off mail'
    }
  ]
}

const createAiArchitectEmailSteps = (): SequenceStep[] => {
  return [
    {
      id: `ai-email-1`,
      type: 'automatic_email',
      title: 'AUTOMATIC EMAIL',
      description: 'Intro outreach to architect about a specific project',
      content:
        'Subject: Exploring how we can support {{project_name}}\n\n' +
        'Hi {{contact_first_name}},\n\n' +
        'I was looking into {{project_name}} at {{company_name}} and thought it could be helpful to share a few ideas on how we typically support similar projects.\n\n' +
        '[AI NOTE: This is a draft suggestion. In a real flow, this email will be automatically rewritten to reference the exact project details, timelines, and known constraints for {{project_name}} and {{company_name}}.]\n'
    },
    {
      id: `ai-email-2`,
      type: 'automatic_email',
      title: 'AUTOMATIC EMAIL',
      description: 'Follow-up with value and light case reference',
      content:
        'Subject: Quick follow-up on {{project_name}}\n\n' +
        'Hi {{contact_first_name}},\n\n' +
        'Following up on my last note about {{project_name}}. We often work with architects in similar contexts to help with {{insert_high_level_value_here}}.\n\n' +
        '[AI NOTE: This is a draft suggestion. In production this would be auto-personalized with relevant references, metrics or examples that best match the sector and size of {{company_name}} and the characteristics of {{project_name}}.]\n'
    },
    {
      id: `ai-email-3`,
      type: 'automatic_email',
      title: 'AUTOMATIC EMAIL',
      description: 'Last nudge with clear next step',
      content:
        'Subject: Should we schedule time about {{project_name}}?\n\n' +
        'Hi {{contact_first_name}},\n\n' +
        'Just a quick note in case this is still relevant for {{project_name}}. If it is, I’d be happy to share a short, tailored walk-through focused on your specific constraints.\n\n' +
        '[AI NOTE: This is a draft suggestion. The final version would automatically adapt tone, call-to-action and level of detail to the contact seniority and the latest information about {{project_name}}.]\n'
    }
  ]
}

export function SequenceBuilder({ sequenceId, sequenceName, onUpdateName }: SequenceBuilderProps) {
  const [showAddStepModal, setShowAddStepModal] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(sequenceName)
  
  // Get steps for current sequence, default to empty array for new sequences
  const initialSteps = sequenceId && sequenceStepsMap[sequenceId] ? sequenceStepsMap[sequenceId] : []
  const [steps, setSteps] = useState<SequenceStep[]>(initialSteps)

  // Update editedName when sequenceName prop changes (switching sequences)
  useEffect(() => {
    setEditedName(sequenceName)
  }, [sequenceName])

  // Update steps when sequence changes
  useEffect(() => {
    let newSteps = sequenceId && sequenceStepsMap[sequenceId] ? sequenceStepsMap[sequenceId] : []

    // For AI-generated architect sequences, seed a mocked 3-email fully automated flow
    if (
      newSteps.length === 0 &&
      sequenceName &&
      sequenceName.toLowerCase().includes('architect') &&
      sequenceName.toLowerCase().includes('fully automated')
    ) {
      newSteps = createAiArchitectEmailSteps()
    }

    setSteps(newSteps)
  }, [sequenceId, sequenceName])

  const getStepConfig = (type: StepType): StepConfig => {
    const configs: Record<StepType, StepConfig> = {
      automatic_email: {
        icon: Mail,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconBgColor: 'bg-blue-500',
        badge: 'AI available!',
        badgeColor: 'text-purple-600'
      },
      manual_email: {
        icon: Mail,
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
        iconBgColor: 'bg-teal-500',
        badge: 'AI available!',
        badgeColor: 'text-purple-600'
      },
      phone_call: {
        icon: Phone,
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        iconBgColor: 'bg-purple-500'
      },
      action_item: {
        icon: CheckSquare,
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200',
        iconBgColor: 'bg-pink-500'
      },
      linkedin_connection: {
        icon: Linkedin,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        iconBgColor: 'bg-blue-600'
      },
      linkedin_message: {
        icon: Linkedin,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        iconBgColor: 'bg-blue-600'
      },
      linkedin_view: {
        icon: Linkedin,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        iconBgColor: 'bg-blue-600'
      },
      wait: {
        icon: Clock,
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        iconBgColor: 'bg-gray-500'
      }
    }
    return configs[type]
  }

  const addStep = (type: StepType, title: string, description: string) => {
    const newStep: SequenceStep = {
      id: Date.now().toString(),
      type,
      title,
      description,
      content: ''
    }
    setSteps([...steps, newStep])
    setShowAddStepModal(false)
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id))
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= steps.length) return
    
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    setSteps(newSteps)
  }

  if (!sequenceId) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Sequence</h3>
          <p className="text-sm text-gray-500">Choose a sequence from the list to view and edit</p>
        </div>
      </div>
    )
  }

  const handleNameBlur = () => {
    if (editedName.trim() && editedName !== sequenceName) {
      onUpdateName(editedName.trim())
    } else {
      setEditedName(sequenceName)
    }
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur()
    } else if (e.key === 'Escape') {
      setEditedName(sequenceName)
      setIsEditingName(false)
    }
  }

  return (
    <div className="bg-white p-4 overflow-y-auto relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              autoFocus
              className="text-xl font-bold text-gray-900 mb-1 border-b-2 border-indigo-500 focus:outline-none w-full"
            />
          ) : (
            <h2 
              onClick={() => setIsEditingName(true)}
              className="text-xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 transition-colors"
            >
              {sequenceName}
            </h2>
          )}
          <p className="text-xs text-gray-500">Build your automated sequence with entry rules, actions, and conditions</p>
        </div>

        {/* Sequence Flow */}
        <div className="space-y-2">
          {/* Entry Rules - Fixed */}
          <div className="border border-gray-200 rounded-lg p-3 bg-yellow-50">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-gray-900">ENTRY RULES</h3>
                <p className="text-xs text-gray-500">When contacts should enter sequence</p>
              </div>
            </div>
            
            <div className="bg-white rounded p-2 border border-yellow-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Contact added to CRM or deal stage changed</span>
                <button className="text-xs text-indigo-600 hover:text-indigo-700">Edit</button>
              </div>
            </div>
          </div>

          {/* Dynamic Steps */}
          {steps.map((step, index) => {
            const config = getStepConfig(step.type)
            const Icon = config.icon

            return (
              <div key={step.id}>
                {/* Connection Line */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-gray-300"></div>
                </div>

                {/* Step */}
                <div className={`border border-gray-200 rounded-lg p-3 ${config.bgColor} relative group`}>
                  {/* Step Header */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 ${config.iconBgColor} rounded flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-xs font-semibold text-gray-900">{step.title}</h3>
                        {config.badge && (
                          <span className={`flex items-center space-x-0.5 text-[10px] font-medium ${config.badgeColor || ''}`}>
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{config.badge}</span>
                          </span>
                        )}
                      </div>
                      {step.content && <p className="text-xs text-gray-500 truncate">{step.content}</p>}
                    </div>
                    
                    {/* Action Buttons - Show on hover */}
                    <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        className="p-0.5 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === steps.length - 1}
                        className="p-0.5 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="p-0.5 hover:bg-red-100 rounded transition-colors"
                        title="Remove step"
                      >
                        <X className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className={`bg-white rounded p-2 border ${config.borderColor}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 truncate">{step.description}</span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-700 ml-2 flex-shrink-0">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add Step Button */}
          <div className="flex justify-center pt-2 pb-2">
            <button
              onClick={() => setShowAddStepModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Add Step</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Step Modal */}
      {showAddStepModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddStepModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Select a sequence step</h3>
                <p className="text-sm text-gray-500 mt-1">Add a step for the sequence to follow and automate for you.</p>
              </div>
              <button
                onClick={() => setShowAddStepModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Automatic Section */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Automatic</h4>
                <button
                  onClick={() => addStep('automatic_email', 'AUTOMATIC EMAIL', 'Emails are delivered automatically.')}
                  className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Automatic email</span>
                      <span className="flex items-center space-x-1 text-xs font-medium text-purple-600">
                        <Sparkles className="w-3 h-3" />
                        <span>AI available!</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Emails are delivered automatically.</p>
                  </div>
                </button>
              </div>

              {/* Tasks Section */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tasks</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => addStep('manual_email', 'MANUAL EMAIL', 'Task is created to edit and deliver email.')}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">Manual email</span>
                        <span className="flex items-center space-x-1 text-xs font-medium text-purple-600">
                          <Sparkles className="w-3 h-3" />
                          <span>AI available!</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">Task is created to edit and deliver email.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => addStep('phone_call', 'PHONE CALL', 'Task is created to call prospect.')}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Phone call</span>
                      <p className="text-sm text-gray-500 mt-0.5">Task is created to call prospect.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => addStep('action_item', 'ACTION ITEM', 'Task is created to perform custom action.')}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckSquare className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Action item</span>
                      <p className="text-sm text-gray-500 mt-0.5">Task is created to perform custom action.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* LinkedIn Tasks Section */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">LinkedIn tasks</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => addStep('linkedin_connection', 'LINKEDIN: SEND CONNECTION REQUEST', 'Task is created to send LinkedIn connection request.')}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">LinkedIn: send connection request</span>
                      <p className="text-sm text-gray-500 mt-0.5">Task is created to send LinkedIn connection request.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => addStep('linkedin_message', 'LINKEDIN: SEND MESSAGE', 'Task is created to send LinkedIn message.')}
                    className="w-full flex items-center space-x-4 p-4 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">LinkedIn: send message</span>
                      <p className="text-sm text-gray-500 mt-0.5">Task is created to send LinkedIn message.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => addStep('linkedin_view', 'LINKEDIN: VIEW PROFILE', 'Task is created to view LinkedIn profile.')}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">LinkedIn: view profile</span>
                      <p className="text-sm text-gray-500 mt-0.5">Task is created to view LinkedIn profile.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Other Section */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Other</h4>
                <button
                  onClick={() => addStep('wait', 'WAIT', 'Wait for a specified duration')}
                  className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Wait</span>
                    <p className="text-sm text-gray-500 mt-0.5">Wait for a specified duration</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

