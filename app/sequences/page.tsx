'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { SequencesList, Sequence } from '@/components/SequencesList'
import { SequenceBuilder } from '@/components/SequenceBuilder'
import { EnrolledContacts } from '@/components/EnrolledContacts'
import { CreateSequenceModal } from '@/components/CreateSequenceModal'
import { PrebuiltTemplatesModal } from '@/components/PrebuiltTemplatesModal'

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([
    { id: '2', name: 'Standard Outreach', status: 'active', enrolledCount: 24 },
    { id: '3', name: 'Referral Follow-up', status: 'active', enrolledCount: 8 },
    { id: '4', name: 'Cold Outreach V2', status: 'draft', enrolledCount: 0 },
    { id: '5', name: 'Re-engagement', status: 'paused', enrolledCount: 15 },
  ])
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>('2')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)

  const handleCreateNew = () => {
    setShowCreateModal(true)
  }

  const handleSelectPrebuilt = () => {
    setShowCreateModal(false)
    setShowTemplatesModal(true)
  }

  const handleSelectNew = () => {
    // Create new empty sequence
    const newId = `new-${Date.now()}`
    const newSequence: Sequence = {
      id: newId,
      name: '[New Sequence]',
      status: 'draft',
      enrolledCount: 0
    }
    setSequences([newSequence, ...sequences])
    setSelectedSequenceId(newId)
    setShowCreateModal(false)
  }

  const handleCreateFromTemplate = (template: any) => {
    // Create sequence from template
    const newId = `template-${Date.now()}`
    const newSequence: Sequence = {
      id: newId,
      name: template.name,
      status: 'draft',
      enrolledCount: 0
    }
    setSequences([newSequence, ...sequences])
    setSelectedSequenceId(newId)
    setShowTemplatesModal(false)
  }

  const handleUpdateSequenceName = (id: string, newName: string) => {
    setSequences(sequences.map(seq => 
      seq.id === id ? { ...seq, name: newName } : seq
    ))
  }

  const selectedSequence = sequences.find(seq => seq.id === selectedSequenceId)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Sequences List */}
      <SequencesList 
        sequences={sequences}
        onSelectSequence={setSelectedSequenceId}
        selectedSequenceId={selectedSequenceId}
        onCreateNew={handleCreateNew}
      />
      
      {/* Main Content Area - Split View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section - Sequence Builder (70% height) */}
        <div className="flex-[7] border-b border-gray-200 overflow-auto">
          <SequenceBuilder 
            sequenceId={selectedSequenceId}
            sequenceName={selectedSequence?.name || ''}
            onUpdateName={(newName) => selectedSequenceId && handleUpdateSequenceName(selectedSequenceId, newName)}
          />
        </div>
        
        {/* Bottom Section - Enrolled Contacts (30% height) */}
        <div className="flex-[3] overflow-auto">
          <EnrolledContacts 
            sequenceId={selectedSequenceId}
            enrolledCount={selectedSequence?.enrolledCount || 0}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateSequenceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSelectPrebuilt={handleSelectPrebuilt}
        onSelectNew={handleSelectNew}
      />

      <PrebuiltTemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onBack={() => {
          setShowTemplatesModal(false)
          setShowCreateModal(true)
        }}
        onCreate={handleCreateFromTemplate}
      />
    </div>
  )
}

