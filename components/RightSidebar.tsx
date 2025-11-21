'use client'

import { ChevronDown, ChevronUp, Edit2, FileSpreadsheet, Link, X, HelpCircle } from 'lucide-react'

export function RightSidebar() {
  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Stage Dropdown */}
        <div>
          <button className="w-full bg-indigo-50 text-indigo-700 px-4 py-3 rounded-lg flex items-center justify-between hover:bg-indigo-100 transition-colors">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-semibold">Stage | Kontaktrecherche</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        
        {/* Deal Owner */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-purple-700">NC</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Deal owner</p>
              <p className="text-sm font-medium text-gray-900">Natascha Christ (you)</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Change
          </button>
        </div>
        
        {/* Project Scores */}
        <div className="border-t border-gray-200 pt-6">
          <button className="w-full flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-900">PROJECT SCORES</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-orange-700">50% MEDIUM FIT</span>
              <span className="text-2xl font-bold text-gray-900">1</span>
            </div>
          </div>
        </div>
        
        {/* Stage Objectives */}
        <div className="border-t border-gray-200 pt-6">
          <button className="w-full flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-900">STAGE OBJECTIVES</span>
              <span className="text-xs text-gray-500">0/3</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        {/* Next Steps */}
        <div className="border-t border-gray-200 pt-6">
          <button className="w-full flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-900">NEXT STEPS</span>
              <span className="text-xs text-gray-500">0</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        {/* Sources */}
        <div className="border-t border-gray-200 pt-6">
          <button className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-900">SOURCES</span>
              <span className="text-xs text-gray-500">5</span>
            </div>
            <ChevronUp className="w-4 h-4 text-gray-500" />
          </button>
          
          <div className="space-y-3">
            {/* Source 1 - Excel File */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <FileSpreadsheet className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  Export MR_2025-11-07-10-57-50.xlsx.xlsx...
                </p>
                <p className="text-xs text-gray-500 mt-1">Added 21 Nov 2025</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            {/* Source 2 - Website */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <Link className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  degle-degle.de/schulen-und-...
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">From 1 Jun 2024</span>
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">AI</span>
                  <span className="px-1.5 py-0.5 bg-pink-100 text-pink-700 text-xs rounded">BETA</span>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            {/* Source 3 - Competition */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <Link className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  competitionline.com/de/bueros/10742
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">From 1 Mar 2023</span>
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">AI</span>
                  <span className="px-1.5 py-0.5 bg-pink-100 text-pink-700 text-xs rounded">BETA</span>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            {/* Source 4 - University */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <Link className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">uni-...</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            {/* Source 5 - University Article */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <Link className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  uni-ulm.de/home/uni-aktuell/article/mehr...
                </p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Ask Questions Section */}
        <div className="border-t border-gray-200 pt-6">
          <button className="w-full flex items-center justify-center space-x-2 text-indigo-600 hover:text-indigo-700 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
            <span className="text-sm font-medium">✨ Ask questions about this deal...</span>
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
        
        {/* Help Button */}
        <div className="fixed bottom-6 right-6">
          <button className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors">
            <HelpCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

