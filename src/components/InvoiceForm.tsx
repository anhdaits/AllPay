"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { supabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InvoiceForm() {
  const { address, isConnected } = useAccount();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientWallet, setRecipientWallet] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string | null>(null);

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!customerName.trim()) errors.customerName = "Enter the customer's name.";

    if (!customerEmail.trim()) {
      errors.customerEmail = "Enter the customer's email.";
    } else if (!EMAIL_RE.test(customerEmail.trim())) {
      errors.customerEmail = "Enter a valid email address.";
    }

    const amountNumber = Number(amount);
    if (!amount.trim()) {
      errors.amount = "Enter an amount.";
    } else if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      errors.amount = "Amount must be a number greater than 0.";
    } else if (!/^\d+(\.\d{1,6})?$/.test(amount.trim())) {
      errors.amount = "Use up to 6 decimal places (USDC's precision).";
    }

    if (!recipientWallet.trim()) {
      errors.recipientWallet = "Enter the recipient's wallet address.";
    } else if (!isAddress(recipientWallet.trim())) {
      errors.recipientWallet = "Not a valid wallet address (expected 0x… format).";
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

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const { data, error: dbError } = await supabase
      .from("invoices")
      .insert({
        creator_wallet: address,
        recipient_wallet: recipientWallet.trim(),
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        amount_usdc: Number(amount),
        description: description.trim() || null,
        due_date: dueDate || null,
        status: "pending",
      })
      .select("id")
      .single();
    setSubmitting(false);

    if (dbError || !data) {
      setFormError(dbError?.message ?? "Could not save the invoice. Try again.");
      return;
    }

    setCreatedInvoiceId(data.id);
  }

  function resetForm() {
    setCustomerName("");
    setCustomerEmail("");
    setAmount("");
    setRecipientWallet("");
    setDueDate("");
    setDescription("");
    setFieldErrors({});
    setFormError(null);
    setCreatedInvoiceId(null);
  }

  if (createdInvoiceId) {
    return <InvoiceCreatedPanel invoiceId={createdInvoiceId} onCreateAnother={resetForm} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Customer name" error={fieldErrors.customerName}>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Acme Corp"
            className="input"
          />
        </Field>

        <Field label="Customer email" error={fieldErrors.customerEmail}>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="billing@acme.com"
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Amount (USDC)" error={fieldErrors.amount}>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="250.00"
            className="input font-mono"
          />
        </Field>

        <Field label="Due date" optional>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field
        label="Recipient wallet"
        hint="The address that should receive payment on Arc Testnet"
        error={fieldErrors.recipientWallet}
      >
        <input
          value={recipientWallet}
          onChange={(e) => setRecipientWallet(e.target.value)}
          placeholder="0x1234…"
          spellCheck={false}
          className="input font-mono"
        />
      </Field>

      <Field label="Your wallet (creator)">
        <input
          value={address ?? "Connect wallet to fill in"}
          disabled
          className="input font-mono opacity-60"
        />
      </Field>

      <Field label="Description" optional>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Website redesign — milestone 2"
          rows={3}
          className="input resize-none"
        />
      </Field>

      {formError && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-signal py-3 text-sm font-semibold text-ink-950 transition hover:bg-signal-bright disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {submitting ? "Creating invoice…" : "Create invoice & get link"}
      </button>
    </form>
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
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (e.g. insecure context) — link is still selectable/clickable.
    }
  }

  return (
    <div className="rounded-card border border-signal/30 bg-signal/10 p-5 sm:p-6">
      <p className="font-display text-base font-semibold text-ink-50">Invoice created</p>
      <p className="mt-1 text-sm text-ink-200">
        Share this payment link with your customer:
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <code className="flex-1 truncate rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 font-mono text-sm text-ink-100">
          {fullUrl}
        </code>
        <button
          onClick={copyLink}
          type="button"
          className="shrink-0 rounded-lg border border-ink-700 px-4 py-2.5 text-sm font-medium text-ink-100 transition hover:border-signal/50 hover:text-signal"
        >
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={path}
          className="rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-signal-bright"
        >
          Open invoice →
        </Link>
        <button
          onClick={onCreateAnother}
          type="button"
          className="rounded-lg border border-ink-700 px-4 py-2.5 text-sm text-ink-200 transition hover:border-ink-600"
        >
          Create another
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-xs font-medium uppercase tracking-wide text-ink-400">
        {label}
        {optional && <span className="normal-case text-ink-600">(optional)</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-danger">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>
      )}
    </label>
  );
}
