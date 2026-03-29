'use server'

import { createClient } from '../supabase/server'
import { supabaseAdmin } from '../supabase/admin'
import { revalidatePath } from 'next/cache'
import { CartItem } from '../types'
import { logger } from '../logger'
import { getStoreId } from '../store-id'

export async function createOrder(formData: FormData, cartItems: CartItem[], totalAmount: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const storeId = getStoreId()
  const reference = `${storeId.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

  logger.info({ reference, userId: user?.id, totalAmount, itemCount: cartItems.length }, 'Creating order')

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id || null,
      customer_email: formData.get('email') as string,
      customer_name: formData.get('name') as string,
      customer_phone: formData.get('phone') as string,
      shipping_address: formData.get('address') as string,
      city: formData.get('city') as string,
      region: formData.get('region') as string,
      total_amount: totalAmount,
      status: 'pending',
      paystack_reference: reference,
      store_id: storeId,
    })
    .select()
    .single()

  if (error) {
    logger.error({ error, reference }, 'Failed to create order')
    throw error
  }

  const orderItems = cartItems.map(item => {
    const primaryMedia = item.product.product_media?.find(m => m.is_primary) || item.product.product_media?.[0]
    return {
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_description: item.product.description || null,
      product_image: primaryMedia?.url || null,
      variant_id: item.variant?.id || null,
      variant_name: item.variant?.name || null,
      quantity: item.quantity,
      unit_price: item.variant?.price ?? item.product.price,
    }
  })

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) {
    logger.error({ error: itemsError, orderId: order.id }, 'Failed to insert order items')
    throw itemsError
  }

  await logStatusChange(order.id, 'pending')

  // Send unpaid confirmation email (non-blocking)
  sendOrderConfirmation(order.id, false).catch(() => {})

  logger.info({ orderId: order.id, reference }, 'Order created successfully')
  return { orderId: order.id, reference }
}

export async function sendOrderConfirmation(orderId: string, paid: boolean) {
  try {
    const fullOrder = await fetchFullOrder(orderId)
    if (!fullOrder) {
      logger.warn({ orderId }, 'Could not fetch order for confirmation email')
      return
    }
    const { sendOrderConfirmationEmail } = await import('../email')
    await sendOrderConfirmationEmail({ order: fullOrder, paid })
    logger.info({ orderId, paid, email: fullOrder.customer_email }, 'Order confirmation email sent')
  } catch (err) {
    logger.error({ error: err, orderId }, 'Failed to send order confirmation email')
  }
}

export interface OrderFilters {
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
  priceMin?: string
  priceMax?: string
}

export async function getOrders(filters: OrderFilters = {}, offset = 0, limit = 10) {
  const supabase = await createClient()
  let query = supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .eq('store_id', getStoreId())
    .order('created_at', { ascending: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom)
  }
  if (filters.dateTo) {
    const endDate = new Date(filters.dateTo)
    endDate.setDate(endDate.getDate() + 1)
    query = query.lt('created_at', endDate.toISOString())
  }
  if (filters.priceMin) {
    query = query.gte('total_amount', parseFloat(filters.priceMin))
  }
  if (filters.priceMax) {
    query = query.lte('total_amount', parseFloat(filters.priceMax))
  }

  // Only paginate when not doing client-side search
  if (!filters.search) {
    query = query.range(offset, offset + limit - 1)
  }

  const { data, count, error } = await query
  if (error) {
    logger.error({ error, filters }, 'Failed to fetch orders')
    throw error
  }

  // Client-side filter for product name/description search (cross-table)
  if (filters.search) {
    const term = filters.search.toLowerCase()
    const filtered = data.filter(order =>
      order.customer_name?.toLowerCase().includes(term) ||
      order.customer_email?.toLowerCase().includes(term) ||
      order.paystack_reference?.toLowerCase().includes(term) ||
      order.order_items?.some((item: { product_name?: string; product_description?: string }) =>
        item.product_name?.toLowerCase().includes(term) ||
        item.product_description?.toLowerCase().includes(term)
      )
    )
    return { orders: filtered, total: filtered.length }
  }

  return { orders: data, total: count ?? data.length }
}

export interface CustomerFilters {
  search?: string
  dateFrom?: string
  dateTo?: string
}

export async function getCustomers(filters: CustomerFilters = {}) {
  const { data, error } = await supabaseAdmin.rpc('get_customers', { p_store_id: getStoreId() })
  if (error) {
    logger.error({ error }, 'Failed to fetch customers')
    throw error
  }
  let customers = (data as {
    user_id: string | null
    customer_email: string
    customer_name: string
    customer_phone: string
    order_count: number
    total_spent: number
    last_order_at: string
  }[]).map(c => ({
    ...c,
    slug: c.user_id || Buffer.from(c.customer_email).toString('base64url'),
  }))

  if (filters.search) {
    const term = filters.search.toLowerCase()
    customers = customers.filter(c => c.customer_name?.toLowerCase().includes(term))
  }
  if (filters.dateFrom) {
    customers = customers.filter(c => c.last_order_at >= `${filters.dateFrom}T00:00:00`)
  }
  if (filters.dateTo) {
    customers = customers.filter(c => c.last_order_at <= `${filters.dateTo}T23:59:59`)
  }

  return customers
}

export async function getCustomerBySlug(slug: string) {
  // Determine if slug is a UUID (user_id) or base64 email
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

  let email: string
  if (isUuid) {
    // Look up email by user_id
    const { data } = await supabaseAdmin
      .from('orders')
      .select('customer_email')
      .eq('user_id', slug)
      .eq('store_id', getStoreId())
      .order('created_at', { ascending: false })
      .limit(1)
    if (!data || data.length === 0) return null
    email = data[0].customer_email
  } else {
    try {
      email = Buffer.from(slug, 'base64url').toString()
    } catch {
      return null
    }
  }

  const { data: orders, error, count } = await supabaseAdmin
    .from('orders')
    .select('customer_email, customer_name, customer_phone, region, city, shipping_address, total_amount, created_at', { count: 'exact' })
    .eq('customer_email', email)
    .eq('store_id', getStoreId())
    .order('created_at', { ascending: false })

  if (error) {
    logger.error({ error, email }, 'Failed to fetch customer orders')
    throw error
  }
  if (!orders || orders.length === 0) return null

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0)
  const orderCount = count ?? orders.length

  return {
    customer_email: orders[0].customer_email,
    customer_name: orders[0].customer_name,
    customer_phone: orders[0].customer_phone,
    region: orders[0].region,
    city: orders[0].city,
    shipping_address: orders[0].shipping_address,
    order_count: orderCount,
    total_spent: totalSpent,
    last_order_at: orders[0].created_at,
  }
}

export interface CustomerOrderFilters {
  search?: string
  dateFrom?: string
  dateTo?: string
  priceMin?: string
  priceMax?: string
}

export async function getCustomerOrders(
  email: string,
  filters: CustomerOrderFilters = {},
  offset = 0,
  limit = 10,
) {
  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .eq('customer_email', email)
    .eq('store_id', getStoreId())

  if (filters.dateFrom) {
    query = query.gte('created_at', `${filters.dateFrom}T00:00:00`)
  }
  if (filters.dateTo) {
    query = query.lte('created_at', `${filters.dateTo}T23:59:59`)
  }
  if (filters.priceMin) {
    query = query.gte('total_amount', Number(filters.priceMin))
  }
  if (filters.priceMax) {
    query = query.lte('total_amount', Number(filters.priceMax))
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) {
    logger.error({ error, email }, 'Failed to fetch customer orders')
    throw error
  }

  let orders = data || []

  // Client-side search filter (needs order_items join for product search)
  if (filters.search) {
    const term = filters.search.toLowerCase()
    orders = orders.filter(order =>
      order.paystack_reference?.toLowerCase().includes(term) ||
      order.order_items?.some((item: { product_name?: string; product_description?: string }) =>
        item.product_name?.toLowerCase().includes(term) ||
        item.product_description?.toLowerCase().includes(term)
      )
    )
  }

  return { orders, total: count ?? 0 }
}

export async function getPendingOrderCount() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', getStoreId())
    .eq('status', 'pending')

  if (error) {
    logger.error({ error }, 'Failed to fetch pending order count')
    return 0
  }
  return count ?? 0
}

export async function getOrder(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .eq('store_id', getStoreId())
    .single()

  if (error) {
    logger.warn({ error, orderId: id }, 'Failed to fetch order')
    return null
  }
  return data
}

export async function getOrderByReference(reference: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('paystack_reference', reference)
    .eq('store_id', getStoreId())
    .single()

  if (error) {
    logger.warn({ error, reference }, 'Failed to fetch order by reference')
    return null
  }
  return data
}

async function fetchFullOrder(orderId: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(product_name, product_image, variant_name, quantity, unit_price)')
    .eq('id', orderId)
    .single()
  return data
}

async function logStatusChange(orderId: string, status: string) {
  const { error } = await supabaseAdmin
    .from('order_status_history')
    .insert({ order_id: orderId, status })

  if (error) {
    logger.error({ error, orderId, status }, 'Failed to log status change')
  }
}

export async function updateOrderStatus(id: string, status: string) {
  logger.info({ orderId: id, status }, 'Updating order status')

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id)
    .eq('store_id', getStoreId())

  if (error) {
    logger.error({ error, orderId: id, status }, 'Failed to update order status')
    throw error
  }

  await logStatusChange(id, status)

  // Send status update emails to customer
  if (status === 'delivered') {
    try {
      const fullOrder = await fetchFullOrder(id)
      if (fullOrder) {
        const { sendDeliveryConfirmationEmail } = await import('../email')
        await sendDeliveryConfirmationEmail(fullOrder)
        logger.info({ orderId: id }, 'Delivery confirmation email sent')
      }
    } catch (err) {
      logger.error({ error: err, orderId: id }, 'Failed to send delivery confirmation email')
    }
  } else if (status === 'processing') {
    try {
      const fullOrder = await fetchFullOrder(id)
      if (fullOrder) {
        const { sendOrderStatusEmail } = await import('../email')
        await sendOrderStatusEmail({
          order: fullOrder,
          status,
          message: `Your order <strong>#${id.slice(0, 8).toUpperCase()}</strong> is now being prepared! We're getting everything ready for you.`,
        })
        logger.info({ orderId: id }, 'Processing status email sent')
      }
    } catch (err) {
      logger.error({ error: err, orderId: id }, 'Failed to send processing status email')
    }
  } else if (status === 'shipped') {
    try {
      const fullOrder = await fetchFullOrder(id)
      if (fullOrder) {
        const { sendOrderStatusEmail } = await import('../email')
        await sendOrderStatusEmail({
          order: fullOrder,
          status,
          message: `Your order <strong>#${id.slice(0, 8).toUpperCase()}</strong> has been shipped and is on its way to you!`,
        })
        logger.info({ orderId: id }, 'Shipped status email sent')
      }
    } catch (err) {
      logger.error({ error: err, orderId: id }, 'Failed to send shipped status email')
    }
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
}

