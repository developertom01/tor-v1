'use client'

import Image from 'next/image'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Play, ChevronLeft, ChevronRight, Volume2, VolumeX, Bell, Sparkles } from 'lucide-react'
import { ProductWithMedia, ProductVariant } from '@tor/lib/types'
import { formatPrice } from '@tor/lib/utils'
import AddToCartButton from '@tor/ui/AddToCartButton'
import Link from 'next/link'

export default function ProductDetailClient({ product }: { product: ProductWithMedia }) {
  const variants = product.product_variants?.sort((a, b) => a.sort_order - b.sort_order) || []
  const hasVariants = variants.length > 0
  const defaultVariant = variants.find(v => v.is_default) || variants[0]

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(defaultVariant)
  const [activeIndex, setActiveIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Resolve media: variant-specific media if available, else product-level
  const allMedia = product.product_media?.sort((a, b) => a.sort_order - b.sort_order) || []
  const media = useMemo(() => {
    if (selectedVariant) {
      const variantMedia = allMedia.filter(m => m.variant_id === selectedVariant.id)
      if (variantMedia.length > 0) return variantMedia
    }
    // Fall back to product-level media (no variant_id)
    return allMedia.filter(m => !m.variant_id)
  }, [allMedia, selectedVariant])

  const activeMedia = media[activeIndex]

  // Reset media index when variant changes
  useEffect(() => {
    setActiveIndex(0)
  }, [selectedVariant?.id])

  // Resolve price/stock from variant or product
  const displayPrice = selectedVariant?.price ?? product.price
  const compareAtPrice = selectedVariant?.compare_at_price ?? product.compare_at_price
  const inStock = selectedVariant ? selectedVariant.in_stock : product.in_stock
  const stockQty = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity

  // Auto-play video when it becomes active
  useEffect(() => {
    if (activeMedia?.type === 'video' && videoRef.current) {
      videoRef.current.muted = muted
      videoRef.current.play().catch(() => {})
    }
  }, [activeIndex, activeMedia?.type, muted])

  // Update muted state on current video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted])

  function goTo(index: number) {
    setActiveIndex(index)
    setMuted(true)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Media Gallery */}
      <div>
        {/* Main Media */}
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
          {activeMedia?.type === 'video' ? (
            <>
              <video
                ref={videoRef}
                src={activeMedia.url}
                muted={muted}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setMuted(m => !m)}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-colors z-10"
              >
                {muted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </>
          ) : activeMedia ? (
            <Image
              src={activeMedia.url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
              No media
            </div>
          )}

          {/* Nav arrows */}
          {media.length > 1 && (
            <>
              <button
                onClick={() => goTo((activeIndex - 1 + media.length) % media.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => goTo((activeIndex + 1) % media.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {media.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {media.map((m, i) => (
              <button
                key={m.id}
                onClick={() => goTo(i)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  i === activeIndex ? 'border-brand-500' : 'border-transparent'
                }`}
              >
                {m.type === 'video' ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-500 fill-gray-500" />
                  </div>
                ) : (
                  <Image src={m.url} alt="" fill className="object-cover" sizes="80px" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <p className="text-sm text-brand-600 font-medium uppercase tracking-wider mb-2">
          {product.category}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(displayPrice)}</span>
          {compareAtPrice && compareAtPrice > displayPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">{formatPrice(compareAtPrice)}</span>
              <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                {Math.round((1 - displayPrice / compareAtPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Variant Selector */}
        {hasVariants && (
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Options</label>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    selectedVariant?.id === v.id
                      ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50/50'
                  } ${!v.in_stock ? 'opacity-60' : ''}`}
                >
                  <span className="block">{v.name}</span>
                  <span className={`block text-xs mt-0.5 ${selectedVariant?.id === v.id ? 'text-brand-600' : 'text-gray-500'}`}>
                    {formatPrice(v.price)}
                    {!v.in_stock && ' · Sold out'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

        {/* Stock Status */}
        <div className="mt-6">
          {inStock ? (
            <p className="text-green-600 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              In Stock ({stockQty} available)
            </p>
          ) : (
            <p className="text-red-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Out of Stock
            </p>
          )}
        </div>

        {inStock ? (
          <>
            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-full">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  +
                </button>
              </div>
              <AddToCartButton product={product} quantity={quantity} variant={selectedVariant} className="flex-1 min-w-[200px]" />
            </div>

            {/* Custom order request for in-stock products */}
            <div className="mt-4 border border-gray-100 rounded-2xl p-4">
              <p className="text-sm text-gray-500 mb-3">
                Want a different specification? Request a custom order with your preferred color, length, or delivery date.
              </p>
              <Link
                href={`/products/${product.slug}/request?type=custom`}
                className="w-full border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Request Custom Order
              </Link>
            </div>
          </>
        ) : (
          /* Request CTA for out of stock */
          <div className="mt-8 border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-gray-900">Want This Product?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              This item is currently out of stock. Submit a request and we&apos;ll notify you when it&apos;s available.
            </p>
            <Link
              href={`/products/${product.slug}/request`}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Request This Product
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
