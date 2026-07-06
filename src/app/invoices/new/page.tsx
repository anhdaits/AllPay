import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ConnectButton } from "@/components/ConnectButton";
import { InvoiceForm } from "@/components/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-[#0b3b2a]" style={{ colorScheme: "light" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,#dbe8df_1px,transparent_1.2px)] [background-size:7px_7px] opacity-50" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-4 rounded-[24px] border border-[#dfe8e3] bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-6">
            <Logo variant="light" />
            <nav className="hidden items-center gap-5 sm:flex">
              <Link href="/dashboard" className="text-sm font-semibold text-[#6d7b75] transition hover:text-[#0b3b2a]">
                Dashboard
              </Link>
              <span className="text-sm font-black text-[#0b3b2a]">Create Invoice</span>
            </nav>
          </div>
          <ConnectButton variant="light" />
        </header>

        <InvoiceForm />
      </div>
    </main>
  );
}
