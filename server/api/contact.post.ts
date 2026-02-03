import { z } from 'zod'
import { Resend } from 'resend'
import { checkRateLimit } from '~~/server/utils/rateLimit'
import { buildEmail } from '~~/server/utils/contactEmail'

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  type: z.enum(['showcase', 'ecommerce', 'webapp', 'redesign', 'other']),
  message: z.string().trim().min(20).max(5000),
  website: z.string().optional(), // honeypot
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  // Honeypot — silently succeed if the bot trap is filled.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return { ok: true }
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return {
      ok: false,
      errors: Object.fromEntries(
        parsed.error.issues.map(i => [i.path.join('.'), i.code]),
      ),
    }
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!checkRateLimit(ip)) {
    setResponseStatus(event, 429)
    return { ok: false, error: 'rate_limit' }
  }

  const config = useRuntimeConfig()
  if (!config.resendApiKey) {
    setResponseStatus(event, 500)
    return { ok: false, error: 'network' }
  }

  const resend = new Resend(config.resendApiKey)
  const { subject, text, html } = buildEmail(parsed.data)

  try {
    const result = await resend.emails.send({
      from: 'Portfolio <hello@emericguyon.com>',
      to: 'hello@emericguyon.com',
      replyTo: parsed.data.email,
      subject,
      text,
      html,
    })
    if (result.error) {
      console.error('[contact] resend error', result.error)
      setResponseStatus(event, 500)
      return { ok: false, error: 'network' }
    }
    return { ok: true }
  }
  catch (err) {
    console.error('[contact] send threw', err)
    setResponseStatus(event, 500)
    return { ok: false, error: 'network' }
  }
})
