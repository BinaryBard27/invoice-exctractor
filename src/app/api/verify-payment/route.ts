import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getClientKey } from '@/lib/rate-limit';
import { grantPaidAccess, isRequestRateLimited } from '@/lib/server-data';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ verified: false, error: 'Sign in required.' }, { status: 401 });

    if (await isRequestRateLimited(`payment:${getClientKey(request)}:${userId}`, 10, 60)) {
      return NextResponse.json({ verified: false, error: 'Too many verification attempts. Please try again in a minute.' }, { status: 429 });
    }
    const body = await request.json();
    const license_key = typeof body?.license_key === 'string' ? body.license_key.trim() : '';

    if (!license_key || license_key.length > 256) {
      return NextResponse.json({ verified: false, error: 'No license key provided' }, { status: 400 });
    }

    const productId = process.env.GUMROAD_PRODUCT_ID;
    if (!productId) {
      return NextResponse.json({ verified: false, error: 'Configuration error' }, { status: 500 });
    }

    const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        product_id: productId,
        license_key: license_key.trim(),
      }),
    });

    const data = await res.json();

    if (data.success === true) {
      await grantPaidAccess(userId, license_key);
      return NextResponse.json({ verified: true });
    }
    
    return NextResponse.json({ verified: false });
  } catch (error) {
    console.error('Gumroad verify error:', error);
    return NextResponse.json({ verified: false, error: 'Internal server error' }, { status: 500 });
  }
}
