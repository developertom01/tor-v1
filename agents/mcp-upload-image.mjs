#!/usr/bin/env node
/**
 * MCP server — upload_image tool
 *
 * No external dependencies. Uses Doppler provisioner for remote credentials.
 * Registered in .claude/settings.local.json under mcpServers.
 *
 * Tool: upload_image
 *   file_path    — absolute path to the image on disk (e.g. /tmp/hero-1.jpg)
 *   storage_path — object path in the products bucket (e.g. assets/hairfordays-hero-1.jpg)
 *   env          — "local" | "dev" | "prod"
 */

import { execSync, spawnSync } from 'child_process'
import readline from 'readline'

const rl = readline.createInterface({ input: process.stdin })

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n')
}

const TOOLS = [
  {
    name: 'upload_image',
    description:
      'Upload a local image file to Supabase Storage. For local env uses the local Supabase instance. For dev/prod fetches credentials from Doppler provisioner project.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Absolute path to the image file, e.g. /tmp/hairfordays-hero-1.jpg',
        },
        storage_path: {
          type: 'string',
          description: 'Object path in the products bucket, e.g. assets/hairfordays-hero-1.jpg',
        },
        env: {
          type: 'string',
          enum: ['local', 'dev', 'prod'],
          description: 'Target environment. local = local Supabase, dev/prod = Doppler provisioner credentials.',
        },
      },
      required: ['file_path', 'storage_path', 'env'],
    },
  },
]

function getCredentials(env) {
  if (env === 'local') {
    return {
      supabaseUrl: 'http://127.0.0.1:54321',
      secretKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
    }
  }

  // dev or prod — pull from Doppler provisioner
  const out = execSync(
    `doppler run --project provisioner --config ${env} -- sh -c 'printf "%s %s" "$NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_SECRET_KEY"'`,
    { encoding: 'utf-8' }
  ).trim()

  const [supabaseUrl, secretKey] = out.split(' ')
  if (!supabaseUrl || !secretKey) {
    throw new Error(`Could not read NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY from Doppler provisioner (${env})`)
  }
  return { supabaseUrl, secretKey }
}

function uploadImage(filePath, storagePath, env) {
  const { supabaseUrl, secretKey } = getCredentials(env)

  const result = spawnSync(
    'curl',
    [
      '-s', '-w', '\n%{http_code}',
      '-X', 'POST',
      `${supabaseUrl}/storage/v1/object/products/${storagePath}`,
      '-H', `Authorization: Bearer ${secretKey}`,
      '-H', `apikey: ${secretKey}`,
      '-H', 'Content-Type: image/jpeg',
      '--data-binary', `@${filePath}`,
    ],
    { encoding: 'utf-8' }
  )

  if (result.error) throw result.error

  const lines = result.stdout.trim().split('\n')
  const httpStatus = lines[lines.length - 1]
  const body = lines.slice(0, -1).join('\n')

  if (httpStatus === '200' || httpStatus === '409') {
    return `✅ Uploaded (HTTP ${httpStatus})\nPath: products/${storagePath}\nPublic URL: ${supabaseUrl}/storage/v1/object/public/products/${storagePath}`
  }

  throw new Error(`HTTP ${httpStatus}: ${body}`)
}

rl.on('line', (line) => {
  let msg
  try { msg = JSON.parse(line) } catch { return }

  const { id, method, params } = msg

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0', id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'upload-image', version: '1.0.0' },
      },
    })
    return
  }

  if (method === 'notifications/initialized') return

  if (method === 'tools/list') {
    send({ jsonrpc: '2.0', id, result: { tools: TOOLS } })
    return
  }

  if (method === 'tools/call' && params?.name === 'upload_image') {
    const { file_path, storage_path, env } = params.arguments
    try {
      const text = uploadImage(file_path, storage_path, env)
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
