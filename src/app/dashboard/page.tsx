"use client";

import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ConnectButton } from "@/components/ConnectButton";
import { SummaryCard } from "@/components/SummaryCard";
import { InvoicesTable } from "@/components/InvoicesTable";
import { useMyInvoices } from "@/lib/useMyInvoices";
import { isOverdue } from "@/lib/format";
import type { Invoice } from "@/types/invoice";

const now = new Date().toISOString();
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

/** Shown only when no wallet is connected, so the dashboard never looks
 *  empty/broken to a first-time visitor — always clearly labeled as demo. */
const DEMO_INVOICES: Invoice[] = [
  {
    id: "demo-1",
    created_at: now,
    updated_at: now,
    creator_wallet: "0xDemo00000000000000000000000000000demo1",
    creator_name: "AllPay Demo",
    creator_email: "demo@allpay.example",
    recipient_wallet: "0xDemo00000000000000000000000000000demo1",
    customer_name: "Acme Corp",
    customer_email: "billing@acme.example",
    customer_wallet: null,
    amount_usdc: 2450,
    description: "Website redesign — milestone 2",
    due_date: inDays(12),
    line_items: null,
    status: "paid",
    payer_wallet: "0xDemo0000000000000000000000000000payer1",
    tx_hash: "0xdemo0000000000000000000000000000000000000000000000000000tx01",
    paid_at: now,
  },
  {
    id: "demo-2",
    created_at: now,
    updated_at: now,
    creator_wallet: "0xDemo00000000000000000000000000000demo1",
    creator_name: "AllPay Demo",
    creator_email: "demo@allpay.example",
    recipient_wallet: "0xDemo00000000000000000000000000000demo1",
    customer_name: "Northwind Traders",
    customer_email: "ap@northwind.example",
    customer_wallet: null,
    amount_usdc: 980,
    description: "Consulting — March",
    due_date: inDays(20),
    line_items: null,
    status: "pending",
    payer_wallet: null,
    tx_hash: null,
    paid_at: null,
  },
  {
    id: "demo-3",
    created_at: now,
    updated_at: now,
    creator_wallet: "0xDemo00000000000000000000000000000demo1",
    creator_name: "AllPay Demo",
    creator_email: "demo@allpay.example",
    recipient_wallet: "0xDemo00000000000000000000000000000demo1",
    customer_name: "Blue Harbor LLC",
    customer_email: "finance@blueharbor.example",
    customer_wallet: null,
    amount_usdc: 150,
    description: "Domain + hosting renewal",
    due_date: inDays(-6),
    line_items: null,
    status: "pending",
    payer_wallet: null,
    tx_hash: null,
    paid_at: null,
  },
  {
    id: "demo-4",
    created_at: now,
    updated_at: now,
    creator_wallet: "0xDemo00000000000000000000000000000demo1",
    creator_name: "AllPay Demo",
    creator_email: "demo@allpay.example",
    recipient_wallet: "0xDemo00000000000000000000000000000demo1",
    customer_name: "Fern & Co.",
    customer_email: "hello@fernco.example",
    customer_wallet: null,
    amount_usdc: 600,
    description: "Logo + brand kit",
    due_date: inDays(30),
    line_items: null,
    status: "draft",
    payer_wallet: null,
    tx_hash: null,
    paid_at: null,
  },
];

function summarize(invoices: Invoice[]) {
  const total = invoices.length;
  const paid = invoices.filter((i) => i.status === "paid").length;
  const overdue = invoices.filter((i) => isOverdue(i.due_date, i.status)).length;
  const draft = invoices.filter((i) => i.status === "draft").length;
  const pending = total - paid - overdue - draft - invoices.filter((i) => i.status === "void").length;
  return { total, paid, pending, overdue };
}

export default function DashboardPage() {
  const { invoices, error, isConnected } = useMyInvoices();

  const showDemo = !isConnected;
  const rows = showDemo ? DEMO_INVOICES : invoices ?? [];
  const stats = summarize(rows);

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

        {error ? (
          <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            Couldn't load invoices: {error}
          </p>
        ) : (
          <>
            {showDemo && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e3d6b3] bg-[#fbf6e7] px-4 py-3 text-sm font-semibold text-[#8a6d1f]">
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={16} />
                  You're viewing demo data — connect your wallet to see your real invoices.
                </span>
              </div>
            )}

            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="Total invoices" value={stats.total} tone="neutral" />
              <SummaryCard label="Paid" value={stats.paid} tone="paid" />
              <SummaryCard label="Pending" value={stats.pending} tone="pending" />
              <SummaryCard label="Overdue" value={stats.overdue} tone="danger" />
            </div>

            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold tracking-[-0.03em] text-[#0b3b2a]">
                {showDemo ? "Demo invoices" : "Recent invoices"}
              </h2>
              <Link href="/invoices/new" className="text-sm font-bold text-[#0b3b2a] underline decoration-[#15e47a] decoration-2 underline-offset-4">
                Create invoice
              </Link>
            </div>

            {!showDemo && invoices === null ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-2xl bg-white shadow-sm" />
                ))}
              </div>
            ) : (
              <InvoicesTable invoices={rows} limit={10} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
