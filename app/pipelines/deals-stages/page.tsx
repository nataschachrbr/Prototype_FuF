'use client'

import { Sidebar } from '@/components/Sidebar'
import Link from 'next/link'
import { Mail, Phone, Reply, Zap, Clock, ArrowRight, Sparkles } from 'lucide-react'

export default function DealStagesDigestPage() {
  // For this prototype the digest is static but written as if it reflects
  // what happened after the first sequence step (manual or automatic).
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Deal Stage Outreach</h1>
                <p className="text-xs text-gray-500">
                  Daily digest across your automated and manual outreach for deals in the Outreach stage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6 space-y-6">
          {/* Daily Digest Email at the very top */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border border-indigo-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">
                      Daily Outreach Digest
                    </p>
                    <p className="text-sm text-gray-600">
                      What needs your attention today across automated and manual sequences.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">
                  Sent today at 08:00
                </span>
              </div>

              <div className="px-5 sm:px-6 py-4 space-y-6">
                {/* Manual steps due today */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Manual steps due today
                    </h2>
                    <span className="text-[11px] text-gray-500">1 task</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Call follow-up for <span className="font-semibold">M25 Highways Upgrade</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Based on the manual sequence, the first email to{' '}
                          <span className="font-semibold">Sarah Mitchell (Kier Group)</span> was sent 3 days ago.
                          Today the phone call task is due.
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          The call assistant has prepared a scripted call flow and will capture notes and a follow-up email for you.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/pipelines/deals-stages/4"
                      className="ml-4 inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Open deal
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>

                {/* Replies received */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Replies received
                    </h2>
                    <span className="text-[11px] text-gray-500">2 conversations</span>
                  </div>
                  <div className="space-y-2">
                    {/* Positive reply – move to meeting */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <Reply className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Positive reply from <span className="font-semibold">Dr. Anna Weber</span> – Universität Ulm
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Your fully automated architect sequence for{' '}
                            <span className="font-semibold">HS2 Rail Infrastructure Package</span> received a positive
                            reply after the first email. The outreach assistant pauses the sequence and suggests the
                            best way to move into meeting booking.
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Recommended next step: propose 2–3 concrete time slots and bring 1–2 highly relevant
                            reference projects into the call.
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/pipelines/deals-stages/3"
                        className="ml-4 inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Review reply
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>

                    {/* Negative / no-fit reply – suggest other projects or disqualify */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                          <Reply className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            No-fit reply from <span className="font-semibold">architect contact</span>
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            In this sequence the architect replied that the **current project is already covered** and a
                            façade partner is in place, so there is no room to collaborate on this opportunity.
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            The outreach assistant proposes two paths: reply once more to explore **other projects** in
                            their pipeline, or **disqualify the deal** for this project and stop further outreach while
                            keeping the relationship warm.
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/pipelines/deals-stages/7"
                        className="ml-4 inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Review no-fit reply
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Automatic emails and follow-ups sent */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Automatic emails & follow-ups sent
                    </h2>
                    <span className="text-[11px] text-gray-500">2 steps</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            First automated email sent –{' '}
                            <span className="font-semibold">HS2 Rail Infrastructure Package</span>
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Initial architect outreach email sent to{' '}
                            <span className="font-semibold">Dr. Anna Weber</span>. Monitoring inbox for replies.
                          </p>
                        </div>
                      </div>
                      <span className="ml-4 text-[11px] text-gray-500 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Today
                      </span>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Follow-up Email 1 sent automatically –{' '}
                            <span className="font-semibold">Healthcare Facilities Programme</span>
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            No reply after 3 days to the first email. The system has sent Follow-up Email 1 with a
                            short case reference and is now monitoring for a reply.
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/pipelines/deals-stages/5"
                        className="ml-4 inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        View sequence
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Time saved summary */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-yellow-300" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Time saved this week
                        </p>
                        <p className="text-sm text-gray-600">
                          Automated outreach and AI-assisted follow-ups have saved you an estimated{' '}
                          <span className="font-semibold text-gray-900">6.5 hours</span> of manual work this week.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <p className="text-gray-500">Automatic emails</p>
                        <p className="font-semibold text-gray-900">14</p>
                        <p className="text-gray-500 mt-0.5">≈ 2.3h saved</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <p className="text-gray-500">Follow-ups automated</p>
                        <p className="font-semibold text-gray-900">6</p>
                        <p className="text-gray-500 mt-0.5">≈ 1.5h saved</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <p className="text-gray-500">AI-drafted content</p>
                        <p className="font-semibold text-gray-900">9 emails / notes</p>
                        <p className="text-gray-500 mt-0.5">≈ 2.7h saved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional helper text below digest so the rest of the page can be reused later */}
          <div className="max-w-5xl mx-auto text-xs text-gray-500">
            This daily digest is a prototype. In a live system it would be generated from real inbox activity,
            sequence events, and task scheduling – but the links already take you into fully mocked deals so you can
            walk through each scenario end-to-end.
          </div>
        </div>
      </div>
    </div>
  )
}


