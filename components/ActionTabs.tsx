'use client'

import { Building2, Activity, FileText, MessageSquare } from 'lucide-react'

export function ActionTabs() {
  return (
    <div className="mt-6 border-t border-gray-200">
      <div className="flex items-center space-x-6 pt-4">
        <button className="flex items-center space-x-2 text-gray-900 border-b-2 border-indigo-600 pb-2">
          <Building2 className="w-4 h-4" />
          <span className="text-sm font-medium">Contacts/Companies</span>
        </button>
        
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 pb-2">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">Activity</span>
        </button>
        
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 pb-2">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Deal Info</span>
        </button>
        
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 pb-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Add comment</span>
        </button>
      </div>
    </div>
  )
}

