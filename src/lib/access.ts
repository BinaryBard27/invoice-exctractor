import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { NextResponse } from 'next/server';

export const FREE_INVOICE_LIMIT = 10;
const ACCESS_COOKIE = 'invoice_access';
const USAGE_COOKIE = 'invoice_usage';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type AccessPayload = { paid: true; issuedAt: number };
type UsagePayload = { count: number };

function getKey() {
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.CLERK_SECRET_KEY;
  if (!secret) throw new Error('ACCESS_TOKEN_SECRET or CLERK_SECRET_KEY is required');
  return createHash('sha256').update(secret).digest();
}

function encrypt(payload: object) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString('base64url')).join('.');
}

function decrypt<T>(value: string | undefined): T | null {
  if (!value) return null;
  try {
    const [ivText, tagText, ciphertextText] = value.split('.');
    if (!ivText || !tagText || !ciphertextText) return null;
    const decipher = createDecipheriv('aes-256-gcm', getKey(), Buffer.from(ivText, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagText, 'base64url'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertextText, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
    return JSON.parse(plaintext) as T;
  } catch {
    return null;
  }
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') || '';
  const match = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function isPaid(request: Request) {
  return decrypt<AccessPayload>(readCookie(request, ACCESS_COOKIE))?.paid === true;
}

export function getUsageCount(request: Request) {
  const count = decrypt<UsagePayload>(readCookie(request, USAGE_COOKIE))?.count;
  return typeof count === 'number' && Number.isSafeInteger(count) && count >= 0 ? count : 0;
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: COOKIE_MAX_AGE,
};

export function setPaidCookie(response: NextResponse) {
  const value = encrypt({ paid: true, issuedAt: Date.now() } satisfies AccessPayload);
  response.cookies.set(ACCESS_COOKIE, value, cookieOptions);
}

export function setUsageCookie(response: NextResponse, count: number) {
  const value = encrypt({ count } satisfies UsagePayload);
  response.cookies.set(USAGE_COOKIE, value, cookieOptions);
}
