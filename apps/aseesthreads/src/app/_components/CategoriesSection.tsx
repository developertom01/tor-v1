'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`

const categories = [
  {
    name: 'Joggers',
    slug: 'joggers',
    description: 'Unisex wide-leg joggers for every mood',
    accent: 'Wide-Leg',
    image: `${STORAGE}/assets/cat-joggers.jpg`,
  },
  {
    name: 'Basic Tops',
    slug: 'basic-tops',
    description: 'Fitted crop tops and everyday basics',
    accent: 'Fitted',
    image: `${STORAGE}/assets/cat-basic-tops.jpg`,
  },
  {
    name: 'Seamless Bodysuits',
    slug: 'seamless-bodysuits',
    description: 'Form-fitting seamless bodysuits',
    accent: 'Form-Fit',
    image: `${STORAGE}/assets/cat-bodysuits.jpg`,
  },
  {
    name: 'Spandex 2 Piece',
    slug: 'spandex-2-piece',
    description: 'Matching spandex co-ord sets',
    accent: 'Co-ord Sets',
    image: `${STORAGE}/assets/cat-spandex.jpg`,
  },
]

function CategoryCard({ cat, index }: { cat: typeof categories[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl">
      <Link
        href={`/products?category=${cat.slug}`}
        className="group relative flex items-end justify-between rounded-2xl p-8 md:p-10 overflow-hidden h-48 md:h-56 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-900/30 block"
      >
        {/* Parallax background image */}
        <motion.div style={{ y }} className="absolute inset-[-15%] z-0">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            className="object-cover object-center"
          />
        </motion.div>

        {/* Brand overlay */}
        <div className="absolute inset-0 bg-brand-900/70 group-hover:bg-brand-900/60 transition-colors duration-500 z-10" />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 via-transparent to-transparent z-10" />

        {/* Card content */}
        <div className="relative z-20">
          <p className="text-gold-500 text-xs font-medium tracking-[0.2em] uppercase mb-2">{cat.accent}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-gold-400 transition-colors duration-300">
            {cat.name}
          </h3>
          <p className="mt-1 text-brand-300 text-sm">{cat.description}</p>
        </div>
        <div className="relative z-20 w-10 h-10 rounded-full border border-white/20 group-hover:border-gold-500 group-hover:bg-gold-500/10 flex items-center justify-center transition-all duration-300 shrink-0 ml-4 backdrop-blur-sm">
          <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-gold-400 transition-colors" />
        </div>
      </Link>
    </div>
  )
}

export default function CategoriesSection() {
  return (
    <section className="bg-brand-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-gold-500" />
            <span className="text-gold-600 text-xs font-medium tracking-[0.2em] uppercase">Collections</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-brand-900 leading-tight">
            Dress the
            <br />
            <span className="gold-text">moment.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
