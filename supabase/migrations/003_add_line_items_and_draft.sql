-- Run this in the Supabase SQL Editor if your `invoices` table already
-- exists. Safe to run multiple times.

-- Sender info shown on the public invoice page (the Create Invoice form
-- already collects these under "From (You)" — they just weren't saved before).
alter table public.invoices
  add column if not exists creator_name text;

alter table public.invoices
  add column if not exists creator_email text;

-- New "draft" status, used by the Create Invoice page's "Save draft" action.
alter type invoice_status add value if not exists 'draft';

-- Line items for the invoice: [{ "name": "...", "quantity": 1, "unit_amount": 10 }, ...]
-- amount_usdc remains the authoritative total actually charged/paid — it's
-- computed client-side as sum(quantity * unit_amount) at save time.
-- Older invoices created before this migration will have line_items = null;
-- the app falls back to showing `description` as a single line item in that case.
alter table public.invoices
  add column if not exists line_items jsonb;
