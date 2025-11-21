'use client'

import { useState } from 'react'
import { X, Mail, Phone, Clock, ChevronDown, ChevronUp } from 'lucide-react'

interface Template {
  id: string
  name: string
  category: 'stage' | 'signal' | 'industry'
  steps: TemplateStep[]
}

interface TemplateStep {
  type: 'manual_email' | 'automatic_email' | 'phone_call' | 'wait'
  day: number
  title: string
  preview?: string
}

interface PrebuiltTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onCreate: (template: Template) => void
}

export function PrebuiltTemplatesModal({ isOpen, onClose, onBack, onCreate }: PrebuiltTemplatesModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<number[]>([0])

  const templates: Template[] = [
    {
      id: 't1',
      name: 'Stage-based targeting: At-risk customers',
      category: 'stage',
      steps: [
        { type: 'manual_email', day: 1, title: 'Manual Email', preview: 'Hey {{first_name}}, I was doing some research about {{company}}...' },
        { type: 'phone_call', day: 2, title: 'Phone Call' },
        { type: 'automatic_email', day: 5, title: 'Automatic Email', preview: 'Following up on our previous conversation...' },
        { type: 'automatic_email', day: 8, title: 'Automatic Email' },
        { type: 'phone_call', day: 9, title: 'Phone Call' },
        { type: 'automatic_email', day: 12, title: 'Automatic Email' },
        { type: 'phone_call', day: 13, title: 'Phone Call' }
      ]
    },
    {
      id: 't2',
      name: 'Stage-based targeting: Closed lost/ win-back',
      category: 'stage',
      steps: [
        { type: 'manual_email', day: 1, title: 'Manual Email' },
        { type: 'wait', day: 3, title: 'Wait 2 days' },
        { type: 'phone_call', day: 3, title: 'Phone Call' },
        { type: 'automatic_email', day: 7, title: 'Automatic Email' }
      ]
    },
    {
      id: 't3',
      name: 'Stage-based targeting: Meeting reminder',
      category: 'stage',
      steps: [
        { type: 'automatic_email', day: 1, title: 'Automatic Email' },
        { type: 'automatic_email', day: 3, title: 'Automatic Email' }
      ]
    },
    {
      id: 't4',
      name: 'Stage-based targeting: Visited "book meeting" link',
      category: 'stage',
      steps: [
        { type: 'manual_email', day: 1, title: 'Manual Email' },
        { type: 'phone_call', day: 2, title: 'Phone Call' }
      ]
    },
    {
      id: 't5',
      name: 'Signal-based targeting: Change in leadership',
      category: 'signal',
      steps: [
        { type: 'manual_email', day: 1, title: 'Manual Email' },
        { type: 'phone_call', day: 3, title: 'Phone Call' },
        { type: 'automatic_email', day: 5, title: 'Automatic Email' }
      ]
    },
    {
      id: 't6',
      name: 'Signal-based targeting: Fundraise',
      category: 'signal',
      steps: [
        { type: 'manual_email', day: 1, title: 'Manual Email' },
        { type: 'automatic_email', day: 4, title: 'Automatic Email' }
      ]
    },
    {
      id: 't7',
      name: 'Signal-based targeting: Job postings',
      category: 'signal',
      steps: [
        { type: 'manual_email', day: 1, title: 'Manual Email' },
        { type: 'phone_call', day: 2, title: 'Phone Call' }
      ]
    },
    {
      id: 't8',
      name: 'Industry-based targeting: IT Security Buyers',
      category: 'industry',
      steps: [
        { type: 'manual_email', day: 1, title: 'Manual Email' },
        { type: 'phone_call', day: 3, title: 'Phone Call' },
        { type: 'automatic_email', day: 6, title: 'Automatic Email' }
      ]
    },
    {
      id: 't9',
      name: 'Industry-based targeting: Marketing Buyers',
      category: 'industry',
      steps: [
        { type: 'manual_email', day: 1, title: 'Manual Email' },
        { type: 'automatic_email', day: 4, title: 'Automatic Email' }
      ]
    }
  ]

  const toggleStepExpanded = (index: number) => {
    setExpandedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'manual_email':
      case 'automatic_email':
        return Mail
      case 'phone_call':
        return Phone
      case 'wait':
        return Clock
      default:
        return Mail
    }
  }

  const getStepColor = (type: string) => {
    switch (type) {
      case 'manual_email':
        return 'text-teal-500'
      case 'automatic_email':
        return 'text-blue-500'
      case 'phone_call':
        return 'text-purple-500'
      case 'wait':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Prebuilt Templates</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Template List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedTemplate?.id === template.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                }`}
              >
                <p className="text-sm text-gray-900">{template.name}</p>
              </button>
            ))}
          </div>

          {/* Right Side - Template Preview */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTemplate ? (
              <div className="space-y-3">
                {selectedTemplate.steps.map((step, index) => {
                  const Icon = getStepIcon(step.type)
                  const isExpanded = expandedSteps.includes(index)

                  return (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleStepExpanded(index)}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded flex items-center justify-center bg-gray-100`}>
                          <Icon className={`w-4 h-4 ${getStepColor(step.type)}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm text-gray-900">{step.title}</span>
                            {index === 0 && step.preview && (
                              <span className="text-xs text-blue-600 font-medium">Preview</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">Day {step.day}</p>
                        </div>
                        {step.preview && (
                          isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      
                      {isExpanded && step.preview && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <p className="text-xs text-gray-600 whitespace-pre-wrap">{step.preview}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Select a template to preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-between flex-shrink-0">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => selectedTemplate && onCreate(selectedTemplate)}
            disabled={!selectedTemplate}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create and customize
          </button>
        </div>
      </div>
    </div>
  )
}

