'use client'

import { ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@tor/lib/cart-context'
import { ProductWithMedia, ProductVariant } from '@tor/lib/types'
import { useState } from 'react'

export default function AddToCartButton({
  product,
  quantity = 1,
  variant,
  className = '',
}: {
  product: ProductWithMedia
  quantity?: number
  variant?: ProductVariant
  className?: string
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product, quantity, variant)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const hasVariants = (product.product_variants?.length ?? 0) > 0
  const inStock = variant ? variant.in_stock : product.in_stock

  if (!inStock) {
    return (
      <button disabled className={`bg-gray-300 text-gray-500 cursor-not-allowed font-semibold py-3 px-6 rounded-full ${className}`}>
        Out of Stock
      </button>
    )
  }

  if (hasVariants && !variant) {
    return (
      <button disabled className={`bg-gray-300 text-gray-500 cursor-not-allowed font-semibold py-3 px-6 rounded-full ${className}`}>
        Select a Variant
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className={`flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-full transition-all duration-300 ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-lg'
      } ${className}`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added!
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  )
}
