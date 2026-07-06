import Link from "next/link";
import { FileText, Link2, Coins, Activity } from "lucide-react";
import { ConnectButton } from "@/components/ConnectButton";
import { Logo } from "@/components/Logo";
import { FeatureCard } from "@/components/FeatureCard";
import { PaidStamp } from "@/components/StatusBadge";

export default function LandingPage() {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <Logo />
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="hidden text-sm text-ink-200 transition hover:text-ink-50 sm:inline"
          >
            Dashboard
          </Link>
          <ConnectButton />
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-28 sm:pt-14">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brass">
              Built on Arc · Settled in USDC
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink-50 sm:text-5xl">
              Stablecoin invoicing for the internet economy
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-200">
              Create invoices, share payment links, and get paid in USDC on Arc.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/invoices/new"
                className="rounded-lg bg-brass px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-brass-bright"
              >
                Create Invoice
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-ink-700 px-5 py-3 text-sm font-medium text-ink-100 transition hover:border-ink-600 hover:text-ink-50"
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Signature element: a mock invoice with a real paid ink-stamp */}
          <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
            <div className="absolute -inset-3 -z-10 rounded-2xl bg-gradient-to-br from-brass/10 via-transparent to-pending/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-card border border-ink-700 bg-ink-800/70 p-6 shadow-2xl shadow-black/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-ink-400">Invoice #A13F-88</p>
                  <p className="mt-1 font-display text-lg font-semibold text-ink-50">Acme Corp</p>
                </div>
                <PaidStamp className="mt-1" />
              </div>

              <div className="my-5 h-px bg-ink-700" />

              <p className="font-mono text-3xl font-bold text-ink-50">
                2,450.00 <span className="text-base font-normal text-ink-400">USDC</span>
              </p>

              <dl className="mt-5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-ink-400">Pay to</dt>
                  <dd className="font-mono text-ink-200">0x9F2c…4Ab1</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Network</dt>
                  <dd className="text-ink-200">Arc Testnet</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Settled</dt>
                  <dd className="text-ink-200">2 min ago</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={FileText}
            title="Create invoices in seconds"
            description="Customer, amount, recipient wallet, due date — saved straight to your dashboard."
          />
          <FeatureCard
            icon={Link2}
            title="Shareable payment links"
            description="Every invoice gets a public link at /invoice/[id]. Send it anywhere."
          />
          <FeatureCard
            icon={Coins}
            title="USDC settlement on Arc"
            description="USDC is Arc's native currency, so payments settle directly — no bridging, no wrapped tokens."
          />
          <FeatureCard
            icon={Activity}
            title="Real-time status tracking"
            description="Status flips to Paid the moment a transaction confirms on-chain, with the tx hash attached."
          />
        </div>
      </section>

      <footer className="border-t border-ink-700 px-4 py-6 text-center text-xs text-ink-600 sm:px-6">
        AllPay runs on Arc Testnet. Built with Next.js, wagmi, and Supabase.
      </footer>
    </main>
  );
}
