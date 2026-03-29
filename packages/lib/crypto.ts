import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 12  // 96 bits (recommended for GCM)
const TAG_LENGTH = 16

function getKey(): Buffer {
  const key = process.env.AUTH_ENCRYPTION_KEY
  if (!key) throw new Error('AUTH_ENCRYPTION_KEY is not set')
  const buf = Buffer.from(key, 'hex')
  if (buf.length !== KEY_LENGTH) throw new Error('AUTH_ENCRYPTION_KEY must be 32 bytes (64 hex chars)')
  return buf
}

/**
 * AES-256-GCM encrypt. Returns iv:tag:ciphertext as a hex string.
 */
export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString('hex'), tag.toString('hex'), encrypted.toString('hex')].join(':')
}

/**
 * AES-256-GCM decrypt. Accepts the iv:tag:ciphertext hex string from encrypt().
 */
export function decrypt(encoded: string): string {
  const key = getKey()
  const [ivHex, tagHex, dataHex] = encoded.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const data = Buffer.from(dataHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  return decipher.update(data) + decipher.final('utf8')
}
