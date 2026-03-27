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
    { label: 'Total Products', value: productCount, icon: Package, color: 'bg-blue-50 text-blue-600', href: '/admin/products' },
    { label: 'Total Orders', value: stats.total, icon: ShoppingCart, color: 'bg-green-50 text-green-600', href: '/admin/orders' },
    { label: 'Pending Orders', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600', href: '/admin/orders?status=pending' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-brand-50 text-brand-600', href: '/admin/orders' },
    { label: 'Product Requests', value: requestCount, icon: Bell, color: 'bg-purple-50 text-purple-600', href: '/admin/requests' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">Low Stock Alert</p>
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

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <DashboardCharts initialData={chartData} initialPeriod="day" />
    </div>
  )
}
