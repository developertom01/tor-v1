export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse mb-3" />
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
