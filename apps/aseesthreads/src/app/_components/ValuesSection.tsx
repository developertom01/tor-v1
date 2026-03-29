import Image from 'next/image'
import { Gem, Feather, Zap, Heart } from 'lucide-react'
import Animate from '@tor/ui/Animate'

const values = [
  {
    icon: Gem,
    title: 'Quality Fabrics',
    description: 'Every piece is made from premium spandex and breathable blends that move with your body and hold their shape.',
  },
  {
    icon: Feather,
    title: 'Unisex Fits',
    description: 'Designed for everyone. Our wide-leg joggers and basics are cut to flatter all body types without compromise.',
  },
  {
    icon: Zap,
    title: 'Ships Across Ghana',
    description: 'Fast, reliable delivery from Kumasi to Accra, Tamale, and everywhere in between. Your fit is on the way.',
  },
  {
    icon: Heart,
    title: 'Made with Intention',
    description: 'Clean, minimal design that lets you style your way. No loud logos — just confident, wearable fashion.',
  },
]

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`

export default function ValuesSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background image */}
      <Image
        src={`${STORAGE}/assets/hero-2.jpg`}
        alt=""
        fill
        className="object-cover object-center"
      />
      {/* Brand overlay */}
      <div className="absolute inset-0 bg-brand-900/85" />
      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/60 via-transparent to-brand-900/70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Animate animation="fade-up" className="max-w-xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.2em] uppercase">Why Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Fashion that
            <br />
            <span className="gold-text">speaks first.</span>
          </h2>
        </Animate>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <Animate key={value.title} animation="fade-up" delay={i * 120}>
              <div className="group relative bg-brand-800/50 border border-brand-700/50 hover:border-gold-500/30 rounded-2xl p-8 transition-all duration-400 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-brand-700/60 group-hover:bg-gold-500/10 flex items-center justify-center mb-6 transition-colors duration-300">
                  <value.icon className="w-5 h-5 text-gold-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gold-400 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-brand-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  )
}
