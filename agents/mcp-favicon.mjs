#!/usr/bin/env node
/**
 * MCP server — generate_favicon tool
 *
 * Takes a logo image path, generates favicon.ico (16/32/48/64 px),
 * apple-touch-icon.png (180 px), and icon.png (32 px), then saves them
 * into a store app's Next.js app/ directory.
 *
 * Uses sharp (already a Next.js dependency — no extra install needed).
 *
 * Tool: generate_favicon
 *   logo_path  — absolute path to source logo (PNG, JPG, WebP, SVG, etc.)
 *   app        — store slug, e.g. "amalshades"
 *   repo_root  — optional, defaults to /Users/thomassarpong/tor
 */

import { createRequire } from 'module'
import readline from 'readline'
import fs from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
const sharp = require('/Users/thomassarpong/tor/node_modules/sharp')

const rl = readline.createInterface({ input: process.stdin })

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n')
}

// Build an ICO file from an array of { size, buffer } where buffer is raw PNG bytes.
// ICO format: 6-byte header + n×16-byte directory entries + image blobs.
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)              // reserved
  header.writeUInt16LE(1, 2)              // type: 1 = ICO
  header.writeUInt16LE(entries.length, 4) // image count

  const dirEntrySize = 16
  let dataOffset = 6 + entries.length * dirEntrySize

  const dirs = []
  const blobs = []

  for (const { size, buffer } of entries) {
    const dir = Buffer.alloc(dirEntrySize)
    const w = size < 256 ? size : 0  // 0 = 256 per ICO spec
    const h = size < 256 ? size : 0
    dir.writeUInt8(w, 0)              // width
    dir.writeUInt8(h, 1)              // height
    dir.writeUInt8(0, 2)              // colour palette count (0 = full colour)
    dir.writeUInt8(0, 3)              // reserved
    dir.writeUInt16LE(1, 4)           // colour planes
    dir.writeUInt16LE(32, 6)          // bits per pixel
    dir.writeUInt32LE(buffer.length, 8)  // size of image data
    dir.writeUInt32LE(dataOffset, 12)    // offset to image data
    dataOffset += buffer.length
    dirs.push(dir)
    blobs.push(buffer)
  }

  return Buffer.concat([header, ...dirs, ...blobs])
}

const TOOLS = [
  {
    name: 'generate_favicon',
    description:
      'Process a raw logo image (removes white/cream background, trims whitespace, boosts contrast), ' +
      'saves the cleaned version as logo.png in public/, then generates favicon.ico (16/32/48/64 px), ' +
      'apple-touch-icon.png (180 px), and icon.png (32 px) from it. ' +
      'Next.js App Router serves all files automatically — no config changes required.',
    inputSchema: {
      type: 'object',
      properties: {
        logo_path: {
          type: 'string',
          description: 'Absolute path to the source logo (PNG, JPG, WebP, SVG, etc.)',
        },
        app: {
          type: 'string',
          description: "Store app slug, e.g. 'amalshades'. Files are saved to apps/{app}/public/ and apps/{app}/src/app/.",
        },
        repo_root: {
          type: 'string',
          description: 'Absolute path to the monorepo root. Defaults to /Users/thomassarpong/tor if omitted.',
        },
      },
      required: ['logo_path', 'app'],
    },
  },
]

/**
 * Remove white/cream background from a logo, auto-trim transparent edges,
 * and boost contrast + saturation so the mark pops on any background.
 * Returns a Buffer of the processed PNG.
 */
