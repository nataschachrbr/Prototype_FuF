'use client'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { PeopleList } from '@/components/PeopleList'

export default function PeoplePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-hidden">
          <PeopleList />
        </div>
      </div>
    </div>
  )
}

