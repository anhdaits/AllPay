"use client";

import Link from "next/link";
import { Invoice } from "@/types/invoice";
import { StatusBadge } from "./StatusBadge";
import { formatUsdc, formatDueDate, truncateAddress } from "@/lib/format";

export function InvoicesTable({ invoices, limit }: { invoices: Invoice[]; limit?: number }) {
  const rows = limit ? invoices.slice(0, limit) : invoices;

  if (rows.length === 0) {
    return (
      <div className="rounded-[30px] border border-dashed border-[#cddbd4] bg-white/80 px-6 py-12 text-center shadow-[0_20px_70px_rgba(10,47,31,0.05)]">
        <p className="font-display text-lg font-bold text-[#0b3b2a]">No invoices yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-relaxed text-[#6d7b75]">
          Create your first invoice and it'll show up here with live status.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#dfe8e3] bg-white shadow-[0_20px_70px_rgba(10,47,31,0.06)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#dfe8e3] bg-[#f7faf8] text-xs uppercase tracking-wide text-[#7a8b84]">
              <th className="px-5 py-4 font-black">Customer</th>
              <th className="px-5 py-4 font-black">Amount</th>
              <th className="px-5 py-4 font-black">Due</th>
              <th className="px-5 py-4 font-black">Status</th>
              <th className="px-5 py-4 font-black text-right">Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-[#eef3f0] last:border-b-0 transition hover:bg-[#fbfdfa]"
              >
                <td className="px-5 py-4">
                  <p className="font-bold text-[#0b3b2a]">{invoice.customer_name}</p>
                  {invoice.recipient_wallet && (
                    <p className="mt-0.5 font-mono text-xs font-medium text-[#7a8b84]">
                      {truncateAddress(invoice.recipient_wallet)}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4 font-mono font-bold text-[#0b3b2a]">
                  {formatUsdc(invoice.amount_usdc)} <span className="text-[#7a8b84]">USDC</span>
                </td>
                <td className="px-5 py-4 font-medium text-[#60756b]">{formatDueDate(invoice.due_date)}</td>
                <td className="px-5 py-4">
                  <StatusBadge invoice={invoice} />
                </td>
                <td className="px-5 py-4 text-right">
                  {invoice.id.startsWith("demo-") ? (
                    <span className="text-xs font-black text-[#a7b4ae]">Demo</span>
                  ) : (
                    <Link
                      href={`/invoice/${invoice.id}`}
                      className="text-xs font-black text-[#0b3b2a] underline decoration-[#15e47a] decoration-2 underline-offset-4 transition hover:text-[#15a862]"
                    >
                      View →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
