'use client'

import Link from 'next/link'
import { Image } from '@imagekit/next'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Play } from 'lucide-react'
import { ProductWithMedia } from '@tor/lib/types'
import { formatPrice } from '@tor/lib/utils'

function toImageKitPath(url: string) {
  try {
    const { hostname, pathname } = new URL(url)
    if (hostname.endsWith('.supabase.co')) return pathname
  } catch {}
  return url
}

export default function ProductCard({ product }: { product: ProductWithMedia }) {
  const media = product.product_media?.sort((a, b) => a.sort_order - b.sort_order) || []
  const hasMultiple = media.length > 1
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const activeMedia = media[activeIndex] || media[0]

  const startCarousel = useCallback(() => {
    if (!hasMultiple) return
    intervalRef.current = setInterval(() => {
      setActiveIndex(i => (i + 1) % media.length)
    }, 3000)
  }, [hasMultiple, media.length])

  const stopCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopCarousel()
  }, [stopCarousel])

  // Auto-play video when it becomes active
  useEffect(() => {
    if (activeMedia?.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [activeIndex, activeMedia?.type])

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={startCarousel}
      onMouseLeave={() => {
        stopCarousel()
        setActiveIndex(0)
      }}
    >
      {/* Media */}
      <div className="relative aspect-[4/5] bg-[#f8f8f8] overflow-hidden flex items-center justify-center">
        {activeMedia ? (
          activeMedia.type === 'video' ? (
            <video
              ref={videoRef}
              src={activeMedia.url}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={toImageKitPath(activeMedia.url)}
              alt={product.name}
              fill
              transformation={[{ width: '600', height: '750', cropMode: 'pad_resize', background: 'f8f8f8', focus: 'auto' }]}
              className="object-contain p-2 transition-opacity duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}

        {/* Video badge */}
        {media.some(m => m.type === 'video') && activeMedia?.type !== 'video' && (
          <div className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
        )}

        {/* Carousel dots */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Sale badge */}
        {product.compare_at_price && product.compare_at_price > product.price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            SALE
          </div>
        )}

        {/* Out of stock — subtle badge, no overlay */}
        {!product.in_stock && (
          <div className="absolute top-3 right-3 bg-gray-900/70 text-white text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
            Out of Stock
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-brand-600 font-medium uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          {(product.product_variants?.length ?? 0) > 0 ? (
            <span className="text-lg font-bold text-gray-900">
              From {formatPrice(Math.min(...product.product_variants!.map(v => v.price)))}
            </span>
          ) : (
            <>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
