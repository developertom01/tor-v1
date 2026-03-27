import { Metadata } from 'next'
import { Users } from 'lucide-react'
import { getCustomers } from '@tor/lib/actions/orders'
import CustomerFilters from './CustomerFilters'
import CustomerList from './CustomerList'

export const metadata: Metadata = {
  title: 'Customers',
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  let customers: Awaited<ReturnType<typeof getCustomers>> = []
  try {
    customers = await getCustomers({
      search: sp.search,
      dateFrom: sp.dateFrom,
      dateTo: sp.dateTo,
    })
  } catch { /* DB not ready */ }

  const hasFilters = !!(sp.search || sp.dateFrom || sp.dateTo)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>

      <CustomerFilters />

      {customers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">{hasFilters ? 'No customers match your filters' : 'No customers yet'}</p>
        </div>
      ) : (
        <CustomerList customers={customers} />
      )}
    </div>
  )
}
