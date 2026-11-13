// src/lib/emailTemplate.ts
// Small branded HTML shell for the two emails Ajer Haus actually sends via
// Resend (order confirmation, notify-me signup ack). Unstitch's equivalent
// (~/Unstitch/src/lib/emailTemplate.ts) is ~800 lines covering many more
// email types (broadcasts, gift acknowledgements, admin custom sends) this
// site doesn't have yet — this is deliberately much smaller, not a trimmed
// copy of that file.

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Ajer Haus <hello@ajerhaus.com>';

const INK = '#1F1B18';
const PAPER = '#ffffff';
const ACCENT = '#2C187A';
const MUTED = '#666666';
const BG = '#f6f4f1';

/** Minimal HTML-escaping for values interpolated into markup below. */
export function esc(value: unknown): string {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c)
  );
}

function wrap(heading: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${PAPER};border-radius:12px;overflow:hidden;">
      <tr><td style="padding:28px 32px;border-bottom:1px solid #eee;">
        <p style="margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${ACCENT};font-weight:700;">Ajer Haus</p>
        <h1 style="margin:8px 0 0;font-size:22px;">${esc(heading)}</h1>
      </td></tr>
      <tr><td style="padding:24px 32px;font-size:14px;line-height:1.6;color:${INK};">${bodyHtml}</td></tr>
      <tr><td style="padding:16px 32px;background:${BG};text-align:center;">
        <p style="margin:0;font-size:11px;color:${MUTED};">Ajer Haus · Melbourne, Australia · hello@ajerhaus.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

export function orderConfirmationEmail({
  orderNumber,
  totalCents,
  currency,
  lookupLink,
  items,
  deliveryMethodLabel,
  deliveryFeeCents,
  deliveryAddress,
}: {
  orderNumber: string;
  totalCents: number;
  currency: string;
  lookupLink: string;
  items: Array<{ name: string; quantity: number }>;
  deliveryMethodLabel: string;
  deliveryFeeCents: number;
  deliveryAddress?: { line1: string; line2?: string | null; suburb: string; postcode: string } | null;
}): { html: string; text: string } {
  const money = (cents: number) => `$${(cents / 100).toFixed(2)} ${currency}`;
  const itemsHtml = items.map((i) => `<li>${esc(i.quantity)} × ${esc(i.name)}</li>`).join('');
  const addressHtml = deliveryAddress
    ? `<p style="margin:12px 0 0;color:${MUTED};">${esc(deliveryAddress.line1)}${deliveryAddress.line2 ? ', ' + esc(deliveryAddress.line2) : ''}, ${esc(deliveryAddress.suburb)} ${esc(deliveryAddress.postcode)}</p>`
    : '';

  const bodyHtml = `
    <p>Thank you — your pre-order <strong>${esc(orderNumber)}</strong> is confirmed.</p>
    <ul style="padding-left:18px;">${itemsHtml}</ul>
    <p>${esc(deliveryMethodLabel)}${deliveryFeeCents ? ` · ${money(deliveryFeeCents)}` : ' · Free'}</p>
    ${addressHtml}
    <p style="margin-top:16px;"><strong>Total: ${money(totalCents)}</strong></p>
    <p style="margin-top:20px;"><a href="${esc(lookupLink)}" style="color:${ACCENT};">Track your order</a></p>
    <p style="margin-top:20px;color:${MUTED};">We'll email you again when it ships.</p>
  `;

  const text = [
    `Your pre-order ${orderNumber} is confirmed.`,
    ...items.map((i) => `${i.quantity} x ${i.name}`),
    `${deliveryMethodLabel}${deliveryFeeCents ? ` - ${money(deliveryFeeCents)}` : ' - Free'}`,
    `Total: ${money(totalCents)}`,
    `Track your order: ${lookupLink}`,
  ].join('\n');

  return { html: wrap(`Order ${orderNumber} confirmed`, bodyHtml), text };
}

export function notifyMeConfirmationEmail({ productName }: { productName: string }): { html: string; text: string } {
  const bodyHtml = `<p>You're on the list — we'll email you the moment <strong>${esc(productName)}</strong> is poured and ready to pre-order.</p>`;
  const text = `You're on the list - we'll email you the moment ${productName} is poured and ready to pre-order.`;
  return { html: wrap("You're on the list", bodyHtml), text };
}

/** Internal notification to the Ajer Haus inbox for a "Say hello." contact form submission. */
export function contactMessageEmail({
  name,
  email,
  topic,
  message,
}: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): { html: string; text: string } {
  const bodyHtml = `
    <p><strong>${esc(name)}</strong> (${esc(email)}) — ${esc(topic)}</p>
    <p style="white-space:pre-wrap;">${esc(message)}</p>
  `;
  const text = `${name} (${email}) - ${topic}\n\n${message}`;
  return { html: wrap('New contact message', bodyHtml), text };
}
