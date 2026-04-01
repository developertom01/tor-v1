import { Metadata } from 'next'
import Link from 'next/link'
import { Package, ShoppingCart, DollarSign, Clock, Bell, AlertTriangle } from 'lucide-react'
import { getOrderStats, getOrderChartData, ChartDataPoint } from '@tor/lib/actions/orders'
import { getProducts, getProductRequests, getLowStockProducts } from '@tor/lib/actions/products'
import { formatPrice } from '@tor/lib/utils'
import DashboardCharts from './DashboardCharts'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default async function AdminDashboard() {
  let stats = { total: 0, pending: 0, paid: 0, revenue: 0 }
  let productCount = 0
  let requestCount = 0
  let chartData: ChartDataPoint[] = []
  let lowStock: Awaited<ReturnType<typeof getLowStockProducts>> = []

  try {
    ;[stats, lowStock, chartData] = await Promise.all([
      getOrderStats(),
      getLowStockProducts(),
      getOrderChartData('day'),
    ])
    const result = await getProducts()
    productCount = result.total
    const requests = await getProductRequests()
    requestCount = requests.filter(r => r.status === 'pending').length
  } catch { /* DB not ready */ }

  const cards = [
    { label: 'Products', value: productCount, icon: Package, color: 'bg-blue-50 text-blue-600', href: '/admin/products' },
    { label: 'Orders', value: stats.total, icon: ShoppingCart, color: 'bg-green-50 text-green-600', href: '/admin/orders' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600', href: '/admin/orders?status=pending' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-brand-50 text-brand-600', href: '/admin/orders' },
    { label: 'Requests', value: requestCount, icon: Bell, color: 'bg-purple-50 text-purple-600', href: '/admin/requests' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">Low Stock</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full hover:bg-amber-200 transition-colors"
              >
                {p.name} <span className="font-bold">({p.stock_quantity} left)</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{card.label}</p>
          </Link>
        ))}
      </div>

      <DashboardCharts initialData={chartData} initialPeriod="day" />
    </div>
  )
}
