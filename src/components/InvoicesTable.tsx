"use client";

import Link from "next/link";
import { Invoice } from "@/types/invoice";
import { StatusBadge } from "./StatusBadge";
import { formatUsdc, formatDueDate, truncateAddress } from "@/lib/format";

export function InvoicesTable({ invoices, limit }: { invoices: Invoice[]; limit?: number }) {
  const rows = limit ? invoices.slice(0, limit) : invoices;

  if (rows.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-ink-700 px-6 py-10 text-center">
        <p className="font-display text-sm font-medium text-ink-200">No invoices yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink-400">
          Create your first invoice and it'll show up here with live status.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-ink-700">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-700 bg-ink-800/60 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-ink-700 last:border-b-0 transition hover:bg-ink-800/40"
              >
                <td className="px-4 py-3">
                  <p className="text-ink-50">{invoice.customer_name}</p>
                  {invoice.recipient_wallet && (
                    <p className="font-mono text-xs text-ink-400">
                      {truncateAddress(invoice.recipient_wallet)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-ink-100">
                  {formatUsdc(invoice.amount_usdc)} <span className="text-ink-400">USDC</span>
                </td>
                <td className="px-4 py-3 text-ink-200">{formatDueDate(invoice.due_date)}</td>
                <td className="px-4 py-3">
                  <StatusBadge invoice={invoice} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/invoice/${invoice.id}`}
                    className="text-xs font-medium text-brass hover:text-brass-bright"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
