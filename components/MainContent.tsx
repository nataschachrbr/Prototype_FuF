'use client'

import { useState } from 'react'
import { Building2, Mail, Phone, Users } from 'lucide-react'
import { ContactCard } from './ContactCard'
import { ActionTabs } from './ActionTabs'

export function MainContent() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'activity' | 'deal-info'>('contacts')

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 px-8 py-6">
      {/* Project Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Comprehensive renovation of institute buildings &quot;Universität Ulm - Festpunkt 025&quot; by DEGLE.DEGLE Architekten
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
          A major refurbishment project is planned for the institute buildings at Albert-Einstein-Allee 11 in 
          Ulm, known as &quot;Universität Ulm - Sanierung von Institutsgebäuden - Festpunkt 025.&quot;...
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
        <ActionTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

