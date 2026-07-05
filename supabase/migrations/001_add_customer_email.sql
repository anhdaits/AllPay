-- Run this in the Supabase SQL Editor if your `invoices` table already
-- exists (i.e. you ran the original schema.sql before customer_email was
-- added). Safe to run multiple times.

alter table public.invoices
  add column if not exists customer_email text;
