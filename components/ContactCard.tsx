'use client'

import { useState } from 'react'
import { Mail, Phone, Building2, Edit2, MoreVertical, MessageSquare, Calendar, Users, Send, CheckSquare, Clock, Copy, Archive, Trash2 } from 'lucide-react'

export function ContactCard() {
  const [activeSequences, setActiveSequences] = useState<number>(0)
  const [activeTasks, setActiveTasks] = useState<number>(0)
  const [lastTouched, setLastTouched] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [showSequenceDropdown, setShowSequenceDropdown] = useState<boolean>(false)
  const [messageCount, setMessageCount] = useState<number>(0)
  const [emailCount, setEmailCount] = useState<number>(0)
  const [meetingCount, setMeetingCount] = useState<number>(0)
  const [currentSequences, setCurrentSequences] = useState<string[]>([])

  const handleAddToSequence = (sequenceName: string) => {
    console.log(`Adding to ${sequenceName} sequence...`)
    
    // Add sequence to the list if not already added
    if (!currentSequences.includes(sequenceName)) {
      setCurrentSequences((prev: string[]) => [...prev, sequenceName])
      setActiveSequences((prev: number) => prev + 1)
      setActiveTasks((prev: number) => prev + 2) // Add some sample tasks
      setLastTouched('just now')
      
      // Simulate sequence activity - increment email count as example
      setEmailCount((prev: number) => prev + 1)
    }
    
    // Close the dropdown
    setShowSequenceDropdown(false)
    
    // Simulate time update
    setTimeout(() => {
      setLastTouched('1 minute ago')
    }, 60000)
  }

  const formatTimeAgo = () => {
    if (!lastTouched) return ''
    return lastTouched
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden relative">
      {/* Three-dot menu in top right corner */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
        
        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
              <Edit2 className="w-4 h-4" />
              <span>Edit contact</span>
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
              <Copy className="w-4 h-4" />
              <span>Copy to clipboard</span>
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
              <Archive className="w-4 h-4" />
              <span>Archive</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start space-x-6 p-6">
        {/* Left Side - Contact Info */}
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-indigo-600">JH</span>
            </div>
            
            {/* Contact Details */}
            <div className="flex-1 pr-12">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">Joachim Hofmann</h3>
                <Building2 className="w-4 h-4 text-gray-400" />
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              
              <p className="text-sm text-indigo-600 mb-3">
                Vermögen und Bau Baden-Württemberg, Amt Ulm
              </p>
              
              <div className="flex items-center space-x-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Head of Structural Engineering for the University</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <button className="text-sm text-gray-400 hover:text-indigo-600">Add E-mail</button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a href="tel:0731/50-28900" className="text-sm text-gray-700 hover:text-indigo-600">0731/50-28900</a>
              </div>
              
              <button className="mt-3 text-sm text-gray-400 hover:text-indigo-600">
                Add Default Display
              </button>
              
              <button className="mt-2 text-sm text-gray-500 hover:text-indigo-600">
                View 2 more
              </button>
            </div>
          </div>
        </div>
      
        {/* Right Side - Actions */}
        <div className="flex flex-col items-center space-y-4">
          {/* Outreach tracking bubbles - show sequence activity */}
          <div className="flex space-x-1.5">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center relative">
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-200 rounded-full flex items-center justify-center text-[10px] text-indigo-700">{messageCount}</span>
            </div>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center relative">
              <Mail className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-200 rounded-full flex items-center justify-center text-[10px] text-indigo-700">{emailCount}</span>
            </div>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center relative">
              <Calendar className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-200 rounded-full flex items-center justify-center text-[10px] text-indigo-700">{meetingCount}</span>
            </div>
          </div>
          
          {/* Primary action - Add to sequence */}
          <div className="w-full relative">
            <button 
              onClick={() => setShowSequenceDropdown(!showSequenceDropdown)}
              className="w-full bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
            >
              <Send className="w-4 h-4" />
              <span>{activeSequences > 0 ? 'Add to another sequence' : 'Add to sequence'}</span>
            </button>
            
            {/* Sequence Dropdown */}
            {showSequenceDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button 
                  onClick={() => handleAddToSequence('Standard')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">Standard</span>
                  {currentSequences.includes('Standard') && (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
                <button 
                  onClick={() => handleAddToSequence('Referral')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">Referral</span>
                  {currentSequences.includes('Referral') && (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Secondary manual outreach actions - smaller icon buttons */}
          <div className="flex space-x-2 w-full">
            <button 
              className="flex-1 bg-gray-50 text-gray-600 p-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              title="Prepare call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button 
              className="flex-1 bg-gray-50 text-gray-600 p-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              title="Prepare e-mail"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Section - Only shows when contact is in at least one sequence */}
      {activeSequences > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Activity</h3>
          
          <div className="space-y-2.5">
            {/* Active Sequences */}
            <div className="flex items-center space-x-3">
              <Send className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-gray-700">
                Active in <span className="text-indigo-600 font-medium">{currentSequences.join(', ')}</span> {activeSequences === 1 ? 'sequence' : 'sequences'}
              </span>
            </div>
            
            {/* Active Tasks */}
            {activeTasks > 0 && (
              <div className="flex items-center space-x-3">
                <CheckSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">{activeTasks}</span> active {activeTasks === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            )}
            
            {/* Last Touched */}
            {lastTouched && (
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Touched {formatTimeAgo()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

