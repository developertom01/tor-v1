'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

const PRESETS = [
  { label: 'All', min: undefined, max: undefined },
  { label: 'Under ₵100', min: undefined, max: 100 },
  { label: '₵100 – ₵300', min: 100, max: 300 },
  { label: '₵300 – ₵500', min: 300, max: 500 },
  { label: '₵500+', min: 500, max: undefined },
]

export default function PriceFilter({
  category,
  search,
  minPrice,
  maxPrice,
}: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
}) {
  const router = useRouter()
  const [customMin, setCustomMin] = useState(minPrice?.toString() ?? '')
  const [customMax, setCustomMax] = useState(maxPrice?.toString() ?? '')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function buildUrl(min?: number, max?: number) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    if (min != null) params.set('minPrice', min.toString())
    if (max != null) params.set('maxPrice', max.toString())
    const qs = params.toString()
    return qs ? `/products?${qs}` : '/products'
  }

  function applyPreset(min?: number, max?: number) {
    setCustomMin(min?.toString() ?? '')
    setCustomMax(max?.toString() ?? '')
    router.push(buildUrl(min, max))
  }

  function handleCustomChange() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const min = customMin ? parseFloat(customMin) : undefined
      const max = customMax ? parseFloat(customMax) : undefined
      if (min != null && isNaN(min)) return
      if (max != null && isNaN(max)) return
      router.push(buildUrl(min, max))
    }, 500)
  }

  const activePreset = PRESETS.findIndex(
    (p) => p.min === minPrice && p.max === maxPrice
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p, i) => (
        <button
          key={p.label}
          onClick={() => applyPreset(p.min, p.max)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activePreset === i
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {p.label}
        </button>
      ))}
      <div className="flex items-center gap-1.5 ml-1">
        <input
          type="number"
          placeholder="Min"
          value={customMin}
          onChange={(e) => { setCustomMin(e.target.value); handleCustomChange() }}
          onBlur={handleCustomChange}
          className="w-20 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
        />
        <span className="text-gray-400 text-xs">–</span>
        <input
          type="number"
          placeholder="Max"
          value={customMax}
          onChange={(e) => { setCustomMax(e.target.value); handleCustomChange() }}
          onBlur={handleCustomChange}
          className="w-20 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  )
}
