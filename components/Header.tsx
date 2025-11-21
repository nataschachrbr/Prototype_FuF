'use client'

import { ChevronLeft, ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Pipeline</span>
        </button>
        
        <div className="h-4 w-px bg-gray-300"></div>
        
        <button className="flex items-center space-x-2 text-gray-900">
          <span className="text-sm font-medium">Revenue Engineering</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

