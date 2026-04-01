'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`
const WHATSAPP_PHONE = '233552184169'

export default function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.06, 1])

  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello! I'd like to book an eye test at Amal-shades.")}`

  return (
    <section id="book-test" ref={ref} className="relative py-28 md:py-44 overflow-hidden">
      {/* Parallax background — African woman wearing stylish sunglasses */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={`${STORAGE}/assets/amalshades-hero-2.jpg`}
          alt=""
          fill
          className="object-cover object-top"
        />
      </motion.div>

      {/* Dark overlay with brand tint */}
      <div className="absolute inset-0 bg-brand-900/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-900/50 via-transparent to-brand-900/60" />

      {/* Horizontal rule accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="block w-8 h-px bg-white/20" />
            <span className="text-brand-300 text-xs font-medium tracking-[0.3em] uppercase">Free Consultation</span>
            <span className="block w-8 h-px bg-white/20" />
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.92] tracking-tight">
            <span className="block text-white">Book Your</span>
            <span className="block gold-text">Eye Test</span>
            <span className="block text-white">Today.</span>
          </h2>

          <p className="mt-8 text-brand-200 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Our qualified opticians in Accra are ready to assess your vision and help you find
            the perfect frames — completely free of charge.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 gold-gradient text-brand-900 font-bold px-10 py-4 rounded-none transition-all hover:shadow-2xl hover:shadow-gold-500/30 hover:scale-105 text-sm uppercase tracking-widest"
            >
              <MessageCircle className="w-5 h-5" />
              Book via WhatsApp
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-brand-200 hover:text-white font-medium transition-colors text-sm uppercase tracking-widest"
            >
              <span className="underline underline-offset-4 decoration-brand-600 hover:decoration-brand-300 transition-colors">
                Browse the Collection
              </span>
            </Link>
          </div>

          {/* Contact strip */}
          <div className="mt-16 inline-flex items-center gap-2 text-brand-400 text-xs tracking-wide">
            <span>+233 55 218 4169</span>
            <span className="w-px h-3 bg-brand-700" />
            <span>sarpong@gmail.com</span>
            <span className="w-px h-3 bg-brand-700" />
            <span>Accra, Ghana</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
