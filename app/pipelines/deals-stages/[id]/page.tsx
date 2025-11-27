'use client'

import { Sidebar } from '@/components/Sidebar'
import { ChevronLeft, ChevronDown, ChevronUp, Send, Mail, Phone, Calendar, Sparkles, Check, Clock, X, Play, Square, Mic, MicOff, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

// Mock deal data – aligned with the 3 outreach deals in the pipeline and
// matching contacts/companies from the People and Companies pages.
const mockDealData: Record<string, any> = {
  // Deal 3 – HS2 Rail Infrastructure Package (Balfour Beatty / James Robertson)
  '3': {
    id: '3',
    title: 'HS2 Rail Infrastructure Package',
    subtitle: 'Major rail infrastructure works',
    company: 'Balfour Beatty',
    value: '£4,200,000',
    stage: 'Outreach & Meeting Booking',
    outreach: {
      readinessStatus: 'not-ready', // not-ready | ready | in-progress
      readinessReason:
        'Project is in early design. Key stakeholders on the rail package are still aligning scope and budget, so outreach timing is premature.',
      readyTriggers: null,
      primaryContact: {
        name: 'James Robertson',
        role: 'Head of Infrastructure Projects',
        company: 'Balfour Beatty',
        isNew: false,
      },
      sequence: null,
      personalization: {
        isReady: true,
        summary:
          'Intro tailored to UK rail infrastructure and long-term framework opportunities with Balfour Beatty.',
      },
      sequenceStatus: 'not-started',
      contactAddedToSequence: false,
      contactConfirmed: false,
      awaitingSequenceConfirmation: false,
      sequenceMode: null, // 'automated' | 'manual' | null
      sources: [],
    },
  },

  // Deal 4 – M25 Highways Upgrade (Kier Group / Sarah Mitchell)
  '4': {
    id: '4',
    title: 'M25 Highways Upgrade',
    subtitle: 'Strategic road network upgrades',
    company: 'Kier Group',
    value: '£8,100,000',
    stage: 'Outreach & Meeting Booking',
    outreach: {
      readinessStatus: 'not-ready',
      readinessReason:
        'Commercial structure and delivery partners are still being finalised. Key specification work has not started yet.',
      readyTriggers: null,
      primaryContact: {
        name: 'Sarah Mitchell',
        role: 'Commercial Director',
        company: 'Kier Group',
        isNew: false,
      },
      sequence: null,
      personalization: {
        isReady: true,
        summary:
          'Commercially focused intro for UK highways work, highlighting risk, delivery certainty, and cost transparency.',
      },
      sequenceStatus: 'not-started',
      contactAddedToSequence: false,
      contactConfirmed: false,
      awaitingSequenceConfirmation: false,
      sequenceMode: null,
      sources: [],
    },
  },

  // Deal 5 – Healthcare Facilities Programme (Galliford Try / Emily Davies)
  '5': {
    id: '5',
    title: 'Healthcare Facilities Programme',
    subtitle: 'Acute & community healthcare projects',
    company: 'Galliford Try',
    value: '£2,900,000',
    stage: 'Outreach & Meeting Booking',
    outreach: {
      readinessStatus: 'not-ready',
      readinessReason:
        'Clinical design brief and estate strategy are still being defined; envelopes and materials are not yet under discussion.',
      readyTriggers: null,
      primaryContact: {
        name: 'Emily Davies',
        role: 'Project Director - Buildings',
        company: 'Galliford Try',
        isNew: false,
      },
      sequence: null,
      personalization: {
        isReady: true,
        summary:
          'Healthcare-focused opener, referencing infection control, lifecycle cost, and programme-critical delivery.',
      },
      sequenceStatus: 'not-started',
      contactAddedToSequence: false,
      contactConfirmed: false,
      awaitingSequenceConfirmation: false,
      sequenceMode: null,
      sources: [],
    },
  },
}

// Helper function to calculate days since date
function getDaysSince(date: Date | null): number | null {
  if (!date) return null
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Helper function to generate phone script
function generatePhoneScript(deal: any, contact: any): string {
  return `Hi ${contact?.name || 'there'}, this is Natascha Christ from [Your Company]. 

I wanted to follow up on the email I sent regarding the ${deal?.title || 'project'} at ${contact?.company || 'your company'}.

I understand you're leading the ${deal?.title || 'project'} as ${contact?.role || 'project lead'}, and given the focus on ${deal?.subtitle || 'sustainable facade systems'}, I thought it would be valuable to connect.

We've worked with similar projects and helped architects achieve [specific benefits]. I'd love to discuss how we can support your vision, especially as you're moving into the schematic design phase.

Would you have 15 minutes this week for a quick call to explore how we might align with your project goals?`
}

// Helper function to generate voicemail message
function generateVoicemailMessage(deal: any, contact: any): string {
  return `Hi ${contact?.name || 'there'}, this is Natascha Christ from [Your Company]. 

I'm calling to follow up on the email I sent about the ${deal?.title || 'project'}. I'd love to connect briefly to discuss how we might support your vision for ${deal?.subtitle || 'the project'}.

If you could call me back at your convenience, that would be great. My number is [Your Phone Number].

Looking forward to speaking with you soon.`
}

// Helper function to generate follow-up email from call transcript
function generateFollowUpEmailFromCall(contact: any, deal: any, transcript: string): string {
  return `Dear ${contact?.name || 'there'},

Thank you for taking the time to speak with me today about the ${deal?.title || 'project'}. I appreciated hearing about your vision and challenges.

As we discussed, I'll be sending over [specific next steps mentioned in call] by [timeframe].

[Key points from conversation]

I'm excited about the possibility of working together on this project. Let's schedule a follow-up call next week to dive deeper into how we can support your goals.

Best regards,
Natascha Christ`
}

export default function DealStagesPage() {
  const params = useParams()
  const dealId = params.id as string
  const [deal, setDeal] = useState(mockDealData[dealId] || mockDealData['1'])
  const [chatMessages, setChatMessages] = useState<Array<{sender: 'user' | 'assistant', message: string, timestamp: string, sources?: Array<{title: string, url: string}>}>>([])
  const [inputValue, setInputValue] = useState('')
  const [showNewInfoNotification, setShowNewInfoNotification] = useState(false)
  const [sequenceDetailsExpanded, setSequenceDetailsExpanded] = useState(true)
  const [emailDraft, setEmailDraft] = useState('')
  const [emailSubject, setEmailSubject] = useState('Driving Façade Innovation at Universität Ulm')
  const [sentEmail, setSentEmail] = useState('') // Store the sent email content
  const [emailSentDate, setEmailSentDate] = useState<Date | null>(null) // Track when email was sent
  const [manualStepCompleted, setManualStepCompleted] = useState(false)
  const [expandedStep, setExpandedStep] = useState<number | null>(null) // Track which step is expanded
  const [hasShownNewInfoMessage, setHasShownNewInfoMessage] = useState(false)
  const emailBodyRef = useRef<HTMLTextAreaElement | null>(null)
  
  // Call functionality state
  const [showCallModal, setShowCallModal] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isCallRecording, setIsCallRecording] = useState(false)
  const [callTranscript, setCallTranscript] = useState('')
  const [callNotes, setCallNotes] = useState('')
  const [callOutcome, setCallOutcome] = useState<'success' | 'voicemail' | 'no-answer' | null>(null)
  const [phoneCallCompleted, setPhoneCallCompleted] = useState(false)
  const [callCompletedDate, setCallCompletedDate] = useState<Date | null>(null)
  const [sentVoicemailMessage, setSentVoicemailMessage] = useState('')
  const [followUpEmail, setFollowUpEmail] = useState('')

  // Initialize chat based on readiness status and email sent date
  useEffect(() => {
    const initialMessages: Array<{sender: 'user' | 'assistant', message: string, timestamp: string, sources?: Array<{title: string, url: string}>}> = []
    const daysSinceEmail = getDaysSince(emailSentDate)
    
    // Priority: Show email follow-up status if email was sent (manual sequence)
    if (manualStepCompleted && emailSentDate) {
      if (daysSinceEmail === 1) {
        initialMessages.push({
          sender: 'assistant' as const,
          message: `📧 Email Status Update\n\nYou sent the email to ${deal.outreach.primaryContact?.name || 'the contact'} yesterday. I've checked your inbox and haven't received a reply yet.\n\n⏰ If you don't receive a reply in the next 2 days, your next step will be to reach out via phone call as scheduled in the sequence.`,
          timestamp: 'Just now'
        })
      } else if (daysSinceEmail === 2) {
        initialMessages.push({
          sender: 'assistant' as const,
          message: `📧 Email Status Update\n\nYou sent the email to ${deal.outreach.primaryContact?.name || 'the contact'} ${daysSinceEmail} days ago. Still no reply in your inbox.\n\n⏰ Tomorrow will be 3 days since the email was sent. The phone call is scheduled for tomorrow if no reply is received. I'll remind you when it's time to make the call.`,
          timestamp: 'Just now'
        })
      } else if (daysSinceEmail !== null && daysSinceEmail >= 3 && !phoneCallCompleted) {
        initialMessages.push({
          sender: 'assistant' as const,
          message: `📞 Phone Call Scheduled\n\nIt's been ${daysSinceEmail} days since you sent the email to ${deal.outreach.primaryContact?.name || 'the contact'} with no reply. As scheduled in the sequence, it's time to make the follow-up phone call.\n\nI've prepared a personalized call script based on the project context and your email. Ready to make the call?`,
          timestamp: 'Just now'
        })
      } else if (phoneCallCompleted && callCompletedDate) {
        const daysSinceCall = getDaysSince(callCompletedDate)
        if (daysSinceCall !== null) {
          if (callOutcome === 'success') {
            initialMessages.push({
              sender: 'assistant' as const,
              message: `✅ Call completed successfully ${daysSinceCall === 0 ? 'today' : `${daysSinceCall} day${daysSinceCall > 1 ? 's' : ''} ago`}.\n\nI've generated a follow-up email based on your call transcript. You can review and send it directly.`,
              timestamp: 'Just now'
            })
          } else if (callOutcome === 'voicemail') {
            initialMessages.push({
              sender: 'assistant' as const,
              message: `📱 Voicemail left ${daysSinceCall === 0 ? 'today' : `${daysSinceCall} day${daysSinceCall > 1 ? 's' : ''} ago`}.\n\nIf you don't receive a callback or reply to the initial email in the next 3 days, the next step in the sequence will be triggered.`,
              timestamp: 'Just now'
            })
          }
        }
      }
    }
    
    // When new project information is discovered and the deal becomes ready,
    // show a discovery message prompting for primary contact confirmation.
    if (deal.outreach.readinessStatus === 'ready' && showNewInfoNotification && !hasShownNewInfoMessage) {
      const discoveryMessage = {
        sender: 'assistant' as const,
        message: `🎉 Great news! I've discovered new project information:\n\n${deal.outreach.readyTriggers}\n\n✅ This deal is now ready for outreach.\n\n👤 Important Update: We've identified a new contact!\nThe architectural office has announced that ${deal.outreach.primaryContact?.name} (${deal.outreach.primaryContact?.role}) is now the project lead for this renovation. This is a change from our previous contact information.\n\nDo you want to add ${deal.outreach.primaryContact?.name} as the primary contact for this outreach?`,
        timestamp: 'Just now',
        sources: deal.outreach.sources || []
      }
    
      // Always replace current chat with the discovery message so it's the first thing the user sees
      setChatMessages([discoveryMessage])
      setHasShownNewInfoMessage(true)
      return
    }
    
    // Default initial state when deal is not ready yet (only when chat is empty)
    if (deal.outreach.readinessStatus === 'not-ready' && chatMessages.length === 0) {
      initialMessages.push({
        sender: 'assistant' as const,
        message: `I'm analyzing this project's outreach timing.\n\n⚠️ Timing Status: Not Ready Yet\n\n${deal.outreach.readinessReason}\n\nI'm actively monitoring for facade-relevant signals like: first renderings, planning phase kickoff, material strategies, or envelope performance requirements. I'll alert you immediately when the timing becomes favorable.`,
        timestamp: 'Just now'
      })
      // Reset flag so if the deal becomes ready again later we can show the new-info message
      if (hasShownNewInfoMessage) {
        setHasShownNewInfoMessage(false)
      }
    }
    
    // Only initialize chat when it's currently empty, so we don't wipe out ongoing conversation
    if (initialMessages.length > 0 && chatMessages.length === 0) {
      setChatMessages(initialMessages)
    }
  }, [
    deal.outreach.readinessStatus,
    showNewInfoNotification,
    deal.outreach.readinessReason,
    deal.outreach.readyTriggers,
    deal.outreach.primaryContact,
    deal.outreach.sources,
    emailSentDate,
    manualStepCompleted,
    phoneCallCompleted,
    callOutcome,
    callCompletedDate,
    hasShownNewInfoMessage,
    chatMessages.length
  ])

  // Auto-size the manual email textarea so the full email body is visible by default
  useEffect(() => {
    if (!manualStepCompleted && emailBodyRef.current) {
      const el = emailBodyRef.current
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
  }, [emailDraft, manualStepCompleted])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    // Add user message
    const userMessage = {
      sender: 'user' as const,
      message: inputValue,
      timestamp: 'Just now'
    }
    setChatMessages(prev => [...prev, userMessage])
    
    // Generate assistant response
    setTimeout(() => {
      let assistantResponse = ''
      const normalizedInput = inputValue.toLowerCase()
      
      // Step 1: User confirms they want to add the new contact (YES)
      if (deal.outreach.readinessStatus === 'ready' && 
          deal.outreach.primaryContact?.isNew && 
          !deal.outreach.contactConfirmed && 
          (normalizedInput.includes('yes') || normalizedInput.includes('add'))) {
        
        // Confirm contact
        assistantResponse = `✅ Great! I've confirmed ${deal.outreach.primaryContact?.name} as the primary contact for this deal.\n\nNow, based on their role as ${deal.outreach.primaryContact?.role} and the current project phase (schematic design), I've identified the most relevant **architect-specific sequence**:\n\n📧 **\"Architect Early Spec - Facade Systems\"**\n\nThis is tailored for architects (different from how we'd talk to building owners, investors or GCs).\n\nNext, you can choose **how** you want to run this outreach:\n\n1) **Fully automated email sequence** – multi-step email campaign with follow-ups until there's a reply. You only get involved once the contact responds.\n2) **Manual, AI-supported sequence** – 3-step sequence with:\n   • Manual email (AI generates a personalized draft, you review & send)\n   • Follow-up phone call (AI-generated call script + note-taking support)\n   • Follow-up email (again AI-drafted for you to adjust and send)\n\nHow would you like to proceed for ${deal.outreach.primaryContact?.name} – **automated email-only** or **manual AI-supported**?`
        
        // Update state: contact is confirmed, now awaiting sequence confirmation
        setDeal((prev: any) => ({
          ...prev,
          outreach: {
            ...prev.outreach,
            contactConfirmed: true,
            awaitingSequenceConfirmation: true,
            sequence: {
              name: 'Architect Early Spec - Facade Systems',
              touchpoints: 3,
              duration: '3 steps',
            },
            sequenceMode: null,
          }
        }))
      
      // Step 1: User declines adding the new contact (NO)
      } else if (deal.outreach.readinessStatus === 'ready' &&
                 deal.outreach.primaryContact?.isNew &&
                 !deal.outreach.contactConfirmed &&
                 (normalizedInput.includes('no') || normalizedInput.includes("don't"))) {
        
        assistantResponse = `👍 Got it. I won't change the primary contact for this deal.\n\nYou can still ask me about outreach timing or sequences at any time.`
      
      // Step 2A: User chooses fully automated email sequence
      } else if (deal.outreach.contactConfirmed &&
                 deal.outreach.awaitingSequenceConfirmation &&
                 (normalizedInput.includes('automated') || normalizedInput.includes('email-only') || normalizedInput.includes('auto'))) {
        
        const enrollmentMessage = `✅ Got it. I've enrolled ${deal.outreach.primaryContact?.name} into a **fully automated, email-only sequence** based on the architect playbook.`
        
        const progressMessage = `📧 **Progress update:**\nI've just sent the **first automated architect outreach email** in the sequence and will now monitor your inbox for a reply from ${deal.outreach.primaryContact?.name}.\n\nIf you don't receive a reply within the next **3 days**, I'll automatically send **Follow-up Email 1** (case study + technical angle).\nIf there's still no reply after that, **Follow-up Email 2** (strong CTA + meeting proposal) is scheduled for **7 days from now**.\n\nYou don’t need to do anything for these emails – they’ll run automatically. I’ll surface this conversation again as soon as ${deal.outreach.primaryContact?.name} responds.`

        // Auto-generate and "send" the first email immediately
        const automatedEmail = `Dear Dr. Weber,

I saw you recently joined DEGLE.DEGLE Architekten as Lead Architect & Project Lead for the Universität Ulm renovation project - Congratulations! It's an exciting time in sustainable architecture and building envelope design.

Architects leading university projects often focus on balancing aesthetic vision with energy performance requirements and long-term durability.

We've helped [Similar University Project] achieve [Specific Performance Metric] while maintaining design flexibility and meeting strict sustainability standards. The project won recognition for its innovative façade integration approach.

I'd love to connect this week to discuss how we can support your vision for the Universität Ulm project, especially as you move into the schematic design phase.

Best regards,
Natascha Christ`

        setSentEmail(automatedEmail)
        setEmailSentDate(new Date())
        
        setDeal((prev: any) => ({
          ...prev,
          outreach: {
            ...prev.outreach,
            contactAddedToSequence: true,
            sequenceStatus: 'running',
            awaitingSequenceConfirmation: false,
            sequenceMode: 'automated',
          }
        }))

        // Add two separate assistant messages to the chat
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'assistant' as const,
            message: enrollmentMessage,
            timestamp: 'Just now'
          },
          {
            sender: 'assistant' as const,
            message: progressMessage,
            timestamp: 'Just now'
          }
        ])

        // We've already handled chat updates for this branch
        return
      
      // Step 2B: User chooses manual, AI-supported sequence
      } else if (deal.outreach.contactConfirmed && 
                 deal.outreach.awaitingSequenceConfirmation && 
                 (normalizedInput.includes('manual') || normalizedInput.includes('ai-supported') || normalizedInput.includes('ai supported'))) {
        
        const enrollmentManualMessage = `✅ Perfect. I've enrolled ${deal.outreach.primaryContact?.name} into a **manual, AI-supported architect sequence**.`
        
        const progressManualMessage = `✏️ **Step 1 – Manual email (AI-assisted)**\nBased on the project context and what we know about ${deal.outreach.primaryContact?.name}, I've drafted a **first outreach email** for you to review.\n\nYou can edit the email on the left in the **Sequence Status** section. Once you're happy with the content, click **“Send Email”** there and I'll mark Step 1 as completed and guide you to the follow-up phone call.`
        
        // Actually add to sequence and start it (manual mode)
        setDeal((prev: any) => ({
          ...prev,
          outreach: {
            ...prev.outreach,
            contactAddedToSequence: true,
            sequenceStatus: 'running',
            awaitingSequenceConfirmation: false,
            sequenceMode: 'manual',
          }
        }))
        
        // Generate email draft with dynamic variables
        setEmailSubject('Driving Façade Innovation at Universität Ulm')
        setEmailDraft(`Dear Dr. Weber,

I saw you recently joined DEGLE.DEGLE Architekten as Lead Architect & Project Lead for the Universität Ulm renovation project - congratulations on the new role.

For projects like Universität Ulm, architects often need to balance design intent with energy performance and long-term durability of the façade.

We've recently supported a university campus project with a high-performance façade system that improved thermal performance and daylight comfort while keeping a very clear architectural language. The project team highlighted the ease of coordination between architect, façade contractor and manufacturer as a key success factor.

I'd be happy to share a short case example and some façade concept options that could be relevant as you move into schematic design for Universität Ulm.

Best regards,
Natascha Christ`)
        
        // Add two separate assistant messages to the chat for manual flow
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'assistant' as const,
            message: enrollmentManualMessage,
            timestamp: 'Just now'
          },
          {
            sender: 'assistant' as const,
            message: progressManualMessage,
            timestamp: 'Just now'
          }
        ])

        // We've already handled chat updates for this branch
        return
      } else if (inputValue.toLowerCase().includes('why') && inputValue.toLowerCase().includes('not ready')) {
        assistantResponse = `Good question. In facade manufacturing, knowing the architect is NOT enough - we need the RIGHT TIMING.\n\n🚫 Why this is "Not Ready Yet":\n\n1. **Design Phase Status**\n   The architect won the competition but hasn't started the actual design contract yet. Winning ≠ immediate planning.\n\n2. **No Facade-Related Work**\n   • No renderings published\n   • No draft elevations exist\n   • No material strategies defined\n   • No envelope performance requirements mentioned\n\n3. **Project Still in Pre-Design**\n   The project is in early concept stage. Building massing, energy goals, and budget targets need to be set before facade design becomes relevant.\n\n📊 What I'm Monitoring:\n   • Planning phase officially starting\n   • First design visuals being released\n   • Materiality mentions (glass, metal, cladding)\n   • Sustainability/energy concepts\n   • Tender timeline announcements\n\nContacting now would be premature. The architect isn't ready to discuss facade systems yet.`
      } else if (inputValue.toLowerCase().includes('when') && inputValue.toLowerCase().includes('ready')) {
        assistantResponse = `Based on construction project timing patterns, I'm tracking specific signals that indicate when facade design becomes active.\n\n⏰ Timeline Indicators:\n\nFor this university renovation project, facade work typically begins during the **transition from Concept → Schematic Design**. This is the classic facade timing sweet spot.\n\n🎯 Signals I'm Watching For:\n\n**Strong Signals (Immediate outreach recommended):**\n• First renderings published online\n• Planning officially started (status update)\n• Project added to architect's portfolio\n• Materiality or envelope performance mentioned\n• Energy concept released\n• Tender date announced\n\n**Medium Signals (Watch closely):**\n• Building permit preparation started\n• New planning documents uploaded\n• Facade consultant added to team\n• Design brief published\n\n**Estimated Timeline:**\nBased on similar university projects, schematic design typically begins 4-8 weeks after competition win. I'm monitoring daily and will alert you immediately when any of these signals appear.\n\n✓ You'll be the first to know when the timing is right.`
      } else {
        assistantResponse = `I'm here to help you determine the optimal outreach timing for facade manufacturers.\n\n💡 Try asking me:\n• "Why is this not ready yet?"\n• "When will this become ready?"\n• "What signals are you monitoring?"\n\nRemember: In construction sales, timing is everything. The architect needs to be at the right project phase to discuss facade systems effectively.`
      }
      
      setChatMessages(prev => [...prev, {
        sender: 'assistant' as const,
        message: assistantResponse,
        timestamp: 'Just now'
      }])
    }, 800)
    
    setInputValue('')
  }

  const handleQuickAction = (action: string) => {
    if (action === 'explain-timing') {
      setInputValue('Why is this deal not ready yet?')
      setTimeout(() => handleSendMessage(), 100)
    } else if (action === 'when-ready') {
      setInputValue('When will this deal become ready?')
      setTimeout(() => handleSendMessage(), 100)
    } else if (action === 'confirm-contact-yes') {
      // Simulate user typing "yes" to confirm the new primary contact
      setInputValue('yes, add this as the primary contact')
      setTimeout(() => handleSendMessage(), 100)
    } else if (action === 'confirm-contact-no') {
      // Simulate user saying no to the new primary contact
      setInputValue("no, don't change the primary contact")
      setTimeout(() => handleSendMessage(), 100)
    } else if (action === 'sequence-automated') {
      // User chooses fully automated email sequence
      setInputValue('automated email-only sequence')
      setTimeout(() => handleSendMessage(), 100)
    } else if (action === 'sequence-manual') {
      // User chooses manual, AI-supported sequence
      setInputValue('manual AI-supported sequence')
      setTimeout(() => handleSendMessage(), 100)
    }
  }

  const simulateNewInformation = () => {
    // Simulate new project information being discovered (realistic construction triggers)
    setDeal((prev: any) => ({
      ...prev,
      outreach: {
        ...prev.outreach,
        readinessStatus: 'ready',
        readinessReason: 'Facade design phase is now active based on multiple project signals.',
        readyTriggers: `✓ First project renderings published on DEGLE.DEGLE website\n✓ Planning phase officially started (status updated from "competition" to "schematic design")\n✓ Project brief mentions sustainable envelope performance requirements\n✓ Early material strategy references glass curtain wall systems\n\nThese signals indicate the architect has moved into the facade definition phase - the ideal moment for manufacturer outreach.`,
        primaryContact: {
          name: 'Dr. Anna Weber',
          role: 'Lead Architect & Project Lead',
          company: 'DEGLE.DEGLE Architekten',
          isNew: true, // This is a newly discovered contact
        },
        contactConfirmed: false, // Explicitly set to false - user hasn't confirmed yet
        contactAddedToSequence: false, // Explicitly set to false - not added to sequence yet
        sequence: null, // Will be set when user confirms
        sources: [
          {
            title: 'DEGLE.DEGLE - Universität Ulm Project Page',
            url: 'https://degle-degle.de/projects/uni-ulm-renovation'
          },
          {
            title: 'Project Brief - Sustainable Envelope Requirements',
            url: 'https://vermoegenundbau-bw.de/documents/ulm-renovation-brief.pdf'
          },
          {
            title: 'Architecture Office Team Update',
            url: 'https://degle-degle.de/team/dr-anna-weber'
          }
        ]
      }
    }))
    setShowNewInfoNotification(true)
  }


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/pipelines"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Tower building UK/I</span>
              </Link>
              
              <div className="h-4 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-sm text-gray-600">5/12 deals from Stage Outreach</span>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronDown className="w-4 h-4 text-gray-600" style={{ transform: 'rotate(-90deg)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area with Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* OUTREACH STAGE VIEW */}
          <div className="flex-1 flex overflow-hidden">
              {/* Left Column - Outreach Objectives */}
              <div className="w-[60%] overflow-y-auto px-8 py-6">
                {/* Deal Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {deal.title}
                </h1>
                
                <div className="flex items-center space-x-3 mb-8">
                  <button className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                    <span className="text-sm font-medium">Stage: Outreach</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Simulate Buttons - for demo purposes */}
                <div className="mb-4 space-y-3">
                  <button
                    onClick={simulateNewInformation}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Simulate: New Project Information Discovered</span>
                  </button>
                  
                  {/* Time Simulation Controls - Only show if email was sent */}
                  {manualStepCompleted && emailSentDate && (
                    <div className="border border-gray-300 rounded-lg p-4 bg-yellow-50">
                      <p className="text-xs font-semibold text-gray-700 mb-3">⏱️ Prototype: Simulate Time Passing</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            const newDate = new Date()
                            newDate.setDate(newDate.getDate() - 1)
                            setEmailSentDate(newDate)
                            setChatMessages(prev => [...prev, {
                              sender: 'assistant' as const,
                              message: `📧 Email Status Update\n\nYou sent the email to ${deal.outreach.primaryContact?.name || 'the contact'} yesterday. I've checked your inbox and haven't received a reply yet.\n\n⏰ If you don't receive a reply in the next 2 days, your next step will be to reach out via phone call as scheduled in the sequence.`,
                              timestamp: 'Just now'
                            }])
                          }}
                          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
                        >
                          Simulate: 1 Day Later
                        </button>
                        <button
                          onClick={() => {
                            const newDate = new Date()
                            newDate.setDate(newDate.getDate() - 2)
                            setEmailSentDate(newDate)
                            setChatMessages(prev => [...prev, {
                              sender: 'assistant' as const,
                              message: `📧 Email Status Update\n\nYou sent the email to ${deal.outreach.primaryContact?.name || 'the contact'} 2 days ago. Still no reply in your inbox.\n\n⏰ Tomorrow will be 3 days since the email was sent. The phone call is scheduled for tomorrow if no reply is received. I'll remind you when it's time to make the call.`,
                              timestamp: 'Just now'
                            }])
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Simulate: 2 Days Later
                        </button>
                        <button
                          onClick={() => {
                            const newDate = new Date()
                            newDate.setDate(newDate.getDate() - 3)
                            setEmailSentDate(newDate)
                            setChatMessages(prev => [...prev, {
                              sender: 'assistant' as const,
                              message: `📞 Phone Call Scheduled\n\nIt's been 3 days since you sent the email to ${deal.outreach.primaryContact?.name || 'the contact'} with no reply. As scheduled in the sequence, it's time to make the follow-up phone call.\n\nI've prepared a personalized call script based on the project context and your email. Ready to make the call?`,
                              timestamp: 'Just now'
                            }])
                          }}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Simulate: 3 Days Later (Ready for Call)
                        </button>
                        <button
                          onClick={() => {
                            const newDate = new Date()
                            newDate.setDate(newDate.getDate() - 5)
                            setEmailSentDate(newDate)
                            setChatMessages(prev => [...prev, {
                              sender: 'assistant' as const,
                              message: `📞 Phone Call Scheduled\n\nIt's been 5 days since you sent the email to ${deal.outreach.primaryContact?.name || 'the contact'} with no reply. As scheduled in the sequence, it's time to make the follow-up phone call.\n\nI've prepared a personalized call script based on the project context and your email. Ready to make the call?`,
                              timestamp: 'Just now'
                            }])
                          }}
                          className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-medium rounded transition-colors"
                        >
                          Simulate: 5 Days Later
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-3">Current: Email sent {getDaysSince(emailSentDate) !== null ? `${getDaysSince(emailSentDate)} day${getDaysSince(emailSentDate)! > 1 ? 's' : ''} ago` : 'just now'}</p>
                    </div>
                  )}
                  
                  {/* Call Simulation Controls - Only show if call is available */}
                  {manualStepCompleted && getDaysSince(emailSentDate) !== null && getDaysSince(emailSentDate)! >= 3 && !phoneCallCompleted && (
                    <div className="border border-gray-300 rounded-lg p-4 bg-green-50">
                      <p className="text-xs font-semibold text-gray-700 mb-3">📞 Prototype: Simulate Call Outcomes</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            // Simulate successful call and complete it
                            setShowCallModal(true)
                            setTimeout(() => {
                              setIsCallActive(true)
                              setCallOutcome('success')
                              setCallTranscript('Had a great conversation with the contact. Discussed project requirements and timeline. They expressed interest in our facade solutions and asked for more detailed specifications. Scheduled a follow-up meeting next week.')
                              setCallNotes('Contact was very engaged. Mentioned budget approval is pending. Good timing for our proposal.')
                              setIsCallRecording(true)
                              
                              // Auto-complete after a moment to show the flow
                              setTimeout(() => {
                                setPhoneCallCompleted(true)
                                setCallCompletedDate(new Date())
                                setIsCallActive(false)
                                setShowCallModal(false)
                                
                                // Generate follow-up email
                                setFollowUpEmail(generateFollowUpEmailFromCall(deal.outreach.primaryContact, deal, 'Had a great conversation with the contact. Discussed project requirements and timeline. They expressed interest in our facade solutions and asked for more detailed specifications. Scheduled a follow-up meeting next week.'))
                                
                                // Add chat message
                                setChatMessages(prev => [...prev, {
                                  sender: 'assistant' as const,
                                  message: `✅ Call completed successfully!\n\nI've generated a follow-up email based on your call transcript. You can review and send it directly.`,
                                  timestamp: 'Just now'
                                }])
                              }, 2000)
                            }, 500)
                          }}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Simulate: Successful Call (Auto-complete)
                        </button>
                        <button
                          onClick={() => {
                            // Simulate voicemail and complete it
                            setShowCallModal(true)
                            setTimeout(() => {
                              setIsCallActive(true)
                              setCallOutcome('voicemail')
                              setSentVoicemailMessage(generateVoicemailMessage(deal, deal.outreach.primaryContact))
                              setCallNotes('Left voicemail message. No answer after multiple rings.')
                              
                              // Auto-complete after a moment
                              setTimeout(() => {
                                setPhoneCallCompleted(true)
                                setCallCompletedDate(new Date())
                                setIsCallActive(false)
                                setShowCallModal(false)
                                
                                // Add chat message
                                setChatMessages(prev => [...prev, {
                                  sender: 'assistant' as const,
                                  message: `📱 Voicemail left successfully.\n\nIf you don't receive a callback or reply to the initial email in the next 3 days, the next step in the sequence will be triggered.`,
                                  timestamp: 'Just now'
                                }])
                              }, 2000)
                            }, 500)
                          }}
                          className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Simulate: Voicemail Left (Auto-complete)
                        </button>
                        <button
                          onClick={() => {
                            // Simulate no answer and complete it
                            setShowCallModal(true)
                            setTimeout(() => {
                              setIsCallActive(true)
                              setCallOutcome('no-answer')
                              setCallNotes('No answer. Phone rang but went to voicemail without recording option.')
                              
                              // Auto-complete after a moment
                              setTimeout(() => {
                                setPhoneCallCompleted(true)
                                setCallCompletedDate(new Date())
                                setIsCallActive(false)
                                setShowCallModal(false)
                                
                                // Add chat message
                                setChatMessages(prev => [...prev, {
                                  sender: 'assistant' as const,
                                  message: `📞 Call attempt recorded.\n\nNo answer received. You may want to try again later or send a follow-up email.`,
                                  timestamp: 'Just now'
                                }])
                              }, 2000)
                            }, 500)
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Simulate: No Answer (Auto-complete)
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Reset Button */}
                  {(manualStepCompleted || phoneCallCompleted) && (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-700 mb-3">🔄 Reset Prototype State</p>
                      <button
                        onClick={() => {
                          setEmailSentDate(null)
                          setManualStepCompleted(false)
                          setPhoneCallCompleted(false)
                          setCallOutcome(null)
                          setCallTranscript('')
                          setCallNotes('')
                          setSentVoicemailMessage('')
                          setFollowUpEmail('')
                          setExpandedStep(null)
                          setChatMessages([])
                        }}
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Reset All Sequence Progress
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Outreach Objectives */}
                <div className="space-y-4">
                  {/* Objective 1 - Timing Verified */}
                  <div className={`bg-white rounded-lg p-6 ${
                    deal.outreach.readinessStatus === 'ready' 
                      ? 'border-2 border-green-200' 
                      : 'border-2 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Outreach Objective 1:</span>
                          <span className="text-sm font-semibold text-gray-900">Timing Verified</span>
                        </div>
                        
                        <div className={`rounded-lg p-4 ${
                          deal.outreach.readinessStatus === 'ready' 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <p className={`text-sm font-semibold ${
                            deal.outreach.readinessStatus === 'ready' ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {deal.outreach.readinessStatus === 'ready' 
                              ? '✓ Ready for Outreach' 
                              : '⚠ Not Ready Yet'
                            }
                          </p>
                        </div>
                        
                      </div>
                      <div className="ml-4">
                        {deal.outreach.readinessStatus === 'ready' ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Objective 2 - Primary Contact Validated */}
                  <div className={`bg-white rounded-lg p-6 ${
                    deal.outreach.primaryContact 
                      ? (deal.outreach.primaryContact.isNew && !deal.outreach.contactAddedToSequence && !deal.outreach.contactConfirmed
                          ? 'border-2 border-blue-400' 
                          : 'border-2 border-green-200')
                      : 'border-2 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Outreach Objective 2:</span>
                          <span className="text-sm font-semibold text-gray-900">Primary Contact Validated</span>
                        </div>
                        
                        {deal.outreach.primaryContact && (
                          <div className={`rounded-lg p-4 ${
                            deal.outreach.primaryContact.isNew && !deal.outreach.contactAddedToSequence && !deal.outreach.contactConfirmed
                              ? 'bg-blue-50 border-2 border-blue-400' 
                              : 'bg-green-50 border border-green-200'
                          }`}>
                            <div className="flex items-start space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                deal.outreach.primaryContact.isNew && !deal.outreach.contactAddedToSequence && !deal.outreach.contactConfirmed
                                  ? 'bg-blue-100' 
                                  : 'bg-indigo-100'
                              }`}>
                                <span className={`text-sm font-semibold ${
                                  deal.outreach.primaryContact.isNew && !deal.outreach.contactAddedToSequence && !deal.outreach.contactConfirmed
                                    ? 'text-blue-700' 
                                    : 'text-indigo-700'
                                }`}>
                                  {deal.outreach.primaryContact.name.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-semibold text-gray-900">{deal.outreach.primaryContact.name}</p>
                                  {deal.outreach.primaryContact.isNew && !deal.outreach.contactAddedToSequence && !deal.outreach.contactConfirmed && (
                                    <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs font-bold rounded border border-blue-400">
                                      NEW CONTACT
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{deal.outreach.primaryContact.role}</p>
                                <p className="text-xs text-gray-500 mt-1">{deal.outreach.primaryContact.company}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {deal.outreach.primaryContact ? (
                          deal.outreach.primaryContact.isNew && !deal.outreach.contactAddedToSequence && !deal.outreach.contactConfirmed ? (
                            <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Objective 3 - Contact Added to Sequence */}
                  <div className={`bg-white rounded-lg p-6 transition-all ${
                    deal.outreach.contactAddedToSequence 
                      ? 'border-2 border-green-200' 
                      : deal.outreach.contactConfirmed || deal.outreach.readinessStatus === 'ready'
                      ? 'border-2 border-blue-200'
                      : 'border border-gray-200 opacity-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Outreach Objective 3:</span>
                          <span className={`text-sm font-semibold ${
                            deal.outreach.contactAddedToSequence 
                              ? 'text-gray-900' 
                              : deal.outreach.contactConfirmed || deal.outreach.readinessStatus === 'ready'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}>
                            Contact Added to Sequence
                          </span>
                        </div>
                        
                        {deal.outreach.contactAddedToSequence ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-green-900 mb-1">✓ Contact Added Successfully</p>
                            <p className="text-sm text-green-800 mb-2">
                              {deal.outreach.primaryContact?.name} has been added to:
                            </p>
                            <div className="bg-white border border-green-200 rounded-lg p-3">
                              <p className="text-sm font-semibold text-gray-900 mb-1">{deal.outreach.sequence?.name}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-600">
                                <span>• {deal.outreach.sequence?.touchpoints} touchpoints</span>
                                <span>• {deal.outreach.sequence?.duration}</span>
                              </div>
                            </div>
                          </div>
                        ) : deal.outreach.contactConfirmed || deal.outreach.readinessStatus === 'ready' ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-blue-900">
                              {deal.outreach.contactConfirmed ? 'Contact Confirmed - Ready for Sequence' : 'Ready to Add Contact'}
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                              {deal.outreach.contactConfirmed 
                                ? `Confirm sequence selection in the Outreach Assistant to proceed.`
                                : `Use the Outreach Assistant to add ${deal.outreach.primaryContact?.name} to a sequence.`
                              }
                            </p>
                          </div>
                        ) : null}
                      </div>
                      <div className="ml-4">
                        {deal.outreach.contactAddedToSequence ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : deal.outreach.contactConfirmed || deal.outreach.readinessStatus === 'ready' ? (
                          <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Objective 4 - Sequence Status */}
                  <div className={`bg-white rounded-lg p-6 transition-all ${
                    deal.outreach.sequenceStatus === 'completed' 
                      ? 'border-2 border-green-200' 
                      : deal.outreach.sequenceStatus === 'running'
                      ? 'border-2 border-blue-200'
                      : deal.outreach.readinessStatus === 'ready'
                      ? 'border-2 border-blue-200'
                      : 'border border-gray-200 opacity-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Outreach Objective 4:</span>
                          <span className={`text-sm font-semibold ${
                            deal.outreach.sequenceStatus === 'not-started' && !deal.outreach.readinessStatus && !deal.outreach.contactConfirmed
                              ? 'text-gray-400' 
                              : 'text-gray-900'
                          }`}>
                            Sequence Status
                          </span>
                        </div>
                        
                        {deal.outreach.sequenceStatus === 'running' && (
                          <div className="space-y-3">
                            {/* Collapsible Header */}
                            <button
                              onClick={() => setSequenceDetailsExpanded(!sequenceDetailsExpanded)}
                              className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                  <div className="text-left">
                                    <p className="text-sm font-semibold text-blue-900">⚡ Sequence In Progress</p>
                                    <p className="text-xs text-blue-700 mt-0.5">
                                      {deal.outreach.sequenceMode === 'automated'
                                        ? 'Automated Email Sequence • 3 touchpoints'
                                        : `${manualStepCompleted ? (phoneCallCompleted ? 'Step 3/3' : 'Step 2/3') : 'Step 1/3'} • Manual AI-Supported Sequence`}
                                    </p>
                                  </div>
                                </div>
                                {sequenceDetailsExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width:
                                      deal.outreach.sequenceMode === 'automated'
                                        ? '33%'
                                        : manualStepCompleted
                                          ? phoneCallCompleted
                                            ? '100%'
                                            : '66%'
                                          : '33%',
                                  }}
                                ></div>
                              </div>
                            </button>
                            
                            {/* Expanded Content */}
                            {sequenceDetailsExpanded && (
                              <div className="bg-white border border-blue-200 rounded-lg p-4 space-y-4">
                                {/* Sequence Steps */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Sequence Steps</h4>
                                  
                                  {/* AUTOMATED EMAIL-ONLY SEQUENCE VS MANUAL, AI-SUPPORTED SEQUENCE */}
                                  {deal.outreach.sequenceMode === 'automated' ? (
                                    <div className="space-y-3">
                                      {/* Step 1 - Initial Outreach Email */}
                                      <div className="border-l-4 pl-4 border-green-500">
                                        {/* Header - clickable to expand sent email content */}
                                        <button
                                          type="button"
                                          onClick={() => setExpandedStep(expandedStep === 1 ? null : 1)}
                                          className="w-full flex items-start justify-between mb-2 hover:opacity-80 transition-opacity text-left"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <div>
                                              <p className="text-sm font-semibold text-blue-900">
                                                Step 1: Initial Architect Outreach Email
                                              </p>
                                              <p className="text-xs text-gray-600">
                                                Completed • Sent automatically to ${deal.outreach.primaryContact?.name || 'the contact'}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            {expandedStep === 1 ? (
                                              <ChevronUp className="w-4 h-4 text-gray-500" />
                                            ) : (
                                              <ChevronDown className="w-4 h-4 text-gray-500" />
                                            )}
                                          </div>
                                        </button>

                                        {/* Sent automated email content */}
                                        {expandedStep === 1 && sentEmail && (
                                          <div className="mt-2 bg-white border border-blue-200 rounded-lg p-3 text-xs text-gray-800 space-y-2">
                                            <div className="flex items-center justify-between mb-1">
                                              <p className="font-semibold text-gray-900">
                                                Sent Email: Initial Architect Outreach
                                              </p>
                                              {emailSentDate && (
                                                <p className="text-[11px] text-gray-500">
                                                  Sent just now
                                                </p>
                                              )}
                                            </div>
                                            <div className="border-t border-gray-200 pt-2 whitespace-pre-line">
                                              {sentEmail}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Step 2 - Follow-up Email 1 */}
                                      <div className="border-l-4 pl-4 border-blue-400">
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            <div>
                                              <p className="text-sm font-semibold text-blue-900">
                                                Step 2: Follow-up Email 1
                                              </p>
                                              <p className="text-xs text-gray-600">
                                                Scheduled in 3 days • Case study + technical angle
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Step 3 - Follow-up Email 2 */}
                                      <div className="border-l-4 pl-4 border-blue-300">
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <div>
                                              <p className="text-sm font-semibold text-blue-900">
                                                Step 3: Follow-up Email 2
                                              </p>
                                              <p className="text-xs text-gray-600">
                                                Scheduled in 7 days • Strong CTA & meeting proposal
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                  {/* MANUAL, AI-SUPPORTED SEQUENCE */}
                                  {/* Step 1 - Manual Email */}
                                  <div className={`border-l-4 pl-4 ${manualStepCompleted ? 'border-green-500' : 'border-blue-500'}`}>
                                    {/* Step Header - Clickable when completed */}
                                    {manualStepCompleted ? (
                                      <button
                                        onClick={() => setExpandedStep(expandedStep === 1 ? null : 1)}
                                        className="w-full flex items-start justify-between mb-2 hover:opacity-80 transition-opacity"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Check className="w-4 h-4 text-green-600" />
                                          <div className="text-left">
                                            <p className="text-sm font-semibold text-green-900">
                                              Step 1: Manual Email
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              Completed • Email sent
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Mail className="w-4 h-4 text-green-600" />
                                          {expandedStep === 1 ? (
                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                          )}
                                        </div>
                                      </button>
                                    ) : (
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                          <Clock className="w-4 h-4 text-blue-600" />
                                          <div>
                                            <p className="text-sm font-semibold text-blue-900">
                                              Step 1: Manual Email
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              Action Required • Draft ready for review
                                            </p>
                                          </div>
                                        </div>
                                        <Mail className="w-4 h-4 text-blue-600" />
                                      </div>
                                    )}
                                    
                                    {/* Email Draft - editable area when not completed */}
                                    {!manualStepCompleted && (
                                      <div className="mt-3 bg-gray-50 rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                          <p className="text-xs font-semibold text-gray-700">Email Draft (AI-generated)</p>
                                          <p className="text-[11px] text-gray-500">You can edit the subject and body before sending</p>
                                        </div>

                                        {/* Subject input */}
                                        <div className="mb-3">
                                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Subject
                                          </label>
                                          <input
                                            type="text"
                                            className="w-full text-sm text-gray-800 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                          />
                                        </div>

                                        {/* Body textarea */}
                                        <div>
                                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Email body
                                          </label>
                                          <textarea
                                            ref={emailBodyRef}
                                            className="w-full text-sm text-gray-800 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                            value={emailDraft}
                                            onChange={(e) => setEmailDraft(e.target.value)}
                                          />
                                        </div>
                                        
                                        <div className="mt-4 flex items-center justify-end space-x-3">
                                          <button
                                            onClick={() => {
                                              // Store the email content that was sent
                                              setSentEmail(emailDraft)
                                              setEmailSentDate(new Date()) // Track when email was sent
                                              setManualStepCompleted(true)
                                              setExpandedStep(1) // Auto-expand step 1 after sending
                                              setChatMessages(prev => [...prev, {
                                                sender: 'assistant' as const,
                                                message: `✅ Email sent successfully!\n\n📧 The first outreach email has been sent to ${deal.outreach.primaryContact?.name || 'the contact'}.\n\n⏰ Next Step: Phone call scheduled for 3 days from now (if no reply received).\n\nI'll monitor for any replies and update you on engagement.`,
                                                timestamp: 'Just now'
                                              }])
                                            }}
                                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                          >
                                            <Send className="w-4 h-4" />
                                            <span>Send Email</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Sent Email - Show when completed and expanded */}
                                    {manualStepCompleted && expandedStep === 1 && sentEmail && (
                                      <div className="mt-3 bg-green-50 rounded-lg border border-green-200 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <p className="text-xs font-semibold text-green-900">Email Sent</p>
                                          </div>
                                          <p className="text-xs text-green-700">Sent just now</p>
                                        </div>
                                        
                                        {/* Sent Email Content */}
                                        <div className="bg-white border border-green-200 rounded-lg p-4 text-sm text-gray-800 leading-relaxed space-y-3">
                                          <p className="font-semibold text-gray-900">
                                            Subject: {emailSubject}
                                          </p>
                                          
                                          <div className="border-t border-gray-200 pt-3 space-y-3 whitespace-pre-line">
                                            {sentEmail}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Step 2 - Phone Call */}
                                  <div className={`border-l-4 pl-4 ${phoneCallCompleted ? 'border-green-500' : manualStepCompleted ? 'border-blue-500' : 'border-gray-300'}`}>
                                    {/* Step Header - Clickable when completed */}
                                    {phoneCallCompleted ? (
                                      <button
                                        onClick={() => setExpandedStep(expandedStep === 2 ? null : 2)}
                                        className="w-full flex items-start justify-between mb-2 hover:opacity-80 transition-opacity"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Check className="w-4 h-4 text-green-600" />
                                          <div className="text-left">
                                            <p className="text-sm font-semibold text-green-900">
                                              Step 2: Follow-up Phone Call
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              {callOutcome === 'success' ? 'Completed • Call successful' : callOutcome === 'voicemail' ? 'Completed • Voicemail left' : 'Completed'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Phone className="w-4 h-4 text-green-600" />
                                          {expandedStep === 2 ? (
                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                          )}
                                        </div>
                                      </button>
                                    ) : (
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                          <Clock className={`w-4 h-4 ${manualStepCompleted && getDaysSince(emailSentDate) !== null && getDaysSince(emailSentDate)! >= 3 ? 'text-blue-600' : 'text-gray-400'}`} />
                                          <div>
                                            <p className={`text-sm font-semibold ${manualStepCompleted && getDaysSince(emailSentDate) !== null && getDaysSince(emailSentDate)! >= 3 ? 'text-blue-900' : 'text-gray-500'}`}>
                                              Step 2: Follow-up Phone Call
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              {manualStepCompleted 
                                                ? (getDaysSince(emailSentDate) !== null && getDaysSince(emailSentDate)! >= 3 
                                                  ? 'Ready to call • No email reply received' 
                                                  : `Scheduled in ${3 - (getDaysSince(emailSentDate) || 0)} days (if no email reply)`)
                                                : 'Pending Step 1 completion'}
                                            </p>
                                          </div>
                                        </div>
                                        <Phone className={`w-4 h-4 ${manualStepCompleted && getDaysSince(emailSentDate) !== null && getDaysSince(emailSentDate)! >= 3 ? 'text-blue-600' : 'text-gray-400'}`} />
                                      </div>
                                    )}
                                    
                                    {/* Call Action Button - Show when ready */}
                                    {manualStepCompleted && getDaysSince(emailSentDate) !== null && getDaysSince(emailSentDate)! >= 3 && !phoneCallCompleted && (
                                      <div className="mt-3">
                                        <button
                                          onClick={() => setShowCallModal(true)}
                                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                        >
                                          <Phone className="w-4 h-4" />
                                          <span>Start Phone Call</span>
                                        </button>
                                      </div>
                                    )}
                                    
                                    {/* Call Details - Show when completed and expanded */}
                                    {phoneCallCompleted && expandedStep === 2 && (
                                      <div className="mt-3 bg-green-50 rounded-lg border border-green-200 p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <p className="text-xs font-semibold text-green-900">
                                              Call {callOutcome === 'success' ? 'Completed Successfully' : callOutcome === 'voicemail' ? 'Voicemail Left' : 'Completed'}
                                            </p>
                                          </div>
                                          <p className="text-xs text-green-700">
                                            {callCompletedDate ? `${getDaysSince(callCompletedDate) === 0 ? 'Today' : `${getDaysSince(callCompletedDate)} day${getDaysSince(callCompletedDate)! > 1 ? 's' : ''} ago`}` : 'Just now'}
                                          </p>
                                        </div>
                                        
                                        {callTranscript && (
                                          <div className="bg-white border border-green-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Call Transcript:</p>
                                            <p className="text-xs text-gray-700 whitespace-pre-wrap">{callTranscript}</p>
                                          </div>
                                        )}
                                        
                                        {callNotes && (
                                          <div className="bg-white border border-green-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Call Notes:</p>
                                            <p className="text-xs text-gray-700 whitespace-pre-wrap">{callNotes}</p>
                                          </div>
                                        )}
                                        
                                        {callOutcome === 'voicemail' && sentVoicemailMessage && (
                                          <div className="bg-white border border-green-200 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Voicemail Message:</p>
                                            <p className="text-xs text-gray-700 whitespace-pre-wrap">{sentVoicemailMessage}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Step 3-5 - Automated */}
                                  <div className="border-l-4 border-gray-300 pl-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <div>
                                          <p className="text-sm font-semibold text-gray-500">
                                            Steps 3-5: Automated Follow-ups
                                          </p>
                                          <p className="text-xs text-gray-600">
                                            Value-add content + case studies + soft CTA
                                          </p>
                                        </div>
                                      </div>
                                      <Mail className="w-4 h-4 text-gray-400" />
                                    </div>
                                  </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {deal.outreach.sequenceStatus === 'completed' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-green-900 mb-1">✓ Sequence Completed</p>
                          </div>
                        )}
                        
                        {deal.outreach.sequenceStatus === 'not-started' && (deal.outreach.readinessStatus === 'ready' || deal.outreach.contactConfirmed) && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-blue-900">Ready to Start</p>
                            <p className="text-sm text-blue-700 mt-1">
                              {deal.outreach.contactConfirmed 
                                ? 'Sequence will start once you confirm in the Outreach Assistant.'
                                : 'Sequence will start once contact is added.'
                              }
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {deal.outreach.sequenceStatus === 'completed' ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : deal.outreach.sequenceStatus === 'running' ? (
                          <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                          </div>
                        ) : deal.outreach.readinessStatus === 'ready' || deal.outreach.contactConfirmed ? (
                          <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Outreach Assistant */}
              <div className="w-[40%] bg-white border-l border-gray-200 overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Send className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-bold text-gray-900">Outreach Assistant</h2>
                    </div>
                    <p className="text-sm text-gray-600">
                      Helps you understand the timing, choose sequences, and personalise your outreach.
                    </p>
                  </div>
                  
                  {/* Chat Area */}
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        {msg.sender === 'assistant' ? (
                          <>
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Send className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <p className="text-sm text-gray-900 whitespace-pre-line">
                                  {msg.message}
                                </p>
                                
                                {/* Action Button - Start Call */}
                                {msg.message.includes('Ready to make the call') && manualStepCompleted && getDaysSince(emailSentDate) !== null && getDaysSince(emailSentDate)! >= 3 && !phoneCallCompleted && (
                                  <div className="mt-3 pt-3 border-t border-gray-300">
                                    <button
                                      onClick={() => setShowCallModal(true)}
                                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                      <Phone className="w-4 h-4" />
                                      <span>Start Phone Call</span>
                                    </button>
                                  </div>
                                )}
                                
                                {/* Sources Section */}
                                {msg.sources && msg.sources.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-300">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">📎 Sources:</p>
                                    <div className="space-y-1.5">
                                      {msg.sources.map((source, sourceIdx) => (
                                        <a
                                          key={sourceIdx}
                                          href={source.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center space-x-2 text-xs text-indigo-600 hover:text-indigo-800 hover:underline group"
                                        >
                                          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                          <span className="truncate">{source.title}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                            </div>
                              </>
                            ) : (
                              <>
                            <div className="flex-1 flex justify-end">
                              <div>
                                <div className="bg-indigo-600 rounded-lg p-3">
                                  <p className="text-sm text-white whitespace-pre-line">
                                    {msg.message}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</p>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-gray-600">You</span>
                            </div>
                              </>
                            )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Action Buttons */}
                  {deal.outreach.readinessStatus === 'not-ready' && (
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Quick Actions</p>
                      
                      <button 
                        onClick={() => handleQuickAction('explain-timing')}
                        className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-left"
                      >
                        💡 Why is this not ready yet?
                      </button>
                      
                      <button 
                        onClick={() => handleQuickAction('when-ready')}
                        className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-left"
                      >
                        🕒 When will this become ready?
                      </button>
                    </div>
                  )}

                  {/* Contact Confirmation Quick Actions */}
                  {deal.outreach.readinessStatus === 'ready' &&
                   deal.outreach.primaryContact?.isNew &&
                   !deal.outreach.contactConfirmed && (
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                        Confirm New Primary Contact
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleQuickAction('confirm-contact-yes')}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                          Yes, set as primary contact
                        </button>
                        <button
                          onClick={() => handleQuickAction('confirm-contact-no')}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          No, keep existing contact
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sequence Mode Quick Actions */}
                  {deal.outreach.contactConfirmed &&
                   deal.outreach.awaitingSequenceConfirmation && (
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                        Choose Outreach Mode
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleQuickAction('sequence-automated')}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                          Fully automated email sequence
                        </button>
                        <button
                          onClick={() => handleQuickAction('sequence-manual')}
                          className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                        >
                          Manual, AI-supported sequence
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Message Input */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage()
                          }
                        }}
                        placeholder="Ask about outreach strategy..."
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Ask me anything about outreach timing, sequences, or personalization
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      
      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Phone Call with {deal.outreach.primaryContact?.name}</h2>
                  <p className="text-sm text-gray-600">{deal.outreach.primaryContact?.role} • {deal.outreach.primaryContact?.company}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isCallActive) {
                    setShowCallModal(false)
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isCallActive}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Side - Call Script and Controls */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Call Status */}
                {isCallActive && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-blue-900">Call in progress...</span>
                      {isCallRecording && (
                        <div className="flex items-center space-x-2 ml-4">
                          <Mic className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-red-600 font-medium">Recording</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-blue-700">00:00</div>
                  </div>
                )}
                
                {/* Phone Script */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-900">📞 Call Script</p>
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      Edit Script
                    </button>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {generatePhoneScript(deal, deal.outreach.primaryContact)}
                  </div>
                </div>
                
                {/* Voicemail Message - Show when voicemail outcome is selected */}
                {callOutcome === 'voicemail' && (
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-yellow-900">📱 Voicemail Message</p>
                      <button
                        onClick={() => {
                          if (!sentVoicemailMessage) {
                            setSentVoicemailMessage(generateVoicemailMessage(deal, deal.outreach.primaryContact))
                          }
                        }}
                        className="text-xs text-yellow-700 hover:text-yellow-900 font-medium"
                      >
                        {sentVoicemailMessage ? 'Edit' : 'Generate Message'}
                      </button>
                    </div>
                    {sentVoicemailMessage ? (
                      <textarea
                        value={sentVoicemailMessage}
                        onChange={(e) => setSentVoicemailMessage(e.target.value)}
                        className="w-full h-32 px-3 py-2 bg-white border border-yellow-200 rounded-lg text-sm text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Enter your voicemail message..."
                      />
                    ) : (
                      <div className="bg-white border border-yellow-200 rounded-lg p-4 text-sm text-gray-500 italic">
                        Click "Generate Message" to create a voicemail message template
                      </div>
                    )}
                    <p className="text-xs text-yellow-700 mt-2">This message will be left on their voicemail.</p>
                  </div>
                )}
                
                {/* Info Section - Before Call */}
                {!isCallActive && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-900">
                      <span className="font-semibold">💡 Tip:</span> If the contact doesn't answer, you can select "Voicemail" as the outcome and leave a pre-drafted message. The voicemail script will appear once you select that option.
                    </p>
                  </div>
                )}
                
                {/* Call Controls */}
                {!isCallActive ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setIsCallActive(true)
                        setCallOutcome(null)
                        setCallTranscript('')
                        setCallNotes('')
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Call</span>
                    </button>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCallRecording}
                        onChange={(e) => setIsCallRecording(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Record call (transcribe automatically)</span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Call Outcome Selection */}
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-900 mb-3">Call Outcome:</p>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => {
                            setCallOutcome('success')
                            // Auto-generate transcript placeholder
                            if (!callTranscript) {
                              setCallTranscript('Call transcript will be generated automatically from the recording...')
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            callOutcome === 'success'
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <Check className="w-5 h-5 mx-auto mb-2 text-green-600" />
                          <p className="text-xs font-semibold text-gray-900">Connected</p>
                          <p className="text-xs text-gray-600">Spoke with contact</p>
                        </button>
                        <button
                          onClick={() => {
                            setCallOutcome('voicemail')
                            setSentVoicemailMessage(generateVoicemailMessage(deal, deal.outreach.primaryContact))
                          }}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            callOutcome === 'voicemail'
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'border-gray-200 hover:border-yellow-300'
                          }`}
                        >
                          <MessageSquare className="w-5 h-5 mx-auto mb-2 text-yellow-600" />
                          <p className="text-xs font-semibold text-gray-900">Voicemail</p>
                          <p className="text-xs text-gray-600">Left message</p>
                        </button>
                        <button
                          onClick={() => setCallOutcome('no-answer')}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            callOutcome === 'no-answer'
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <X className="w-5 h-5 mx-auto mb-2 text-red-600" />
                          <p className="text-xs font-semibold text-gray-900">No Answer</p>
                          <p className="text-xs text-gray-600">Couldn't reach</p>
                        </button>
                      </div>
                    </div>
                    
                    {/* Call Transcript - Show when recording/connected */}
                    {(callOutcome === 'success' || isCallRecording) && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Call Transcript {isCallRecording && '(auto-generated from recording)'}
                        </label>
                        <textarea
                          value={callTranscript}
                          onChange={(e) => setCallTranscript(e.target.value)}
                          placeholder={isCallRecording ? "Transcript will appear here as the call is transcribed..." : "Enter call transcript or key points discussed..."}
                          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                    
                    {/* Call Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Call Notes</label>
                      <textarea
                        value={callNotes}
                        onChange={(e) => setCallNotes(e.target.value)}
                        placeholder="Add any additional notes about the call..."
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    {/* End Call Button */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setIsCallActive(false)
                          if (callOutcome) {
                            setPhoneCallCompleted(true)
                            setCallCompletedDate(new Date())
                            setShowCallModal(false)
                            
                            // Generate follow-up email if call was successful
                            if (callOutcome === 'success' && callTranscript) {
                              setFollowUpEmail(generateFollowUpEmailFromCall(deal.outreach.primaryContact, deal, callTranscript))
                            }
                            
                            // Add message to chat
                            if (callOutcome === 'success') {
                              setChatMessages(prev => [...prev, {
                                sender: 'assistant' as const,
                                message: `✅ Call completed successfully!\n\nI've generated a follow-up email based on your call transcript. You can review and send it directly.`,
                                timestamp: 'Just now'
                              }])
                            } else if (callOutcome === 'voicemail') {
                              setChatMessages(prev => [...prev, {
                                sender: 'assistant' as const,
                                message: `📱 Voicemail left successfully.\n\nIf you don't receive a callback or reply to the initial email in the next 3 days, the next step in the sequence will be triggered.`,
                                timestamp: 'Just now'
                              }])
                            }
                          }
                        }}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                      >
                        <Square className="w-5 h-5" />
                        <span>End Call & Save</span>
                      </button>
                      <button
                        onClick={() => setIsCallActive(false)}
                        className="px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Sidebar - Project Info */}
              <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Project Summary</h3>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Project</p>
                      <p className="text-sm font-semibold text-gray-900">{deal.title}</p>
                      <p className="text-xs text-gray-600">{deal.subtitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Company</p>
                      <p className="text-sm text-gray-900">{deal.company}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Deal Value</p>
                      <p className="text-sm font-semibold text-gray-900">{deal.value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Stage</p>
                      <p className="text-sm text-gray-900">{deal.stage}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Details</h3>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="text-sm font-semibold text-gray-900">{deal.outreach.primaryContact?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Role</p>
                      <p className="text-sm text-gray-900">{deal.outreach.primaryContact?.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Company</p>
                      <p className="text-sm text-gray-900">{deal.outreach.primaryContact?.company}</p>
                    </div>
                  </div>
                </div>
                
                {sentEmail && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Previous Email</h3>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <p className="text-xs text-gray-500 mb-2">Sent {emailSentDate ? `${getDaysSince(emailSentDate)} day${getDaysSince(emailSentDate)! > 1 ? 's' : ''} ago` : 'recently'}</p>
                      <button
                        onClick={() => setExpandedStep(1)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View email →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Follow-up Email Modal - Show after successful call */}
      {followUpEmail && phoneCallCompleted && callOutcome === 'success' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Follow-up Email After Call</h2>
                <p className="text-sm text-gray-600">Generated based on your call transcript</p>
              </div>
              <button
                onClick={() => setFollowUpEmail('')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {followUpEmail}
                </div>
                
                <div className="mt-4 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setFollowUpEmail('')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Mark follow-up email as sent
                      setFollowUpEmail('')
                      setChatMessages(prev => [...prev, {
                        sender: 'assistant' as const,
                        message: '✅ Follow-up email sent successfully!\n\nThe next automated steps in the sequence will continue as planned.',
                        timestamp: 'Just now'
                      }])
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

