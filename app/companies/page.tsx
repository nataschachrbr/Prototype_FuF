'use client'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { CompanyList } from '@/components/CompanyList'

export default function CompaniesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-hidden">
          <CompanyList />
        </div>
      </div>
    </div>
  )
}

