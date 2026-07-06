"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { InvoicesTable } from "@/components/InvoicesTable";
import { useMyInvoices } from "@/lib/useMyInvoices";
import { isOverdue } from "@/lib/format";

type Filter = "all" | "pending" | "paid" | "overdue";

export default function InvoicesPage() {
  const { invoices, error, isConnected } = useMyInvoices();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const list = invoices ?? [];
    return {
      all: list.length,
      pending: list.filter((i) => i.status === "pending" && !isOverdue(i.due_date, i.status)).length,
      paid: list.filter((i) => i.status === "paid").length,
      overdue: list.filter((i) => isOverdue(i.due_date, i.status)).length,
    };
  }, [invoices]);

  const filtered = useMemo(() => {
    const list = invoices ?? [];
    if (filter === "all") return list;
    if (filter === "overdue") return list.filter((i) => isOverdue(i.due_date, i.status));
    if (filter === "pending") return list.filter((i) => i.status === "pending" && !isOverdue(i.due_date, i.status));
    return list.filter((i) => i.status === filter);
  }, [invoices, filter]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <AppHeader active="invoices" />

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink-50">Invoices</h1>
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
            Connect to see every invoice you've created and their live payment status.
          </p>
        </div>
      ) : error ? (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          Couldn't load invoices: {error}
        </p>
      ) : invoices === null ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-card bg-ink-800/50" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <FilterTab label="All" count={counts.all} active={filter === "all"} onClick={() => setFilter("all")} />
            <FilterTab
              label="Pending"
              count={counts.pending}
              active={filter === "pending"}
              onClick={() => setFilter("pending")}
            />
            <FilterTab label="Paid" count={counts.paid} active={filter === "paid"} onClick={() => setFilter("paid")} />
            <FilterTab
              label="Overdue"
              count={counts.overdue}
              active={filter === "overdue"}
              onClick={() => setFilter("overdue")}
            />
          </div>

          <InvoicesTable invoices={filtered} />
        </>
      )}
    </main>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-brass text-ink-950"
          : "border border-ink-700 text-ink-200 hover:border-ink-600 hover:text-ink-50"
      }`}
    >
      {label} <span className={active ? "text-ink-950/70" : "text-ink-400"}>{count}</span>
    </button>
  );
}
