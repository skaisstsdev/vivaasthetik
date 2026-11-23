import { Resend } from 'resend';
import { servicesData } from '@/data/services';
import { SITE_URL } from '@/lib/seo';

// Отправка писем через Resend. Только на сервере: ключ из RESEND_API_KEY.
// Письмо никогда не ломает основное действие (запись, смена статуса): ошибки пишутся в лог.

export type Loc = 'de' | 'ru';

const FROM = process.env.MAIL_FROM || 'VIVA Ästhetik <termin@vivaasthetik.de>';
const ADMIN_TO = process.env.MAIL_ADMIN_TO || 'vivaasthetik@gmail.com';
const REPLY_TO = process.env.MAIL_REPLY_TO || 'vivaasthetik@gmail.com';

const PHONE = '+49 179 9004902';
const ADDRESS = 'Königstor 47, 34117 Kassel';

let client: Resend | null = null;
function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return (client ??= new Resend(process.env.RESEND_API_KEY));
}

async function send(opts: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const resend = getClient();
  if (!resend) {
    console.error('[mail] RESEND_API_KEY не задан, письмо не отправлено:', opts.subject);
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo ?? REPLY_TO,
    });
    if (error) {
      console.error('[mail] Resend error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[mail] send failed:', e instanceof Error ? e.message : e);
    return false;
  }
}

// ---------- Помощники ----------

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Защита от подмены заголовков письма: переводы строк в теме и имени не допускаются
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

function serviceTitle(slug: string, loc: Loc): string {
  return servicesData.find((s) => s.slug === slug)?.title[loc] ?? slug;
}

function fmtDate(date: string, loc: Loc): string {
  const d = new Date(`${date}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat(loc === 'de' ? 'de-DE' : 'ru-RU', { weekday: 'long', timeZone: 'UTC' }).format(d);
  const [y, m, day] = date.split('-');
  return `${weekday}, ${day}.${m}.${y}`;
}

// ---------- Оформление ----------

const NAVY = '#061220';
const GOLD = '#8a6327';

function layout(opts: { preheader: string; title: string; bodyHtml: string; loc: Loc | 'both' }) {
  const legal =
    opts.loc === 'ru'
      ? `<a href="${SITE_URL}/ru/impressum" style="color:#6b7280">Impressum</a> · <a href="${SITE_URL}/ru/datenschutz" style="color:#6b7280">Политика конфиденциальности</a>`
      : `<a href="${SITE_URL}/de/impressum" style="color:#6b7280">Impressum</a> · <a href="${SITE_URL}/de/datenschutz" style="color:#6b7280">Datenschutz</a>`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(opts.title)}</title></head>
<body style="margin:0;padding:0;background:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1f2937;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3ef;padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;">
    <tr><td style="background:${NAVY};padding:28px 32px;text-align:center;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:6px;color:#e8d9b5;">VIVA</div>
      <div style="font-size:10px;letter-spacing:4px;color:#9ca3af;margin-top:6px;text-transform:uppercase;">Ästhetik · Kassel</div>
    </td></tr>
    <tr><td style="padding:32px;font-size:15px;line-height:1.6;color:#374151;">${opts.bodyHtml}</td></tr>
    <tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;line-height:1.6;color:#6b7280;text-align:center;">
      VIVA Ästhetik · Natalya Schnal<br>${ADDRESS}<br>${PHONE} · <a href="mailto:${REPLY_TO}" style="color:#6b7280">${REPLY_TO}</a><br><br>${legal}
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

function detailsTable(rows: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e5e7eb;border-left:3px solid ${GOLD};background:#faf9f6;">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:10px 16px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#9ca3af;width:38%;vertical-align:top">${esc(k)}</td><td style="padding:10px 16px;color:#111827;font-weight:500">${v}</td></tr>`,
  )
  .join('\n')}
</table>`;
}

const h = (s: string) => `<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:24px;color:#111827">${esc(s)}</h1>`;
const p = (s: string) => `<p style="margin:0 0 14px">${s}</p>`;

// ---------- Данные ----------

export type BookingMail = {
  serviceSlug: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientNotes?: string | null;
  locale?: string | null;
};

// ---------- 1. Запись через сайт ----------
// Запись подтверждена сразу, как только клиент её оформил: слот занят, письмо клиенту
// называется подтверждением. Клиенту всегда на немецком (рабочий язык практики).

/** Письмо клиенту: запись подтверждена (всегда на немецком). */
export async function sendBookingConfirmationToClient(b: BookingMail) {
  if (!b.clientEmail) return;
  const service = serviceTitle(b.serviceSlug, 'de');
  const when = `${fmtDate(b.date, 'de')}, ${b.time}`;
  const title = 'Ihr Termin ist bestätigt';
  const hello = `Guten Tag ${esc(b.clientName)},`;
  const intro = 'vielen Dank für Ihre Buchung. Ihr Termin bei VIVA Ästhetik ist bestätigt. Wir freuen uns auf Sie.';
  const rows: [string, string][] = [['Behandlung', esc(service)], ['Termin', esc(when)], ['Adresse', esc(ADDRESS)]];
  const note = `Falls Sie den Termin nicht wahrnehmen können, sagen Sie bitte spätestens 24 Stunden vorher telefonisch (${PHONE}), per WhatsApp oder per E-Mail ab. Bei Fragen antworten Sie einfach auf diese E-Mail.`;
  const bye = 'Herzliche Grüße<br>Ihr Team von VIVA Ästhetik';

  await send({
    to: b.clientEmail,
    subject: 'Ihr Termin bei VIVA Ästhetik ist bestätigt',
    html: layout({ preheader: `${service}, ${when}`, title, bodyHtml: h(title) + p(hello) + p(intro) + detailsTable(rows) + p(note) + p(bye), loc: 'de' }),
    text: unesc(`${title}\n\n${hello}\n${intro}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${note}\n\nVIVA Ästhetik, ${ADDRESS}, ${PHONE}`),
  });
}