export async function markOrderPaidManually(id: string) {
  logger.info({ orderId: id }, 'Marking order as paid manually')

  // Fetch order with items for stock deduction
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id, status, order_items(product_id, variant_id, quantity)')
    .eq('id', id)
    .eq('store_id', getStoreId())
    .single()

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: 'paid', paid_manually: true })
    .eq('id', id)
    .eq('store_id', getStoreId())

  if (error) {
    logger.error({ error, orderId: id }, 'Failed to mark order as paid manually')
    throw error
  }

  await logStatusChange(id, 'paid')

  // Deduct stock (only if order was pending to avoid double deduction)
  if (order && order.status === 'pending') {
    for (const item of order.order_items) {
      if (item.variant_id) {
        const { data: variant } = await supabaseAdmin
          .from('product_variants')
          .select('stock_quantity')
          .eq('id', item.variant_id)
          .single()

        if (variant) {
          const newQty = Math.max(0, variant.stock_quantity - item.quantity)
          await supabaseAdmin
            .from('product_variants')
            .update({ stock_quantity: newQty, in_stock: newQty > 0 })
            .eq('id', item.variant_id)
          logger.info({ variantId: item.variant_id, oldQty: variant.stock_quantity, newQty }, 'Variant stock deducted (manual payment)')
        }
      } else if (item.product_id) {
        const { data: product } = await supabaseAdmin
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single()

        if (product) {
          const newQty = Math.max(0, product.stock_quantity - item.quantity)
          await supabaseAdmin
            .from('products')
            .update({ stock_quantity: newQty, in_stock: newQty > 0 })
            .eq('id', item.product_id)
          logger.info({ productId: item.product_id, oldQty: product.stock_quantity, newQty }, 'Stock deducted (manual payment)')
        }
      }
    }
  }

  // Send order confirmation + payment receipt emails with PDF
  try {
    const fullOrder = await fetchFullOrder(id)
    if (fullOrder) {
      const { sendOrderConfirmationEmail, sendPaymentReceiptEmail } = await import('../email')
      await sendOrderConfirmationEmail({ order: fullOrder, paid: true })
      await sendPaymentReceiptEmail(fullOrder)
      logger.info({ orderId: id }, 'Order confirmation & payment receipt emails sent (manual payment)')
    }
  } catch (err) {
    logger.error({ error: err, orderId: id }, 'Failed to send emails (manual payment)')
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
}

