// Pure builder for the contact email sent to Emeric.
// Kept separate from the endpoint so it's easy to tweak copy without
// touching transport logic.

const TYPE_LABELS_FR: Record<string, string> = {
  showcase: 'Site vitrine',
  ecommerce: 'E-commerce',
  webapp: 'Web app / SaaS',
  redesign: 'Refonte / optimisation',
  other: 'Autre',
}

export interface ContactEmailInput {
  name: string
  email: string
  type: 'showcase' | 'ecommerce' | 'webapp' | 'redesign' | 'other'
  message: string
}

export interface BuiltEmail {
  subject: string
  text: string
  html: string
}

export function buildEmail(input: ContactEmailInput): BuiltEmail {
  const typeLabel = TYPE_LABELS_FR[input.type] || input.type
  const subject = `[Portfolio] ${typeLabel} — ${input.name}`
  const receivedAt = new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const text = [
    'Nouveau contact depuis le portfolio :',
    '',
    `Nom        : ${input.name}`,
    `Email      : ${input.email}`,
    `Type       : ${typeLabel}`,
    '',
    'Message :',
    input.message,
    '',
    '—',
    `Reçu le ${receivedAt}`,
  ].join('\n')

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const messageHtml = escape(input.message).replace(/\n/g, '<br>')
  const html = `
<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#111">
  <p>Nouveau contact depuis le portfolio :</p>
  <table cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;border-collapse:collapse">
    <tr><td style="padding-right:16px;color:#666">Nom</td><td>${escape(input.name)}</td></tr>
    <tr><td style="padding-right:16px;color:#666">Email</td><td>${escape(input.email)}</td></tr>
    <tr><td style="padding-right:16px;color:#666">Type</td><td>${escape(typeLabel)}</td></tr>
  </table>
  <p style="color:#666;margin-bottom:8px">Message :</p>
  <div style="padding:12px;background:#f5f5f5;border-radius:4px">${messageHtml}</div>
  <p style="margin-top:24px;color:#999;font-size:12px">Reçu le ${escape(receivedAt)}</p>
</div>`.trim()

  return { subject, text, html }
}
