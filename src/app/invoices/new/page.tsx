import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ConnectButton } from "@/components/ConnectButton";
import { InvoiceForm } from "@/components/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-5 sm:flex">
            <Link href="/dashboard" className="text-sm text-ink-200 transition hover:text-ink-50">
              Dashboard
            </Link>
            <span className="text-sm font-medium text-ink-50">New Invoice</span>
          </nav>
        </div>
        <ConnectButton />
      </header>

      <section className="rounded-card border border-ink-700 bg-ink-800/40 p-5 sm:p-7">
        <h1 className="font-display text-xl font-semibold text-ink-50">New invoice</h1>
        <p className="mt-1 text-sm text-ink-400">
          Fill this in, share the link it generates, and get paid in USDC directly to your wallet
          on Arc Testnet.
        </p>
        <div className="mt-6">
          <InvoiceForm />
        </div>
      </section>
    </main>
  );
}
