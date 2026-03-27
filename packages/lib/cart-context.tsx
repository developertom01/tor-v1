'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { CartItem, ProductWithMedia, ProductVariant } from './types'

function cartItemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}:${variantId}` : productId
}

function itemPrice(item: CartItem) {
  return item.variant?.price ?? item.product.price
}

function matchesItem(item: CartItem, productId: string, variantId?: string) {
  const key = cartItemKey(productId, variantId)
  return cartItemKey(item.product.id, item.variant?.id) === key
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: ProductWithMedia, quantity?: number, variant?: ProductVariant) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('hlg-cart')
    if (stored) {
      try { setItems(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('hlg-cart', JSON.stringify(items))
  }, [items, mounted])

  const addItem = useCallback((product: ProductWithMedia, quantity = 1, variant?: ProductVariant) => {
    setItems(prev => {
      const existing = prev.find(i => matchesItem(i, product.id, variant?.id))
      if (existing) {
        return prev.map(i =>
          matchesItem(i, product.id, variant?.id) ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { product, variant, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems(prev => prev.filter(i => !matchesItem(i, productId, variantId)))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => !matchesItem(i, productId, variantId)))
      return
    }
    setItems(prev => prev.map(i => matchesItem(i, productId, variantId) ? { ...i, quantity } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + itemPrice(i) * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