export async function requestOrderPayment(orderId: string) {
  const token = crypto.randomUUID()

  logger.info({ orderId }, 'Requesting payment for order')

  // Fetch order details
  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('id, customer_name, customer_email, total_amount, status, order_items(product_name, product_image, variant_name, quantity, unit_price)')
    .eq('id', orderId)
    .eq('store_id', getStoreId())
    .single()

  if (fetchError || !order) {
    logger.error({ error: fetchError, orderId }, 'Failed to fetch order for payment request')
    throw fetchError || new Error('Order not found')
  }

  if (order.status !== 'pending') {
    throw new Error('Can only request payment for pending orders')
  }

  // Save payment token with expiration timestamp
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ payment_token: token, payment_token_created_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) {
    logger.error({ error, orderId }, 'Failed to save payment token')
    throw error
  }

  // Send payment request email
  const paymentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/pay/order/${token}`
  try {
    const { sendOrderPaymentRequestEmail } = await import('../email')
    await sendOrderPaymentRequestEmail({
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      totalAmount: order.total_amount,
      paymentUrl,
      items: order.order_items,
    })
    logger.info({ orderId, email: order.customer_email }, 'Payment request email sent')
  } catch (err) {
    logger.error({ error: err, orderId }, 'Failed to send payment request email')
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)

  return { token, paymentUrl }
}

const PAYMENT_TOKEN_EXPIRY_HOURS = 48

export async function getOrderByPaymentToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('payment_token', token)
    .single()

  if (error) {
    logger.warn({ error, token }, 'Failed to fetch order by payment token')
    return null
  }

  // Check token expiration
  if (data.payment_token_created_at) {
    const created = new Date(data.payment_token_created_at).getTime()
    const now = Date.now()
    if (now - created > PAYMENT_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000) {
      logger.warn({ token, createdAt: data.payment_token_created_at }, 'Payment token expired')
      return null
    }
  }

  return data
}

export async function completeOrderPayment(token: string) {
  logger.info({ token }, 'Completing order payment via token')

  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('id, paystack_reference, status')
    .eq('payment_token', token)
    .single()

  if (fetchError || !order) {
    logger.error({ error: fetchError, token }, 'Failed to fetch order by payment token')
    throw fetchError || new Error('Order not found')
  }

  if (order.status !== 'pending') {
    logger.warn({ token, status: order.status }, 'Order already paid')
    return
  }

  // Use existing markOrderPaid which handles stock deduction, emails, etc.
  await markOrderPaid(order.paystack_reference)

  // Clear the payment token so the link can't be reused
  await supabaseAdmin
    .from('orders')
    .update({ payment_token: null })
    .eq('id', order.id)

  logger.info({ orderId: order.id, token }, 'Order payment completed via token')
}

export async function cancelOrder(id: string, reason: string) {
  logger.info({ orderId: id, reason }, 'Cancelling order')

  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('customer_name, customer_email, status, order_items(product_name, product_image, variant_name, quantity, unit_price)')
    .eq('id', id)
    .eq('store_id', getStoreId())
    .single()

  if (fetchError || !order) {
    logger.error({ error: fetchError, orderId: id }, 'Failed to fetch order for cancellation')
    throw fetchError || new Error('Order not found')
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'cancelled',
      cancelled_reason: reason,
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('store_id', getStoreId())

  if (error) {
    logger.error({ error, orderId: id }, 'Failed to cancel order')
    throw error
  }

  await logStatusChange(id, 'cancelled')

  // Send cancellation email (non-blocking)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  try {
    const { sendOrderCancellationEmail } = await import('../email')
    await sendOrderCancellationEmail({
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      orderId: id,
      reason,
      orderUrl: `${baseUrl}/orders/${id}`,
      items: order.order_items,
    })
    logger.info({ orderId: id, email: order.customer_email }, 'Cancellation email sent')
  } catch (err) {
    logger.error({ error: err, orderId: id }, 'Failed to send cancellation email')
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
}

export async function markOrderPaid(reference: string) {
  const supabase = await createClient()

  logger.info({ reference }, 'Processing payment confirmation')

  // Get the order with items before updating
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, order_items(product_id, variant_id, quantity)')
    .eq('paystack_reference', reference)
    .single()

  // Only deduct stock if transitioning from pending to paid (avoid double deduction)
  if (!order || order.status !== 'pending') {
    logger.warn({ reference, currentStatus: order?.status }, 'Order not pending, skipping stock deduction')
    // Still mark paid if not pending (idempotent)
    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('paystack_reference', reference)
    revalidatePath('/admin/orders')
    return
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('paystack_reference', reference)

  if (error) {
    logger.error({ error, reference, orderId: order.id }, 'Failed to mark order as paid')
    throw error
  }

  await logStatusChange(order.id, 'paid')

  // Deduct stock for each item using admin client (bypasses RLS)
  for (const item of order.order_items) {
    if (item.variant_id) {
      const { data: variant } = await supabaseAdmin
        .from('product_variants')
        .select('stock_quantity')
        .eq('id', item.variant_id)
        .single()

      if (variant) {
        if (variant.stock_quantity < item.quantity) {
          logger.warn({ variantId: item.variant_id, available: variant.stock_quantity, requested: item.quantity }, 'Insufficient variant stock, deducting to 0')
        }
        const newQty = Math.max(0, variant.stock_quantity - item.quantity)
        await supabaseAdmin
          .from('product_variants')
          .update({ stock_quantity: newQty, in_stock: newQty > 0 })
          .eq('id', item.variant_id)
        logger.info({ variantId: item.variant_id, oldQty: variant.stock_quantity, newQty }, 'Variant stock deducted')
      }
    } else {
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('stock_quantity')
        .eq('id', item.product_id)
        .single()

      if (product) {
        if (product.stock_quantity < item.quantity) {
          logger.warn({ productId: item.product_id, available: product.stock_quantity, requested: item.quantity }, 'Insufficient stock, deducting to 0')
        }
        const newQty = Math.max(0, product.stock_quantity - item.quantity)
        await supabaseAdmin
          .from('products')
          .update({ stock_quantity: newQty, in_stock: newQty > 0 })
          .eq('id', item.product_id)
        logger.info({ productId: item.product_id, oldQty: product.stock_quantity, newQty }, 'Stock deducted')
      } else {
        logger.warn({ productId: item.product_id }, 'Product not found for stock deduction')
      }
    }
  }

  // Send order confirmation email with receipt PDF (non-blocking)
  await sendOrderConfirmation(order.id, true)

  logger.info({ orderId: order.id, reference }, 'Order payment processed successfully')

  revalidatePath('/admin/orders')
  revalidatePath('/admin/requests')
  revalidatePath('/products')
}

export async function getMyOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .eq('store_id', getStoreId())
    .order('created_at', { ascending: false })

  if (error) {
    logger.error({ error, userId: user.id }, 'Failed to fetch user orders')
    throw error
  }
  return data
}

export async function getMyOrder(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), order_status_history(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('store_id', getStoreId())
    .single()

  if (error) return null
  return data
}

export async function getOrderStats() {
  const supabase = await createClient()

  const { data: orders } = await supabase.from('orders').select('status, total_amount').eq('store_id', getStoreId())

  if (!orders) return { total: 0, pending: 0, paid: 0, revenue: 0 }

  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status)).length,
    revenue: orders
      .filter(o => o.status !== 'pending' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount), 0),
  }
}

export type ChartPeriod = 'hour' | 'day' | 'month'

export interface ChartDataPoint {
  label: string
  revenue: number
  orders: number
  fulfilled: number
  pending: number
  cancelled: number
}

export async function getOrderChartData(period: ChartPeriod = 'day'): Promise<ChartDataPoint[]> {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, total_amount, status')
    .eq('store_id', getStoreId())
    .order('created_at', { ascending: true })

  if (!orders || orders.length === 0) return []

  const buckets = new Map<string, ChartDataPoint>()

  for (const order of orders) {
    const date = new Date(order.created_at)
    let label: string

    if (period === 'hour') {
      label = `${date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })} ${date.getHours().toString().padStart(2, '0')}:00`
    } else if (period === 'month') {
      label = date.toLocaleDateString('en-GH', { year: 'numeric', month: 'short' })
    } else {
      label = date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })
    }

    if (!buckets.has(label)) {
      buckets.set(label, { label, revenue: 0, orders: 0, fulfilled: 0, pending: 0, cancelled: 0 })
    }

    const bucket = buckets.get(label)!
    bucket.orders += 1
    bucket.revenue += Number(order.total_amount)

    if (['delivered', 'shipped'].includes(order.status)) {
      bucket.fulfilled += 1
    } else if (['pending'].includes(order.status)) {
      bucket.pending += 1
    } else if (order.status === 'cancelled') {
      bucket.cancelled += 1
    }
  }

  const points = Array.from(buckets.values())

  // Limit data points for readability
  if (period === 'hour') return points.slice(-48)
  if (period === 'day') return points.slice(-30)
  return points.slice(-12)
}

export async function verifyPaystackPayment(reference: string) {
  logger.info({ reference }, 'Verifying Paystack payment')

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  const data = await res.json()

  if (data.status && data.data.status === 'success') {
    logger.info({ reference, amount: data.data.amount }, 'Paystack payment verified')
    await markOrderPaid(reference)
    return true
  }

  logger.warn({ reference, paystackStatus: data.data?.status }, 'Paystack payment verification failed')
  return false
}

export async function handleCheckoutSuccess(reference: string) {
  const verified = await verifyPaystackPayment(reference)
  if (!verified) return null

  const order = await getOrderByReference(reference)
  return order
}

export async function createAdminOrder(data: {
  customerEmail: string
  customerName: string
  customerPhone: string
  shippingAddress: string
  city: string
  region: string
  items: Array<{
    productId: string
    productName: string
    productDescription: string | null
    productImage: string | null
    variantId: string | null
    variantName: string | null
    quantity: number
    unitPrice: number
  }>
  totalAmount: number
  isNewCustomer: boolean
}): Promise<{ orderId: string }> {
  const { isAdmin: checkIsAdmin } = await import('./auth')
  if (!(await checkIsAdmin())) throw new Error('Unauthorized')

  const storeId = getStoreId()

  let userId: string
  let setupLink: string | undefined

  if (data.isNewCustomer) {
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.customerEmail,
      email_confirm: true,
      user_metadata: { full_name: data.customerName, store_id: storeId },
    })

    if (createError) throw createError

    await supabaseAdmin
      .from('profiles')
      .update({ admin_created: true })
      .eq('id', newUser.user.id)
      .eq('store_id', storeId)

    const resetToken = crypto.randomUUID()
    await supabaseAdmin
      .from('password_reset_tokens')
      .insert({ token: resetToken, user_id: newUser.user.id, store_id: storeId })

    setupLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`
    userId = newUser.user.id
  } else {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', data.customerEmail)
      .eq('store_id', storeId)
      .single()

    if (profileError || !profile) {
      throw profileError || new Error('Customer not found')
    }

    userId = profile.id
    setupLink = undefined
  }

  const reference = `${storeId.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: userId,
      customer_email: data.customerEmail,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      shipping_address: data.shippingAddress,
      city: data.city,
      region: data.region,
      total_amount: data.totalAmount,
      status: 'pending',
      paystack_reference: reference,
      store_id: storeId,
      admin_created: true,
    })
    .select()
    .single()

  if (orderError) {
    logger.error({ error: orderError, reference }, 'Failed to create admin order')
    throw orderError
  }

  const orderItems = data.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    product_description: item.productDescription,
    product_image: item.productImage,
    variant_id: item.variantId,
    variant_name: item.variantName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }))

  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems)
  if (itemsError) {
    logger.error({ error: itemsError, orderId: order.id }, 'Failed to insert admin order items')
    throw itemsError
  }

  await logStatusChange(order.id, 'pending')

  sendAdminCreatedOrderNotification(order.id, setupLink).catch(() => {})

  logger.info({ orderId: order.id }, 'Admin order created')

  revalidatePath('/admin/orders')

  return { orderId: order.id }
}

async function sendAdminCreatedOrderNotification(orderId: string, setupLink?: string) {
  try {
    const fullOrder = await fetchFullOrder(orderId)
    if (!fullOrder) return
    const { sendAdminCreatedOrderEmail } = await import('../email')
    await sendAdminCreatedOrderEmail({ order: fullOrder, setupLink })
    logger.info({ orderId }, 'Admin-created order notification sent')
  } catch (err) {
    logger.error({ error: err, orderId }, 'Failed to send admin-created order notification')
  }
}

export async function searchCustomersForOrder(query: string): Promise<Array<{
  userId: string
  fullName: string
  email: string
  phone: string | null
  shippingAddress: string | null
  city: string | null
  region: string | null
}>> {
  const { isAdmin: checkIsAdmin } = await import('./auth')
  if (!(await checkIsAdmin())) throw new Error('Unauthorized')

  if (query.trim().length < 2) return []

  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email')
    .eq('store_id', getStoreId())
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(20)

  if (error) {
    logger.error({ error, query }, 'Failed to search customers for order')
    throw error
  }

  const results = await Promise.all(
    (profiles || []).map(async (profile) => {
      const { data: lastOrder } = await supabaseAdmin
        .from('orders')
        .select('customer_phone, shipping_address, city, region')
        .eq('user_id', profile.id)
        .eq('store_id', getStoreId())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      return {
        userId: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        phone: lastOrder?.customer_phone ?? null,
        shippingAddress: lastOrder?.shipping_address ?? null,
        city: lastOrder?.city ?? null,
        region: lastOrder?.region ?? null,
      }
    })
  )

  return results
}
