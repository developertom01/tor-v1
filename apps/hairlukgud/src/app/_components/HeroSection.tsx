'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`
const images = [
  `${STORAGE}/assets/hairlukgud-hero-1.jpg`,
  `${STORAGE}/assets/hairlukgud-hero-2.jpg`,
  `${STORAGE}/assets/hairlukgud-hero-3.jpg`,
]

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen bg-brand-900 text-white overflow-hidden flex items-center">
      {/* Background images with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            className={`object-cover object-top transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </motion.div>

      {/* Brand color overlay */}
      <div className="absolute inset-0 bg-brand-900/70" />

      {/* Gradient vignettes */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 via-transparent to-brand-900/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-transparent to-transparent" />

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-px h-[35vh] bg-gradient-to-b from-transparent via-gold-500/25 to-transparent" />
        <div className="absolute bottom-1/3 left-1/4 w-[25vw] h-px bg-gradient-to-r from-transparent via-brand-400/30 to-transparent" />
      </div>

      {/* Carousel dots */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-gold-400 w-6' : 'bg-white/30 w-1.5'}`}
          />
        ))}
      </div>

      <motion.div
        style={{ opacity }}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-44"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-10"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.25em] uppercase">Premium Hair · Accra, Ghana</span>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.9] tracking-tight"
          >
            <span className="block text-brand-100">YOUR</span>
            <span className="block gold-text">HAIR,</span>
            <span className="block text-brand-100">YOUR CROWN</span>
          </motion.h1>
        </div>

        {/* Divider line */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          className="mt-6 flex items-center gap-4"
        >
          <span className="block w-12 h-px bg-brand-500" />
          <p className="text-brand-300 text-sm tracking-[0.15em] uppercase font-medium">Hair Luk Gud GH</p>
        </motion.div>

        {/* Description + CTA */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 items-end max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
            className="text-brand-200 text-base md:text-lg leading-relaxed"
          >
            Premium wigs, extensions, and accessories. Affordable luxury
            that makes you look and feel amazing — delivered anywhere in Ghana.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 bg-white text-brand-700 font-bold px-8 py-4 rounded-full transition-all hover:bg-brand-50 hover:shadow-xl hover:shadow-brand-900/30 hover:scale-105 text-sm md:text-base"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products?category=wigs"
              className="inline-flex items-center gap-2 text-brand-300 hover:text-gold-400 font-medium transition-colors text-sm"
            >
              <span className="underline underline-offset-4 decoration-brand-600 hover:decoration-gold-500 transition-colors">
                Browse Wigs
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-20 flex items-center gap-10 text-sm text-brand-400"
        >
          <div>
            <p className="text-2xl font-bold text-brand-100">500+</p>
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
