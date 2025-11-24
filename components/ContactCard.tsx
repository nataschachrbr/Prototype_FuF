'use client'

import { useState, useEffect, useRef } from 'react'
import { Mail, Phone, Building2, Edit2, MoreVertical, Users, Copy, Archive, Trash2 } from 'lucide-react'

export function ContactCard() {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden relative">
      {/* Three-dot menu in top right corner */}
      <div className="absolute top-4 right-4 z-10" ref={menuRef}>
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
        {/* Contact Info - Information Only */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