async function processLogo(logo_path) {
  const BG_THRESHOLD = 230

  const { data, info } = await sharp(logo_path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const pixels = new Uint8Array(data)

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]

    if (r >= BG_THRESHOLD && g >= BG_THRESHOLD && b >= BG_THRESHOLD) {
      // Fully transparent — background pixel
      pixels[i + 3] = 0
    } else if (r >= BG_THRESHOLD - 20 && g >= BG_THRESHOLD - 20 && b >= BG_THRESHOLD - 20) {
      // Anti-aliasing fringe — fade out proportionally
      const brightness = (r + g + b) / 3
      const alpha = Math.round((1 - (brightness - (BG_THRESHOLD - 20)) / 20) * 255)
      pixels[i + 3] = Math.max(0, Math.min(255, alpha))
    }
  }

  return sharp(pixels, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 10 })       // crop surrounding transparent border
    .modulate({ saturation: 1.4 }) // vivid reds/blacks
    .linear(1.25, -15)             // boost contrast
    .sharpen({ sigma: 0.8 })       // crisp edges
    .toBuffer()
}

async function generateFavicon(args) {
  const { logo_path, app, repo_root = '/Users/thomassarpong/tor' } = args

  const appDir = path.join(repo_root, 'apps', app, 'src', 'app')
  if (!fs.existsSync(appDir)) {
    throw new Error(`App directory not found: ${appDir}`)
  }

  const publicDir = path.join(repo_root, 'apps', app, 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Step 1: process the raw logo → transparent PNG with trimmed whitespace
  const processedBuffer = await processLogo(logo_path)

  // Step 2: save the clean logo as logo.png in public/
  const logoOutPath = path.join(publicDir, 'logo.png')
  fs.writeFileSync(logoOutPath, processedBuffer)

  // Step 3: generate favicon.ico from the processed logo
  // favicon.ico goes in public/ — Turbopack processes src/app/ through its image pipeline
  // and cannot decode PNG-embedded ICO files. public/ files are served as-is.
  const icoSizes = [16, 32, 48, 64]
  const icoEntries = await Promise.all(
    icoSizes.map(async (size) => ({
      size,
      buffer: await sharp(processedBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
    }))
  )

  const icoPath = path.join(publicDir, 'favicon.ico')
  fs.writeFileSync(icoPath, buildIco(icoEntries))

  // apple-touch-icon.png — 180 px (stays in src/app/ — Next.js handles PNG metadata natively)
  const touchPath = path.join(appDir, 'apple-touch-icon.png')
  await sharp(processedBuffer)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(touchPath)

  // icon.png — 32 px (Next.js <link rel="icon">, stays in src/app/)
  const iconPath = path.join(appDir, 'icon.png')
  await sharp(processedBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(iconPath)

  return (
    `✅ Logo processed + favicon generated for '${app}'\n\n` +
    `  ${logoOutPath}\n` +
    `    └─ background removed, trimmed, contrast-boosted — update store.config.ts: logo: '/logo.png'\n` +
    `  ${icoPath}\n` +
    `    └─ contains 16×16, 32×32, 48×48, 64×64 px (PNG-embedded ICO) — in public/\n` +
    `  ${touchPath}\n` +
    `    └─ 180×180 px (Safari / iOS home screen) — in src/app/\n` +
    `  ${iconPath}\n` +
    `    └─ 32×32 px (Next.js <link rel="icon">) — in src/app/\n\n` +
    'favicon.ico is served from public/ (avoids Turbopack image pipeline).\n' +
    'apple-touch-icon.png and icon.png are picked up automatically from src/app/.'
  )
}

rl.on('line', async (raw) => {
  let msg
  try { msg = JSON.parse(raw) } catch { return }

  const { id, method, params } = msg

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0', id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'favicon-gen', version: '1.0.0' },
      },
    })
    return
  }

  if (method === 'notifications/initialized') return

  if (method === 'tools/list') {
    send({ jsonrpc: '2.0', id, result: { tools: TOOLS } })
    return
  }

  if (method === 'tools/call' && params?.name === 'generate_favicon') {
    try {
      const text = await generateFavicon(params.arguments)
      send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }] } })
    } catch (err) {
      send({
        jsonrpc: '2.0', id,
        result: { content: [{ type: 'text', text: `❌ ${err.message}` }], isError: true },
      })
    }
    return
  }

  send({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } })
})
