#!/usr/bin/env node
/**
 * MCP server — process_logo tool
 *
 * Takes a raw logo image, removes the white/cream background,
 * auto-trims surrounding whitespace, boosts contrast and saturation,
 * and saves the result as logo.png in the store's public/ directory.
 *
 * Run this BEFORE generate_favicon so both tools work from the cleaned logo.
 *
 * Tool: process_logo
 *   logo_path  — absolute path to the original logo (PNG, JPG, WebP, etc.)
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

const TOOLS = [
  {
    name: 'process_logo',
    description:
      'Remove the white/cream background from a store logo, auto-trim surrounding whitespace, ' +
      'boost contrast and saturation so the mark pops on any background, ' +
      'and save the result as logo.png in apps/{app}/public/. ' +
      'Run this before generate_favicon so both use the cleaned transparent logo.',
    inputSchema: {
      type: 'object',
      properties: {
        logo_path: {
          type: 'string',
          description: 'Absolute path to the original logo file (PNG, JPG, WebP, etc.)',
        },
        app: {
          type: 'string',
          description: "Store app slug, e.g. 'amalshades'. Output is saved to apps/{app}/public/logo.png.",
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

async function processLogo(args) {
  const { logo_path, app, repo_root = '/Users/thomassarpong/tor' } = args

  if (!fs.existsSync(logo_path)) {
    throw new Error(`Logo file not found: ${logo_path}`)
  }

  const publicDir = path.join(repo_root, 'apps', app, 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const BG_THRESHOLD = 230

  // Read raw RGBA pixels
  const { data, info } = await sharp(logo_path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const pixels = new Uint8Array(data)

  // Remove white/cream background and soften anti-aliasing fringe
  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]

    if (r >= BG_THRESHOLD && g >= BG_THRESHOLD && b >= BG_THRESHOLD) {
      pixels[i + 3] = 0 // fully transparent
    } else if (r >= BG_THRESHOLD - 20 && g >= BG_THRESHOLD - 20 && b >= BG_THRESHOLD - 20) {
      // Fade out fringe pixels proportionally
      const brightness = (r + g + b) / 3
      const alpha = Math.round((1 - (brightness - (BG_THRESHOLD - 20)) / 20) * 255)
      pixels[i + 3] = Math.max(0, Math.min(255, alpha))
    }
  }

  const outputPath = path.join(publicDir, 'logo.png')

  await sharp(pixels, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 10 })       // crop surrounding transparent border
    .modulate({ saturation: 1.4 }) // vivid reds/blacks
    .linear(1.25, -15)             // boost contrast
    .sharpen({ sigma: 0.8 })       // crisp edges
    .toFile(outputPath)

  return (
    `✅ Logo processed for '${app}'\n\n` +
    `  ${outputPath}\n` +
    `    └─ background removed, whitespace trimmed, contrast boosted\n\n` +
    `Next steps:\n` +
    `  1. Set logo: '/logo.png' in apps/${app}/src/store.config.ts\n` +
    `  2. Run generate_favicon with logo_path: ${outputPath}`
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
        serverInfo: { name: 'process-logo', version: '1.0.0' },
      },
    })
    return
  }

  if (method === 'notifications/initialized') return

  if (method === 'tools/list') {
    send({ jsonrpc: '2.0', id, result: { tools: TOOLS } })
    return
  }

  if (method === 'tools/call' && params?.name === 'process_logo') {
    try {
      const text = await processLogo(params.arguments)
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
