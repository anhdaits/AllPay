export type InvoiceStatus = "draft" | "pending" | "paid" | "void";

/**
 * Live-computed display status, layered on top of the persisted
 * InvoiceStatus. "processing" and "expired" are never stored in the
 * database — they're derived from local payment state (processing) or the
 * due date (expired) at render time. See getDisplayStatus() in lib/format.ts.
 */
export type DisplayStatus = "draft" | "pending" | "processing" | "paid" | "expired" | "void";

export interface LineItem {
  name: string;
  quantity: number;
  unit_amount: number;
}

export interface Invoice {
  id: string;
  created_at: string;
  updated_at: string;
  creator_wallet: string;
  creator_name: string | null;
  creator_email: string | null;
  recipient_wallet: string;
  customer_name: string;
  customer_email: string | null;
  customer_wallet: string | null;
  amount_usdc: string | number; // PostgREST returns numeric columns as JS numbers, not strings
  description: string | null;
  due_date: string | null;
  line_items: LineItem[] | null; // null for invoices created before this column existed
  status: InvoiceStatus;
  payer_wallet: string | null;
  tx_hash: string | null;
  paid_at: string | null;
}

export interface NewInvoiceInput {
  creator_wallet: string;
  recipient_wallet: string;
  customer_name: string;
  customer_email: string;
  customer_wallet: string;
  amount_usdc: string;
  description: string;
  due_date: string; // yyyy-mm-dd
  line_items: LineItem[];
}
