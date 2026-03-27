'use client'

import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { getOrderChartData, ChartDataPoint, ChartPeriod } from '@tor/lib/actions/orders'
import { TrendingUp, BarChart3, Loader2 } from 'lucide-react'

const periods: { value: ChartPeriod; label: string }[] = [
  { value: 'hour', label: 'Hourly' },
  { value: 'day', label: 'Daily' },
  { value: 'month', label: 'Monthly' },
]

export default function DashboardCharts({ initialData, initialPeriod }: { initialData: ChartDataPoint[]; initialPeriod: ChartPeriod }) {
  const [data, setData] = useState(initialData)
  const [period, setPeriod] = useState<ChartPeriod>(initialPeriod)
  const [loading, setLoading] = useState(false)

  async function handlePeriodChange(newPeriod: ChartPeriod) {
    if (newPeriod === period) return
    setPeriod(newPeriod)
    setLoading(true)
    try {
      const result = await getOrderChartData(newPeriod)
      setData(result)
    } catch { /* ignore */ }
    setLoading(false)
  }

  const hasData = data.length > 0

  return (
    <div className="mt-8 space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Sales Analytics</h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-1" />}
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No order data yet. Charts will appear once you have orders.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Revenue Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9ca3af" angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" width={50} tickFormatter={(v) => v >= 1000 ? `₵${(v / 1000).toFixed(0)}k` : `₵${v}`} />
                <Tooltip
                  formatter={(value) => [`₵${Number(value).toFixed(2)}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-brand-500)" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Count Trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Orders Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9ca3af" angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" width={30} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="orders" name="Total Orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Order Status Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9ca3af" angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" width={30} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="fulfilled" name="Fulfilled" fill="#22c55e" stackId="status" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#eab308" stackId="status" radius={[0, 0, 0, 0]} />
                <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" stackId="status" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
