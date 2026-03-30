import Image from 'next/image'
import { Gem, Truck, Shield, Sparkles } from 'lucide-react'
import Animate from '@tor/ui/Animate'

const values = [
  {
    icon: Gem,
    title: 'Premium Quality',
    description: 'Every wig and extension is hand-selected for softness, longevity, and natural appearance. Quality you can feel.',
  },
  {
    icon: Sparkles,
    title: '100% Human Hair',
    description: 'Our collection features verified human hair that holds curls, straightens, and styles just like your natural hair.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Order today, receive tomorrow. We ship nationwide across Ghana with reliable, trackable delivery.',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Pay safely via Paystack — Ghana\'s trusted payment platform. Every transaction is encrypted and protected.',
  },
]

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`

export default function WhyUsSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background image */}
      <Image
        src={`${STORAGE}/assets/hairlukgud-hero-2.jpg`}
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
            <span className="text-gold-400 text-xs font-medium tracking-[0.2em] uppercase">Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Hair that
            <br />
            <span className="gold-text">speaks for you.</span>
          </h2>
        </Animate>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <Animate key={value.title} animation="fade-up" delay={i * 120}>
              <div className="group relative bg-brand-800/50 border border-brand-700/50 hover:border-gold-500/30 rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm">
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
