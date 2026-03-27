import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'
import { getMyRequest } from '@tor/lib/actions/products'
import { getSession } from '@tor/lib/actions/auth'
import { formatPrice } from '@tor/lib/utils'
import EditRequestForm from './EditRequestForm'

export const metadata: Metadata = {
  title: 'Edit Request',
}

export default async function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/auth?redirect=/requests')

  const { id } = await params
  const request = await getMyRequest(id)
  if (!request) notFound()

  // Can't edit paid requests
  if (request.status === 'paid') redirect('/requests')

  const product = request.products as {
    name: string
    price: number
    product_media: { url: string; type: string; sort_order: number }[]
  } | null

  const media = product?.product_media?.sort((a, b) => a.sort_order - b.sort_order) || []
  const primaryImage = media.find(m => m.type === 'image') || media[0]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link
        href="/requests"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Requests
      </Link>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Product Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24">
            {primaryImage ? (
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={primaryImage.url}
                  alt={product?.name || ''}
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
              <h2 className="font-semibold text-gray-900">{product?.name}</h2>
              {product && <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(product.price)}</p>}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-3">
          <EditRequestForm
            requestId={request.id}
            currentStatus={request.status}
            defaultValues={{
              name: request.customer_name,
              email: request.customer_email,
              phone: request.customer_phone || '',
              note: request.note || '',
              desired_date: request.desired_date || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
