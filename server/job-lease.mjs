/**
 * Cross-instance lease for scheduled background jobs.
 *
 * With MongoDB the lease lives in a dedicated collection and acquisition uses
 * an atomic findOneAndUpdate, so exactly one instance can hold a job window at
 * a time even when several instances run the hourly lifecycle/reconciliation
 * schedule. With the single-instance SQLite/PostgreSQL backends the lease is
 * kept in application state (best effort).
 */
import { randomUUID } from 'node:crypto'

const instanceId = randomUUID()

export function createJobLeases({ mongoDb, getState, setState }) {
  const mongoLeases = mongoDb ? mongoDb.collection('myr_job_leases') : null
  async function acquire(name, ttlMs, now = Date.now()) {
    if (mongoLeases) {
      try {
        const lease = await mongoLeases.findOneAndUpdate(
          { _id: name, $or: [{ expiresAt: { $lte: new Date(now) } }, { expiresAt: { $exists: false } }] },
          { $set: { owner: instanceId, expiresAt: new Date(now + ttlMs), acquiredAt: new Date(now) } },
          { upsert: true, returnDocument: 'after' },
        )
        return lease?.owner === instanceId ? { acquired: true, owner: instanceId } : { acquired: false, owner: lease?.owner || null }
      } catch (error) {
        // Duplicate-key on upsert means another instance holds an unexpired lease.
        if (error?.code === 11000) return { acquired: false, owner: null }
        throw error
      }
    }
    const state = getState()
    state.saasJobLeases ||= {}
    const current = state.saasJobLeases[name]
    if (current && current.expiresAt > now && current.owner !== instanceId) return { acquired: false, owner: current.owner }
    state.saasJobLeases[name] = { owner: instanceId, expiresAt: now + ttlMs, acquiredAt: now }
    if (setState) await setState()
    return { acquired: true, owner: instanceId }
  }
  async function release(name) {
    if (mongoLeases) {
      await mongoLeases.deleteOne({ _id: name, owner: instanceId })
      return
    }
    const state = getState()
    if (state.saasJobLeases?.[name]?.owner === instanceId) {
      delete state.saasJobLeases[name]
      if (setState) await setState()
    }
  }
  async function runExclusive(name, ttlMs, task) {
    const lease = await acquire(name, ttlMs)
    if (!lease.acquired) return { ran: false, result: null }
    try { return { ran: true, result: await task() } }
    finally { await release(name).catch(() => {}) }
  }
  return { instanceId, acquire, release, runExclusive }
}
