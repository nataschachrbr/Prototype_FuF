'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { SequencesList } from '@/components/SequencesList'
import { SequenceBuilder } from '@/components/SequenceBuilder'
import { EnrolledContacts } from '@/components/EnrolledContacts'
import { CreateSequenceModal } from '@/components/CreateSequenceModal'
import { PrebuiltTemplatesModal } from '@/components/PrebuiltTemplatesModal'
import { Sequence, getAllSequences, saveSequences } from '@/lib/sequences'

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>('1')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)

  // Load sequences on mount
  useEffect(() => {
    const loadedSequences = getAllSequences()
    setSequences(loadedSequences)
  }, [])

  // Save sequences whenever they change
  useEffect(() => {
    if (sequences.length > 0) {
      saveSequences(sequences)
    }
  }, [sequences])

  const handleCreateNew = () => {
    setShowCreateModal(true)
  }

  const handleSelectPrebuilt = () => {
    setShowCreateModal(false)
    setShowTemplatesModal(true)
  }

  const handleSelectAiGenerated = (prompt: string) => {
    // For now we just mock the AI behavior and create a predefined sequence
    // The prompt is accepted to show how this would work in a real product
    const newId = `ai-${Date.now()}`
    const newSequence: Sequence = {
      id: newId,
      name: 'AI-generated: Fully automated outreach to architects (3 emails)',
      status: 'draft',
      enrolledCount: 0
    }

    setSequences([newSequence, ...sequences])
    setSelectedSequenceId(newId)
    setShowCreateModal(false)
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
        onSelectAiGenerated={handleSelectAiGenerated}
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

