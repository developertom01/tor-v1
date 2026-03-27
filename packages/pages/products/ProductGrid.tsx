'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { getProducts } from '@tor/lib/actions/products'
import ProductCard from '@tor/ui/ProductCard'
import { ProductWithMedia } from '@tor/lib/types'

const PAGE_SIZE = 12

export default function ProductGrid({
  initialProducts,
  initialHasMore,
  category,
  search,
  minPrice,
  maxPrice,
}: {
  initialProducts: ProductWithMedia[]
  initialHasMore: boolean
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
}) {
  const [products, setProducts] = useState(initialProducts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Reset when filters change
  useEffect(() => {
    setProducts(initialProducts)
    setHasMore(initialHasMore)
  }, [initialProducts, initialHasMore])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const result = await getProducts({
        category,
        search,
        minPrice,
        maxPrice,
        limit: PAGE_SIZE,
        offset: products.length,
      })
      setProducts(prev => [...prev, ...result.products])
      setHasMore(result.hasMore)
    } catch {
      // ignore
    }
    setLoading(false)
  }, [loading, hasMore, products.length, category, search, minPrice, maxPrice])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0, rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  if (products.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product as ProductWithMedia} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="flex justify-center py-8">
        {loading && (
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-sm text-gray-400">You&apos;ve seen all products</p>
        )}
      </div>
    </>
  )
}
