export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price: number | null
  category: string
  in_stock: boolean
  stock_quantity: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  price: number
  compare_at_price: number | null
  stock_quantity: number
  in_stock: boolean
  is_default: boolean
  sort_order: number
  created_at: string
}

export interface ProductMedia {
  id: string
  product_id: string
  variant_id: string | null
  url: string
  type: 'image' | 'video'
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface ProductWithMedia extends Product {
  product_media: ProductMedia[]
  product_variants?: ProductVariant[]
}

export interface CartItem {
  product: ProductWithMedia
  variant?: ProductVariant
  quantity: number
}

export interface Order {
  id: string
  user_id: string | null
  customer_email: string
  customer_name: string
  customer_phone: string
  shipping_address: string
  city: string
  region: string
  total_amount: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paystack_reference: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_description: string | null
  product_image: string | null
  variant_id: string | null
  variant_name: string | null
  quantity: number
  unit_price: number
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'customer' | 'admin'
  created_at: string
}

export interface CustomerSummary {
  userId: string
  fullName: string
  email: string
  phone: string | null
  shippingAddress: string | null
  city: string | null
  region: string | null
}

export type CheckCustomerResult =
  | { existingCustomer: CustomerSummary }
  | { available: true }
