"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Invoice } from "@/types/invoice";
import { Logo } from "@/components/Logo";
import { ConnectButton } from "@/components/ConnectButton";
import { PayInvoiceButton } from "@/components/PayInvoiceButton";
import { StatusBadge } from "@/components/StatusBadge";
import { formatUsdc, truncateAddress, formatDueDate, getLineItems, lineItemsSubtotal } from "@/lib/format";

export function InvoiceView({ id }: { id: string }) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPaymentInFlight, setIsPaymentInFlight] = useState(false);

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
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf8] px-4 text-center" style={{ colorScheme: "light" }}>
        <div>
          <p className="font-sans text-lg font-black text-[#0b3b2a]">Couldn't load invoice</p>
          <p className="mt-2 text-sm text-[#6d7b75]">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl border border-[#d7e2dc] px-4 py-2 text-sm font-semibold text-[#0b3b2a] transition hover:border-[#15e47a]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (invoice === undefined) {
    return (
      <main className="min-h-screen bg-[#f7fbf8] px-4 py-10 sm:py-16" style={{ colorScheme: "light" }}>
        <div className="mx-auto max-w-lg animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-[#e4ece7]" />
            <div className="h-8 w-28 rounded-full bg-[#e4ece7]" />
          </div>
          <div className="rounded-[30px] border border-[#dfe8e3] bg-white p-6 sm:p-8">
            <div className="h-4 w-24 rounded bg-[#e4ece7]" />
            <div className="mt-3 h-6 w-40 rounded bg-[#e4ece7]" />
            <div className="my-6 h-px bg-[#e4ece7]" />
            <div className="h-10 w-48 rounded bg-[#e4ece7]" />
            <div className="mt-8 h-12 w-full rounded-xl bg-[#e4ece7]" />
          </div>
        </div>
      </main>
    );
  }

  if (invoice === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbf8] px-4 text-center" style={{ colorScheme: "light" }}>
        <div>
          <p className="font-sans text-lg font-black text-[#0b3b2a]">Invoice not found</p>
          <p className="mt-2 text-sm text-[#6d7b75]">This invoice doesn't exist, or the link is incorrect.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-sm font-semibold text-[#0b8b4d] underline underline-offset-2">
            Back to AllPay
          </Link>
        </div>
      </main>
    );
  }

  const lineItems = getLineItems(invoice);
  const subtotal = lineItemsSubtotal(lineItems);
  const recipientQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
    invoice.recipient_wallet
  )}`;

  return (
    <main className="min-h-screen bg-[#f7fbf8] pb-16" style={{ colorScheme: "light" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,#dbe8df_1px,transparent_1.2px)] [background-size:7px_7px] opacity-50" />

      <div className="relative mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-4 rounded-[24px] border border-[#dfe8e3] bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <Logo variant="light" />
          <ConnectButton variant="light" />
        </header>

        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#e3d6b3] bg-[#fbf6e7] px-4 py-3 text-xs font-semibold text-[#8a6d1f]">
          <ShieldCheck size={16} className="shrink-0" />
          Arc Testnet prototype — this invoice settles in testnet USDC, not real funds.
        </div>

        <div className="overflow-hidden rounded-[30px] border border-[#dfe8e3] bg-white shadow-[0_30px_100px_rgba(10,47,31,0.08)]">
          <div className="p-6 text-[#0b3b2a] sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#8a988f]">Invoice</p>
                <p className="mt-1 font-mono text-sm font-semibold text-[#6d7b75]">{invoice.id}</p>
              </div>
              <StatusBadge invoice={invoice} isProcessing={isPaymentInFlight} />
            </div>

            <div className="my-6 h-px bg-[#e4ece7]" />

            <div className="grid gap-6 sm:grid-cols-2">
              <InfoBlock title="From">
                <p className="font-bold">{invoice.creator_name || "AllPay sender"}</p>
                {invoice.creator_email && <p>{invoice.creator_email}</p>}
                <p className="break-all font-mono text-xs text-[#6d7b75]">{truncateAddress(invoice.creator_wallet, 6)}</p>
              </InfoBlock>
              <InfoBlock title="To">
                <p className="font-bold">{invoice.customer_name}</p>
                {invoice.customer_email && <p>{invoice.customer_email}</p>}
                {invoice.customer_wallet && (
                  <p className="break-all font-mono text-xs text-[#6d7b75]">{truncateAddress(invoice.customer_wallet, 6)}</p>
                )}
              </InfoBlock>
            </div>

            <div className="mt-6">
              <InfoBlock title="Due date">
                <p className="font-bold">{formatDueDate(invoice.due_date)}</p>
              </InfoBlock>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-[1fr_0.5fr_0.6fr_0.6fr] border-b border-[#e4ece7] pb-2 text-xs font-bold uppercase tracking-wide text-[#8a988f]">
                <span>Item</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Total</span>
              </div>
              {lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_0.5fr_0.6fr_0.6fr] border-b border-[#f2f6f3] py-3 text-sm">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-right">{item.quantity}</span>
                  <span className="text-right">{formatUsdc(item.unit_amount)}</span>
                  <span className="text-right font-semibold">{formatUsdc(item.quantity * item.unit_amount)}</span>
                </div>
              ))}
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between text-[#6d7b75]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0b3b2a]">{formatUsdc(subtotal)} USDC</span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#0b3b2a]">
                  <span>Total due</span>
                  <span>{formatUsdc(invoice.amount_usdc)} USDC</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-[#e4ece7] bg-[#fbfdfa] p-4 text-sm sm:grid-cols-2">
              <Row label="Recipient wallet" value={truncateAddress(invoice.recipient_wallet, 6)} mono />
              <Row label="Network" value="Arc Testnet" />
            </div>

            {invoice.description && (
              <div className="mt-6">
                <InfoBlock title="Note">
                  <p className="whitespace-pre-wrap text-[#0b3b2a]">{invoice.description}</p>
                </InfoBlock>
              </div>
            )}

            <div className="mt-8">
              <PayInvoiceButton invoice={invoice} onBusyChange={setIsPaymentInFlight} />
            </div>
          </div>

          <WalletFallback address={invoice.recipient_wallet} qrUrl={recipientQrUrl} />
        </div>

        <TrustNote />
      </div>
    </main>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[#8a988f]">{title}</p>
      <div className="space-y-0.5 text-sm text-[#3d4a44]">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[#6d7b75]">{label}</dt>
      <dd className={`text-right text-[#0b3b2a] ${mono ? "font-mono text-xs" : "text-sm font-semibold"}`}>{value}</dd>
    </div>
  );
}

