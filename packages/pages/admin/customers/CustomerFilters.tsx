'use client'

import { useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useDebounce } from '@tor/lib/useDebounce'

export default function CustomerFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const dateFrom = searchParams.get('dateFrom') || ''
  const dateTo = searchParams.get('dateTo') || ''

  const [query, setQuery] = useState(search)
  const [from, setFrom] = useState(dateFrom)
  const [to, setTo] = useState(dateTo)
  const [showFilters, setShowFilters] = useState(!!(dateFrom || dateTo))

  const filterKey = `${search}|${dateFrom}|${dateTo}`
  const [lastKey, setLastKey] = useState(filterKey)
  if (filterKey !== lastKey) {
    setLastKey(filterKey)
    setQuery(search)
    setFrom(dateFrom)
    setTo(dateTo)
  }

  const hasActiveFilters = !!(search || dateFrom || dateTo)

  const pushFilters = useCallback((q: string, f: string, t: string) => {
    const params = new URLSearchParams()
    if (q) params.set('search', q)
    if (f) params.set('dateFrom', f)
    if (t) params.set('dateTo', t)
    router.push(`${pathname}${params.toString() ? `?${params}` : ''}`)
  }, [router, pathname])

  function clearFilters() {
    setQuery('')
    setFrom('')
    setTo('')
    router.push(pathname)
  }

  // Debounce search (400ms) and filters (300ms — dates are discrete picks)
  useDebounce(() => {
    if (query !== search) pushFilters(query, from, to)
  }, 400, [query])

  useDebounce(() => {
    if (from !== dateFrom || to !== dateTo) pushFilters(query, from, to)
  }, 300, [from, to])

  return (
    <div className="mb-4 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer name..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
            showFilters || hasActiveFilters
              ? 'border-brand-300 text-brand-600 bg-brand-50'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Last order from</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Last order to</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
