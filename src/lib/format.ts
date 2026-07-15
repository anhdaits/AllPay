import type { DisplayStatus, Invoice, LineItem } from "@/types/invoice";

export function formatUsdc(amount: string | number): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}

export function formatDueDate(due: string | null): string {
  if (!due) return "No due date";
  const d = new Date(due + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(due: string | null, status: string): boolean {
  if (!due || status !== "pending") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(due + "T00:00:00") < today;
}

/**
 * Line items to render, with a fallback for invoices saved before the
 * line_items column existed (or created via a flow that didn't set it) —
 * those show their single `description` + `amount_usdc` as one line item
 * instead of an empty table.
 */
export function getLineItems(invoice: Pick<Invoice, "line_items" | "description" | "amount_usdc">): LineItem[] {
  if (invoice.line_items && invoice.line_items.length > 0) return invoice.line_items;
  return [
    {
      name: invoice.description?.trim() || "Invoice total",
      quantity: 1,
      unit_amount: Number(invoice.amount_usdc),
    },
  ];
}

export function lineItemTotal(item: LineItem): number {
  return item.quantity * item.unit_amount;
}

export function lineItemsSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineItemTotal(item), 0);
}

/**
 * The status actually shown in the UI. "processing" and "expired" are never
 * stored — "processing" reflects a payment currently in flight (passed in
 * from the component that knows about the pending transaction), and
 * "expired" is computed from the due date the same way isOverdue() always
 * worked, just exposed as a first-class status instead of an overdue flag.
 */
export function getDisplayStatus(
  invoice: Pick<Invoice, "status" | "due_date">,
  isProcessing = false
): DisplayStatus {
  if (invoice.status === "paid") return "paid";
  if (invoice.status === "void") return "void";
  if (isProcessing) return "processing";
  if (invoice.status === "pending" && isOverdue(invoice.due_date, invoice.status)) return "expired";
  return invoice.status; // "draft" | "pending"
}

export const STATUS_LABELS: Record<DisplayStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  expired: "Expired",
  void: "Void",
};
