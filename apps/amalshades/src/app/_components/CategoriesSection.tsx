import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Animate from '@tor/ui/Animate'

const categories = [
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    description: 'UV-protective tinted frames and shades',
    emoji: '🕶️',
    label: 'UV Protection',
  },
  {
    name: 'Prescription Frames',
    slug: 'prescription-frames',
    description: 'Optical frames for vision correction',
    emoji: '👓',
    label: 'Vision Correction',
  },
  {
    name: 'Reading Glasses',
    slug: 'reading-glasses',
    description: 'Ready-made magnifying readers',
    emoji: '📖',
    label: 'Ready-Made',
  },
  {
    name: 'Contact Lenses',
    slug: 'contact-lenses',
    description: 'Daily, monthly, and coloured contacts',
    emoji: '👁️',
    label: 'Daily & Monthly',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Cases, cleaning kits, straps, lens cloths',
    emoji: '🧴',
    label: 'Care & Carry',
  },
]

export default function CategoriesSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Animate animation="fade-up" className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-[0.2em] uppercase">Shop by Category</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-900 leading-tight">
            Every vision,
            <br />
            <span className="gold-text">every style.</span>
          </h2>
        </Animate>

        {/* Horizontal scroll row on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-5 md:overflow-visible">
          {categories.map((cat, i) => (
            <Animate key={cat.slug} animation="fade-up" delay={i * 80}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="group flex-none w-48 md:w-auto flex flex-col gap-4 border border-brand-100 hover:border-brand-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-brand-100 bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center text-2xl transition-colors duration-300">
                  {cat.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-gold-600 text-xs font-medium tracking-widest uppercase mb-1">{cat.label}</p>
                  <h3 className="font-bold text-brand-900 group-hover:text-brand-600 transition-colors text-base leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-brand-400 text-xs mt-2 leading-relaxed">{cat.description}</p>
                </div>
                <div className="w-7 h-7 rounded-full border border-brand-200 group-hover:border-brand-500 group-hover:bg-brand-500 flex items-center justify-center transition-all duration-300 self-end">
                  <ArrowUpRight className="w-3 h-3 text-brand-400 group-hover:text-white transition-colors" />
                </div>
              </Link>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  )
}
