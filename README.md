# AllPay — Arc Invoice Pay

Stablecoin invoicing and USDC payment links on Arc. Create an invoice, share a
payment link, and get paid directly in USDC — no bridging, no wrapped tokens,
no banking UX.

Built with Next.js (App Router), TypeScript, Tailwind CSS, wagmi/viem, and
Supabase.

- **Live repo:** https://github.com/anhdaits/AllPay
- **X:** https://x.com/labs5000
- **Telegram:** https://t.me/TheGemHunt/
- **LinkedIn:** https://www.linkedin.com/in/daitranvan0501/

## Pages

| Route | What's there |
|---|---|
| `/` | Public marketing/landing page |
| `/home` | The app's main landing view (hero, feature grid) once "inside" the product |
| `/dashboard` | Summary stats (total/paid/pending/overdue) + recent invoices table |
| `/invoices/new` | Create-invoice form with a live invoice preview |
| `/invoice/[id]` | Public payment page — anyone with the link can connect a wallet and pay, no account needed |

### Important: USDC is Arc's native gas token

Arc Testnet uses USDC as its native currency (6 decimals), not an ERC-20 token.
Paying an invoice is a plain native transfer (`sendTransaction` with a
`value`), not a `transfer()` call on a contract — see
`src/components/PayInvoiceButton.tsx` and `src/lib/chain.ts`.

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql`.
3. If you're updating an existing project instead of starting fresh, also run
   any files in `supabase/migrations/` in order.
4. Grab your **Project URL** and **Publishable key** from
   Project Settings → API Keys.

### 3. Environment variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local` (see the [Environment variables](#environment-variables)
section below for what each one does). **Never commit `.env.local`** — it's
already in `.gitignore`.

### 4. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

All variables are documented with comments in `.env.example`. Summary:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL used for Open Graph/social preview metadata and as a fallback for building invoice payment links. Local: `http://localhost:3000`. Production: your real Vercel URL (or custom domain). |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase's public/publishable key (safe for the browser — **not** the secret key). |
| `NEXT_PUBLIC_ARC_CHAIN_ID` | Yes | Arc Testnet chain ID (`5042002`). |
| `NEXT_PUBLIC_ARC_RPC_URL` | Yes | Arc Testnet RPC endpoint. |
| `NEXT_PUBLIC_ARC_EXPLORER_URL` | No | Enables "view transaction on explorer" links. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | No | Only needed if you add the WalletConnect connector in `src/lib/wagmi.ts`. |

Every variable here is prefixed `NEXT_PUBLIC_` and is safe to expose in the
browser bundle by design — none of them are secrets. There is currently no
server-only/secret environment variable in this project.

## Deploying to Vercel

No `vercel.json` is needed — this is a standard Next.js App Router project,
and Vercel auto-detects the framework, build command, and routing (including
dynamic routes like `/invoice/[id]`) with zero config.

1. Push this repo to GitHub (see below if you haven't already).
2. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
3. Vercel auto-fills the framework preset (Next.js) and build command
   (`next build`) — you don't need to change these.
4. Add the environment variables from the table above under
   **Project Settings → Environment Variables** (do this for all three
   environments: Production, Preview, and Development, or at minimum
   Production). Set `NEXT_PUBLIC_APP_URL` to your Vercel URL, e.g.
   `https://your-project.vercel.app` (you can update this after the first
   deploy once you know the assigned domain, then redeploy).
5. Click **Deploy**.

### Pushing to GitHub for the first time

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/anhdaits/AllPay.git
git push -u origin main
```

## Design system

- **Palette**: light/off-white background (`#f7fbf8`), dark green primary
  text (`#0b3b2a`), a single bright green accent (`#15e47a`) for actions, plus
  functional status colors (`paid`/`pending`/`danger`) reserved for invoice
  status pills only.
- **Type**: Fraunces (headings), Inter (UI text), IBM Plex Mono (amounts,
  wallet addresses, tx hashes).
- **Signature element**: `PaidStamp` in `src/components/StatusBadge.tsx` — a
  rotated ink-stamp mark using a real CSS `double` border. Only appears when
  an invoice is actually paid.

## Project structure

```
src/
  app/
    layout.tsx              Root layout, fonts, metadata, Providers
    opengraph-image.tsx      Dynamic OG/social preview image
    page.tsx                 Public landing page ("/")
    home/page.tsx             App landing view ("/home")
    dashboard/page.tsx        Stats + recent invoices table
    invoices/new/page.tsx     Create-invoice page
    invoice/[id]/
      page.tsx                Server wrapper for the dynamic route
      InvoiceView.tsx          Public payment page (client)
    providers.tsx             wagmi + react-query providers
    globals.css
  components/
    Logo.tsx, ConnectButton.tsx, InvoiceForm.tsx, PayInvoiceButton.tsx,
    InvoicesTable.tsx, SummaryCard.tsx, StatusBadge.tsx, FeatureCard.tsx
  lib/
    supabase.ts, chain.ts, wagmi.ts, format.ts, useMyInvoices.ts
  types/
    invoice.ts
supabase/
  schema.sql                 Base schema — run this for a fresh Supabase project
  migrations/                Incremental migrations for existing projects
```

## Security notes before this goes beyond a demo

Supabase RLS policies are intentionally open right now (anyone can insert or
update any invoice) since there's no wallet-based auth yet. Before using this
for real invoices:

- Require a signed message (SIWE-style) from `creator_wallet` to authorize
  invoice creation/edits.
- Don't trust the client to mark an invoice `paid` — verify the transaction
  on-chain server-side (a Route Handler or Supabase Edge Function) before
  writing `status = 'paid'`.
- Rate-limit invoice creation to prevent spam.
