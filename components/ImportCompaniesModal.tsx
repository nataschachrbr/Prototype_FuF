'use client'

import React, { useMemo, useState } from 'react'
import { X, Upload, AlertTriangle } from 'lucide-react'
import type { Company } from './CompanyList'
import type { Person } from '@/lib/people'

type MatchType = 'exact' | 'similar' | 'none'
type ImportDecision = 'skip' | 'create' | 'merge'

interface ImportedContact {
  name?: string
  email?: string
  phone?: string
  owner?: string
  jobTitle?: string
}

interface ImportedRow {
  id: string
  companyName: string
  employees?: number
  segment?: string
  location?: string
  contacts: ImportedContact[]
  matchType: MatchType
  existingCompany?: Company
  decision: ImportDecision
}

export interface ImportResult {
  companiesToAdd: Company[]
  peopleToAdd: Person[]
}

interface ImportCompaniesModalProps {
  isOpen: boolean
  onClose: () => void
  existingCompanies: Company[]
  onImport: (result: ImportResult) => void
}

function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function findBestCompanyMatch(
  name: string,
  companies: Company[]
): { type: MatchType; existingCompany?: Company } {
  const normalised = normaliseName(name)
  if (!normalised) return { type: 'none' }

  // Exact match on normalised name
  const exact = companies.find(
    (c) => normaliseName(c.name) === normalised
  )
  if (exact) return { type: 'exact', existingCompany: exact }

  // Simple similarity: starts with or contains
  const similar = companies.find((c) => {
    const n = normaliseName(c.name)
    return n.startsWith(normalised) || normalised.startsWith(n)
  })

  if (similar) return { type: 'similar', existingCompany: similar }

  return { type: 'none' }
}

// Very small CSV parser good enough for simple header-based imports
function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  if (lines.length < 2) return []

  const headerParts = lines[0].split(',').map((h) => h.trim())

  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',')
    const row: Record<string, string> = {}
    headerParts.forEach((key, index) => {
      row[key] = (parts[index] ?? '').trim()
    })
    rows.push(row)
  }
  return rows
}

