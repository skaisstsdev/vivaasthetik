'use server';

import { headers } from 'next/headers';
import { sendContactMessage } from '@/lib/mail';

// Сообщение из контактной формы. Письмо уходит с сервера: ключ почты в браузер не попадает.

export type ContactResult = { ok: true } | { ok: false; reason: 'invalid' | 'rate' | 'send' };

const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3; // сообщений за 10 минут с одного адреса
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return false;
}

export async function submitContact(input: {
  name: string;
  email: string;
  message: string;
  website?: string; // поле-ловушка для ботов
  locale?: 'de' | 'ru';
}): Promise<ContactResult> {
  // Ловушка заполнена: делаем вид, что всё хорошо, письмо не отправляем
  if ((input.website ?? '').trim() !== '') return { ok: true };

  const name = (input.name ?? '').trim().slice(0, 120);
  const email = (input.email ?? '').trim().slice(0, 200);
  const message = (input.message ?? '').trim().slice(0, 4000);
  if (!name || !message || !EMAIL_RE.test(email)) return { ok: false, reason: 'invalid' };

  const h = await headers();
  const ip = (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown').trim();
  if (limited(ip)) return { ok: false, reason: 'rate' };

  const ok = await sendContactMessage({ name, email, message });
  return ok ? { ok: true } : { ok: false, reason: 'send' };
}
