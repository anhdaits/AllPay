"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { supabase } from "@/lib/supabase";
import { Invoice } from "@/types/invoice";

interface UseMyInvoicesResult {
  invoices: Invoice[] | null; // null while loading
  error: string | null;
  isConnected: boolean;
}

export function useMyInvoices(): UseMyInvoicesResult {
  const { address, isConnected } = useAccount();
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setInvoices(null);
      setError(null);
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
        if (dbError) setError(dbError.message);
        else setInvoices(data as Invoice[]);
      });

    return () => {
      cancelled = true;
    };
  }, [address, isConnected]);

  return { invoices, error, isConnected };
}
