"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { truncateAddress } from "@/lib/format";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return toInputDate(date);
}

function formatLongDate(value: string) {
  if (!value) return "Select due date";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function InvoiceForm() {
  const { address, isConnected } = useAccount();

  const [fromName, setFromName] = useState("AllPay Builder");
  const [fromEmail, setFromEmail] = useState("");
  const [recipientWallet, setRecipientWallet] = useState("");
  const [fromPhone, setFromPhone] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWallet, setCustomerWallet] = useState("");

  const [itemName, setItemName] = useState("Service");
  const [quantity, setQuantity] = useState("1");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [note, setNote] = useState("Thank you for your business! Payment is due within 30 days.");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (address && !recipientWallet) {
      setRecipientWallet(address);
    }
  }, [address, recipientWallet]);

  const quantityNumber = Number(quantity || 0);
  const unitAmountNumber = Number(amount || 0);
  const totalAmount = useMemo(() => {
    if (Number.isNaN(quantityNumber) || Number.isNaN(unitAmountNumber)) return 0;
    return quantityNumber * unitAmountNumber;
  }, [quantityNumber, unitAmountNumber]);

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!dueDate.trim()) errors.dueDate = "Select a due date.";

    if (!fromEmail.trim()) {
      errors.fromEmail = "Enter your email.";
    } else if (!EMAIL_RE.test(fromEmail.trim())) {
      errors.fromEmail = "Enter a valid email address.";
    }

    if (!fromName.trim()) errors.fromName = "Enter your name or business name.";

    if (!recipientWallet.trim()) {
      errors.recipientWallet = "Enter the wallet that should receive payment.";
    } else if (!isAddress(recipientWallet.trim())) {
      errors.recipientWallet = "Not a valid wallet address (expected 0x… format).";
    }

    if (!customerName.trim()) errors.customerName = "Enter the customer's name.";

    if (!customerEmail.trim()) {
      errors.customerEmail = "Enter the customer's email.";
    } else if (!EMAIL_RE.test(customerEmail.trim())) {
      errors.customerEmail = "Enter a valid email address.";
    }

    if (customerWallet.trim() && !isAddress(customerWallet.trim())) {
      errors.customerWallet = "Not a valid wallet address (expected 0x… format).";
    }

    if (!itemName.trim()) errors.itemName = "Enter an item name.";

    if (!quantity.trim()) {
      errors.quantity = "Enter a quantity.";
    } else if (Number.isNaN(quantityNumber) || quantityNumber <= 0) {
      errors.quantity = "Quantity must be greater than 0.";
    }

    if (!amount.trim()) {
      errors.amount = "Enter an amount.";
    } else if (Number.isNaN(unitAmountNumber) || unitAmountNumber <= 0) {
      errors.amount = "Amount must be greater than 0.";
    } else if (!/^\d+(\.\d{1,6})?$/.test(amount.trim())) {
      errors.amount = "Use up to 6 decimal places for USDC.";
    }

    return errors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!isConnected || !address) {
      setFormError("Connect your wallet first — invoices are linked to the creator's address.");
      return;
    }

    if (!isSupabaseConfigured) {
      console.error(
        "[InvoiceForm] Blocked submit: Supabase is not configured (missing/placeholder env vars)."
      );
      setFormError(
        "This app isn't fully configured yet — the database connection is missing. " +
          "(Site owner: check NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.)"
      );
      return;
    }

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const { data, error: dbError } = await supabase
        .from("invoices")
        .insert({
          creator_wallet: address,
          recipient_wallet: recipientWallet.trim(),
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_wallet: customerWallet.trim() || null,
          amount_usdc: Number(totalAmount.toFixed(6)),
          description: [itemName.trim(), note.trim()].filter(Boolean).join(" — ") || null,
          due_date: dueDate || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (dbError || !data) {
        console.error("[InvoiceForm] Supabase insert error:", dbError);
        setFormError(dbError?.message ?? "Could not save the invoice. Try again.");
        return;
      }

      setCreatedInvoiceId(data.id);
    } catch (err) {
      // A thrown (not returned) error here means the request never got a
      // response at all — bad Supabase URL, no network, CORS, DNS failure,
      // etc. Without this catch, it surfaces as an unhandled
      // "TypeError: Failed to fetch" instead of a usable message.
      console.error("[InvoiceForm] Network error creating invoice:", err);
      setFormError(
        "Couldn't reach the database. Check your internet connection and try again. " +
          "If this keeps happening, the site's Supabase configuration may be broken."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerWallet("");
    setItemName("Service");
    setQuantity("1");
    setAmount("");
    setDueDate(defaultDueDate());
    setNote("Thank you for your business! Payment is due within 30 days.");
    setFieldErrors({});
    setFormError(null);
    setCreatedInvoiceId(null);
  }

  if (createdInvoiceId) {
    return <InvoiceCreatedPanel invoiceId={createdInvoiceId} onCreateAnother={resetForm} />;
  }

  return (
    <div className="grid min-h-[720px] overflow-hidden rounded-[30px] border border-[#dfe8e3] bg-white shadow-[0_30px_100px_rgba(10,47,31,0.08)] lg:grid-cols-[1fr_0.72fr]">
      <InvoicePreview
        invoiceId="[invoice_id]"
        fromName={fromName}
        fromEmail={fromEmail}
        fromWallet={recipientWallet || address || "0x0000…0000"}
        fromPhone={fromPhone}
        customerName={customerName}
        customerEmail={customerEmail}
        customerWallet={customerWallet}
        itemName={itemName}
        quantity={quantityNumber || 0}
        amount={unitAmountNumber || 0}
        total={totalAmount}
        dueDate={dueDate}
        note={note}
      />

      <form onSubmit={handleSubmit} noValidate className="relative border-t border-[#dfe8e3] bg-white p-6 sm:p-8 lg:border-l lg:border-t-0 xl:p-10">
        <h1 className="font-sans text-4xl font-black tracking-[-0.04em] text-[#0b3b2a] sm:text-5xl">
          Create Invoice
        </h1>
        <div className="mt-8 h-px bg-[#d7e2dc]" />

        <div className="mt-8 space-y-7">
          <Field label="Due Date" required error={fieldErrors.dueDate}>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="invoice-input pr-11"
              />
              <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8fa19a]" />
            </div>
          </Field>

          <Section title="From (You)">
            <Field label="Email" required error={fieldErrors.fromEmail}>
              <input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="you@company.com"
                className="invoice-input"
              />
            </Field>
            <Field label="Name" required error={fieldErrors.fromName}>
              <input
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your name or company"
                className="invoice-input"
              />
            </Field>
            <Field label="Payment wallet" error={fieldErrors.recipientWallet}>
              <input
                value={recipientWallet}
                onChange={(e) => setRecipientWallet(e.target.value)}
                placeholder="0x1234…"
                spellCheck={false}
                className="invoice-input font-mono"
              />
            </Field>
            <Field label="Phone" optional>
              <input
                value={fromPhone}
                onChange={(e) => setFromPhone(e.target.value)}
                placeholder="Optional"
                className="invoice-input"
              />
            </Field>
          </Section>

          <Section title="Bill To">
            <Field label="Customer name" required error={fieldErrors.customerName}>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Acme Corp"
                className="invoice-input"
              />
            </Field>
            <Field label="Customer email" required error={fieldErrors.customerEmail}>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="billing@acme.com"
                className="invoice-input"
              />
            </Field>
            <Field label="Customer wallet" optional error={fieldErrors.customerWallet}>
              <input
                value={customerWallet}
                onChange={(e) => setCustomerWallet(e.target.value)}
                placeholder="0xabcd…"
                spellCheck={false}
                className="invoice-input font-mono"
              />
            </Field>
          </Section>

          <Section title="Line Item">
            <Field label="Item" required error={fieldErrors.itemName}>
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Service"
                className="invoice-input"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Quantity" required error={fieldErrors.quantity}>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  inputMode="decimal"
                  className="invoice-input"
                />
              </Field>
              <Field label="Amount / unit" required error={fieldErrors.amount}>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder="250.00"
                  className="invoice-input font-mono"
                />
              </Field>
            </div>
          </Section>

          <Field label="Note" optional>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="invoice-input resize-none"
            />
          </Field>

          {formError && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#15e47a] px-5 py-4 text-base font-extrabold text-[#062416] shadow-[0_16px_32px_rgba(21,228,122,0.25)] transition hover:-translate-y-0.5 hover:bg-[#26f58b] disabled:translate-y-0 disabled:opacity-50"
          >
            {submitting ? "Creating invoice…" : `Create invoice · ${formatMoney(totalAmount)} USDC`}
          </button>
        </div>
      </form>
    </div>
  );
}

function InvoicePreview({
  invoiceId,
  fromName,
  fromEmail,
  fromWallet,
  fromPhone,
  customerName,
  customerEmail,
  customerWallet,
  itemName,
  quantity,
  amount,
  total,
  dueDate,
  note,
}: {
  invoiceId: string;
  fromName: string;
  fromEmail: string;
  fromWallet: string;
  fromPhone: string;
  customerName: string;
  customerEmail: string;
  customerWallet: string;
  itemName: string;
  quantity: number;
  amount: number;
  total: number;
  dueDate: string;
  note: string;
}) {
  const today = formatLongDate(toInputDate(new Date()));
  const shortWallet = fromWallet.startsWith("0x") ? truncateAddress(fromWallet, 6) : fromWallet;

  return (
    <aside className="relative min-h-[720px] bg-[#fbfdfa] p-6 text-[#0b3b2a] sm:p-8 lg:p-10 xl:p-12">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-[radial-gradient(circle,#dbe8df_1px,transparent_1.2px)] [background-size:7px_7px] opacity-70 lg:block" />

      <div className="relative z-10 flex min-h-full flex-col">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-[-0.05em] text-[#0b3b2a]">INVOICE</h2>
            <p className="mt-1 text-sm font-semibold text-[#66756f]">{invoiceId}</p>
            <p className="mt-7 text-base font-semibold">{today}</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="relative inline-flex h-16 w-16 items-center justify-center">
              <span className="absolute left-0 top-0 h-5 w-5 border-l-[7px] border-t-[7px] border-[#15e47a]" />
              <span className="absolute bottom-0 right-0 h-5 w-5 border-b-[7px] border-r-[7px] border-[#15e47a]" />
            </span>
            <span className="text-3xl font-black tracking-[-0.06em] text-black">AllPay</span>
          </div>
        </div>

        <div className="mt-20 grid gap-12 sm:grid-cols-2">
          <PreviewBlock title="From:">
            <p className="font-extrabold">{fromEmail || "you@company.com"}</p>
            <p className="break-all font-semibold">{shortWallet || "0x0000…0000"}</p>
            <p>{fromName || "Your company"}</p>
            {fromPhone && <p>{fromPhone}</p>}
          </PreviewBlock>

          <PreviewBlock title="To:">
            <p className="font-extrabold">{customerName || "Customer name"}</p>
            <p>{customerEmail || "customer@email.com"}</p>
            {customerWallet && <p className="break-all font-semibold">{truncateAddress(customerWallet, 6)}</p>}
          </PreviewBlock>
        </div>

        <div className="mt-12">
          <PreviewBlock title="Due Date:">
            <p className="font-extrabold">{formatLongDate(dueDate)}</p>
          </PreviewBlock>
        </div>

        <div className="mt-20 overflow-hidden">
          <div className="grid grid-cols-[1fr_0.6fr_0.7fr_0.7fr] border-b border-[#d7e2dc] pb-3 text-sm font-extrabold text-[#606962] sm:text-base">
            <span>Item</span>
            <span className="text-right">Quantity</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Total</span>
          </div>

          <div className="grid grid-cols-[1fr_0.6fr_0.7fr_0.7fr] py-8 text-sm font-semibold sm:text-base">
            <span>{itemName || "Service"}</span>
            <span className="text-right">{quantity || 1}</span>
            <span className="text-right">{formatMoney(amount)} USDC</span>
            <span className="text-right">{formatMoney(total)} USDC</span>
          </div>

          <div className="grid grid-cols-[1fr_0.7fr] pt-2 text-base font-black">
            <span className="text-right">Total:</span>
            <span className="text-right">{formatMoney(total)} USDC</span>
          </div>
        </div>

        <div className="mt-auto pt-16">
          <PreviewBlock title="Note:">
            <p>{note || "Thank you for your business!"}</p>
          </PreviewBlock>
        </div>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#d7e2dc] pt-7">
      <h2 className="mb-5 text-xl font-black tracking-[-0.03em] text-[#0b3b2a]">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  required,
  optional,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#7a8b84]">
        {label} {required && <span className="text-[#ff5d5d]">*</span>}
        {optional && <span className="text-[#a7b4ae]"> optional</span>}
      </span>
      {children}
      {error && <span className="mt-2 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}

function PreviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-bold text-[#626b66]">{title}</p>
      <div className="space-y-1 leading-relaxed">{children}</div>
    </div>
  );
}

function InvoiceCreatedPanel({
  invoiceId,
  onCreateAnother,
}: {
  invoiceId: string;
  onCreateAnother: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const path = `/invoice/${invoiceId}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : `${appUrl}${path}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail in insecure contexts. The link remains visible below.
    }
  }

  return (
    <div className="rounded-[30px] border border-[#dfe8e3] bg-white p-6 text-[#0b3b2a] shadow-[0_30px_100px_rgba(10,47,31,0.08)] sm:p-8">
      <p className="text-3xl font-black tracking-[-0.04em]">Invoice created</p>
      <p className="mt-2 text-sm font-medium text-[#6d7b75]">Share this payment link with your customer:</p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <code className="flex-1 truncate rounded-2xl border border-[#d7e2dc] bg-[#f7faf8] px-4 py-3 font-mono text-sm text-[#0b3b2a]">
          {fullUrl}
        </code>
        <button
          onClick={copyLink}
          type="button"
          className="shrink-0 rounded-2xl border border-[#d7e2dc] px-5 py-3 text-sm font-bold transition hover:border-[#15e47a]"
        >
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={path}
          className="rounded-2xl bg-[#15e47a] px-5 py-3 text-sm font-extrabold text-[#062416] transition hover:bg-[#26f58b]"
        >
          Open invoice →
        </Link>
        <Link
          href="/dashboard"
          className="rounded-2xl border border-[#d7e2dc] px-5 py-3 text-sm font-bold transition hover:border-[#15e47a]"
        >
          Back to dashboard
        </Link>
        <button
          onClick={onCreateAnother}
          type="button"
          className="rounded-2xl border border-[#d7e2dc] px-5 py-3 text-sm font-bold transition hover:border-[#15e47a]"
        >
          Create another
        </button>
      </div>
    </div>
  );
}
