import { neon } from '@neondatabase/serverless';
import { Redis } from '@upstash/redis';
import { createHash } from 'node:crypto';

type UserState = { invoice_count: number; paid: boolean };

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

function redis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Upstash Redis is not configured');
  return new Redis({ url, token });
}

export async function getUserState(userId: string): Promise<UserState> {
  const sql = database();
  const rows = await sql`SELECT invoice_count, paid FROM user_entitlements WHERE user_id = ${userId}` as Array<{ invoice_count: number; paid: boolean }>;
  return rows[0] ?? { invoice_count: 0, paid: false };
}

export async function incrementInvoiceUsage(userId: string, amount: number) {
  const sql = database();
  await sql`
    INSERT INTO user_entitlements (user_id, invoice_count, paid)
    VALUES (${userId}, ${amount}, false)
    ON CONFLICT (user_id)
    DO UPDATE SET invoice_count = user_entitlements.invoice_count + ${amount}, updated_at = NOW()
  `;
}

export async function reserveInvoiceUsage(userId: string, amount: number, freeLimit: number) {
  const sql = database();
  const rows = await sql`
    INSERT INTO user_entitlements (user_id, invoice_count, paid)
    VALUES (${userId}, ${amount}, false)
    ON CONFLICT (user_id)
    DO UPDATE SET invoice_count = user_entitlements.invoice_count + ${amount}, updated_at = NOW()
    WHERE user_entitlements.paid OR user_entitlements.invoice_count + ${amount} <= ${freeLimit}
    RETURNING paid, invoice_count
  ` as Array<{ paid: boolean; invoice_count: number }>;
  return rows[0] ?? null;
}

export async function grantPaidAccess(userId: string, licenseKey: string) {
  const sql = database();
  const hash = createHash('sha256').update(licenseKey).digest('hex');
  await sql`
    INSERT INTO user_entitlements (user_id, invoice_count, paid, license_key_hash)
    VALUES (${userId}, 0, true, ${hash})
    ON CONFLICT (user_id)
    DO UPDATE SET paid = true, license_key_hash = ${hash}, updated_at = NOW()
  `;
}

export async function isRequestRateLimited(key: string, limit: number, windowSeconds: number) {
  const store = redis();
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const redisKey = `rate:${key}:${bucket}`;
  const count = await store.incr(redisKey);
  if (count === 1) await store.expire(redisKey, windowSeconds + 5);
  return count > limit;
}
