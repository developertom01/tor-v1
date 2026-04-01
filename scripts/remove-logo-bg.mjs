#!/usr/bin/env node
/**
 * Removes the white/cream background from a store logo and outputs a transparent PNG.
 * Also boosts saturation + contrast to make the logo pop.
 *
 * Usage: node scripts/remove-logo-bg.mjs <app>
 * Example: node scripts/remove-logo-bg.mjs amalshades
 */

import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = process.argv[2]
if (!app) {
  console.error('Usage: node scripts/remove-logo-bg.mjs <app>')
  process.exit(1)
}

const publicDir = path.join(__dirname, '..', 'apps', app, 'public')
const candidates = ['logo.jpg', 'logo.jpeg', 'logo.png', 'logo.webp']
const inputFile = candidates.find(f => fs.existsSync(path.join(publicDir, f)))

if (!inputFile) {
  console.error(`No logo file found in apps/${app}/public/. Expected one of: ${candidates.join(', ')}`)
  process.exit(1)
}

const inputPath = path.join(publicDir, inputFile)
const outputPath = path.join(publicDir, 'logo.png')

console.log(`Processing: ${inputPath}`)

// Step 1: read raw RGBA pixels
const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const pixels = new Uint8Array(data)

// Step 2: remove white/cream background
// Threshold covers pure white and warm off-white backgrounds
const BG_THRESHOLD = 230

for (let i = 0; i < pixels.length; i += channels) {
  const r = pixels[i]
  const g = pixels[i + 1]
  const b = pixels[i + 2]

  // Pixel is background if all channels are high (light colours)
  if (r >= BG_THRESHOLD && g >= BG_THRESHOLD && b >= BG_THRESHOLD) {
    pixels[i + 3] = 0 // fully transparent
  } else if (r >= BG_THRESHOLD - 20 && g >= BG_THRESHOLD - 20 && b >= BG_THRESHOLD - 20) {
    // Soft anti-aliasing edge: fade out semi-transparent fringe pixels
    const brightness = (r + g + b) / 3
    const alpha = Math.round((1 - (brightness - (BG_THRESHOLD - 20)) / 20) * 255)
    pixels[i + 3] = Math.max(0, Math.min(255, alpha))
  }
}

// Step 3: write back via sharp, trim transparent edges, boost contrast + saturation
await sharp(pixels, { raw: { width, height, channels } })
  .png()
  .trim({ threshold: 10 })         // auto-crop transparent/near-transparent border
  .modulate({ saturation: 1.4 })   // make reds/blacks more vivid
  .linear(1.25, -15)               // boost contrast (multiply + offset)
  .sharpen({ sigma: 0.8 })         // crisp edges
  .toFile(outputPath)

// If input wasn't already logo.png, leave the old file in place (don't delete — store.config.ts may still point to it)
console.log(`Done → apps/${app}/public/logo.png`)
if (inputFile !== 'logo.png') {
  console.log(`Update store.config.ts: logo: '/logo.png'`)
}
