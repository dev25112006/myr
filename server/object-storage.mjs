/**
 * Private object-storage boundary for SaaS support attachments.
 *
 * The default driver writes to a private local directory (single instance).
 * The S3-compatible driver targets any private bucket (AWS S3, MinIO, R2,
 * Render Object Storage, etc.) so multi-instance production deployments never
 * depend on local disk. Buckets must remain private; downloads always flow
 * through the authorization-checked API.
 */
import { createHash, createHmac, randomBytes } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

export class ObjectStorage {
  constructor(name) { this.name = name }
  put() { throw new Error(`${this.name} does not implement put.`) }
  get() { throw new Error(`${this.name} does not implement get.`) }
  delete() { throw new Error(`${this.name} does not implement delete.`) }
}

export function createFileSystemStorage(rootDir) {
  const resolveKey = (key) => {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(String(key))) throw Object.assign(new Error('Invalid storage key.'), { status: 400 })
    const target = path.join(rootDir, String(key))
    if (!target.startsWith(path.resolve(rootDir) + path.sep)) throw Object.assign(new Error('Invalid storage key.'), { status: 400 })
    return target
  }
  return {
    name: 'filesystem',
    async put(key, bytes) { await mkdir(rootDir, { recursive: true, mode: 0o700 }); await writeFile(resolveKey(key), bytes, { flag: 'wx', mode: 0o600 }) },
    async get(key) { return readFile(resolveKey(key)) },
    async delete(key) { await rm(resolveKey(key), { force: true }) },
  }
}

function hmac(key, value) { return createHmac('sha256', key).update(value).digest() }

/** Minimal AWS SigV4 signer for S3-compatible private buckets. */
function signV4({ method, url, headers, body, accessKeyId, secretAccessKey, region, service = 's3', now = new Date() }) {
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const payloadHash = createHash('sha256').update(body).digest('hex')
  const signedHeaderNames = Object.keys(headers).map((name) => name.toLowerCase()).sort()
  const canonicalHeaders = signedHeaderNames.map((name) => `${name}:${String(headers[Object.keys(headers).find((key) => key.toLowerCase() === name)]).trim().replace(/\s+/g, ' ')}\n`).join('')
  const signedHeaders = signedHeaderNames.join(';')
  const canonicalQuery = [...url.searchParams.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
  const canonicalRequest = [method, url.pathname || '/', canonicalQuery, canonicalHeaders, signedHeaders, payloadHash].join('\n')
  const scope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, createHash('sha256').update(canonicalRequest).digest('hex')].join('\n')
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp)
  const regionKey = hmac(dateKey, region)
  const serviceKey = hmac(regionKey, service)
  const signingKey = hmac(serviceKey, 'aws4_request')
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex')
  return {
    ...headers,
    authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  }
}

export function createS3Storage({ endpoint, region, bucket, accessKeyId, secretAccessKey, forcePathStyle = true }) {
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) throw new Error('S3 storage requires endpoint, bucket, access key id and secret access key.')
  const base = new URL(endpoint)
  const objectUrl = (key) => {
    const encoded = encodeURIComponent(String(key))
    return forcePathStyle ? new URL(`${base.pathname.replace(/\/$/, '')}/${encodeURIComponent(bucket)}/${encoded}`, base) : new URL(`${base.pathname.replace(/\/$/, '')}/${encoded}`, `https://${bucket}.${base.host}`)
  }
  const request = async (method, key, body = Buffer.alloc(0), extraHeaders = {}) => {
    const url = objectUrl(key)
    const headers = { host: url.host, ...extraHeaders }
    const signed = signV4({ method, url, headers, body, accessKeyId, secretAccessKey, region })
    const response = await fetch(url, { method, headers: signed, body: method === 'GET' ? undefined : body, signal: AbortSignal.timeout(30_000) })
    return response
  }
  return {
    name: 's3',
    async put(key, bytes) {
      const response = await request('PUT', key, bytes, { 'content-type': 'application/octet-stream' })
      if (!response.ok) throw new Error(`Object storage PUT failed with HTTP ${response.status}.`)
    },
    async get(key) {
      const response = await request('GET', key)
      if (response.status === 404) return null
      if (!response.ok) throw new Error(`Object storage GET failed with HTTP ${response.status}.`)
      return Buffer.from(await response.arrayBuffer())
    },
    async delete(key) {
      const response = await request('DELETE', key)
      if (!response.ok && response.status !== 404) throw new Error(`Object storage DELETE failed with HTTP ${response.status}.`)
    },
  }
}

export function createAttachmentStorage({ dataDir, env = process.env }) {
  if (env.SAAS_OBJECT_STORAGE === 's3') {
    return createS3Storage({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION || 'us-east-1',
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      forcePathStyle: env.S3_FORCE_PATH_STYLE !== 'false',
    })
  }
  if (env.SAAS_OBJECT_STORAGE && env.SAAS_OBJECT_STORAGE !== 'filesystem') throw new Error(`Unknown SAAS_OBJECT_STORAGE driver: ${env.SAAS_OBJECT_STORAGE}`)
  return createFileSystemStorage(path.join(dataDir, 'saas-support-attachments'))
}

export function newAttachmentKey(id = randomBytes(16).toString('hex')) { return `${id}.bin` }
