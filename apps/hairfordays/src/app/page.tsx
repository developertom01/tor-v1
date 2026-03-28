import Link from 'next/link'
import { ArrowRight, Star, Crown, Gem, Heart, Clock, ShieldCheck, Zap } from 'lucide-react'
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
      {/* Hero — full-width dark editorial */}
      <section className="relative min-h-[90vh] flex items-center hero-gradient text-white overflow-hidden">
        {/* Subtle gold diagonal accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-3xl" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold-500/[0.03] to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="max-w-3xl">
            <Animate animation="fade-up" delay={100}>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-gold-500" />
                <span className="text-gold-400 text-sm font-medium tracking-[0.2em] uppercase">Premium Hair</span>
              </div>
            </Animate>

            <Animate animation="fade-up" delay={250}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
                Hair That
                <br />
                <span className="gold-text">Lasts For</span>
                <br />
                Days.
              </h1>
            </Animate>

            <Animate animation="fade-up" delay={450}>
              <p className="mt-8 text-lg md:text-xl text-brand-300 max-w-xl leading-relaxed">
                Luxury wigs and extensions crafted for the woman who refuses to compromise.
                Premium quality. Effortless beauty. Delivered to your door in Ghana.
              </p>
            </Animate>

            <Animate animation="fade-up" delay={600}>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-3 gold-gradient text-brand-900 font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-gold-500/20 hover:scale-105"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/products?category=wigs"
                  className="inline-flex items-center gap-2 text-brand-300 hover:text-gold-400 font-medium transition-colors"
                >
                  <span className="underline underline-offset-4 decoration-brand-500 hover:decoration-gold-500 transition-colors">Shop Wigs</span>
                </Link>
              </div>
            </Animate>

            <Animate animation="fade-up" delay={750}>
              <div className="mt-16 flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <span className="text-brand-300">500+ happy customers</span>
                </div>
                <div className="h-4 w-px bg-brand-600" />
                <span className="text-brand-300">Free delivery in Accra</span>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* Value props — horizontal strip */}
      <section className="bg-brand-900 border-y border-brand-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate animation="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-700/50">
              {[
                { icon: Gem, label: 'Premium Quality' },
                { icon: Clock, label: 'Next-Day Delivery' },
                { icon: ShieldCheck, label: 'Secure Payments' },
                { icon: Heart, label: 'Satisfaction Guaranteed' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-center gap-3 py-5 px-4">
                  <item.icon className="w-5 h-5 text-gold-500 shrink-0" />
                  <span className="text-sm font-medium text-brand-200">{item.label}</span>
                </div>
              ))}
            </div>
          </Animate>
        </div>
      </section>

      {/* Categories — editorial grid with large cards */}
      <section className="bg-brand-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate animation="fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-sm font-medium tracking-[0.15em] uppercase">Collections</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-14">Shop by Category</h2>
          </Animate>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Wigs', slug: 'wigs', desc: 'Lace fronts, closures & full wigs', icon: Crown },
              { name: 'Extensions', slug: 'extensions', desc: 'Bundles, clip-ins & weaves', icon: Zap },
              { name: 'Accessories', slug: 'accessories', desc: 'Care products & styling tools', icon: Gem },
              { name: 'Others', slug: 'others', desc: 'More finds we love', icon: Heart },
            ].map((cat, i) => (
              <Animate key={cat.slug} animation="fade-up" delay={i * 100}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block bg-brand-800/50 border border-brand-700/50 hover:border-gold-500/30 rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-1"
                >
                  <cat.icon className="w-8 h-8 text-gold-500 mb-6" />
                  <h3 className="text-xl font-bold text-white group-hover:text-gold-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-brand-400 text-sm">{cat.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-gold-500 text-sm font-semibold">
                    Browse
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Animate animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-8 bg-gold-500" />
                    <span className="text-gold-600 text-sm font-medium tracking-[0.15em] uppercase">Curated</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-brand-800">Featured Picks</h2>
                </div>
                <Link href="/products" className="hidden sm:inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-semibold transition-colors">
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
            <div className="mt-8 text-center sm:hidden">
              <Link href="/products" className="inline-flex items-center gap-2 text-brand-600 font-semibold">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why choose us — split layout */}
      <section className="bg-brand-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Animate animation="fade-up">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-gold-500" />
                  <span className="text-gold-600 text-sm font-medium tracking-[0.15em] uppercase">Why Us</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-800 leading-tight">
                  Hair That Moves
                  <br />
                  <span className="text-gold-600">With Your Life</span>
                </h2>
                <p className="mt-6 text-brand-400 text-lg leading-relaxed">
                  We source only the finest quality hair — every wig, every bundle, every piece
                  is selected to give you confidence that lasts. No compromises. No shortcuts.
                </p>
              </div>
            </Animate>

            <Animate animation="fade-up" delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '500+', label: 'Happy customers across Ghana' },
                  { number: '24h', label: 'Delivery in Greater Accra' },
                  { number: '100%', label: 'Quality guaranteed on every product' },
                  { number: '4.9', label: 'Average customer rating' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-brand-200">
                    <p className="text-2xl md:text-3xl font-bold text-brand-800">{stat.number}</p>
                    <p className="mt-2 text-sm text-brand-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* Testimonials — dark section, card layout */}
      <section className="bg-brand-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Animate animation="fade-up" className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-sm font-medium tracking-[0.15em] uppercase">Testimonials</span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Loved by Women Across Ghana</h2>
          </Animate>

          <Animate animation="fade-up" delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Adwoa B.', location: 'Accra', text: "I've tried so many wig shops in Accra but Hair For Days is on a different level. The quality is unmatched and my wig stayed flawless for months!" },
                { name: 'Nana A.', location: 'Kumasi', text: "Ordered a lace front wig and it arrived the next day. The hairline is so natural — I've been getting compliments everywhere I go." },
                { name: 'Maame O.', location: 'Tema', text: "They helped me pick the right shade and the wig looks absolutely stunning on me. Best hair purchase I've ever made in Ghana." },
              ].map((review, i) => (
                <div key={i} className="relative bg-brand-800/50 border border-brand-700/50 rounded-2xl p-8">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-brand-200 leading-relaxed mb-6">&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-white">{review.name}</p>
                    <p className="text-sm text-brand-500">{review.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </Animate>
        </div>
      </section>

      {/* Final CTA — minimal, impactful */}
      <section className="relative bg-brand-900 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Animate animation="blur-in">
            <Crown className="w-10 h-10 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Your Next Favourite Hair
              <br />
              <span className="gold-text">Is Waiting</span>
            </h2>
            <p className="mt-6 text-lg text-brand-400 max-w-xl mx-auto">
              Join hundreds of women who chose Hair For Days and never looked back.
            </p>
            <Link
              href="/products"
              className="mt-10 group inline-flex items-center gap-3 gold-gradient text-brand-900 font-bold px-10 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-gold-500/20 hover:scale-105"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
