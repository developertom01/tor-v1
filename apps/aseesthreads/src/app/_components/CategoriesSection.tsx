import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Animate from '@tor/ui/Animate'

const categories = [
  { name: 'Joggers', slug: 'joggers', description: 'Unisex wide-leg joggers for every mood', emoji: '👟', accent: 'Wide-Leg' },
  { name: 'Basic Tops', slug: 'basic-tops', description: 'Fitted crop tops and everyday basics', emoji: '👕', accent: 'Fitted' },
  { name: 'Seamless Bodysuits', slug: 'seamless-bodysuits', description: 'Form-fitting seamless bodysuits', emoji: '🖤', accent: 'Form-Fit' },
  { name: 'Spandex 2 Piece', slug: 'spandex-2-piece', description: 'Matching spandex co-ord sets', emoji: '✨', accent: 'Co-ord Sets' },
]

export default function CategoriesSection() {
  return (
    <section className="bg-brand-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Animate animation="fade-up" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-[0.2em] uppercase">Collections</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-brand-900 leading-tight">
            Dress the
            <br />
            <span className="gold-text">moment.</span>
          </h2>
        </Animate>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <Animate key={cat.slug} animation="fade-up" delay={i * 100}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="group relative flex items-end justify-between bg-brand-900 rounded-2xl p-8 md:p-10 overflow-hidden h-48 md:h-56 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-900/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-900 opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-500/5 to-transparent group-hover:from-gold-500/10 transition-all duration-500" />
                <span className="absolute top-6 right-6 text-4xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  {cat.emoji}
                </span>
                <div className="relative z-10">
                  <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase mb-2">{cat.accent}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-gold-400 transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-brand-400 text-sm">{cat.description}</p>
                </div>
                <div className="relative z-10 w-10 h-10 rounded-full border border-brand-600 group-hover:border-gold-500 group-hover:bg-gold-500/10 flex items-center justify-center transition-all duration-300 shrink-0 ml-4">
                  <ArrowUpRight className="w-4 h-4 text-brand-400 group-hover:text-gold-400 transition-colors" />
                </div>
              </Link>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  )
}
