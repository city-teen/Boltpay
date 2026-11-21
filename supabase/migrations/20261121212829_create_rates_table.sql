/*
# Create exchange_rates table for Sidra Pay rate board

1. New Tables
- `exchange_rates`
  - `id` (uuid, primary key)
  - `aed_per_1000_inr` (numeric, not null) — AED amount the sender pays for the recipient to receive 1000 INR. e.g. 36.50 means 36.50 AED = 1000 INR.
  - `note` (text, nullable) — optional note from the admin when updating the rate.
  - `updated_at` (timestamptz, default now()) — when this rate entry was created.
2. Security
- Enable RLS on `exchange_rates`.
- Grant SELECT to `anon, authenticated` so the public board can read the latest rate.
- Grant INSERT, UPDATE to `anon, authenticated` so the admin update panel can write.
- Allow anon + authenticated CRUD because this is a single-tenant no-auth public rate board.
3. Seed
- Insert one initial row with rate 36.50 so the board is not empty on first load.
*/

CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aed_per_1000_inr numeric(10,2) NOT NULL,
  note text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON exchange_rates TO anon, authenticated;
GRANT INSERT ON exchange_rates TO anon, authenticated;
GRANT UPDATE ON exchange_rates TO anon, authenticated;
GRANT DELETE ON exchange_rates TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_rates" ON exchange_rates;
CREATE POLICY "public_read_rates" ON exchange_rates FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_rates" ON exchange_rates;
CREATE POLICY "public_insert_rates" ON exchange_rates FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_rates" ON exchange_rates;
CREATE POLICY "public_update_rates" ON exchange_rates FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_rates" ON exchange_rates;
CREATE POLICY "public_delete_rates" ON exchange_rates FOR DELETE
TO anon, authenticated USING (true);

INSERT INTO exchange_rates (aed_per_1000_inr, note)
SELECT 36.50, 'Initial rate'
WHERE NOT EXISTS (SELECT 1 FROM exchange_rates);
