import { Invoice, InvoiceStatus } from "@/types/invoice";
import { isOverdue } from "@/lib/format";

type Display = "paid" | "pending" | "overdue" | "void";

const STYLES: Record<Display, string> = {
  paid: "bg-paid/15 text-paid",
  pending: "bg-pending/15 text-pending",
  overdue: "bg-danger/15 text-danger",
  void: "bg-[#eef3f0] text-[#6d7b75]",
};

const LABELS: Record<Display, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  void: "Void",
};

function resolveDisplay(status: InvoiceStatus, dueDate: string | null): Display {
  if (status === "paid") return "paid";
  if (status === "void") return "void";
  if (isOverdue(dueDate, status)) return "overdue";
  return "pending";
}

/** Compact pill used in tables and cards. */
export function StatusBadge({ invoice }: { invoice: Pick<Invoice, "status" | "due_date"> }) {
  const display = resolveDisplay(invoice.status, invoice.due_date);
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[display]}`}
    >
      {LABELS[display]}
    </span>
  );
}

/** The rotated ink-stamp mark — reserved for the moment an invoice is actually paid. */
export function PaidStamp({ className = "" }: { className?: string }) {
  return <span className={`paid-stamp ${className}`}>Paid</span>;
}
