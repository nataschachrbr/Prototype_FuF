'use client'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { MainContent } from '@/components/MainContent'
import { RightSidebar } from '@/components/RightSidebar'

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Central Content */}
          <MainContent />
          
          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}

