import { Metadata } from 'next'
import { getProducts, getCategories } from '@tor/lib/actions/products'
import ProductGrid from './ProductGrid'
import SearchInput from './SearchInput'
import PriceFilter from './PriceFilter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our collection of premium wigs, hair extensions, and accessories. Quality hair at affordable prices in Ghana.',
}

function buildFilterUrl(opts: { category?: string; search?: string; minPrice?: number; maxPrice?: number }) {
  const params = new URLSearchParams()
  if (opts.category) params.set('category', opts.category)
  if (opts.search) params.set('search', opts.search)
  if (opts.minPrice != null) params.set('minPrice', opts.minPrice.toString())
  if (opts.maxPrice != null) params.set('maxPrice', opts.maxPrice.toString())
  const qs = params.toString()
  return qs ? `/products?${qs}` : '/products'
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; minPrice?: string; maxPrice?: string }>
}) {
  const params = await searchParams
  const category = params.category
  const search = params.search
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined

  let products = []
  let hasMore = false
  let categories: string[] = []
  try {
    const result = await getProducts({ category, search, minPrice, maxPrice, limit: 12 })
    products = result.products
    hasMore = result.hasMore
    categories = await getCategories()
  } catch {
    // DB not set up yet
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
        </h1>
        {search && <p className="mt-2 text-gray-500">Results for &ldquo;{search}&rdquo;</p>}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={buildFilterUrl({ search, minPrice, maxPrice })}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !category ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={buildFilterUrl({ category: cat, search, minPrice, maxPrice })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              category === cat ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchInput category={category} search={search} minPrice={minPrice} maxPrice={maxPrice} />
      </div>

      {/* Price Filter */}
      <div className="mb-8">
        <PriceFilter category={category} search={search} minPrice={minPrice} maxPrice={maxPrice} />
      </div>

      {/* Products Grid with Infinite Scroll */}
      {products.length > 0 ? (
        <ProductGrid
          initialProducts={products}
          initialHasMore={hasMore}
          category={category}
          search={search}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No products found</p>
          <Link href="/products" className="mt-4 inline-block text-brand-600 font-semibold hover:text-brand-700">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  )
}
