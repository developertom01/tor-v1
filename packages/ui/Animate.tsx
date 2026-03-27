'use client'

import { ReactNode } from 'react'
import { motion, type TargetAndTransition } from 'framer-motion'

type Animation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade-in' | 'scale-up' | 'blur-in'

const presets: Record<Animation, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  'fade-up': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-right': {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'scale-up': {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(8px)', y: 8 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
}

export default function Animate({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.7,
  className = '',
}: {
  children: ReactNode
  animation?: Animation
  delay?: number
  duration?: number
  className?: string
}) {
  return (
    <motion.div
      initial={presets[animation].hidden}
      whileInView={presets[animation].visible}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      className={className || undefined}
    >
      {children}
    </motion.div>
  )
}
