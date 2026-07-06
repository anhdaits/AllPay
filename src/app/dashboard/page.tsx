"use client";

import Link from "next/link";
import { Plus, ReceiptText } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ConnectButton } from "@/components/ConnectButton";
import { SummaryCard } from "@/components/SummaryCard";
import { InvoicesTable } from "@/components/InvoicesTable";
import { useMyInvoices } from "@/lib/useMyInvoices";
import { isOverdue } from "@/lib/format";

export default function DashboardPage() {
  const { invoices, error, isConnected } = useMyInvoices();

  const total = invoices?.length ?? 0;
  const paid = invoices?.filter((i) => i.status === "paid").length ?? 0;
  const overdue = invoices?.filter((i) => isOverdue(i.due_date, i.status)).length ?? 0;
  const pending = invoices
    ? invoices.length - paid - overdue - invoices.filter((i) => i.status === "void").length
    : 0;

  return (
    <main className="min-h-screen bg-[#f7fbf8] text-[#0b3b2a]" style={{ colorScheme: "light" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,#dbe8df_1px,transparent_1.2px)] [background-size:7px_7px] opacity-35" />
      <div className="relative mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4 rounded-[24px] border border-[#dfe8e3] bg-white/85 px-5 py-4 shadow-[0_16px_45px_rgba(10,47,31,0.06)] backdrop-blur">
          <div className="flex items-center gap-6">
            <Logo variant="light" />
            <nav className="hidden items-center gap-5 sm:flex">
              <span className="text-sm font-black text-[#0b3b2a]">Dashboard</span>
              <Link href="/invoices/new" className="text-sm font-semibold text-[#6d7b75] transition hover:text-[#0b3b2a]">
                New Invoice
              </Link>
            </nav>
          </div>
          <ConnectButton variant="light" />
        </header>

        <section className="mb-8 overflow-hidden rounded-[30px] border border-[#dfe8e3] bg-white p-6 shadow-[0_30px_100px_rgba(10,47,31,0.08)] sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brass">Invoice command center</p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] text-[#0b3b2a] sm:text-5xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#6d7b75] sm:text-base">
                Track invoice status, payment progress, and recent USDC settlement activity from one clean workspace.
              </p>
            </div>
            <Link
              href="/invoices/new"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#15e47a] px-5 py-3 text-sm font-extrabold text-[#062416] shadow-[0_16px_32px_rgba(21,228,122,0.22)] transition hover:-translate-y-0.5 hover:bg-[#26f58b]"
            >
              <Plus size={16} strokeWidth={2.5} />
              New invoice
            </Link>
          </div>
        </section>

        {!isConnected ? (
          <div className="rounded-[30px] border border-dashed border-[#cddbd4] bg-white/80 px-6 py-14 text-center shadow-[0_20px_70px_rgba(10,47,31,0.05)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brass/15 text-brass">
              <ReceiptText size={22} strokeWidth={2.25} />
            </div>
            <p className="mt-4 font-display text-xl font-bold text-[#0b3b2a]">Connect your wallet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-relaxed text-[#6d7b75]">
              Connect to see the invoices you've created and their live payment status.
            </p>
          </div>
        ) : error ? (
          <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            Couldn't load invoices: {error}
          </p>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="Total invoices" value={total} tone="neutral" />
              <SummaryCard label="Paid" value={paid} tone="paid" />
              <SummaryCard label="Pending" value={pending} tone="pending" />
              <SummaryCard label="Overdue" value={overdue} tone="danger" />
            </div>

            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold tracking-[-0.03em] text-[#0b3b2a]">Recent invoices</h2>
              <Link href="/invoices/new" className="text-sm font-bold text-[#0b3b2a] underline decoration-[#15e47a] decoration-2 underline-offset-4">
                Create invoice
              </Link>
            </div>
            {invoices === null ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-2xl bg-white shadow-sm" />
                ))}
              </div>
            ) : (
              <InvoicesTable invoices={invoices} limit={10} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
