import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, ShoppingCart, DollarSign } from 'lucide-react'
import { getCustomerBySlug, getCustomerOrders } from '@tor/lib/actions/orders'
import { formatPrice } from '@tor/lib/utils'
import CustomerOrders from './CustomerOrders'

export const metadata: Metadata = {
  title: 'Customer Details',
}

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { slug } = await params
  const sp = await searchParams
  const customer = await getCustomerBySlug(decodeURIComponent(slug))
  if (!customer) notFound()

  const filters = {
    search: sp.search,
    dateFrom: sp.dateFrom,
    dateTo: sp.dateTo,
    priceMin: sp.priceMin,
    priceMax: sp.priceMax,
  }

  const { orders: initialOrders, total: initialTotal } = await getCustomerOrders(
    customer.customer_email,
    filters,
    0,
    10,
  )

  return (
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{customer.customer_name}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Contact Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="break-all">{customer.customer_email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {customer.customer_phone}
              </div>
              <div className="flex items-start gap-2.5 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{customer.shipping_address}, {customer.city}, {customer.region}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <ShoppingCart className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{customer.order_count}</p>
              <p className="text-xs text-gray-500">Orders</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{formatPrice(customer.total_spent)}</p>
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Orders with filters + pagination */}
        <div className="md:col-span-2">
          <CustomerOrders
            email={customer.customer_email}
            initialOrders={initialOrders}
            initialTotal={initialTotal}
          />
        </div>
      </div>
    </div>
  )
}
