import { Invoice, DisplayStatus } from "@/types/invoice";
import { getDisplayStatus, STATUS_LABELS } from "@/lib/format";

const STYLES: Record<DisplayStatus, string> = {
  draft: "bg-[#eef3f0] text-[#6d7b75]",
  paid: "bg-paid/15 text-paid",
  pending: "bg-pending/15 text-pending",
  processing: "bg-[#e3a345]/15 text-[#b97f2e]",
  expired: "bg-danger/15 text-danger",
  void: "bg-[#eef3f0] text-[#6d7b75]",
};

/** Compact pill used in tables, cards, and the public invoice page. */
export function StatusBadge({
  invoice,
  isProcessing = false,
}: {
  invoice: Pick<Invoice, "status" | "due_date">;
  isProcessing?: boolean;
}) {
  const display = getDisplayStatus(invoice, isProcessing);
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[display]}`}
    >
      {STATUS_LABELS[display]}
    </span>
  );
}

/** The rotated ink-stamp mark — reserved for the moment an invoice is actually paid. */
export function PaidStamp({ className = "" }: { className?: string }) {
  return <span className={`paid-stamp ${className}`}>Paid</span>;
}
