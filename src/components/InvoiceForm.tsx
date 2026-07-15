"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Mail, Plus, Trash2, X } from "lucide-react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { truncateAddress } from "@/lib/format";
import type { LineItem } from "@/types/invoice";

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

function newRowId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `row_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

interface LineItemRow {
  rowId: string;
  name: string;
  quantity: string;
  unitAmount: string;
}

function blankRow(): LineItemRow {
  return { rowId: newRowId(), name: "", quantity: "1", unitAmount: "" };
}

function rowTotal(row: LineItemRow): number {
  const qty = Number(row.quantity || 0);
  const amt = Number(row.unitAmount || 0);
  if (Number.isNaN(qty) || Number.isNaN(amt)) return 0;
  return qty * amt;
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

  const [lineItems, setLineItems] = useState<LineItemRow[]>([
    { rowId: newRowId(), name: "Service", quantity: "1", unitAmount: "" },
  ]);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [note, setNote] = useState("Thank you for your business! Payment is due within 30 days.");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lineItemErrors, setLineItemErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string | null>(null);
  const [createdStatus, setCreatedStatus] = useState<"pending" | "draft">("pending");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    if (address && !recipientWallet) {
      setRecipientWallet(address);
    }
  }, [address, recipientWallet]);

  const subtotal = useMemo(() => lineItems.reduce((sum, row) => sum + rowTotal(row), 0), [lineItems]);
  // No taxes/fees modeled yet, so total currently equals subtotal — kept as a
  // separate value so a fee/discount line can be added later without
  // touching the rest of the form.
  const total = subtotal;

  function addLineItem() {
    setLineItems((rows) => [...rows, blankRow()]);
  }

  function removeLineItem(rowId: string) {
    setLineItems((rows) => (rows.length > 1 ? rows.filter((r) => r.rowId !== rowId) : rows));
  }

  function updateLineItem(rowId: string, patch: Partial<LineItemRow>) {
    setLineItems((rows) => rows.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)));
  }

  /** `isDraft` relaxes "required" checks (a draft can be incomplete) but still
   *  rejects malformed values (an invalid email/wallet is never useful to save). */
  function validate(isDraft: boolean): { errors: Record<string, string>; lineErrors: Record<string, string> } {
    const errors: Record<string, string> = {};
    const lineErrors: Record<string, string> = {};

    if (!isDraft && !dueDate.trim()) errors.dueDate = "Select a due date.";

    if (fromEmail.trim() && !EMAIL_RE.test(fromEmail.trim())) {
      errors.fromEmail = "Enter a valid email address.";
    } else if (!isDraft && !fromEmail.trim()) {
      errors.fromEmail = "Enter your email.";
    }

    if (!isDraft && !fromName.trim()) errors.fromName = "Enter your name or business name.";

    if (recipientWallet.trim() && !isAddress(recipientWallet.trim())) {
      errors.recipientWallet = "Not a valid wallet address (expected 0x… format).";
    } else if (!isDraft && !recipientWallet.trim()) {
      errors.recipientWallet = "Enter the wallet that should receive payment.";
    }

    if (!isDraft && !customerName.trim()) errors.customerName = "Enter the customer's name.";

    if (customerEmail.trim() && !EMAIL_RE.test(customerEmail.trim())) {
      errors.customerEmail = "Enter a valid email address.";
    } else if (!isDraft && !customerEmail.trim()) {
      errors.customerEmail = "Enter the customer's email.";
    }

    if (customerWallet.trim() && !isAddress(customerWallet.trim())) {
      errors.customerWallet = "Not a valid wallet address (expected 0x… format).";
    }

    lineItems.forEach((row) => {
      const qty = Number(row.quantity || 0);
      const amt = Number(row.unitAmount || 0);

      if (!isDraft && !row.name.trim()) {
        lineErrors[`${row.rowId}:name`] = "Enter an item name.";
      }
      if (row.quantity.trim() && (Number.isNaN(qty) || qty <= 0)) {
        lineErrors[`${row.rowId}:quantity`] = "Must be greater than 0.";
      } else if (!isDraft && !row.quantity.trim()) {
        lineErrors[`${row.rowId}:quantity`] = "Required.";
      }
      if (row.unitAmount.trim()) {
        if (Number.isNaN(amt) || amt <= 0) {
          lineErrors[`${row.rowId}:amount`] = "Must be greater than 0.";
        } else if (!/^\d+(\.\d{1,6})?$/.test(row.unitAmount.trim())) {
          lineErrors[`${row.rowId}:amount`] = "Up to 6 decimals.";
        }
      } else if (!isDraft) {
        lineErrors[`${row.rowId}:amount`] = "Required.";
      }
    });

    if (!isDraft && lineItems.length === 0) {
      errors.lineItems = "Add at least one line item.";
    }

    return { errors, lineErrors };
  }

  async function saveInvoice(status: "pending" | "draft") {
    setFormError(null);

    if (!isConnected || !address) {
      setFormError("Connect your wallet first — invoices are linked to the creator's address.");
      return;
    }

    if (!isSupabaseConfigured) {
      console.error("[InvoiceForm] Blocked submit: Supabase is not configured (missing/placeholder env vars).");
      setFormError(
        "This app isn't fully configured yet — the database connection is missing. " +
          "(Site owner: check NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.)"
      );
      return;
    }

    const isDraft = status === "draft";
    const { errors, lineErrors } = validate(isDraft);
    setFieldErrors(errors);
    setLineItemErrors(lineErrors);
    if (Object.keys(errors).length > 0 || Object.keys(lineErrors).length > 0) return;

    const setBusy = isDraft ? setSavingDraft : setSubmitting;
    setBusy(true);
    try {
      const payloadLineItems: LineItem[] = lineItems
        .filter((row) => row.name.trim() || row.unitAmount.trim())
        .map((row) => ({
          name: row.name.trim() || "Untitled item",
          quantity: Number(row.quantity || 0) || 0,
          unit_amount: Number(row.unitAmount || 0) || 0,
        }));

      const { data, error: dbError } = await supabase
        .from("invoices")
        .insert({
          creator_wallet: address,
          creator_name: fromName.trim() || null,
          creator_email: fromEmail.trim() || null,
          recipient_wallet: recipientWallet.trim(),
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_wallet: customerWallet.trim() || null,
          amount_usdc: Number(total.toFixed(6)) || 0,
          description: note.trim() || null,
          due_date: dueDate || null,
          line_items: payloadLineItems.length > 0 ? payloadLineItems : null,
          status,
        })
        .select("id")
        .single();

      if (dbError || !data) {
        console.error("[InvoiceForm] Supabase insert error:", dbError);
        setFormError(dbError?.message ?? "Could not save the invoice. Try again.");
        return;
      }

      setCreatedStatus(status);
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
      setBusy(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    saveInvoice("pending");
  }

  function resetForm() {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerWallet("");
    setLineItems([{ rowId: newRowId(), name: "Service", quantity: "1", unitAmount: "" }]);
    setDueDate(defaultDueDate());
    setNote("Thank you for your business! Payment is due within 30 days.");
    setFieldErrors({});
    setLineItemErrors({});
    setFormError(null);
    setCreatedInvoiceId(null);
  }

  if (createdInvoiceId) {
    return (
      <InvoiceCreatedPanel
        invoiceId={createdInvoiceId}
        status={createdStatus}
        customerEmail={customerEmail}
        onCreateAnother={resetForm}
      />
    );
  }

  const previewProps = {
    invoiceId: "[invoice_id]",
    fromName,
    fromEmail,
    fromWallet: recipientWallet || address || "0x0000…0000",
    fromPhone,
    customerName,
    customerEmail,
    customerWallet,
    lineItems: lineItems.map((r) => ({
      name: r.name,
      quantity: Number(r.quantity || 0) || 0,
      unit_amount: Number(r.unitAmount || 0) || 0,
    })),
    subtotal,
    total,
    dueDate,
    note,
  };

  return (
    <>
      <div className="grid overflow-hidden rounded-[30px] border border-[#dfe8e3] bg-white shadow-[0_30px_100px_rgba(10,47,31,0.08)] lg:grid-cols-[1fr_0.72fr]">
        <InvoicePreview {...previewProps} />

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

            <section className="border-t border-[#d7e2dc] pt-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-[-0.03em] text-[#0b3b2a]">Line Items</h2>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d7e2dc] px-3 py-1.5 text-xs font-bold text-[#0b3b2a] transition hover:border-[#15e47a] hover:text-[#0b8b4d]"
                >
                  <Plus size={14} strokeWidth={2.75} />
                  Add item
                </button>
              </div>

              {fieldErrors.lineItems && (
                <p className="mb-4 text-xs font-semibold text-red-600">{fieldErrors.lineItems}</p>
              )}

              <div className="space-y-5">
                {lineItems.map((row, idx) => (
                  <div key={row.rowId} className="rounded-2xl border border-[#e4ece7] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <Field label={`Item ${idx + 1}`} required error={lineItemErrors[`${row.rowId}:name`]}>
                          <input
                            value={row.name}
                            onChange={(e) => updateLineItem(row.rowId, { name: e.target.value })}
                            placeholder="Service"
                            className="invoice-input"
                          />
                        </Field>
                      </div>
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(row.rowId)}
                          aria-label={`Remove item ${idx + 1}`}
                          className="mt-8 shrink-0 rounded-lg p-2 text-[#8fa19a] transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Quantity" required error={lineItemErrors[`${row.rowId}:quantity`]}>
                        <input
                          value={row.quantity}
                          onChange={(e) => updateLineItem(row.rowId, { quantity: e.target.value })}
                          inputMode="decimal"
                          className="invoice-input"
                        />
                      </Field>
                      <Field label="Amount / unit" required error={lineItemErrors[`${row.rowId}:amount`]}>
                        <input
                          value={row.unitAmount}
                          onChange={(e) => updateLineItem(row.rowId, { unitAmount: e.target.value })}
                          inputMode="decimal"
                          placeholder="250.00"
                          className="invoice-input font-mono"
                        />
                      </Field>
                    </div>
                    <p className="mt-3 text-right text-sm font-bold text-[#0b3b2a]">
                      {formatMoney(rowTotal(row))} USDC
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-1.5 border-t border-[#e4ece7] pt-4 text-sm">
                <div className="flex justify-between text-[#6d7b75]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0b3b2a]">{formatMoney(subtotal)} USDC</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#0b3b2a]">
                  <span>Total</span>
                  <span>{formatMoney(total)} USDC</span>
                </div>
              </div>
            </section>

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

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="rounded-2xl border border-[#d7e2dc] px-5 py-4 text-sm font-bold text-[#0b3b2a] transition hover:border-[#15e47a]"
              >
                Preview invoice
              </button>
              <button
                type="button"
                onClick={() => saveInvoice("draft")}
                disabled={savingDraft || submitting}
                className="rounded-2xl border border-[#d7e2dc] px-5 py-4 text-sm font-bold text-[#0b3b2a] transition hover:border-[#15e47a] disabled:opacity-50"
              >
                {savingDraft ? "Saving draft…" : "Save draft"}
              </button>
              <button
                type="submit"
                disabled={submitting || savingDraft}
                className="flex-1 rounded-2xl bg-[#15e47a] px-5 py-4 text-base font-extrabold text-[#062416] shadow-[0_16px_32px_rgba(21,228,122,0.25)] transition hover:-translate-y-0.5 hover:bg-[#26f58b] disabled:translate-y-0 disabled:opacity-50"
              >
                {submitting ? "Creating invoice…" : `Create invoice · ${formatMoney(total)} USDC`}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10 sm:p-8"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-[30px] border border-[#dfe8e3] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              aria-label="Close preview"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-[#0b3b2a] shadow-md transition hover:bg-white"
            >
              <X size={18} />
            </button>
            <InvoicePreview {...previewProps} />
          </div>
        </div>
      )}
    </>
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
  lineItems,
  subtotal,
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
  lineItems: LineItem[];
  subtotal: number;
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

          {(lineItems.length > 0 ? lineItems : [{ name: "", quantity: 1, unit_amount: 0 }]).map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_0.6fr_0.7fr_0.7fr] border-b border-[#eef3ef] py-4 text-sm font-semibold sm:text-base">
              <span>{item.name || "Service"}</span>
              <span className="text-right">{item.quantity || 1}</span>
              <span className="text-right">{formatMoney(item.unit_amount)} USDC</span>
              <span className="text-right">{formatMoney(item.quantity * item.unit_amount)} USDC</span>
            </div>
          ))}

          <div className="mt-3 space-y-1.5">
            <div className="grid grid-cols-[1fr_0.7fr] text-sm font-semibold text-[#606962]">
              <span className="text-right">Subtotal:</span>
              <span className="text-right">{formatMoney(subtotal)} USDC</span>
            </div>
            <div className="grid grid-cols-[1fr_0.7fr] text-base font-black">
              <span className="text-right">Total:</span>
              <span className="text-right">{formatMoney(total)} USDC</span>
            </div>
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
  status,
  customerEmail,
  onCreateAnother,
}: {
  invoiceId: string;
  status: "pending" | "draft";
  customerEmail: string;
  onCreateAnother: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const path = `/invoice/${invoiceId}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : `${appUrl}${path}`;

  const emailHref = `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(
    "Your AllPay invoice"
  )}&body=${encodeURIComponent(`Hi,\n\nHere's your payment link:\n${fullUrl}\n\nThanks!`)}`;

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
      <p className="text-3xl font-black tracking-[-0.04em]">
        {status === "draft" ? "Draft saved" : "Invoice created"}
      </p>
      <p className="mt-2 text-sm font-medium text-[#6d7b75]">
        {status === "draft"
          ? "This invoice is saved but not sent yet. You can find it from your dashboard and finish it later."
          : "Share this payment link with your customer:"}
      </p>

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
        {customerEmail && (
          <a
            href={emailHref}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#d7e2dc] px-5 py-3 text-sm font-bold transition hover:border-[#15e47a]"
          >
            <Mail size={16} />
            Send by email
          </a>
        )}
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

      {customerEmail === "" && (
        <p className="mt-4 text-xs text-[#8a988f]">
          Add a customer email next time to enable the "Send by email" shortcut.
        </p>
      )}
    </div>
  );
}
