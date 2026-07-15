-- Arc Invoice Pay — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create type invoice_status as enum ('draft', 'pending', 'paid', 'void');

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- who created it / who should pay
  creator_wallet text not null,
  creator_name text,
  creator_email text,
  recipient_wallet text not null,          -- wallet that should RECEIVE the payment
  customer_name text not null,
  customer_email text,
  customer_wallet text,

  -- invoice details
  amount_usdc numeric(20, 6) not null check (amount_usdc > 0),
  description text,
  due_date date,
  line_items jsonb,                        -- [{ name, quantity, unit_amount }], subtotal = sum(qty * unit_amount)

  -- payment status
  status invoice_status not null default 'pending',
  payer_wallet text,
  tx_hash text,
  paid_at timestamptz
);

create index if not exists invoices_creator_wallet_idx on public.invoices (creator_wallet);
create index if not exists invoices_status_idx on public.invoices (status);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute procedure public.set_updated_at();

-- Row Level Security
alter table public.invoices enable row level security;

-- MVP policies: no wallet-based auth yet, so access is intentionally open.
-- Anyone can read an invoice by id (needed for the public /invoice/[id] page)
-- and anyone can create/pay one. Before going beyond a testnet demo, tighten
-- these — e.g. require a signed message from creator_wallet on insert, and
-- only allow the `status`/`tx_hash`/`payer_wallet`/`paid_at` columns to be
-- updated by a server-side route that has verified the on-chain transaction.

create policy "invoices are readable by anyone"
  on public.invoices for select
  using (true);

create policy "anyone can create an invoice"
  on public.invoices for insert
  with check (true);

create policy "anyone can mark an invoice paid"
  on public.invoices for update
  using (true)
  with check (true);
