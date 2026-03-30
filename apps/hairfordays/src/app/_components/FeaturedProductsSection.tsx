import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Animate from '@tor/ui/Animate'
import ProductCard from '@tor/ui/ProductCard'
import type { ProductWithMedia } from '@tor/lib/types'

interface Props {
  products: ProductWithMedia[]
}

export default function FeaturedProductsSection({ products }: Props) {
  if (products.length === 0) return null

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Animate animation="fade-up" className="flex items-end justify-between mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gold-500" />
              <span className="text-gold-600 text-xs font-medium tracking-[0.2em] uppercase">Curated Picks</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900">Featured Styles</h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-brand-600 hover:text-brand-900 font-semibold transition-colors text-sm"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </Animate>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <Animate key={product.id} animation="fade-up" delay={i * 80}>
              <ProductCard product={product} />
            </Animate>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/products" className="inline-flex items-center gap-2 text-brand-600 font-semibold">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
