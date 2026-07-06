export type InvoiceStatus = "pending" | "paid" | "void";

export interface Invoice {
  id: string;
  created_at: string;
  updated_at: string;
  creator_wallet: string;
  recipient_wallet: string;
  customer_name: string;
  customer_email: string | null;
  customer_wallet: string | null;
  amount_usdc: string | number; // PostgREST returns numeric columns as JS numbers, not strings
  description: string | null;
  due_date: string | null;
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
}
