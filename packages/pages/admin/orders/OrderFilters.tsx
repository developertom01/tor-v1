'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useDebounce } from '@tor/lib/useDebounce'

export default function OrderFilters({
  search,
  dateFrom,
  dateTo,
  priceMin,
  priceMax,
  status,
}: {
  search?: string
  dateFrom?: string
  dateTo?: string
  priceMin?: string
  priceMax?: string
  status?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState(search || '')
  const [showFilters, setShowFilters] = useState(!!(dateFrom || dateTo || priceMin || priceMax))
  const [from, setFrom] = useState(dateFrom || '')
  const [to, setTo] = useState(dateTo || '')
  const [minPrice, setMinPrice] = useState(priceMin || '')
  const [maxPrice, setMaxPrice] = useState(priceMax || '')

  const push = useCallback((vals: Record<string, string>) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    for (const [key, val] of Object.entries(vals)) {
      if (val) params.set(key, val)
    }
    router.push(`/admin/orders${params.toString() ? `?${params}` : ''}`)
  }, [router, status])

  function allValues(overrides?: Record<string, string>) {
    return { search: query, dateFrom: from, dateTo: to, priceMin: minPrice, priceMax: maxPrice, ...overrides }
  }

  function clearFilters() {
    setQuery('')
    setFrom('')
    setTo('')
    setMinPrice('')
    setMaxPrice('')
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    router.push(`/admin/orders${params.toString() ? `?${params}` : ''}`)
  }

  const hasActiveFilters = !!(search || dateFrom || dateTo || priceMin || priceMax)

  // Debounce text inputs (400ms)
  useDebounce(() => {
    if (query !== (search || '')) push(allValues({ search: query }))
  }, 400, [query])

  // Debounce date/price filters (300ms)
  useDebounce(() => {
    if (from !== (dateFrom || '') || to !== (dateTo || '') || minPrice !== (priceMin || '') || maxPrice !== (priceMax || '')) {
      push(allValues({ dateFrom: from, dateTo: to, priceMin: minPrice, priceMax: maxPrice }))
    }
  }, 300, [from, to, minPrice, maxPrice])

  return (
    <div className="mb-4 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer, product, reference..."
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
        <div className="bg-white border border-gray-200 rounded-xl p-4 animate-dropdown" style={{ transformOrigin: 'top' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Date from</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Date to</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Min price (GH₵)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Max price (GH₵)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-300 focus:border-transparent outline-none"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
