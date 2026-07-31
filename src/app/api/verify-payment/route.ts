import { NextResponse } from 'next/server';
import { setPaidCookie } from '@/lib/access';
import { getClientKey, isRateLimited } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    if (isRateLimited(`payment:${getClientKey(request)}`, 10, 60_000)) {
      return NextResponse.json({ verified: false, error: 'Too many verification attempts. Please try again in a minute.' }, { status: 429 });
    }
    const body = await request.json();
    const { license_key } = body;

    if (!license_key) {
      return NextResponse.json({ verified: false, error: 'No license key provided' }, { status: 400 });
    }

    const productId = process.env.GUMROAD_PRODUCT_ID;
    if (!productId) {
      return NextResponse.json({ verified: false, error: 'Configuration error' }, { status: 500 });
    }

    const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
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
      const response = NextResponse.json({ verified: true });
      setPaidCookie(response);
      return response;
    }
    
    return NextResponse.json({ verified: false });
  } catch (error) {
    console.error('Gumroad verify error:', error);
    return NextResponse.json({ verified: false, error: 'Internal server error' }, { status: 500 });
  }
}
