'use client'

import { Home, Inbox, Star, CheckCircle, MoreHorizontal, Bell, Settings, GitBranch } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="w-16 bg-gray-100 text-gray-700 flex flex-col items-center py-4 space-y-6 border-r border-gray-200">
      {/* Logo */}
      <Link href="/" className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </Link>
      
      {/* Navigation Icons */}
      <Link href="/" className={`w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors ${pathname === '/' ? 'bg-gray-200' : ''}`}>
        <Inbox className="w-5 h-5" />
      </Link>
      
      <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors">
        <Star className="w-5 h-5" />
      </button>
      
      <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors">
        <CheckCircle className="w-5 h-5" />
      </button>
      
      <Link href="/sequences" className={`w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors ${pathname === '/sequences' ? 'bg-gray-200' : ''}`}>
        <GitBranch className="w-5 h-5" />
      </Link>
      
      <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>
      
      <div className="flex-1"></div>
      
      {/* Bottom Icons */}
      <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
}

