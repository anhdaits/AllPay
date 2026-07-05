# AllPay

Create USDC invoices and get paid on Arc Testnet. Next.js App Router + TypeScript +
Tailwind, wagmi/viem for wallet + chain interaction, Supabase for storage.

## How it works

1. **Connect wallet** — top-right button on the home page, using an injected wallet
   (e.g. MetaMask) via wagmi.
2. **Create an invoice** — customer name, USDC amount, recipient wallet, due date,
   description. Saved straight to Supabase.
3. **Share the link** — every invoice gets a public page at `/invoice/[id]`.
4. **Payer connects + pays** — the payer opens the link, connects their wallet,
   switches to Arc Testnet if needed, and pays.
5. **Paid** — once the transaction confirms, the app writes the tx hash back to
   Supabase and flips the invoice to `paid`.

### Important: USDC is Arc's native gas token

Arc Testnet uses USDC as its native currency (6 decimals), not an ERC-20 token.
So "paying an invoice" here is a plain native transfer — `sendTransaction` with a
`value` — not a `transfer()` call on a contract. That's why there's no ABI or
token address anywhere in this codebase. If that's ever wrong for your specific
deployment (e.g. Arc actually wants an ERC-20 USDC transfer instead), swap
`PayInvoiceButton.tsx` to use `useWriteContract` with the USDC contract address
and standard ERC-20 ABI instead of `useSendTransaction`.

## Project structure

```
src/
  app/
    layout.tsx              Root layout, fonts, Providers
    page.tsx                Dashboard: create invoice + your invoice list
    providers.tsx            wagmi + react-query providers
    globals.css
    invoice/[id]/
      page.tsx               Server wrapper for the dynamic route
      InvoiceView.tsx         Public payment page (client)
  components/
    ConnectButton.tsx
    InvoiceForm.tsx
    InvoiceCard.tsx
    InvoiceList.tsx
    PayInvoiceButton.tsx
  lib/
    supabase.ts               Supabase browser client
    chain.ts                  Arc Testnet chain definition
    wagmi.ts                  wagmi config
    format.ts                 formatting helpers
  types/
    invoice.ts
supabase/
  schema.sql                  Table + RLS policies
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the Supabase project & table

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql`.
3. Go to Project Settings → API Keys and grab the **Project URL** and
   **Publishable key** (`sb_publishable_...`).

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_EXPLORER_URL=            # optional, enables "view on explorer" links
```

Double check the chain id, RPC URL, and explorer URL against Arc's current docs —
testnets get redeployed/renumbered more often than mainnets.

### 4. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Security notes before this goes beyond a demo

The MVP's Supabase RLS policies are intentionally open (anyone can insert or
update any invoice) since there's no wallet-based auth yet. Before using this
for real invoices:

- Require a signed message (SIWE-style) from `creator_wallet` to authorize
  invoice creation/edits.
- Don't trust the client to mark an invoice `paid`. Instead, have a server
  route (e.g. a Next.js Route Handler or Supabase Edge Function) verify the
  transaction on-chain via the RPC — check `to`, `value`, and that it's mined —
  before writing `status = 'paid'`.
- Rate-limit invoice creation to prevent spam.

## Extending

- **Multiple wallets per team**: add an `organizations`/`members` table and
  scope invoices to an org instead of a single `creator_wallet`.
- **Email notifications**: trigger a Supabase Edge Function on invoice
  creation/payment to email the customer.
- **ERC-20 USDC instead of native**: swap `PayInvoiceButton.tsx`'s
  `useSendTransaction` call for `useWriteContract` against the USDC contract
  address with the standard ERC-20 ABI, and use `useReadContract` to show the
  payer's token balance.
- **WalletConnect / mobile wallets**: add the `walletConnect` connector in
  `src/lib/wagmi.ts` (needs a project id from [cloud.walletconnect.com](https://cloud.walletconnect.com)).