/** Письмо в практику: новая запись с сайта (по-русски, как админка). */
export async function sendNewBookingToAdmin(b: BookingMail, loc: Loc) {
  const service = serviceTitle(b.serviceSlug, 'ru');
  const when = `${fmtDate(b.date, 'ru')}, ${b.time}`;
  const rows: [string, string][] = [
    ['Процедура', esc(service)],
    ['Время', esc(when)],
    ['Клиент', esc(b.clientName)],
    ['E-mail', b.clientEmail ? `<a href="mailto:${esc(b.clientEmail)}" style="color:${GOLD}">${esc(b.clientEmail)}</a>` : '—'],
    ['Телефон', b.clientPhone ? `<a href="tel:${esc(b.clientPhone.replace(/\s/g, ''))}" style="color:${GOLD}">${esc(b.clientPhone)}</a>` : '—'],
    ['Язык сайта', loc === 'de' ? 'Немецкий' : 'Русский'],
    ['Комментарий', b.clientNotes ? esc(b.clientNotes).replace(/\n/g, '<br>') : '—'],
  ];
  const body =
    h('Новая запись с сайта') +
    p('Клиент записался через сайт, время занято, клиенту ушло письмо с подтверждением. Перенести или отменить запись можно в админке.') +
    detailsTable(rows) +
    p(`<a href="${SITE_URL}/de/admin" style="color:${GOLD}">Открыть админку</a>`);
  await send({
    to: ADMIN_TO,
    subject: oneLine(`Новая запись: ${service}, ${b.date} ${b.time} — ${b.clientName}`),
    html: layout({ preheader: `${b.clientName}, ${when}`, title: 'Новая запись', bodyHtml: body, loc: 'ru' }),
    text: unesc(rows.map(([k, v]) => `${k}: ${v.replace(/<[^>]+>/g, '')}`).join('\n')),
    replyTo: b.clientEmail || undefined,
  });
}

// ---------- 2. Контактная форма ----------

export async function sendContactMessage(m: { name: string; email: string; message: string; loc: Loc }) {
  const rows: [string, string][] = [
    ['Имя', esc(m.name)],
    ['E-mail', `<a href="mailto:${esc(m.email)}" style="color:${GOLD}">${esc(m.email)}</a>`],
    ['Язык сайта', m.loc === 'de' ? 'Немецкий' : 'Русский'],
  ];
  const body =
    h('Сообщение с сайта') +
    detailsTable(rows) +
    `<div style="margin:0 0 14px;padding:16px;background:#faf9f6;border:1px solid #e5e7eb;white-space:pre-wrap">${esc(m.message)}</div>` +
    p('Чтобы ответить, просто нажмите «Ответить» в почте: письмо уйдёт отправителю.');
  return send({
    to: ADMIN_TO,
    subject: oneLine(`Сообщение с сайта — ${m.name}`),
    html: layout({ preheader: m.message.slice(0, 90), title: 'Сообщение с сайта', bodyHtml: body, loc: 'ru' }),
    text: `Имя: ${m.name}\nE-mail: ${m.email}\nЯзык: ${m.loc}\n\n${m.message}`,
    replyTo: m.email,
  });
}

// ---------- 3. Отмена и перенос из админки (клиенту всегда на немецком) ----------

export type StatusKind = 'cancelled' | 'rescheduled';

export async function sendStatusEmail(kind: StatusKind, b: BookingMail) {
  if (!b.clientEmail) return;
  const [title, intro] =
    kind === 'cancelled'
      ? ['Ihr Termin wurde abgesagt', 'Ihr Termin wurde von der Praxis abgesagt. Gern vereinbaren wir einen neuen Termin: telefonisch, per WhatsApp oder über unsere Website.']
      : ['Ihr Termin wurde verschoben', 'Ihr Termin wurde auf die folgende Zeit verschoben.'];
  const service = serviceTitle(b.serviceSlug, 'de');
  const when = `${fmtDate(b.date, 'de')}, ${b.time}`;
  const rows: [string, string][] =
    kind === 'cancelled'
      ? [['Behandlung', esc(service)], ['Bisheriger Termin', esc(when)]]
      : [['Behandlung', esc(service)], ['Neuer Termin', esc(when)], ['Adresse', esc(ADDRESS)]];
  const hello = `Guten Tag ${esc(b.clientName)},`;
  const contact = p(`${PHONE} · <a href="mailto:${REPLY_TO}" style="color:${GOLD}">${REPLY_TO}</a>`);

  await send({
    to: b.clientEmail,
    subject: title,
    html: layout({ preheader: title, title, bodyHtml: h(title) + p(hello) + p(esc(intro)) + detailsTable(rows) + contact, loc: 'de' }),
    text: unesc(`${title}\n\n${hello}\n${intro}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nVIVA Ästhetik, ${ADDRESS}, ${PHONE}`),
  });
}

function unesc(s: string) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}
