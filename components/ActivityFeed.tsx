'use client'

import { useState } from 'react'
import { MessageSquare, Flag, Zap, Mail, Send } from 'lucide-react'

// Event types
export type ActivityEventType = 
  | 'project_event' 
  | 'sequence_event' 
  | 'email_event' 
  | 'manual_comment'

export interface ActivityEvent {
  id: string
  type: ActivityEventType
  title: string
  description?: string
  timestamp: Date
  user: string
  emailPreview?: string // For email events - 100 char preview
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  events: ActivityEvent[]
  onAddComment?: (comment: string) => void
}

export function ActivityFeed({ events, onAddComment }: ActivityFeedProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'comments' | 'history'>('all')
  const [commentText, setCommentText] = useState('')
  const [isAddingComment, setIsAddingComment] = useState(false)

  // Filter events based on active tab
  const filteredEvents = events.filter(event => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'comments') return event.type === 'manual_comment'
    if (activeFilter === 'history') return event.type !== 'manual_comment'
    return true
  })

  // Group events by date
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = new Date(event.timestamp).toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
    return groups
  }, {} as Record<string, ActivityEvent[]>)

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(a.split(' ').reverse().join(' '))
    const dateB = new Date(b.split(' ').reverse().join(' '))
    return dateB.getTime() - dateA.getTime()
  })

  const getEventIcon = (type: ActivityEventType) => {
    switch (type) {
      case 'project_event':
        return <Flag className="w-5 h-5 text-orange-600" />
      case 'sequence_event':
        return <Zap className="w-5 h-5 text-purple-600" />
      case 'email_event':
        return <Mail className="w-5 h-5 text-blue-600" />
      case 'manual_comment':
        return <MessageSquare className="w-5 h-5 text-green-600" />
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />
    }
  }

  const getEventIconBgColor = (type: ActivityEventType) => {
    switch (type) {
      case 'project_event':
        return 'bg-orange-100'
      case 'sequence_event':
        return 'bg-purple-100'
      case 'email_event':
        return 'bg-blue-100'
      case 'manual_comment':
        return 'bg-green-100'
      default:
        return 'bg-gray-100'
    }
  }

  const handleAddComment = () => {
    if (commentText.trim() && onAddComment) {
      onAddComment(commentText.trim())
      setCommentText('')
      setIsAddingComment(false)
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div>
      {/* ACTIVITY Header */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Activity</h2>
        
        {/* Filter Tabs */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('comments')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'comments'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveFilter('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'history'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Add Comment Section */}
      <div className="mb-6">
        {!isAddingComment ? (
          <button
            onClick={() => setIsAddingComment(true)}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Add a comment</span>
          </button>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              autoFocus
            />
            <div className="flex items-center justify-end space-x-2 mt-3">
              <button
                onClick={() => {
                  setIsAddingComment(false)
                  setCommentText('')
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Add Comment</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {sortedDates.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No activity yet</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              {/* Date Header */}
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                {date}
              </div>
              
              {/* Events for this date */}
              <div className="space-y-6">
                {groupedEvents[date].map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline connector line (except for last item) */}
                    {index < groupedEvents[date].length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" style={{ height: 'calc(100% + 1.5rem)' }}></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {/* Icon Circle */}
                      <div className={`w-12 h-12 rounded-full ${getEventIconBgColor(event.type)} flex items-center justify-center flex-shrink-0 relative z-10`}>
                        {getEventIcon(event.type)}
                      </div>
                      
                      {/* Event Content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          {/* Event Title */}
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          
                          {/* Event Description or Email Preview */}
                          {event.description && (
                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                          
                          {event.emailPreview && (
                            <div className="bg-white border border-gray-200 rounded p-3 mb-3">
                              <p className="text-xs text-gray-600 italic">
                                &quot;{event.emailPreview}&quot;
                              </p>
                            </div>
                          )}
                          
                          {/* Show More Button (for comments) */}
                          {event.type === 'manual_comment' && event.description && event.description.length > 150 && (
                            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-3">
                              Show more
                            </button>
                          )}
                          
                          {/* Timestamp and User */}
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatTime(event.timestamp)}</span>
                            <span>•</span>
                            <span>{event.user}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

