'use client'

import { useRouter } from 'next/navigation'
import { useRef, useCallback, useEffect } from 'react'

export default function SearchInput({ category, search, minPrice, maxPrice }: { category?: string; search?: string; minPrice?: number; maxPrice?: number }) {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const navigate = useCallback((value: string) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (value.trim()) params.set('search', value.trim())
    if (minPrice != null) params.set('minPrice', minPrice.toString())
    if (maxPrice != null) params.set('maxPrice', maxPrice.toString())
    const qs = params.toString()
    router.push(qs ? `/products?${qs}` : '/products')
  }, [category, minPrice, maxPrice, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (timerRef.current) clearTimeout(timerRef.current)
    const value = e.target.value
    timerRef.current = setTimeout(() => navigate(value), 400)
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (timerRef.current) clearTimeout(timerRef.current)
    navigate(e.target.value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (timerRef.current) clearTimeout(timerRef.current)
      navigate((e.target as HTMLInputElement).value)
    }
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search products..."
      defaultValue={search}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
    />
  )
}
