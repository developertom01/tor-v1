export default function CustomersLoading() {
  return (
    <div>
      <div className="h-8 w-36 bg-gray-200 rounded-lg animate-pulse mb-6" />
      <div className="h-11 bg-gray-200 rounded-lg animate-pulse mb-4" />
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-gray-50">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse hidden sm:block" />
            <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse hidden sm:block" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  )
}
