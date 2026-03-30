'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`
const images = [
  `${STORAGE}/assets/hairfordays-hero-1.jpg`,
  `${STORAGE}/assets/hairfordays-hero-2.jpg`,
  `${STORAGE}/assets/hairfordays-hero-3.jpg`,
]

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-15%'])

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen bg-brand-900 text-white overflow-hidden flex items-center">
      {/* Parallax image layer */}
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

      {/* Deep brand overlay */}
      <div className="absolute inset-0 bg-brand-900/72" />

      {/* Side vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 via-transparent to-brand-900/50" />
      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent" />

      {/* Gold accent lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent" style={{ left: '8%' }} />
        <div className="absolute right-0 bottom-1/3 w-[20vw] h-px bg-gradient-to-l from-transparent via-gold-500/15 to-transparent" />
      </div>

      {/* Image dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-gold-400 w-8' : 'bg-white/25 w-1.5'}`}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="block w-10 h-px bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.28em] uppercase">Accra, Ghana</span>
        </motion.div>

        {/* Headline — stacked, right-edge pull */}
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,10vw,8.5rem)] font-bold leading-[0.92] tracking-tight"
          >
            <span className="block text-brand-50">YOUR HAIR,</span>
            <span className="block gold-text">YOUR CROWN.</span>
          </motion.h1>

          {/* Descriptor row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
            className="mt-8 grid md:grid-cols-2 gap-8 items-end"
          >
            <p className="text-brand-300 text-base md:text-lg leading-relaxed">
              Luxury wigs and extensions for the woman who refuses to compromise.
              Premium quality, effortless beauty — delivered to your door.
            </p>

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 gold-gradient text-brand-900 font-bold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-gold-500/25 hover:scale-105 text-sm md:text-base"
              >
                Shop Collection
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
            </div>
          </motion.div>
        </div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-20 flex flex-wrap items-center gap-8 md:gap-12 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <span className="text-brand-300 ml-1">500+ happy customers</span>
          </div>
          <div className="h-4 w-px bg-brand-700" />
          <span className="text-brand-300">Free delivery in Accra</span>
          <div className="h-4 w-px bg-brand-700 hidden sm:block" />
          <span className="text-brand-300 hidden sm:block">Next-day dispatch</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