function WalletFallback({ address, qrUrl }: { address: string; qrUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail in insecure contexts — address is still visible to copy manually.
    }
  }

  return (
    <details className="border-t border-[#e4ece7] px-6 py-5 text-sm text-[#3d4a44] sm:px-8">
      <summary className="cursor-pointer select-none font-bold text-[#0b3b2a]">
        Can't use the button? Pay manually
      </summary>
      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt="QR code for the recipient wallet address"
          width={112}
          height={112}
          className="rounded-xl border border-[#e4ece7]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[#6d7b75]">
            Scan or copy this address, then send exactly {" "}
            <span className="font-semibold text-[#0b3b2a]">the total due in USDC</span> on Arc Testnet.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg border border-[#e4ece7] bg-[#fbfdfa] px-3 py-2 font-mono text-xs">
              {address}
            </code>
            <button
              onClick={copyAddress}
              type="button"
              className="shrink-0 rounded-lg border border-[#e4ece7] p-2 text-[#0b3b2a] transition hover:border-[#15e47a]"
              aria-label="Copy wallet address"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
    </details>
  );
}

function TrustNote() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 text-center text-[11px] font-semibold text-[#6d7b75] sm:grid-cols-4">
      <span className="rounded-full border border-[#e4ece7] bg-white px-2 py-1.5">Built on Arc Testnet</span>
      <span className="rounded-full border border-[#e4ece7] bg-white px-2 py-1.5">Non-custodial</span>
      <span className="rounded-full border border-[#e4ece7] bg-white px-2 py-1.5">No private keys stored</span>
      <span className="rounded-full border border-[#e4ece7] bg-white px-2 py-1.5">Open-source prototype</span>
    </div>
  );
}
