import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Package, AlertTriangle, Pencil } from 'lucide-react'
import { getProduct } from '@tor/lib/actions/products'
import { getSession, getProfile } from '@tor/lib/actions/auth'
import { supabaseAdmin } from '@tor/lib/supabase/admin'
import { formatPrice } from '@tor/lib/utils'
import RequestForm from './RequestForm'

export const metadata: Metadata = {
  title: 'Request Product',
}

export default async function RequestProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const { id } = await params
  const { type } = await searchParams
  const isCustom = type === 'custom'

  // Auth required
  const session = await getSession()
  if (!session) redirect(`/auth?redirect=/products/${id}/request`)

  const product = await getProduct(id)
  if (!product) notFound()

  // Check for existing pending request directly via admin client
  const { data: pendingRequests } = await supabaseAdmin
    .from('product_requests')
    .select('id')
    .eq('user_id', session.id)
    .eq('product_id', product.id)
    .eq('status', 'pending')
    .limit(1)

  const pendingRequest = pendingRequests?.[0] || null

  // Get user profile for pre-filling
  const profile = await getProfile()

  const media = product.product_media?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order) || []
  const primaryImage = media.find((m: { type: string }) => m.type === 'image') || media[0]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link
        href={`/products/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Product
      </Link>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Product Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24">
            {primaryImage ? (
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={primaryImage.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-300" />
              </div>
            )}
            <div className="p-4">
              <p className="text-xs text-brand-600 font-medium uppercase tracking-wider mb-1">{product.category}</p>
              <h2 className="font-semibold text-gray-900">{product.name}</h2>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(product.price)}</p>
              {!product.in_stock && (
                <p className="text-sm text-red-500 font-medium mt-1">Currently out of stock</p>
              )}
              {isCustom && product.in_stock && (
                <p className="text-sm text-brand-600 font-medium mt-1">Custom order request</p>
              )}
            </div>
          </div>
        </div>

        {/* Request Form or Duplicate Warning */}
        <div className="md:col-span-3">
          {pendingRequest ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">You already have a pending request</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You&apos;ve already submitted a request for this product. You can edit your existing request instead.
                  </p>
                  <Link
                    href={`/requests/${pendingRequest.id}/edit`}
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-white bg-yellow-600 hover:bg-yellow-700 px-5 py-2.5 rounded-full transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Existing Request
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <RequestForm
              productId={product.id}
              productSlug={id}
              isCustom={isCustom}
              user={{
                name: profile?.full_name || '',
                email: session.email || '',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
