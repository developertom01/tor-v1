'use server'

import { createClient } from '../supabase/server'
import { supabaseAdmin } from '../supabase/admin'
import { revalidatePath } from 'next/cache'
import { slugify, MAX_MEDIA_PER_PRODUCT } from '../utils'
import { logger } from '../logger'

export async function getProducts(options?: {
  category?: string
  featured?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  const limit = options?.limit || 12
  const offset = options?.offset || 0

  let query = supabase
    .from('products')
    .select('*, product_media(*), product_variants(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (options?.category) query = query.eq('category', options.category)
  if (options?.featured) query = query.eq('featured', true)
  if (options?.search) query = query.ilike('name', `%${options.search}%`)
  if (options?.minPrice != null) query = query.gte('price', options.minPrice)
  if (options?.maxPrice != null) query = query.lte('price', options.maxPrice)

  const { data, error, count } = await query
  if (error) throw error
  return { products: data, total: count || 0, hasMore: offset + limit < (count || 0) }
}

export async function getProduct(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_media(*), product_variants(*)')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_media(*), product_variants(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const priceStr = formData.get('price') as string
  const compareAtPrice = formData.get('compare_at_price') as string
  const category = formData.get('category') as string
  const stockQuantity = parseInt(formData.get('stock_quantity') as string)
  const featured = formData.get('featured') === 'on'
  const variantsJson = formData.get('variants') as string | null

  // Parse variants if provided
  let variants: { name: string; price: number; compare_at_price: number | null; stock_quantity: number; is_default: boolean; media?: { url: string; type: string }[] }[] = []
  if (variantsJson) {
    try { variants = JSON.parse(variantsJson) } catch { throw new Error('Invalid variants data') }
  }

  // If variants exist and no explicit price, use lowest variant price
  const price = priceStr ? parseFloat(priceStr) : (variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0)

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      slug: slugify(name),
      description,
      price,
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
      category,
      stock_quantity: variants.length > 0 ? variants.reduce((sum, v) => sum + v.stock_quantity, 0) : stockQuantity,
      in_stock: variants.length > 0 ? variants.some(v => v.stock_quantity > 0) : stockQuantity > 0,
      featured,
    })
    .select()
    .single()

  if (error) {
    logger.error({ error, name }, 'Failed to create product')
    throw error
  }

  logger.info({ productId: data.id, name, price, category, variantCount: variants.length }, 'Product created')

  // Insert variants and their media
  if (variants.length > 0) {
    const variantRows = variants.map((v, i) => ({
      product_id: data.id,
      name: v.name,
      price: v.price,
      compare_at_price: v.compare_at_price,
      stock_quantity: v.stock_quantity,
      in_stock: v.stock_quantity > 0,
      is_default: v.is_default || (i === 0 && !variants.some(vv => vv.is_default)),
      sort_order: i,
    }))
    const { data: insertedVariants } = await supabase.from('product_variants').insert(variantRows).select('id')

    // Insert variant media
    if (insertedVariants) {
      const variantMedia: { product_id: string; variant_id: string; url: string; type: string; is_primary: boolean; sort_order: number }[] = []
      variants.forEach((v, i) => {
        const variantId = insertedVariants[i]?.id
        if (variantId && v.media?.length) {
          v.media.slice(0, 5).forEach((m, mi) => {
            variantMedia.push({
              product_id: data.id,
              variant_id: variantId,
              url: m.url,
              type: m.type || 'image',
              is_primary: mi === 0,
              sort_order: mi,
            })
          })
        }
      })
      if (variantMedia.length > 0) {
        await supabase.from('product_media').insert(variantMedia)
      }
    }
  }

  // Handle product-level media URLs (max 5)
  const mediaUrls = (formData.getAll('media_urls') as string[]).slice(0, MAX_MEDIA_PER_PRODUCT)
  const mediaTypes = (formData.getAll('media_types') as string[]).slice(0, MAX_MEDIA_PER_PRODUCT)

  if (mediaUrls.length > 0) {
    const mediaEntries = mediaUrls.map((url, i) => ({
      product_id: data.id,
      url,
      type: mediaTypes[i] || 'image',
      is_primary: i === 0,
      sort_order: i,
    }))

    await supabase.from('product_media').insert(mediaEntries)
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const priceStr = formData.get('price') as string
  const compareAtPrice = formData.get('compare_at_price') as string
  const category = formData.get('category') as string
  const stockQuantity = parseInt(formData.get('stock_quantity') as string)
  const featured = formData.get('featured') === 'on'
  const variantsJson = formData.get('variants') as string | null

  let variants: { name: string; price: number; compare_at_price: number | null; stock_quantity: number; is_default: boolean; media?: { url: string; type: string }[] }[] = []
  if (variantsJson) {
    try { variants = JSON.parse(variantsJson) } catch { throw new Error('Invalid variants data') }
  }

  const price = priceStr ? parseFloat(priceStr) : (variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0)

  const { error } = await supabase
    .from('products')
    .update({
      name,
      slug: slugify(name),
      description,
      price,
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
      category,
      stock_quantity: variants.length > 0 ? variants.reduce((sum, v) => sum + v.stock_quantity, 0) : stockQuantity,
      in_stock: variants.length > 0 ? variants.some(v => v.stock_quantity > 0) : stockQuantity > 0,
      featured,
    })
    .eq('id', id)

  if (error) throw error

  // Replace variants: delete all (cascade deletes variant media), re-insert
  if (variantsJson !== null) {
    // Delete variant-specific media first
    await supabase.from('product_media').delete().eq('product_id', id).not('variant_id', 'is', null)
    await supabase.from('product_variants').delete().eq('product_id', id)

    if (variants.length > 0) {
      const variantRows = variants.map((v, i) => ({
        product_id: id,
        name: v.name,
        price: v.price,
        compare_at_price: v.compare_at_price,
        stock_quantity: v.stock_quantity,
        in_stock: v.stock_quantity > 0,
        is_default: v.is_default || (i === 0 && !variants.some(vv => vv.is_default)),
        sort_order: i,
      }))
      const { data: insertedVariants } = await supabase.from('product_variants').insert(variantRows).select('id')

      // Insert variant media
      if (insertedVariants) {
        const variantMedia: { product_id: string; variant_id: string; url: string; type: string; is_primary: boolean; sort_order: number }[] = []
        variants.forEach((v, i) => {
          const variantId = insertedVariants[i]?.id
          if (variantId && v.media?.length) {
            v.media.slice(0, 5).forEach((m, mi) => {
              variantMedia.push({
                product_id: id,
                variant_id: variantId,
                url: m.url,
                type: m.type || 'image',
                is_primary: mi === 0,
                sort_order: mi,
              })
            })
          }
        })
        if (variantMedia.length > 0) {
          await supabase.from('product_media').insert(variantMedia)
        }
      }
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath(`/products/${slugify(name)}`)
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  logger.info({ productId: id }, 'Deleting product')
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    logger.error({ error, productId: id }, 'Failed to delete product')
    throw error
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function deleteProducts(ids: string[]) {
  logger.info({ count: ids.length }, 'Batch deleting products')
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().in('id', ids)
  if (error) {
    logger.error({ error, count: ids.length }, 'Failed to batch delete products')
    throw error
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function addProductMedia(productId: string, url: string, type: 'image' | 'video') {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('product_media')
    .select('sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: false })

  if (existing && existing.length >= MAX_MEDIA_PER_PRODUCT) {
    throw new Error(`Maximum of ${MAX_MEDIA_PER_PRODUCT} media items per product`)
  }

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const { error } = await supabase.from('product_media').insert({
    product_id: productId,
    url,
    type,
    is_primary: nextOrder === 0,
    sort_order: nextOrder,
  })

  if (error) throw error
  revalidatePath(`/admin/products/${productId}`)
}

export async function deleteProductMedia(mediaId: string, productId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('product_media').delete().eq('id', mediaId)
  if (error) throw error
  revalidatePath(`/admin/products/${productId}`)
}

export async function requestProduct(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to request a product')

  const productId = formData.get('product_id') as string

  // Check for existing pending request (use admin to bypass RLS)
  const { data: existingList } = await supabaseAdmin
    .from('product_requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('status', 'pending')
    .limit(1)

  if (existingList && existingList.length > 0) {
    return { existingRequestId: existingList[0].id }
  }

  // Get product price to copy onto the request
  const { data: product } = await supabase
    .from('products')
    .select('price')
    .eq('id', productId)
    .single()

  if (!product) {
    logger.error({ productId }, 'Product not found for request')
    throw new Error('Product not found')
  }

  const { data, error } = await supabase.from('product_requests').insert({
    product_id: productId,
    user_id: user.id,
    customer_name: formData.get('name') as string,
    customer_email: formData.get('email') as string,
    customer_phone: (formData.get('phone') as string) || null,
    note: (formData.get('note') as string) || null,
    desired_date: (formData.get('desired_date') as string) || null,
    price: product.price,
  }).select('id').single()

  if (error) {
    logger.error({ error, productId, userId: user.id }, 'Failed to create product request')
    throw error
  }

  logger.info({ requestId: data.id, productId, userId: user.id }, 'Product request created')
  return { requestId: data.id }
}

export async function getMyRequest(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('product_requests')
    .select('*, products(name, price, product_media(url, type, sort_order))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data
}

export async function getPendingRequestForProduct(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabaseAdmin
    .from('product_requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('status', 'pending')
    .limit(1)

  return data?.[0] || null
}

export async function updateMyRequest(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Fetch current request to check ownership and status
  const { data: request } = await supabase
    .from('product_requests')
    .select('status, token')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!request) throw new Error('Request not found')

  const updateData: Record<string, unknown> = {
    customer_name: formData.get('name') as string,
    customer_email: formData.get('email') as string,
    customer_phone: (formData.get('phone') as string) || null,
    note: (formData.get('note') as string) || null,
    desired_date: (formData.get('desired_date') as string) || null,
  }

  // If notified, revert to pending and clear token
  if (request.status === 'notified') {
    updateData.status = 'pending'
    updateData.token = null
  }

  const { error } = await supabaseAdmin
    .from('product_requests')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/requests')
  revalidatePath('/admin/requests')
}

export async function deleteMyRequest(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Only allow deleting pending/notified/cancelled requests
  const { data: request } = await supabase
    .from('product_requests')
    .select('status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!request) throw new Error('Request not found')
  if (request.status === 'paid') throw new Error('Cannot delete a processed request')

  const { error } = await supabaseAdmin
    .from('product_requests')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/requests')
  revalidatePath('/admin/requests')
}

export async function getProductRequests() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_requests')
    .select('*, products(name, product_media(url, type, sort_order))')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProductRequest(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_requests')
    .select('*, products(*, product_media(*))')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function updateRequestStatus(id: string, status: string) {
  const supabase = await createClient()

  logger.info({ requestId: id, status }, 'Updating request status')

  if (status === 'notified') {
    // Generate token and send email
    const token = crypto.randomUUID()
    const { data: request, error: fetchError } = await supabase
      .from('product_requests')
      .select('*, products(name)')
      .eq('id', id)
      .single()

    if (fetchError || !request) {
      logger.error({ error: fetchError, requestId: id }, 'Failed to fetch request for notification')
      throw fetchError || new Error('Request not found')
    }

    const { error } = await supabaseAdmin
      .from('product_requests')
      .update({ status, token })
      .eq('id', id)

    if (error) {
      logger.error({ error, requestId: id }, 'Failed to update request to notified')
      throw error
    }

    // Send notification email
    const productName = (request.products as { name: string } | null)?.name || 'your requested product'
    const paymentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/pay/request/${token}`

    try {
      const { sendRequestNotification } = await import('../email')
      await sendRequestNotification({
        customerName: request.customer_name,
        customerEmail: request.customer_email,
        productName,
        paymentUrl,
      })
      logger.info({ requestId: id, email: request.customer_email }, 'Request notification email sent')
    } catch (err) {
      logger.error({ error: err, requestId: id }, 'Failed to send request notification email')
    }
  } else {
    const { error } = await supabaseAdmin
      .from('product_requests')
      .update({ status })
      .eq('id', id)

    if (error) {
      logger.error({ error, requestId: id, status }, 'Failed to update request status')
      throw error
    }
  }

  revalidatePath('/admin/requests')
  revalidatePath(`/admin/requests/${id}`)
}

export async function updateRequestPrice(id: string, price: number) {
  const { error } = await supabaseAdmin
    .from('product_requests')
    .update({ price })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/requests')
  revalidatePath(`/admin/requests/${id}`)
}

export async function getRequestByToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from('product_requests')
    .select('*, products(*, product_media(*))')
    .eq('token', token)
    .single()

  if (error) return null
  return data
}

export async function prepareRequestPayment(token: string, quantity: number) {
  const { data: request, error: reqError } = await supabaseAdmin
    .from('product_requests')
    .select('*, products(*)')
    .eq('token', token)
    .eq('status', 'notified')
    .single()

  if (reqError || !request) {
    logger.error({ error: reqError, token }, 'prepareRequestPayment: request not found or not notified')
    throw new Error('Invalid or already paid request')
  }

  const totalAmount = request.price * quantity
  const reference = `HLG-REQ-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

  return { reference, amount: totalAmount, email: request.customer_email }
}

export async function completeRequestPayment(token: string, formData: FormData, reference: string) {
  logger.info({ token, reference }, 'Completing request payment')

  const { data: request, error: reqError } = await supabaseAdmin
    .from('product_requests')
    .select('*, products(*, product_media(*))')
    .eq('token', token)
    .eq('status', 'notified')
    .single()

  if (reqError || !request) {
    logger.error({ error: reqError, token }, 'Invalid or already paid request')
    throw new Error('Invalid or already paid request')
  }

  const product = request.products as { id: string; name: string; description: string; product_media: { url: string; is_primary: boolean }[] } | null
  if (!product) {
    logger.error({ token, requestId: request.id }, 'Product not found for request payment')
    throw new Error('Product not found')
  }

  const quantity = parseInt(formData.get('quantity') as string) || 1
  const unitPrice = Number(request.price)
  const totalAmount = unitPrice * quantity

  // Create order only after successful payment
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: request.user_id,
      customer_email: formData.get('email') as string || request.customer_email,
      customer_name: formData.get('name') as string || request.customer_name,
      customer_phone: formData.get('phone') as string || request.customer_phone || '',
      shipping_address: formData.get('address') as string,
      city: formData.get('city') as string,
      region: formData.get('region') as string,
      total_amount: totalAmount,
      status: 'paid',
      paystack_reference: reference,
    })
    .select()
    .single()

  if (orderError) {
    logger.error({ error: orderError, token, reference }, 'Failed to create order from request payment')
    throw orderError
  }

  const primaryMedia = product.product_media?.find((m: { is_primary: boolean }) => m.is_primary) || product.product_media?.[0]
  await supabaseAdmin.from('order_items').insert({
    order_id: order.id,
    product_id: product.id,
    product_name: product.name,
    product_description: product.description || null,
    product_image: primaryMedia?.url || null,
    variant_id: null,
    variant_name: null,
    quantity,
    unit_price: unitPrice,
  })

  // Log order status history
  await supabaseAdmin.from('order_status_history').insert([
    { order_id: order.id, status: 'pending' },
    { order_id: order.id, status: 'paid' },
  ])

  // Mark request as paid
  await supabaseAdmin
    .from('product_requests')
    .update({ status: 'paid' })
    .eq('token', token)

  logger.info({ orderId: order.id, reference, requestId: request.id }, 'Request payment completed, order created')

  // Send unpaid confirmation email (non-blocking)
  const { sendOrderConfirmation } = await import('../actions/orders')
  sendOrderConfirmation(order.id, false).catch(() => {})

  revalidatePath('/admin/requests')
  revalidatePath('/admin/orders')

  return { orderId: order.id, reference }
}

export async function getMyRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('product_requests')
    .select('*, products(name, price, product_media(url, type, sort_order))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

const LOW_STOCK_THRESHOLD = 5

export async function getLowStockProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, stock_quantity, in_stock')
    .lte('stock_quantity', LOW_STOCK_THRESHOLD)
    .eq('in_stock', true)
    .order('stock_quantity', { ascending: true })
    .limit(10)

  if (error) {
    logger.error({ error }, 'Failed to fetch low stock products')
    return []
  }
  return data
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('category')

  if (error) return []
  const categories = [...new Set(data.map(p => p.category))]
  return categories
}

export async function addVariantMedia(variantId: string, productId: string, url: string, type: 'image' | 'video') {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('product_media')
    .select('sort_order')
    .eq('variant_id', variantId)
    .order('sort_order', { ascending: false })

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const { error } = await supabase.from('product_media').insert({
    product_id: productId,
    variant_id: variantId,
    url,
    type,
    is_primary: nextOrder === 0,
    sort_order: nextOrder,
  })

  if (error) throw error
  revalidatePath(`/admin/products/${productId}`)
}

export async function deleteVariant(variantId: string, productId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('product_variants').delete().eq('id', variantId)
  if (error) throw error
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath('/products')
}
