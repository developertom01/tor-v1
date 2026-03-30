import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { getProducts } from '@tor/lib/actions/products'
import type { ProductWithMedia } from '@tor/lib/types'
import ProductCard from '@tor/ui/ProductCard'
import Animate from '@tor/ui/Animate'
import HeroSection from './_components/HeroSection'
import WhyUsSection from './_components/WhyUsSection'
import CtaSection from './_components/CtaSection'

export default async function HomePage() {
  let featuredProducts: ProductWithMedia[] = []
  try {
    const result = await getProducts({ featured: true, limit: 8 })
    featuredProducts = result.products
  } catch {
    // DB not set up yet — show empty state
  }

  return (
    <>
      <HeroSection />

      {/* Categories */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-3 text-gray-500 text-lg">Find the perfect hair for every occasion</p>
          </Animate>
          <Animate animation="fade-up" delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Wigs', slug: 'wigs', desc: 'Full lace, frontal & closure wigs', emoji: '👸' },
                { name: 'Extensions', slug: 'extensions', desc: 'Clip-ins, bundles & weaves', emoji: '✨' },
                { name: 'Accessories', slug: 'accessories', desc: 'Care products & styling tools', emoji: '💫' },
                { name: 'Others', slug: 'others', desc: 'More products we love', emoji: '🛍️' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div className="text-5xl mb-4">{cat.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-gray-500">{cat.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-brand-600 font-semibold text-sm">
                    Shop {cat.name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </Animate>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Animate animation="fade-up">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
                  <p className="mt-2 text-gray-500 text-lg">Our most popular picks</p>
                </div>
                <Link href="/products" className="hidden sm:inline-flex items-center gap-1 text-brand-600 font-semibold hover:text-brand-700">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Animate>
            <Animate animation="fade-up" delay={150}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </Animate>
          </div>
        </section>
      )}

      <WhyUsSection />

      {/* Testimonials */}
      <section className="bg-brand-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="mt-3 text-gray-500 text-lg">Real reviews from real queens</p>
          </Animate>
          <Animate animation="fade-up" delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Ama K.', text: 'The quality of the wigs is amazing! I get compliments everywhere I go. Delivery was super fast too.', rating: 5 },
                { name: 'Akosua B.', text: 'Best hair shop in Ghana! The prices are very affordable and the hair lasts long. Will definitely buy again.', rating: 5 },
                { name: 'Nana A.', text: 'I love that I can see videos of the products before buying. The hair looks exactly like what I received!', rating: 5 },
              ].map((review, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">&ldquo;{review.text}&rdquo;</p>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                </div>
              ))}
            </div>
          </Animate>
        </div>
      </section>

      <CtaSection />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'Hair Luk Gud GH',
            description: 'Premium quality wigs, hair extensions, and accessories in Ghana.',
            url: process.env.NEXT_PUBLIC_SITE_URL,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Accra',
              addressCountry: 'GH',
            },
            priceRange: '$$',
          }),
        }}
      />
    </>
  )
}
