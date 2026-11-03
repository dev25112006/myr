import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeNotificationSettings, resolveRecipients } from './email-notify.mjs'

test('default rules send to admin and the user', () => {
  const settings = normalizeNotificationSettings({})
  const users = [
    { id: 'u1', email: 'customer@example.com', role: 'customer' },
    { id: 'u2', email: 'admin@example.com', role: 'admin' },
    { id: 'u3', email: 'manager@example.com', role: 'manager' },
  ]

  const recipients = resolveRecipients({
    users,
    settings,
    event: 'order',
    user: { email: 'customer@example.com', role: 'customer' },
  })

  assert.deepEqual(recipients, ['customer@example.com', 'admin@example.com'])
})

test('custom rules can route support mail to manager and admin', () => {
  const settings = normalizeNotificationSettings({
    enabled: true,
    defaultRoles: ['admin'],
    channels: {
      support: { roles: ['manager', 'admin'] },
    },
  })

  const users = [
    { id: 'u1', email: 'customer@example.com', role: 'customer' },
    { id: 'u2', email: 'admin@example.com', role: 'admin' },
    { id: 'u3', email: 'manager@example.com', role: 'manager' },
  ]

  const recipients = resolveRecipients({
    users,
    settings,
    event: 'support',
    user: { email: 'customer@example.com', role: 'customer' },
  })

  assert.deepEqual(recipients, ['customer@example.com', 'manager@example.com', 'admin@example.com'])
})
