'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Eye } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`
const images = [
  `${STORAGE}/assets/amalshades-hero-1.jpg`,
  `${STORAGE}/assets/amalshades-hero-2.jpg`,
  `${STORAGE}/assets/amalshades-hero-3.jpg`,
]

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen bg-brand-900 text-white overflow-hidden flex items-center">

      {/* Full-bleed background carousel */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            className={`object-cover object-center transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>

      {/*
        Two-layer overlay strategy:
        1. Base flat tint — darkens the image overall so it reads as brand-tinted
        2. Strong left-to-right gradient — makes left (text) side near-opaque,
           right side only lightly tinted so the image is clearly visible
      */}
      <div className="absolute inset-0 bg-brand-900/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/75 to-brand-900/10" />

      {/* Carousel dot indicators */}
      <div className="absolute bottom-10 right-10 flex gap-3 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-px transition-all duration-500 ${i === current ? 'w-10 bg-gold-400' : 'w-4 bg-white/40'}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-8 right-10 text-white/40 text-xs font-mono tracking-widest z-10">
        {String(current + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>

      <motion.div
        style={{ opacity }}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-44"
      >
        {/* Store origin marker */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-6 h-6 rounded-full border border-gold-500/40 flex items-center justify-center">
            <Eye className="w-3 h-3 text-gold-500" />
          </div>
          <span className="text-gold-400 text-xs font-medium tracking-[0.3em] uppercase">Accra, Ghana</span>
          <span className="block w-12 h-px bg-gold-500/40" />
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-brand-300 text-sm md:text-base tracking-[0.25em] uppercase font-medium mb-6"
        >
          Premium Eyewear
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(4rem,13vw,11rem)] font-bold leading-[0.88] tracking-tight max-w-3xl"
        >
          <span className="block text-white">FRAME</span>
          <span className="block gold-text">YOUR</span>
          <span className="block text-white">WORLD.</span>
        </motion.h1>

        {/* Tagline + CTAs */}
        <div className="mt-14 flex flex-col md:flex-row gap-10 md:items-end max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            className="text-brand-200 text-base md:text-lg leading-relaxed max-w-sm"
          >
            Sunglasses, prescription frames, and contact lenses — chosen with precision,
            styled for confidence. Delivered across Ghana.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 flex-shrink-0"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 gold-gradient text-brand-900 font-bold px-8 py-4 transition-all hover:shadow-xl hover:shadow-gold-500/30 hover:scale-105 text-sm uppercase tracking-widest"
            >
              Shop Frames
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#book-test"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-gold-500/50 text-brand-200 hover:text-gold-400 font-medium transition-all px-8 py-4 text-sm uppercase tracking-widest"
            >
              Book Eye Test
            </Link>
          </motion.div>
        </div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-24 flex items-center gap-10 text-sm"
        >
          <div>
            <p className="text-3xl font-bold text-white">1,000+</p>
            <p className="text-brand-400 text-xs tracking-widest uppercase mt-1">Frames Sold</p>
          </div>
          <div className="h-10 w-px bg-brand-700" />
          <div>
            <p className="text-3xl font-bold text-white">5</p>
            <p className="text-brand-400 text-xs tracking-widest uppercase mt-1">Categories</p>
          </div>
          <div className="h-10 w-px bg-brand-700" />
          <div>
            <p className="text-3xl font-bold text-white">GH</p>
            <p className="text-brand-400 text-xs tracking-widest uppercase mt-1">Nationwide</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
