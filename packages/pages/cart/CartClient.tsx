'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@tor/lib/cart-context'
import { formatPrice } from '@tor/lib/utils'

export default function CartClient() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Start shopping to add items to your cart.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-700 transition-colors"
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const image = item.product.product_media?.find(m => m.is_primary)?.url || item.product.product_media?.[0]?.url
          return (
            <div key={`${item.product.id}:${item.variant?.id || ''}`} className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100">
              {/* Image */}
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {image ? (
                  <Image src={image} alt={item.product.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`} className="font-semibold text-gray-900 hover:text-brand-600 line-clamp-1">
                  {item.product.name}
                </Link>
                {item.variant && (
                  <p className="text-xs text-gray-500">{item.variant.name}</p>
                )}
                <p className="text-sm text-gray-500 capitalize">{item.product.category}</p>
                <p className="font-bold text-gray-900 mt-1">{formatPrice(item.variant?.price ?? item.product.price)}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product.id, item.variant?.id)}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold text-xl text-gray-900">{formatPrice(totalPrice)}</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">Shipping calculated at checkout</p>
        <Link
          href="/checkout"
          className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-full text-center transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
