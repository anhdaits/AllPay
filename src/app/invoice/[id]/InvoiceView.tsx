"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Invoice } from "@/types/invoice";
import { ConnectButton } from "@/components/ConnectButton";
import { PayInvoiceButton } from "@/components/PayInvoiceButton";
import { formatUsdc, truncateAddress, formatDueDate, isOverdue } from "@/lib/format";

export function InvoiceView({ id }: { id: string }) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();
      if (cancelled) return;
      if (error) {
        setFetchError(error.message);
        return;
      }
      setFetchError(null);
      setInvoice(data as Invoice | null);
    }
    load();

    // Poll for status updates in case another tab / device pays this invoice.
    const interval = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id]);

  if (fetchError && invoice === undefined) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="font-display text-lg font-semibold text-ink-50">Couldn't load invoice</p>
        <p className="mt-2 text-sm text-ink-400">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg border border-ink-700 px-4 py-2 text-sm text-ink-100 transition hover:border-signal/50"
        >
          Try again
        </button>
      </main>
    );
  }

  if (invoice === undefined) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10 sm:py-16">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-ink-700" />
            <div className="h-8 w-28 rounded-full bg-ink-700" />
          </div>
          <div className="rounded-card border border-ink-700 bg-ink-800/40 p-6 sm:p-8">
            <div className="h-4 w-24 rounded bg-ink-700" />
            <div className="mt-3 h-6 w-40 rounded bg-ink-700" />
            <div className="my-6 h-px bg-ink-700" />
            <div className="h-10 w-48 rounded bg-ink-700" />
            <div className="mt-8 h-12 w-full rounded-lg bg-ink-700" />
          </div>
        </div>
      </main>
    );
  }

  if (invoice === null) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="font-display text-lg font-semibold text-ink-50">Invoice not found</p>
        <p className="mt-2 text-sm text-ink-400">
          This invoice doesn't exist, or the link is incorrect.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-signal underline underline-offset-2">
          Back to AllPay
        </Link>
      </main>
    );
  }

  const overdue = isOverdue(invoice.due_date, invoice.status);

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <header className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="text-xs font-medium uppercase tracking-widest text-signal">
          AllPay
        </Link>
        <ConnectButton />
      </header>

      <div className="rounded-card border border-ink-700 bg-ink-800/40 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400">Invoice to</p>
            <p className="font-display text-xl font-semibold text-ink-50">
              {invoice.customer_name}
            </p>
          </div>
          <StatusBadge status={invoice.status} overdue={overdue} />
        </div>

        <div className="my-6 h-px bg-ink-700" />

        <p className="font-mono text-4xl font-bold text-ink-50">
          {formatUsdc(invoice.amount_usdc)}
          <span className="ml-2 text-lg font-normal text-ink-400">USDC</span>
        </p>

        <dl className="mt-6 space-y-3 text-sm">
          <Row label="Pay to" value={truncateAddress(invoice.recipient_wallet, 6)} mono />
          {invoice.customer_email && <Row label="Customer email" value={invoice.customer_email} />}
          <Row label="Due" value={formatDueDate(invoice.due_date)} />
          {invoice.description && <Row label="Description" value={invoice.description} />}
          {invoice.tx_hash && <Row label="Tx hash" value={truncateAddress(invoice.tx_hash, 6)} mono />}
        </dl>

        <div className="mt-8">
          <PayInvoiceButton invoice={invoice} />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink-600">
        Invoice ID: <span className="font-mono">{invoice.id}</span>
      </p>
    </main>
  );
}

function StatusBadge({ status, overdue }: { status: string; overdue: boolean }) {
  const label = overdue ? "Overdue" : status[0].toUpperCase() + status.slice(1);
  const styles =
    status === "paid"
      ? "bg-signal/15 text-signal"
      : overdue
      ? "bg-danger/15 text-danger"
      : "bg-amber/15 text-amber";
  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-ink-400">{label}</dt>
      <dd className={`text-right text-ink-100 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
