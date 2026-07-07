-- Run this in the Supabase SQL Editor if your `invoices` table already
-- exists. Safe to run multiple times.
--
-- Adds the customer/client's own wallet address as optional record-keeping
-- info (collected in the "Bill To" section of the Create Invoice form).
-- Note: this is informational only — it's not used to restrict who can pay
-- the invoice. Anyone with the payment link can still pay from any wallet.

alter table public.invoices
  add column if not exists customer_wallet text;
