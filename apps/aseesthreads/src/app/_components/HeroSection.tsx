'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`
const images = [`${STORAGE}/assets/hero-1.jpg`, `${STORAGE}/assets/hero-2.jpg`, `${STORAGE}/assets/hero-3.jpg`]

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen bg-brand-900 text-white overflow-hidden flex items-center">
      {/* Background images with parallax */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 scale-110">
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
      </motion.div>

      {/* Brand color overlay — keeps the dark brown feel */}
      <div className="absolute inset-0 bg-brand-900/75" />

      {/* Subtle gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60 via-transparent to-brand-900/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent" />

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-px h-[40vh] bg-gradient-to-b from-transparent via-gold-500/30 to-transparent" />
        <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      </div>

      {/* Image indicator dots */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-gold-400 w-6' : 'bg-white/30'}`}
          />
        ))}
      </div>

      <motion.div style={{ opacity }} className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="block w-8 h-px bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.25em] uppercase">Kumasi, Ghana</span>
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.5rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight"
          >
            <span className="block text-brand-100">WEAR</span>
            <span className="block gold-text">YOUR</span>
            <span className="block text-brand-100">STORY</span>
          </motion.h1>
        </div>

        {/* Sub-brand line */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          className="mt-6 flex items-center gap-4"
        >
          <span className="block w-12 h-px bg-brand-600" />
          <p className="text-brand-300 text-sm md:text-base tracking-[0.15em] uppercase font-medium">
            Asee&apos;s Threads
          </p>
        </motion.div>

        {/* Description + CTA */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 items-end max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
            className="text-brand-300 text-base md:text-lg leading-relaxed"
          >
            Athleisure and casual fashion crafted for confidence.
            Wide-leg joggers, seamless bodysuits, spandex sets —
            made for the fashion-forward.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 gold-gradient text-brand-900 font-bold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-gold-500/25 hover:scale-105 text-sm md:text-base"
            >
              Shop the Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products?category=joggers"
              className="inline-flex items-center gap-2 text-brand-300 hover:text-gold-400 font-medium transition-colors text-sm"
            >
              <span className="underline underline-offset-4 decoration-brand-600 hover:decoration-gold-500 transition-colors">
                Explore Joggers
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-20 flex items-center gap-10 text-sm text-brand-400"
        >
          <div>
            <p className="text-2xl font-bold text-brand-100">200+</p>
            <p className="text-xs tracking-wide uppercase mt-0.5">Happy Customers</p>
          </div>
          <div className="h-8 w-px bg-brand-700" />
          <div>
            <p className="text-2xl font-bold text-brand-100">4</p>
            <p className="text-xs tracking-wide uppercase mt-0.5">Categories</p>
          </div>
          <div className="h-8 w-px bg-brand-700" />
          <div>
            <p className="text-2xl font-bold text-brand-100">GH</p>
            <p className="text-xs tracking-wide uppercase mt-0.5">Ships Nationwide</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
