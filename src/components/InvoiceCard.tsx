"use client";

import Link from "next/link";
import { Invoice } from "@/types/invoice";
import { formatUsdc, truncateAddress, formatDueDate, isOverdue } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-signal/15 text-signal",
  pending: "bg-amber/15 text-amber",
  void: "bg-ink-700 text-ink-400",
};

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const overdue = isOverdue(invoice.due_date, invoice.status);
  const statusLabel = overdue ? "overdue" : invoice.status;

  return (
    <Link
      href={`/invoice/${invoice.id}`}
      className="group block rounded-card border border-ink-700 bg-ink-800/60 p-4 transition hover:border-signal/40 hover:bg-ink-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-medium text-ink-50">
            {invoice.customer_name}
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            To {truncateAddress(invoice.recipient_wallet)} · {formatDueDate(invoice.due_date)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
            overdue ? STATUS_STYLES.pending : STATUS_STYLES[invoice.status]
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className="font-mono text-lg font-semibold text-ink-50">
          {formatUsdc(invoice.amount_usdc)}{" "}
          <span className="text-sm font-normal text-ink-400">USDC</span>
        </p>
        <span className="text-xs text-ink-400 transition group-hover:text-signal">
          View invoice →
        </span>
      </div>
    </Link>
  );
}
