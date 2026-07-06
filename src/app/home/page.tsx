import Link from "next/link";
import { Activity, ArrowRight, Coins, FileText, Link2, ShieldCheck } from "lucide-react";
import { ConnectButton } from "@/components/ConnectButton";
import { Logo } from "@/components/Logo";
import { FeatureCard } from "@/components/FeatureCard";
import { PaidStamp } from "@/components/StatusBadge";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbf8] text-[#0b3b2a]" style={{ colorScheme: "light" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,#dbe8df_1px,transparent_1.2px)] [background-size:7px_7px] opacity-40" />
      <div className="pointer-events-none fixed -left-36 top-10 h-96 w-96 rounded-full bg-[#15e47a]/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-28 top-28 h-80 w-80 rounded-full bg-brass/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-[24px] border border-[#dfe8e3] bg-white/85 px-5 py-4 shadow-[0_16px_45px_rgba(10,47,31,0.06)] backdrop-blur">
          <Logo variant="light" />
          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              href="/dashboard"
              className="hidden text-sm font-semibold text-[#6d7b75] transition hover:text-[#0b3b2a] sm:inline"
            >
              Dashboard
            </Link>
            <ConnectButton variant="light" />
          </div>
        </header>

        {/* Hero */}
        <section className="pb-16 pt-12 sm:pb-24 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e2dc] bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-brass shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#15e47a]" />
                Built on Arc · Settled in USDC
              </div>

              <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[#0b3b2a] sm:text-6xl">
                Stablecoin invoicing for the internet economy
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-[#60756b] sm:text-lg">
                Create invoices, share payment links, and get paid in USDC on Arc.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/invoices/new"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-[#15e47a] px-5 py-3 text-sm font-extrabold text-[#062416] shadow-[0_16px_32px_rgba(21,228,122,0.22)] transition hover:-translate-y-0.5 hover:bg-[#26f58b]"
                >
                  Create Invoice
                  <ArrowRight size={16} strokeWidth={2.5} className="transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#d7e2dc] bg-white px-5 py-3 text-sm font-bold text-[#0b3b2a] shadow-sm transition hover:-translate-y-0.5 hover:border-[#15e47a] hover:shadow-md"
                >
                  View Demo
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold text-[#6d7b75]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
                  <ShieldCheck size={14} className="text-[#15b96a]" /> USDC-native flow
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
                  <Activity size={14} className="text-brass" /> Live status tracking
                </span>
              </div>
            </div>

            <InvoicePreviewCard />
          </div>
        </section>

        {/* Features */}
        <section className="pb-20 sm:pb-24">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Why AllPay</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-[#0b3b2a]">
                Simple tools for fast invoice payments
              </h2>
            </div>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-[#6d7b75]">
              From invoice creation to settlement tracking, everything stays lightweight and payment-first.
            </p>
          </div>

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
      </div>

      <footer className="relative border-t border-[#dfe8e3] bg-white/70 px-4 py-6 text-center text-xs font-medium text-[#7a8b84] sm:px-6">
        AllPay runs on Arc Testnet. Built with Next.js, wagmi, and Supabase.
      </footer>
    </main>
  );
}

function InvoicePreviewCard() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="absolute -inset-4 -z-10 rounded-[36px] bg-gradient-to-br from-[#15e47a]/16 via-white to-brass/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-[30px] border border-[#dfe8e3] bg-white p-6 shadow-[0_30px_100px_rgba(10,47,31,0.12)] sm:p-7">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-[radial-gradient(circle,#dbe8df_1px,transparent_1.2px)] [background-size:7px_7px] opacity-60" />

        <div className="relative flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8aa098]">Invoice #A13F-88</p>
            <p className="mt-1 font-display text-2xl font-bold tracking-[-0.03em] text-[#0b3b2a]">Acme Corp</p>
          </div>
          <PaidStamp className="mt-1" />
        </div>

        <div className="relative my-6 h-px bg-[#d7e2dc]" />

        <div className="relative rounded-[24px] border border-[#dfe8e3] bg-[#f7faf8] p-5">
          <p className="font-mono text-4xl font-bold tracking-[-0.04em] text-[#0b3b2a]">
            2,450.00 <span className="text-base font-semibold text-[#7a8b84]">USDC</span>
          </p>
          <p className="mt-2 text-sm font-semibold text-[#6d7b75]">Settled directly on Arc Testnet</p>
        </div>

        <dl className="relative mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="font-semibold text-[#7a8b84]">Pay to</dt>
            <dd className="font-mono font-bold text-[#0b3b2a]">0x9F2c…4Ab1</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-semibold text-[#7a8b84]">Network</dt>
            <dd className="font-bold text-[#0b3b2a]">Arc Testnet</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-semibold text-[#7a8b84]">Settled</dt>
            <dd className="font-bold text-[#0b3b2a]">2 min ago</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
