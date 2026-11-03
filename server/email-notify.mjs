import nodemailer from 'nodemailer'

export const defaultNotificationSettings = {
  enabled: true,
  defaultRoles: ['admin'],
  channels: {
    default: { enabled: true, includeUser: true, roles: ['admin'] },
    account: { enabled: true, includeUser: true, roles: ['admin'] },
    order: { enabled: true, includeUser: true, roles: ['admin'] },
    payment: { enabled: true, includeUser: true, roles: ['admin'] },
    support: { enabled: true, includeUser: true, roles: ['admin', 'manager'] },
    contact: { enabled: true, includeUser: true, roles: ['admin', 'manager'] },
    review: { enabled: true, includeUser: true, roles: ['admin'] },
  },
}

const roleOrder = ['admin', 'manager', 'customer']

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function normalizeRoleList(value, fallback = ['admin']) {
  if (!Array.isArray(value)) return [...fallback]
  const roles = [...new Set(value.map((item) => String(item).trim().toLowerCase()).filter((item) => item && ['admin', 'manager', 'customer'].includes(item)))]
  return roles.length ? roles : [...fallback]
}

export function normalizeNotificationSettings(value) {
  const source = value && typeof value === 'object' ? value : {}
  const settings = {
    enabled: source.enabled !== false,
    defaultRoles: normalizeRoleList(source.defaultRoles, defaultNotificationSettings.defaultRoles),
    channels: {},
  }

  const configuredChannels = source.channels && typeof source.channels === 'object' ? source.channels : {}
  for (const [key, entry] of Object.entries({ ...defaultNotificationSettings.channels, ...configuredChannels })) {
    const channelValue = entry && typeof entry === 'object' ? entry : {}
    settings.channels[key] = {
      enabled: channelValue.enabled !== false,
      includeUser: channelValue.includeUser !== false,
      roles: normalizeRoleList(channelValue.roles, settings.defaultRoles),
      emails: Array.isArray(channelValue.emails) ? channelValue.emails.map(normalizeEmail).filter(Boolean) : [],
    }
  }

  return settings
}

export function resolveRecipients({ users = [], settings, event = 'default', user = null, includeUser = true, roles = [], explicitEmails = [] }) {
  const normalizedSettings = normalizeNotificationSettings(settings)
  const eventConfig = normalizedSettings.channels[event] || normalizedSettings.channels.default || normalizedSettings.channels[Object.keys(normalizedSettings.channels)[0]] || { enabled: true, includeUser: true, roles: normalizedSettings.defaultRoles, emails: [] }
  const targetRoles = Array.isArray(roles) && roles.length ? normalizeRoleList(roles, eventConfig.roles) : eventConfig.roles
  const recipients = new Set()

  if (includeUser && user?.email) {
    const normalized = normalizeEmail(user.email)
    if (normalized) recipients.add(normalized)
  }

  for (const recipient of [...(Array.isArray(explicitEmails) ? explicitEmails : []), ...eventConfig.emails]) {
    const normalized = normalizeEmail(recipient)
    if (normalized) recipients.add(normalized)
  }

  for (const role of targetRoles) {
    const members = Array.isArray(users) ? users.filter((account) => account?.role === role && typeof account?.email === 'string' && account.email.trim()) : []
    for (const member of members) {
      const normalized = normalizeEmail(member.email)
      if (normalized) recipients.add(normalized)
    }
  }

  const ordered = [...recipients]
  ordered.sort((left, right) => {
    const leftRank = roleOrder.indexOf(left.includes('@') ? 'customer' : 'admin')
    const rightRank = roleOrder.indexOf(right.includes('@') ? 'customer' : 'admin')
    return leftRank - rightRank
  })

  return ordered
}

export async function sendEmail(to, subject, html, { env = process.env, text } = {}) {
  const recipients = Array.isArray(to) ? to : [to]
  const uniqueRecipients = [...new Set(recipients.map(normalizeEmail).filter(Boolean))]
  if (!uniqueRecipients.length) return false

  const smtpHost = env.SMTP_HOST?.trim()
  const smtpUser = env.SMTP_USER?.trim()
  const smtpPass = env.SMTP_PASS?.trim()
  const smtpPort = Number(env.SMTP_PORT || 587)
  const smtpFrom = env.SMTP_FROM || env.EMAIL_FROM || smtpUser

  try {
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number.isFinite(smtpPort) ? smtpPort : 587,
        secure: String(env.SMTP_SECURE || '').toLowerCase() === 'true' || Number(env.SMTP_PORT || 587) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      })
      await transporter.sendMail({ from: smtpFrom || smtpUser, to: uniqueRecipients, subject, html, text: text || html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() })
      return true
    }
  } catch (error) {
    console.error('SMTP delivery failed:', error)
  }

  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return false
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: uniqueRecipients, subject, html }),
  })

  if (!response.ok) {
    console.error('Email provider request failed:', response.status)
    return false
  }

  return true
}
