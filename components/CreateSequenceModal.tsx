'use client'

import { X } from 'lucide-react'

interface CreateSequenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPrebuilt: () => void
  onSelectNew: () => void
}

export function CreateSequenceModal({ isOpen, onClose, onSelectPrebuilt, onSelectNew }: CreateSequenceModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a sequence</h2>
            <p className="text-sm text-gray-500">
              Sequences are a series of automated or manual touchpoints and activities, designed to drive deeper engagement with your contacts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Options */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Prebuilt */}
            <button
              onClick={onSelectPrebuilt}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-16 bg-yellow-200 rounded transform -rotate-3"></div>
                  <div className="absolute inset-0 w-16 h-12 bg-yellow-400 rounded transform rotate-3 top-2 left-2 flex items-center justify-center">
                    <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">Prebuilt</h3>
              <p className="text-sm text-gray-500 text-center">Start with one of our sequence templates.</p>
            </button>

            {/* New */}
            <button
              onClick={onSelectNew}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <svg className="w-20 h-20 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">New</h3>
              <p className="text-sm text-gray-500 text-center">Create a new sequence from scratch.</p>
            </button>

            {/* Clone */}
            <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-20 bg-blue-300 rounded"></div>
                  <div className="absolute w-16 h-20 bg-blue-500 rounded top-2 left-3"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clone</h3>
              <p className="text-sm text-gray-500 text-center">Make a copy of one of your existing sequences.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

