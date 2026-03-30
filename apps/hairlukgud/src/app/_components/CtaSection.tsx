'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`

export default function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.05, 1])

  return (
    <section ref={ref} className="relative py-24 md:py-36 overflow-hidden">
      {/* Background image with parallax scale */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={`${STORAGE}/assets/hairlukgud-hero-3.jpg`}
          alt=""
          fill
          className="object-cover object-top"
        />
      </motion.div>

      {/* Brand overlay */}
      <div className="absolute inset-0 bg-brand-900/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-brand-900/40" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="block w-8 h-px bg-brand-700" />
            <span className="text-brand-400 text-xs font-medium tracking-[0.25em] uppercase">Ready to slay</span>
            <span className="block w-8 h-px bg-brand-700" />
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
            <span className="block text-white">Your best</span>
            <span className="block gold-text">look awaits</span>
            <span className="block text-white">you.</span>
          </h2>

          <p className="mt-8 text-brand-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Join hundreds of happy customers across Ghana who trust Hair Luk Gud GH for their premium hair needs.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 bg-white text-brand-700 font-bold px-10 py-4 rounded-full transition-all hover:bg-brand-50 hover:shadow-2xl hover:shadow-brand-900/30 hover:scale-105 text-sm md:text-base"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products?category=wigs"
              className="inline-flex items-center gap-2 text-brand-300 hover:text-brand-100 font-medium transition-colors text-sm"
            >
              <span className="underline underline-offset-4 decoration-brand-600 hover:decoration-brand-400 transition-colors">
                Browse Wigs
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
