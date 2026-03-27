import Link from 'next/link'
import { ArrowRight, Star, Truck, Shield, Sparkles } from 'lucide-react'
import { getProducts } from '@tor/lib/actions/products'
import ProductCard from '@tor/ui/ProductCard'
import Animate from '@tor/ui/Animate'

export default async function HomePage() {
  let featuredProducts = []
  try {
    const result = await getProducts({ featured: true, limit: 8 })
    featuredProducts = result.products
  } catch {
    // DB not set up yet — show empty state
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 hero-glow-pulse">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Animate animation="fade-up" delay={100}>
                <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  Premium Quality Hair
                </div>
              </Animate>
              <Animate animation="fade-up" delay={250}>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Hair That Lasts.{' '}
                  <span className="text-gold-400">Style That Stays.</span>
                </h1>
              </Animate>
              <Animate animation="fade-up" delay={400}>
                <p className="mt-6 text-lg md:text-xl text-teal-100 max-w-lg">
                  Discover our collection of premium wigs, extensions, and hair accessories.
                  Luxury hair delivered straight to your door in Ghana.
                </p>
              </Animate>
              <Animate animation="fade-up" delay={550}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-full hover:bg-teal-50 transition-all hover:shadow-lg hover:scale-105"
                  >
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/products?category=wigs"
                    className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all hover:scale-105"
                  >
                    Browse Wigs
                  </Link>
                </div>
              </Animate>
            </div>

            <Animate animation="fade-left" delay={300} className="relative hidden md:block">
              <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                  <div className="text-center hero-float">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-gold-400" />
                    <p className="text-lg font-medium">Your Best Look Awaits</p>
                  </div>
                </div>
              </div>
              <Animate animation="scale-up" delay={700}>
                <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-gold-400">500+</p>
                  <p className="text-sm text-teal-100">Happy Customers</p>
                </div>
              </Animate>
            </Animate>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Animate animation="fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide in Ghana', align: 'sm:justify-start' },
                { icon: Shield, title: 'Secure Payment', desc: 'Pay with Paystack', align: 'justify-center' },
                { icon: Star, title: 'Premium Quality', desc: '100% Quality Guaranteed', align: 'sm:justify-end' },
              ].map((b) => (
                <div key={b.title} className={`flex items-center gap-4 justify-center ${b.align}`}>
                  <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
                    <b.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{b.title}</p>
                    <p className="text-sm text-gray-500">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Animate>
        </div>
      </section>

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
                { name: 'Esi M.', text: 'The quality of the wigs is amazing! I get compliments everywhere I go. Delivery was super fast too.', rating: 5 },
                { name: 'Abena D.', text: 'Best hair shop in Ghana! The prices are very affordable and the hair lasts for days. Will definitely buy again.', rating: 5 },
                { name: 'Serwaa K.', text: 'I love that I can see videos of the products before buying. The hair looks exactly like what I received!', rating: 5 },
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

      {/* CTA */}
      <section className="hero-gradient text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Animate animation="blur-in">
            <h2 className="text-3xl md:text-4xl font-bold">Ready for Hair That Lasts?</h2>
            <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
              Join hundreds of happy customers who trust Hair For Days for their premium hair needs.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-full hover:bg-teal-50 transition-all hover:shadow-lg hover:scale-105"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </Animate>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'Hair For Days',
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
