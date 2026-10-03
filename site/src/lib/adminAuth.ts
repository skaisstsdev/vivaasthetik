import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

// Stateless admin session: cookie value is "<expiresAt>.<hmac(expiresAt)>",
// signed with ADMIN_SESSION_SECRET. Only server code may import this file.

const COOKIE = 'viva_admin';
const MAX_AGE_SEC = 30 * 24 * 60 * 60;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('ADMIN_SESSION_SECRET is not configured');
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error('ADMIN_PASSWORD is not configured');
  // Compare HMACs so lengths always match and timing doesn't leak the password.
  return safeEqual(sign(password), sign(expected));
}

export async function createAdminSession() {
  const expiresAt = Date.now() + MAX_AGE_SEC * 1000;
  const payload = String(expiresAt);
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE_SEC,
  });
}

export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [payload, sig] = value.split('.');
  if (!payload || !sig) return false;
  try {
    if (!safeEqual(sig, sign(payload))) return false;
  } catch {
    return false;
  }
  return Number(payload) > Date.now();
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Сессия истекла — войдите заново');
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new UnauthorizedError();
}
