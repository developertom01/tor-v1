#!/usr/bin/env node
/**
 * Removes symlinked pages that were injected by inject-pages.mjs.
 * Run from an app directory: node ../../scripts/clean-pages.mjs
 */

import fs from 'fs'
import path from 'path'

const appDir = process.cwd()
const targetDir = path.join(appDir, 'src/app')
const manifestPath = path.join(targetDir, '.injected')

if (!fs.existsSync(manifestPath)) {
  console.log('No .injected manifest found — nothing to clean')
  process.exit(0)
}

const files = fs.readFileSync(manifestPath, 'utf8').trim().split('\n').filter(Boolean)
let removed = 0

for (const rel of files) {
  const fp = path.join(targetDir, rel)
  if (fs.existsSync(fp) && fs.lstatSync(fp).isSymbolicLink()) {
    fs.unlinkSync(fp)
    removed++
  }
}

// Clean up empty directories
for (const rel of files.reverse()) {
  const dir = path.dirname(path.join(targetDir, rel))
  try {
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir)
    }
  } catch { /* not empty, skip */ }
}

fs.unlinkSync(manifestPath)
console.log(`Cleaned ${removed} injected symlinks`)
