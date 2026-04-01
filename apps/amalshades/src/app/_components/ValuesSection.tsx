import Image from 'next/image'
import { Focus, ShieldCheck, Sparkles } from 'lucide-react'
import Animate from '@tor/ui/Animate'

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`

const values = [
  {
    icon: Focus,
    title: 'Precision Crafted',
    description: 'Every frame is selected for optical clarity and structural integrity. We source only from trusted manufacturers with proven lens standards.',
  },
  {
    icon: ShieldCheck,
    title: 'Vision Corrected',
    description: 'From single-vision to progressive lenses, our prescription service is handled by qualified opticians. Your sight matters deeply to us.',
  },
  {
    icon: Sparkles,
    title: 'Style Defined',
    description: 'Eyewear is an extension of personality. Our curated range spans minimalist titanium to bold acetate — there is a frame for every face.',
  },
]

export default function ValuesSection() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Full-bleed background image — boutique display */}
      <Image
        src={`${STORAGE}/assets/amalshades-hero-3.jpg`}
        alt=""
        fill
        className="object-cover object-center"
      />
      {/* Deep brand overlay */}
      <div className="absolute inset-0 bg-brand-900/88" />
      {/* Subtle horizontal gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60 via-transparent to-brand-900/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Animate animation="fade-up" className="text-center max-w-2xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-8 h-px bg-gold-500/60" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.25em] uppercase">Our Promise</span>
            <span className="block w-8 h-px bg-gold-500/60" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            More than eyewear.
            <br />
            <span className="gold-text">A clearer world.</span>
          </h2>
          <p className="mt-5 text-brand-300 text-base leading-relaxed">
            At Amal-shades, we believe premium vision care shouldn&apos;t be a luxury reserved for a few.
            It&apos;s for everyone in Ghana.
          </p>
        </Animate>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, i) => (
            <Animate key={value.title} animation="fade-up" delay={i * 130}>
              <div className="group relative border border-white/10 hover:border-gold-500/30 rounded-none p-10 transition-all duration-400 backdrop-blur-sm bg-brand-900/40 hover:bg-brand-800/50">
                {/* Top accent line */}
                <div className="w-8 h-px bg-gold-500 mb-8 group-hover:w-16 transition-all duration-500" />
                <div className="w-10 h-10 flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-400 transition-colors duration-300 tracking-wide">
                  {value.title}
                </h3>
                <p className="text-brand-300 text-sm leading-relaxed">{value.description}</p>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  )
}
