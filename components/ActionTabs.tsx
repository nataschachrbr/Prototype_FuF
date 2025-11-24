'use client'

import { Building2, Activity, FileText } from 'lucide-react'

interface ActionTabsProps {
  activeTab: 'contacts' | 'activity' | 'deal-info'
  onTabChange: (tab: 'contacts' | 'activity' | 'deal-info') => void
}

export function ActionTabs({ activeTab, onTabChange }: ActionTabsProps) {
  return (
    <div className="mt-6 border-t border-gray-200">
      <div className="flex items-center space-x-6 pt-4">
        <button 
          onClick={() => onTabChange('contacts')}
          className={`flex items-center space-x-2 pb-2 transition-colors ${
            activeTab === 'contacts'
              ? 'text-gray-900 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-sm font-medium">Contacts/Companies</span>
        </button>
        
        <button 
          onClick={() => onTabChange('activity')}
          className={`flex items-center space-x-2 pb-2 transition-colors ${
            activeTab === 'activity'
              ? 'text-gray-900 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">Activity</span>
        </button>
        
        <button 
          onClick={() => onTabChange('deal-info')}
          className={`flex items-center space-x-2 pb-2 transition-colors ${
            activeTab === 'deal-info'
              ? 'text-gray-900 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Deal Info</span>
        </button>
      </div>
    </div>
  )
}

