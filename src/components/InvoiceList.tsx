"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { supabase } from "@/lib/supabase";
import { Invoice } from "@/types/invoice";
import { InvoiceCard } from "./InvoiceCard";

export function InvoiceList() {
  const { address, isConnected } = useAccount();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setInvoices(null);
      return;
    }

    let cancelled = false;
    setInvoices(null);
    setError(null);

    supabase
      .from("invoices")
      .select("*")
      .eq("creator_wallet", address)
      .order("created_at", { ascending: false })
      .then(({ data, error: dbError }) => {
        if (cancelled) return;
        if (dbError) {
          setError(dbError.message);
        } else {
          setInvoices(data as Invoice[]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <EmptyState
        title="Connect your wallet"
        body="Connect to see the invoices you've created and their payment status."
      />
    );
  }

  if (error) {
    return (
      <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
        Couldn't load invoices: {error}
      </p>
    );
  }

  if (invoices === null) {
    return <p className="text-sm text-ink-400">Loading invoices…</p>;
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices yet"
        body="Create your first invoice above — you'll get a shareable payment link instantly."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-card border border-dashed border-ink-700 px-6 py-10 text-center">
      <p className="font-display text-sm font-medium text-ink-200">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-400">{body}</p>
    </div>
  );
}
