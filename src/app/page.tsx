import { ConnectButton } from "@/components/ConnectButton";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceList } from "@/components/InvoiceList";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <header className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-signal">
            Arc Testnet
          </p>
          <h1 className="font-display text-2xl font-bold text-ink-50 sm:text-3xl">
            AllPay
          </h1>
        </div>
        <ConnectButton />
      </header>

      <section className="rounded-card border border-ink-700 bg-ink-800/40 p-5 sm:p-7">
        <h2 className="font-display text-lg font-semibold text-ink-50">New invoice</h2>
        <p className="mt-1 text-sm text-ink-400">
          Fill this in, share the link it generates, and get paid in USDC directly to your
          wallet on Arc Testnet.
        </p>
        <div className="mt-6">
          <InvoiceForm />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink-50">Your invoices</h2>
        <InvoiceList />
      </section>
    </main>
  );
}
