"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
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
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-5 sm:flex">
            <span className="text-sm font-medium text-ink-50">Dashboard</span>
            <Link href="/invoices/new" className="text-sm text-ink-200 transition hover:text-ink-50">
              New Invoice
            </Link>
          </nav>
        </div>
        <ConnectButton />
      </header>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink-50">Dashboard</h1>
        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brass px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brass-bright"
        >
          <Plus size={16} strokeWidth={2.5} />
          New invoice
        </Link>
      </div>

      {!isConnected ? (
        <div className="rounded-card border border-dashed border-ink-700 px-6 py-12 text-center">
          <p className="font-display text-base font-medium text-ink-200">Connect your wallet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-400">
            Connect to see the invoices you've created and their live payment status.
          </p>
        </div>
      ) : error ? (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
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

          <h2 className="mb-3 font-display text-lg font-semibold text-ink-50">Recent invoices</h2>
          {invoices === null ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-card bg-ink-800/50" />
              ))}
            </div>
          ) : (
            <InvoicesTable invoices={invoices} limit={10} />
          )}
        </>
      )}
    </main>
  );
}
