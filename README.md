# PullInvoice

PullInvoice converts invoice PDFs into downloadable Excel and CSV files.

## Local development

1. Copy `.env.example` to `.env.local` and add the Clerk, Gumroad, Neon, and Upstash values.
2. Run `npm install`.
3. Run `npm run dev`.

## Production services

- Vercel Pro for the Next.js application.
- Clerk for authentication.
- Neon Postgres for user entitlements and usage.
- Upstash Redis for shared rate limiting.
- Gumroad for payment and license verification.

## Database setup

Run `db/schema.sql` once against the production Neon database before opening the app to users.

## Required environment variables

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
GUMROAD_PRODUCT_ID
NEXT_PUBLIC_GUMROAD_PRODUCT_ID
ACCESS_TOKEN_SECRET
DATABASE_URL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

## Verification

```text
npm run lint
npm run build
```

Before launch, test signup, login, unauthorized API access, PDF extraction, the 10-invoice limit, payment verification, Excel download, CSV download, and a second browser session.