export function ImportCompaniesModal({
  isOpen,
  onClose,
  existingCompanies,
  onImport,
}: ImportCompaniesModalProps) {
  const [importRows, setImportRows] = useState<ImportedRow[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasData = importRows.length > 0

  const stats = useMemo(() => {
    const total = importRows.length
    const exact = importRows.filter((r) => r.matchType === 'exact').length
    const similar = importRows.filter((r) => r.matchType === 'similar').length
    const none = importRows.filter((r) => r.matchType === 'none').length
    return { total, exact, similar, none }
  }, [importRows])

  if (!isOpen) return null

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsParsing(true)

    try {
      const text = await file.text()
      const rows = parseCsv(text)

      if (rows.length === 0) {
        setError('No rows found in CSV. Make sure the file has a header row and at least one data row.')
        setImportRows([])
        setIsParsing(false)
        return
      }

      const mapped: ImportedRow[] = rows.map((row, idx) => {
        const companyName =
          row.company ||
          row.company_name ||
          row.account ||
          row.account_name ||
          ''

        const employeesRaw =
          row.employees ||
          row.employee_count ||
          row.company_employees ||
          ''
        const employees = employeesRaw
          ? Number(employeesRaw.replace(/[^0-9]/g, ''))
          : undefined

        const segment =
          row.segment || row.company_segment || row.industry || undefined

        const location =
          row.location ||
          row.city ||
          row.country ||
          row.company_location ||
          undefined

        const contact: ImportedContact = {
          name:
            row.contact_name || row.name || row.full_name || undefined,
          email:
            row.contact_email || row.email || row.mail || undefined,
          phone:
            row.contact_phone || row.phone || row.tel || undefined,
          owner:
            row.owner ||
            row.contact_owner ||
            row.account_owner ||
            undefined,
          jobTitle:
            row.job_title ||
            row.role ||
            row.contact_job_title ||
            undefined,
        }

        const match = findBestCompanyMatch(companyName, existingCompanies)

        const defaultDecision: ImportDecision =
          match.type === 'none' ? 'create' : 'merge'

        return {
          id: `row-${idx}`,
          companyName,
          employees,
          segment,
          location,
          contacts: contact.name || contact.email ? [contact] : [],
          matchType: match.type,
          existingCompany: match.existingCompany,
          decision: defaultDecision,
        }
      })

      setImportRows(mapped)
    } catch (err) {
      console.error(err)
      setError('Failed to read or parse the CSV file.')
      setImportRows([])
    } finally {
      setIsParsing(false)
    }
  }

  const updateDecision = (rowId: string, decision: ImportDecision) => {
    setImportRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, decision } : r))
    )
  }

  const handleImport = () => {
    if (!hasData) return

    const companiesToAdd: Company[] = []
    const peopleToAdd: Person[] = []

    importRows.forEach((row, idx) => {
      if (row.decision === 'skip') return

      let targetCompany: Company | undefined = undefined

      if (row.decision === 'merge' && row.existingCompany) {
        targetCompany = row.existingCompany
      } else if (row.decision === 'create') {
        const newCompany: Company = {
          id: `import-${Date.now()}-${idx}`,
          name: row.companyName || 'Untitled company',
          employees: row.employees ?? 0,
          segment: row.segment ?? 'Imported',
          keywords: [],
          location: row.location ?? 'Unknown',
        }
        companiesToAdd.push(newCompany)
        targetCompany = newCompany
      }

      if (!targetCompany) return

      row.contacts.forEach((contact, contactIdx) => {
        const person: Person = {
          id: `import-person-${Date.now()}-${idx}-${contactIdx}`,
          name: contact.name || 'Unknown contact',
          jobTitle: contact.jobTitle || '',
          company: targetCompany!.name,
          owner: contact.owner || '',
          dealName: '',
          dealId: '',
          phone: contact.phone || '',
          email: contact.email || '',
          location: row.location || '',
          segment: row.segment || targetCompany!.segment,
        }
        peopleToAdd.push(person)
      })
    })

    onImport({ companiesToAdd, peopleToAdd })
    onClose()
    setImportRows([])
    setError(null)
  }

  const importableCount = importRows.filter(
    (r) => r.decision !== 'skip' && r.companyName
  ).length

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Import accounts & contacts
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Upload a CSV where each row represents a company (account) and optional related contact.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <label className="flex-1">
                <div className="border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 flex items-center justify-between hover:border-indigo-400 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {isParsing
                          ? 'Reading CSV...'
                          : 'Drop CSV here or click to browse'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expected headers like{' '}
                        <span className="font-mono">
                          company, contact_name, contact_email, contact_phone
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    .csv up to ~5MB
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isParsing}
                />
              </label>
            </div>
            {error && (
              <div className="mt-3 flex items-start space-x-2 text-xs text-red-600">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-auto px-6 py-4">
            {!hasData ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                Upload a CSV to preview accounts and resolve duplicates.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <span>
                      <span className="font-semibold">{stats.total}</span>{' '}
                      rows
                    </span>
                    <span className="h-3 w-px bg-gray-200" />
                    <span>
                      <span className="font-semibold">{stats.exact}</span>{' '}
                      exact matches
                    </span>
                    <span>
                      <span className="font-semibold">
                        {stats.similar}
                      </span>{' '}
                      similar matches
                    </span>
                    <span>
                      <span className="font-semibold">{stats.none}</span>{' '}
                      new accounts
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Decisions:{' '}
                    <span className="font-semibold">
                      {importableCount} accounts will be imported
                    </span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Company
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Segment
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Contact
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Match
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">
                          Decision
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {importRows.map((row) => (
                        <tr key={row.id}>
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-900">
                              {row.companyName || (
                                <span className="text-gray-400">
                                  (missing)
                                </span>
                              )}
                            </div>
                            {typeof row.employees === 'number' && (
                              <div className="text-[11px] text-gray-500">
                                {row.employees.toLocaleString()} employees
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {row.location || (
                              <span className="text-gray-400">–</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {row.segment || (
                              <span className="text-gray-400">–</span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {row.contacts.length === 0 ? (
                              <span className="text-gray-400">
                                No contact
                              </span>
                            ) : (
                              <>
                                <div className="text-gray-900">
                                  {row.contacts[0].name ||
                                    row.contacts[0].email ||
                                    'Contact'}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {row.contacts[0].email}
                                </div>
                              </>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {row.matchType === 'none' && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                                New account
                              </span>
                            )}
                            {row.matchType === 'exact' && row.existingCompany && (
                              <div className="space-y-1">
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 text-[11px] font-medium">
                                  Exact name match
                                </span>
                                <div className="text-[11px] text-gray-500">
                                  {row.existingCompany.name}
                                </div>
                              </div>
                            )}
                            {row.matchType === 'similar' && row.existingCompany && (
                              <div className="space-y-1">
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-medium">
                                  Similar name
                                </span>
                                <div className="text-[11px] text-gray-500">
                                  {row.existingCompany.name}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <select
                              className="block w-full border border-gray-300 rounded-md text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              value={row.decision}
                              onChange={(e) =>
                                updateDecision(
                                  row.id,
                                  e.target.value as ImportDecision
                                )
                              }
                            >
                              <option value="create">Create new</option>
                              {row.existingCompany && (
                                <option value="merge">
                                  Merge with existing
                                </option>
                              )}
                              <option value="skip">Do not import</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-xs text-gray-500">
              We will not overwrite existing companies. When merging, contacts
              from the CSV will be attached to the existing account.
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!hasData || importableCount === 0}
                onClick={handleImport}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold text-white shadow-sm ${
                  !hasData || importableCount === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Import {importableCount || ''}{' '}
                {importableCount === 1 ? 'account' : 'accounts'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


