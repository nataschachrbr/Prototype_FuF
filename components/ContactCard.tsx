'use client'

import { useState, useEffect, useRef } from 'react'
import { Mail, Phone, Building2, Edit2, MoreVertical, Users, Copy, Archive, Trash2, Star } from 'lucide-react'

const DEAL_CONTACT_ID = 'deal-primary-contact'
const CONTACT_NOTES_STORAGE_KEY = 'contactNotes'

export function ContactCard() {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [note, setNote] = useState('')

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

  // Load favorite state for this deal contact
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('favoriteContacts')
    if (stored) {
      try {
        const parsed: string[] = JSON.parse(stored)
        setIsFavorite(parsed.includes(DEAL_CONTACT_ID))
      } catch {
        // ignore
      }
    }
  }, [])

  // Load note for this deal contact
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(CONTACT_NOTES_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, string>
        setNote(parsed[DEAL_CONTACT_ID] ?? '')
      } catch {
        setNote('')
      }
    } else {
      setNote('')
    }
  }, [])

  const toggleFavorite = () => {
    setIsFavorite(prev => {
      const next = !prev
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('favoriteContacts')
        let ids: string[] = []
        if (stored) {
          try {
            ids = JSON.parse(stored)
          } catch {
            ids = []
          }
        }
        const setIds = new Set(ids)
        if (next) {
          setIds.add(DEAL_CONTACT_ID)
        } else {
          setIds.delete(DEAL_CONTACT_ID)
        }
        window.localStorage.setItem('favoriteContacts', JSON.stringify(Array.from(setIds)))
      }
      return next
    })
  }

  const handleNoteChange = (value: string) => {
    setNote(value)
    if (typeof window === 'undefined') return
    let current: Record<string, string> = {}
    const stored = window.localStorage.getItem(CONTACT_NOTES_STORAGE_KEY)
    if (stored) {
      try {
        current = JSON.parse(stored) as Record<string, string>
      } catch {
        current = {}
      }
    }
    current[DEAL_CONTACT_ID] = value
    window.localStorage.setItem(CONTACT_NOTES_STORAGE_KEY, JSON.stringify(current))
  }

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
              <span className="text-lg font-semibold text-indigo-600">TH</span>
            </div>
            
            {/* Contact Details */}
            <div className="flex-1 pr-12">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">Thomas Harrison</h3>
                <Building2 className="w-4 h-4 text-gray-400" />
                <Users className="w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className="ml-1 p-1 rounded-full hover:bg-yellow-50"
                  aria-label={isFavorite ? 'Unfavorite key contact' : 'Favorite as key contact'}
                >
                  <Star
                    className={`w-4 h-4 ${
                      isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              </div>
              
              <p className="text-sm text-indigo-600 mb-3">
                Morgan Sindall Group
              </p>
              
              <div className="flex items-center space-x-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Head of Procurement · Major regeneration projects</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a
                  href="mailto:thomas.harrison@morgansindall.com"
                  className="text-sm text-gray-700 hover:text-indigo-600"
                >
                  thomas.harrison@morgansindall.com
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a
                  href="tel:+442073079200"
                  className="text-sm text-gray-700 hover:text-indigo-600"
                >
                  +44 20 7307 9200
                </a>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="Add note about this contact..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

