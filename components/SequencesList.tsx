'use client'

import { useState } from 'react'
import { Plus, Search, GitBranch } from 'lucide-react'
import { Sequence } from '@/lib/sequences'

interface SequencesListProps {
  sequences: Sequence[]
  onSelectSequence: (sequenceId: string) => void
  selectedSequenceId: string | null
  onCreateNew: () => void
}

export function SequencesList({ sequences, onSelectSequence, selectedSequenceId, onCreateNew }: SequencesListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSequences = sequences.filter(seq =>
    seq.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: Sequence['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700'
      case 'paused':
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sequences</h2>
          <button 
            onClick={onCreateNew}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sequences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sequences List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSequences.map((sequence) => (
          <button
            key={sequence.id}
            onClick={() => onSelectSequence(sequence.id)}
            className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              selectedSequenceId === sequence.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-2 flex-1">
                <GitBranch className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{sequence.name}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(sequence.status)}`}>
                    {sequence.status}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {sequence.enrolledCount} {sequence.enrolledCount === 1 ? 'contact' : 'contacts'} enrolled
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

