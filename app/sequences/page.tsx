'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { SequencesList } from '@/components/SequencesList'
import { SequenceBuilder } from '@/components/SequenceBuilder'
import { EnrolledContacts } from '@/components/EnrolledContacts'

export default function SequencesPage() {
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>('1')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Sequences List */}
      <SequencesList 
        onSelectSequence={setSelectedSequenceId}
        selectedSequenceId={selectedSequenceId}
      />
      
      {/* Main Content Area - Split View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section - Sequence Builder */}
        <div className="h-1/2 border-b border-gray-200 overflow-auto">
          <SequenceBuilder sequenceId={selectedSequenceId} />
        </div>
        
        {/* Bottom Section - Enrolled Contacts */}
        <div className="h-1/2 overflow-auto">
          <EnrolledContacts sequenceId={selectedSequenceId} />
        </div>
      </div>
    </div>
  )
}

