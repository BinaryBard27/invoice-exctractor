import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
// @ts-expect-error pdf-parse has no default export in types
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { extractInvoiceData } from '@/lib/parser';
import { FREE_INVOICE_LIMIT } from '@/lib/access';
import { reserveInvoiceUsage, getUserState, isRequestRateLimited } from '@/lib/server-data';
import { getClientKey } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

    if (await isRequestRateLimited(`extract:${getClientKey(request)}:${userId}`, 20, 60)) {
      return NextResponse.json({ error: 'Too many extraction requests. Please try again in a minute.' }, { status: 429 });
    }

    const state = await getUserState(userId);
    if (!state.paid && state.invoice_count >= FREE_INVOICE_LIMIT) {
      return NextResponse.json({ error: 'Free limit reached. Please purchase access to continue.', code: 'PAYWALL' }, { status: 402 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files').filter((value): value is File => value instanceof File);
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 });
    }

    if (!state.paid && state.invoice_count + files.length > FREE_INVOICE_LIMIT) {
      return NextResponse.json({ error: `Only ${FREE_INVOICE_LIMIT - state.invoice_count} free invoice${FREE_INVOICE_LIMIT - state.invoice_count === 1 ? '' : 's'} remaining.`, code: 'PAYWALL' }, { status: 402 });
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (files.some((file) => file.size === 0 || file.size > MAX_FILE_SIZE)) {
      return NextResponse.json({ error: 'Each PDF must be smaller than 10 MB.' }, { status: 413 });
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json({ error: 'The combined upload must be smaller than 50 MB.' }, { status: 413 });
    }

    for (const file of files) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json({ error: 'Only PDF files are supported.' }, { status: 415 });
      }
    }

    const reservation = await reserveInvoiceUsage(userId, state.paid ? 0 : files.length, FREE_INVOICE_LIMIT);
    if (!reservation) {
      return NextResponse.json({ error: 'Free limit reached. Please purchase access to continue.', code: 'PAYWALL' }, { status: 402 });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
            throw new Error('Invalid PDF signature');
          }
          const parsed = await pdfParse(buffer);
          return extractInvoiceData(parsed.text);
        } catch {
          const failed = extractInvoiceData('');
          failed.vendor_name = 'Could not read PDF';
          return failed;
        }
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
