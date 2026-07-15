"use client";

import { useEffect, useState } from "react";
import { useAccount, useSendTransaction, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, isAddress } from "viem";
import { arcTestnet } from "@/lib/chain";
import { supabase } from "@/lib/supabase";
import { Invoice } from "@/types/invoice";
import { getDisplayStatus } from "@/lib/format";
import { PaidStamp } from "./StatusBadge";

function friendlyError(error: { message?: string; shortMessage?: string } | null): string | null {
  if (!error) return null;
  const raw = error.shortMessage ?? error.message ?? "";
  if (/user rejected/i.test(raw)) return "You rejected the transaction in your wallet.";
  if (/insufficient funds/i.test(raw)) return "Not enough USDC in your wallet to cover this payment (plus gas).";
  return raw || "Something went wrong sending the transaction.";
}

export function PayInvoiceButton({
  invoice,
  onBusyChange,
}: {
  invoice: Invoice;
  /** Fires whenever a payment is in flight, so the parent can show "Processing" on the main status badge. */
  onBusyChange?: (busy: boolean) => void;
}) {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [markError, setMarkError] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);

  const {
    sendTransaction,
    data: hash,
    isPending: isSending,
    error: sendError,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId: arcTestnet.id,
  });

  const busy = isSending || isConfirming;

  useEffect(() => {
    onBusyChange?.(busy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy]);

  // Once the transaction confirms on-chain, record it against the invoice.
  useEffect(() => {
    if (!isConfirmed || !hash || !address) return;

    let cancelled = false;
    setMarking(true);
    setMarkError(null);

    supabase
      .from("invoices")
      .update({
        status: "paid",
        payer_wallet: address,
        tx_hash: hash,
        paid_at: new Date().toISOString(),
      })
      .eq("id", invoice.id)
      .then(({ error }) => {
        if (cancelled) return;
        setMarking(false);
        if (error) setMarkError(error.message);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, hash]);

  if (invoice.status === "paid") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-paid/30 bg-paid/10 p-4">
        <div className="text-sm text-paid">
          This invoice has been paid.
          {invoice.tx_hash && <ExplorerLink hash={invoice.tx_hash} />}
        </div>
        <PaidStamp />
      </div>
    );
  }

  if (isConfirmed && hash) {
    return (
      <div className="rounded-2xl border border-paid/30 bg-paid/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-paid">Payment confirmed{marking ? " — saving receipt…" : "."}</p>
          <PaidStamp />
        </div>
        <ExplorerLink hash={hash} />
        {markError && (
          <p className="mt-2 text-xs text-[#b97f2e]">
            Payment succeeded on-chain, but saving the receipt failed: {markError}. The tx hash
            above is your proof of payment regardless.
          </p>
        )}
      </div>
    );
  }

  const displayStatus = getDisplayStatus(invoice, false);
  if (displayStatus === "draft") {
    return (
      <p className="rounded-2xl border border-dashed border-[#d7e2dc] p-4 text-center text-sm text-[#6d7b75]">
        This invoice is still a draft and isn't ready to be paid yet.
      </p>
    );
  }
  if (displayStatus === "expired") {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-center text-sm text-danger">
        This invoice's due date has passed. Contact the sender for an updated invoice before paying.
      </div>
    );
  }

  if (!isConnected) {
    return (
      <p className="rounded-2xl border border-dashed border-[#d7e2dc] p-4 text-center text-sm text-[#6d7b75]">
        Connect your wallet above to pay this invoice.
      </p>
    );
  }

  const wrongNetwork = chainId !== arcTestnet.id;
  if (wrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: arcTestnet.id })}
        disabled={isSwitching}
        className="w-full rounded-2xl bg-[#15e47a] py-4 text-base font-extrabold text-[#062416] shadow-[0_16px_32px_rgba(21,228,122,0.25)] transition hover:-translate-y-0.5 hover:bg-[#26f58b] disabled:translate-y-0 disabled:opacity-50"
      >
        {isSwitching ? "Switching…" : "Switch to Arc Testnet to pay"}
      </button>
    );
  }

  if (!isAddress(invoice.recipient_wallet)) {
    return (
      <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
        This invoice has an invalid recipient address and can't be paid.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() =>
          sendTransaction({
            to: invoice.recipient_wallet as `0x${string}`,
            // Arc's native currency is USDC with 6 decimals, so parse the
            // amount the same way you would an ERC-20 USDC amount.
            value: parseUnits(String(invoice.amount_usdc), arcTestnet.nativeCurrency.decimals),
          })
        }
        disabled={busy}
        className="w-full rounded-2xl bg-[#15e47a] py-4 text-base font-extrabold text-[#062416] shadow-[0_16px_32px_rgba(21,228,122,0.25)] transition hover:-translate-y-0.5 hover:bg-[#26f58b] disabled:translate-y-0 disabled:opacity-50"
      >
        {isSending
          ? "Confirm in wallet…"
          : isConfirming
          ? "Waiting for confirmation…"
          : `Pay with USDC · ${invoice.amount_usdc} USDC`}
      </button>
      {sendError && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {friendlyError(sendError)}
        </p>
      )}
      <p className="text-center text-xs text-[#8a988f]">
        Arc Testnet only — this is not real USDC or mainnet value.
      </p>
    </div>
  );
}

function ExplorerLink({ hash }: { hash: string }) {
  const explorerUrl = process.env.NEXT_PUBLIC_ARC_EXPLORER_URL;
  if (!explorerUrl) {
    return <p className="mt-1 font-mono text-xs text-[#6d7b75] break-all">{hash}</p>;
  }
  return (
    <a
      href={`${explorerUrl}/tx/${hash}`}
      target="_blank"
      rel="noreferrer"
      className="mt-1 block font-mono text-xs text-[#0b8b4d] underline decoration-[#0b8b4d]/40 underline-offset-2 break-all"
    >
      View transaction on Arc Explorer ↗
    </a>
  );
}
