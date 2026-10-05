CREATE TABLE IF NOT EXISTS user_entitlements (
  user_id TEXT PRIMARY KEY,
  invoice_count INTEGER NOT NULL DEFAULT 0 CHECK (invoice_count >= 0),
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  license_key_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
